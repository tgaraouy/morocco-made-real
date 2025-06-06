-- Add UNIQUE constraint on agent_type for rl_agent_performance table
-- This allows upsert operations to work properly

-- First, remove any duplicate records (keeping the most recent one)
DELETE FROM rl_agent_performance 
WHERE id NOT IN (
    SELECT DISTINCT ON (agent_type) id 
    FROM rl_agent_performance 
    ORDER BY agent_type, updated_at DESC
);

-- Add the UNIQUE constraint
ALTER TABLE rl_agent_performance 
ADD CONSTRAINT rl_agent_performance_agent_type_unique 
UNIQUE (agent_type); 