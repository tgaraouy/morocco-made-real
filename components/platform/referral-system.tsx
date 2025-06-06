'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Gift, 
  Share2, 
  Users, 
  Star, 
  Trophy,
  Copy,
  MessageCircle,
  Instagram,
  Facebook,
  Sparkles,
  Crown,
  Heart,
  Zap
} from 'lucide-react';

interface ReferralData {
  userId: string;
  userName: string;
  referralCode: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  currentLevel: string;
  experienceCount: number;
  nextMilestone: number;
  nextReward: string;
}

interface SurpriseExperience {
  id: string;
  title: string;
  description: string;
  type: 'workshop_bonus' | 'anniversary' | 'festival' | 'random';
  artisanName: string;
  value: number;
  expiresAt: string;
  isAccepted?: boolean;
}

interface ReferralSystemProps {
  userData: ReferralData;
  surpriseExperiences: SurpriseExperience[];
}

export function ReferralSystem({ userData, surpriseExperiences }: ReferralSystemProps) {
  const [activeTab, setActiveTab] = useState<'referrals' | 'rewards' | 'surprises'>('referrals');
  const [copiedCode, setCopiedCode] = useState(false);

  const culturalLevels = [
    { 
      name: 'CURIOUS', 
      emoji: '🌱', 
      range: [0, 1], 
      benefits: ['20% off first experience', 'Basic artisan profiles'],
      color: 'text-green-600 bg-green-100'
    },
    { 
      name: 'EXPLORER', 
      emoji: '🌿', 
      range: [2, 4], 
      benefits: ['15% off all experiences', 'Priority booking', 'Advanced workshops'],
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      name: 'CONNOISSEUR', 
      emoji: '🌳', 
      range: [5, 9], 
      benefits: ['20% off premium experiences', 'Master artisan access', 'Exclusive workshops'],
      color: 'text-purple-600 bg-purple-100'
    },
    { 
      name: 'CULTURAL AMBASSADOR', 
      emoji: '🏛️', 
      range: [10, Infinity], 
      benefits: ['25% off all experiences', 'Heritage access', 'Bring friends for free', 'Annual Morocco tour'],
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const getCurrentLevel = () => {
    return culturalLevels.find(level => 
      userData.experienceCount >= level.range[0] && userData.experienceCount <= level.range[1]
    ) || culturalLevels[0];
  };

  const getNextLevel = () => {
    const currentIndex = culturalLevels.findIndex(level => 
      userData.experienceCount >= level.range[0] && userData.experienceCount <= level.range[1]
    );
    return culturalLevels[currentIndex + 1] || culturalLevels[culturalLevels.length - 1];
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(userData.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const message = `Just discovered amazing Moroccan cultural experiences! Use my code ${userData.referralCode} for 25% off your first workshop 🏺✨`;
    const url = `https://moroccomadereal.com?ref=${userData.referralCode}`;
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(message + ' ' + url)}`,
      instagram: `https://instagram.com`, // Would open Instagram app
      facebook: `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank');
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel ? 
    ((userData.experienceCount - currentLevel.range[0]) / (nextLevel.range[0] - currentLevel.range[0])) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* User Level & Progress */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{currentLevel.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold">{currentLevel.name}</h2>
                <p className="opacity-90">Cultural Explorer Level</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{userData.experienceCount}</p>
              <p className="opacity-90">Experiences</p>
            </div>
          </div>

          {nextLevel && nextLevel !== currentLevel && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to {nextLevel.name}</span>
                <span>{userData.experienceCount}/{nextLevel.range[0]} experiences</span>
              </div>
              <Progress value={progressToNext} className="h-2 bg-white/20" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {[
          { id: 'referrals', label: 'Referrals', icon: Users },
          { id: 'rewards', label: 'Rewards', icon: Gift },
          { id: 'surprises', label: 'Surprises', icon: Sparkles }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeTab === id ? 'default' : 'outline'}
            onClick={() => setActiveTab(id as any)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'surprises' && surpriseExperiences.length > 0 && (
              <Badge className="ml-1 bg-red-500 text-white text-xs">
                {surpriseExperiences.length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          {/* Referral Code Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Your Referral Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Share this code with friends</p>
                  <p className="text-2xl font-bold font-mono">{userData.referralCode}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={copyReferralCode}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copiedCode ? 'Copied!' : 'Copy'}
                </Button>
              </div>

              {/* Social Sharing */}
              <div>
                <p className="text-sm text-gray-600 mb-3">Share on social media</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('whatsapp')}
                    className="flex items-center gap-2 bg-green-50 hover:bg-green-100"
                  >
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('instagram')}
                    className="flex items-center gap-2 bg-pink-50 hover:bg-pink-100"
                  >
                    <Instagram className="w-4 h-4 text-pink-600" />
                    Instagram
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareToSocial('facebook')}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100"
                  >
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{userData.totalReferrals}</p>
                <p className="text-sm text-gray-600">Total Referrals</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{userData.successfulReferrals}</p>
                <p className="text-sm text-gray-600">Successful</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Gift className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">${userData.totalEarnings}</p>
                <p className="text-sm text-gray-600">Total Earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Referral Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Referral Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-green-600">For You (Referrer)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span className="text-sm">$25 credit when friend books</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-green-600" />
                      <span className="text-sm">$10 bonus when they complete experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-green-600" />
                      <span className="text-sm">$100 bonus after 5 successful referrals</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">For Your Friend</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">25% off first experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Free upgrade to next tier if available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Welcome gift from artisan</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-6">
          {/* Current Level Benefits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Your Current Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{currentLevel.emoji}</div>
                <div>
                  <h3 className="text-xl font-bold">{currentLevel.name}</h3>
                  <Badge className={currentLevel.color}>Active Level</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentLevel.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Levels Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Cultural Explorer Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {culturalLevels.map((level, index) => {
                  const isCurrentLevel = level.name === currentLevel.name;
                  const isUnlocked = userData.experienceCount >= level.range[0];
                  
                  return (
                    <div 
                      key={level.name}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCurrentLevel ? 'border-orange-500 bg-orange-50' : 
                        isUnlocked ? 'border-green-200 bg-green-50' : 
                        'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{level.emoji}</div>
                          <div>
                            <h4 className="font-semibold">{level.name}</h4>
                            <p className="text-sm text-gray-600">
                              {level.range[1] === Infinity ? 
                                `${level.range[0]}+ experiences` : 
                                `${level.range[0]}-${level.range[1]} experiences`
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isCurrentLevel && <Badge className="bg-orange-500 text-white">Current</Badge>}
                          {isUnlocked && !isCurrentLevel && <Badge className="bg-green-500 text-white">Unlocked</Badge>}
                          {!isUnlocked && <Badge variant="outline">Locked</Badge>}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {level.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex items-center gap-2">
                            <Star className={`w-3 h-3 ${isUnlocked ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className={`text-sm ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Surprises Tab */}
      {activeTab === 'surprises' && (
        <div className="space-y-6">
          {surpriseExperiences.length > 0 ? (
            <div className="space-y-4">
              {surpriseExperiences.map((surprise) => (
                <Card key={surprise.id} className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        {surprise.title}
                      </CardTitle>
                      <Badge className="bg-purple-100 text-purple-800">
                        ${surprise.value} value
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{surprise.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>From: {surprise.artisanName}</p>
                        <p>Expires: {surprise.expiresAt}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Maybe Later
                        </Button>
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          Accept Surprise!
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Surprises Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Complete more experiences to unlock surprise cultural gifts!
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Explore Experiences
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Surprise Types Info */}
          <Card>
            <CardHeader>
              <CardTitle>Types of Surprises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-600" />
                    <span className="font-semibold">Workshop Bonuses</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    Surprise activities after completing experiences (30% chance)
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-600" />
                    <span className="font-semibold">Anniversary Gifts</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    Special surprises on your booking anniversaries (guaranteed)
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold">Festival Bonuses</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    Cultural festival experiences during special periods (50% chance)
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">Random Delights</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">
                    Unexpected cultural treasures and discoveries (10% chance)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Sample data for testing
export const sampleReferralData: ReferralData = {
  userId: 'user-123',
  userName: 'Sarah Johnson',
  referralCode: 'FRIEND-SARAH-123',
  totalReferrals: 8,
  successfulReferrals: 5,
  pendingReferrals: 3,
  totalEarnings: 175,
  currentLevel: 'EXPLORER',
  experienceCount: 3,
  nextMilestone: 5,
  nextReward: 'CONNOISSEUR level benefits'
};

export const sampleSurpriseExperiences: SurpriseExperience[] = [
  {
    id: 'surprise-1',
    title: 'Traditional Mint Tea Ceremony',
    description: 'Hassan was so impressed with your pottery skills, he\'s inviting you to join his family for traditional mint tea and stories about 20 generations of potters!',
    type: 'workshop_bonus',
    artisanName: 'Hassan Benali',
    value: 50,
    expiresAt: 'Tomorrow 6 PM'
  },
  {
    id: 'surprise-2',
    title: 'Festival Parade Participation',
    description: 'Join the upcoming Fez Cultural Festival parade wearing traditional Moroccan attire and learn about the historical significance of each costume.',
    type: 'festival',
    artisanName: 'Cultural Center Fez',
    value: 120,
    expiresAt: 'Next Friday'
  }
]; 