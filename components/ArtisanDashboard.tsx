'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  PublicArtisanMetrics, 
  PersonalArtisanMetrics, 
  ArtisanBookingCapacity,
  FeedbackLoop
} from '@/types/artisan-metrics';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Award,
  BarChart3,
  CheckCircle,
  Target,
  TrendingUp,
  Heart,
  Shield,
  BookOpen,
  Settings,
  ArrowRight,
  RefreshCw,
  Lock,
  Eye,
  EyeOff,
  DollarSign,
  Calendar,
  Star,
  MessageCircle,
  Lightbulb,
  Trophy,
  LogIn,
  UserCheck,
  AlertCircle,
  Phone,
  Clock
} from 'lucide-react';

interface ArtisanDashboardProps {
  artisanId: string;
  userRole?: 'artisan' | 'admin' | 'content_creator' | 'viewer';
}

export default function ArtisanDashboard({ artisanId, userRole = 'viewer' }: ArtisanDashboardProps) {
  const router = useRouter();
  const t = useTranslations('artisan.dashboard');
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isPersonalAuthenticated, setIsPersonalAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Data states
  const [publicMetrics, setPublicMetrics] = useState<PublicArtisanMetrics[]>([]);
  const [personalMetrics, setPersonalMetrics] = useState<PersonalArtisanMetrics | null>(null);
  const [currentArtisan, setCurrentArtisan] = useState<PublicArtisanMetrics | null>(null);

  const isAdmin = userRole === 'admin';
  const isContentCreator = userRole === 'content_creator';
  const canAccessPreservation = isAdmin || isContentCreator;

  useEffect(() => {
    loadGeneralMetrics();
  }, [artisanId]);

  const loadGeneralMetrics = async () => {
    setIsLoading(true);
    try {
      // Load public metrics that are visible to everyone
      const mockPublicMetrics: PublicArtisanMetrics[] = [
        {
          artisan_id: artisanId,
          artisan_name: 'Hassan Al-Drawi',
          craft_category: 'Pottery',
          region: 'Draa Valley',
          total_pieces: 15,
          verified_pieces: 12,
          preservation_progress: 60,
          tourist_interactions: 31,
          monthly_earnings: 2450,
          cultural_impact_score: 87,
          ranking_in_category: 3,
          ranking_in_region: 2,
          master_level: 'master',
          achievements: ['Cultural Heritage Award 2024', 'Top Rated Artisan'],
          average_rating: 4.8,
          total_reviews: 127,
          repeat_customer_rate: 35,
          booking_rate: 78,
          response_time_hours: 2.5,
          last_updated: new Date()
        },
        // Other artisans for comparison (visible to all)
        {
          artisan_id: 'ART-2024-002',
          artisan_name: 'Aicha Tazi',
          craft_category: 'Pottery',
          region: 'Draa Valley',
          total_pieces: 18,
          verified_pieces: 15,
          preservation_progress: 85,
          tourist_interactions: 42,
          monthly_earnings: 3200,
          cultural_impact_score: 92,
          ranking_in_category: 1,
          ranking_in_region: 1,
          master_level: 'grand-master',
          achievements: ['UNESCO Recognition', 'Master Craftsperson 2023'],
          average_rating: 4.9,
          total_reviews: 203,
          repeat_customer_rate: 48,
          booking_rate: 95,
          response_time_hours: 1.2,
          last_updated: new Date()
        },
        {
          artisan_id: 'ART-2024-003',
          artisan_name: 'Omar Benali',
          craft_category: 'Pottery',
          region: 'Draa Valley',
          total_pieces: 12,
          verified_pieces: 9,
          preservation_progress: 45,
          tourist_interactions: 28,
          monthly_earnings: 1950,
          cultural_impact_score: 73,
          ranking_in_category: 5,
          ranking_in_region: 4,
          master_level: 'craftsman',
          achievements: ['Rising Star 2024'],
          average_rating: 4.6,
          total_reviews: 89,
          repeat_customer_rate: 28,
          booking_rate: 65,
          response_time_hours: 4.1,
          last_updated: new Date()
        }
      ];
      
      setPublicMetrics(mockPublicMetrics);
      setCurrentArtisan(mockPublicMetrics.find(m => m.artisan_id === artisanId) || null);
    } catch (error) {
      console.error('Failed to load general metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonalAuth = async () => {
    if (authCode === '123456') { // Mock authentication
      setIsPersonalAuthenticated(true);
      setShowAuthModal(false);
      setAuthError('');
      setActiveTab('personal');
      await loadPersonalMetrics();
    } else {
      setAuthError(t('authentication.error'));
    }
  };

  const loadPersonalMetrics = async () => {
    // Load detailed personal metrics only after authentication
    const mockPersonalMetrics: PersonalArtisanMetrics = {
      artisan_id: artisanId,
      earnings: {
        monthly: 2450,
        quarterly: 7200,
        yearly: 29800,
        currency: 'MAD',
        breakdown: {
          direct_sales: 1200,
          experience_bookings: 950,
          teaching_sessions: 200,
          preservation_compensation: 100
        },
        growth_rate: 15.5,
        projected_next_month: 2820
      },
      capacity: {
        max_daily_tourists: 8,
        max_weekly_workshops: 12,
        max_monthly_demonstrations: 25,
        current_utilization: 78,
        peak_season_capacity: 10,
        off_season_capacity: 6
      },
      tourist_metrics: {
        total_unique_visitors: 127,
        repeat_visitors: 44,
        average_session_duration_hours: 3.5,
        conversion_rate: 68,
        cancellation_rate: 8,
        no_show_rate: 3,
        tourist_demographics: {
          age_groups: { '25-35': 35, '36-45': 28, '46-55': 22, '55+': 15 },
          nationalities: { 'French': 32, 'German': 25, 'American': 18, 'British': 15, 'Other': 10 },
          experience_levels: { 'Beginner': 45, 'Intermediate': 35, 'Advanced': 20 }
        }
      },
      service_metrics: {
        most_popular_experiences: [
          { experience_name: 'Traditional Blue Pottery Workshop', booking_count: 45, average_rating: 4.9, revenue_generated: 2250 },
          { experience_name: 'Glazing Technique Masterclass', booking_count: 32, average_rating: 4.8, revenue_generated: 1920 }
        ],
        least_popular_experiences: [
          { experience_name: 'Clay Preparation Demo', booking_count: 8, issues_identified: ['Too technical', 'Not hands-on enough'], improvement_suggestions: ['Add interactive elements', 'Simplify explanation'] }
        ],
        seasonal_performance: {
          'Spring': { bookings: 28, revenue: 1680, satisfaction: 4.7 },
          'Summer': { bookings: 52, revenue: 3120, satisfaction: 4.9 },
          'Fall': { bookings: 35, revenue: 2100, satisfaction: 4.8 },
          'Winter': { bookings: 18, revenue: 1080, satisfaction: 4.6 }
        }
      },
      marketing_effectiveness: {
        channel_performance: {
          'Social Media': { leads_generated: 45, conversion_rate: 72, cost_per_acquisition: 25 },
          'Website': { leads_generated: 38, conversion_rate: 65, cost_per_acquisition: 30 },
          'Referrals': { leads_generated: 22, conversion_rate: 85, cost_per_acquisition: 10 }
        },
        content_engagement: {
          social_media_reach: 2500,
          website_views: 1200,
          inquiry_rate: 15
        },
        referral_rate: 35,
        word_of_mouth_bookings: 22
      },
      cultural_impact: {
        knowledge_transfer_sessions: 45,
        techniques_taught: ['Blue glazing', 'Wheel throwing', 'Traditional firing'],
        cultural_stories_shared: 23,
        community_engagement_hours: 120,
        preservation_contributions: ['Documented ancient techniques', 'Trained 3 apprentices'],
        media_mentions: 5,
        educational_partnerships: 2
      }
    };
    setPersonalMetrics(mockPersonalMetrics);
  };

  const handleNavigateToPreservation = () => {
    router.push('/en/artisan/preservation');
  };

  const handleNavigateToAdminDashboard = () => {
    router.push('/en/admin/preservation-dashboard');
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-3 h-3 text-green-600" />;
    if (value < 0) return <TrendingUp className="w-3 h-3 text-red-600 transform rotate-180" />;
    return <TrendingUp className="w-3 h-3 text-gray-600" />;
  };

  const tabs = [
    { id: 'general', label: t('tabs.general'), icon: BarChart3, public: true },
    { id: 'rankings', label: t('tabs.rankings'), icon: Trophy, public: true },
    { id: 'personal', label: t('tabs.personal'), icon: Lock, public: false }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moroccan-sand via-white to-moroccan-sand/30 flex items-center justify-center p-4">
        <Card className="p-6 w-full max-w-sm">
          <div className="flex items-center gap-4">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <div>{t('loading')}</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-moroccan-sand via-white to-moroccan-sand/30">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Mobile-First Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {t('title')}
          </h1>
        </div>

        {/* Admin Controls - Mobile Optimized */}
        {canAccessPreservation && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800 text-sm md:text-base">
                <Shield className="w-4 h-4" />
                {isAdmin ? t('admin_controls.title') : t('admin_controls.content_creator_tools')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={handleNavigateToPreservation}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm flex-1"
                  size="sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('admin_controls.preservation_portal')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                {isAdmin && (
                  <Button 
                    variant="outline"
                    onClick={handleNavigateToAdminDashboard}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 text-sm flex-1"
                    size="sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t('admin_controls.admin_dashboard')}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mobile-First Key Metrics */}
        {currentArtisan && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Card className="text-center">
              <CardContent className="p-3">
                <Award className="w-5 h-5 mx-auto mb-2 text-blue-600" />
                <div className="text-base md:text-lg font-bold">{currentArtisan.total_pieces}</div>
                <div className="text-xs text-gray-600">{t('metrics.total_pieces')}</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(15)}
                  <span className="text-xs text-green-600 ml-1">+15%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-3">
                <CheckCircle className="w-5 h-5 mx-auto mb-2 text-green-600" />
                <div className="text-base md:text-lg font-bold">{currentArtisan.verified_pieces}</div>
                <div className="text-xs text-gray-600">{t('metrics.verified')}</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(8)}
                  <span className="text-xs text-green-600 ml-1">+8%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-3">
                <Target className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                <div className="text-base md:text-lg font-bold">{currentArtisan.preservation_progress}%</div>
                <div className="text-xs text-gray-600">{t('metrics.preservation')}</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(5)}
                  <span className="text-xs text-green-600 ml-1">+5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-3">
                <Users className="w-5 h-5 mx-auto mb-2 text-orange-600" />
                <div className="text-base md:text-lg font-bold">{currentArtisan.tourist_interactions}</div>
                <div className="text-xs text-gray-600">{t('metrics.tourists')}</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(12)}
                  <span className="text-xs text-green-600 ml-1">+12%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-3">
                <DollarSign className="w-5 h-5 mx-auto mb-2 text-green-600" />
                <div className="text-base md:text-lg font-bold">{currentArtisan.monthly_earnings}</div>
                <div className="text-xs text-gray-600">{t('metrics.monthly_mad')}</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(18)}
                  <span className="text-xs text-green-600 ml-1">+18%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-3">
                <Heart className="w-5 h-5 mx-auto mb-2 text-red-600" />
                <div className="text-base md:text-lg font-bold">{currentArtisan.cultural_impact_score}</div>
                <div className="text-xs text-gray-600">{t('metrics.impact_score')}</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(7)}
                  <span className="text-xs text-green-600 ml-1">+7%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mobile-First Navigation Tabs */}
        <div className="flex flex-col sm:flex-row gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isLocked = !tab.public && !isPersonalAuthenticated;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => {
                  if (tab.id === 'personal' && !isPersonalAuthenticated) {
                    setShowAuthModal(true);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className="flex items-center justify-center gap-2 text-sm flex-1"
                size="sm"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isLocked && <Lock className="w-3 h-3" />}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === 'general' && currentArtisan && (
            <div className="space-y-4">
              {/* Artisan Profile */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {t('profile.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div>
                        <h3 className="font-semibold text-lg">{currentArtisan.artisan_name}</h3>
                        <div className="space-y-1 text-sm">
                          <div><strong>{t('profile.craft')}:</strong> {currentArtisan.craft_category}</div>
                          <div><strong>{t('profile.region')}:</strong> {currentArtisan.region}</div>
                          <div><strong>{t('profile.master_level')}:</strong> 
                            <Badge variant={currentArtisan.master_level === 'master' ? 'default' : 'secondary'} className="ml-2">
                              {t(`master_levels.${currentArtisan.master_level}`)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <div className="text-2xl font-bold text-blue-600">⭐ {currentArtisan.average_rating}</div>
                        <div className="text-xs text-gray-600">{currentArtisan.total_reviews} {t('profile.reviews')}</div>
                      </div>
                    </div>
                    
                    {currentArtisan.achievements.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">{t('profile.achievements')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentArtisan.achievements.map((achievement, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{achievement}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Indicators */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    {t('profile.performance_indicators')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('metrics.booking_rate')}</span>
                        <span className="font-bold">{currentArtisan.booking_rate}%</span>
                      </div>
                      <Progress value={currentArtisan.booking_rate} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{t('metrics.repeat_customers')}</span>
                        <span className="font-bold">{currentArtisan.repeat_customer_rate}%</span>
                      </div>
                      <Progress value={currentArtisan.repeat_customer_rate} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{currentArtisan.response_time_hours}h</div>
                        <div className="text-xs text-gray-600">{t('metrics.avg_response_time')}</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">#{currentArtisan.ranking_in_region}</div>
                        <div className="text-xs text-gray-600">{t('metrics.regional_ranking')}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'rankings' && (
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    {t('rankings.title')} - {currentArtisan?.craft_category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {publicMetrics
                      .filter(m => m.craft_category === currentArtisan?.craft_category)
                      .sort((a, b) => a.ranking_in_category - b.ranking_in_category)
                      .map((artisan, idx) => (
                      <div key={artisan.artisan_id} className={`p-3 border rounded-lg ${artisan.artisan_id === artisanId ? 'bg-blue-50 border-blue-200' : ''}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                              idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-500' : 'bg-gray-300'
                            }`}>
                              {idx + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{artisan.artisan_name}</h3>
                              <p className="text-xs text-gray-600">{artisan.region}</p>
                            </div>
                          </div>
                          <Badge variant={artisan.artisan_id === artisanId ? 'default' : 'secondary'} className="text-xs">
                            {t(`master_levels.${artisan.master_level}`)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                          <div className="text-center">
                            <div className="font-bold">{artisan.monthly_earnings}</div>
                            <div className="text-gray-600">MAD</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{artisan.booking_rate}%</div>
                            <div className="text-gray-600">{t('rankings.booking')}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{artisan.average_rating}</div>
                            <div className="text-gray-600">{t('rankings.rating')}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{artisan.cultural_impact_score}</div>
                            <div className="text-gray-600">{t('rankings.impact')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'personal' && isPersonalAuthenticated && personalMetrics && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <UserCheck className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {t('authentication.success')}
                </AlertDescription>
              </Alert>

              {/* Financial Breakdown */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    {t('personal.financial_performance')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg md:text-xl font-bold text-green-600">{personalMetrics.earnings.breakdown.experience_bookings}</div>
                      <div className="text-xs text-gray-600">{t('personal.experience_bookings')}</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg md:text-xl font-bold text-blue-600">{personalMetrics.earnings.breakdown.direct_sales}</div>
                      <div className="text-xs text-gray-600">{t('personal.direct_sales')}</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg md:text-xl font-bold text-purple-600">{personalMetrics.earnings.breakdown.teaching_sessions}</div>
                      <div className="text-xs text-gray-600">{t('personal.teaching_sessions')}</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="text-lg md:text-xl font-bold text-orange-600">{personalMetrics.earnings.breakdown.preservation_compensation}</div>
                      <div className="text-xs text-gray-600">{t('personal.preservation_work')}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span>{t('personal.growth_rate')}</span>
                      <span className="font-bold text-green-600">+{personalMetrics.earnings.growth_rate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t('personal.projected_next_month')}</span>
                      <span className="font-bold">{personalMetrics.earnings.projected_next_month} MAD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity & Tourist Metrics */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t('personal.capacity_analytics')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t('personal.current_utilization')}</span>
                      <span className="font-bold">{personalMetrics.capacity.current_utilization}%</span>
                    </div>
                    <Progress value={personalMetrics.capacity.current_utilization} className="h-2" />
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 border rounded-lg">
                        <div className="font-bold text-sm">{personalMetrics.capacity.max_daily_tourists}</div>
                        <div className="text-xs text-gray-600">{t('personal.daily_max')}</div>
                      </div>
                      <div className="p-2 border rounded-lg">
                        <div className="font-bold text-sm">{personalMetrics.tourist_metrics.repeat_visitors}</div>
                        <div className="text-xs text-gray-600">{t('personal.repeat_visitors')}</div>
                      </div>
                      <div className="p-2 border rounded-lg">
                        <div className="font-bold text-sm">{personalMetrics.tourist_metrics.conversion_rate}%</div>
                        <div className="text-xs text-gray-600">{t('personal.conversion')}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Authentication Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {t('authentication.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  {t('authentication.description')}
                </p>
                <Input
                  type="password"
                  placeholder={t('authentication.placeholder')}
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="text-center"
                />
                {authError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm text-red-700">
                      {authError}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="text-xs text-gray-500 text-center">
                  {t('authentication.demo_code')}
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePersonalAuth} className="flex-1">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('authentication.authenticate')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowAuthModal(false)} className="flex-1">
                    {t('authentication.cancel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 