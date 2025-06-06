'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Trophy, Zap, Crown, Users, Gift, Sparkles, Target, Flame } from 'lucide-react';

// ============================================================================
// CULTURAL SOUL EVOLUTION COMPONENT
// Revolutionary gamified interface for cultural trait collection
// ============================================================================

interface CulturalTrait {
  id: string;
  name: string;
  category: string;
  level: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythical';
  artisanName: string;
  unlockedAt: Date;
  visualEffect: string;
  colorPalette: string[];
}

interface CulturalSoulData {
  soulId: string;
  touristId: string;
  soulVisualization: {
    evolutionStage: string;
    currentLevel: number;
    visualComplexity: number;
    dominantColors: string[];
    animationEffects: string[];
  };
  collectedTraits: CulturalTrait[];
  totalTraitsCount: number;
  rarityDistribution: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
    mythical: number;
  };
  experiencePoints: number;
  nextLevelRequirement: number;
  currentStreak: number;
  culturalInfluence: number;
  artisansSupported: number;
  traditionsPreserved: number;
}

const EVOLUTION_STAGES = {
  seedling: { emoji: '🌱', name: 'Cultural Seedling', color: '#10B981' },
  apprentice: { emoji: '🌿', name: 'Cultural Apprentice', color: '#059669' },
  explorer: { emoji: '🌳', name: 'Cultural Explorer', color: '#047857' },
  connoisseur: { emoji: '🏛️', name: 'Cultural Connoisseur', color: '#065F46' },
  ambassador: { emoji: '👑', name: 'Cultural Ambassador', color: '#FFD700' },
  guardian: { emoji: '🔮', name: 'Cultural Guardian', color: '#9333EA' }
};

const RARITY_COLORS = {
  common: '#6B7280',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
  mythical: '#EF4444'
};

export function CulturalSoulEvolution() {
  const [soulData, setSoulData] = useState<CulturalSoulData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [soulCardUrl, setSoulCardUrl] = useState('');

  useEffect(() => {
    loadCulturalSoul();
  }, []);

  const loadCulturalSoul = async () => {
    setLoading(true);
    try {
      // Mock data for demo - replace with actual API call
      const mockSoul: CulturalSoulData = {
        soulId: 'soul_demo_123',
        touristId: 'tourist_demo',
        soulVisualization: {
          evolutionStage: 'explorer',
          currentLevel: 12,
          visualComplexity: 0.6,
          dominantColors: ['#FF6B35', '#004E89', '#F7931E'],
          animationEffects: ['gentle_pulse', 'trait_sparkle']
        },
        collectedTraits: [
          {
            id: 'trait_pottery_1',
            name: 'Pottery Mystic',
            category: 'pottery',
            level: 3,
            rarity: 'epic',
            artisanName: 'Hassan Benali',
            unlockedAt: new Date(Date.now() - 86400000 * 3),
            visualEffect: 'pottery_glow',
            colorPalette: ['#8B4513', '#CD853F']
          },
          {
            id: 'trait_weaving_1',
            name: 'Weaving Whisperer',
            category: 'weaving',
            level: 1,
            rarity: 'rare',
            artisanName: 'Fatima Zahra',
            unlockedAt: new Date(Date.now() - 86400000 * 1),
            visualEffect: 'thread_dance',
            colorPalette: ['#DC143C', '#B22222']
          },
          {
            id: 'trait_spice_1',
            name: 'Spice Alchemist',
            category: 'cooking',
            level: 2,
            rarity: 'legendary',
            artisanName: 'Ahmed Tazi',
            unlockedAt: new Date(Date.now() - 86400000 * 7),
            visualEffect: 'spice_swirl',
            colorPalette: ['#FF4500', '#FFA500']
          }
        ],
        totalTraitsCount: 3,
        rarityDistribution: {
          common: 0,
          rare: 1,
          epic: 1,
          legendary: 1,
          mythical: 0
        },
        experiencePoints: 2150,
        nextLevelRequirement: 2500,
        currentStreak: 5,
        culturalInfluence: 47,
        artisansSupported: 3,
        traditionsPreserved: 8
      };

      setSoulData(mockSoul);
    } catch (error) {
      console.error('Error loading cultural soul:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSoulCard = async () => {
    if (!soulData) return;

    try {
      // Mock soul card generation - replace with actual API call
      const mockSoulCard = {
        visualCard: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCI+PC9zdmc+',
        shareableText: `🧬 I'm a Level ${soulData.soulVisualization.currentLevel} Cultural ${soulData.soulVisualization.evolutionStage}!`,
        socialMediaCaptions: {
          instagram: `🧬 I'm a Level ${soulData.soulVisualization.currentLevel} ${soulData.soulVisualization.evolutionStage.toUpperCase()} with ${soulData.totalTraitsCount} cultural traits! ✨ I've supported ${soulData.artisansSupported} artisans and preserved ${soulData.traditionsPreserved} traditions in Morocco 🇲🇦 #CulturalSoulMate #MoroccoMadeReal #DiscoverYourSoul`
        },
        referralCode: `SOUL_${soulData.soulVisualization.evolutionStage.toUpperCase()}_${soulData.soulVisualization.currentLevel}_A7B9`
      };

      setSoulCardUrl(mockSoulCard.visualCard);
      setShowShareModal(true);
    } catch (error) {
      console.error('Error generating soul card:', error);
    }
  };

  const getProgressToNextLevel = () => {
    if (!soulData) return 0;
    return (soulData.experiencePoints / soulData.nextLevelRequirement) * 100;
  };

  const getCurrentStageInfo = () => {
    if (!soulData) return EVOLUTION_STAGES.seedling;
    return EVOLUTION_STAGES[soulData.soulVisualization.evolutionStage as keyof typeof EVOLUTION_STAGES] || EVOLUTION_STAGES.seedling;
  };

  const sortedTraits = soulData?.collectedTraits.sort((a, b) => {
    const rarityOrder = { mythical: 5, legendary: 4, epic: 3, rare: 2, common: 1 };
    return rarityOrder[b.rarity] - rarityOrder[a.rarity];
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your Cultural Soul...</p>
        </div>
      </div>
    );
  }

  if (!soulData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No Cultural Soul found. Complete your first experience to awaken your soul!</p>
        </div>
      </div>
    );
  }

  const stageInfo = getCurrentStageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Cultural Soul
          </h1>
          <p className="text-gray-600">Evolve through authentic Moroccan experiences</p>
        </div>

        {/* Soul Visualization Card */}
        <Card className="mb-8 bg-gradient-to-r from-orange-100 to-blue-100 border-none shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Soul Visualization */}
              <div className="flex-shrink-0">
                <div 
                  className="w-32 h-32 rounded-full border-4 flex items-center justify-center text-4xl animate-pulse shadow-lg"
                  style={{ 
                    borderColor: stageInfo.color,
                    background: `linear-gradient(135deg, ${soulData.soulVisualization.dominantColors.join(', ')})`
                  }}
                >
                  {stageInfo.emoji}
                </div>
              </div>

              {/* Soul Info */}
              <div className="flex-grow text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-2">
                  <Crown className="h-6 w-6 text-yellow-500" />
                  <h2 className="text-2xl font-bold" style={{ color: stageInfo.color }}>
                    Level {soulData.soulVisualization.currentLevel} {stageInfo.name}
                  </h2>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Progress to Level {soulData.soulVisualization.currentLevel + 1}</span>
                    <span className="text-sm font-medium">{soulData.experiencePoints} / {soulData.nextLevelRequirement} XP</span>
                  </div>
                  <Progress value={getProgressToNextLevel()} className="h-3" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{soulData.totalTraitsCount}</div>
                    <div className="text-sm text-gray-600">Traits Collected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{soulData.currentStreak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{soulData.artisansSupported}</div>
                    <div className="text-sm text-gray-600">Artisans Supported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{soulData.culturalInfluence}</div>
                    <div className="text-sm text-gray-600">People Influenced</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button onClick={generateSoulCard} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Soul Card
                </Button>
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  <Target className="h-4 w-4 mr-2" />
                  Challenge Friend
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value="traits" onValueChange={() => {}} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="traits">Traits Collection</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="quests">Seasonal Quests</TabsTrigger>
            <TabsTrigger value="leaderboard">Friends</TabsTrigger>
          </TabsList>

          {/* Traits Collection */}
          <TabsContent value="traits" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTraits.map((trait) => (
                <Card key={trait.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{trait.name}</CardTitle>
                      <Badge 
                        style={{ 
                          backgroundColor: RARITY_COLORS[trait.rarity],
                          color: 'white'
                        }}
                      >
                        {trait.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Level {trait.level}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">from {trait.artisanName}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="text-sm capitalize">{trait.category}</span>
                      </div>

                      <div className="text-xs text-gray-500">
                        Unlocked {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                          Math.ceil((trait.unlockedAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)), 'day'
                        )}
                      </div>

                      {/* Visual Effect Preview */}
                      <div 
                        className="h-2 rounded-full opacity-60"
                        style={{ 
                          background: `linear-gradient(90deg, ${trait.colorPalette.join(', ')})`
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Empty State */}
              {sortedTraits.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No traits collected yet</h3>
                  <p className="text-gray-600">Complete your first cultural experience to unlock traits!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                    Soul Awakening
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Welcome to your Cultural Soul journey!</p>
                  <Badge className="bg-yellow-600 text-white">Bronze</Badge>
                </CardContent>
              </Card>

              <Card className="opacity-50 border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-gray-400" />
                    First Master
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Reach Master level in any craft</p>
                  <Badge variant="outline">Locked</Badge>
                </CardContent>
              </Card>

              <Card className="opacity-50 border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-gray-400" />
                    Cultural Ambassador
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Refer 10 friends to the platform</p>
                  <Badge variant="outline">Locked</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Seasonal Quests */}
          <TabsContent value="quests" className="space-y-6">
            <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-pink-600" />
                  Spring 2025: Rose Festival Master
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Complete 3 rose-related experiences during spring to unlock the Legendary Rose Alchemist trait.</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-medium">0 / 3 experiences</span>
                  </div>
                  <Progress value={0} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <Badge className="bg-pink-600 text-white">Spring Quest</Badge>
                    <span className="text-sm text-gray-500">Ends June 20, 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Friends Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-gold-50 to-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">
                      👑
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">#1 You</span>
                        <Badge className="bg-yellow-600 text-white">Level 12 Explorer</Badge>
                      </div>
                      <p className="text-sm text-gray-600">2,150 Cultural Points</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-600">🥇</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Invite friends to compete!</h3>
                <p className="text-gray-600 mb-4">Challenge friends to Cultural Soul duels and climb the leaderboard together.</p>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Friends
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Share Your Cultural Soul</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-32 h-48 bg-gradient-to-br from-orange-100 to-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-4xl">{stageInfo.emoji}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    🧬 I'm a Level {soulData.soulVisualization.currentLevel} Cultural {stageInfo.name}! ✨
                  </p>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                    Share on Instagram
                  </Button>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Share on Facebook
                  </Button>
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Share on TikTok
                  </Button>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowShareModal(false)}
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 