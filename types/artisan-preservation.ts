// Type definitions for Artisan Preservation System
// These types represent the real data structure from preservation database

export interface ArtisanProfile {
  id: string;
  name: string;
  craft: string;
  region: string;
  bio?: string;
  specialization: string[];
  experienceYears: number;
  masterLevel: 'apprentice' | 'craftsman' | 'master' | 'grand-master';
  contactInfo: {
    phone?: string;
    email?: string;
    workshop_location: string;
  };
  verification: {
    status: 'pending' | 'verified' | 'master-verified';
    verified_by?: string;
    verification_date?: Date;
  };
  created_at: Date;
  updated_at: Date;
}

export interface PreservationRecord {
  id: string;
  artisan_id: string;
  current_stage: 'intake' | 'consent' | 'documentation' | 'cultural-dna' | 'blockchain' | 'experience';
  stage_progress: number;
  overall_progress: number;
  status: 'active' | 'completed' | 'paused' | 'needs-review';
  last_updated: Date;
  field_liaison: string;
  endangerment_level: 'stable' | 'vulnerable' | 'endangered' | 'critical';
  cultural_dna: {
    technique_category: string;
    historical_period: string;
    cultural_significance: string;
    materials_used: string[];
    region_specific: boolean;
    unesco_recognized: boolean;
    intangible_elements: string[];
    transmission_method: string;
    current_practitioners: number;
    risk_factors: string[];
  };
  documentation: {
    voice_recording: boolean;
    video_documentation: boolean;
    image_portfolio: boolean;
    written_context: boolean;
    ai_transcription?: string;
    human_review_status: 'pending' | 'approved' | 'needs-revision';
    languages_documented: string[];
    total_hours_recorded: number;
    documentation_quality_score: number;
  };
  blockchain: {
    certificate_id?: string;
    transaction_hash?: string;
    ipfs_hash?: string;
    verification_level: 0 | 1 | 2 | 3;
    immutable_timestamp?: Date;
    smart_contract_address?: string;
  };
  tourist_engagement: {
    active_matches: number;
    completed_experiences: number;
    average_rating: number;
    total_earnings: number;
    experience_types: string[];
    cultural_impact_metrics: {
      knowledge_transferred: number;
      community_benefit: number;
      cultural_awareness_raised: number;
    };
  };
  created_at: Date;
  updated_at: Date;
}

export interface CraftPiece {
  id: string;
  artisan_id: string;
  title: string;
  description: string;
  craft_category: string;
  creation_date: Date;
  materials: string[];
  techniques: string[];
  time_to_create_hours: number;
  status: 'draft' | 'documented' | 'verified' | 'published';
  pricing: {
    amount: number;
    currency: 'MAD' | 'USD' | 'EUR';
    negotiable: boolean;
    cost_breakdown?: {
      materials: number;
      labor: number;
      overhead: number;
      artistic_value: number;
    };
  };
  multimedia: {
    primary_image?: string;
    gallery: string[];
    process_video?: string;
    story_audio?: string;
    documentary_content?: string[];
  };
  preservation_data: {
    cultural_significance: string;
    traditional_methods: boolean;
    innovation_elements: string[];
    preservation_priority: 'low' | 'medium' | 'high' | 'critical';
    endangerment_factors: string[];
    transmission_status: 'active' | 'declining' | 'reviving' | 'critical';
    related_techniques: string[];
  };
  market_data: {
    views: number;
    likes: number;
    shares: number;
    tourist_interest_score: number;
    cultural_authenticity_rating: number;
    market_demand_level: 'low' | 'medium' | 'high';
  };
  verification: {
    expert_reviewed: boolean;
    cultural_authority_approved: boolean;
    blockchain_verified: boolean;
    verification_notes?: string;
  };
  created_at: Date;
  updated_at: Date;
}

export interface TouristExperience {
  id: string;
  artisan_id: string;
  tourist_id: string;
  experience_type: 'workshop' | 'demonstration' | 'cultural_immersion' | 'learning_session';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  duration_hours: number;
  price: number;
  currency: string;
  scheduled_date: Date;
  completion_date?: Date;
  rating?: number;
  review?: string;
  cultural_knowledge_gained: string[];
  preservation_contribution: number;
  created_at: Date;
  updated_at: Date;
}

export interface PreservationStage {
  id: string;
  name: string;
  description: string;
  required_documents: string[];
  estimated_duration_days: number;
  completion_criteria: string[];
  prerequisites: string[];
  outputs: string[];
  responsible_parties: string[];
}

export interface CulturalDNAFramework {
  id: string;
  craft_category: string;
  region: string;
  historical_context: {
    origin_period: string;
    cultural_influences: string[];
    historical_significance: string;
    evolution_timeline: Array<{
      period: string;
      developments: string[];
      influences: string[];
    }>;
  };
  technical_specifications: {
    core_techniques: string[];
    required_materials: string[];
    tools_and_equipment: string[];
    skill_levels_required: string[];
    learning_pathway: string[];
  };
  cultural_elements: {
    symbolic_meanings: string[];
    ritual_significance: string[];
    social_functions: string[];
    gender_roles: string[];
    age_related_practices: string[];
  };
  preservation_metrics: {
    current_practitioners: number;
    geographical_spread: string[];
    transmission_rate: number;
    risk_assessment: 'low' | 'medium' | 'high' | 'critical';
    preservation_priority: number;
  };
  documentation_requirements: {
    minimum_documentation_hours: number;
    required_perspectives: string[];
    essential_contexts: string[];
    quality_standards: string[];
  };
}

export interface DashboardMetrics {
  artisan_metrics: {
    total_pieces: number;
    verified_pieces: number;
    preservation_progress: number;
    tourist_interactions: number;
    monthly_earnings: number;
    cultural_impact_score: number;
  };
  preservation_metrics: {
    stages_completed: number;
    documentation_quality: number;
    cultural_authenticity: number;
    community_engagement: number;
    knowledge_preservation: number;
    risk_mitigation: number;
  };
  engagement_metrics: {
    tourist_satisfaction: number;
    cultural_knowledge_transfer: number;
    economic_impact: number;
    community_benefit: number;
    awareness_raised: number;
    repeat_visitors: number;
  };
}

// Database row interfaces for Supabase/PostgreSQL
export interface ArtisanProfileRow {
  id: string;
  name: string;
  craft: string;
  region: string;
  bio?: string;
  specialization: string[];
  experience_years: number;
  master_level: ArtisanProfile['masterLevel'];
  contact_info: ArtisanProfile['contactInfo'];
  verification: ArtisanProfile['verification'];
  created_at: string;
  updated_at: string;
}

export interface PreservationRecordRow {
  id: string;
  artisan_id: string;
  current_stage: PreservationRecord['current_stage'];
  stage_progress: number;
  overall_progress: number;
  status: PreservationRecord['status'];
  last_updated: string;
  field_liaison: string;
  endangerment_level: PreservationRecord['endangerment_level'];
  cultural_dna: PreservationRecord['cultural_dna'];
  documentation: PreservationRecord['documentation'];
  blockchain: PreservationRecord['blockchain'];
  tourist_engagement: PreservationRecord['tourist_engagement'];
  created_at: string;
  updated_at: string;
}

export interface CraftPieceRow {
  id: string;
  artisan_id: string;
  title: string;
  description: string;
  craft_category: string;
  creation_date: string;
  materials: string[];
  techniques: string[];
  time_to_create_hours: number;
  status: CraftPiece['status'];
  pricing: CraftPiece['pricing'];
  multimedia: CraftPiece['multimedia'];
  preservation_data: CraftPiece['preservation_data'];
  market_data: CraftPiece['market_data'];
  verification: CraftPiece['verification'];
  created_at: string;
  updated_at: string;
} 