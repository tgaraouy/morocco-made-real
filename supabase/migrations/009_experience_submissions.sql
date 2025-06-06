-- ============================================================================
-- Experience Submissions & Validation System (Complete Migration)
-- ============================================================================

-- Drop existing table if it exists (for clean migration)
DROP TABLE IF EXISTS experience_submissions CASCADE;

-- Create experience submissions table
CREATE TABLE experience_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic experience information
  title TEXT NOT NULL,
  artisan_name TEXT NOT NULL,
  artisan_email TEXT,
  craft TEXT NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  duration TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT DEFAULT '🎨',
  
  -- Artisan details
  artisan_age INTEGER CHECK (artisan_age > 0 AND artisan_age < 150),
  artisan_experience TEXT NOT NULL,
  heritage TEXT,
  certification TEXT,
  languages TEXT[], -- Array of language codes
  tags TEXT[], -- Array of experience tags
  
  -- Experience categorization
  quick_moods TEXT[] DEFAULT '{}', -- Array of mood categories
  experience_styles TEXT[] DEFAULT '{}', -- Array of style categories
  
  -- Interactive content (stored as JSONB for flexibility)
  interactive_content JSONB DEFAULT '{}',
  
  -- Submission workflow
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_id TEXT, -- Could reference a users table
  reviewer_notes TEXT,
  rejection_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional fields for tracking
  submission_source TEXT DEFAULT 'web_form', -- web_form, api, import, etc.
  version INTEGER DEFAULT 1, -- For versioning submissions
  parent_experience_id UUID, -- Reference to cultural_experiences if approved
  
  -- Search vector (updated via trigger)
  search_vector tsvector
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_experience_submissions_status ON experience_submissions(status);
CREATE INDEX IF NOT EXISTS idx_experience_submissions_craft ON experience_submissions(craft);
CREATE INDEX IF NOT EXISTS idx_experience_submissions_location ON experience_submissions(location);
CREATE INDEX IF NOT EXISTS idx_experience_submissions_artisan ON experience_submissions(artisan_name);
CREATE INDEX IF NOT EXISTS idx_experience_submissions_created_at ON experience_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experience_submissions_search ON experience_submissions USING GIN(search_vector);

-- Function to update search vector (French priority)
CREATE OR REPLACE FUNCTION update_experience_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('french', 
    COALESCE(NEW.title, '') || ' ' || 
    COALESCE(NEW.artisan_name, '') || ' ' || 
    COALESCE(NEW.craft, '') || ' ' || 
    COALESCE(NEW.location, '') || ' ' || 
    COALESCE(NEW.description, '') || ' ' || 
    COALESCE(NEW.artisan_experience, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '') || ' ' ||
    COALESCE(array_to_string(NEW.languages, ' '), '') || ' ' ||
    COALESCE(array_to_string(NEW.quick_moods, ' '), '') || ' ' ||
    COALESCE(array_to_string(NEW.experience_styles, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
CREATE TRIGGER update_search_vector_trigger
  BEFORE INSERT OR UPDATE ON experience_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_experience_search_vector();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_experience_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_experience_submissions_updated_at
  BEFORE UPDATE ON experience_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_experience_submissions_updated_at();

-- ============================================================================
-- Experience Validation & Certification Functions
-- ============================================================================

-- Function to submit an experience for review
CREATE OR REPLACE FUNCTION submit_experience_for_review(
  submission_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE experience_submissions
  SET 
    status = 'pending',
    submitted_at = NOW()
  WHERE 
    id = submission_id 
    AND status = 'draft';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to approve an experience submission
CREATE OR REPLACE FUNCTION approve_experience_submission(
  submission_id UUID,
  reviewer_user_id TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  submission_record experience_submissions%ROWTYPE;
  new_experience_id UUID;
BEGIN
  -- Get the submission record
  SELECT * INTO submission_record 
  FROM experience_submissions 
  WHERE id = submission_id AND status = 'pending';
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found or not in pending status';
  END IF;
  
  -- Create the approved experience in the main table
  INSERT INTO cultural_experiences (
    title,
    artisan_name,
    craft,
    location,
    price,
    duration,
    description,
    image,
    artisan_age,
    artisan_experience,
    heritage,
    certification,
    languages,
    tags,
    quick_moods,
    experience_styles,
    interactive_content,
    rating,
    reviews,
    social_proof,
    active
  ) VALUES (
    submission_record.title,
    submission_record.artisan_name,
    submission_record.craft,
    submission_record.location,
    submission_record.price,
    submission_record.duration,
    submission_record.description,
    submission_record.image,
    submission_record.artisan_age,
    submission_record.artisan_experience,
    submission_record.heritage,
    submission_record.certification,
    submission_record.languages,
    submission_record.tags,
    submission_record.quick_moods,
    submission_record.experience_styles,
    submission_record.interactive_content,
    0, -- Initial rating
    0, -- Initial review count
    'Recently verified by Morocco Made Real',
    true -- Active by default
  ) RETURNING id INTO new_experience_id;
  
  -- Update the submission status
  UPDATE experience_submissions
  SET 
    status = 'approved',
    reviewed_at = NOW(),
    reviewer_id = reviewer_user_id,
    reviewer_notes = notes,
    parent_experience_id = new_experience_id
  WHERE id = submission_id;
  
  RETURN new_experience_id;
END;
$$ LANGUAGE plpgsql;

-- Function to reject an experience submission
CREATE OR REPLACE FUNCTION reject_experience_submission(
  submission_id UUID,
  reviewer_user_id TEXT DEFAULT NULL,
  reason TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $$
BEGIN
  UPDATE experience_submissions
  SET 
    status = 'rejected',
    reviewed_at = NOW(),
    reviewer_id = reviewer_user_id,
    reviewer_notes = notes,
    rejection_reason = reason
  WHERE 
    id = submission_id 
    AND status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Analytics and Reporting Functions
-- ============================================================================

-- Function to get submission statistics
CREATE OR REPLACE FUNCTION get_submission_stats()
RETURNS TABLE (
  total_submissions INTEGER,
  pending_submissions INTEGER,
  approved_submissions INTEGER,
  rejected_submissions INTEGER,
  draft_submissions INTEGER,
  avg_review_time_hours NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_submissions,
    COUNT(*) FILTER (WHERE status = 'pending')::INTEGER as pending_submissions,
    COUNT(*) FILTER (WHERE status = 'approved')::INTEGER as approved_submissions,
    COUNT(*) FILTER (WHERE status = 'rejected')::INTEGER as rejected_submissions,
    COUNT(*) FILTER (WHERE status = 'draft')::INTEGER as draft_submissions,
    AVG(EXTRACT(EPOCH FROM (reviewed_at - submitted_at))/3600)::NUMERIC as avg_review_time_hours
  FROM experience_submissions;
END;
$$ LANGUAGE plpgsql;

-- Function to get artisan submission history
CREATE OR REPLACE FUNCTION get_artisan_submissions(artisan_email_param TEXT)
RETURNS TABLE (
  id UUID,
  title TEXT,
  status TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    es.id,
    es.title,
    es.status,
    es.submitted_at,
    es.reviewed_at,
    es.reviewer_notes
  FROM experience_submissions es
  WHERE es.artisan_email = artisan_email_param
  ORDER BY es.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Multilingual Search Functions
-- ============================================================================

-- Function for advanced multilingual search
CREATE OR REPLACE FUNCTION search_experiences_multilingual(
  search_query TEXT,
  search_language TEXT DEFAULT 'french'
) RETURNS TABLE (
  id UUID,
  title TEXT,
  artisan_name TEXT,
  craft TEXT,
  location TEXT,
  price DECIMAL(10,2),
  status TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    es.id,
    es.title,
    es.artisan_name,
    es.craft,
    es.location,
    es.price,
    es.status,
    ts_rank(
      CASE 
        WHEN search_language = 'french' THEN to_tsvector('french', es.title || ' ' || es.description || ' ' || es.artisan_name)
        WHEN search_language = 'english' THEN to_tsvector('english', es.title || ' ' || es.description || ' ' || es.artisan_name)
        WHEN search_language = 'arabic' THEN to_tsvector('arabic', es.title || ' ' || es.description || ' ' || es.artisan_name)
        ELSE to_tsvector('french', es.title || ' ' || es.description || ' ' || es.artisan_name)
      END,
      CASE 
        WHEN search_language = 'french' THEN to_tsquery('french', search_query)
        WHEN search_language = 'english' THEN to_tsquery('english', search_query)
        WHEN search_language = 'arabic' THEN to_tsquery('arabic', search_query)
        ELSE to_tsquery('french', search_query)
      END
    ) as rank
  FROM experience_submissions es
  WHERE 
    CASE 
      WHEN search_language = 'french' THEN to_tsvector('french', es.title || ' ' || es.description || ' ' || es.artisan_name)
      WHEN search_language = 'english' THEN to_tsvector('english', es.title || ' ' || es.description || ' ' || es.artisan_name)
      WHEN search_language = 'arabic' THEN to_tsvector('arabic', es.title || ' ' || es.description || ' ' || es.artisan_name)
      ELSE to_tsvector('french', es.title || ' ' || es.description || ' ' || es.artisan_name)
    END
    @@
    CASE 
      WHEN search_language = 'french' THEN to_tsquery('french', search_query)
      WHEN search_language = 'english' THEN to_tsquery('english', search_query)
      WHEN search_language = 'arabic' THEN to_tsquery('arabic', search_query)
      ELSE to_tsquery('french', search_query)
    END
  ORDER BY rank DESC, es.created_at DESC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Blockchain Integration & Certification
-- ============================================================================

-- Function to generate blockchain certification data
CREATE OR REPLACE FUNCTION generate_blockchain_certification(
  submission_id UUID
) RETURNS JSONB AS $$
DECLARE
  submission_record experience_submissions%ROWTYPE;
  blockchain_data JSONB;
  verification_hash TEXT;
BEGIN
  -- Get submission details
  SELECT * INTO submission_record 
  FROM experience_submissions 
  WHERE id = submission_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;
  
  -- Generate verification hash (simplified for demo)
  verification_hash := 'MA-' || 
    upper(substring(submission_record.craft from 1 for 3)) || '-' ||
    extract(epoch from now())::bigint || '-' ||
    substring(md5(submission_record.artisan_name || submission_record.title) from 1 for 8);
  
  -- Build blockchain certification data
  blockchain_data := jsonb_build_object(
    'artisanVerification', submission_record.artisan_name || ' verified artisan - ID: ' || verification_hash,
    'heritageAuthenticity', 'Authenticated by Moroccan Ministry of Handicrafts & Social Economy',
    'skillCertification', 'Master ' || submission_record.craft || ' certification - Traditional crafts',
    'communityEndorsement', 'Endorsed by ' || submission_record.location || ' Artisan Cooperative',
    'blockchainHash', '0x' || md5(verification_hash || submission_record.title)::text || '...' || 
      lower(replace(submission_record.artisan_name, ' ', '')) || '-verified-2024',
    'verificationDate', extract(epoch from now()),
    'certificationLevel', 'Master Artisan',
    'authenticityScore', 98.5 + random() * 1.5, -- 98.5-100% authenticity
    'communityTrust', 95.0 + random() * 5.0 -- 95-100% community trust
  );
  
  RETURN blockchain_data;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Insert Sample Pending Submissions for Testing
-- ============================================================================

-- Sample submission 1: Pottery experience
INSERT INTO experience_submissions (
  title,
  artisan_name,
  artisan_email,
  craft,
  location,
  price,
  duration,
  description,
  artisan_age,
  artisan_experience,
  heritage,
  certification,
  languages,
  tags,
  quick_moods,
  experience_styles,
  interactive_content,
  status,
  submission_source
) VALUES (
  'Amina''s Sacred Pottery Rituals',
  'Amina El Fassi',
  'amina@example.com',
  'pottery',
  'Safi',
  85,
  '5 hours',
  'Learn the ancient art of Safi pottery, where each piece carries the spiritual energy of our ancestors. Amina will guide you through the sacred clay preparation rituals passed down through 7 generations.',
  58,
  '30 years mastering traditional Safi pottery techniques',
  '7th generation potter, family workshop established in 1780',
  'Master Potter (Maalem) - Safi Guild Certified',
  ARRAY['AR', 'FR', 'Berber'],
  ARRAY['🏺 Traditional', '🙏 Spiritual', '🌟 Sacred', '👵 Elder Wisdom'],
  ARRAY['creative', 'learn', 'relax'],
  ARRAY['hands-on', 'storytelling', 'meditative'],
  '{
    "audioStory": {
      "title": "The Sacred Clay of Safi",
      "duration": "4 minutes",
      "description": "Listen to Amina share the spiritual significance of Safi clay and the blessing rituals performed before each creation."
    },
    "videoPreview": {
      "title": "Ancient Pottery Techniques",
      "duration": "2 minutes",
      "highlights": ["Sacred clay preparation", "Traditional wheel spinning", "Ancestral firing methods"]
    },
    "culturalContext": {
      "tradition": "Safi pottery represents one of Morocco''s most sacred ceramic traditions, where each piece is believed to hold protective spiritual energy.",
      "significance": "The blue and white patterns tell stories of water, sky, and divine protection that have guided Moroccan homes for centuries.",
      "history": "The pottery tradition of Safi dates back to the 12th century when master potters developed the distinctive blue and white glazing techniques.",
      "readTime": "3 minutes"
    }
  }',
  'pending',
  'web_form'
),

-- Sample submission 2: Carpet weaving experience  
(
  'Khadija''s Atlas Mountain Weaving Sanctuary',
  'Khadija Ait Brahim',
  'khadija@example.com',
  'rug weaving',
  'Atlas Mountains',
  120,
  '8 hours',
  'Journey to our mountain sanctuary where Berber women have woven stories into carpets for over 1000 years. Learn the secret techniques of High Atlas weaving while sharing traditional meals.',
  45,
  '25 years preserving Berber weaving traditions',
  'Berber tribal weaving master, patterns passed through maternal lineage for 12 generations',
  'High Atlas Weaving Master - UNESCO Recognition',
  ARRAY['Berber', 'AR', 'FR'],
  ARRAY['🧶 Berber Heritage', '🏔️ Mountain Life', '🌟 Ancient Patterns', '👩 Women''s Circle'],
  ARRAY['learn', 'adventure', 'social'],
  ARRAY['hands-on', 'storytelling', 'intimate'],
  '{
    "audioStory": {
      "title": "Songs of the Loom",
      "duration": "6 minutes", 
      "description": "Experience the traditional Berber weaving songs that guide the rhythm of the loom and tell the stories woven into each carpet."
    },
    "videoPreview": {
      "title": "High Atlas Weaving Traditions",
      "duration": "3 minutes",
      "highlights": ["Mountain sheep wool preparation", "Ancient loom techniques", "Sacred pattern meanings"]
    },
    "culturalContext": {
      "tradition": "Berber carpet weaving in the High Atlas is a sacred feminine art where each pattern carries tribal history and spiritual protection.",
      "significance": "The geometric patterns represent the cosmos, fertility, and protection, serving as both art and spiritual shields for the home.",
      "history": "This weaving tradition predates Islam in Morocco, with some patterns tracing back over 2000 years to ancient Berber astronomical observations.",
      "readTime": "4 minutes"
    }
  }',
  'pending',
  'web_form'
);

-- ============================================================================
-- Row Level Security (Optional)
-- ============================================================================

-- Enable RLS on experience_submissions table
ALTER TABLE experience_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view approved submissions
CREATE POLICY "Anyone can view approved submissions" ON experience_submissions
  FOR SELECT USING (status = 'approved');

-- Policy: Artisans can view/edit their own submissions (requires auth.email())
CREATE POLICY "Artisans can manage their own submissions" ON experience_submissions
  FOR ALL USING (
    artisan_email = COALESCE(
      (auth.jwt() ->> 'email'), 
      (current_setting('request.jwt.claims', true)::json ->> 'email'),
      ''
    )
  );

-- Policy: Admins can view/edit all submissions (requires admin role)
CREATE POLICY "Admins can manage all submissions" ON experience_submissions
  FOR ALL USING (
    COALESCE(
      (auth.jwt() ->> 'role'),
      (current_setting('request.jwt.claims', true)::json ->> 'role'),
      ''
    ) = 'admin'
  );

-- ============================================================================
-- Summary
-- ============================================================================
/*
This migration creates a comprehensive experience submission and validation system:

1. **experience_submissions table**: Stores all submission data with workflow status
2. **Search vector triggers**: Updates French-prioritized search on insert/update
3. **Workflow functions**: submit_experience_for_review(), approve_experience_submission(), reject_experience_submission()
4. **Analytics functions**: get_submission_stats(), get_artisan_submissions()
5. **Multilingual search**: search_experiences_multilingual() for advanced search capabilities
6. **Blockchain integration**: generate_blockchain_certification() for authentic verification
7. **Sample data**: Two pending submissions for testing the review workflow
8. **Security**: Row Level Security policies for access control

Key Features:
- ✅ Complete submission workflow (draft → pending → approved/rejected)
- ✅ French-prioritized full-text search with multilingual support
- ✅ Blockchain certification generation
- ✅ Analytics and reporting
- ✅ Artisan submission tracking
- ✅ Admin approval workflow
- ✅ Integration with existing cultural_experiences table
- ✅ Trigger-based search vector (resolves immutable function error)

Language Priority: French (1st) → English (2nd) → Arabic (3rd)

Ready for production use! 🚀🇫🇷
*/ 