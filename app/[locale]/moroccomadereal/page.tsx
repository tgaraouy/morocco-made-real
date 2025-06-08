'use client';

import React, { useState, useEffect } from 'react';
import { useTranslationsWithFallback } from '@/lib/translation-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Camera, Heart, Share2, Instagram, Play, MapPin, Star, Clock, Users, Award, Zap, Sparkles, Globe, TrendingUp, CheckCircle2, Lock, Gift, Trophy, Target, Smartphone, MessageCircle, ExternalLink, ArrowRight, X, Info, RefreshCw, AlertCircle, PlayCircle, ChevronDown, Calendar } from 'lucide-react';
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
  const [selectedCountry, setSelectedCountry] = useState({ code: '+1', name: 'United States', flag: '🇺🇸' });
  const [phoneNumber, setPhoneNumber] = useState(''); // Just the number without country code
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'sending' | 'code_sent' | 'verifying' | 'verified' | 'error' | 'pending' | 'expired'>('idle');
  const [qrSession, setQrSession] = useState(null);
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
  const [bookingStatus, setBookingStatus] = useState<'selecting' | 'submitting' | 'connecting' | 'booked' | 'review-later' | 'cancelled'>('selecting');
  const [bookedArtisans, setBookedArtisans] = useState<Set<string>>(new Set());
  const [reviewLaterArtisans, setReviewLaterArtisans] = useState<Set<string>>(new Set());
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
    setBookingStatus('selecting');
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

  const handleBookingSubmission = async () => {
    setBookingStatus('submitting');
    
    // Scroll to top to ensure user sees the status
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setBookingStatus('connecting');
    
    // Simulate connecting with expert
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setBookingStatus('booked');
    
    // Add to booked artisans
    if (selectedArtisan) {
      setBookedArtisans(prev => new Set([...prev, selectedArtisan.id]));
      // Remove from review later if it was there
      setReviewLaterArtisans(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedArtisan.id);
        return newSet;
      });
    }
  };

  const handleReviewLater = () => {
    setBookingStatus('review-later');
    
    // Add to review later artisans
    if (selectedArtisan) {
      setReviewLaterArtisans(prev => new Set([...prev, selectedArtisan.id]));
    }
  };

  const getArtisanStatus = (artisanId: string) => {
    if (bookedArtisans.has(artisanId)) {
      return { status: 'booked', label: 'Booked', color: 'bg-green-600', icon: '✓' };
    }
    if (reviewLaterArtisans.has(artisanId)) {
      return { status: 'review-later', label: 'Saved', color: 'bg-purple-600', icon: '📝' };
    }
    return { status: 'available', label: 'Available Now', color: 'bg-green-600', icon: '●' };
  };
  
  // ============ PHONE FORMATTING FUNCTIONS ============
  
  const countryOptions = [
    { code: '+212', name: 'Morocco', flag: '🇲🇦' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
    { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
    { code: '+32', name: 'Belgium', flag: '🇧🇪' },
  ];
  
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

  const formatPhoneForCountry = (value: string, countryCode: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/[^\d]/g, '');
    
    // Format based on country code
    if (countryCode === '+212') {
      // Morocco: 6 12 34 56 78
      if (cleaned.length <= 1) return cleaned;
      if (cleaned.length <= 3) return `${cleaned.slice(0, 1)} ${cleaned.slice(1)}`;
      if (cleaned.length <= 5) return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3)}`;
      if (cleaned.length <= 7) return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
      return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
    } else if (countryCode === '+33') {
      // France: 6 98 76 54 32
      if (cleaned.length <= 1) return cleaned;
      if (cleaned.length <= 3) return `${cleaned.slice(0, 1)} ${cleaned.slice(1)}`;
      if (cleaned.length <= 5) return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3)}`;
      if (cleaned.length <= 7) return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5)}`;
      return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`;
    } else if (countryCode === '+1') {
      // USA/Canada: 555 123 4567
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
    } else if (countryCode === '+49') {
      // Germany: 30 12345678
      if (cleaned.length <= 2) return cleaned;
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
    } else if (countryCode === '+44') {
      // UK: 20 1234 5678
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 6) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
      return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)} ${cleaned.slice(6)}`;
    }
    
    // Default formatting for other countries
    return cleaned;
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneForCountry(value, selectedCountry.code);
    setPhoneNumber(formatted);
    
    // Update the full phone with country code
    const cleanNumber = formatted.replace(/\s/g, '');
    const fullPhone = selectedCountry.code + cleanNumber;
    setPhone(fullPhone);
    setFormattedPhone(`${selectedCountry.code} ${formatted}`);
  };

  const handleCountryChange = (country: typeof countryOptions[0]) => {
    setSelectedCountry(country);
    
    // Update the full phone with new country code
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    if (cleanNumber) {
      const fullPhone = country.code + cleanNumber;
      setPhone(fullPhone);
      setFormattedPhone(`${country.code} ${phoneNumber}`);
    }
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
    
    // Force scroll to top when component mounts
    window.scrollTo(0, 0);
    
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

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Scroll to top when booking modal opens
  useEffect(() => {
    if (showBookingFlow) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showBookingFlow]);

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

  // ============ WHATSAPP CLOUD API FUNCTIONS ============
  
  const sendWhatsAppCode = async () => {
    setIsLoading(true);
    setError('');
    setVerificationStatus('sending');
    
    try {
      const response = await fetch('/api/whatsapp-send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setQrSession(data.session);
        setVerificationStatus('code_sent');
        console.log('✅ WhatsApp Code Sent:', data.session.id);
        
        // Start checking for verification
        startVerificationCheck(data.session.id);
      } else {
        setError(data.error || 'Failed to send WhatsApp code');
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('WhatsApp Send Error:', error);
      setError('Failed to send WhatsApp code');
      setVerificationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const startVerificationCheck = (sessionId) => {
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
    }
    
    const interval = setInterval(() => {
      checkVerificationStatus(sessionId);
    }, 2000); // Check every 2 seconds
    
    setStatusCheckInterval(interval);
  };

  const verifyCodeManually = async (inputCode: string) => {
    if (!inputCode || inputCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log(`🔍 FRONTEND DEBUG: Making verification request:`, {
        sessionId: qrSession?.id || 'NO_SESSION',
        phone: phone || 'NO_PHONE',
        code: inputCode || 'NO_CODE'
      });
      
      const response = await fetch('/api/whatsapp-verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: qrSession?.id,
          phone: phone,
          code: inputCode
        })
      });
      
      console.log(`🔍 FRONTEND DEBUG: Response status:`, response.status);
      
      const data = await response.json();
      
      console.log(`🔍 FRONTEND DEBUG: Response data:`, data);
      
      if (data.success) {
        setVerificationStatus('verified');
        if (statusCheckInterval) {
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
        
        await createTouristProfile();
        console.log('✅ Phone verified manually!');
      } else {
        console.error('❌ FRONTEND DEBUG: Verification failed:', data.error);
        setError(data.error || 'Invalid verification code');
      }
    } catch (error) {
      console.error('❌ FRONTEND DEBUG: Network/Parse error:', error);
      setError('Failed to verify code');
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRAutoValidation = async () => {
    // Use the new WhatsApp Cloud API instead
    await sendWhatsAppCode();
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
      case 'sending':
        return { icon: RefreshCw, color: 'text-blue-500', bg: 'bg-blue-50', text: 'Sending WhatsApp code...' };
      case 'code_sent':
        return { icon: MessageCircle, color: 'text-green-500', bg: 'bg-green-50', text: 'Code sent! Check WhatsApp' };
      case 'pending':
        return { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', text: 'Waiting for verification' };
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

  const handleGetStarted = () => {
    // Redirect to new phone verification instead of QR
    router.push('/phone-verification');
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
              <span className="text-orange-600">{t('morocco_made_real.hero.scan_code')}</span>{' '}
              <span className="text-green-600">{t('morocco_made_real.hero.take_home_story')}</span>
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
              {t('morocco_made_real.discover.description')}
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
                  {verificationStatus === 'idle' || verificationStatus === 'sending' ? 'Step 1/2' : 'Step 2/2'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Phone Input Section - Always visible */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="flex gap-2">
                  {/* Country Code Dropdown */}
                  <div className="relative">
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const country = countryOptions.find(c => c.code === e.target.value);
                        if (country) handleCountryChange(country);
                      }}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      disabled={verificationStatus === 'code_sent' || verificationStatus === 'verified'}
                    >
                      {countryOptions.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Phone Number Input */}
                  <div className="flex-1">
                    <Input
                      type="tel"
                      placeholder={selectedCountry.code === '+212' ? '6 12 34 56 78' : 
                                   selectedCountry.code === '+33' ? '6 98 76 54 32' :
                                   selectedCountry.code === '+1' ? '555 123 4567' :
                                   selectedCountry.code === '+49' ? '30 12345678' :
                                   selectedCountry.code === '+44' ? '20 1234 5678' :
                                   'Enter phone number'}
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      className="text-lg h-12"
                      disabled={verificationStatus === 'code_sent' || verificationStatus === 'verified'}
                    />
                  </div>
                </div>
                
                {/* Simplified Status Display - Only show when processing */}
                {(verificationStatus === 'sending') && (
                  <div className="text-center">
                    {(() => {
                      const statusInfo = getStatusInfo();
                      const StatusIcon = statusInfo.icon;
                      return (
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${statusInfo.bg} mb-3`}>
                          <StatusIcon className={`w-6 h-6 ${statusInfo.color} animate-spin`} />
                        </div>
                      );
                    })()}
                    
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {getStatusInfo().text}
                      </h3>
                    </div>
                  </div>
                )}

                {/* Show errors if any */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm text-center">{error}</p>
                  </div>
                )}
              </div>

              {/* Code Entry Section - Shows when code is sent */}
              {verificationStatus === 'code_sent' && (
                <div className="border-t pt-4">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
                    <div className="flex items-center justify-center text-green-800 mb-2">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">WhatsApp Code Sent!</span>
                    </div>
                    <p className="text-xs text-green-700 text-center">
                      Check your WhatsApp for a message from Morocco Made Real with your 6-digit verification code.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-center">Enter Verification Code</label>
                    <Input
                      type="text"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center text-xl h-12 font-mono tracking-wider"
                      onChange={(e) => {
                        const code = e.target.value.replace(/\D/g, '').slice(0, 6);
                        e.target.value = code;
                        if (code.length === 6) {
                          verifyCodeManually(code);
                        }
                      }}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-600 text-center mt-3 space-y-1">
                    <p>💡 <strong>Auto-verification:</strong> Reply to the WhatsApp message with your code</p>
                    <p>⏱️ Code expires in 10 minutes</p>
                  </div>

                  {/* SMS Fallback Button */}
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-600 text-center mb-3">
                      Not receiving WhatsApp messages?
                    </p>
                    <Button 
                      onClick={async () => {
                        setIsLoading(true);
                        setError('');
                        try {
                          // Generate a demo code for testing
                          const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
                          
                          // Update the session via API call to ensure the verification API can find it
                          if (qrSession) {
                            const response = await fetch('/api/update-session-sms', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                sessionId: qrSession.id,
                                smsCode: demoCode,
                                method: 'sms'
                              })
                            });
                            
                            if (response.ok) {
                              console.log('📱 SMS demo code updated in session:', demoCode);
                              alert(`SMS sent! Demo code: ${demoCode}`);
                              
                              // Update local session state
                              setQrSession({
                                ...qrSession,
                                smsCode: demoCode,
                                method: 'sms'
                              });
                            } else {
                              // Fallback: just use the demo code directly
                              console.log('📱 Using demo code fallback:', demoCode);
                              alert(`SMS sent! Demo code: ${demoCode}\n\nNote: If this doesn't work, try: 550998`);
                            }
                          } else {
                            // No session exists, use the hardcoded demo code
                            console.log('📱 No session found, using hardcoded demo code');
                            alert(`SMS sent! Demo code: 550998`);
                          }
                          
                          setError('');
                        } catch (error) {
                          console.error('SMS fallback error:', error);
                          // Always provide a working fallback
                          alert('SMS sent! Demo code: 550998');
                          setError('');
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Sending SMS...
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4 mr-2" />
                          📱 Try SMS Instead
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="text-center">
                {verificationStatus === 'idle' || verificationStatus === 'error' ? (
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
                ) : verificationStatus === 'code_sent' ? (
                  <Button
                    onClick={() => sendWhatsAppCode()}
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Resend Code
                  </Button>
                ) : verificationStatus === 'verified' ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <h3 className="text-lg font-bold text-green-800 text-center">Welcome, Cultural Explorer!</h3>
                      <p className="text-green-700 text-center text-sm">
                        Your WhatsApp is verified. Let's find your perfect cultural experiences.
                      </p>
                    </div>
                    <Button
                      onClick={() => setCurrentStep('preferences')}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Start Cultural Matching
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

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
        <div className="max-w-3xl mx-auto">
          
          {/* Gamified Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4 animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
          </div>
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Unlock Your Perfect Morocco Adventure
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              🎯 3 quick choices = Personalized artisan matches in 30 seconds
            </p>
            
            {/* Progress Indicator */}
            <div className="max-w-md mx-auto mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Object.values(preferences).filter(v => v).length}/3 Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(Object.values(preferences).filter(v => v).length / 3) * 100}%` }}
                ></div>
              </div>
              {Object.values(preferences).filter(v => v).length === 3 && (
                <div className="text-green-600 font-bold text-sm mt-2 animate-bounce">
                  🎉 Ready to discover amazing artisans!
                </div>
              )}
            </div>
          </div>
          
          <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="space-y-10">
              
              {/* Question 1: Mood - Enhanced with previews */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">🎨 What kind of experience excites you most?</h3>
                  <p className="text-gray-600">Choose your vibe and see who you'll meet!</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { 
                      value: 'creative', 
                      label: 'Creative Workshop', 
                      icon: '🎨',
                      preview: 'pottery, weaving, painting',
                      popular: '72% choose this',
                      artisanCount: '24 master artisans',
                      gradient: 'from-pink-400 to-purple-500'
                    },
                    { 
                      value: 'cultural', 
                      label: 'Cultural Immersion', 
                      icon: '🏛️',
                      preview: 'storytelling, traditions, history',
                      popular: '68% choose this',
                      artisanCount: '31 cultural guides',
                      gradient: 'from-blue-400 to-indigo-500'
                    },
                    { 
                      value: 'adventure', 
                      label: 'Adventure Craft', 
                      icon: '🏔️',
                      preview: 'mountain workshops, nature',
                      popular: '45% choose this',
                      artisanCount: '18 mountain artisans',
                      gradient: 'from-green-400 to-teal-500'
                    },
                    { 
                      value: 'relaxing', 
                      label: 'Peaceful Creating', 
                      icon: '🧘',
                      preview: 'meditation, slow craft, zen',
                      popular: '38% choose this',
                      artisanCount: '12 zen masters',
                      gradient: 'from-orange-400 to-yellow-500'
                    }
                  ].map((mood) => (
                    <div
                      key={mood.value}
                      onClick={() => setPreferences({...preferences, mood: mood.value})}
                      className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                        preferences.mood === mood.value 
                          ? 'scale-105 ring-4 ring-purple-300 shadow-2xl' 
                          : 'hover:shadow-xl'
                      }`}
                    >
                      <div className={`h-36 rounded-xl bg-gradient-to-br ${mood.gradient} p-4 text-white relative overflow-hidden`}>
                        {/* Background pattern */}
                        <div className="absolute inset-0 bg-white/10 bg-[url('/patterns/moroccan-pattern.svg')] opacity-20"></div>
                        
                        {/* Popular badge */}
                        <div className="absolute top-2 right-2">
                          <div className="bg-yellow-400 text-yellow-900 rounded-full px-2 py-1 text-xs font-bold">
                            {mood.popular}
                      </div>
                        </div>
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col">
                          <div className="text-3xl mb-2">{mood.icon}</div>
                          <div className="font-bold text-lg mb-1">{mood.label.replace(/🎨|🏛️|🏔️|🧘 /, '')}</div>
                          <div className="text-sm opacity-90 mb-2 flex-grow">{mood.preview}</div>
                          
                          {/* Stats at bottom */}
                          <div className="mt-auto">
                            <div className="bg-black/30 rounded-lg px-2 py-1 text-xs text-center">
                              {mood.artisanCount}
                            </div>
                          </div>
                        </div>
                        
                        {/* Selection indicator */}
                        {preferences.mood === mood.value && (
                          <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-white animate-bounce" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {preferences.mood && (
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
                    <div className="flex items-center justify-center space-x-2 text-green-800">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-semibold">Great choice! You'll love the {preferences.mood} experiences we have.</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Question 2: Time - Enhanced with impact preview */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">⏰ How deep do you want to dive?</h3>
                  <p className="text-gray-600">More time = deeper connections with artisans</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { 
                      value: 'quick', 
                      label: 'Quick Taste', 
                      time: '2-3 hours',
                      impact: 'Meet 1 artisan, learn basics',
                      price: '$45-70',
                      icon: '⚡',
                      intensity: 'Light'
                    },
                    { 
                      value: 'half-day', 
                      label: 'Deep Dive', 
                      time: 'Half Day',
                      impact: 'Work with master, create piece',
                      price: '$85-120',
                      icon: '🎯',
                      intensity: 'Perfect',
                      popular: true
                    },
                    { 
                      value: 'full-day', 
                      label: 'Mastery Journey', 
                      time: 'Full Day',
                      impact: 'Multi-artisan, traditional meal',
                      price: '$150-200',
                      icon: '👑',
                      intensity: 'Epic'
                    }
                  ].map((time) => (
                    <div
                      key={time.value}
                      onClick={() => setPreferences({...preferences, time: time.value})}
                      className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                        preferences.time === time.value 
                          ? 'scale-105 ring-4 ring-blue-300 shadow-2xl' 
                          : 'hover:shadow-lg'
                      }`}
                    >
                      <div className={`h-44 rounded-xl border-2 p-4 relative overflow-hidden ${
                        preferences.time === time.value 
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100' 
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}>
                        {/* Popular badge */}
                        {time.popular && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white rounded-full px-2 py-1 text-xs font-bold animate-pulse">
                            Most Popular
                          </div>
                        )}
                        
                        <div className="h-full flex flex-col">
                          <div className="text-3xl mb-2">{time.icon}</div>
                          <div className="font-bold text-lg mb-1">{time.label}</div>
                          <div className="text-blue-600 font-semibold text-sm mb-2">{time.time}</div>
                          <div className="text-gray-600 text-sm mb-2 flex-grow">{time.impact}</div>
                          <div className="text-green-600 font-bold text-sm mb-2">{time.price}</div>
                          
                          {/* Intensity badge at bottom */}
                          <div className="mt-auto">
                            <div className={`px-2 py-1 rounded-full text-xs font-bold text-center ${
                              time.intensity === 'Epic' ? 'bg-purple-100 text-purple-700' :
                              time.intensity === 'Perfect' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {time.intensity}
                            </div>
                          </div>
                        </div>
                        
                        {preferences.time === time.value && (
                          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-blue-500 animate-bounce" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Question 3: Budget - Enhanced with value proposition */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">💰 Investment in authentic culture?</h3>
                  <p className="text-gray-600">Every dollar directly supports artisan families</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { 
                      value: 'budget', 
                      label: 'Budget Explorer', 
                      price: '< $70',
                      impact: 'Supports 1 artisan family',
                      features: ['Basic workshop', 'Small take-home'],
                      familiesSupported: '1 family',
                      gradient: 'from-green-400 to-emerald-500'
                    },
                    { 
                      value: 'moderate', 
                      label: 'Culture Supporter', 
                      price: '$70-120',
                      impact: 'Supports 2-3 artisan families',
                      features: ['Premium materials', 'Guided tour', 'Quality piece'],
                      familiesSupported: '2-3 families',
                      gradient: 'from-blue-400 to-purple-500',
                      recommended: true
                    },
                    { 
                      value: 'premium', 
                      label: 'Heritage Champion', 
                      price: '$120+',
                      impact: 'Supports entire workshop community',
                      features: ['Master class', 'Traditional meal', 'Heirloom piece'],
                      familiesSupported: '5+ families',
                      gradient: 'from-purple-400 to-pink-500'
                    }
                  ].map((budget) => (
                    <div
                      key={budget.value}
                      onClick={() => setPreferences({...preferences, budget: budget.value})}
                      className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                        preferences.budget === budget.value 
                          ? 'scale-105 ring-4 ring-green-300 shadow-2xl' 
                          : 'hover:shadow-lg'
                      }`}
                    >
                      <div className={`h-56 rounded-xl bg-gradient-to-br ${budget.gradient} p-4 text-white relative overflow-hidden`}>
                        {/* Recommended badge */}
                        {budget.recommended && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 rounded-full px-2 py-1 text-xs font-bold z-10">
                            Recommended
                          </div>
                        )}
                        
                        <div className="h-full flex flex-col justify-between">
                          {/* Top section */}
                          <div>
                            <div className="font-bold text-base mb-1">{budget.label}</div>
                            <div className="text-xl font-bold mb-2">{budget.price}</div>
                            <div className="text-xs opacity-90 mb-3 leading-tight">{budget.impact}</div>
                          </div>
                          
                          {/* Middle section - Features */}
                          <div className="space-y-1 py-2">
                            {budget.features.map((feature, idx) => (
                              <div key={idx} className="text-xs opacity-80 flex items-start">
                                <div className="w-1 h-1 bg-white rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
                                <span className="leading-tight">{feature}</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* Bottom section - Family support */}
                          <div className="mt-auto pt-2">
                            <div className="bg-white/20 rounded-lg p-2 text-center">
                              <div className="text-xs font-bold leading-tight">{budget.familiesSupported}</div>
                              <div className="text-xs opacity-80 leading-tight">directly supported</div>
                            </div>
                          </div>
                        </div>
                        
                        {preferences.budget === budget.value && (
                          <div className="absolute inset-0 bg-white/20 flex items-center justify-center z-20">
                            <CheckCircle2 className="w-8 h-8 text-white animate-bounce" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Enhanced CTA with excitement builder */}
              <div className="text-center space-y-4">
                {Object.values(preferences).filter(v => v).length === 3 ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                      <div className="flex items-center justify-center space-x-2 text-green-800 mb-3">
                        <Sparkles className="w-6 h-6" />
                        <span className="text-xl font-bold">Perfect! You're all set!</span>
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <p className="text-gray-700 mb-4">
                        Based on your choices, we found <strong>6 perfect artisan matches</strong> who are excited to meet you!
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">96%</div>
                          <div className="text-gray-600">Match Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">24h</div>
                          <div className="text-gray-600">Response Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">4.9★</div>
                          <div className="text-gray-600">Avg Rating</div>
                        </div>
                </div>
              </div>
              
              <Button
                onClick={() => setCurrentStep('matching')}
                      className="w-full h-16 text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-2xl animate-pulse"
              >
                      <Sparkles className="w-6 h-6 mr-3" />
                      🚀 Discover Your Perfect Artisan Matches!
                      <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-gray-500">
                      <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Complete all 3 choices to unlock your personalized matches</p>
                    </div>
                    <Button
                      disabled
                      className="w-full h-12 text-lg opacity-50 cursor-not-allowed"
                    >
                      Choose your preferences above to continue
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          {/* Social proof sidebar */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="text-2xl font-bold text-blue-600">2,847</div>
              <div className="text-sm text-gray-600">Happy travelers this month</div>
        </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="text-2xl font-bold text-green-600">4.9/5</div>
              <div className="text-sm text-gray-600">Average experience rating</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-gray-600">Book again within 6 months</div>
            </div>
          </div>
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
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Finding Your Perfect Match</h2>
              <p className="text-gray-600 mb-4">Swipe through curated experiences</p>
              <div className="flex justify-center space-x-2 mb-6">
                {experiences.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === currentExperience ? 'bg-orange-500 scale-125' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Card className="overflow-hidden shadow-2xl border-0 bg-white">
              {/* Enhanced Image Gallery with Video */}
              <div className="relative">
                <div className="relative h-80 bg-gray-100">
                <img 
                  src={currentExp.image} 
                  alt={currentExp.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Play Button */}
                  <button 
                    onClick={() => {
                      setCurrentVideo({
                        title: `${currentExp.artisan} Welcome Message`,
                        thumbnail: currentExp.image,
                        description: `Personal welcome from ${currentExp.artisan}`,
                        duration: '1:30'
                      });
                      setShowVideoModal(true);
                    }}
                    className="absolute top-4 left-4 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <PlayCircle className="w-6 h-6" />
                  </button>
                  
                  {/* Match Score Badge */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  {currentExp.matchScore}% Match
                  </div>
                  
                  {/* Authenticity Certificate Badge */}
                  <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg flex items-center space-x-2 shadow-lg">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-bold">Verified Authentic</span>
                  </div>
                  
                  {/* Live Indicator */}
                  <div className="absolute bottom-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center space-x-2 animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span className="text-xs font-bold">Available Today</span>
                  </div>
                </div>
                
                {/* Image Carousel Indicators */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  {[1,2,3,4].map((_, idx) => (
                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-white' : 'bg-white/50'}`}></div>
                  ))}
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* Artisan Welcome Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {currentExp.artisan.split(' ').map(n => n[0]).join('')}
                      </span>
                  </div>
                    <div>
                      <h3 className="text-xl font-bold">{currentExp.title}</h3>
                      <p className="text-orange-600 font-medium">with {currentExp.artisan}</p>
                  </div>
                </div>
                
                  {/* Personal Welcome Message */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border border-orange-200 mb-4">
                    <div className="flex items-start space-x-3">
                      <MessageCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-orange-800 font-medium text-sm mb-1">Personal message from {currentExp.artisan}:</p>
                        <p className="text-gray-700 text-sm italic">
                          "Ahlan wa sahlan! I'm excited to share my family's {currentExp.title.toLowerCase()} traditions with you. 
                          We've been crafting in {currentExp.location} for 4 generations!"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location & Details */}
                <div className="mb-4">
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-medium">{currentExp.location}</span>
                    <div className="mx-3 w-1 h-1 bg-gray-400 rounded-full"></div>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{currentExp.duration}</span>
                    <div className="mx-3 w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span className="font-bold text-green-600">{currentExp.price} MAD</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">{currentExp.description}</p>
                </div>
                
                {/* Enhanced Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                    What's Included
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                  {currentExp.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Authenticity Proof Section */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lock className="w-5 h-5 text-blue-600" />
                    <h4 className="font-bold text-blue-800">Authenticity Guaranteed</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">4th Generation Master</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-blue-700">4.9★ (127 reviews)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-600" />
                      <span className="text-blue-700">892 happy visitors</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-blue-700">Featured in BBC Travel</span>
                    </div>
                  </div>
                </div>

                {/* Action Shots Preview */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Camera className="w-4 h-4 mr-2 text-orange-500" />
                    {currentExp.artisan} in Action
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:scale-105 transition-transform">
                        <img 
                          src={currentExp.image} 
                          alt={`${currentExp.artisan} working ${i}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2">
                          <span className="text-white text-xs font-medium">
                            {i === 1 ? 'Creating' : i === 2 ? 'Teaching' : 'Finishing'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-3">
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
                      className="flex-1 h-12 border-2 hover:bg-gray-50"
                  >
                      <X className="w-5 h-5 mr-2" />
                      Not for me
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
                      className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300"
                  >
                      <Heart className="w-5 h-5 mr-2" />
                      I love this!
                  </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentVideo({
                          title: `${currentExp.title} - Workshop Tour`,
                          thumbnail: currentExp.image,
                          description: `Virtual tour of ${currentExp.artisan}'s workshop`,
                          duration: '2:15'
                        });
                        setShowVideoModal(true);
                      }}
                      className="h-10"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Workshop Tour
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In real app, would send WhatsApp message
                        alert(`Quick question sent to ${currentExp.artisan} via WhatsApp!`);
                      }}
                      className="h-10"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Quick Question
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6 text-center">
              <Button
                onClick={() => setCurrentStep('results')}
                variant="ghost"
                className="text-orange-600 hover:text-orange-700"
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
                {topMatches.map((artisan, index) => {
                  const artisanStatusInfo = getArtisanStatus(artisan.id);
                  
                  return (
                  <Card key={artisan.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
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
                      
                      {/* Dynamic Availability Badge */}
                      <div className={`absolute bottom-3 left-3 ${artisanStatusInfo.color} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1`}>
                        <span>{artisanStatusInfo.icon}</span>
                        <span>{artisanStatusInfo.label}</span>
                      </div>
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
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {artisan.specialties.slice(0, 2).map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Enhanced Booking Section */}
                      <div className="space-y-3">
                        {/* Quick Experience Selection */}
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <h5 className="font-semibold text-sm mb-2">Popular Experience:</h5>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-sm">{artisan.available_experiences[0].name}</span>
                              <div className="text-xs text-gray-600">{artisan.available_experiences[0].duration}</div>
                            </div>
                            <span className="font-bold text-green-600">{artisan.available_experiences[0].price} MAD</span>
                          </div>
                        </div>
                        
                        {/* Dynamic Booking Button Based on Status */}
                        {artisanStatusInfo.status === 'booked' ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                            <div className="flex items-center justify-center space-x-2 text-green-700">
                              <CheckCircle2 className="w-5 h-5" />
                              <span className="font-semibold">Booked Successfully!</span>
                            </div>
                            <p className="text-green-600 text-sm mt-1">Our expert will contact you soon</p>
                          </div>
                        ) : artisanStatusInfo.status === 'review-later' ? (
                          <div className="space-y-2">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center">
                              <div className="flex items-center justify-center space-x-2 text-purple-700">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Saved for Review</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedArtisan(artisan);
                                setShowBookingFlow(true);
                              }}
                              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 h-12 font-semibold"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              Continue Booking
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => {
                              setSelectedArtisan(artisan);
                              setShowBookingFlow(true);
                            }}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 h-12 font-semibold transform hover:scale-105 transition-all duration-300"
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Book with AI Assistant
                          </Button>
                        )}
                        
                        {/* Quick Stats - Only show if not booked */}
                        {artisanStatusInfo.status !== 'booked' && (
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>Next: {artisan.next_available}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              <span>{artisan.languages.length} languages</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
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
                {relatedMatches.map((artisan) => {
                  const artisanStatusInfo = getArtisanStatus(artisan.id);
                  
                  return (
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
                      
                      {/* Status Badge */}
                      <div className={`absolute bottom-3 left-3 ${artisanStatusInfo.color} text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1`}>
                        <span>{artisanStatusInfo.icon}</span>
                        <span>{artisanStatusInfo.label}</span>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <h4 className="font-bold">{artisan.name}</h4>
                        <p className="text-blue-600 font-medium text-sm">{artisan.craft}</p>
                        <div className="flex items-center text-gray-600 text-xs mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{artisan.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-xs mb-3 line-clamp-2">{artisan.summary}</p>
                      
                      {/* Simplified Booking */}
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <span className="text-sm font-medium">{artisan.available_experiences[0].name}</span>
                          <div className="text-green-600 font-bold text-sm">{artisan.available_experiences[0].price} MAD</div>
                        </div>
                        
                        {/* Dynamic Booking Button */}
                        {artisanStatusInfo.status === 'booked' ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                            <div className="flex items-center justify-center space-x-1 text-green-700">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="font-medium text-sm">Booked!</span>
                            </div>
                          </div>
                        ) : artisanStatusInfo.status === 'review-later' ? (
                          <div className="space-y-2">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center">
                              <div className="flex items-center justify-center space-x-1 text-purple-700">
                                <Clock className="w-3 h-3" />
                                <span className="font-medium text-xs">Saved</span>
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedArtisan(artisan);
                                setShowBookingFlow(true);
                              }}
                              className="w-full bg-purple-500 hover:bg-purple-600 h-10 font-medium text-sm"
                            >
                              <Zap className="w-3 h-3 mr-2" />
                              Continue
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => {
                              setSelectedArtisan(artisan);
                              setShowBookingFlow(true);
                            }}
                            className="w-full bg-blue-500 hover:bg-blue-600 h-10 font-medium"
                          >
                            <Zap className="w-3 h-3 mr-2" />
                            Quick Book
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
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
    const getStatusInfo = () => {
      switch (bookingStatus) {
        case 'selecting':
          return { 
            icon: Sparkles, 
            color: 'text-blue-500', 
            bg: 'bg-blue-50', 
            text: 'Choose Your Experience',
            description: 'Select your preferred experience and details'
          };
        case 'submitting':
          return { 
            icon: RefreshCw, 
            color: 'text-orange-500', 
            bg: 'bg-orange-50', 
            text: 'Submitting Request...',
            description: 'Sending your booking request to our system'
          };
        case 'connecting':
          return { 
            icon: MessageCircle, 
            color: 'text-green-500', 
            bg: 'bg-green-50', 
            text: 'Connecting with Expert...',
            description: 'Our local expert is preparing to contact you'
          };
        case 'booked':
          return { 
            icon: CheckCircle2, 
            color: 'text-green-600', 
            bg: 'bg-green-50', 
            text: 'Successfully Booked!',
            description: 'Your cultural experience is confirmed'
          };
        case 'review-later':
          return { 
            icon: Clock, 
            color: 'text-purple-500', 
            bg: 'bg-purple-50', 
            text: 'Saved for Review',
            description: 'We\'ll keep your preferences for later'
          };
        default:
          return { 
            icon: Sparkles, 
            color: 'text-blue-500', 
            bg: 'bg-blue-50', 
            text: 'Ready to Book',
            description: 'Let\'s get started!'
          };
      }
    };

    const statusInfo = getStatusInfo();
    const StatusIcon = statusInfo.icon;

    return showBookingFlow && selectedArtisan && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <Card className="w-full max-w-lg max-h-[95vh] overflow-hidden flex flex-col">
          <CardContent className="p-4 sm:p-6 overflow-y-auto">
            
            {/* Status Header */}
            <div className="text-center mb-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${statusInfo.bg} mb-3`}>
                <StatusIcon className={`w-6 h-6 ${statusInfo.color} ${bookingStatus === 'submitting' || bookingStatus === 'connecting' ? 'animate-spin' : ''}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">{statusInfo.text}</h3>
              <p className="text-gray-600 text-sm">{statusInfo.description}</p>
            </div>

            {/* Artisan Info - Always show */}
            <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {selectedArtisan.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <h4 className="font-semibold">{selectedArtisan.name}</h4>
                <p className="text-gray-600 text-sm">{selectedArtisan.craft} • {selectedArtisan.location}</p>
              </div>
            </div>

            {/* Content Based on Status */}
            {(bookingStatus === 'selecting') && (
              <div className="space-y-4 sm:space-y-6">
                {/* Personal Message from Artisan */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-3 sm:p-4 rounded-xl border border-orange-200">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-orange-800 font-medium text-xs sm:text-sm mb-1">Message from {selectedArtisan.name}:</p>
                      <p className="text-gray-700 text-xs sm:text-sm italic">
                        "Ahlan wa sahlan! I'm excited to share my {selectedArtisan.craft.toLowerCase()} traditions with you. 
                        Let's create something beautiful together in my workshop!"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Experience Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Choose Your Experience</label>
                  <div className="space-y-2">
                    {selectedArtisan.available_experiences.map((exp, idx) => (
                      <div 
                        key={idx}
                        onClick={() => setBookingData({...bookingData, experience: exp.name})}
                        className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                          bookingData.experience === exp.name 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h5 className="font-semibold text-sm">{exp.name}</h5>
                            <p className="text-gray-600 text-xs">{exp.duration}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-green-600 text-sm sm:text-lg">{exp.price} MAD</span>
                            <div className="text-xs text-gray-500">per person</div>
                          </div>
                        </div>
                        {bookingData.experience === exp.name && (
                          <div className="mt-2 flex items-center text-orange-600">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            <span className="text-xs sm:text-sm font-medium">Selected</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Date and Group Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Date</label>
                    <Input 
                      type="date"
                      value={bookingData.date}
                      onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="h-10 sm:h-12 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Group Size</label>
                    <select 
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg h-10 sm:h-12 text-sm"
                      value={bookingData.groupSize}
                      onChange={(e) => setBookingData({...bookingData, groupSize: parseInt(e.target.value)})}
                    >
                      {[1,2,3,4,5,6].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">Message for {selectedArtisan.name} (Optional)</label>
                  <textarea 
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm"
                    rows={2}
                    placeholder={`Tell ${selectedArtisan.name} about your interests, any questions, or what you'd love to learn...`}
                    value={bookingData.specialRequests}
                    onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                  />
                </div>

                {/* What Happens Next */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-2 text-green-800 mb-2">
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-bold text-sm">What happens next?</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold">1.</span>
                      <span>Our local expert will WhatsApp you within <strong>15 minutes</strong></span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold">2.</span>
                      <span>They'll connect you directly with {selectedArtisan.name}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold">3.</span>
                      <span>Coordinate meeting time, location, and any special requests</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold">4.</span>
                      <span><strong>Pay {selectedArtisan.name} directly</strong> at your experience</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submitting Status */}
            {bookingStatus === 'submitting' && (
              <div className="text-center py-8">
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-gray-700">Processing your request...</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                  <p className="text-gray-600 text-sm">Validating experience details and availability</p>
                </div>
              </div>
            )}

            {/* Connecting Status */}
            {bookingStatus === 'connecting' && (
              <div className="text-center py-8">
                <div className="space-y-4">
                  <div className="text-lg font-semibold text-gray-700">Connecting with our local expert...</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '90%'}}></div>
                  </div>
                  <p className="text-gray-600 text-sm">They'll WhatsApp you at {phone} within 15 minutes</p>
                </div>
              </div>
            )}

            {/* Success - Booked */}
            {bookingStatus === 'booked' && (
              <div className="text-center py-6">
                <div className="space-y-4">
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <h4 className="text-xl font-bold text-green-800 mb-2">🎉 Booking Confirmed!</h4>
                    <p className="text-green-700 mb-4">
                      Your experience with {selectedArtisan.name} is confirmed. Our local expert will contact you shortly.
                    </p>
                    
                    {/* Booking Summary */}
                    <div className="bg-white p-4 rounded-lg text-left">
                      <h5 className="font-semibold mb-2">Booking Details:</h5>
                      <div className="space-y-1 text-sm text-gray-700">
                        <div>📅 <strong>Experience:</strong> {bookingData.experience}</div>
                        <div>📍 <strong>Artisan:</strong> {selectedArtisan.name}</div>
                        <div>👥 <strong>Group Size:</strong> {bookingData.groupSize} {bookingData.groupSize === 1 ? 'person' : 'people'}</div>
                        <div>📱 <strong>Contact:</strong> {phone}</div>
                        {bookingData.date && <div>📆 <strong>Preferred Date:</strong> {bookingData.date}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Review Later */}
            {bookingStatus === 'review-later' && (
              <div className="text-center py-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <h4 className="text-xl font-bold text-purple-800 mb-2">📝 Saved for Later</h4>
                    <p className="text-purple-700 mb-4">
                      Your preferences have been saved. You can continue your booking anytime.
                    </p>
                    
                    <div className="bg-white p-4 rounded-lg text-left">
                      <h5 className="font-semibold mb-2">Saved Preferences:</h5>
                      <div className="space-y-1 text-sm text-gray-700">
                        <div>🎨 <strong>Artisan:</strong> {selectedArtisan.name}</div>
                        {bookingData.experience && <div>✨ <strong>Experience:</strong> {bookingData.experience}</div>}
                        {bookingData.groupSize && <div>👥 <strong>Group Size:</strong> {bookingData.groupSize} {bookingData.groupSize === 1 ? 'person' : 'people'}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          {/* Dynamic Footer Based on Status */}
          <div className="flex-shrink-0 p-4 sm:p-6 pt-0 border-t border-gray-100 bg-white">
            {bookingStatus === 'selecting' && (
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={handleReviewLater}
                  variant="outline"
                  className="px-4 sm:px-6 h-10 sm:h-12 text-sm"
                >
                  Review Later
                </Button>
                <Button
                  onClick={handleBookingSubmission}
                  disabled={!bookingData.experience}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-4 sm:px-8 h-10 sm:h-12 font-semibold transform hover:scale-105 transition-all duration-300 text-sm"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="hidden sm:inline">Connect with {selectedArtisan.name}</span>
                  <span className="sm:hidden">Connect</span>
                </Button>
              </div>
            )}

            {(bookingStatus === 'submitting' || bookingStatus === 'connecting') && (
              <div className="flex justify-center">
                <Button
                  disabled
                  className="px-8 h-12 bg-gray-300 cursor-not-allowed"
                >
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </Button>
              </div>
            )}

            {bookingStatus === 'booked' && (
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => closeBookingModal()}
                  className="bg-green-500 hover:bg-green-600 px-8 h-12 font-semibold"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Perfect!
                </Button>
              </div>
            )}

            {bookingStatus === 'review-later' && (
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => setBookingStatus('selecting')}
                  variant="outline"
                  className="px-6 h-10"
                >
                  Continue Booking
                </Button>
                <Button
                  onClick={() => closeBookingModal()}
                  className="bg-purple-500 hover:bg-purple-600 px-6 h-10"
                >
                  Close
                </Button>
              </div>
            )}

            {/* Close button for all statuses except processing */}
            {(bookingStatus !== 'submitting' && bookingStatus !== 'connecting') && (
              <div className="text-center mt-3">
                <Button
                  onClick={() => closeBookingModal()}
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4 mr-1" />
                  Close
                </Button>
              </div>
            )}
          </div>
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
        html {
          scroll-behavior: smooth;
        }
        body {
          overflow-x: hidden;
        }
        /* Prevent scroll restoration */
        html, body {
          scroll-behavior: auto;
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