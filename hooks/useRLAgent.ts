// React Hook for RL Agent Integration - Real Database Integration
import { useState, useEffect, useCallback } from 'react';
import { 
  RLAgent, 
  AgentType, 
  Recommendation, 
  Experience,
  State,
  Action,
  RLConfig,
  TouristProfile,
  ArtisanProfile
} from '@/types/rl';
import { TouristMatchingAgent } from '@/lib/rl/tourist-matching-agent';
import { createDefaultEnvironment, createDefaultRewardFunction } from '@/lib/rl/rl-utils';
import { rlDatabaseService } from '@/lib/rl-database-service';

interface UseRLAgentOptions {
  userId?: string;
  preferences?: any;
  pastExperiences?: Experience[];
  config?: Partial<RLConfig>;
}

interface UseRLAgentReturn {
  agent: RLAgent | null;
  isLearning: boolean;
  recommendations: Recommendation[];
  recordExperience: (experience: Experience) => Promise<void>;
  getRecommendations: () => Promise<Recommendation[]>;
  updateProfile: (profile: TouristProfile | ArtisanProfile) => void;
  performance: any;
  isLoading: boolean;
  error: string | null;
}

export function useRLAgent(
  agentType: AgentType, 
  options: UseRLAgentOptions = {}
): UseRLAgentReturn {
  const [agent, setAgent] = useState<RLAgent | null>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default RL configuration
  const defaultConfig: RLConfig = {
    learningRate: 0.01,
    discountFactor: 0.95,
    explorationRate: 0.1,
    batchSize: 32,
    culturalWeight: 0.4,
    economicWeight: 0.3,
    satisfactionWeight: 0.3,
    ...options.config
  };

  // Initialize agent
  useEffect(() => {
    const initializeAgent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize database service
        await rlDatabaseService.initializeDefaultData();

        const environment = createDefaultEnvironment(agentType);
        const rewardFunction = createDefaultRewardFunction();
        
        let newAgent: RLAgent;

        switch (agentType) {
          case 'tourist-matching':
            newAgent = new TouristMatchingAgent(environment, rewardFunction, defaultConfig);
            break;
          case 'artisan-development':
            // TODO: Implement ArtisanDevelopmentAgent
            throw new Error('Artisan development agent not yet implemented');
          case 'content-creation':
            // TODO: Implement ContentCreationAgent
            throw new Error('Content creation agent not yet implemented');
          case 'cultural-validation':
            // TODO: Implement CulturalValidationAgent
            throw new Error('Cultural validation agent not yet implemented');
          case 'economic-optimization':
            // TODO: Implement EconomicOptimizationAgent
            throw new Error('Economic optimization agent not yet implemented');
          default:
            throw new Error(`Unknown agent type: ${agentType}`);
        }

        // Load past experiences if provided
        if (options.pastExperiences && options.pastExperiences.length > 0) {
          await newAgent.learn(options.pastExperiences);
        }

        setAgent(newAgent);
        console.log(`🧠 RL Agent (${agentType}) initialized successfully`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize RL agent');
        console.error('RL Agent initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAgent();
  }, [agentType, options.userId]);

  // Record experience and trigger learning
  const recordExperience = useCallback(async (experience: Experience) => {
    if (!agent) return;

    try {
      setIsLearning(true);
      
      // Record experience in database
      await rlDatabaseService.recordExperience(experience);
      
      // Trigger agent learning
      await agent.learn([experience]);
      
      // Update recommendations after learning
      const newRecommendations = await agent.getRecommendations();
      setRecommendations(newRecommendations);
      
      console.log('✅ Experience recorded and agent learned successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record experience');
      console.error('Experience recording error:', err);
    } finally {
      setIsLearning(false);
    }
  }, [agent]);

  // Get fresh recommendations
  const getRecommendations = useCallback(async (): Promise<Recommendation[]> => {
    if (!agent) return [];

    try {
      const newRecommendations = await agent.getRecommendations();
      setRecommendations(newRecommendations);
      console.log(`📋 Retrieved ${newRecommendations.length} recommendations`);
      return newRecommendations;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      console.error('Recommendations retrieval error:', err);
      return [];
    }
  }, [agent]);

  // Update user profile
  const updateProfile = useCallback(async (profile: TouristProfile | ArtisanProfile) => {
    if (!agent) return;

    try {
      if (agent.type === 'tourist-matching' && agent instanceof TouristMatchingAgent) {
        if ('preferences' in profile) {
          // It's a tourist profile
          await agent.updateTouristProfile(profile as TouristProfile);
          console.log('👤 Tourist profile updated');
        } else {
          // It's an artisan profile
          await agent.addArtisanProfile(profile as ArtisanProfile);
          console.log('🎨 Artisan profile added');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      console.error('Profile update error:', err);
    }
  }, [agent]);

  // Get current performance metrics from database
  const [performance, setPerformance] = useState<any>(null);

  useEffect(() => {
    const loadPerformance = async () => {
      if (!agent) return;

      try {
        const { data: performanceData } = await rlDatabaseService.getAgentPerformance(agent.type);
        
        if (performanceData) {
          setPerformance({
            isLearning: performanceData.is_learning,
            experienceCount: performanceData.experience_count,
            performance: {
              culturalScore: performanceData.cultural_score,
              economicScore: performanceData.economic_score,
              satisfactionScore: performanceData.satisfaction_score
            },
            policyVersion: performanceData.policy_version
          });
        } else {
          // Use agent's current performance if no database data
          setPerformance({
            isLearning: agent.isCurrentlyLearning,
            experienceCount: agent.experienceCount,
            performance: agent.currentPerformance,
            policyVersion: agent.policyVersion
          });
        }
      } catch (err) {
        console.error('Error loading performance data:', err);
        // Fallback to agent's current performance
        setPerformance({
          isLearning: agent.isCurrentlyLearning,
          experienceCount: agent.experienceCount,
          performance: agent.currentPerformance,
          policyVersion: agent.policyVersion
        });
      }
    };

    loadPerformance();
    
    // Refresh performance data periodically
    const interval = setInterval(loadPerformance, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [agent]);

  return {
    agent,
    isLearning,
    recommendations,
    recordExperience,
    getRecommendations,
    updateProfile,
    performance,
    isLoading,
    error
  };
}

// Specialized hooks for different agent types
export function useTouristMatchingAgent(options: UseRLAgentOptions = {}) {
  return useRLAgent('tourist-matching', options);
}

export function useArtisanDevelopmentAgent(options: UseRLAgentOptions = {}) {
  return useRLAgent('artisan-development', options);
}

export function useContentCreationAgent(options: UseRLAgentOptions = {}) {
  return useRLAgent('content-creation', options);
}

export function useCulturalValidationAgent(options: UseRLAgentOptions = {}) {
  return useRLAgent('cultural-validation', options);
}

export function useEconomicOptimizationAgent(options: UseRLAgentOptions = {}) {
  return useRLAgent('economic-optimization', options);
} 