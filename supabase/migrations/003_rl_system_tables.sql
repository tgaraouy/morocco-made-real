-- Reinforcement Learning System Database Schema
-- Migration 003: RL Agent Data Storage and Learning Infrastructure

-- Create RL-specific enums
CREATE TYPE agent_type AS ENUM (
  'tourist-matching', 'artisan-development', 'content-creation', 
  'cultural-validation', 'economic-optimization'
);

CREATE TYPE experience_type AS ENUM (
  'hands-on-workshop', 'cultural-immersion', 'technique-learning', 
  'artisan-meeting', 'cultural-tour', 'master-class'
);

CREATE TYPE learning_style AS ENUM ('visual', 'auditory', 'kinesthetic', 'mixed');
CREATE TYPE cultural_depth AS ENUM ('surface', 'moderate', 'deep');
CREATE TYPE group_size AS ENUM ('solo', 'couple', 'small-group', 'large-group');
CREATE TYPE skill_level_rl AS ENUM ('beginner', 'intermediate', 'advanced', 'master', 'grandmaster');
CREATE TYPE teaching_approach AS ENUM ('traditional', 'modern', 'hybrid');

-- Tourist Profiles Table
CREATE TABLE tourist_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL, -- External user ID
    
    -- Preferences
    preferred_crafts TEXT[] DEFAULT '{}',
    preferred_regions TEXT[] DEFAULT '{}',
    preferred_experience_types experience_type[] DEFAULT '{}',
    cultural_depth cultural_depth DEFAULT 'moderate',
    group_size group_size DEFAULT 'couple',
    languages TEXT[] DEFAULT '{"en"}',
    
    -- Cultural Interests
    cultural_interests JSONB DEFAULT '[]', -- Array of interest objects
    
    -- Learning Style
    learning_style learning_style DEFAULT 'mixed',
    learning_pace VARCHAR(50) DEFAULT 'moderate',
    group_preference VARCHAR(50) DEFAULT 'small-group',
    feedback_style VARCHAR(50) DEFAULT 'immediate',
    
    -- Budget and Time
    budget_min DECIMAL(10,2) DEFAULT 0,
    budget_max DECIMAL(10,2) DEFAULT 1000,
    budget_currency VARCHAR(3) DEFAULT 'USD',
    budget_flexibility DECIMAL(3,2) DEFAULT 0.2,
    
    time_duration INTEGER DEFAULT 3, -- in hours/days
    time_unit VARCHAR(10) DEFAULT 'hours',
    time_flexibility DECIMAL(3,2) DEFAULT 0.3,
    preferred_times TEXT[] DEFAULT '{"morning", "afternoon"}',
    
    -- Experience History
    total_experiences INTEGER DEFAULT 0,
    successful_experiences INTEGER DEFAULT 0,
    average_satisfaction DECIMAL(3,2) DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artisan Profiles Table (Extended for RL)
CREATE TABLE artisan_profiles_rl (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    craft VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    skill_level skill_level_rl DEFAULT 'intermediate',
    
    -- Techniques
    techniques JSONB DEFAULT '[]', -- Array of technique objects
    
    -- Cultural Knowledge
    cultural_knowledge JSONB DEFAULT '{}', -- traditions, history, techniques, stories, languages
    
    -- Teaching Style
    teaching_approach teaching_approach DEFAULT 'traditional',
    patience_level DECIMAL(3,2) DEFAULT 0.8,
    adaptability DECIMAL(3,2) DEFAULT 0.7,
    cultural_sensitivity DECIMAL(3,2) DEFAULT 0.9,
    language_skills TEXT[] DEFAULT '{"ar"}',
    
    -- Availability
    availability JSONB DEFAULT '{}', -- schedule, capacity, booking requirements
    
    -- Economic Goals
    monthly_target DECIMAL(10,2) DEFAULT 0,
    yearly_target DECIMAL(10,2) DEFAULT 0,
    growth_rate DECIMAL(3,2) DEFAULT 0.1,
    diversification_goals TEXT[] DEFAULT '{}',
    
    -- Performance Metrics
    total_tourists_hosted INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    cultural_score DECIMAL(3,2) DEFAULT 0,
    economic_score DECIMAL(3,2) DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RL Experiences Table
CREATE TABLE rl_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type agent_type NOT NULL,
    
    -- State Information
    state_data JSONB NOT NULL, -- Complete state snapshot
    tourist_profile_id UUID REFERENCES tourist_profiles(id),
    artisan_profile_id UUID REFERENCES artisan_profiles_rl(id),
    
    -- Action Information
    action_data JSONB NOT NULL, -- Action taken by agent
    action_type VARCHAR(100) NOT NULL,
    confidence DECIMAL(3,2) DEFAULT 0,
    
    -- Reward Information
    reward DECIMAL(5,2) NOT NULL,
    cultural_reward DECIMAL(5,2) DEFAULT 0,
    economic_reward DECIMAL(5,2) DEFAULT 0,
    satisfaction_reward DECIMAL(5,2) DEFAULT 0,
    
    -- Next State
    next_state_data JSONB NOT NULL,
    
    -- Validation and Outcomes
    cultural_validation JSONB DEFAULT '{}',
    economic_outcome JSONB DEFAULT '{}',
    
    -- Metadata
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id VARCHAR(255),
    experiment_id VARCHAR(255)
);

-- RL Recommendations Table
CREATE TABLE rl_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type agent_type NOT NULL,
    
    -- Recommendation Details
    tourist_profile_id UUID REFERENCES tourist_profiles(id),
    artisan_profile_id UUID REFERENCES artisan_profiles_rl(id),
    
    -- Scores
    confidence DECIMAL(3,2) NOT NULL,
    cultural_score DECIMAL(3,2) DEFAULT 0,
    economic_score DECIMAL(3,2) DEFAULT 0,
    overall_score DECIMAL(3,2) DEFAULT 0,
    
    -- Recommendation Content
    reasoning TEXT,
    cultural_context TEXT,
    experience_type experience_type,
    estimated_duration INTEGER, -- in hours
    estimated_cost DECIMAL(10,2),
    
    -- Status
    presented_to_user BOOLEAN DEFAULT FALSE,
    user_clicked BOOLEAN DEFAULT FALSE,
    user_booked BOOLEAN DEFAULT FALSE,
    user_completed BOOLEAN DEFAULT FALSE,
    user_rating DECIMAL(3,2),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    policy_version INTEGER DEFAULT 1
);

-- RL Agent Performance Table
CREATE TABLE rl_agent_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type agent_type NOT NULL UNIQUE,
    
    -- Performance Metrics
    experience_count INTEGER DEFAULT 0,
    cultural_score DECIMAL(3,2) DEFAULT 0,
    economic_score DECIMAL(3,2) DEFAULT 0,
    satisfaction_score DECIMAL(3,2) DEFAULT 0,
    overall_performance DECIMAL(3,2) DEFAULT 0,
    
    -- Learning Metrics
    policy_version INTEGER DEFAULT 1,
    learning_rate DECIMAL(5,4) DEFAULT 0.01,
    exploration_rate DECIMAL(3,2) DEFAULT 0.1,
    
    -- Configuration
    config JSONB DEFAULT '{}',
    
    -- Status
    is_learning BOOLEAN DEFAULT FALSE,
    last_learning_session TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RL Policy Parameters Table
CREATE TABLE rl_policy_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type agent_type NOT NULL,
    policy_version INTEGER NOT NULL,
    
    -- Parameter Data
    parameters JSONB NOT NULL, -- All policy parameters
    weights JSONB DEFAULT '{}', -- Feature weights
    thresholds JSONB DEFAULT '{}', -- Decision thresholds
    
    -- Performance
    performance_metrics JSONB DEFAULT '{}',
    validation_score DECIMAL(3,2) DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Tourist-Artisan Matching History Table
CREATE TABLE tourist_artisan_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tourist_profile_id UUID NOT NULL REFERENCES tourist_profiles(id),
    artisan_profile_id UUID NOT NULL REFERENCES artisan_profiles_rl(id),
    recommendation_id UUID REFERENCES rl_recommendations(id),
    
    -- Match Details
    match_score DECIMAL(3,2) NOT NULL,
    cultural_alignment DECIMAL(3,2) DEFAULT 0,
    economic_viability DECIMAL(3,2) DEFAULT 0,
    
    -- Outcome
    booking_made BOOLEAN DEFAULT FALSE,
    experience_completed BOOLEAN DEFAULT FALSE,
    tourist_satisfaction DECIMAL(3,2),
    artisan_satisfaction DECIMAL(3,2),
    cultural_learning DECIMAL(3,2),
    economic_impact DECIMAL(10,2),
    
    -- Feedback
    tourist_feedback TEXT,
    artisan_feedback TEXT,
    expert_validation JSONB DEFAULT '{}',
    
    -- Metadata
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    experience_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for RL tables
CREATE INDEX idx_tourist_profiles_user_id ON tourist_profiles(user_id);
CREATE INDEX idx_tourist_profiles_cultural_depth ON tourist_profiles(cultural_depth);
CREATE INDEX idx_tourist_profiles_group_size ON tourist_profiles(group_size);

CREATE INDEX idx_artisan_profiles_rl_artisan_id ON artisan_profiles_rl(artisan_id);
CREATE INDEX idx_artisan_profiles_rl_craft ON artisan_profiles_rl(craft);
CREATE INDEX idx_artisan_profiles_rl_region ON artisan_profiles_rl(region);
CREATE INDEX idx_artisan_profiles_rl_skill_level ON artisan_profiles_rl(skill_level);

CREATE INDEX idx_rl_experiences_agent_type ON rl_experiences(agent_type);
CREATE INDEX idx_rl_experiences_tourist_profile ON rl_experiences(tourist_profile_id);
CREATE INDEX idx_rl_experiences_artisan_profile ON rl_experiences(artisan_profile_id);
CREATE INDEX idx_rl_experiences_timestamp ON rl_experiences(timestamp);
CREATE INDEX idx_rl_experiences_session ON rl_experiences(session_id);

CREATE INDEX idx_rl_recommendations_agent_type ON rl_recommendations(agent_type);
CREATE INDEX idx_rl_recommendations_tourist_profile ON rl_recommendations(tourist_profile_id);
CREATE INDEX idx_rl_recommendations_artisan_profile ON rl_recommendations(artisan_profile_id);
CREATE INDEX idx_rl_recommendations_confidence ON rl_recommendations(confidence);
CREATE INDEX idx_rl_recommendations_created_at ON rl_recommendations(created_at);

CREATE INDEX idx_rl_agent_performance_agent_type ON rl_agent_performance(agent_type);
CREATE INDEX idx_rl_agent_performance_policy_version ON rl_agent_performance(policy_version);

CREATE INDEX idx_rl_policy_parameters_agent_type ON rl_policy_parameters(agent_type);
CREATE INDEX idx_rl_policy_parameters_version ON rl_policy_parameters(policy_version);
CREATE INDEX idx_rl_policy_parameters_active ON rl_policy_parameters(is_active);

CREATE INDEX idx_tourist_artisan_matches_tourist ON tourist_artisan_matches(tourist_profile_id);
CREATE INDEX idx_tourist_artisan_matches_artisan ON tourist_artisan_matches(artisan_profile_id);
CREATE INDEX idx_tourist_artisan_matches_score ON tourist_artisan_matches(match_score);
CREATE INDEX idx_tourist_artisan_matches_completed ON tourist_artisan_matches(experience_completed);

-- Create GIN indexes for JSONB columns
CREATE INDEX idx_tourist_profiles_cultural_interests_gin ON tourist_profiles USING GIN (cultural_interests);
CREATE INDEX idx_artisan_profiles_rl_techniques_gin ON artisan_profiles_rl USING GIN (techniques);
CREATE INDEX idx_artisan_profiles_rl_cultural_knowledge_gin ON artisan_profiles_rl USING GIN (cultural_knowledge);
CREATE INDEX idx_rl_experiences_state_gin ON rl_experiences USING GIN (state_data);
CREATE INDEX idx_rl_experiences_action_gin ON rl_experiences USING GIN (action_data);

-- Create triggers for updated_at columns
CREATE TRIGGER update_tourist_profiles_updated_at BEFORE UPDATE ON tourist_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artisan_profiles_rl_updated_at BEFORE UPDATE ON artisan_profiles_rl FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rl_agent_performance_updated_at BEFORE UPDATE ON rl_agent_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions for RL operations
CREATE OR REPLACE FUNCTION get_tourist_recommendations(
    p_tourist_id UUID,
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    recommendation_id UUID,
    artisan_name VARCHAR(255),
    craft VARCHAR(100),
    region VARCHAR(100),
    confidence DECIMAL(3,2),
    cultural_score DECIMAL(3,2),
    economic_score DECIMAL(3,2),
    reasoning TEXT,
    cultural_context TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        a.name,
        a.craft,
        a.region,
        r.confidence,
        r.cultural_score,
        r.economic_score,
        r.reasoning,
        r.cultural_context
    FROM rl_recommendations r
    JOIN artisan_profiles_rl a ON r.artisan_profile_id = a.id
    WHERE r.tourist_profile_id = p_tourist_id
      AND r.expires_at > NOW()
      AND NOT r.presented_to_user
    ORDER BY r.overall_score DESC, r.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION record_recommendation_interaction(
    p_recommendation_id UUID,
    p_interaction_type VARCHAR(50), -- 'click', 'book', 'complete'
    p_rating DECIMAL(3,2) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE rl_recommendations 
    SET 
        user_clicked = CASE WHEN p_interaction_type = 'click' THEN TRUE ELSE user_clicked END,
        user_booked = CASE WHEN p_interaction_type = 'book' THEN TRUE ELSE user_booked END,
        user_completed = CASE WHEN p_interaction_type = 'complete' THEN TRUE ELSE user_completed END,
        user_rating = COALESCE(p_rating, user_rating),
        presented_to_user = TRUE
    WHERE id = p_recommendation_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_agent_performance(p_agent_type agent_type)
RETURNS TABLE (
    experience_count INTEGER,
    cultural_score DECIMAL(3,2),
    economic_score DECIMAL(3,2),
    satisfaction_score DECIMAL(3,2),
    policy_version INTEGER,
    is_learning BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ap.experience_count,
        ap.cultural_score,
        ap.economic_score,
        ap.satisfaction_score,
        ap.policy_version,
        ap.is_learning
    FROM rl_agent_performance ap
    WHERE ap.agent_type = p_agent_type
    ORDER BY ap.updated_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql; 