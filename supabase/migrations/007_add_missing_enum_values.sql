-- Add missing enum values for tourist profiles
-- Migration: 007_add_missing_enum_values.sql

-- Add missing experience types
ALTER TYPE experience_type ADD VALUE IF NOT EXISTS 'heritage-connection';
ALTER TYPE experience_type ADD VALUE IF NOT EXISTS 'cultural-overview';
ALTER TYPE experience_type ADD VALUE IF NOT EXISTS 'artisan-meeting';

-- Add missing learning styles
ALTER TYPE learning_style ADD VALUE IF NOT EXISTS 'social';
ALTER TYPE learning_style ADD VALUE IF NOT EXISTS 'auditory';

-- Verify the enum values
SELECT unnest(enum_range(NULL::experience_type)) AS experience_types;
SELECT unnest(enum_range(NULL::learning_style)) AS learning_styles; 