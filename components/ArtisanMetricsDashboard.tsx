'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  PublicArtisanMetrics, 
  PersonalArtisanMetrics, 
  ArtisanBookingCapacity,
  FeedbackLoop,
  ServiceOffering
} from '@/types/artisan-metrics';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Star, 
  DollarSign, 
  Target, 
  Award, 
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  BookOpen,
  Settings,
  Lightbulb,
  MapPin,
  Trophy,
  Heart,
  MessageCircle,
  RefreshCw,
  Filter,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface ArtisanMetricsDashboardProps {
  artisanId: string;
}

export default function ArtisanMetricsDashboard({ artisanId }: ArtisanMetricsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [publicMetrics, setPublicMetrics] = useState<PublicArtisanMetrics[]>([]);
  const [personalMetrics, setPersonalMetrics] = useState<PersonalArtisanMetrics | null>(null);
  const [bookingCapacity, setBookingCapacity] = useState<ArtisanBookingCapacity | null>(null);
  const [feedbackLoop, setFeedbackLoop] = useState<FeedbackLoop | null>(null);
  const [serviceOfferings, setServiceOfferings] = useState<ServiceOffering[]>([]);

  useEffect(() => {
    loadAllMetrics();
  }, [artisanId]);

  const loadAllMetrics = async () => {
    setIsLoading(true);
    try {
      // Simulate loading comprehensive metrics data
      await loadPublicMetrics();
      await loadPersonalMetrics();
      await loadBookingCapacity();
      await loadFeedbackData();
      await loadServiceOfferings();
    } catch (error) {
      console.error('Failed to load metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPublicMetrics = async () => {
    // Mock data for public metrics comparison
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
      // Other artisans for comparison
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
      }
    ];
    setPublicMetrics(mockPublicMetrics);
  };

  const loadPersonalMetrics = async () => {
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

  const loadBookingCapacity = async () => {
    // Mock booking capacity data
    const mockCapacity: ArtisanBookingCapacity = {
      artisan_id: artisanId,
      daily_slots: [], // Would be populated with actual dates
      experience_types: [
        {
          id: 'EXP-001',
          name: 'Traditional Blue Pottery Workshop',
          duration_hours: 4,
          max_participants: 6,
          min_participants: 2,
          price_per_person: 150,
          preparation_time_hours: 1,
          equipment_needed: ['Clay', 'Pottery wheel', 'Glazes'],
          skill_level_required: 'beginner',
          seasonal_availability: ['all']
        }
      ],
      booking_rules: {
        advance_booking_required_days: 3,
        cancellation_policy_hours: 24,
        group_discount_threshold: 4,
        peak_season_surcharge: 20,
        equipment_rental_available: true,
        language_support: ['Arabic', 'French', 'English']
      },
      current_availability: {
        next_available_slot: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        slots_this_week: 8,
        slots_next_week: 12,
        busy_periods: []
      }
    };
    setBookingCapacity(mockCapacity);
  };

  const loadFeedbackData = async () => {
    // Mock feedback data
    const mockFeedback: FeedbackLoop = {
      artisan_id: artisanId,
      tourist_feedback: [],
      feedback_analytics: {
        average_ratings_trend: [
          { period: 'Jan 2024', rating: 4.6, review_count: 12 },
          { period: 'Feb 2024', rating: 4.7, review_count: 15 },
          { period: 'Mar 2024', rating: 4.8, review_count: 18 }
        ],
        common_complaints: [
          { issue: 'Workshop too short', frequency: 8, severity: 'medium' },
          { issue: 'Limited parking', frequency: 5, severity: 'low' }
        ],
        common_praises: [
          { praise: 'Excellent instruction', frequency: 45 },
          { praise: 'Authentic experience', frequency: 38 }
        ],
        improvement_areas: [
          { area: 'Workshop duration', priority: 8, suggested_actions: ['Offer extended sessions', 'Add follow-up workshops'] }
        ]
      },
      adaptation_recommendations: [
        {
          recommendation_id: 'REC-001',
          type: 'modify_service',
          current_service: 'Basic Workshop',
          suggested_change: 'Extend to 6 hours with lunch break',
          reasoning: 'Multiple reviews request longer sessions',
          data_supporting: {
            booking_trends: [45, 52, 48],
            rating_trends: [4.6, 4.7, 4.8],
            revenue_impact: 300,
            competitor_analysis: 'Competitors offer 6-hour sessions'
          },
          implementation_effort: 'medium',
          expected_impact: 'high',
          status: 'pending',
          created_at: new Date()
        }
      ]
    };
    setFeedbackLoop(mockFeedback);
  };

  const loadServiceOfferings = async () => {
    // Mock service offerings
    setServiceOfferings([]);
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const myMetrics = publicMetrics.find(m => m.artisan_id === artisanId);
  const competitorMetrics = publicMetrics.filter(m => m.artisan_id !== artisanId);

  const tabs = [
    { id: 'overview', label: 'Performance Overview', icon: BarChart3 },
    { id: 'benchmarking', label: 'Peer Benchmarking', icon: Trophy },
    { id: 'bookings', label: 'Booking & Capacity', icon: Calendar },
    { id: 'feedback', label: 'Feedback & Insights', icon: MessageCircle },
    { id: 'adaptations', label: 'Service Adaptations', icon: Lightbulb },
    { id: 'marketing', label: 'Marketing Impact', icon: TrendingUp }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-moroccan-sand via-white to-moroccan-sand/30 flex items-center justify-center">
        <Card className="p-8">
          <div className="flex items-center gap-4">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <div>Loading comprehensive metrics...</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-moroccan-sand via-white to-moroccan-sand/30">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            📊 Artisan Performance Metrics
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive analytics, benchmarking, and growth insights
          </p>
        </div>

        {/* Key Performance Indicators */}
        {myMetrics && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <Award className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-bold">{myMetrics.total_pieces}</div>
                <div className="text-xs text-gray-600">Total Pieces</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(15)}
                  <span className="text-xs text-green-600 ml-1">+15%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold">{myMetrics.verified_pieces}</div>
                <div className="text-xs text-gray-600">Verified</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(8)}
                  <span className="text-xs text-green-600 ml-1">+8%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <Target className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-bold">{myMetrics.preservation_progress}%</div>
                <div className="text-xs text-gray-600">Preservation</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(5)}
                  <span className="text-xs text-green-600 ml-1">+5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <Users className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                <div className="text-lg font-bold">{myMetrics.tourist_interactions}</div>
                <div className="text-xs text-gray-600">Tourists</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(12)}
                  <span className="text-xs text-green-600 ml-1">+12%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-bold">{myMetrics.monthly_earnings} MAD</div>
                <div className="text-xs text-gray-600">Monthly</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(18)}
                  <span className="text-xs text-green-600 ml-1">+18%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
                <div className="text-lg font-bold">{myMetrics.cultural_impact_score}</div>
                <div className="text-xs text-gray-600">Impact Score</div>
                <div className="flex items-center justify-center mt-1">
                  {getTrendIcon(7)}
                  <span className="text-xs text-green-600 ml-1">+7%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && personalMetrics && (
            <div className="space-y-6">
              {/* Financial Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{personalMetrics.earnings.breakdown.experience_bookings} MAD</div>
                      <div className="text-sm text-gray-600">Experience Bookings</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{personalMetrics.earnings.breakdown.direct_sales} MAD</div>
                      <div className="text-sm text-gray-600">Direct Sales</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{personalMetrics.earnings.breakdown.teaching_sessions} MAD</div>
                      <div className="text-sm text-gray-600">Teaching Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{personalMetrics.earnings.breakdown.preservation_compensation} MAD</div>
                      <div className="text-sm text-gray-600">Preservation Work</div>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Growth Rate</span>
                      <span className="font-bold text-green-600">+{personalMetrics.earnings.growth_rate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Projected Next Month</span>
                      <span className="font-bold">{personalMetrics.earnings.projected_next_month} MAD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capacity Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Capacity & Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Current Utilization</span>
                      <span className="font-bold">{personalMetrics.capacity.current_utilization}%</span>
                    </div>
                    <Progress value={personalMetrics.capacity.current_utilization} className="h-3" />
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="font-bold text-lg">{personalMetrics.capacity.max_daily_tourists}</div>
                        <div className="text-sm text-gray-600">Max Daily Tourists</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="font-bold text-lg">{personalMetrics.capacity.max_weekly_workshops}</div>
                        <div className="text-sm text-gray-600">Weekly Workshops</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="font-bold text-lg">{personalMetrics.capacity.max_monthly_demonstrations}</div>
                        <div className="text-sm text-gray-600">Monthly Demos</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'benchmarking' && myMetrics && (
            <div className="space-y-6">
              {/* My Performance vs Peers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Performance Ranking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">#{myMetrics.ranking_in_category}</div>
                      <div className="text-sm text-gray-600">Ranking in {myMetrics.craft_category}</div>
                      <div className="text-xs text-gray-500 mt-1">Out of 12 artisans</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-3xl font-bold text-green-600">#{myMetrics.ranking_in_region}</div>
                      <div className="text-sm text-gray-600">Ranking in {myMetrics.region}</div>
                      <div className="text-xs text-gray-500 mt-1">Out of 8 artisans</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Competitor Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Peer Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {competitorMetrics.map((competitor) => (
                      <div key={competitor.artisan_id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{competitor.artisan_name}</h3>
                            <p className="text-sm text-gray-600">{competitor.craft_category} • {competitor.region}</p>
                          </div>
                          <Badge variant={competitor.ranking_in_category === 1 ? 'default' : 'secondary'}>
                            Rank #{competitor.ranking_in_category}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                          <div className="text-center">
                            <div className="font-bold">{competitor.monthly_earnings}</div>
                            <div className="text-gray-600">Monthly MAD</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{competitor.booking_rate}%</div>
                            <div className="text-gray-600">Booking Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{competitor.average_rating}</div>
                            <div className="text-gray-600">Rating</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{competitor.cultural_impact_score}</div>
                            <div className="text-gray-600">Impact</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'feedback' && feedbackLoop && (
            <div className="space-y-6">
              {/* Feedback Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Customer Feedback Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 text-green-600">Common Praises</h3>
                      <div className="space-y-2">
                        {feedbackLoop.feedback_analytics.common_praises.map((praise, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                            <span className="flex-1 text-sm">{praise.praise}</span>
                            <Badge variant="secondary">{praise.frequency}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3 text-orange-600">Areas for Improvement</h3>
                      <div className="space-y-2">
                        {feedbackLoop.feedback_analytics.common_complaints.map((complaint, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                            <AlertTriangle className="w-4 h-4 text-orange-600" />
                            <span className="flex-1 text-sm">{complaint.issue}</span>
                            <Badge variant={complaint.severity === 'high' ? 'destructive' : 'secondary'}>
                              {complaint.frequency}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'adaptations' && feedbackLoop && (
            <div className="space-y-6">
              {/* Service Adaptation Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    AI-Powered Service Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feedbackLoop.adaptation_recommendations.map((rec) => (
                      <div key={rec.recommendation_id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{rec.suggested_change}</h3>
                            <p className="text-sm text-gray-600 mt-1">{rec.reasoning}</p>
                            <div className="mt-2 text-xs text-gray-500">
                              <strong>Current:</strong> {rec.current_service}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant={rec.expected_impact === 'high' ? 'default' : 'secondary'}>
                              {rec.expected_impact} impact
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              {rec.implementation_effort} effort
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Accept Recommendation
                          </Button>
                          <Button size="sm" variant="outline">
                            Need More Info
                          </Button>
                          <Button size="sm" variant="ghost">
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 