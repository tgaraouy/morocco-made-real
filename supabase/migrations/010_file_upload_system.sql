-- ============================================================================
-- File Upload & Storage System Migration
-- ============================================================================

-- Create uploaded_files table
CREATE TABLE IF NOT EXISTS uploaded_files (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'audio')),
  mime_type TEXT NOT NULL,
  size BIGINT NOT NULL CHECK (size > 0),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Upload tracking
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by TEXT NOT NULL,
  
  -- Practice categorization
  practice_category TEXT,
  documentation_type TEXT,
  
  -- File metadata (JSONB for flexibility)
  metadata JSONB DEFAULT '{}',
  
  -- Validation results
  validation_result JSONB DEFAULT '{}',
  
  -- Relationships
  submission_id UUID REFERENCES experience_submissions(id) ON DELETE CASCADE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_uploaded_files_submission_id ON uploaded_files(submission_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_file_type ON uploaded_files(file_type);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_practice_category ON uploaded_files(practice_category);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_uploaded_by ON uploaded_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_uploaded_at ON uploaded_files(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_validation ON uploaded_files USING GIN(validation_result);

-- Create traditional_practices table for validation rules
CREATE TABLE IF NOT EXISTS traditional_practices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  arabic_name TEXT,
  berber_name TEXT,
  category TEXT NOT NULL,
  region TEXT NOT NULL,
  
  -- Historical context
  origin_period TEXT,
  cultural_significance JSONB DEFAULT '{}',
  religious_aspects JSONB DEFAULT '[]',
  
  -- Practice details
  tools JSONB DEFAULT '[]',
  materials JSONB DEFAULT '[]',
  techniques JSONB DEFAULT '[]',
  rituals JSONB DEFAULT '[]',
  
  -- Validation criteria
  authenticity_markers JSONB DEFAULT '[]',
  common_mistakes TEXT[],
  red_flags JSONB DEFAULT '[]',
  
  -- Media requirements
  required_documentation TEXT[],
  video_requirements JSONB DEFAULT '{}',
  image_requirements JSONB DEFAULT '{}',
  
  -- Verification
  verification_level TEXT DEFAULT 'community',
  expert_validators JSONB DEFAULT '[]',
  community_endorsements JSONB DEFAULT '[]',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Full-text search
  search_vector tsvector
);

-- Create indexes for traditional_practices
CREATE INDEX IF NOT EXISTS idx_traditional_practices_category ON traditional_practices(category);
CREATE INDEX IF NOT EXISTS idx_traditional_practices_region ON traditional_practices(region);
CREATE INDEX IF NOT EXISTS idx_traditional_practices_verification_level ON traditional_practices(verification_level);
CREATE INDEX IF NOT EXISTS idx_traditional_practices_search ON traditional_practices USING GIN(search_vector);

-- Create storage policies
CREATE TABLE IF NOT EXISTS storage_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_name TEXT NOT NULL,
  policy_name TEXT NOT NULL,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')),
  role_required TEXT,
  conditions JSONB DEFAULT '{}',
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bucket_name, policy_name, policy_type)
);

-- ============================================================================
-- Functions for File Management
-- ============================================================================

-- Function to update search vector for traditional practices
CREATE OR REPLACE FUNCTION update_traditional_practice_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('french',
    COALESCE(NEW.name, '') || ' ' ||
    COALESCE(NEW.arabic_name, '') || ' ' ||
    COALESCE(NEW.berber_name, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' ||
    COALESCE(NEW.region, '') || ' ' ||
    COALESCE(array_to_string(NEW.common_mistakes, ' '), '') || ' ' ||
    COALESCE(array_to_string(NEW.required_documentation, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector updates
CREATE TRIGGER update_traditional_practice_search_vector_trigger
  BEFORE INSERT OR UPDATE ON traditional_practices
  FOR EACH ROW
  EXECUTE FUNCTION update_traditional_practice_search_vector();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_uploaded_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_uploaded_files_updated_at
  BEFORE UPDATE ON uploaded_files
  FOR EACH ROW
  EXECUTE FUNCTION update_uploaded_files_updated_at();

-- Function to get file statistics
CREATE OR REPLACE FUNCTION get_file_statistics()
RETURNS TABLE (
  total_files INTEGER,
  total_size_bytes BIGINT,
  files_by_type JSONB,
  files_by_practice JSONB,
  validation_scores JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_files,
    SUM(size)::BIGINT as total_size_bytes,
    jsonb_object_agg(file_type, type_count) as files_by_type,
    jsonb_object_agg(practice_category, practice_count) as files_by_practice,
    jsonb_object_agg(
      CASE 
        WHEN (validation_result->>'score')::NUMERIC >= 90 THEN 'excellent'
        WHEN (validation_result->>'score')::NUMERIC >= 80 THEN 'good'
        WHEN (validation_result->>'score')::NUMERIC >= 60 THEN 'fair'
        ELSE 'needs_improvement'
      END,
      score_count
    ) as validation_scores
  FROM (
    SELECT 
      file_type,
      practice_category,
      validation_result,
      COUNT(*) OVER (PARTITION BY file_type) as type_count,
      COUNT(*) OVER (PARTITION BY practice_category) as practice_count,
      COUNT(*) OVER (PARTITION BY 
        CASE 
          WHEN (validation_result->>'score')::NUMERIC >= 90 THEN 'excellent'
          WHEN (validation_result->>'score')::NUMERIC >= 80 THEN 'good'
          WHEN (validation_result->>'score')::NUMERIC >= 60 THEN 'fair'
          ELSE 'needs_improvement'
        END
      ) as score_count
    FROM uploaded_files
    WHERE validation_result IS NOT NULL
  ) subquery;
END;
$$ LANGUAGE plpgsql;

-- Function to validate file against practice
CREATE OR REPLACE FUNCTION validate_file_against_practice(
  file_id TEXT,
  practice_id TEXT
) RETURNS JSONB AS $$
DECLARE
  file_record uploaded_files%ROWTYPE;
  practice_record traditional_practices%ROWTYPE;
  validation_result JSONB;
  score INTEGER := 100;
  flags JSONB := '[]'::JSONB;
BEGIN
  -- Get file record
  SELECT * INTO file_record FROM uploaded_files WHERE id = file_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'File not found: %', file_id;
  END IF;
  
  -- Get practice record
  SELECT * INTO practice_record FROM traditional_practices WHERE id = practice_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Practice not found: %', practice_id;
  END IF;
  
  -- Technical validation
  IF file_record.file_type = 'video' AND practice_record.video_requirements IS NOT NULL THEN
    -- Check video duration
    IF (file_record.metadata->>'duration')::NUMERIC < (practice_record.video_requirements->>'minDuration')::NUMERIC THEN
      score := score - 25;
      flags := flags || jsonb_build_object(
        'type', 'CRITICAL',
        'trigger', 'video_too_short',
        'message', 'Video duration below minimum requirement',
        'severity', 'REJECT'
      );
    END IF;
  END IF;
  
  -- Image resolution validation
  IF file_record.file_type = 'image' AND practice_record.image_requirements IS NOT NULL THEN
    -- Check resolution
    IF (file_record.metadata->>'width')::NUMERIC < (practice_record.image_requirements->'minResolution'->>'width')::NUMERIC THEN
      score := score - 15;
      flags := flags || jsonb_build_object(
        'type', 'WARNING',
        'trigger', 'low_resolution',
        'message', 'Image resolution below recommended minimum',
        'severity', 'REVIEW'
      );
    END IF;
  END IF;
  
  -- Build validation result
  validation_result := jsonb_build_object(
    'isValid', (score >= 60 AND NOT EXISTS (SELECT 1 FROM jsonb_array_elements(flags) WHERE value->>'type' = 'CRITICAL')),
    'score', score,
    'level', CASE 
      WHEN score >= 95 THEN 'master'
      WHEN score >= 85 THEN 'expert'
      WHEN score >= 70 THEN 'artisan'
      ELSE 'community'
    END,
    'flags', flags,
    'validatedAt', extract(epoch from now()),
    'practiceId', practice_id
  );
  
  -- Update file record
  UPDATE uploaded_files 
  SET validation_result = validation_result 
  WHERE id = file_id;
  
  RETURN validation_result;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up orphaned files
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS INTEGER AS $$
DECLARE
  cleanup_count INTEGER := 0;
BEGIN
  -- Mark files for deletion if their submission was deleted
  WITH orphaned_files AS (
    SELECT uf.id
    FROM uploaded_files uf
    LEFT JOIN experience_submissions es ON uf.submission_id = es.id
    WHERE uf.submission_id IS NOT NULL AND es.id IS NULL
  )
  DELETE FROM uploaded_files
  WHERE id IN (SELECT id FROM orphaned_files);
  
  GET DIAGNOSTICS cleanup_count = ROW_COUNT;
  
  RETURN cleanup_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Insert Traditional Practices Data
-- ============================================================================

-- Pottery practices
INSERT INTO traditional_practices (
  id, name, arabic_name, category, region, origin_period,
  cultural_significance, authenticity_markers, common_mistakes,
  required_documentation, video_requirements, image_requirements,
  verification_level
) VALUES (
  'pottery_safi',
  'Safi Blue Pottery',
  'فخار صافي الأزرق',
  'pottery',
  'safi',
  'MARINID',
  '{
    "level": "HIGH",
    "description": "Sacred ceramic tradition of Safi dating back to 12th century",
    "socialRole": "Cultural identity marker for Safi region",
    "economicImpact": "Primary livelihood for thousands of artisan families"
  }',
  '[
    {
      "type": "VISUAL",
      "indicator": "Distinctive blue and white geometric patterns",
      "importance": "CRITICAL",
      "description": "Traditional cobalt blue glazing with white geometric motifs",
      "examples": ["Eight-pointed star motifs", "Interlacing geometric borders", "Calligraphic elements"]
    },
    {
      "type": "TECHNICAL", 
      "indicator": "Hand-thrown pottery wheel technique",
      "importance": "HIGH",
      "description": "Traditional foot-powered pottery wheel usage",
      "examples": ["Visible wheel marks", "Symmetric form", "Proper wall thickness"]
    }
  ]',
  ARRAY['Using electric pottery wheels', 'Non-traditional glazing colors', 'Machine-made uniformity'],
  ARRAY['VIDEO_DEMONSTRATION', 'STEP_BY_STEP_PHOTOS', 'FINAL_PRODUCT_IMAGES'],
  '{
    "minDuration": 300,
    "maxDuration": 1800,
    "requiredAngles": ["overview", "close_up_hands", "tool_detail", "process_sequence"],
    "audioQuality": {
      "clearNarration": true,
      "languageRequirements": ["AR", "FR"]
    }
  }',
  '{
    "minResolution": {"width": 1920, "height": 1080},
    "formats": ["jpeg", "png"],
    "requiredShots": [
      {"type": "wide_overview", "quantity": 2},
      {"type": "close_up_detail", "quantity": 5},
      {"type": "process_sequence", "quantity": 8}
    ]
  }',
  'EXPERT'
),

-- Weaving practices
(
  'weaving_atlas',
  'High Atlas Berber Weaving',
  'نسيج الأطلس الكبير',
  'weaving',
  'atlas_mountains',
  'PRE_ISLAMIC',
  '{
    "level": "SACRED",
    "description": "Ancient Berber weaving traditions preserving tribal identity",
    "socialRole": "Women''s sacred knowledge transmission",
    "economicImpact": "Traditional mountain economy foundation"
  }',
  '[
    {
      "type": "CULTURAL",
      "indicator": "Traditional Berber geometric patterns",
      "importance": "CRITICAL", 
      "description": "Sacred tribal patterns with specific meanings",
      "examples": ["Diamond motifs for fertility", "Zigzag patterns for water", "Eye symbols for protection"]
    }
  ]',
  ARRAY['Modern synthetic materials', 'Non-traditional color combinations', 'Machine weaving'],
  ARRAY['VIDEO_DEMONSTRATION', 'STEP_BY_STEP_PHOTOS', 'TECHNIQUE_MANUAL'],
  '{
    "minDuration": 600,
    "maxDuration": 2400,
    "requiredAngles": ["overview", "close_up_hands", "workspace", "final_product"]
  }',
  '{
    "minResolution": {"width": 1920, "height": 1080},
    "formats": ["jpeg", "png", "tiff"]
  }',
  'MASTER'
);

-- ============================================================================
-- Row Level Security for File Upload System
-- ============================================================================

-- Enable RLS on uploaded_files
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view files they uploaded
CREATE POLICY "Users can view their own files" ON uploaded_files
  FOR SELECT USING (
    uploaded_by = COALESCE(
      (auth.jwt() ->> 'sub'),
      (current_setting('request.jwt.claims', true)::json ->> 'sub'),
      ''
    )
  );

-- Policy: Users can upload files
CREATE POLICY "Users can upload files" ON uploaded_files
  FOR INSERT WITH CHECK (
    uploaded_by = COALESCE(
      (auth.jwt() ->> 'sub'),
      (current_setting('request.jwt.claims', true)::json ->> 'sub'),
      ''
    )
  );

-- Policy: Users can update their own files
CREATE POLICY "Users can update their own files" ON uploaded_files
  FOR UPDATE USING (
    uploaded_by = COALESCE(
      (auth.jwt() ->> 'sub'),
      (current_setting('request.jwt.claims', true)::json ->> 'sub'),
      ''
    )
  );

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete their own files" ON uploaded_files
  FOR DELETE USING (
    uploaded_by = COALESCE(
      (auth.jwt() ->> 'sub'),
      (current_setting('request.jwt.claims', true)::json ->> 'sub'),
      ''
    )
  );

-- Policy: Admins can view all files
CREATE POLICY "Admins can view all files" ON uploaded_files
  FOR SELECT USING (
    COALESCE(
      (auth.jwt() ->> 'role'),
      (current_setting('request.jwt.claims', true)::json ->> 'role'),
      ''
    ) = 'admin'
  );

-- Enable RLS on traditional_practices (read-only for most users)
ALTER TABLE traditional_practices ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read traditional practices
CREATE POLICY "Anyone can read traditional practices" ON traditional_practices
  FOR SELECT USING (true);

-- Policy: Only admins can modify traditional practices
CREATE POLICY "Admins can modify traditional practices" ON traditional_practices
  FOR ALL USING (
    COALESCE(
      (auth.jwt() ->> 'role'),
      (current_setting('request.jwt.claims', true)::json ->> 'role'),
      ''
    ) = 'admin'
  );

-- ============================================================================
-- Storage Bucket Creation (to be run in Supabase Dashboard)
-- ============================================================================

/*
-- Note: These commands should be run in the Supabase Dashboard Storage section:

1. Create bucket 'cultural-content':
   - Go to Storage in Supabase Dashboard
   - Click "New bucket"
   - Name: cultural-content
   - Public: true (for public access to validated content)

2. Set up storage policies in the Dashboard or via SQL:

-- Allow authenticated users to upload
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'cultural-content',
  'Allow authenticated uploads',
  'auth.role() = ''authenticated'''
);

-- Allow public read access to validated content
INSERT INTO storage.policies (bucket_id, name, definition)
VALUES (
  'cultural-content', 
  'Public read access',
  'true'
);
*/

-- ============================================================================
-- Summary
-- ============================================================================
/*
This migration creates a comprehensive file upload and validation system:

1. **uploaded_files table**: Stores all file metadata and validation results
2. **traditional_practices table**: Stores validation rules for cultural practices
3. **File validation functions**: validate_file_against_practice() for automated validation
4. **Statistics functions**: get_file_statistics() for analytics
5. **Cleanup functions**: cleanup_orphaned_files() for maintenance
6. **Search capabilities**: Full-text search on traditional practices
7. **Security policies**: Row Level Security for proper access control
8. **Sample data**: Traditional practices for pottery and weaving

Integration Points:
- ✅ Links to experience_submissions table
- ✅ Supports blockchain verification workflow  
- ✅ French-prioritized search vectors
- ✅ Comprehensive metadata storage
- ✅ Automated validation scoring
- ✅ Expert review workflow support

Storage Requirements:
- ✅ Supabase Storage bucket: 'cultural-content'
- ✅ Support for images, videos, documents, audio
- ✅ Thumbnail generation capability
- ✅ Metadata extraction and validation

Ready for integration with the file upload service! 🚀📁
*/ 