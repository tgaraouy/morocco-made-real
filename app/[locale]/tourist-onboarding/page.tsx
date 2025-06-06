'use client';

import React, { useState, useEffect } from 'react';
import { useTranslationsWithFallback } from '@/lib/translation-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, QrCode, Smartphone, RefreshCw, CheckCircle2, Clock, AlertCircle, ExternalLink, PlayCircle, TestTube, Heart, X, ArrowRight } from 'lucide-react';
import { QRCode } from '@/components/ui/qr-code';
import { touristProfileService, TouristProfile } from '@/lib/tourist-profile-service';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { touristProfileService as tps } from '@/lib/tourist-profile-service';
import { TouristProfile as TP } from '@/types/tourist-profile';

export default function TouristOnboardingPage() {
  const router = useRouter();
  const t = useTranslationsWithFallback('onboarding');
  const tTourism = useTranslationsWithFallback('tourist_onboarding');
  
  // Get mock experiences with translations
  const getMockExperiences = () => [
    {
      id: 'pottery',
      title: t('experiences.traditional_pottery_workshop.title'),
      artisan: t('experiences.traditional_pottery_workshop.artisan'),
      location: t('experiences.traditional_pottery_workshop.location'),
      description: t('experiences.traditional_pottery_workshop.description'),
      features: Array.isArray(t('experiences.traditional_pottery_workshop.features')) 
        ? t('experiences.traditional_pottery_workshop.features') 
        : ['English-speaking', 'All materials included', 'Take home creation'],
      mood: 'creative',
      time: 'half-day',
      budget: 'moderate',
      image: '/api/placeholder/400/300',
      matchScore: 92,
      price: 350,
      duration: '3 hours'
    },
    {
      id: 'weaving',
      title: t('experiences.berber_carpet_weaving.title'),
      artisan: t('experiences.berber_carpet_weaving.artisan'),
      location: t('experiences.berber_carpet_weaving.location'),
      description: t('experiences.berber_carpet_weaving.description'),
      features: Array.isArray(t('experiences.berber_carpet_weaving.features'))
        ? t('experiences.berber_carpet_weaving.features')
        : ['Mountain views', 'Traditional lunch', 'Cultural stories'],
      mood: 'cultural',
      time: 'full-day',
      budget: 'premium',
      image: '/api/placeholder/400/300',
      matchScore: 88,
      price: 420,
      duration: '6 hours'
    },
    {
      id: 'leather',
      title: t('experiences.leather_crafting_masterclass.title'),
      artisan: t('experiences.leather_crafting_masterclass.artisan'),
      location: t('experiences.leather_crafting_masterclass.location'),
      description: t('experiences.leather_crafting_masterclass.description'),
      features: Array.isArray(t('experiences.leather_crafting_masterclass.features'))
        ? t('experiences.leather_crafting_masterclass.features')
        : ['Souk tour included', 'Premium leather', 'Custom design'],
      mood: 'creative',
      time: 'half-day',
      budget: 'premium',
      image: '/api/placeholder/400/300',
      matchScore: 85,
      price: 380,
      duration: '4 hours'
    }
  ];

  // Enhanced artisan matching data with detailed profiles
  const getMockArtisanMatches = () => [
    {
      id: 'match-1',
      name: 'Hassan Al-Drawi',
      craft: 'Blue Pottery Master',
      location: 'Draa Valley',
      rating: 4.9,
      experience_years: 25,
      compatibility_score: 96,
      match_type: 'top',
      summary: 'Master potter specializing in traditional blue glazing techniques passed down through 5 generations.',
      specialties: ['Traditional wheel throwing', 'Blue glazing', 'Cultural storytelling'],
      available_experiences: [
        { name: 'Pottery Workshop', duration: '3 hours', price: 350 },
        { name: 'Cultural Tea & Stories', duration: '1 hour', price: 120 }
      ],
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200', '/api/placeholder/300/200'],
      video_summary: {
        duration: '60s',
        thumbnail: '/api/placeholder/400/225',
        description: 'Watch Hassan demonstrate the ancient art of blue pottery making'
      },
      preservation_story: 'Documented as part of our Cultural Preservation Engine - preserving 500-year-old family traditions',
      next_available: '2024-01-20',
      languages: ['Arabic', 'French', 'Basic English']
    },
    {
      id: 'match-2', 
      name: 'Aicha Tazi',
      craft: 'Berber Carpet Weaver',
      location: 'Atlas Mountains',
      rating: 4.8,
      experience_years: 18,
      compatibility_score: 92,
      match_type: 'top',
      summary: 'Expert weaver creating traditional Berber carpets with patterns that tell stories of mountain life.',
      specialties: ['Traditional loom weaving', 'Natural dye preparation', 'Pattern storytelling'],
      available_experiences: [
        { name: 'Weaving Workshop', duration: '4 hours', price: 420 },
        { name: 'Dye Garden Tour', duration: '2 hours', price: 200 }
      ],
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200', '/api/placeholder/300/200'],
      video_summary: {
        duration: '60s',
        thumbnail: '/api/placeholder/400/225',
        description: 'Experience the meditative art of Berber carpet weaving'
      },
      preservation_story: 'Featured in our heritage documentation - keeping mountain traditions alive',
      next_available: '2024-01-18',
      languages: ['Berber', 'Arabic', 'French']
    },
    {
      id: 'match-3',
      name: 'Omar Benali', 
      craft: 'Silver Jewelry Artisan',
      location: 'Souss Valley',
      rating: 4.7,
      experience_years: 12,
      compatibility_score: 88,
      match_type: 'top',
      summary: 'Young master preserving the ancient art of Amazigh silver jewelry with contemporary flair.',
      specialties: ['Traditional filigree', 'Stone setting', 'Cultural symbolism'],
      available_experiences: [
        { name: 'Jewelry Making Class', duration: '3 hours', price: 380 },
        { name: 'Silver Museum Tour', duration: '1.5 hours', price: 150 }
      ],
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200', '/api/placeholder/300/200'],
      video_summary: {
        duration: '60s',
        thumbnail: '/api/placeholder/400/225',
        description: 'Discover the intricate world of Amazigh silver craftsmanship'
      },
      preservation_story: 'Critical preservation case - helping maintain endangered craft techniques',
      next_available: '2024-01-22',
      languages: ['Arabic', 'Berber', 'French', 'English']
    },
    {
      id: 'match-4',
      name: 'Fatima El-Mansouri',
      craft: 'Leather Artisan',
      location: 'Marrakech Medina',
      rating: 4.6,
      experience_years: 15,
      compatibility_score: 84,
      match_type: 'related',
      summary: 'Traditional leather worker specializing in babouches and handbags with modern designs.',
      specialties: ['Traditional tanning', 'Hand stitching', 'Color techniques'],
      available_experiences: [
        { name: 'Leather Workshop', duration: '2.5 hours', price: 280 },
        { name: 'Souk Walking Tour', duration: '2 hours', price: 180 }
      ],
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
      video_summary: {
        duration: '60s',
        thumbnail: '/api/placeholder/400/225',
        description: 'Step into the aromatic world of traditional leather making'
      },
      preservation_story: 'Part of our Marrakech Heritage Project documenting souk traditions',
      next_available: '2024-01-19',
      languages: ['Arabic', 'French', 'English']
    },
    {
      id: 'match-5',
      name: 'Ahmed Bentaleb',
      craft: 'Wood Carver',
      location: 'Fez Medina', 
      rating: 4.5,
      experience_years: 20,
      compatibility_score: 81,
      match_type: 'related',
      summary: 'Master wood carver creating intricate geometric patterns for traditional architecture.',
      specialties: ['Geometric patterns', 'Cedar wood', 'Architectural elements'],
      available_experiences: [
        { name: 'Wood Carving Workshop', duration: '3.5 hours', price: 320 },
        { name: 'Architecture Tour', duration: '2 hours', price: 160 }
      ],
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
      video_summary: {
        duration: '60s',
        thumbnail: '/api/placeholder/400/225',
        description: 'Watch geometric patterns come to life under skilled hands'
      },
      preservation_story: 'Featured in our architectural heritage documentation project',
      next_available: '2024-01-21',
      languages: ['Arabic', 'French']
    },
    {
      id: 'match-6',
      name: 'Khadija Radi',
      craft: 'Argan Oil Producer',
      location: 'Essaouira Region',
      rating: 4.4,
      experience_years: 10,
      compatibility_score: 78,
      match_type: 'related',
      summary: 'Traditional argan oil producer maintaining ancient extraction methods and women cooperative traditions.',
      specialties: ['Traditional extraction', 'Quality control', 'Cooperative management'],
      available_experiences: [
        { name: 'Argan Oil Workshop', duration: '2 hours', price: 220 },
        { name: 'Cooperative Visit', duration: '1.5 hours', price: 140 }
      ],
      images: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
      video_summary: {
        duration: '60s',
        thumbnail: '/api/placeholder/400/225',
        description: 'Discover the golden treasure of Morocco through traditional methods'
      },
      preservation_story: 'Supporting women cooperative documentation and sustainability practices',
      next_available: '2024-01-23',
      languages: ['Arabic', 'French', 'Basic English']
    }
  ];

  type OnboardingStep = 'verification' | 'preferences' | 'matching' | 'matching_results';

  // ============ ONBOARDING STATE ============
  const [step, setStep] = useState<OnboardingStep>('verification');
  const [currentProfile, setCurrentProfile] = useState<TouristProfile | null>(null);
  
  // ============ WHATSAPP QR VERIFICATION STATE (EXACT SAME AS test-whatsapp-qr) ============
  const [phone, setPhone] = useState('');
  const [qrSession, setQrSession] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, generating, pending, verified, expired, error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [showTestPanel, setShowTestPanel] = useState(false);
  
  // ============ CULTURAL MATCHING STATE ============
  const [experiences, setExperiences] = useState(getMockExperiences());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    mood: '',
    time: '',
    budget: ''
  });

  // Enhanced matching and booking states
  const [showArtisanDetails, setShowArtisanDetails] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<any>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [bookingData, setBookingData] = useState({
    selectedDate: '',
    selectedTime: '',
    groupSize: 1,
    specialRequests: ''
  });
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [nearbyArtisans, setNearbyArtisans] = useState<any[]>([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

  // Update experiences when translations change
  useEffect(() => {
    setExperiences(getMockExperiences());
  }, [tTourism]);

  // Fix hydration
  useEffect(() => {
    setIsClient(true);
    checkExistingProfile();
    
    // Check URL parameters for step
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get('step');
    if (stepParam && ['verification', 'preferences', 'matching', 'matching_results'].includes(stepParam)) {
      setStep(stepParam as OnboardingStep);
    }
    
    // Listen for webhook simulation messages
    const handleMessage = (event) => {
      if (event.data.type === 'webhook_simulated' && event.data.success) {
        console.log('✅ Received webhook simulation confirmation');
        // Force a status check after webhook simulation
        if (qrSession) {
          setTimeout(() => {
            checkVerificationStatus(qrSession.id);
          }, 1000);
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [qrSession]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Check for existing verified profile
  const checkExistingProfile = async () => {
    try {
      // In development mode, always start fresh to experience the full flow
      if (process.env.NODE_ENV === 'development') {
        localStorage.removeItem('tourist_phone');
        console.log('🔄 Development mode: Cleared existing verification state for fresh flow testing');
        return;
      }
      
      const storedPhone = localStorage.getItem('tourist_phone');
      
      if (storedPhone) {
        const profile = await touristProfileService.getProfile(storedPhone);
        
        if (profile && profile.phone_verified) {
          setCurrentProfile(profile);
          setPhone(storedPhone);
          setVerificationStatus('verified');
          setStep('preferences');
          return;
        } else {
          localStorage.removeItem('tourist_phone');
        }
      }
    } catch (error) {
      console.error('Failed to check existing profile:', error);
    }
  };

  // Handle verification completion
  useEffect(() => {
    if (verificationStatus === 'verified' && phone && !currentProfile) {
      createTouristProfile();
    }
  }, [verificationStatus, phone, currentProfile]);

  const createTouristProfile = async () => {
    try {
      // Try to get existing profile or create basic one
      let profile = await touristProfileService.getProfile(phone);
      
      if (!profile) {
        const basicProfile: TouristProfile = {
          id: `temp_${Date.now()}`,
          phone: phone,
          phone_verified: true,
          first_name: 'Tourist',
          preferences: {
            mood: 'creative',
            time: 'half-day',
            budget: 'moderate'
          },
          saved_experiences: [],
          booking_history: [],
          preferences_set: false,
          total_bookings: 0,
          total_spent: 0,
          whatsapp_enabled: true,
          sms_enabled: true,
          marketing_consent: false,
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        };
        profile = basicProfile;
      }
      
      setCurrentProfile(profile);
      localStorage.setItem('tourist_phone', phone);
      setStep('preferences');
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  };

  // ============ WHATSAPP QR FUNCTIONS (EXACT SAME AS test-whatsapp-qr) ============
  
  const generateQRAutoValidation = async () => {
    setIsLoading(true);
    setError('');
    setVerificationStatus('generating');
    
    try {
      const { whatsappQRService } = await import('@/lib/whatsapp-qr-service');
      
      console.log('🔄 Generating QR auto-validation for:', phone);
      
      const result = await whatsappQRService.generateAutoValidationQR(phone);
      
      if (result.success && result.qrSession) {
        setQrSession(result.qrSession);
        setVerificationStatus('pending');
        
        const interval = setInterval(async () => {
          await checkVerificationStatus(result.qrSession.id);
        }, 2000);
        
        setStatusCheckInterval(interval);
        
        console.log('✅ QR auto-validation generated successfully');
      } else {
        setError(result.error || 'Failed to generate QR auto-validation');
        setVerificationStatus('error');
      }
      
    } catch (err) {
      console.error('Error generating QR auto-validation:', err);
      setError('Failed to generate QR auto-validation');
      setVerificationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationStatus = async (sessionId) => {
    try {
      const { whatsappQRService } = await import('@/lib/whatsapp-qr-service');
      
      const result = await whatsappQRService.checkVerificationStatus(sessionId);
      
      if (result.success) {
        if (result.status === 'verified') {
          setVerificationStatus('verified');
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
        } else if (result.status === 'expired') {
          setVerificationStatus('expired');
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
        }
      }
      
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const simulateWebhook = async () => {
    if (!qrSession) {
      setError('Generate QR session first');
      return;
    }

    try {
      console.log('🧪 Simulating webhook for testing...');
      
      // Send webhook simulation request
      const response = await fetch('/api/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: qrSession.phone,
          code: qrSession.code,
          sessionId: qrSession.id
        })
      });

      if (response.ok) {
        const resultHtml = await response.text();
        
        // Open result in new window
        const simulationWindow = window.open('about:blank', '_blank', 'width=500,height=400');
        if (simulationWindow) {
          simulationWindow.document.write(resultHtml);
          simulationWindow.document.close();
          
          // Also set localStorage in current window for immediate verification
          localStorage.setItem(`qr_session_${qrSession.id}`, 'verified');
          console.log('✅ QR session marked as verified locally');
          
          console.log('✅ Webhook simulation completed successfully');
        } else {
          setError('Could not open simulation window. Please allow popups.');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Webhook simulation failed');
      }
      
    } catch (error) {
      console.error('Error simulating webhook:', error);
      setError('Failed to simulate webhook');
    }
  };

  const resetDemo = () => {
    setQrSession(null);
    setVerificationStatus('idle');
    setError('');
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  const getCountryInfo = (phoneNumber) => {
    const countries = {
      '+212': { name: 'Morocco', flag: '🇲🇦', whatsappUsage: '95%' },
      '+33': { name: 'France', flag: '🇫🇷', whatsappUsage: '65%' },
      '+1': { name: 'USA/Canada', flag: '🇺🇸', whatsappUsage: '25%' },
      '+49': { name: 'Germany', flag: '🇩🇪', whatsappUsage: '45%' }
    };

    for (const [prefix, info] of Object.entries(countries)) {
      if (phoneNumber.startsWith(prefix)) {
        return info;
      }
    }
    return { name: 'International', flag: '🌍', whatsappUsage: '50%' };
  };

  const countryInfo = getCountryInfo(phone);

  const getStatusInfo = () => {
    switch (verificationStatus) {
      case 'idle':
        return { text: 'Ready to generate QR code', color: 'gray', icon: Clock };
      case 'generating':
        return { text: 'Generating QR code...', color: 'blue', icon: RefreshCw };
      case 'pending':
        return { text: 'Waiting for WhatsApp message...', color: 'yellow', icon: MessageCircle };
      case 'verified':
        return { text: 'Phone verified successfully!', color: 'green', icon: CheckCircle2 };
      case 'expired':
        return { text: 'Verification expired', color: 'red', icon: AlertCircle };
      case 'error':
        return { text: 'Verification failed', color: 'red', icon: AlertCircle };
      default:
        return { text: 'Unknown status', color: 'gray', icon: Clock };
    }
  };

  const statusInfo = getStatusInfo();

  // ============ CULTURAL MATCHING FUNCTIONS ============
  
  const handlePreferencesSubmit = async () => {
    if (!currentProfile) return;
    
    try {
      await touristProfileService.updatePreferences(currentProfile.phone, preferences);
      setStep('matching');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setStep('matching');
    }
  };

  const handleLike = async () => {
    const currentExperience = experiences[currentIndex];
    if (currentExperience && currentProfile) {
      setMatches([...matches, currentExperience.id]);
      await touristProfileService.saveExperience(currentProfile.phone, currentExperience.id);
      nextExperience();
    }
  };

  const handlePass = () => {
    nextExperience();
  };

  const nextExperience = () => {
    if (currentIndex < experiences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Show enhanced matching results instead of redirecting
      setStep('matching_results' as any);
    }
  };

  // ============ RENDER FUNCTIONS ============

  const renderVerification = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="container mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
            {t('welcome.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('welcome.subtitle')}
          </p>
          
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setShowTestPanel(!showTestPanel)}
              variant="outline"
              size="sm"
              className="text-purple-600 border-purple-300 hover:bg-purple-50"
            >
              <TestTube className="w-4 h-4 mr-2" />
              {showTestPanel ? t('welcome.hide') : t('welcome.show')} {t('welcome.developer_panel')}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Left Column: Phone Input */}
            <Card className="order-2 md:order-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  {t('verification.phone_label')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('verification.phone_label')}
                  </label>
                  <div className="relative">
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('verification.phone_placeholder')}
                      className="pr-12"
                      disabled={verificationStatus === 'pending'}
                    />
                    {phone && countryInfo.flag !== '🌍' && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none">
                        {countryInfo.flag}
                      </div>
                    )}
                  </div>
                </div>

                {phone && countryInfo.flag !== '🌍' && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-2xl">{countryInfo.flag}</span>
                    <div className="text-center">
                      <div className="font-semibold text-green-800">{countryInfo.name}</div>
                      <div className="text-sm text-green-600">{t('verification.country_info.whatsapp_usage')}: {countryInfo.whatsappUsage}</div>
                    </div>
                  </div>
                )}

                {showTestPanel && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <div className="text-sm font-medium text-gray-700">{t('verification.quick_test')}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPhone('+212612345678')}
                        className="text-left p-3 h-auto"
                        disabled={verificationStatus === 'pending'}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇲🇦</span>
                          <div>
                            <div className="font-medium">{t('verification.country_info.morocco')}</div>
                            <div className="text-xs text-gray-500">95% WhatsApp</div>
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPhone('+33698765432')}
                        className="text-left p-3 h-auto"
                        disabled={verificationStatus === 'pending'}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇫🇷</span>
                          <div>
                            <div className="font-medium">{t('verification.country_info.france')}</div>
                            <div className="text-xs text-gray-500">65% WhatsApp</div>
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPhone('+15551234567')}
                        className="text-left p-3 h-auto"
                        disabled={verificationStatus === 'pending'}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          <div>
                            <div className="font-medium">{t('verification.country_info.usa')}</div>
                            <div className="text-xs text-gray-500">25% WhatsApp</div>
                          </div>
                        </div>
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPhone('+493012345678')}
                        className="text-left p-3 h-auto"
                        disabled={verificationStatus === 'pending'}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🇩🇪</span>
                          <div>
                            <div className="font-medium">{t('verification.country_info.germany')}</div>
                            <div className="text-xs text-gray-500">45% WhatsApp</div>
                          </div>
                        </div>
                      </Button>
                    </div>
                  </div>
                )}

                <Button
                  onClick={generateQRAutoValidation}
                  disabled={!phone || isLoading || verificationStatus === 'pending'}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {t('verification.status.generating')}
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4 mr-2" />
                      {t('verification.generate_qr')}
                    </>
                  )}
                </Button>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-red-800 text-sm">{error}</div>
                  </div>
                )}
                
                {verificationStatus === 'verified' && (
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="w-full"
                  >
                    🔄 Reset Demo
                  </Button>
                )}
              </CardContent>
            </Card>
            
            {/* Right Column: QR Code */}
            <Card className="order-1 md:order-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Step 2: Scan QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {qrSession ? (
                  <>
                    {/* QR Code Display */}
                    <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
                      <QRCode value={qrSession.whatsappUrl} size={200} />
                      <div className="mt-4 text-sm text-gray-600">
                        {t('verification.qr_expires')}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
                      <div className="font-bold text-green-800 mb-3 text-center">
                        {t('verification.zero_touch_flow.title')}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                          <div>
                            <div className="font-medium text-green-800">{t('verification.zero_touch_flow.step1.title')}</div>
                            <div className="text-sm text-green-700">{t('verification.zero_touch_flow.step1.description')}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                          <div>
                            <div className="font-medium text-green-800">{t('verification.zero_touch_flow.step2.title')}</div>
                            <div className="text-sm text-green-700">{t('verification.zero_touch_flow.step2.description')}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                          <div>
                            <div className="font-medium text-green-800">{t('verification.zero_touch_flow.step3.title')}</div>
                            <div className="text-sm text-green-700">{t('verification.zero_touch_flow.step3.description')}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600">
                      Enter phone number and generate QR code to see auto-validation in action
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Status Card */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <statusInfo.icon className={`w-5 h-5 ${statusInfo.color === 'green' ? 'text-green-600' : statusInfo.color === 'yellow' ? 'text-yellow-600' : statusInfo.color === 'blue' ? 'text-blue-600' : statusInfo.color === 'red' ? 'text-red-600' : 'text-gray-600'}`} />
                Step 3: Auto-Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-lg font-medium mb-2 ${statusInfo.color === 'green' ? 'text-green-600' : statusInfo.color === 'yellow' ? 'text-yellow-600' : statusInfo.color === 'blue' ? 'text-blue-600' : statusInfo.color === 'red' ? 'text-red-600' : 'text-gray-600'}`}>
                  {t(`verification.status.${verificationStatus}`)}
                </div>
                
                {verificationStatus === 'pending' && (
                  <div className="text-sm text-yellow-700">
                    Checking every 2 seconds for WhatsApp message...
                  </div>
                )}
              </div>
              
              {/* Status-specific content */}
              {qrSession && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Session Details:</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Code:</strong> {qrSession.code}</div>
                    <div><strong>Expires:</strong> {new Date(qrSession.expiresAt).toLocaleTimeString()}</div>
                    <div><strong>Status:</strong> {verificationStatus}</div>
                  </div>
                </div>
              )}
              
              {verificationStatus === 'verified' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-800 font-medium mb-2">🎉 Success!</div>
                  <div className="text-sm text-green-700 mb-4">
                    Phone number verified automatically via WhatsApp! 
                  </div>
                  <Button 
                    onClick={() => setStep('preferences')}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    Continue to Cultural Matching <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Alternative success layout for bottom of page */}
              {verificationStatus === 'verified' && (
                <div className="mt-8">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="text-center p-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-green-800 mb-2">Welcome, Cultural Explorer!</h3>
                      <p className="text-green-700 mb-6">
                        Your journey is now tracked. Start discovering authentic artisan experiences.
                      </p>
                      <Button 
                        onClick={() => setStep('preferences')}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 text-lg"
                      >
                        Start Cultural Matching
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{t('preferences.title')}</h2>
            <p className="text-gray-600">{t('preferences.subtitle')}</p>
          </div>
          
          <Card className="p-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('preferences.mood.title')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['creative', 'cultural', 'adventurous', 'relaxing'].map((mood) => (
                    <Button
                      key={mood}
                      onClick={() => setPreferences({...preferences, mood})}
                      variant={preferences.mood === mood ? 'default' : 'outline'}
                      className="capitalize"
                    >
                      {t(`preferences.mood.${mood}`)}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('preferences.time.title')}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'quick', label: t('preferences.time.quick') },
                    { value: 'half_day', label: t('preferences.time.half_day') },
                    { value: 'full_day', label: t('preferences.time.full_day') }
                  ].map(({ value, label }) => (
                    <Button
                      key={value}
                      onClick={() => setPreferences({...preferences, time: value})}
                      variant={preferences.time === value ? 'default' : 'outline'}
                      className="text-sm"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('preferences.budget.title')}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'budget', label: t('preferences.budget.budget') },
                    { value: 'moderate', label: t('preferences.budget.moderate') },
                    { value: 'premium', label: t('preferences.budget.premium') }
                  ].map(({ value, label }) => (
                    <Button
                      key={value}
                      onClick={() => setPreferences({...preferences, budget: value})}
                      variant={preferences.budget === value ? 'default' : 'outline'}
                      className="text-sm"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={handlePreferencesSubmit}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3"
              >
                {t('preferences.start_matching')}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderMatching = () => {
    const currentExperience = experiences[currentIndex];
    
    if (!currentExperience) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">{t('matching.perfect_matches')}</h2>
            <p className="text-gray-600 mb-8">{t('matching.liked_experiences').replace('{count}', matches.length.toString())}</p>
            <Button 
              onClick={() => router.push('/cultural-match-phone')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {t('matching.view_matches')}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Find Your Perfect Experience</h2>
              <p className="text-gray-600">
                Experience {currentIndex + 1} of {experiences.length}
              </p>
            </div>
            
            <Card className="overflow-hidden">
              <div className="relative">
                <img 
                  src={currentExperience.image} 
                  alt={currentExperience.title}
                  className="w-full h-64 object-cover"
                />
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                  {currentExperience.matchScore}% Match
                </Badge>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{currentExperience.title}</h3>
                    <p className="text-gray-600 mb-2">with {currentExperience.artisan}</p>
                    <p className="text-sm text-gray-500">{currentExperience.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-500">${currentExperience.price}</p>
                    <p className="text-sm text-gray-500">{currentExperience.duration}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{currentExperience.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {(Array.isArray(currentExperience.features) ? currentExperience.features : []).map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handlePass}
                    variant="outline"
                    size="lg"
                    className="flex-1 border-gray-300"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Pass
                  </Button>
                  <Button 
                    onClick={handleLike}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Love It!
                  </Button>
                </div>
              </div>
            </Card>
            
            {/* QR Scanner Button */}
            <div className="mt-6">
              <Button
                onClick={() => setShowQRScanner(true)}
                variant="outline"
                className="w-full border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Scan QR Code to Find Local Artisans
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Artisan Details Modal
  const renderArtisanDetails = () => {
    if (!showArtisanDetails || !selectedArtisan) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Meet {selectedArtisan.name}</h2>
            <Button variant="ghost" onClick={() => setShowArtisanDetails(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Artisan Header */}
            <div className="flex items-start gap-6">
              <img 
                src={selectedArtisan.images[0]} 
                alt={selectedArtisan.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{selectedArtisan.craft}</h3>
                <p className="text-gray-600 mb-2">{selectedArtisan.location}</p>
                <div className="flex items-center gap-4 mb-3">
                  <Badge className="bg-green-100 text-green-800">
                    ⭐ {selectedArtisan.rating} Rating
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {selectedArtisan.experience_years} Years Experience
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-800">
                    {selectedArtisan.compatibility_score}% Match
                  </Badge>
                </div>
                <p className="text-gray-700">{selectedArtisan.summary}</p>
              </div>
            </div>

            {/* Video Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  60-Second Master Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative cursor-pointer" onClick={() => {
                  setCurrentVideo(selectedArtisan.video_summary);
                  setShowVideoModal(true);
                }}>
                  <img 
                    src={selectedArtisan.video_summary.thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black bg-opacity-70 text-white">
                    {selectedArtisan.video_summary.duration}
                  </Badge>
                </div>
                <p className="mt-3 text-gray-700">{selectedArtisan.video_summary.description}</p>
              </CardContent>
            </Card>

            {/* Specialties */}
            <div>
              <h4 className="font-semibold mb-3">Master Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {selectedArtisan.specialties.map((specialty, idx) => (
                  <Badge key={idx} variant="secondary">{specialty}</Badge>
                ))}
              </div>
            </div>

            {/* Available Experiences */}
            <div>
              <h4 className="font-semibold mb-3">Available Experiences</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedArtisan.available_experiences.map((exp, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">{exp.name}</h5>
                      <span className="text-lg font-bold text-green-600">{exp.price} MAD</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{exp.duration}</p>
                    <Button 
                      onClick={() => {
                        setShowArtisanDetails(false);
                        setShowBookingFlow(true);
                      }}
                      className="w-full"
                    >
                      Book Experience
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Preservation Story */}
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-blue-800">Cultural Preservation Story</h4>
                <p className="text-blue-700 text-sm">{selectedArtisan.preservation_story}</p>
              </CardContent>
            </Card>

            {/* Languages & Availability */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArtisan.languages.map((lang, idx) => (
                    <Badge key={idx} variant="outline">{lang}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Next Available</h4>
                <p className="text-green-600 font-medium">{selectedArtisan.next_available}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // QR Scanner Modal
  const renderQRScanner = () => {
    if (!showQRScanner) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Scan for Local Artisans
              </CardTitle>
              <Button variant="ghost" onClick={() => setShowQRScanner(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Point camera at QR code</p>
                <p className="text-sm text-gray-500 mt-2">
                  Find QR codes at workshops, souks, and cultural centers
                </p>
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                🏗️ Coming Soon: Real artisan QR codes will be loaded from our field team data collection API.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={() => {
                // Simulate finding nearby artisans
                setNearbyArtisans(getMockArtisanMatches().slice(0, 3));
                setShowQRScanner(false);
              }}
              className="w-full"
            >
              🧪 Simulate Local Discovery
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Video Modal
  const renderVideoModal = () => {
    if (!showVideoModal || !currentVideo) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold">Master Artisan Story</h3>
            <Button variant="ghost" onClick={() => setShowVideoModal(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <div className="p-4">
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <PlayCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">60-Second Video Summary</p>
                <p className="text-sm text-gray-500">{currentVideo.description}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              🎬 Video content from Cultural Preservation Engine documentation
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Booking Flow Modal
  const renderBookingFlow = () => {
    if (!showBookingFlow) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Book Your Experience</CardTitle>
              <Button variant="ghost" onClick={() => setShowBookingFlow(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Date</label>
              <Input 
                type="date" 
                value={bookingData.selectedDate}
                onChange={(e) => setBookingData({...bookingData, selectedDate: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Select Time</label>
              <select 
                className="w-full p-2 border rounded-md"
                value={bookingData.selectedTime}
                onChange={(e) => setBookingData({...bookingData, selectedTime: e.target.value})}
              >
                <option value="">Choose time</option>
                <option value="09:00">9:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Group Size</label>
              <Input 
                type="number" 
                min="1" 
                max="8"
                value={bookingData.groupSize}
                onChange={(e) => setBookingData({...bookingData, groupSize: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Special Requests</label>
              <textarea 
                className="w-full p-2 border rounded-md h-20"
                placeholder="Any special requirements or questions..."
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  {selectedArtisan?.available_experiences[0]?.price || 350} MAD
                </span>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                onClick={() => {
                  alert('🎉 Booking confirmed! WhatsApp confirmation sent to your phone.');
                  setShowBookingFlow(false);
                }}
              >
                Confirm Booking via WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Enhanced Matching Results
  const renderMatchingResults = () => {
    const artisanMatches = getMockArtisanMatches();
    const topMatches = artisanMatches.filter(a => a.match_type === 'top');
    const relatedMatches = artisanMatches.filter(a => a.match_type === 'related');

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Your Perfect Artisan Matches</h2>
              <p className="text-gray-600">Based on your preferences, here are your top cultural experiences</p>
            </div>

            {/* Top 3 Matches */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center">🎯 Top 3 Perfect Matches</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {topMatches.map((artisan) => (
                  <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={artisan.images[0]} 
                        alt={artisan.name}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white">
                        {artisan.compatibility_score}% Match
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-lg mb-1">{artisan.name}</h4>
                      <p className="text-gray-600 mb-2">{artisan.craft}</p>
                      <p className="text-sm text-gray-500 mb-3">{artisan.location}</p>
                      <p className="text-sm text-gray-700 mb-4">{artisan.summary}</p>
                      
                      <div className="flex gap-2 mb-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedArtisan(artisan);
                            setShowArtisanDetails(true);
                          }}
                        >
                          Learn More
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedArtisan(artisan);
                            setShowBookingFlow(true);
                          }}
                        >
                          Book Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Related Matches */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center">🔍 You Might Also Like</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedMatches.map((artisan) => (
                  <Card key={artisan.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={artisan.images[0]} 
                        alt={artisan.name}
                        className="w-full h-40 object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-500 text-white">
                        {artisan.compatibility_score}% Match
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold mb-1">{artisan.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{artisan.craft}</p>
                      <p className="text-xs text-gray-500 mb-3">{artisan.location}</p>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedArtisan(artisan);
                          setShowArtisanDetails(true);
                        }}
                      >
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* QR Scanner Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300">
              <CardContent className="p-6 text-center">
                <QrCode className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Discover Local Artisans</h3>
                <p className="text-gray-600 mb-4">
                  Scan QR codes at workshops, souks, and cultural centers to discover artisans near you
                </p>
                <Button 
                  onClick={() => setShowQRScanner(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Scan QR Code
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        {renderArtisanDetails()}
        {renderQRScanner()}
        {renderVideoModal()}
        {renderBookingFlow()}
      </div>
    );
  };

  // ============ MAIN RENDER ============
  
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <>
      {step === 'verification' && renderVerification()}
      {step === 'preferences' && renderPreferences()}
      {step === 'matching' && renderMatching()}
      {step === 'matching_results' && renderMatchingResults()}
    </>
  );
} 