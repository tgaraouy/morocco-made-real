-- Complete Database Setup for Morocco Made Real RL System
-- Run this entire script in your Supabase SQL Editor to set up all required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create RL-specific enums
DO $$ BEGIN
    CREATE TYPE agent_type AS ENUM (
      'tourist-matching', 'artisan-development', 'content-creation', 
      'cultural-validation', 'economic-optimization'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE experience_type AS ENUM (
      'hands-on-workshop', 'cultural-immersion', 'technique-learning', 
      'artisan-meeting', 'cultural-tour', 'master-class'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE learning_style AS ENUM ('visual', 'auditory', 'kinesthetic', 'mixed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cultural_depth AS ENUM ('surface', 'moderate', 'deep');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE group_size AS ENUM ('solo', 'couple', 'small-group', 'large-group');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE skill_level_rl AS ENUM ('beginner', 'intermediate', 'advanced', 'master', 'grandmaster');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE teaching_approach AS ENUM ('traditional', 'modern', 'hybrid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create artisans table (base table)
CREATE TABLE IF NOT EXISTS artisans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    craft VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tourist Profiles Table
CREATE TABLE IF NOT EXISTS tourist_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- Preferences
    preferred_crafts TEXT[] DEFAULT '{}',
    preferred_regions TEXT[] DEFAULT '{}',
    preferred_experience_types experience_type[] DEFAULT '{}',
    cultural_depth cultural_depth DEFAULT 'moderate',
    group_size group_size DEFAULT 'couple',
    languages TEXT[] DEFAULT '{"en"}',
    
    -- Cultural Interests
    cultural_interests JSONB DEFAULT '[]',
    
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
    
    time_duration INTEGER DEFAULT 3,
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
CREATE TABLE IF NOT EXISTS artisan_profiles_rl (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
    
    -- Basic Info
    name VARCHAR(255) NOT NULL,
    craft VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    skill_level skill_level_rl DEFAULT 'intermediate',
    
    -- Techniques
    techniques JSONB DEFAULT '[]',
    
    -- Cultural Knowledge
    cultural_knowledge JSONB DEFAULT '{}',
    
    -- Teaching Style
    teaching_approach teaching_approach DEFAULT 'traditional',
    patience_level DECIMAL(3,2) DEFAULT 0.8,
    adaptability DECIMAL(3,2) DEFAULT 0.7,
    cultural_sensitivity DECIMAL(3,2) DEFAULT 0.9,
    language_skills TEXT[] DEFAULT '{"ar"}',
    
    -- Availability
    availability JSONB DEFAULT '{}',
    
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
CREATE TABLE IF NOT EXISTS rl_experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_type agent_type NOT NULL,
    
    -- State Information
    state_data JSONB NOT NULL,
    tourist_profile_id UUID REFERENCES tourist_profiles(id),
    artisan_profile_id UUID REFERENCES artisan_profiles_rl(id),
    
    -- Action Information
    action_data JSONB NOT NULL,
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
CREATE TABLE IF NOT EXISTS rl_recommendations (
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
    estimated_duration INTEGER,
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
CREATE TABLE IF NOT EXISTS rl_agent_performance (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_user_id ON tourist_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_rl_artisan_id ON artisan_profiles_rl(artisan_id);
CREATE INDEX IF NOT EXISTS idx_artisan_profiles_rl_craft ON artisan_profiles_rl(craft);
CREATE INDEX IF NOT EXISTS idx_rl_experiences_agent_type ON rl_experiences(agent_type);
CREATE INDEX IF NOT EXISTS idx_rl_recommendations_agent_type ON rl_recommendations(agent_type);
CREATE INDEX IF NOT EXISTS idx_rl_agent_performance_agent_type ON rl_agent_performance(agent_type);

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_tourist_profiles_updated_at ON tourist_profiles;
CREATE TRIGGER update_tourist_profiles_updated_at 
    BEFORE UPDATE ON tourist_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_artisan_profiles_rl_updated_at ON artisan_profiles_rl;
CREATE TRIGGER update_artisan_profiles_rl_updated_at 
    BEFORE UPDATE ON artisan_profiles_rl 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_rl_agent_performance_updated_at ON rl_agent_performance;
CREATE TRIGGER update_rl_agent_performance_updated_at 
    BEFORE UPDATE ON rl_agent_performance 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Insert some sample artisan data
INSERT INTO artisans (id, name, craft, region) VALUES 
    ('hassan-pottery-master', 'Hassan Benali', 'pottery', 'Fez'),
    ('fatima-weaving-master', 'Fatima Zahra', 'weaving', 'Marrakech'),
    ('ahmed-leather-artisan', 'Ahmed Tazi', 'leather', 'Fez'),
    ('youssef-metalwork-master', 'Youssef El Fassi', 'metalwork', 'Fez')
ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Morocco Made Real RL Database Setup Complete!';
    RAISE NOTICE '🎉 All tables, functions, and sample data have been created.';
    RAISE NOTICE '🚀 Your RL system is now ready for real database operations!';
END $$; 