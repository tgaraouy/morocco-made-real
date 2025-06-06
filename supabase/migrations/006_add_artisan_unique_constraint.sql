-- Add UNIQUE constraint on artisan_id for artisan_profiles_rl table
-- This allows upsert operations to work properly

-- First, remove any duplicate records (keeping the most recent one)
DELETE FROM artisan_profiles_rl 
WHERE id NOT IN (
    SELECT DISTINCT ON (artisan_id) id 
    FROM artisan_profiles_rl 
    ORDER BY artisan_id, updated_at DESC
);

-- Add the UNIQUE constraint
ALTER TABLE artisan_profiles_rl 
ADD CONSTRAINT artisan_profiles_rl_artisan_id_unique 
UNIQUE (artisan_id); 