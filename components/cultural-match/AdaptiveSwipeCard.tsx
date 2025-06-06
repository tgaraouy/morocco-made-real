'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  X, 
  MapPin, 
  Clock, 
  Euro, 
  Star, 
  Sparkles,
  Brain,
  TrendingUp
} from 'lucide-react';
import AdaptiveMatchingService, { 
  UserInteraction, 
  InteractionContext, 
  MatchPrediction 
} from '@/lib/adaptive-matching-service';

interface AdaptiveSwipeCardProps {
  experience: any;
  prediction: MatchPrediction;
  userId: string;
  sessionId: string;
  sequencePosition: number;
  onSwipe: (direction: 'left' | 'right', experience: any, prediction: MatchPrediction) => void;
  onTimeSpent: (seconds: number) => void;
}

export default function AdaptiveSwipeCard({
  experience,
  prediction,
  userId,
  sessionId,
  sequencePosition,
  onSwipe,
  onTimeSpent
}: AdaptiveSwipeCardProps) {
  const [startTime] = useState(Date.now());
  const [isVisible, setIsVisible] = useState(true);
  const [showReasonig, setShowReasoning] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timeSpentRef = useRef<number>(0);

  // Track time spent viewing this card
  useEffect(() => {
    const interval = setInterval(() => {
      timeSpentRef.current = (Date.now() - startTime) / 1000;
    }, 1000);

    return () => {
      clearInterval(interval);
      // Report time spent when component unmounts
      if (timeSpentRef.current > 3) {
        onTimeSpent(timeSpentRef.current);
      }
    };
  }, [startTime, onTimeSpent]);

  const handleSwipe = async (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    // Create interaction context
    const interactionContext: InteractionContext = {
      craft: experience.craft,
      location: experience.location,
      price: experience.price,
      duration: experience.duration,
      artisan_age: experience.artisan_age,
      experience_styles: experience.experience_styles || [],
      quick_moods: experience.quick_moods || [],
      tags: experience.tags || [],
      time_of_day: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
      day_of_week: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][new Date().getDay()],
      sequence_position: sequencePosition,
      previous_swipes: [], // Would be passed from parent
      session_duration: timeSpentRef.current
    };

    // Record the interaction
    const interaction: UserInteraction = {
      id: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionId,
      timestamp: new Date().toISOString(),
      type: direction === 'right' ? 'swipe_right' : 'swipe_left',
      experienceId: experience.id,
      context: interactionContext,
      metadata: {
        timeBetweenSwipes: 0, // Would be calculated by parent
        confidence: prediction.confidence,
        reasoning: prediction.reasoning,
        timeSpent: timeSpentRef.current
      }
    };

    try {
      // Record interaction for learning
      await AdaptiveMatchingService.recordInteraction(interaction);
    } catch (error) {
      console.error('Failed to record interaction:', error);
    }

    // Animate card out
    setTimeout(() => {
      setIsVisible(false);
      onSwipe(direction, experience, prediction);
    }, 300);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High Match';
    if (confidence >= 0.6) return 'Good Match';
    if (confidence >= 0.4) return 'Possible Match';
    return 'Exploring';
  };

  return (
    <div 
      ref={cardRef}
      className={`
        relative w-full max-w-sm mx-auto transition-all duration-300 transform
        ${!isVisible ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        ${swipeDirection === 'right' ? 'translate-x-full rotate-12' : ''}
        ${swipeDirection === 'left' ? '-translate-x-full -rotate-12' : ''}
      `}
    >
      <Card className="w-full h-[600px] relative overflow-hidden border-2 border-orange-200 shadow-xl">
        {/* AI Confidence Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className={`${getConfidenceColor(prediction.confidence)} flex items-center gap-1`}>
            <Brain className="w-3 h-3" />
            {getConfidenceLabel(prediction.confidence)}
          </Badge>
        </div>

        {/* Learning Indicator */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Learning #{sequencePosition}
          </Badge>
        </div>

        <CardContent className="p-0 h-full flex flex-col">
          {/* Experience Image/Emoji */}
          <div className="relative h-48 bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 flex items-center justify-center">
            <div className="text-8xl">{experience.image}</div>
            
            {/* Match Sparkles for high confidence */}
            {prediction.confidence >= 0.7 && (
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles className="absolute top-4 left-8 w-6 h-6 text-yellow-400 animate-pulse" />
                <Sparkles className="absolute top-12 right-12 w-4 h-4 text-yellow-400 animate-pulse delay-300" />
                <Sparkles className="absolute bottom-8 left-12 w-5 h-5 text-yellow-400 animate-pulse delay-700" />
              </div>
            )}
          </div>

          {/* Experience Details */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {experience.title}
              </h3>
              <p className="text-lg text-gray-600 mb-3">
                with {experience.artisan_name}
              </p>

              {/* Key Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{experience.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{experience.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <Euro className="w-4 h-4" />
                  <span>{experience.price}</span>
                </div>
              </div>

              {/* AI Reasoning (Toggle) */}
              {showReasonig && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs font-medium text-blue-800 mb-1 flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    Why this might be perfect for you:
                  </div>
                  <p className="text-xs text-blue-700">
                    {prediction.contextual_prompt}
                  </p>
                  
                  {/* Confidence Breakdown */}
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-blue-600">Preference: </span>
                      <span>{Math.round(prediction.reasoning.preference_alignment * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Behavior: </span>
                      <span>{Math.round(prediction.reasoning.behavioral_fit * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Context: </span>
                      <span>{Math.round(prediction.reasoning.contextual_relevance * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-blue-600">Novelty: </span>
                      <span>{Math.round(prediction.reasoning.novelty_factor * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Moods & Styles */}
              <div className="space-y-2">
                {experience.quick_moods?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {experience.quick_moods.slice(0, 3).map((mood: string) => (
                      <Badge key={mood} variant="outline" className="text-xs">
                        {mood}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {experience.experience_styles?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {experience.experience_styles.slice(0, 2).map((style: string) => (
                      <Badge key={style} variant="secondary" className="text-xs">
                        {style}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Description Preview */}
              <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                {experience.description?.substring(0, 120)}...
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-8 mt-6">
              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-red-300 hover:border-red-500 hover:bg-red-50"
                onClick={() => handleSwipe('left')}
              >
                <X className="w-8 h-8 text-red-500" />
              </Button>

              {/* Toggle AI Reasoning */}
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-1 text-xs"
                onClick={() => setShowReasoning(!showReasonig)}
              >
                <Brain className="w-3 h-3" />
                {showReasonig ? 'Hide' : 'Why?'}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-16 h-16 rounded-full border-2 border-green-300 hover:border-green-500 hover:bg-green-50"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="w-8 h-8 text-green-500" />
              </Button>
            </div>

            {/* Learning Hints */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Each choice helps us learn your cultural interests better
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Swipe Gesture Indicators */}
      <div className="absolute inset-0 pointer-events-none">
        {swipeDirection === 'right' && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
              INTERESTED!
            </div>
          </div>
        )}
        {swipeDirection === 'left' && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
              NOT FOR ME
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 