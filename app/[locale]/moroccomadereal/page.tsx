'use client';

import React, { useState, useEffect } from 'react';
import { useTranslationsWithFallback } from '@/lib/translation-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, Heart, Share2, Instagram, Play, MapPin, Star, Clock, Users, Award, Zap, Sparkles, Globe, TrendingUp, CheckCircle2, Lock, Gift, Trophy, Target, Smartphone, MessageCircle, ExternalLink, ArrowRight, X, Info, RefreshCw, AlertCircle, PlayCircle } from 'lucide-react';
import { QRCode } from '@/components/ui/qr-code';
import { touristProfileService, TouristProfile } from '@/lib/tourist-profile-service';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

// Real artisan stories with authentic data
const artisanStories = [
  // Remove all mock data - will be loaded from API
];

// Mock experiences for matching
const getMockExperiences = () => [
  {
    id: 'pottery',
    title: 'Traditional Pottery Workshop',
    artisan: 'Hassan Al-Drawi',
    location: 'Draa Valley',
    description: 'Learn ancient pottery techniques from a master craftsman in the heart of Fez.',
    features: ['English-speaking', 'All materials included', 'Take home creation'],
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
    title: 'Berber Carpet Weaving',
    artisan: 'Aicha Tazi',
    location: 'Atlas Mountains',
    description: 'Discover the ancient art of Berber carpet weaving with indigenous patterns.',
    features: ['Mountain views', 'Traditional lunch', 'Cultural stories'],
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
    title: 'Leather Crafting Masterclass',
    artisan: 'Omar Benali',
    location: 'Marrakech Souk',
    description: 'Create beautiful leather goods using traditional Moroccan techniques.',
    features: ['Souk tour included', 'Premium leather', 'Custom design'],
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

type AppStep = 'landing' | 'verification' | 'scan' | 'story' | 'explorer-pass' | 'preferences' | 'matching' | 'results';

export default function MoroccoMadeRealPage() {
  const router = useRouter();
  const t = useTranslationsWithFallback('onboarding');
  
  // ============ CORE STATE ============
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [currentArtisan, setCurrentArtisan] = useState<any>(null);
  const [explorerPass, setExplorerPass] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<TouristProfile | null>(null);
  
  // ============ WHATSAPP VERIFICATION STATE ============
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [qrSession, setQrSession] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  
  // ============ QR SCANNING STATE ============
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  
  // ============ SOCIAL & SHARING STATE ============
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  
  // ============ NFT EXPLORER PASS STATE ============
  const [passLevel, setPassLevel] = useState(1);
  const [storiesCollected, setStoriesCollected] = useState(0);
  const [regionsVisited, setRegionsVisited] = useState<string[]>([]);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState<string[]>([]);
  const [totalImpactScore, setTotalImpactScore] = useState(0);

  // ============ CULTURAL MATCHING STATE ============
  const [preferences, setPreferences] = useState({
    mood: '',
    time: '',
    budget: ''
  });
  const [currentExperience, setCurrentExperience] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [showArtisanDetails, setShowArtisanDetails] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState<any>(null);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  
  // ============ BOOKING STATE ============
  const [bookingStep, setBookingStep] = useState('details');
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    groupSize: 1,
    experience: '',
    specialRequests: ''
  });
  
  // ============ BOOKING HELPER FUNCTIONS ============
  const resetBookingState = () => {
    setBookingStep('details');
    setBookingData({
      date: '',
      time: '',
      groupSize: 1,
      experience: '',
      specialRequests: ''
    });
  };

  const closeBookingModal = () => {
    setShowBookingFlow(false);
    resetBookingState();
  };
  
  // ============ PHONE FORMATTING FUNCTIONS ============
  
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except +
    const cleaned = value.replace(/[^\d+]/g, '');
    
    // If it starts with +, keep it, otherwise add +
    let formatted = cleaned.startsWith('+') ? cleaned : '+' + cleaned;
    
    // Format based on country code
    if (formatted.startsWith('+212')) {
      // Morocco: +212 6 12 34 56 78
      const digits = formatted.slice(4);
      if (digits.length <= 1) {
        formatted = '+212 ' + digits;
      } else if (digits.length <= 3) {
        formatted = `+212 ${digits.slice(0, 1)} ${digits.slice(1)}`;
      } else if (digits.length <= 5) {
        formatted = `+212 ${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3)}`;
      } else if (digits.length <= 7) {
        formatted = `+212 ${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
      } else {
        formatted = `+212 ${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
      }
    } else if (formatted.startsWith('+33')) {
      // France: +33 6 98 76 54 32
      const digits = formatted.slice(3);
      if (digits.length <= 1) {
        formatted = '+33 ' + digits;
      } else if (digits.length <= 3) {
        formatted = `+33 ${digits.slice(0, 1)} ${digits.slice(1)}`;
      } else if (digits.length <= 5) {
        formatted = `+33 ${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3)}`;
      } else if (digits.length <= 7) {
        formatted = `+33 ${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
      } else {
        formatted = `+33 ${digits.slice(0, 1)} ${digits.slice(1, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
      }
    } else if (formatted.startsWith('+1')) {
      // USA/Canada: +1 555 123 4567
      const digits = formatted.slice(2);
      if (digits.length <= 3) {
        formatted = '+1 ' + digits;
      } else if (digits.length <= 6) {
        formatted = `+1 ${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else {
        formatted = `+1 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
      }
    } else if (formatted.startsWith('+49')) {
      // Germany: +49 30 12345678
      const digits = formatted.slice(3);
      if (digits.length <= 2) {
        formatted = '+49 ' + digits;
      } else if (digits.length <= 10) {
        formatted = `+49 ${digits.slice(0, 2)} ${digits.slice(2)}`;
      }
    }
    
    return formatted;
  };

  const getCleanPhoneNumber = (formatted: string) => {
    return formatted.replace(/\s/g, '');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setFormattedPhone(formatted);
    setPhone(getCleanPhoneNumber(formatted));
  };

  const getCountryInfo = (phoneNumber: string) => {
    const countryData = {
      '212': { name: 'Morocco', flag: '🇲🇦' },
      '33': { name: 'France', flag: '🇫🇷' },
      '1': { name: 'USA', flag: '🇺🇸' },
      '49': { name: 'Germany', flag: '🇩🇪' },
    };
    
    for (const [code, info] of Object.entries(countryData)) {
      if (phoneNumber.startsWith(`+${code}`)) {
        return info;
      }
    }
    
    return { name: 'Unknown', flag: '🌍' };
  };

  useEffect(() => {
    setIsClient(true);
    checkExistingProfile();
    
    // Force cache refresh - Updated timestamp
    const cacheVersion = Date.now();
    console.log(`🔄 Cache version: ${cacheVersion} - All changes should be visible now`);
    
    // Listen for webhook simulation messages
    const handleMessage = (event) => {
      if (event.data.type === 'webhook_simulated' && event.data.success) {
        console.log('✅ Received webhook simulation confirmation');
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
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [qrSession]);

  // Check for existing verified profile
  const checkExistingProfile = async () => {
    try {
      const storedPhone = localStorage.getItem('tourist_phone');
      
      if (storedPhone) {
        const profile = await touristProfileService.getProfile(storedPhone);
        
        if (profile && profile.phone_verified) {
          setCurrentProfile(profile);
          setPhone(storedPhone);
          setVerificationStatus('verified');
          
          // Load existing Explorer Pass
          const savedPass = localStorage.getItem('cultural_explorer_pass');
          if (savedPass) {
            const passData = JSON.parse(savedPass);
            setExplorerPass(passData);
            setStoriesCollected(passData.storiesCollected || 0);
            setRegionsVisited(passData.regionsVisited || []);
            setAchievementsUnlocked(passData.achievementsUnlocked || []);
            setTotalImpactScore(passData.totalImpactScore || 0);
          }
          
          return;
        } else {
          localStorage.removeItem('tourist_phone');
        }
      }
    } catch (error) {
      console.error('Failed to check existing profile:', error);
    }
  };

  // ============ WHATSAPP VERIFICATION FUNCTIONS ============
  
  const generateQRAutoValidation = async () => {
    setIsLoading(true);
    setError('');
    setVerificationStatus('generating');
    
    try {
      const response = await fetch('/api/whatsapp-qr-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setQrSession(data.session);
        setVerificationStatus('pending');
        console.log('✅ QR Session Generated:', data.session.id);
        startStatusCheck(data.session.id);
      } else {
        setError(data.error || 'Failed to generate QR code');
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('QR Generation Error:', error);
      setError('Failed to generate QR code');
      setVerificationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const startStatusCheck = (sessionId) => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }
    
    const interval = setInterval(() => {
      checkVerificationStatus(sessionId);
    }, 3000);
    
    setStatusCheckInterval(interval);
  };

  const checkVerificationStatus = async (sessionId) => {
    try {
      const response = await fetch('/api/whatsapp-qr-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.session.status === 'verified') {
          setVerificationStatus('verified');
          
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
          
          await createTouristProfile();
          console.log('✅ Phone verified successfully!');
        } else if (data.session.status === 'expired') {
          setVerificationStatus('expired');
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
        }
      }
    } catch (error) {
      console.error('Status check error:', error);
    }
  };

  const simulateWebhook = async () => {
    if (!qrSession) return;
    
    try {
      const response = await fetch('/api/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: qrSession.phone,
          code: qrSession.code,
          sessionId: qrSession.id
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Webhook simulated successfully');
        window.postMessage({
          type: 'webhook_simulated',
          success: true,
          sessionId: qrSession.id
        }, '*');
        
        setTimeout(() => {
          checkVerificationStatus(qrSession.id);
        }, 1000);
      }
    } catch (error) {
      console.error('Webhook simulation error:', error);
    }
  };

  const createTouristProfile = async () => {
    try {
      let profile = await touristProfileService.getProfile(phone);
      
      if (!profile) {
        const basicProfile: TouristProfile = {
          id: `tourist_${Date.now()}`,
          phone: phone,
          phone_verified: true,
          first_name: 'Cultural Explorer',
          preferences: {
            mood: 'creative',
            timeAvailable: 'half-day',
            priceRange: 'moderate'
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
      
      // Initialize Explorer Pass
      initializeExplorerPass();
      
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  };

  const initializeExplorerPass = () => {
    const newPass = {
      id: `pass_${Date.now()}`,
      touristPhone: phone,
      level: 1,
      storiesCollected: 0,
      regionsVisited: [],
      achievementsUnlocked: [],
      totalImpactScore: 0,
      nftHash: generateNFTHash(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    setExplorerPass(newPass);
    localStorage.setItem('cultural_explorer_pass', JSON.stringify(newPass));
  };

  const getStatusInfo = () => {
    switch (verificationStatus) {
      case 'idle':
        return { icon: Smartphone, color: 'text-gray-500', bg: 'bg-gray-50', text: 'Ready to start' };
      case 'generating':
        return { icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50', text: 'Generating QR...' };
      case 'pending':
        return { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', text: 'Waiting for WhatsApp' };
      case 'verified':
        return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', text: 'Verified!' };
      case 'expired':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', text: 'Expired' };
      case 'error':
        return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', text: 'Error' };
      default:
        return { icon: Smartphone, color: 'text-gray-500', bg: 'bg-gray-50', text: 'Unknown' };
    }
  };

  // ============ QR SCANNING FUNCTIONS ============
  
  const simulateQRScan = (qrCode: string) => {
    const artisan = artisanStories.find(a => a.qrCode === qrCode);
    if (artisan) {
      setScanResult(artisan);
      setCurrentArtisan(artisan);
      setCurrentStep('story');
      
      // Update Explorer Pass
      updateExplorerPass(artisan);
    } else {
      alert('QR Code not recognized. Try scanning an authentic Morocco Made Real code.');
    }
  };

  const updateExplorerPass = (artisan: any) => {
    const newStoriesCollected = storiesCollected + 1;
    const newRegions = [...new Set([...regionsVisited, artisan.location.split(',')[1]?.trim() || artisan.location])];
    const newImpactScore = totalImpactScore + artisan.preservationScore;
    
    const updatedPass = {
      id: explorerPass?.id || `pass_${Date.now()}`,
      level: Math.floor(newStoriesCollected / 3) + 1,
      storiesCollected: newStoriesCollected,
      regionsVisited: newRegions,
      achievementsUnlocked: calculateAchievements(newStoriesCollected, newRegions.length),
      totalImpactScore: newImpactScore,
      nftHash: generateNFTHash(),
      createdAt: explorerPass?.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    setExplorerPass(updatedPass);
    setStoriesCollected(newStoriesCollected);
    setRegionsVisited(newRegions);
    setTotalImpactScore(newImpactScore);
    
    localStorage.setItem('cultural_explorer_pass', JSON.stringify(updatedPass));
  };

  const calculateAchievements = (stories: number, regions: number) => {
    const achievements = [];
    if (stories >= 1) achievements.push('First Story');
    if (stories >= 3) achievements.push('Story Collector');
    if (stories >= 5) achievements.push('Cultural Explorer');
    if (stories >= 10) achievements.push('Master Collector');
    if (regions >= 2) achievements.push('Region Hopper');
    if (regions >= 4) achievements.push('Morocco Expert');
    return achievements;
  };

  const generateNFTHash = () => {
    return `0x${Math.random().toString(16).substring(2).toUpperCase()}${Date.now().toString(16).toUpperCase()}`;
  };

  // ============ SOCIAL FUNCTIONS ============
  
  const handleLikeStory = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const shareToInstagram = () => {
    const text = `Just discovered ${currentArtisan.name}'s incredible ${currentArtisan.craft} story in Morocco! 🇲🇦✨ ${currentArtisan.generations} generations of tradition preserved through @MoroccoMadeReal 🎨 #AuthenticMorocco #CulturalTravel #NFTTravel`;
    const instagramUrl = `https://www.instagram.com/create/story/?background_url=${encodeURIComponent(currentArtisan.images[0])}&text=${encodeURIComponent(text)}`;
    window.open(instagramUrl, '_blank');
  };

  const shareToTikTok = () => {
    const text = `Scanning QR codes to discover real Moroccan master artisans! 🇲🇦 ${currentArtisan.name} is preserving ${currentArtisan.generations} generations of ${currentArtisan.craft} 🎨 #Morocco #Authentic #Travel #QRCode`;
    const tiktokUrl = `https://www.tiktok.com/upload?text=${encodeURIComponent(text)}`;
    window.open(tiktokUrl, '_blank');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const renderLanding = () => (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-4 sm:py-8">
      {/* Moroccan Pattern Background */}
      <div className="absolute inset-0 bg-[url('/patterns/moroccan-pattern.svg')] opacity-10"></div>
      
      <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          
          {/* Main Value Proposition */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-800 mb-3 sm:mb-4 font-serif leading-tight">
              <span className="text-orange-600">Meet an Authentic Experience</span>{' '}
              <span className="text-green-600">and Take Home a Certified Story</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-light mb-4 sm:mb-6">
              {t('morocco_made_real.hero.description')}
            </p>
          </div>

          {/* Cultural Impact Cards - Compact Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 max-w-4xl mx-auto">
            <div className="text-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 shadow-sm">
              <div className="w-8 h-8 sm:w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-base">🏆</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-red-600 mb-1 font-serif">
                {t('morocco_made_real.cultural_impact.certified_title')}
              </h3>
              <p className="text-slate-600 font-medium text-xs sm:text-sm mb-1">
                {t('morocco_made_real.cultural_impact.certified_subtitle')}
              </p>
              <p className="text-xs text-slate-500">
                {t('morocco_made_real.cultural_impact.certified_description')}
              </p>
            </div>
            
            <div className="text-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 shadow-sm">
              <div className="w-8 h-8 sm:w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-base">🏛️</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-orange-600 mb-1 font-serif">
                {t('morocco_made_real.cultural_impact.heritage_title')}
              </h3>
              <p className="text-slate-600 font-medium text-xs sm:text-sm mb-1">
                {t('morocco_made_real.cultural_impact.heritage_subtitle')}
              </p>
              <p className="text-xs text-slate-500">
                {t('morocco_made_real.cultural_impact.heritage_description')}
              </p>
            </div>
            
            <div className="text-center p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 shadow-sm">
              <div className="w-8 h-8 sm:w-10 h-10 mx-auto mb-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-base">🤝</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-green-600 mb-1 font-serif">
                {t('morocco_made_real.cultural_impact.direct_title')}
              </h3>
              <p className="text-slate-600 font-medium text-xs sm:text-sm mb-1">
                {t('morocco_made_real.cultural_impact.direct_subtitle')}
              </p>
              <p className="text-xs text-slate-500">
                {t('morocco_made_real.cultural_impact.direct_description')}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto mb-4 sm:mb-6">
            <button
              onClick={() => setCurrentStep('verification')}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('morocco_made_real.hero.start_journey')}
            </button>
            <button
              onClick={() => setCurrentStep('explorer-pass')}
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t('morocco_made_real.hero.get_explorer_pass')}
            </button>
          </div>

          {/* Simplified Discovery Message */}
          <div className="pt-4 sm:pt-6 border-t border-slate-200 max-w-2xl mx-auto text-center">
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Discover authentic artisan stories across Morocco - simply verify your phone to begin your cultural journey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 flex items-center">
      <div className="container mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
            <Smartphone className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Verify Your Cultural Journey</h1>
          <p className="text-xl text-gray-600 mb-6">
            Connect via WhatsApp to track your authentic Moroccan experiences and build your Cultural Explorer profile.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-2 text-blue-800">
              <Award className="w-5 h-5" />
              <span className="font-medium">Why verify?</span>
            </div>
            <div className="text-sm text-blue-700 mt-2 space-y-1">
              <div>✓ Track your story collection journey</div>
              <div>✓ Earn NFT Cultural Explorer Pass levels</div>
              <div>✓ Save favorite artisan experiences</div>
              <div>✓ Get booking confirmations via WhatsApp</div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Phone Input Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Enter Your Phone Number</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Step 1/2
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={formattedPhone}
                  onChange={handlePhoneChange}
                  className="text-lg h-12"
                />
                
                {phone && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center text-sm">
                      <MessageCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-green-700">
                        {getCountryInfo(phone).flag} {getCountryInfo(phone).name}
                      </span>
                      <span className="text-green-600 ml-auto font-medium">
                        WhatsApp Ready
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button
                  onClick={generateQRAutoValidation}
                  disabled={!phone || phone.length < 10 || isLoading}
                  className="w-full h-12 text-lg font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Verify via WhatsApp
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          {verificationStatus !== 'idle' && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  {(() => {
                    const statusInfo = getStatusInfo();
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${statusInfo.bg} mb-4`}>
                        <StatusIcon className={`w-8 h-8 ${statusInfo.color} ${verificationStatus === 'generating' ? 'animate-spin' : ''}`} />
                      </div>
                    );
                  })()}
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {getStatusInfo().text}
                    </h3>
                    {phone && (
                      <p className="text-gray-600">
                        {phone}
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* QR Code Display */}
          {qrSession && verificationStatus === 'pending' && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Scan QR Code with WhatsApp
                  </h3>
                  
                  <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-200">
                    <QRCode value={qrSession.whatsappUrl} size={200} />
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => window.open(qrSession.whatsappUrl, '_blank')}
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Open WhatsApp
                    </Button>
                    
                    {process.env.NODE_ENV === 'development' && (
                      <Button
                        onClick={simulateWebhook}
                        variant="outline"
                        className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Quick Test (Dev Only)
                      </Button>
                    )}
                  </div>
                  
                  {qrSession && (
                    <div className="p-3 bg-gray-50 rounded-lg text-left">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div><strong>Demo Code:</strong> {qrSession.code}</div>
                        <div><strong>Session:</strong> {qrSession.id}</div>
                        <div><strong>Expires:</strong> {new Date(qrSession.expiresAt).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Success - Auto redirect to preferences */}
          {verificationStatus === 'verified' && currentProfile && (
            <Card className="mb-6 border-green-200 bg-green-50">
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Welcome, Cultural Explorer!</h3>
                <p className="text-green-700 mb-4">
                  Your journey is now tracked. Let's find your perfect cultural experiences.
                </p>
                <Button
                  onClick={() => setCurrentStep('preferences')}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Start Cultural Matching
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <Button
              onClick={() => setCurrentStep('landing')}
              variant="outline"
              className="text-gray-600"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScan = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto text-center">
          
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center mb-6">
              <Camera className="w-16 h-16 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Discover Artisan Stories</h2>
            <p className="text-gray-300 mb-8">
              Point your camera at artisan codes found at workshops, souks, and cultural centers across Morocco. 
              Each discovery unlocks an authentic master craftsperson story.
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 mb-8">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg">
                <div className="text-black text-center">
                  <Camera className="w-24 h-24 mx-auto mb-4 text-gray-800" />
                  <p className="text-sm font-medium">Point camera to discover stories</p>
                </div>
              </div>
              
              <Button
                onClick={() => router.push('/tourist-onboarding?step=preferences')}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg"
              >
                <Camera className="w-5 h-5 mr-2" />
                Start Cultural Matching
              </Button>
            </div>
          </Card>

          {/* Demo Message for API Integration */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6 mb-8">
            <h3 className="font-bold mb-4">🏗️ Coming Soon</h3>
            <p className="text-gray-300 text-sm mb-4">
              Real artisan discovery codes will be loaded from our field team data collection API. 
              Each verified craftsperson will have unique codes at their workshops.
            </p>
            <div className="bg-orange-500/20 p-3 rounded-lg">
              <p className="text-orange-200 text-xs">
                📱 Your phone ({phone}) is verified and ready to track story collections!
              </p>
            </div>
          </Card>

          {currentProfile && (
            <Card className="bg-green-500/20 border-green-400/30 p-4 mb-6">
              <p className="text-green-200 text-sm">
                ✅ Tracking enabled for {currentProfile.first_name}
              </p>
              <p className="text-green-300 text-xs mt-1">
                Stories will be saved to your Cultural Explorer Pass
              </p>
            </Card>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={() => setCurrentStep('landing')}
              variant="outline"
              className="flex-1 border-white text-white hover:bg-white hover:text-purple-900"
            >
              ← Home
            </Button>
            <Button
              onClick={() => setCurrentStep('explorer-pass')}
              variant="outline"
              className="flex-1 border-white text-white hover:bg-white hover:text-purple-900"
            >
              <Award className="w-4 h-4 mr-2" />
              View Pass
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStory = () => {
    if (!currentArtisan) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            
            {/* Story Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Badge className={`${
                  currentArtisan.storyRarity === 'Legendary' ? 'bg-purple-500' :
                  currentArtisan.storyRarity === 'Epic' ? 'bg-orange-500' :
                  'bg-blue-500'
                } text-white px-4 py-2`}>
                  {currentArtisan.storyRarity} Story Unlocked
                </Badge>
                <Badge className="bg-green-500 text-white px-4 py-2">
                  +{currentArtisan.preservationScore} Impact Points
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{currentArtisan.name}'s Story</h1>
              <p className="text-xl text-gray-600">{currentArtisan.craft} • {currentArtisan.location}</p>
            </div>

            {/* Artisan Photo & Blockchain Verification */}
            <Card className="mb-8 overflow-hidden">
              <div className="relative">
                <img 
                  src={currentArtisan.images[0]} 
                  alt={currentArtisan.name}
                  className="w-full h-80 object-cover"
                />
                
                {/* Blockchain Verification Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-bold">Blockchain Verified</span>
                </div>
                
                {/* Endangerment Level */}
                <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-white font-bold ${
                  currentArtisan.endangeredLevel === 'Critical' ? 'bg-red-500' :
                  currentArtisan.endangeredLevel === 'High' ? 'bg-orange-500' :
                  currentArtisan.endangeredLevel === 'Medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}>
                  {currentArtisan.endangeredLevel} Risk Craft
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Heritage</h3>
                    <p className="text-gray-600">{currentArtisan.generations} generations • {currentArtisan.age} years old</p>
                    <p className="text-sm text-purple-600 font-medium">{currentArtisan.certificationLevel}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2">Impact</h3>
                    <p className="text-gray-600">Supports {currentArtisan.familySupported} family members</p>
                    <p className="text-sm text-green-600 font-medium">€{currentArtisan.monthlyEarnings}/month via tourism</p>
                  </div>
                </div>
                
                {/* Authentic Story */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-orange-800 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Authentic Story
                  </h3>
                  <p className="text-gray-700 italic leading-relaxed">"{currentArtisan.story}"</p>
                </div>
                
                {/* Impact Statement */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-green-800 mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Cultural Impact
                  </h3>
                  <p className="text-gray-700 font-medium">{currentArtisan.impact}</p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentArtisan.touristVisits}</div>
                      <div className="text-sm text-gray-600">Tourists this month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{currentArtisan.preservationScore}%</div>
                      <div className="text-sm text-gray-600">Preservation score</div>
                    </div>
                  </div>
                </div>
                
                {/* Social Proof */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
                  <h3 className="font-bold text-purple-800 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Social Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <span className="text-sm">{currentArtisan.socialProof.instagramMentions.toLocaleString()} mentions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-red-500" />
                      <span className="text-sm">{(currentArtisan.socialProof.tikTokViews / 1000).toFixed(0)}K views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm">{currentArtisan.socialProof.googleReviews} ({currentArtisan.socialProof.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">{currentArtisan.touristVisits} visitors/month</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleLikeStory}
                      variant={isLiked ? "default" : "outline"}
                      className="flex-1"
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? 'Loved' : 'Love Story'} ({likesCount})
                    </Button>
                    <Button
                      onClick={() => setShowShareModal(true)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Story
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => setCurrentStep('verification')}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-4 text-lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Book Experience with {currentArtisan.name} • €{currentArtisan.experiencePrice}
                  </Button>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => setCurrentStep('explorer-pass')}
                      variant="outline"
                      className="flex-1"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      View Explorer Pass
                    </Button>
                    <Button
                      onClick={() => setCurrentStep('scan')}
                      variant="outline"
                      className="flex-1"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Scan More Stories
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Share {currentArtisan.name}'s Story</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Button
                    onClick={shareToInstagram}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Instagram
                  </Button>
                  <Button
                    onClick={shareToTikTok}
                    className="bg-black text-white"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    TikTok
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Sharing authentic stories helps preserve Moroccan heritage and supports artisan families directly.
                </p>
                
                <Button 
                  onClick={() => setShowShareModal(false)}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderExplorerPass = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          
          {/* NFT Pass Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-6 mx-auto w-24 h-24 flex items-center justify-center mb-6">
              <Award className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Cultural Explorer Pass</h1>
            <p className="text-xl text-gray-300 mb-2">Your NFT-Powered Journey Through Morocco</p>
            {explorerPass && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-lg">
                Level {explorerPass.level} Explorer
              </Badge>
            )}
          </div>

          {/* NFT Pass Card */}
          <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-none mb-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <CardContent className="p-8 relative">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Morocco Cultural Explorer</h2>
                  <p className="text-purple-200">Blockchain-Verified NFT Pass</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-200">Level</div>
                  <div className="text-3xl font-bold">{explorerPass?.level || 1}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-purple-200 text-sm">Stories Collected</div>
                  <div className="text-2xl font-bold">{storiesCollected}</div>
                </div>
                <div>
                  <div className="text-purple-200 text-sm">Regions Visited</div>
                  <div className="text-2xl font-bold">{regionsVisited.length}</div>
                </div>
                <div>
                  <div className="text-purple-200 text-sm">Impact Score</div>
                  <div className="text-2xl font-bold">{totalImpactScore}</div>
                </div>
                <div>
                  <div className="text-purple-200 text-sm">Achievements</div>
                  <div className="text-2xl font-bold">{achievementsUnlocked.length}</div>
                </div>
              </div>
              
              {explorerPass && (
                <div className="bg-white/20 p-4 rounded-lg">
                  <div className="text-sm text-purple-200 mb-1">NFT Hash</div>
                  <div className="font-mono text-xs">{explorerPass.nftHash}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
                Achievements Unlocked
              </h3>
              
              {achievementsUnlocked.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {achievementsUnlocked.map((achievement, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-3 rounded-lg border border-yellow-500/30">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">{achievement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Start scanning artisan stories to unlock achievements!</p>
              )}
            </CardContent>
          </Card>

          {/* Regions Visited */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-green-400" />
                Regions Explored
              </h3>
              
              {regionsVisited.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {regionsVisited.map((region, index) => (
                    <Badge key={index} className="bg-green-500 text-white">
                      {region}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Discover artisans across different regions of Morocco!</p>
              )}
            </CardContent>
          </Card>

          {/* Next Level Progress */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-blue-400" />
                Next Level Progress
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Stories to Level {(explorerPass?.level || 1) + 1}</span>
                    <span>{storiesCollected % 3}/3</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((storiesCollected % 3) / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-300">
                  Collect {3 - (storiesCollected % 3)} more stories to reach Level {(explorerPass?.level || 1) + 1}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              onClick={() => setCurrentStep('scan')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-4 text-lg"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Scan More Artisan Stories
            </Button>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setCurrentStep('landing')}
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-900"
              >
                ← Home
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-purple-900"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Pass
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============ CULTURAL MATCHING RENDER FUNCTIONS ============
  
  const renderPreferences = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">What Interests You?</h2>
            <p className="text-gray-600">Help us find perfect cultural experiences for you</p>
          </div>
          
          <Card className="p-8">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">What draws you to Morocco?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'creative', label: '🎨 Creative', icon: '🎨' },
                    { value: 'cultural', label: '🏛️ Cultural', icon: '🏛️' },
                    { value: 'adventure', label: '🏔️ Adventure', icon: '🏔️' },
                    { value: 'relaxing', label: '🧘 Relaxing', icon: '🧘' }
                  ].map((mood) => (
                    <Button
                      key={mood.value}
                      onClick={() => setPreferences({...preferences, mood: mood.value})}
                      variant={preferences.mood === mood.value ? 'default' : 'outline'}
                      className="h-16 text-left"
                    >
                      <div>
                        <div className="text-2xl mb-1">{mood.icon}</div>
                        <div className="font-medium">{mood.label.replace(/🎨|🏛️|🏔️|🧘 /, '')}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">How much time do you have?</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'quick', label: '2-3 hours' },
                    { value: 'half-day', label: 'Half Day' },
                    { value: 'full-day', label: 'Full Day' }
                  ].map((time) => (
                    <Button
                      key={time.value}
                      onClick={() => setPreferences({...preferences, time: time.value})}
                      variant={preferences.time === time.value ? 'default' : 'outline'}
                      className="text-sm"
                    >
                      {time.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Budget preference?</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: 'budget', label: 'Budget Friendly', sub: '< $70' },
                    { value: 'moderate', label: 'Moderate', sub: '$70-120' },
                    { value: 'premium', label: 'Premium', sub: '$120+' }
                  ].map((budget) => (
                    <Button
                      key={budget.value}
                      onClick={() => setPreferences({...preferences, budget: budget.value})}
                      variant={preferences.budget === budget.value ? 'default' : 'outline'}
                      className="h-16 flex flex-col"
                    >
                      <div className="font-medium">{budget.label}</div>
                      <div className="text-xs text-gray-500">{budget.sub}</div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <Button
                onClick={() => setCurrentStep('matching')}
                disabled={!preferences.mood || !preferences.time || !preferences.budget}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3"
              >
                Continue to Experience Matching
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderMatching = () => {
    const experiences = getMockExperiences();
    const currentExp = experiences[currentExperience];

    if (!currentExp) {
      setCurrentStep('results');
      return null;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Finding Your Perfect Match</h2>
              <p className="text-gray-600">Swipe through curated experiences</p>
              <div className="flex justify-center space-x-2 mt-4">
                {experiences.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentExperience ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Card className="overflow-hidden shadow-lg">
              <div className="relative">
                <img 
                  src={currentExp.image} 
                  alt={currentExp.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {currentExp.matchScore}% Match
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{currentExp.title}</h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{currentExp.location}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>👨‍🎨 {currentExp.artisan}</span>
                    <span>⏱️ {currentExp.duration}</span>
                    <span>💰 {currentExp.price} MAD</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{currentExp.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {currentExp.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      if (currentExperience < experiences.length - 1) {
                        setCurrentExperience(currentExperience + 1);
                      } else {
                        setCurrentStep('results');
                      }
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={() => {
                      setMatches([...matches, currentExp.id]);
                      if (currentExperience < experiences.length - 1) {
                        setCurrentExperience(currentExperience + 1);
                      } else {
                        setCurrentStep('results');
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Interested
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 text-center">
              <Button
                onClick={() => setCurrentStep('results')}
                variant="ghost"
                className="text-orange-600"
              >
                Skip to Results →
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const artisanMatches = getMockArtisanMatches();
    const topMatches = artisanMatches.filter(match => match.match_type === 'top');
    const relatedMatches = artisanMatches.filter(match => match.match_type === 'related');

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Your Perfect Cultural Matches</h2>
              <p className="text-gray-600 mb-4">Based on your preferences, we found these amazing artisan experiences</p>
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span>Top 3 Perfect Matches</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span>3 Related Experiences</span>
                </div>
              </div>
            </div>

            {/* Top 3 Perfect Matches */}
            <div className="mb-12">
              <div className="flex items-center mb-6">
                <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                <h3 className="text-xl font-bold">Perfect Matches for You</h3>
                <Badge className="ml-3 bg-green-100 text-green-700">96-88% Compatibility</Badge>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {topMatches.map((artisan, index) => (
                  <Card key={artisan.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img 
                        src={artisan.images[0]} 
                        alt={artisan.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        #{index + 1} Match
                      </div>
                      <div className="absolute top-3 right-3 bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-bold">
                        {artisan.compatibility_score}%
                      </div>
                      <Button
                        onClick={() => {
                          setCurrentVideo(artisan.video_summary);
                          setShowVideoModal(true);
                        }}
                        className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full"
                        size="sm"
                      >
                        <PlayCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <h4 className="font-bold text-lg">{artisan.name}</h4>
                        <p className="text-orange-600 font-medium">{artisan.craft}</p>
                        <div className="flex items-center text-gray-600 text-sm mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{artisan.location}</span>
                          <div className="flex items-center ml-3">
                            <Star className="w-3 h-3 text-yellow-500 mr-1" />
                            <span>{artisan.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{artisan.summary}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {artisan.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={() => {
                            setSelectedArtisan(artisan);
                            setShowArtisanDetails(true);
                          }}
                          variant="outline"
                          className="w-full text-xs"
                        >
                          <Info className="w-3 h-3 mr-2" />
                          Learn More
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedArtisan(artisan);
                            setShowBookingFlow(true);
                          }}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-xs"
                        >
                          Book Experience
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 3 Related Experiences */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <Sparkles className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-xl font-bold">You Might Also Like</h3>
                <Badge className="ml-3 bg-blue-100 text-blue-700">84-78% Compatibility</Badge>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                {relatedMatches.map((artisan) => (
                  <Card key={artisan.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img 
                        src={artisan.images[0]} 
                        alt={artisan.name}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {artisan.compatibility_score}%
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <h4 className="font-bold">{artisan.name}</h4>
                        <p className="text-blue-600 font-medium text-sm">{artisan.craft}</p>
                        <div className="flex items-center text-gray-600 text-xs mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{artisan.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => {
                            setSelectedArtisan(artisan);
                            setShowArtisanDetails(true);
                          }}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedArtisan(artisan);
                            setShowBookingFlow(true);
                          }}
                          size="sm"
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-xs"
                        >
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* QR Discovery CTA */}
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <QrCode className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-lg font-bold mb-2">Discover More Artisans Locally</h3>
                <p className="text-gray-600 mb-4">Use QR scanner to find artisans near your location</p>
                <Button
                  onClick={() => setShowQRScanner(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan QR Codes
                </Button>
              </CardContent>
            </Card>

            {/* Back to preferences */}
            <div className="mt-8 text-center">
              <Button
                onClick={() => setCurrentStep('preferences')}
                variant="outline"
                className="mr-4"
              >
                ← Adjust Preferences
              </Button>
              <Button
                onClick={() => setCurrentStep('explorer-pass')}
                className="bg-gradient-to-r from-green-500 to-emerald-600"
              >
                <Award className="w-4 h-4 mr-2" />
                View Explorer Pass
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============ MODAL COMPONENTS ============
  
  const renderArtisanDetailsModal = () => (
    showArtisanDetails && selectedArtisan && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold">{selectedArtisan.name}</h3>
                <p className="text-orange-600 font-medium">{selectedArtisan.craft}</p>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{selectedArtisan.location}</span>
                  <div className="flex items-center ml-4">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span>{selectedArtisan.rating} ({selectedArtisan.experience_years} years)</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowArtisanDetails(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {selectedArtisan.images.map((image, idx) => (
                <img 
                  key={idx}
                  src={image}
                  alt={`${selectedArtisan.name} work ${idx + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
            
            <p className="text-gray-700 mb-4">{selectedArtisan.summary}</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Specialties</h4>
              <div className="flex flex-wrap gap-2">
                {selectedArtisan.specialties.map((specialty, idx) => (
                  <Badge key={idx} variant="outline">{specialty}</Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Available Experiences</h4>
              <div className="space-y-2">
                {selectedArtisan.available_experiences.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium">{exp.name}</span>
                      <span className="text-gray-600 ml-2">({exp.duration})</span>
                    </div>
                    <span className="font-bold text-green-600">{exp.price} MAD</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-1">Cultural Preservation Story</h4>
              <p className="text-blue-700 text-sm">{selectedArtisan.preservation_story}</p>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => setShowArtisanDetails(false)}
                variant="outline"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowArtisanDetails(false);
                  setShowBookingFlow(true);
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Book Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );

  const renderVideoModal = () => (
    showVideoModal && currentVideo && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <Card className="max-w-3xl w-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{currentVideo.description}</h3>
              <Button
                onClick={() => setShowVideoModal(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4">
              <img 
                src={currentVideo.thumbnail}
                alt="Video thumbnail"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/60 rounded-full p-4">
                  <PlayCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                {currentVideo.duration} - Cultural preservation documentation
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              This video was captured as part of our Cultural Preservation Engine, documenting traditional 
              techniques and stories from master artisans across Morocco.
            </p>
            
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => setShowVideoModal(false)}
                variant="outline"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowVideoModal(false);
                  setShowBookingFlow(true);
                }}
                className="bg-gradient-to-r from-orange-500 to-red-500"
              >
                Book This Artisan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );

  const renderBookingModal = () => {
    return showBookingFlow && selectedArtisan && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Book with {selectedArtisan.name}</h3>
                <p className="text-gray-600">{selectedArtisan.craft} • {selectedArtisan.location}</p>
              </div>
              <Button
                onClick={() => closeBookingModal()}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {bookingStep === 'details' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Choose Experience</label>
                  <select 
                    className="w-full p-2 border rounded-lg"
                    value={bookingData.experience}
                    onChange={(e) => setBookingData({...bookingData, experience: e.target.value})}
                  >
                    <option value="">Select an experience</option>
                    {selectedArtisan.available_experiences.map((exp, idx) => (
                      <option key={idx} value={exp.name}>
                        {exp.name} - {exp.duration} - {exp.price} MAD
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input 
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <select 
                      className="w-full p-2 border rounded-lg"
                      value={bookingData.time}
                      onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Group Size</label>
                  <select 
                    className="w-full p-2 border rounded-lg"
                    value={bookingData.groupSize}
                    onChange={(e) => setBookingData({...bookingData, groupSize: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                  <textarea 
                    className="w-full p-2 border rounded-lg"
                    rows={3}
                    placeholder="Any dietary restrictions, accessibility needs, or special interests..."
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-center space-x-3 pt-4">
                  <Button
                    onClick={() => closeBookingModal()}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setBookingStep('confirmation')}
                    disabled={!bookingData.experience || !bookingData.date || !bookingData.time}
                    className="bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    Continue to Confirmation
                  </Button>
                </div>
              </div>
            )}
            
            {bookingStep === 'confirmation' && (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Booking Summary</h4>
                  <div className="space-y-1 text-sm text-green-700">
                    <div><strong>Experience:</strong> {bookingData.experience}</div>
                    <div><strong>Date:</strong> {bookingData.date}</div>
                    <div><strong>Time:</strong> {bookingData.time}</div>
                    <div><strong>Group:</strong> {bookingData.groupSize} people</div>
                    <div><strong>Phone:</strong> {phone}</div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center text-blue-800 mb-2">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span className="font-semibold">WhatsApp Confirmation</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    You'll receive booking confirmation and details via WhatsApp at {phone}. 
                    The artisan will also contact you directly to coordinate meeting location and any final details.
                  </p>
                </div>
                
                <div className="flex justify-center space-x-3 pt-4">
                  <Button
                    onClick={() => setBookingStep('details')}
                    variant="outline"
                  >
                    ← Back to Edit
                  </Button>
                  <Button
                    onClick={() => {
                      closeBookingModal();
                      // Here you would normally make API call to confirm booking
                      alert(`Booking confirmed! You'll receive WhatsApp confirmation at ${phone}`);
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Confirm Booking
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderQRScannerModal = () => (
    showQRScanner && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Scan Artisan QR Codes</h3>
              <Button
                onClick={() => setShowQRScanner(false)}
                variant="ghost"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-8 mb-4 text-center">
              <Camera className="w-16 h-16 text-white mx-auto mb-4" />
              <p className="text-white mb-2">Point camera at QR code</p>
              <p className="text-gray-400 text-sm">Found at artisan workshops, souks, and cultural centers</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <div className="flex items-center text-blue-800 mb-2">
                <Info className="w-4 h-4 mr-2" />
                <span className="font-semibold">How it works</span>
              </div>
              <div className="space-y-1 text-sm text-blue-700">
                <div>• Scan QR codes to unlock artisan stories</div>
                <div>• Each scan adds to your Explorer Pass</div>
                <div>• Discover hidden workshops and authentic experiences</div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => setShowQRScanner(false)}
                variant="outline"
              >
                Close Scanner
              </Button>
              <Button
                onClick={() => {
                  setShowQRScanner(false);
                  // In real app, would activate camera
                  alert('Camera access would be requested here in production');
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      
      <style jsx global>{`
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        .font-sans {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      
      {currentStep === 'landing' && renderLanding()}
      {currentStep === 'verification' && renderVerification()}
      {currentStep === 'scan' && renderScan()}
      {currentStep === 'story' && renderStory()}
      {currentStep === 'explorer-pass' && renderExplorerPass()}
      {currentStep === 'preferences' && renderPreferences()}
      {currentStep === 'matching' && renderMatching()}
      {currentStep === 'results' && renderResults()}

      {/* Modal Components */}
      {renderArtisanDetailsModal()}
      {renderVideoModal()}
      {renderBookingModal()}
      {renderQRScannerModal()}
    </div>
  );
} 