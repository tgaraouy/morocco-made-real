'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  X, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Users,
  Globe
} from 'lucide-react';

interface SwipeCardProps {
  experience: {
    id: string;
    title: string;
    artisanName: string;
    craft: string;
    location: string;
    price: number;
    duration: string;
    matchPercentage: number;
    skillLevel: string;
    languages: string[];
    description: string;
    culturalContext: string;
    image?: string;
  };
  onSwipe: (direction: 'left' | 'right', experienceId: string) => void;
}

export function SwipeCard({ experience, onSwipe }: SwipeCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (direction: 'left' | 'right') => {
    setIsAnimating(true);
    setSwipeDirection(direction);
    
    setTimeout(() => {
      onSwipe(direction, experience.id);
      setIsAnimating(false);
      setSwipeDirection(null);
    }, 300);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 75) return 'text-blue-600 bg-blue-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <Card 
        className={`
          relative overflow-hidden shadow-xl transition-all duration-300 ease-out
          ${isAnimating ? 'scale-95' : 'scale-100'}
          ${swipeDirection === 'left' ? 'transform -translate-x-full -rotate-12 opacity-0' : ''}
          ${swipeDirection === 'right' ? 'transform translate-x-full rotate-12 opacity-0' : ''}
        `}
      >
        {/* Match Percentage Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className={`${getMatchColor(experience.matchPercentage)} font-bold`}>
            ⭐ {experience.matchPercentage}% match
          </Badge>
        </div>

        {/* Experience Image/Icon */}
        <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
          <div className="text-6xl">
            {experience.craft === 'pottery' && '🏺'}
            {experience.craft === 'weaving' && '🧶'}
            {experience.craft === 'leather' && '👜'}
            {experience.craft === 'metalwork' && '⚒️'}
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {/* Title & Artisan */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {experience.title}
            </h2>
            <p className="text-gray-600">
              with {experience.artisanName}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{experience.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{experience.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>${experience.price}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{experience.skillLevel}</span>
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <div className="flex gap-1">
              {experience.languages.map((lang) => (
                <Badge key={lang} variant="outline" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm leading-relaxed">
            {experience.description}
          </p>

          {/* Cultural Context */}
          {experience.culturalContext && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Cultural Context:</strong> {experience.culturalContext}
              </p>
            </div>
          )}

          {/* Swipe Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-red-200 hover:bg-red-50 hover:border-red-300"
              onClick={() => handleSwipe('left')}
              disabled={isAnimating}
            >
              <X className="w-5 h-5 text-red-500 mr-2" />
              Pass
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleSwipe('right')}
              disabled={isAnimating}
            >
              <Heart className="w-5 h-5 mr-2" />
              Match
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Match Celebration Component
export function MatchCelebration({ 
  experience, 
  onClose 
}: { 
  experience: SwipeCardProps['experience']; 
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-sm mx-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">It's a Match!</h2>
          <p className="mb-4">
            {experience.artisanName} wants to share their {experience.craft} secrets with you!
          </p>
          
          <div className="space-y-3">
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={onClose}
            >
              💬 Start Conversation
            </Button>
            <Button 
              variant="outline" 
              className="w-full bg-transparent border-white text-white hover:bg-white hover:text-green-600"
              onClick={onClose}
            >
              📅 Book Experience
            </Button>
            <Button 
              variant="ghost" 
              className="w-full text-white hover:bg-white hover:bg-opacity-20"
              onClick={onClose}
            >
              ⭐ View Full Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Quick Profile Setup Component with Cultural DNA Integration
export function QuickProfileSetup({ onComplete }: { onComplete: (profile: any) => void }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    culturalVibe: '',
    budget: '',
    timeAvailable: '',
    languages: [],
    // Hidden Cultural DNA tracking
    culturalDNA: {
      heritageResonance: 0,
      sensoryPreference: '',
      emotionalTrigger: '',
      learningStyle: ''
    },
    discoveredTraits: []
  });

  // Enhanced Cultural Vibes with DNA Mapping
  const culturalVibes = [
    { 
      id: 'heritage-mystic', 
      label: 'Heritage Mystic', 
      emoji: '🏛️', 
      description: 'Deep connection to ancestral traditions',
      dnaMapping: { heritageResonance: 0.9, emotionalTrigger: 'nostalgia', learningStyle: 'storytelling' },
      trait: 'Heritage Mystic'
    },
    { 
      id: 'technique-scholar', 
      label: 'Technique Scholar', 
      emoji: '🔍', 
      description: 'Fascinated by how things are made',
      dnaMapping: { heritageResonance: 0.7, emotionalTrigger: 'mastery', learningStyle: 'analytical' },
      trait: 'Technique Scholar'
    },
    { 
      id: 'story-weaver', 
      label: 'Story Weaver', 
      emoji: '📚', 
      description: 'Love the tales behind traditions',
      dnaMapping: { heritageResonance: 0.8, emotionalTrigger: 'connection', learningStyle: 'auditory' },
      trait: 'Story Weaver'
    },
    { 
      id: 'creative-explorer', 
      label: 'Creative Explorer', 
      emoji: '🎨', 
      description: 'Hands-on cultural discovery',
      dnaMapping: { heritageResonance: 0.6, emotionalTrigger: 'creation', learningStyle: 'kinesthetic' },
      trait: 'Creative Explorer'
    }
  ];

  // Enhanced Budget with Psychological Motivation
  const budgetRanges = [
    { 
      id: '50-100', 
      label: '$50-100', 
      emoji: '🌱', 
      description: 'Curious Explorer',
      motivation: 'discovery'
    },
    { 
      id: '100-300', 
      label: '$100-300', 
      emoji: '🌿', 
      description: 'Cultural Enthusiast',
      motivation: 'experience'
    },
    { 
      id: '300-500', 
      label: '$300-500', 
      emoji: '🌳', 
      description: 'Heritage Connoisseur',
      motivation: 'mastery'
    },
    { 
      id: '500+', 
      label: '$500+', 
      emoji: '🏛️', 
      description: 'Cultural Ambassador',
      motivation: 'exclusivity'
    }
  ];

  // Enhanced Time with Energy Rhythm Detection
  const timeOptions = [
    { 
      id: '2-3-hours', 
      label: '2-3 hours', 
      emoji: '⚡', 
      description: 'Quick cultural spark',
      energyRhythm: 'burst'
    },
    { 
      id: 'half-day', 
      label: 'Half day', 
      emoji: '🌅', 
      description: 'Gentle immersion',
      energyRhythm: 'gradual-build'
    },
    { 
      id: 'full-day', 
      label: 'Full day', 
      emoji: '☀️', 
      description: 'Deep cultural dive',
      energyRhythm: 'steady'
    },
    { 
      id: 'multi-day', 
      label: 'Multi-day', 
      emoji: '🌙', 
      description: 'Transformative journey',
      energyRhythm: 'peak-crash'
    }
  ];

  // Enhanced Languages with Cultural Bridge Detection
  const languages = [
    { 
      id: 'en', 
      label: 'English', 
      emoji: '🇺🇸',
      culturalBridge: 'global'
    },
    { 
      id: 'fr', 
      label: 'French', 
      emoji: '🇫🇷',
      culturalBridge: 'colonial-heritage'
    },
    { 
      id: 'ar', 
      label: 'Arabic', 
      emoji: '🇲🇦',
      culturalBridge: 'native-connection'
    },
    { 
      id: 'es', 
      label: 'Spanish', 
      emoji: '🇪🇸',
      culturalBridge: 'andalusian-roots'
    }
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Process Cultural DNA before completing
      const enhancedProfile = {
        ...profile,
        // Calculate overall Cultural DNA score
        culturalCompatibilityScore: calculateCulturalCompatibility(profile),
        // Determine match evolution stage
        evolutionStage: determineEvolutionStage(profile),
        // Generate personality insights
        personalityInsights: generatePersonalityInsights(profile)
      };
      onComplete(enhancedProfile);
    }
  };

  const handleVibeSelection = (vibe) => {
    const newProfile = {
      ...profile,
      culturalVibe: vibe.id,
      culturalDNA: {
        ...profile.culturalDNA,
        ...vibe.dnaMapping
      },
      discoveredTraits: [...profile.discoveredTraits, vibe.trait]
    };
    setProfile(newProfile);
  };

  // Cultural DNA Processing Functions
  const calculateCulturalCompatibility = (userProfile) => {
    // Sophisticated algorithm that runs behind the scenes
    const heritageWeight = userProfile.culturalDNA.heritageResonance * 0.4;
    const motivationWeight = getBudgetMotivationScore(userProfile.budget) * 0.3;
    const energyWeight = getEnergyCompatibilityScore(userProfile.timeAvailable) * 0.2;
    const languageWeight = getLanguageBridgeScore(userProfile.languages) * 0.1;
    
    return Math.round((heritageWeight + motivationWeight + energyWeight + languageWeight) * 100);
  };

  const determineEvolutionStage = (userProfile) => {
    const budgetLevel = getBudgetLevel(userProfile.budget);
    const heritageDepth = userProfile.culturalDNA.heritageResonance;
    
    if (budgetLevel >= 3 && heritageDepth > 0.8) return 'connoisseur';
    if (budgetLevel >= 2 && heritageDepth > 0.6) return 'enthusiast';
    if (heritageDepth > 0.7) return 'explorer';
    return 'novice';
  };

  const generatePersonalityInsights = (userProfile) => {
    const traits = userProfile.discoveredTraits;
    const primaryTrait = traits[0] || 'Cultural Explorer';
    return {
      primaryTrait,
      culturalArchetype: primaryTrait,
      matchingStrategy: getMatchingStrategy(userProfile),
      surpriseElement: getSurpriseElement(userProfile)
    };
  };

  // Helper functions
  const getBudgetMotivationScore = (budget) => {
    const scores = { '50-100': 0.4, '100-300': 0.6, '300-500': 0.8, '500+': 1.0 };
    return scores[budget] || 0.5;
  };

  const getEnergyCompatibilityScore = (time) => {
    const scores = { '2-3-hours': 0.5, 'half-day': 0.7, 'full-day': 0.9, 'multi-day': 1.0 };
    return scores[time] || 0.6;
  };

  const getLanguageBridgeScore = (languages) => {
    if (languages.includes('ar')) return 1.0; // Native connection
    if (languages.includes('fr')) return 0.8; // Colonial heritage
    return 0.6; // Global connection
  };

  const getBudgetLevel = (budget) => {
    const levels = { '50-100': 1, '100-300': 2, '300-500': 3, '500+': 4 };
    return levels[budget] || 1;
  };

  const getMatchingStrategy = (userProfile) => {
    if (userProfile.culturalDNA.learningStyle === 'storytelling') return 'narrative-focused';
    if (userProfile.culturalDNA.learningStyle === 'kinesthetic') return 'hands-on-creation';
    if (userProfile.culturalDNA.learningStyle === 'analytical') return 'technique-mastery';
    return 'cultural-immersion';
  };

  const getSurpriseElement = (userProfile) => {
    const surprises = [
      'A secret family recipe shared just with you',
      'An invitation to a private cultural ceremony',
      'A hidden workshop known only to locals',
      'A master artisan\'s personal collection viewing'
    ];
    return surprises[Math.floor(Math.random() * surprises.length)];
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Step {step} of 4</span>
          <span className="text-sm text-gray-500">{Math.round((step / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Show discovered traits */}
      {profile.discoveredTraits.length > 0 && (
        <div className="mb-6 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-600 font-semibold text-sm">✨ Discovered Trait</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {profile.discoveredTraits.map((trait, index) => (
              <span key={index} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">🧬 What resonates with your soul?</h2>
          <p className="text-gray-600 mb-6">Choose what calls to you when experiencing culture</p>
          
          <div className="space-y-3">
            {culturalVibes.map((vibe) => (
              <Button
                key={vibe.id}
                variant={profile.culturalVibe === vibe.id ? "default" : "outline"}
                className="w-full p-4 h-auto justify-start hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                onClick={() => handleVibeSelection(vibe)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{vibe.emoji}</span>
                  <div className="text-left">
                    <div className="font-semibold">{vibe.label}</div>
                    <div className="text-sm opacity-70">{vibe.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">💰 Your cultural investment?</h2>
          <p className="text-gray-600 mb-6">What feels right for meaningful experiences?</p>
          
          <div className="grid grid-cols-2 gap-3">
            {budgetRanges.map((budget) => (
              <Button
                key={budget.id}
                variant={profile.budget === budget.id ? "default" : "outline"}
                className="p-4 h-auto hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                onClick={() => setProfile({ ...profile, budget: budget.id })}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{budget.emoji}</div>
                  <div className="font-semibold text-sm">{budget.label}</div>
                  <div className="text-xs opacity-70 mt-1">{budget.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">⏰ Your natural rhythm?</h2>
          <p className="text-gray-600 mb-6">How do you like to absorb new experiences?</p>
          
          <div className="grid grid-cols-2 gap-3">
            {timeOptions.map((time) => (
              <Button
                key={time.id}
                variant={profile.timeAvailable === time.id ? "default" : "outline"}
                className="p-4 h-auto hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                onClick={() => setProfile({ ...profile, timeAvailable: time.id })}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{time.emoji}</div>
                  <div className="font-semibold text-sm">{time.label}</div>
                  <div className="text-xs opacity-70 mt-1">{time.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-2xl font-bold mb-2">🌍 Your cultural bridges?</h2>
          <p className="text-gray-600 mb-6">Which languages connect you to the world?</p>
          
          <div className="grid grid-cols-2 gap-3">
            {languages.map((lang) => (
              <Button
                key={lang.id}
                variant={profile.languages.includes(lang.id) ? "default" : "outline"}
                className="p-4 h-auto hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
                onClick={() => {
                  const newLanguages = profile.languages.includes(lang.id)
                    ? profile.languages.filter(l => l !== lang.id)
                    : [...profile.languages, lang.id];
                  setProfile({ ...profile, languages: newLanguages });
                }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{lang.emoji}</div>
                  <div className="font-semibold">{lang.label}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        {step > 1 && (
          <Button 
            variant="outline" 
            onClick={() => setStep(step - 1)}
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button 
          onClick={handleNext}
          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
          disabled={
            (step === 1 && !profile.culturalVibe) ||
            (step === 2 && !profile.budget) ||
            (step === 3 && !profile.timeAvailable) ||
            (step === 4 && profile.languages.length === 0)
          }
        >
          {step === 4 ? 'Discover Your Matches! ✨' : 'Next'}
        </Button>
      </div>
    </div>
  );
} 