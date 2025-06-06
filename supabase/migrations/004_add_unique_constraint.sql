-- Migration 004: Add unique constraint to rl_agent_performance table
-- This ensures only one performance record per agent type

-- First, remove any duplicate records (keep the most recent one)
DELETE FROM rl_agent_performance 
WHERE id NOT IN (
    SELECT DISTINCT ON (agent_type) id 
    FROM rl_agent_performance 
    ORDER BY agent_type, updated_at DESC
);

-- Add unique constraint on agent_type
ALTER TABLE rl_agent_performance 
ADD CONSTRAINT rl_agent_performance_agent_type_unique UNIQUE (agent_type); 