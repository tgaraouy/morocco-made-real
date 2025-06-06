-- Morocco Made Real - Blockchain Verification System
-- Initial Database Schema Migration

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE piece_status AS ENUM ('draft', 'pending_review', 'approved', 'published', 'archived');
CREATE TYPE workflow_stage AS ENUM ('documentation', 'multimedia', 'pricing', 'blockchain', 'museum_review', 'published');
CREATE TYPE verification_level AS ENUM ('bronze', 'silver', 'gold', 'master');
CREATE TYPE certificate_type AS ENUM ('authenticity', 'provenance', 'quality', 'cultural_heritage', 'master_craft');
CREATE TYPE certificate_status AS ENUM ('draft', 'pending', 'issued', 'verified', 'revoked', 'expired');
CREATE TYPE publication_status AS ENUM ('draft', 'under_review', 'approved', 'published', 'archived');
CREATE TYPE multimedia_type AS ENUM ('image', 'video', 'audio', 'document');
CREATE TYPE cultural_significance AS ENUM ('low', 'medium', 'high', 'exceptional');
CREATE TYPE preservation_status AS ENUM ('endangered', 'vulnerable', 'stable', 'thriving');
CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'master');
CREATE TYPE condition_type AS ENUM ('new', 'excellent', 'good', 'fair', 'restoration_needed');
CREATE TYPE currency_type AS ENUM ('MAD', 'USD', 'EUR');
CREATE TYPE museum_category AS ENUM ('pottery', 'textiles', 'jewelry', 'woodwork', 'metalwork', 'leather', 'other');

-- Artisans table
CREATE TABLE artisans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    region VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    years_experience INTEGER,
    verified BOOLEAN DEFAULT FALSE,
    verification_level verification_level DEFAULT 'bronze',
    blockchain_address VARCHAR(255),
    profile_image TEXT,
    contact_info JSONB,
    social_links JSONB,
    awards TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multimedia content table
CREATE TABLE multimedia_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type multimedia_type NOT NULL,
    url TEXT NOT NULL,
    ipfs_hash VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER, -- for video/audio in seconds
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    thumbnail_url TEXT,
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artisan pieces table
CREATE TABLE artisan_pieces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    artisan_id UUID NOT NULL REFERENCES artisans(id) ON DELETE CASCADE,
    artisan_name VARCHAR(255) NOT NULL,
    artisan_bio TEXT,
    traditional_practice JSONB NOT NULL,
    journey JSONB NOT NULL,
    multimedia JSONB NOT NULL,
    pricing JSONB NOT NULL,
    blockchain JSONB NOT NULL,
    status piece_status DEFAULT 'draft',
    workflow_stage workflow_stage DEFAULT 'documentation',
    museum_eligible BOOLEAN DEFAULT FALSE,
    museum_submitted BOOLEAN DEFAULT FALSE,
    museum_approved BOOLEAN,
    curator_notes TEXT,
    tags TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    dimensions JSONB,
    condition condition_type DEFAULT 'new',
    authenticity JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    seo_title VARCHAR(255),
    seo_description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    trending BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0
);

-- Digital certificates table
CREATE TABLE digital_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_id VARCHAR(255) UNIQUE NOT NULL,
    piece_id UUID NOT NULL REFERENCES artisan_pieces(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type certificate_type NOT NULL,
    piece_details JSONB NOT NULL,
    verification JSONB NOT NULL,
    metadata JSONB NOT NULL,
    design JSONB NOT NULL,
    qr_code JSONB NOT NULL,
    content JSONB NOT NULL,
    default_language VARCHAR(5) DEFAULT 'en',
    museum_extract JSONB,
    legal JSONB NOT NULL,
    status certificate_status DEFAULT 'draft',
    issued_by VARCHAR(255) NOT NULL,
    issued_to VARCHAR(255),
    outputs JSONB DEFAULT '{}',
    analytics JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    issued_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    security JSONB NOT NULL
);

-- Museum extracts table
CREATE TABLE museum_extracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    piece_id UUID NOT NULL REFERENCES artisan_pieces(id) ON DELETE CASCADE,
    extract_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    artisan JSONB NOT NULL,
    cultural JSONB NOT NULL,
    technical JSONB NOT NULL,
    media JSONB NOT NULL,
    education JSONB NOT NULL,
    curation JSONB NOT NULL,
    display JSONB NOT NULL,
    seo JSONB NOT NULL,
    analytics JSONB DEFAULT '{}',
    blockchain JSONB NOT NULL,
    rights JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    version INTEGER DEFAULT 1,
    previous_versions UUID[],
    change_log JSONB DEFAULT '[]'
);

-- Museum collections table
CREATE TABLE museum_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    theme VARCHAR(255) NOT NULL,
    curator VARCHAR(255) NOT NULL,
    pieces UUID[] DEFAULT '{}',
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_artisan_pieces_artisan_id ON artisan_pieces(artisan_id);
CREATE INDEX idx_artisan_pieces_status ON artisan_pieces(status);
CREATE INDEX idx_artisan_pieces_workflow_stage ON artisan_pieces(workflow_stage);
CREATE INDEX idx_artisan_pieces_featured ON artisan_pieces(featured);
CREATE INDEX idx_artisan_pieces_trending ON artisan_pieces(trending);
CREATE INDEX idx_artisan_pieces_created_at ON artisan_pieces(created_at);
CREATE INDEX idx_artisan_pieces_slug ON artisan_pieces(slug);

CREATE INDEX idx_digital_certificates_piece_id ON digital_certificates(piece_id);
CREATE INDEX idx_digital_certificates_certificate_id ON digital_certificates(certificate_id);
CREATE INDEX idx_digital_certificates_status ON digital_certificates(status);
CREATE INDEX idx_digital_certificates_type ON digital_certificates(type);

CREATE INDEX idx_museum_extracts_piece_id ON museum_extracts(piece_id);
CREATE INDEX idx_museum_extracts_extract_id ON museum_extracts(extract_id);
CREATE INDEX idx_museum_extracts_published_at ON museum_extracts(published_at);

CREATE INDEX idx_multimedia_content_type ON multimedia_content(type);
CREATE INDEX idx_multimedia_content_is_public ON multimedia_content(is_public);

CREATE INDEX idx_artisans_verified ON artisans(verified);
CREATE INDEX idx_artisans_verification_level ON artisans(verification_level);
CREATE INDEX idx_artisans_region ON artisans(region);

-- Create GIN indexes for JSONB columns for better search performance
CREATE INDEX idx_artisan_pieces_traditional_practice_gin ON artisan_pieces USING GIN (traditional_practice);
CREATE INDEX idx_artisan_pieces_journey_gin ON artisan_pieces USING GIN (journey);
CREATE INDEX idx_artisan_pieces_tags_gin ON artisan_pieces USING GIN (tags);
CREATE INDEX idx_artisan_pieces_categories_gin ON artisan_pieces USING GIN (categories);

CREATE INDEX idx_museum_extracts_curation_gin ON museum_extracts USING GIN (curation);
CREATE INDEX idx_museum_extracts_display_gin ON museum_extracts USING GIN (display);
CREATE INDEX idx_museum_extracts_seo_gin ON museum_extracts USING GIN (seo);

-- Create full-text search indexes
CREATE INDEX idx_artisan_pieces_search ON artisan_pieces USING GIN (
    to_tsvector('english', title || ' ' || description || ' ' || artisan_name)
);

CREATE INDEX idx_museum_extracts_search ON museum_extracts USING GIN (
    to_tsvector('english', title || ' ' || description || ' ' || short_description)
);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artisans_updated_at BEFORE UPDATE ON artisans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artisan_pieces_updated_at BEFORE UPDATE ON artisan_pieces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_digital_certificates_updated_at BEFORE UPDATE ON digital_certificates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_museum_extracts_updated_at BEFORE UPDATE ON museum_extracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_museum_collections_updated_at BEFORE UPDATE ON museum_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_multimedia_content_updated_at BEFORE UPDATE ON multimedia_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create functions for analytics
CREATE OR REPLACE FUNCTION increment_view_count(table_name TEXT, row_id UUID)
RETURNS VOID AS $$
BEGIN
    IF table_name = 'artisan_pieces' THEN
        UPDATE artisan_pieces SET view_count = view_count + 1 WHERE id = row_id;
    ELSIF table_name = 'museum_extracts' THEN
        UPDATE museum_extracts 
        SET analytics = jsonb_set(
            analytics, 
            '{views,total}', 
            (COALESCE((analytics->'views'->>'total')::integer, 0) + 1)::text::jsonb
        )
        WHERE id = row_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function for analytics reporting
CREATE OR REPLACE FUNCTION get_analytics(table_name TEXT, timeframe TEXT DEFAULT '30 days')
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    start_date TIMESTAMP;
BEGIN
    start_date := NOW() - INTERVAL timeframe;
    
    IF table_name = 'artisan_pieces' THEN
        SELECT jsonb_build_object(
            'total_pieces', COUNT(*),
            'published_pieces', COUNT(*) FILTER (WHERE status = 'published'),
            'total_views', SUM(view_count),
            'average_views', AVG(view_count),
            'featured_pieces', COUNT(*) FILTER (WHERE featured = true),
            'trending_pieces', COUNT(*) FILTER (WHERE trending = true)
        ) INTO result
        FROM artisan_pieces
        WHERE created_at >= start_date;
        
    ELSIF table_name = 'museum_extracts' THEN
        SELECT jsonb_build_object(
            'total_extracts', COUNT(*),
            'published_extracts', COUNT(*) FILTER (WHERE published_at IS NOT NULL),
            'featured_extracts', COUNT(*) FILTER (WHERE (display->>'featured')::boolean = true)
        ) INTO result
        FROM museum_extracts
        WHERE created_at >= start_date;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE artisans ENABLE ROW LEVEL SECURITY;
ALTER TABLE artisan_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE museum_extracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE museum_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE multimedia_content ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public read access for published artisan pieces" ON artisan_pieces
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access for published museum extracts" ON museum_extracts
    FOR SELECT USING (published_at IS NOT NULL AND (display->'visibility'->>'public')::boolean = true);

CREATE POLICY "Public read access for public multimedia" ON multimedia_content
    FOR SELECT USING (is_public = true);

CREATE POLICY "Public read access for verified artisans" ON artisans
    FOR SELECT USING (verified = true);

CREATE POLICY "Public read access for digital certificates" ON digital_certificates
    FOR SELECT USING (status IN ('issued', 'verified'));

-- Insert some sample data for testing
INSERT INTO artisans (name, email, region, specialization, verified, verification_level) VALUES
('Hassan Benali', 'hassan@example.com', 'Fes', 'Traditional Pottery', true, 'gold'),
('Fatima Zahra', 'fatima@example.com', 'Marrakech', 'Berber Carpets', true, 'master'),
('Ahmed Tazi', 'ahmed@example.com', 'Tetouan', 'Zellige Tiles', true, 'silver');

-- Create a sample multimedia content entry
INSERT INTO multimedia_content (type, url, title, file_size, mime_type) VALUES
('image', '/images/sample-pottery.jpg', 'Traditional Fes Pottery', 1024000, 'image/jpeg');

COMMENT ON TABLE artisans IS 'Verified artisans in the Morocco Made Real platform';
COMMENT ON TABLE artisan_pieces IS 'Complete artisan pieces with full journey documentation';
COMMENT ON TABLE digital_certificates IS 'Blockchain-verified authenticity certificates';
COMMENT ON TABLE museum_extracts IS 'Public museum displays of artisan pieces';
COMMENT ON TABLE museum_collections IS 'Curated collections of museum pieces';
COMMENT ON TABLE multimedia_content IS 'Images, videos, and other media content'; 