'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { AIService, TravelPreferences, ItineraryItem } from '@/lib/ai-service';

interface AIItineraryGeneratorProps {
  locale: string;
}

export default function AIItineraryGenerator({ locale }: AIItineraryGeneratorProps) {
  const t = useTranslations('ai_itinerary');
  const [preferences, setPreferences] = useState<TravelPreferences>({
    interests: [],
    budget: 'mid-range',
    duration: 7,
    groupSize: 2,
    accessibility: false,
    culturalLevel: 'intermediate',
    preferredRegions: []
  });
  
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const aiService = new AIService();

  const interests = [
    'history', 'art', 'cuisine', 'architecture', 'crafts', 
    'music', 'nature', 'adventure', 'spirituality', 'photography'
  ];

  const regions = [
    'Marrakech', 'Fes', 'Casablanca', 'Chefchaouen', 
    'Essaouira', 'Atlas Mountains', 'Sahara Desert', 'Rabat'
  ];

  const handleInterestChange = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleRegionChange = (region: string) => {
    setPreferences(prev => ({
      ...prev,
      preferredRegions: prev.preferredRegions.includes(region)
        ? prev.preferredRegions.filter(r => r !== region)
        : [...prev.preferredRegions, region]
    }));
  };

  const generateItinerary = async () => {
    setIsGenerating(true);
    try {
      const generatedItinerary = await aiService.generateItinerary(preferences);
      setItinerary(generatedItinerary);
      setShowResults(true);
    } catch (error) {
      console.error('Error generating itinerary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-moroccan-blue mb-4">
          🤖 {t('title') || 'AI-Powered Itinerary Generator'}
        </h2>
        <p className="text-gray-600">
          {t('description') || 'Let our AI create a personalized, authentic Moroccan experience just for you.'}
        </p>
      </div>

      {!showResults ? (
        <div className="space-y-6">
          {/* Interests Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t('interests_label') || 'What interests you most?'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interests.map(interest => (
                <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                    className="w-4 h-4 text-moroccan-gold focus:ring-moroccan-gold border-gray-300 rounded"
                  />
                  <span className="text-sm capitalize">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t('budget_label') || 'Budget Level'}
            </label>
            <div className="flex space-x-4">
              {(['budget', 'mid-range', 'luxury'] as const).map(budget => (
                <label key={budget} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="budget"
                    value={budget}
                    checked={preferences.budget === budget}
                    onChange={(e) => setPreferences(prev => ({ ...prev, budget: e.target.value as any }))}
                    className="w-4 h-4 text-moroccan-gold focus:ring-moroccan-gold"
                  />
                  <span className="text-sm capitalize">{budget.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Duration and Group Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                {t('duration_label') || 'Trip Duration (days)'}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={preferences.duration}
                onChange={(e) => setPreferences(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold"
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                {t('group_size_label') || 'Group Size'}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={preferences.groupSize}
                onChange={(e) => setPreferences(prev => ({ ...prev, groupSize: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-moroccan-gold"
              />
            </div>
          </div>

          {/* Cultural Level */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t('cultural_level_label') || 'Cultural Experience Level'}
            </label>
            <div className="flex space-x-4">
              {(['beginner', 'intermediate', 'expert'] as const).map(level => (
                <label key={level} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="culturalLevel"
                    value={level}
                    checked={preferences.culturalLevel === level}
                    onChange={(e) => setPreferences(prev => ({ ...prev, culturalLevel: e.target.value as any }))}
                    className="w-4 h-4 text-moroccan-gold focus:ring-moroccan-gold"
                  />
                  <span className="text-sm capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Regions */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              {t('regions_label') || 'Preferred Regions'}
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {regions.map(region => (
                <label key={region} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.preferredRegions.includes(region)}
                    onChange={() => handleRegionChange(region)}
                    className="w-4 h-4 text-moroccan-gold focus:ring-moroccan-gold border-gray-300 rounded"
                  />
                  <span className="text-sm">{region}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.accessibility}
                onChange={(e) => setPreferences(prev => ({ ...prev, accessibility: e.target.checked }))}
                className="w-4 h-4 text-moroccan-gold focus:ring-moroccan-gold border-gray-300 rounded"
              />
              <span className="text-lg font-semibold text-gray-700">
                {t('accessibility_label') || 'Accessibility accommodations needed'}
              </span>
            </label>
          </div>

          {/* Generate Button */}
          <div className="pt-6">
            <button
              onClick={generateItinerary}
              disabled={isGenerating || preferences.interests.length === 0}
              className="w-full bg-moroccan-gold hover:bg-moroccan-gold/90 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t('generating') || 'Generating your itinerary...'}</span>
                </div>
              ) : (
                t('generate_button') || 'Generate My Itinerary'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold text-moroccan-blue">
              {t('your_itinerary') || 'Your Personalized Itinerary'}
            </h3>
            <button
              onClick={() => setShowResults(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              {t('modify') || 'Modify Preferences'}
            </button>
          </div>

          {/* Itinerary Items */}
          <div className="space-y-4">
            {itinerary.map((item, index) => (
              <div key={item.id} className="bg-gradient-to-r from-moroccan-sand to-white p-6 rounded-lg border-l-4 border-moroccan-gold">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-xl font-semibold text-moroccan-blue">
                      Day {item.day} - {item.time}
                    </h4>
                    <h5 className="text-lg font-medium text-gray-700">{item.activity}</h5>
                    <p className="text-sm text-gray-600">{item.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-moroccan-gold text-white px-3 py-1 rounded-full text-sm font-medium">
                      Authenticity: {item.authenticityScore}/10
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.estimatedCost} MAD</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{item.description}</p>
                
                <div className="bg-blue-50 p-3 rounded-lg mb-3">
                  <h6 className="font-semibold text-blue-800 mb-1">Cultural Significance:</h6>
                  <p className="text-blue-700 text-sm">{item.culturalSignificance}</p>
                </div>

                {item.artisanConnections && item.artisanConnections.length > 0 && (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h6 className="font-semibold text-green-800 mb-2">Connected Artisans:</h6>
                    {item.artisanConnections.map(artisan => (
                      <div key={artisan.id} className="flex items-center justify-between text-sm">
                        <span className="text-green-700">
                          {artisan.name} - {artisan.craft}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-600">★ {artisan.rating}</span>
                          {artisan.verificationStatus === 'verified' && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6">
            <button className="flex-1 bg-moroccan-blue hover:bg-moroccan-blue/90 text-white font-bold py-3 px-6 rounded-lg">
              {t('save_itinerary') || 'Save Itinerary'}
            </button>
            <button className="flex-1 bg-moroccan-gold hover:bg-moroccan-gold/90 text-white font-bold py-3 px-6 rounded-lg">
              {t('book_experiences') || 'Book Experiences'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 