-- Tourist Profiles Table for Morocco Made Real
-- Stores phone verification and basic tourist information

CREATE TABLE IF NOT EXISTS tourist_profiles (
  id SERIAL PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  phone_verified BOOLEAN DEFAULT FALSE,
  verification_code TEXT,
  verification_expires_at TIMESTAMP WITH TIME ZONE,
  verification_attempts INTEGER DEFAULT 0,
  
  -- Basic profile information
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  nationality TEXT,
  preferred_language TEXT DEFAULT 'en',
  
  -- Travel preferences
  travel_style TEXT, -- adventure, luxury, cultural, etc.
  interests TEXT[], -- array of interests
  budget_range TEXT, -- budget, mid-range, luxury
  
  -- Verification history
  last_verification_method TEXT, -- whatsapp, sms, qr_auto
  last_verification_at TIMESTAMP WITH TIME ZONE,
  successful_verifications INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_phone ON tourist_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_phone_verified ON tourist_profiles(phone_verified);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_verification_code ON tourist_profiles(verification_code);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_nationality ON tourist_profiles(nationality);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_last_seen ON tourist_profiles(last_seen_at);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tourist_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tourist_profiles_updated_at
  BEFORE UPDATE ON tourist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_tourist_profiles_updated_at();

-- RLS (Row Level Security) policies
ALTER TABLE tourist_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for service role (full access)
CREATE POLICY "Service role can manage all profiles" ON tourist_profiles
  FOR ALL TO service_role USING (true);

-- Policy for authenticated users (can only see their own profile)
CREATE POLICY "Users can view their own profile" ON tourist_profiles
  FOR SELECT TO authenticated USING (phone = current_setting('app.current_user_phone', true));

-- Policy for anonymous users (can create profiles during verification)
CREATE POLICY "Anonymous users can create profiles" ON tourist_profiles
  FOR INSERT TO anon WITH CHECK (true);

-- Policy for anonymous users (can update during verification)
CREATE POLICY "Anonymous users can update during verification" ON tourist_profiles
  FOR UPDATE TO anon USING (
    phone = current_setting('app.current_user_phone', true) OR
    verification_code IS NOT NULL
  );

-- Function to clean up expired verification codes
CREATE OR REPLACE FUNCTION cleanup_expired_verification_codes()
RETURNS void AS $$
BEGIN
  UPDATE tourist_profiles 
  SET 
    verification_code = NULL,
    verification_expires_at = NULL
  WHERE 
    verification_expires_at IS NOT NULL 
    AND verification_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get country from phone number
CREATE OR REPLACE FUNCTION get_country_from_phone(phone_number TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Extract country from phone number prefix
  CASE 
    WHEN phone_number LIKE '+212%' THEN RETURN 'MA'; -- Morocco
    WHEN phone_number LIKE '+33%' THEN RETURN 'FR';  -- France
    WHEN phone_number LIKE '+34%' THEN RETURN 'ES';  -- Spain
    WHEN phone_number LIKE '+49%' THEN RETURN 'DE';  -- Germany
    WHEN phone_number LIKE '+1%' THEN RETURN 'US';   -- USA/Canada
    WHEN phone_number LIKE '+44%' THEN RETURN 'GB';  -- UK
    WHEN phone_number LIKE '+91%' THEN RETURN 'IN';  -- India
    WHEN phone_number LIKE '+55%' THEN RETURN 'BR';  -- Brazil
    WHEN phone_number LIKE '+54%' THEN RETURN 'AR';  -- Argentina
    WHEN phone_number LIKE '+52%' THEN RETURN 'MX';  -- Mexico
    WHEN phone_number LIKE '+39%' THEN RETURN 'IT';  -- Italy
    ELSE RETURN 'Unknown';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE tourist_profiles IS 'Tourist profiles with phone verification for Morocco Made Real';
COMMENT ON COLUMN tourist_profiles.phone IS 'International phone number with country code';
COMMENT ON COLUMN tourist_profiles.phone_verified IS 'Whether phone number has been verified';
COMMENT ON COLUMN tourist_profiles.verification_code IS 'Current verification code (temporary)';
COMMENT ON COLUMN tourist_profiles.verification_expires_at IS 'When current verification code expires';
COMMENT ON COLUMN tourist_profiles.last_verification_method IS 'Method used for last verification (whatsapp, sms, qr_auto)';
COMMENT ON COLUMN tourist_profiles.travel_style IS 'Tourist travel style preference';
COMMENT ON COLUMN tourist_profiles.interests IS 'Array of tourist interests and activities'; 