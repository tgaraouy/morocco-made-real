-- Tourist Profiles based on Phone Numbers (Mobile-First for Tourists)
-- Execute this SQL in your Supabase SQL Editor

-- Create phone-based tourist profiles table
CREATE TABLE IF NOT EXISTS tourist_profiles_phone (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Phone as primary identifier (international format)
    phone VARCHAR(20) UNIQUE NOT NULL, -- +212-6-12-34-56-78, +33-6-12-34-56-78, etc.
    
    -- Basic tourist info
    first_name VARCHAR(100),
    country_code VARCHAR(3), -- ISO country code: MA, FR, US, etc.
    
    -- Cultural preferences (the core matching system)
    preferences JSONB DEFAULT '{
        "mood": "creative",
        "timeAvailable": "half-day", 
        "priceRange": "moderate"
    }',
    
    -- Saved experiences and bookings
    saved_experiences TEXT[] DEFAULT '{}', -- Array of experience IDs
    booking_history TEXT[] DEFAULT '{}',   -- Array of booking IDs
    
    -- Profile completion and engagement
    preferences_set BOOLEAN DEFAULT FALSE,
    total_bookings INTEGER DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    
    -- Verification status
    phone_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6), -- SMS verification code
    verification_expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Tourism context
    current_visit JSONB DEFAULT '{}', -- {arrival_date, departure_date, group_size, hotel_location}
    visit_history JSONB[] DEFAULT '{}', -- Array of previous visits
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Privacy and communication preferences
    whatsapp_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    marketing_consent BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_phone_phone ON tourist_profiles_phone(phone);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_phone_country ON tourist_profiles_phone(country_code);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_phone_verified ON tourist_profiles_phone(phone_verified);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_phone_active ON tourist_profiles_phone(last_active);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_phone_preferences ON tourist_profiles_phone USING GIN(preferences);
CREATE INDEX IF NOT EXISTS idx_tourist_profiles_phone_saved_experiences ON tourist_profiles_phone USING GIN(saved_experiences);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_tourist_profiles_phone_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER IF NOT EXISTS update_tourist_profiles_phone_updated_at
    BEFORE UPDATE ON tourist_profiles_phone
    FOR EACH ROW EXECUTE FUNCTION update_tourist_profiles_phone_updated_at();

-- Function to create or update tourist profile
CREATE OR REPLACE FUNCTION upsert_tourist_profile(
    p_phone VARCHAR(20),
    p_first_name VARCHAR(100) DEFAULT NULL,
    p_country_code VARCHAR(3) DEFAULT NULL,
    p_preferences JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    tourist_id UUID;
BEGIN
    INSERT INTO tourist_profiles_phone (phone, first_name, country_code, preferences, preferences_set)
    VALUES (
        p_phone, 
        p_first_name, 
        p_country_code, 
        COALESCE(p_preferences, '{"mood": "creative", "timeAvailable": "half-day", "priceRange": "moderate"}'),
        CASE WHEN p_preferences IS NOT NULL THEN TRUE ELSE FALSE END
    )
    ON CONFLICT (phone) 
    DO UPDATE SET
        first_name = COALESCE(p_first_name, tourist_profiles_phone.first_name),
        country_code = COALESCE(p_country_code, tourist_profiles_phone.country_code),
        preferences = COALESCE(p_preferences, tourist_profiles_phone.preferences),
        preferences_set = CASE WHEN p_preferences IS NOT NULL THEN TRUE ELSE tourist_profiles_phone.preferences_set END,
        last_active = NOW(),
        updated_at = NOW()
    RETURNING id INTO tourist_id;
    
    RETURN tourist_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add experience to saved list
CREATE OR REPLACE FUNCTION add_saved_experience(
    p_phone VARCHAR(20),
    p_experience_id TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE tourist_profiles_phone 
    SET 
        saved_experiences = array_append(saved_experiences, p_experience_id),
        last_active = NOW(),
        updated_at = NOW()
    WHERE phone = p_phone
    AND NOT (p_experience_id = ANY(saved_experiences));
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to add booking to history
CREATE OR REPLACE FUNCTION add_booking_to_history(
    p_phone VARCHAR(20),
    p_booking_id TEXT,
    p_booking_amount DECIMAL(10,2) DEFAULT 0
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE tourist_profiles_phone 
    SET 
        booking_history = array_append(booking_history, p_booking_id),
        total_bookings = total_bookings + 1,
        total_spent = total_spent + p_booking_amount,
        last_active = NOW(),
        updated_at = NOW()
    WHERE phone = p_phone;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Insert demo tourist profiles for testing
INSERT INTO tourist_profiles_phone (
    phone, first_name, country_code, preferences, preferences_set, phone_verified, total_bookings, total_spent
) VALUES 
(
    '+212-6-12-34-56-78',
    'Sarah',
    'FR',
    '{"mood": "creative", "timeAvailable": "half-day", "priceRange": "moderate"}',
    true,
    true,
    1,
    75.00
),
(
    '+33-6-98-76-54-32',
    'Ahmed',
    'FR', 
    '{"mood": "adventurous", "timeAvailable": "full-day", "priceRange": "premium"}',
    true,
    true,
    0,
    0.00
),
(
    '+1-555-123-4567',
    'Lisa',
    'US',
    '{"mood": "social", "timeAvailable": "quick", "priceRange": "budget"}',
    true,
    true,
    2,
    140.00
)
ON CONFLICT (phone) DO NOTHING; 