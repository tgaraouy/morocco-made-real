-- Complete Database Setup for RL System
-- Run this entire script in Supabase SQL Editor

-- Step 1: Add UNIQUE constraint on agent_type for rl_agent_performance table
DELETE FROM rl_agent_performance 
WHERE id NOT IN (
    SELECT DISTINCT ON (agent_type) id 
    FROM rl_agent_performance 
    ORDER BY agent_type, updated_at DESC
);

ALTER TABLE rl_agent_performance 
ADD CONSTRAINT rl_agent_performance_agent_type_unique 
UNIQUE (agent_type);

-- Step 2: Add UNIQUE constraint on artisan_id for artisan_profiles_rl table
DELETE FROM artisan_profiles_rl 
WHERE id NOT IN (
    SELECT DISTINCT ON (artisan_id) id 
    FROM artisan_profiles_rl 
    ORDER BY artisan_id, updated_at DESC
);

ALTER TABLE artisan_profiles_rl 
ADD CONSTRAINT artisan_profiles_rl_artisan_id_unique 
UNIQUE (artisan_id);

-- Step 3: Create base artisan records (required for foreign key constraints)
INSERT INTO artisans (id, name, email, bio, region, specialization, years_experience, contact_info, created_at, updated_at)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'Hassan Benali',
    'hassan.benali@example.com',
    'Master pottery artisan specializing in traditional Fassi techniques',
    'Fez',
    'pottery',
    25,
    '{"phone": "+212-123-456-789"}',
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Fatima Zahra',
    'fatima.zahra@example.com',
    'Master weaver specializing in traditional Berber textiles',
    'Marrakech',
    'weaving',
    30,
    '{"phone": "+212-123-456-790"}',
    NOW(),
    NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Ahmed Tazi',
    'ahmed.tazi@example.com',
    'Skilled leather artisan from the famous Chouara tannery quarter',
    'Fez',
    'leather',
    20,
    '{"phone": "+212-123-456-791"}',
    NOW(),
    NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Youssef El Fassi',
    'youssef.elfassi@example.com',
    'Master metalworker specializing in traditional brass and silver work',
    'Fez',
    'metalwork',
    28,
    '{"phone": "+212-123-456-792"}',
    NOW(),
    NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  bio = EXCLUDED.bio,
  region = EXCLUDED.region,
  specialization = EXCLUDED.specialization,
  years_experience = EXCLUDED.years_experience,
  contact_info = EXCLUDED.contact_info,
  updated_at = NOW();

-- Verification queries to check the setup
SELECT 'UNIQUE Constraints Added' as status;
SELECT 'Base Artisans Created: ' || COUNT(*) as artisan_count FROM artisans WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222', 
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444'
);

SELECT 'Database setup completed successfully!' as final_status; 