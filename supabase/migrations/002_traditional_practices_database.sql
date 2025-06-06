-- Traditional Practices Database & Journey Documentation System
-- Migration 002: Enhanced Cultural Validation Infrastructure

-- Create additional enums for traditional practices
CREATE TYPE craft_tradition AS ENUM (
  'pottery', 'textiles', 'metalwork', 'woodwork', 'leatherwork', 
  'jewelry', 'calligraphy', 'mosaic', 'carpet_weaving', 'embroidery', 
  'glasswork', 'stonework', 'basketry', 'ceramics', 'silverwork'
);

CREATE TYPE moroccan_region AS ENUM (
  'fez_meknes', 'rabat_sale_kenitra', 'casablanca_settat', 'marrakech_safi',
  'oriental', 'tangier_tetouan_al_hoceima', 'draa_tafilalet', 'souss_massa',
  'guelmim_oued_noun', 'laayoune_sakia_el_hamra', 'dakhla_oued_ed_dahab',
  'beni_mellal_khenifra'
);

CREATE TYPE cultural_significance_level AS ENUM ('low', 'medium', 'high', 'exceptional');
CREATE TYPE journey_status AS ENUM ('planning', 'production', 'post_production', 'validation', 'completed', 'published');
CREATE TYPE validation_level AS ENUM ('bronze', 'silver', 'gold', 'master');

-- Traditional Practices Database
CREATE TABLE traditional_practices_database (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technique_name VARCHAR(255) NOT NULL,
    craft_category craft_tradition NOT NULL,
    region moroccan_region NOT NULL,
    
    -- Historical Context
    origin_period VARCHAR(100),
    historical_evolution JSONB DEFAULT '{}',
    cultural_significance cultural_significance_level DEFAULT 'medium',
    unesco_recognition BOOLEAN DEFAULT FALSE,
    
    -- Technical Documentation
    materials JSONB NOT NULL DEFAULT '[]', -- {name, source, preparation, alternatives}
    tools JSONB NOT NULL DEFAULT '[]', -- {name, traditional_form, modern_adaptations}
    process_steps JSONB NOT NULL DEFAULT '[]', -- {step, description, duration, difficulty}
    quality_indicators JSONB DEFAULT '{}', -- What makes it authentic
    
    -- Multimedia Documentation
    reference_videos TEXT[] DEFAULT '{}',
    process_images TEXT[] DEFAULT '{}',
    audio_narrations TEXT[] DEFAULT '{}',
    master_examples TEXT[] DEFAULT '{}',
    
    -- Validation Criteria
    authenticity_markers JSONB DEFAULT '{}', -- Key elements that validate authenticity
    common_variations JSONB DEFAULT '{}', -- Acceptable regional/personal variations
    quality_standards JSONB DEFAULT '{}', -- What constitutes different quality levels
    
    -- Preservation Status
    preservation_status preservation_status DEFAULT 'stable',
    active_practitioners INTEGER DEFAULT 0,
    learning_difficulty skill_level DEFAULT 'intermediate',
    transmission_methods TEXT[] DEFAULT '{}',
    
    -- Metadata
    documented_by VARCHAR(255),
    verified_by TEXT[] DEFAULT '{}', -- Array of expert validators
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journey Documentation Table
CREATE TABLE artisan_journey_documentation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    piece_id UUID NOT NULL REFERENCES artisan_pieces(id) ON DELETE CASCADE,
    artisan_id UUID NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
    
    -- Content Creation Team
    content_team JSONB NOT NULL DEFAULT '{}',
    creation_timeline JSONB NOT NULL DEFAULT '[]',
    
    -- Multimedia Content
    raw_footage JSONB DEFAULT '[]', -- Links to raw video/photo content
    edited_content JSONB DEFAULT '[]', -- Final edited multimedia
    ai_generated_content JSONB DEFAULT '[]', -- AI-enhanced descriptions, insights
    
    -- Validation Documentation
    validation_process JSONB DEFAULT '{}',
    expert_reviews JSONB DEFAULT '[]',
    community_feedback JSONB DEFAULT '[]',
    
    -- Blockchain Integration
    content_hash VARCHAR(255), -- IPFS hash of complete documentation
    validation_hash VARCHAR(255), -- Hash of validation results
    
    -- Status and Workflow
    status journey_status DEFAULT 'planning',
    workflow_stage VARCHAR(100) DEFAULT 'pre_production',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multimedia Assets Table
CREATE TABLE multimedia_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES artisan_journey_documentation(id) ON DELETE CASCADE,
    
    -- Asset Information
    asset_type multimedia_type NOT NULL,
    filename VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    
    -- Metadata
    metadata JSONB NOT NULL DEFAULT '{}', -- duration, resolution, fileSize, etc.
    tags TEXT[] DEFAULT '{}',
    cultural_context TEXT,
    
    -- Processing Status
    processed BOOLEAN DEFAULT FALSE,
    ai_analyzed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expert Reviews Table
CREATE TABLE expert_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES artisan_journey_documentation(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL,
    
    -- Reviewer Information
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_credentials TEXT,
    expertise TEXT[] DEFAULT '{}',
    
    -- Review Content
    review_data JSONB NOT NULL DEFAULT '{}', -- scores, comments, recommendations
    overall_recommendation VARCHAR(50) DEFAULT 'pending', -- approve, approve_with_conditions, reject
    conditions TEXT[] DEFAULT '{}',
    
    -- Status
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending'
);

-- Community Feedback Table
CREATE TABLE community_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES artisan_journey_documentation(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    
    -- User Information
    user_type VARCHAR(50) DEFAULT 'tourist', -- artisan, collector, tourist, student, expert
    
    -- Feedback Content
    feedback_data JSONB NOT NULL DEFAULT '{}', -- ratings and comments
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Narrative Content Table
CREATE TABLE narrative_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES artisan_journey_documentation(id) ON DELETE CASCADE,
    
    -- Target Audience
    target_audience VARCHAR(50) NOT NULL, -- tourist, collector, student, expert
    
    -- Content
    story_arc JSONB NOT NULL DEFAULT '[]',
    cultural_context TEXT,
    artisan_voice TEXT, -- Audio narration script
    
    -- Multimedia Integration
    hero_video VARCHAR(255),
    supporting_media TEXT[] DEFAULT '{}',
    
    -- Localization
    languages TEXT[] DEFAULT '{"en"}',
    cultural_adaptations JSONB DEFAULT '{}',
    
    -- SEO and Discovery
    keywords TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    seo_title VARCHAR(255),
    seo_description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Museum Interactions Table
CREATE TABLE community_museum_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    piece_id UUID NOT NULL REFERENCES artisan_pieces(id) ON DELETE CASCADE,
    
    -- Interaction Details
    interaction_type VARCHAR(50) NOT NULL, -- 'view', 'share', 'comment', 'wishlist', 'purchase'
    interaction_data JSONB DEFAULT '{}',
    
    -- Privacy Settings
    privacy_level VARCHAR(20) DEFAULT 'public', -- 'public', 'community', 'private'
    shared_with_community BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cultural Connections Table (for linking related pieces)
CREATE TABLE cultural_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    piece1_id UUID NOT NULL REFERENCES artisan_pieces(id) ON DELETE CASCADE,
    piece2_id UUID NOT NULL REFERENCES artisan_pieces(id) ON DELETE CASCADE,
    
    -- Connection Details
    connection_type VARCHAR(100) NOT NULL, -- 'similar_technique', 'same_region', 'historical_period', etc.
    connection_strength DECIMAL(3,2) DEFAULT 0.5, -- 0.0 to 1.0
    description TEXT,
    
    -- AI Generated
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_confidence DECIMAL(3,2),
    
    -- Human Verified
    human_verified BOOLEAN DEFAULT FALSE,
    verified_by VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure no duplicate connections
    UNIQUE(piece1_id, piece2_id, connection_type)
);

-- User Collections Table (for personal museums)
CREATE TABLE user_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    
    -- Collection Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Pieces in Collection
    piece_ids UUID[] DEFAULT '{}',
    
    -- Privacy and Sharing
    is_public BOOLEAN DEFAULT FALSE,
    shared_with_community BOOLEAN DEFAULT FALSE,
    
    -- Display Settings
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_traditional_practices_craft_category ON traditional_practices_database(craft_category);
CREATE INDEX idx_traditional_practices_region ON traditional_practices_database(region);
CREATE INDEX idx_traditional_practices_significance ON traditional_practices_database(cultural_significance);

CREATE INDEX idx_journey_documentation_piece_id ON artisan_journey_documentation(piece_id);
CREATE INDEX idx_journey_documentation_artisan_id ON artisan_journey_documentation(artisan_id);
CREATE INDEX idx_journey_documentation_status ON artisan_journey_documentation(status);

CREATE INDEX idx_multimedia_assets_journey_id ON multimedia_assets(journey_id);
CREATE INDEX idx_multimedia_assets_type ON multimedia_assets(asset_type);

CREATE INDEX idx_expert_reviews_journey_id ON expert_reviews(journey_id);
CREATE INDEX idx_expert_reviews_status ON expert_reviews(status);

CREATE INDEX idx_community_feedback_journey_id ON community_feedback(journey_id);
CREATE INDEX idx_community_feedback_user_type ON community_feedback(user_type);

CREATE INDEX idx_narrative_content_journey_id ON narrative_content(journey_id);
CREATE INDEX idx_narrative_content_audience ON narrative_content(target_audience);

CREATE INDEX idx_museum_interactions_user_id ON community_museum_interactions(user_id);
CREATE INDEX idx_museum_interactions_piece_id ON community_museum_interactions(piece_id);
CREATE INDEX idx_museum_interactions_type ON community_museum_interactions(interaction_type);

CREATE INDEX idx_cultural_connections_piece1 ON cultural_connections(piece1_id);
CREATE INDEX idx_cultural_connections_piece2 ON cultural_connections(piece2_id);
CREATE INDEX idx_cultural_connections_type ON cultural_connections(connection_type);

CREATE INDEX idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX idx_user_collections_public ON user_collections(is_public);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_traditional_practices_updated_at BEFORE UPDATE ON traditional_practices_database FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journey_documentation_updated_at BEFORE UPDATE ON artisan_journey_documentation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_multimedia_assets_updated_at BEFORE UPDATE ON multimedia_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_narrative_content_updated_at BEFORE UPDATE ON narrative_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_collections_updated_at BEFORE UPDATE ON user_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample traditional practices
INSERT INTO traditional_practices_database (
    technique_name, craft_category, region, origin_period, cultural_significance,
    materials, tools, process_steps, documented_by
) VALUES 
(
    'Fez Blue Pottery', 'pottery', 'fez_meknes', '14th Century',
    'exceptional',
    '[{"name": "local_clay", "source": "Salé region", "preparation": "aged_6_months"}]',
    '[{"name": "pottery_wheel", "traditional_form": "foot_powered", "modern_adaptations": "electric_wheel"}]',
    '[{"step": 1, "description": "Clay preparation", "duration": 120, "difficulty": "intermediate"}]',
    'Cultural Heritage Team'
),
(
    'Berber Carpet Weaving', 'carpet_weaving', 'marrakech_safi', 'Ancient',
    'high',
    '[{"name": "wool", "source": "atlas_mountains", "preparation": "hand_spun"}]',
    '[{"name": "traditional_loom", "traditional_form": "vertical_loom", "modern_adaptations": "none"}]',
    '[{"step": 1, "description": "Wool preparation", "duration": 480, "difficulty": "advanced"}]',
    'Berber Cultural Institute'
),
(
    'Marrakech Leather Tanning', 'leatherwork', 'marrakech_safi', '11th Century',
    'high',
    '[{"name": "goat_skin", "source": "local_farms", "preparation": "traditional_tanning"}]',
    '[{"name": "tanning_vats", "traditional_form": "stone_vats", "modern_adaptations": "none"}]',
    '[{"step": 1, "description": "Skin preparation", "duration": 2160, "difficulty": "expert"}]',
    'Leather Artisans Guild'
);

-- Insert sample artisan pieces (required for journey documentation)
INSERT INTO artisan_pieces (
    title, description, artisan_id, artisan_name, artisan_bio,
    traditional_practice, journey, multimedia, pricing, blockchain, authenticity, slug
) VALUES (
    'Traditional Fez Blue Pottery Vase',
    'A beautiful hand-crafted pottery vase using traditional Fez blue glazing techniques passed down through generations.',
    (SELECT id FROM artisans WHERE name = 'Hassan Benali' LIMIT 1),
    'Hassan Benali',
    'Master potter from Fez with over 30 years of experience in traditional Moroccan ceramics.',
    '{"technique": "Fez Blue Pottery", "region": "Fez", "materials": ["local_clay", "natural_glazes"], "tools": ["pottery_wheel", "traditional_kiln"]}',
    '{"stages": [{"name": "Clay Preparation", "duration": "2 hours", "description": "Preparing and aging local clay"}]}',
    '{"images": ["/images/pottery-process-1.jpg"], "videos": ["/videos/pottery-creation.mp4"]}',
    '{"base_price": 1200, "currency": "MAD", "negotiable": true}',
    '{"contract_address": "", "token_id": "", "minted": false}',
    '{"verified": true, "score": 95, "validators": ["Cultural Heritage Team"]}',
    'traditional-fez-blue-pottery-vase-hassan-benali'
),
(
    'Handwoven Berber Carpet',
    'Authentic Berber carpet featuring traditional geometric patterns, handwoven using ancient techniques.',
    (SELECT id FROM artisans WHERE name = 'Fatima Zahra' LIMIT 1),
    'Fatima Zahra',
    'Master weaver specializing in traditional Berber carpets from the Atlas Mountains.',
    '{"technique": "Berber Carpet Weaving", "region": "Atlas Mountains", "materials": ["mountain_wool", "natural_dyes"], "tools": ["vertical_loom", "hand_tools"]}',
    '{"stages": [{"name": "Wool Preparation", "duration": "8 hours", "description": "Cleaning and spinning mountain wool"}]}',
    '{"images": ["/images/carpet-weaving-1.jpg"], "videos": ["/videos/berber-weaving.mp4"]}',
    '{"base_price": 3500, "currency": "MAD", "negotiable": true}',
    '{"contract_address": "", "token_id": "", "minted": false}',
    '{"verified": true, "score": 98, "validators": ["Berber Cultural Institute"]}',
    'handwoven-berber-carpet-fatima-zahra'
),
(
    'Traditional Leather Pouf',
    'Handcrafted leather pouf using traditional Marrakech tanning and stitching techniques.',
    (SELECT id FROM artisans WHERE name = 'Ahmed Tazi' LIMIT 1),
    'Ahmed Tazi',
    'Skilled leather artisan from Marrakech with expertise in traditional tanning methods.',
    '{"technique": "Marrakech Leather Tanning", "region": "Marrakech", "materials": ["goat_leather", "natural_tannins"], "tools": ["tanning_vats", "hand_tools"]}',
    '{"stages": [{"name": "Leather Preparation", "duration": "72 hours", "description": "Traditional tanning process"}]}',
    '{"images": ["/images/leather-work-1.jpg"], "videos": ["/videos/leather-tanning.mp4"]}',
    '{"base_price": 800, "currency": "MAD", "negotiable": false}',
    '{"contract_address": "", "token_id": "", "minted": false}',
    '{"verified": true, "score": 92, "validators": ["Leather Artisans Guild"]}',
    'traditional-leather-pouf-ahmed-tazi'
);

-- Insert sample journey documentation (now that we have pieces)
INSERT INTO artisan_journey_documentation (
    piece_id, artisan_id, content_team, status
) VALUES (
    (SELECT id FROM artisan_pieces WHERE slug = 'traditional-fez-blue-pottery-vase-hassan-benali' LIMIT 1),
    (SELECT id FROM artisans WHERE name = 'Hassan Benali' LIMIT 1),
    '{"roles": {"contentDirector": "Ahmed Hassan", "videographers": ["Fatima Al-Zahra"], "photographers": ["Omar Benjelloun"]}}',
    'planning'
);

-- Grant necessary permissions
GRANT ALL ON traditional_practices_database TO authenticated;
GRANT ALL ON artisan_journey_documentation TO authenticated;
GRANT ALL ON multimedia_assets TO authenticated;
GRANT ALL ON expert_reviews TO authenticated;
GRANT ALL ON community_feedback TO authenticated;
GRANT ALL ON narrative_content TO authenticated;
GRANT ALL ON community_museum_interactions TO authenticated;
GRANT ALL ON cultural_connections TO authenticated;
GRANT ALL ON user_collections TO authenticated; 