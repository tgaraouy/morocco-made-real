'use client';

import React, { useState, useEffect } from 'react';
import { Heart, X, User, Settings, BookOpen, CheckCircle2, Star, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { touristProfileService, TouristProfile } from '@/lib/tourist-profile-service';
import { useRouter } from 'next/navigation';

// Mock experiences for demonstration
const mockExperiences = [
  {
    id: 'hassan-pottery',
    title: 'Traditional Pottery Workshop',
    artisan: 'Hassan Benali',
    location: 'Fez Medina',
    duration: '4 hours',
    price: 75,
    image: '/api/placeholder/400/300',
    description: 'Learn ancient pottery techniques from a master craftsman in the heart of Fez.',
    craft: 'Pottery',
    mood: 'creative',
    timeCategory: 'half-day',
    priceCategory: 'moderate',
    matchScore: 95,
    features: ['English-speaking', 'All materials included', 'Take home creation'],
    artisanYears: 25,
    location_detail: 'Traditional workshop in Fez Medina'
  },
  {
    id: 'fatima-weaving',
    title: 'Berber Carpet Weaving',
    artisan: 'Fatima Zahra',
    location: 'Atlas Mountains',
    duration: '6 hours',
    price: 120,
    image: '/api/placeholder/400/300',
    description: 'Discover the ancient art of Berber carpet weaving with indigenous patterns.',
    craft: 'Weaving',
    mood: 'cultural',
    timeCategory: 'full-day',
    priceCategory: 'premium',
    matchScore: 88,
    features: ['Mountain views', 'Traditional lunch', 'Cultural stories'],
    artisanYears: 18,
    location_detail: 'Authentic Berber village in Atlas Mountains'
  },
  {
    id: 'ahmed-leather',
    title: 'Leather Crafting Masterclass',
    artisan: 'Ahmed Tazi',
    location: 'Marrakech Souk',
    duration: '3 hours',
    price: 60,
    image: '/api/placeholder/400/300',
    description: 'Create beautiful leather goods using traditional Moroccan techniques.',
    craft: 'Leather',
    mood: 'creative',
    timeCategory: 'quick',
    priceCategory: 'budget',
    matchScore: 82,
    features: ['Souk tour included', 'Premium leather', 'Custom design'],
    artisanYears: 15,
    location_detail: 'Historic tannery district of Marrakech'
  },
  {
    id: 'youssef-metal',
    title: 'Traditional Metalwork',
    artisan: 'Youssef El Fassi',
    location: 'Fez Medina',
    duration: '5 hours',
    price: 90,
    image: '/api/placeholder/400/300',
    description: 'Forge beautiful metal art pieces using centuries-old techniques.',
    craft: 'Metalwork',
    mood: 'adventurous',
    timeCategory: 'half-day',
    priceCategory: 'moderate',
    matchScore: 76,
    features: ['Traditional tools', 'Fire forging', 'Historical techniques'],
    artisanYears: 20,
    location_detail: 'Ancient metalwork quarter of Fez'
  }
];

export default function CulturalMatchPage() {
  const router = useRouter();
  
  // ============ STATE ============
  const [currentProfile, setCurrentProfile] = useState<TouristProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [experiences, setExperiences] = useState(mockExperiences);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);
  const [bookings, setBookings] = useState<string[]>([]);
  const [savedExperiences, setSavedExperiences] = useState<string[]>([]);
  const [preferences, setPreferences] = useState({
    mood: 'creative',
    timeAvailable: 'half-day',
    priceRange: 'moderate'
  });
  
  // ============ NEW: DETAILED VIEW STATE ============
  const [showDetails, setShowDetails] = useState(false);
  const [showBookingAgent, setShowBookingAgent] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);

  // ============ INITIALIZATION ============
  useEffect(() => {
    initializeProfile();
  }, []);

  const initializeProfile = async () => {
    try {
      // Check if coming from onboarding
      const urlParams = new URLSearchParams(window.location.search);
      const fromOnboarding = urlParams.get('from') === 'onboarding';
      
      if (fromOnboarding) {
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      // Get stored phone or create session profile
      const storedPhone = localStorage.getItem('tourist_phone');
      
      if (storedPhone) {
        console.log('🔍 Loading profile for:', storedPhone);
        
        try {
          // Try to load existing profile
        const profile = await touristProfileService.getProfile(storedPhone);
        
        if (profile && profile.phone_verified) {
          setCurrentProfile(profile);
          
            // Load user data
            if (profile.preferences) {
            setPreferences(profile.preferences);
          }
          
          const saved = await touristProfileService.getSavedExperiences(storedPhone);
          setSavedExperiences(saved);
            setMatches(saved);
          
          const bookingHistory = await touristProfileService.getBookingHistory(storedPhone);
          setBookings(bookingHistory);
          
            console.log('✅ Profile loaded successfully');
        } else {
            createSessionProfile(storedPhone);
          }
        } catch (error) {
          console.log('📱 Creating session profile due to error:', error);
          createSessionProfile(storedPhone);
        }
      } else {
        // No phone found - redirect to onboarding
        console.log('❌ No verified profile found, redirecting to onboarding');
        router.push('/tourist-onboarding');
        return;
      }
    } catch (error) {
      console.error('Error initializing profile:', error);
      // Fallback to onboarding
      router.push('/tourist-onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const createSessionProfile = (phone: string) => {
    console.log('🔧 Creating session profile for:', phone);
    
    const sessionProfile: TouristProfile = {
      id: `session_${Date.now()}`,
      phone: phone,
      phone_verified: true,
      first_name: 'Tourist',
      country_code: phone.startsWith('+212') ? 'MA' : phone.startsWith('+33') ? 'FR' : phone.startsWith('+1') ? 'US' : 'INT',
      preferences: { mood: 'creative', timeAvailable: 'half-day', priceRange: 'moderate' },
      saved_experiences: [],
      booking_history: [],
      preferences_set: true,
      total_bookings: 0,
      total_spent: 0,
      whatsapp_enabled: true,
      sms_enabled: true,
      marketing_consent: false,
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    };
    
    setCurrentProfile(sessionProfile);
  };

  // ============ EXPERIENCE MATCHING ============
  
  const getFilteredExperiences = () => {
    return mockExperiences.filter(exp => {
      const moodMatch = exp.mood === preferences.mood || exp.mood === 'cultural';
      const timeMatch = exp.timeCategory === preferences.timeAvailable;
      const priceMatch = exp.priceCategory === preferences.priceRange;
      
      const score = (moodMatch ? 40 : 0) + (timeMatch ? 30 : 0) + (priceMatch ? 30 : 0);
      return score >= 40;
    }).sort((a, b) => b.matchScore - a.matchScore);
  };

  const filteredExperiences = getFilteredExperiences();
  const currentExperience = filteredExperiences[currentIndex];

  const handleLike = async () => {
    await handleLikeExperience(currentExperience);
  };

  const handlePass = () => {
    console.log('👎 Passed:', currentExperience?.title);
    nextExperience();
  };

  const nextExperience = () => {
    if (currentIndex < filteredExperiences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleBook = async () => {
    if (currentExperience && currentProfile) {
      const bookingId = `${currentExperience.id}-${Date.now()}`;
      
      await touristProfileService.addBooking(
        currentProfile.phone, 
        bookingId, 
        currentExperience.price
      );
      
      setBookings([...bookings, bookingId]);
      
      console.log('🎯 Booked:', currentExperience.title);
      alert(`✅ Booked "${currentExperience.title}" for €${currentExperience.price}!\n\n📱 Confirmation sent to: ${currentProfile.phone}\n💬 WhatsApp confirmation will arrive shortly\n\n🎉 Get ready for an amazing cultural experience!`);
    }
  };

  const updatePreferences = async (newPreferences: any) => {
    setPreferences(newPreferences);
    setCurrentIndex(0); // Reset to first experience
    
    if (currentProfile) {
      await touristProfileService.updatePreferences(currentProfile.phone, newPreferences);
    }
  };

  // ============ LEARN MORE & BOOKING AGENT ============
  
  const handleLearnMore = (experience) => {
    setSelectedExperience(experience);
    setShowDetails(true);
  };

  const handleBookingAgent = (experience) => {
    setSelectedExperience(experience);
    setShowBookingAgent(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedExperience(null);
  };

  const closeBookingAgent = () => {
    setShowBookingAgent(false);
    setSelectedExperience(null);
  };

  const proceedToBooking = async (experience) => {
    // First save the experience if not already saved
    if (!savedExperiences.includes(experience.id)) {
      await handleLikeExperience(experience);
    }
    
    closeDetails();
    handleBookingAgent(experience);
  };

  const handleLikeExperience = async (experience = currentExperience) => {
    if (experience && currentProfile) {
      const newMatches = [...matches, experience.id];
      setMatches(newMatches);
      setSavedExperiences(newMatches);
      
      await touristProfileService.saveExperience(currentProfile.phone, experience.id);
      console.log('💖 Liked:', experience.title);
      
      // Only move to next if this was the current experience being swiped
      if (experience.id === currentExperience?.id) {
        nextExperience();
      }
    }
  };

  // ============ LOADING STATE ============
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <BookOpen className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-lg font-medium text-gray-700">Loading your matches...</div>
          <div className="text-sm text-gray-500">Finding perfect cultural experiences</div>
        </div>
      </div>
    );
  }

  // ============ NO PROFILE FALLBACK ============
  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-6">🇲🇦</div>
          <h2 className="text-2xl font-bold mb-4">Welcome to Morocco!</h2>
          <p className="text-gray-600 mb-8">
            To discover authentic cultural experiences, please complete the onboarding process first.
          </p>
          <Button 
            onClick={() => router.push('/tourist-onboarding')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
    );
  }

  // ============ MAIN UI ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {currentProfile.first_name || 'Tourist'}
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <span>{currentProfile.country_code} • {currentProfile.phone?.slice(-4)}</span>
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {matches.length} saved
              </Badge>
              <Badge variant="outline" className="text-xs">
                {bookings.length} booked
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-sm font-medium text-gray-700 mb-3">Your Activity</div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-600">{matches.length}</div>
                <div className="text-xs text-gray-500">Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{bookings.length}</div>
                <div className="text-xs text-gray-500">Booked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">€{currentProfile.total_spent}</div>
                <div className="text-xs text-gray-500">Spent</div>
              </div>
            </div>
          </div>
        </div>

      {/* Preference Settings */}
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
            <span>Your Preferences</span>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setExperiences([...mockExperiences].sort(() => Math.random() - 0.5));
                setCurrentIndex(0);
              }}
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Quick Preference Toggles */}
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Mood</div>
              <div className="flex gap-1">
                {['creative', 'cultural', 'adventurous', 'relaxing'].map(mood => (
                  <Button
                    key={mood}
                    onClick={() => updatePreferences({...preferences, mood})}
                    variant={preferences.mood === mood ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs capitalize"
                  >
                    {mood}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Time</div>
              <div className="flex gap-1">
                {[
                  { value: 'quick', label: '2-3h' },
                  { value: 'half-day', label: '4-6h' },
                  { value: 'full-day', label: '6+h' }
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    onClick={() => updatePreferences({...preferences, timeAvailable: value})}
                    variant={preferences.timeAvailable === value ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-gray-500 mb-1">Budget</div>
              <div className="flex gap-1">
                {[
                  { value: 'budget', label: '<€70' },
                  { value: 'moderate', label: '€70-120' },
                  { value: 'premium', label: '€120+' }
                ].map(({ value, label }) => (
                  <Button
                    key={value}
                    onClick={() => updatePreferences({...preferences, priceRange: value})}
                    variant={preferences.priceRange === value ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-3">
            Showing {filteredExperiences.length} of {mockExperiences.length} experiences
          </div>
        </div>
      </div>

      {/* Experience Cards */}
      <div className="max-w-md mx-auto px-4 pb-24">
        {currentExperience ? (
          <Card className="relative overflow-hidden bg-white shadow-lg">
            {/* Experience Image */}
            <div className="aspect-[4/3] bg-gradient-to-br from-orange-200 to-amber-200 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-orange-700">
                  <BookOpen className="w-16 h-16 mx-auto mb-2" />
                  <div className="font-medium">{currentExperience.craft}</div>
                </div>
              </div>
              
              {/* Match Score Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  {currentExperience.matchScore}% match
                </Badge>
              </div>
              
              {/* Status Badges */}
              <div className="absolute top-4 left-4 space-y-2">
                {savedExperiences.includes(currentExperience.id) && (
                  <Badge className="bg-pink-500 text-white block">
                    ❤️ Saved
                  </Badge>
                )}
                {bookings.some(b => b.includes(currentExperience.id)) && (
                  <Badge className="bg-blue-500 text-white block">
                    ✅ Booked
                  </Badge>
                )}
              </div>
            </div>

            {/* Experience Details */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {currentExperience.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  with {currentExperience.artisan} • {currentExperience.location}
                </p>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {currentExperience.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">⏱️ {currentExperience.duration}</span>
                  <span className="text-gray-600">👨‍🎨 {currentExperience.artisanYears}y exp</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  €{currentExperience.price}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentExperience.features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0">
              <div className="flex gap-3 mb-3">
                <Button
                  variant="outline"
                  onClick={handlePass}
                  className="flex-1 h-12 border-2 border-gray-300 hover:border-red-300 hover:text-red-600"
                >
                  <X className="w-5 h-5 mr-2" />
                  Pass
                </Button>
                
                <Button
                  onClick={handleLike}
                  disabled={savedExperiences.includes(currentExperience.id)}
                  className="flex-1 h-12 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white disabled:opacity-50"
                >
                  <Heart className={`w-5 h-5 mr-2 ${savedExperiences.includes(currentExperience.id) ? 'fill-current' : ''}`} />
                  {savedExperiences.includes(currentExperience.id) ? 'Saved' : 'Save'}
                </Button>
                
                {savedExperiences.includes(currentExperience.id) && (
                  <Button
                    onClick={handleBook}
                    disabled={bookings.some(b => b.includes(currentExperience.id))}
                    className="flex-1 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white disabled:opacity-50"
                  >
                    {bookings.some(b => b.includes(currentExperience.id)) ? 'Booked ✓' : 'Book Now'}
                  </Button>
                )}
              </div>
              
              {/* Learn More Button */}
              <Button
                onClick={() => handleLearnMore(currentExperience)}
                variant="outline"
                className="w-full h-10 border border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                📖 Learn More & Watch Videos
              </Button>
              
              <div className="mt-3 text-center">
                <div className="text-xs text-gray-500">
                  {currentIndex + 1} of {filteredExperiences.length} experiences
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No experiences match your current preferences</div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={() => setCurrentIndex(0)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
              <div className="text-xs text-gray-400">
                Tip: Try adjusting your preferences above
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button variant="ghost" size="sm" onClick={() => router.push('/tourist-onboarding')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Onboarding
            </Button>
            
            <div className="text-center">
              <div className="text-xs text-gray-500">Cultural Matching</div>
              <div className="text-xs text-green-600 font-medium">
                ✅ Profile synced
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                localStorage.removeItem('tourist_phone');
                router.push('/');
              }}
            >
              Exit
            </Button>
          </div>
        </div>
      </div>

      {/* Detailed Experience View Modal */}
      {showDetails && selectedExperience && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header with close button */}
              <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedExperience.title}</h2>
                <Button variant="ghost" onClick={closeDetails}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Experience Gallery */}
              <div className="aspect-video bg-gradient-to-br from-orange-200 to-amber-200 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-orange-700">
                    <BookOpen className="w-20 h-20 mx-auto mb-3" />
                    <div className="font-medium text-lg">{selectedExperience.craft}</div>
                    <div className="text-sm opacity-75">Click to play video demo</div>
                  </div>
                </div>
                
                {/* Video overlay button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button 
                    className="bg-white/90 hover:bg-white text-orange-600 rounded-full w-16 h-16"
                    onClick={() => alert('🎥 Video demo would play here!\n\nShowing:\n- Artisan workspace tour\n- Step-by-step techniques\n- Previous tourist experiences\n- Cultural background stories')}
                  >
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </Button>
                </div>
                
                <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                  <Star className="w-3 h-3 mr-1" />
                  {selectedExperience.matchScore}% match
                </Badge>
              </div>
              
              {/* Detailed Information */}
              <div className="p-6 space-y-6">
                {/* Artisan Profile */}
                <div className="bg-orange-50 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">👨‍🎨 Meet Your Artisan</h3>
                  <div className="text-orange-800">
                    <p className="font-medium">{selectedExperience.artisan}</p>
                    <p className="text-sm">{selectedExperience.artisanYears} years of experience</p>
                    <p className="text-sm">{selectedExperience.location_detail}</p>
                  </div>
                </div>
                
                {/* Full Description */}
                <div>
                  <h3 className="font-semibold mb-2">📖 Full Experience</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedExperience.description}
                    {" "}This hands-on workshop includes all materials, personal guidance from master artisan {selectedExperience.artisan}, 
                    and a deep dive into centuries-old Moroccan crafting traditions. You'll learn the cultural significance 
                    behind each technique while creating your own authentic piece to take home.
                  </p>
                </div>
                
                {/* What's Included */}
                <div>
                  <h3 className="font-semibold mb-2">✅ What's Included</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedExperience.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Traditional tea & snacks
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Cultural stories & history
                    </div>
                  </div>
                </div>
                
                {/* Schedule & Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-1">⏱️ Duration</h4>
                    <p className="text-gray-700">{selectedExperience.duration}</p>
                    <p className="text-xs text-gray-500">Flexible start times</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-1">💰 Price</h4>
                    <p className="text-2xl font-bold text-orange-600">€{selectedExperience.price}</p>
                    <p className="text-xs text-gray-500">Per person</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleLikeExperience(selectedExperience)}
                    disabled={savedExperiences.includes(selectedExperience.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Heart className={`w-4 h-4 mr-2 ${savedExperiences.includes(selectedExperience.id) ? 'fill-current text-pink-500' : ''}`} />
                    {savedExperiences.includes(selectedExperience.id) ? 'Saved' : 'Save Experience'}
                  </Button>
                  
                  <Button
                    onClick={() => proceedToBooking(selectedExperience)}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  >
                    🎯 Book This Experience
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Booking Agent Modal */}
      {showBookingAgent && selectedExperience && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">🤝 Your Booking Agent</h2>
                    <p className="text-orange-100 text-sm">Zahra - Morocco Made Real</p>
                  </div>
                  <Button variant="ghost" onClick={closeBookingAgent} className="text-white hover:bg-white/20">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              {/* Booking Content */}
              <div className="p-6 space-y-4">
                <div className="bg-orange-50 rounded-xl p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">📋 Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-medium">{selectedExperience.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Artisan:</span>
                      <span>{selectedExperience.artisan}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{selectedExperience.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span>{selectedExperience.location}</span>
                    </div>
                    <hr className="border-orange-200" />
                    <div className="flex justify-between font-semibold">
                      <span>Total Price:</span>
                      <span className="text-orange-600">€{selectedExperience.price}</span>
                    </div>
                  </div>
                </div>
                
                {/* Chat-style booking flow */}
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm">
                      <strong>Zahra:</strong> Hi! I'm excited to help you book this amazing experience with {selectedExperience.artisan}! 
                      When would you like to schedule your {selectedExperience.duration} workshop?
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="text-left">
                      📅 Tomorrow<br/>
                      <span className="text-xs text-gray-500">Available 9AM-4PM</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-left">
                      📅 This Weekend<br/>
                      <span className="text-xs text-gray-500">Saturday preferred</span>
                    </Button>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm">
                      <strong>Zahra:</strong> Perfect! I'll also arrange:
                    </p>
                    <ul className="text-xs mt-2 space-y-1 ml-4">
                      <li>• 📱 WhatsApp confirmation with directions</li>
                      <li>• 🚗 Transport pickup from your hotel</li>
                      <li>• 🌟 VIP welcome with traditional Moroccan tea</li>
                      <li>• 📸 Professional photos of your creation</li>
                    </ul>
                  </div>
                  
                  <Button
                    onClick={() => {
                      handleBook();
                      closeBookingAgent();
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12"
                  >
                    ✅ Confirm Booking - €{selectedExperience.price}
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      💬 Zahra will send WhatsApp confirmation<br/>
                      📱 Contact: {currentProfile?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 