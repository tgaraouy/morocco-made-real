-- Create base artisan records for RL system testing
-- These are required due to foreign key constraints

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