// Comprehensive Artisan Metrics & Booking System Types

export interface PublicArtisanMetrics {
  // Shared metrics visible to all artisans for competitive benchmarking
  artisan_id: string;
  artisan_name: string;
  craft_category: string;
  region: string;
  
  // Performance Metrics
  total_pieces: number;
  verified_pieces: number;
  preservation_progress: number;
  tourist_interactions: number;
  monthly_earnings: number;
  cultural_impact_score: number;
  
  // Ranking & Recognition
  ranking_in_category: number;
  ranking_in_region: number;
  master_level: 'apprentice' | 'craftsman' | 'master' | 'grand-master';
  achievements: string[];
  
  // Public Performance Indicators
  average_rating: number;
  total_reviews: number;
  repeat_customer_rate: number;
  booking_rate: number; // percentage of capacity booked
  response_time_hours: number;
  
  // Updated monthly for comparison
  last_updated: Date;
}

export interface PersonalArtisanMetrics {
  artisan_id: string;
  
  // Detailed Financial Metrics
  earnings: {
    monthly: number;
    quarterly: number;
    yearly: number;
    currency: 'MAD' | 'USD' | 'EUR';
    breakdown: {
      direct_sales: number;
      experience_bookings: number;
      teaching_sessions: number;
      preservation_compensation: number;
    };
    growth_rate: number; // percentage change
    projected_next_month: number;
  };
  
  // Capacity & Booking Metrics
  capacity: {
    max_daily_tourists: number;
    max_weekly_workshops: number;
    max_monthly_demonstrations: number;
    current_utilization: number; // percentage
    peak_season_capacity: number;
    off_season_capacity: number;
  };
  
  // Tourist Engagement Detailed
  tourist_metrics: {
    total_unique_visitors: number;
    repeat_visitors: number;
    average_session_duration_hours: number;
    conversion_rate: number; // visitors to bookings
    cancellation_rate: number;
    no_show_rate: number;
    tourist_demographics: {
      age_groups: Record<string, number>;
      nationalities: Record<string, number>;
      experience_levels: Record<string, number>;
    };
  };
  
  // Service Performance
  service_metrics: {
    most_popular_experiences: Array<{
      experience_name: string;
      booking_count: number;
      average_rating: number;
      revenue_generated: number;
    }>;
    least_popular_experiences: Array<{
      experience_name: string;
      booking_count: number;
      issues_identified: string[];
      improvement_suggestions: string[];
    }>;
    seasonal_performance: Record<string, {
      bookings: number;
      revenue: number;
      satisfaction: number;
    }>;
  };
  
  // Marketing Support Metrics
  marketing_effectiveness: {
    channel_performance: Record<string, {
      leads_generated: number;
      conversion_rate: number;
      cost_per_acquisition: number;
    }>;
    content_engagement: {
      social_media_reach: number;
      website_views: number;
      inquiry_rate: number;
    };
    referral_rate: number;
    word_of_mouth_bookings: number;
  };
  
  // Cultural Impact Detailed
  cultural_impact: {
    knowledge_transfer_sessions: number;
    techniques_taught: string[];
    cultural_stories_shared: number;
    community_engagement_hours: number;
    preservation_contributions: string[];
    media_mentions: number;
    educational_partnerships: number;
  };
}

export interface ArtisanBookingCapacity {
  artisan_id: string;
  
  // Daily Capacity
  daily_slots: Array<{
    date: Date;
    morning_slots: number;
    afternoon_slots: number;
    evening_slots: number;
    max_group_size: number;
    available_slots: number;
    booked_slots: number;
  }>;
  
  // Experience Types & Capacity
  experience_types: Array<{
    id: string;
    name: string;
    duration_hours: number;
    max_participants: number;
    min_participants: number;
    price_per_person: number;
    preparation_time_hours: number;
    equipment_needed: string[];
    skill_level_required: 'beginner' | 'intermediate' | 'advanced';
    seasonal_availability: string[];
  }>;
  
  // Booking Rules
  booking_rules: {
    advance_booking_required_days: number;
    cancellation_policy_hours: number;
    group_discount_threshold: number;
    peak_season_surcharge: number;
    equipment_rental_available: boolean;
    language_support: string[];
  };
  
  // Real-time Availability
  current_availability: {
    next_available_slot: Date;
    slots_this_week: number;
    slots_next_week: number;
    busy_periods: Array<{
      start_date: Date;
      end_date: Date;
      reason: string;
    }>;
  };
}

export interface FeedbackLoop {
  artisan_id: string;
  
  // Tourist Feedback
  tourist_feedback: Array<{
    booking_id: string;
    tourist_id: string;
    experience_type: string;
    booking_date: Date;
    rating: number;
    review_text: string;
    specific_feedback: {
      instruction_quality: number;
      cultural_authenticity: number;
      value_for_money: number;
      communication: number;
      facility_quality: number;
    };
    improvement_suggestions: string[];
    would_recommend: boolean;
    would_return: boolean;
    created_at: Date;
  }>;
  
  // Performance Analytics
  feedback_analytics: {
    average_ratings_trend: Array<{
      period: string;
      rating: number;
      review_count: number;
    }>;
    common_complaints: Array<{
      issue: string;
      frequency: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
    common_praises: Array<{
      praise: string;
      frequency: number;
    }>;
    improvement_areas: Array<{
      area: string;
      priority: number;
      suggested_actions: string[];
    }>;
  };
  
  // Service Adaptation Recommendations
  adaptation_recommendations: Array<{
    recommendation_id: string;
    type: 'add_service' | 'modify_service' | 'remove_service' | 'adjust_pricing' | 'change_capacity';
    current_service: string;
    suggested_change: string;
    reasoning: string;
    data_supporting: {
      booking_trends: number[];
      rating_trends: number[];
      revenue_impact: number;
      competitor_analysis: string;
    };
    implementation_effort: 'low' | 'medium' | 'high';
    expected_impact: 'low' | 'medium' | 'high';
    status: 'pending' | 'accepted' | 'rejected' | 'implemented';
    created_at: Date;
  }>;
}

export interface ServiceOffering {
  id: string;
  artisan_id: string;
  name: string;
  description: string;
  category: 'workshop' | 'demonstration' | 'cultural_immersion' | 'learning_session' | 'custom';
  
  // Pricing Strategy
  pricing: {
    base_price: number;
    currency: 'MAD' | 'USD' | 'EUR';
    pricing_model: 'per_person' | 'per_group' | 'hourly' | 'fixed';
    dynamic_pricing_enabled: boolean;
    peak_season_multiplier: number;
    group_size_discounts: Array<{
      min_size: number;
      discount_percentage: number;
    }>;
  };
  
  // Performance Tracking
  performance: {
    total_bookings: number;
    total_revenue: number;
    average_rating: number;
    cancellation_rate: number;
    rebooking_rate: number;
    profit_margin: number;
  };
  
  // Adaptation History
  adaptation_history: Array<{
    date: Date;
    change_type: string;
    old_value: any;
    new_value: any;
    reason: string;
    impact_measured: {
      booking_change: number;
      rating_change: number;
      revenue_change: number;
    };
  }>;
  
  // Current Status
  status: 'active' | 'paused' | 'seasonal' | 'discontinued';
  last_modified: Date;
  next_review_date: Date;
}

export interface MarketingTeamMetrics {
  // Aggregate Performance
  total_artisans: number;
  active_artisans: number;
  total_monthly_revenue: number;
  total_tourist_interactions: number;
  overall_satisfaction_rating: number;
  
  // Category Performance
  category_performance: Record<string, {
    artisan_count: number;
    average_earnings: number;
    booking_rate: number;
    satisfaction_score: number;
    growth_rate: number;
  }>;
  
  // Regional Analysis
  regional_metrics: Record<string, {
    artisan_count: number;
    tourist_volume: number;
    average_spend: number;
    cultural_impact_score: number;
    market_penetration: number;
  }>;
  
  // Marketing Effectiveness
  campaign_performance: Array<{
    campaign_name: string;
    start_date: Date;
    end_date: Date;
    budget: number;
    leads_generated: number;
    conversions: number;
    revenue_attributed: number;
    roi: number;
    target_artisans: string[];
  }>;
  
  // Trend Analysis
  trends: {
    fastest_growing_crafts: string[];
    declining_categories: string[];
    emerging_markets: string[];
    seasonal_patterns: Record<string, number>;
    tourist_preference_shifts: Array<{
      trend: string;
      growth_rate: number;
      impact_level: 'low' | 'medium' | 'high';
    }>;
  };
}

export interface ArtisanDashboardConfig {
  artisan_id: string;
  
  // Widget Preferences
  visible_widgets: Array<{
    widget_type: string;
    position: number;
    size: 'small' | 'medium' | 'large';
    refresh_interval: number;
  }>;
  
  // Notification Preferences
  notifications: {
    new_bookings: boolean;
    rating_alerts: boolean;
    capacity_warnings: boolean;
    revenue_milestones: boolean;
    feedback_summaries: boolean;
    recommendation_alerts: boolean;
  };
  
  // Goal Setting
  personal_goals: Array<{
    goal_type: 'revenue' | 'bookings' | 'rating' | 'capacity' | 'custom';
    target_value: number;
    current_value: number;
    deadline: Date;
    progress_percentage: number;
  }>;
  
  // Benchmarking Preferences
  benchmarking: {
    compare_to_category: boolean;
    compare_to_region: boolean;
    compare_to_similar_experience: boolean;
    show_rankings: boolean;
  };
} 