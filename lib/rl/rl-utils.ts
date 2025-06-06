// RL Utilities - Default configurations and helper functions
import { 
  Environment, 
  RewardFunction, 
  AgentType,
  EnvironmentType,
  CulturalOutcome,
  EconomicOutcome,
  TouristOutcome,
  ExpertOutcome,
  CommunityOutcome
} from '@/types/rl';
import { v4 as uuidv4 } from 'uuid';

export function createDefaultEnvironment(agentType: AgentType): Environment {
  const environmentType: EnvironmentType = getEnvironmentType(agentType);
  
  return {
    id: uuidv4(),
    type: environmentType,
    state: createDefaultState(),
    availableActions: createDefaultActions(agentType),
    culturalContext: createDefaultCulturalContext(),
    economicContext: createDefaultEconomicContext()
  };
}

export function createDefaultRewardFunction(): RewardFunction {
  return {
    culturalPreservation: (outcome: CulturalOutcome): number => {
      return (
        outcome.preservationScore * 0.4 +
        (outcome.authenticityMaintained ? 0.3 : 0) +
        outcome.knowledgeTransferred * 0.2 +
        outcome.respectLevel * 0.1
      );
    },
    
    economicSustainability: (outcome: EconomicOutcome): number => {
      return (
        outcome.sustainabilityImpact * 0.3 +
        outcome.communityBenefit * 0.3 +
        outcome.artisanRevenue * 0.2 +
        outcome.marketResponse * 0.1 +
        outcome.costEfficiency * 0.1
      );
    },
    
    touristSatisfaction: (outcome: TouristOutcome): number => {
      return (
        outcome.satisfactionScore * 0.4 +
        outcome.culturalAppreciation * 0.3 +
        outcome.learningAchieved * 0.2 +
        outcome.recommendationLikelihood * 0.1
      );
    },
    
    expertValidation: (outcome: ExpertOutcome): number => {
      return (
        outcome.validationAccuracy * 0.3 +
        outcome.culturalAlignment * 0.3 +
        outcome.communityAcceptance * 0.2 +
        outcome.knowledgeContribution * 0.2
      );
    },
    
    communityImpact: (outcome: CommunityOutcome): number => {
      return (
        outcome.economicBenefit * 0.3 +
        outcome.culturalStrengthening * 0.3 +
        outcome.sustainabilityImprovement * 0.2 +
        outcome.participationIncrease * 0.2
      );
    }
  };
}

function getEnvironmentType(agentType: AgentType): EnvironmentType {
  switch (agentType) {
    case 'tourist-matching':
      return 'cultural-tourism';
    case 'artisan-development':
      return 'artisan-workshop';
    case 'content-creation':
      return 'content-creation';
    case 'cultural-validation':
      return 'validation-network';
    case 'economic-optimization':
      return 'economic-ecosystem';
    default:
      return 'cultural-tourism';
  }
}

function createDefaultState() {
  return {
    timestamp: Date.now(),
    culturalMetrics: {
      authenticityScore: 0.8,
      preservationImpact: 0.7,
      culturalRespect: 0.9,
      traditionalAccuracy: 0.8,
      innovationBalance: 0.6
    },
    economicMetrics: {
      artisanIncome: 0.7,
      communityBenefit: 0.6,
      sustainabilityScore: 0.8,
      marketDemand: 0.7,
      priceOptimization: 0.6
    },
    engagementMetrics: {
      satisfactionScore: 0.8,
      learningOutcome: 0.7,
      culturalAppreciation: 0.9,
      repeatVisitProbability: 0.6,
      recommendationLikelihood: 0.8
    }
  };
}

function createDefaultActions(agentType: AgentType) {
  const baseActions = [
    {
      id: uuidv4(),
      type: 'recommend-experience' as const,
      parameters: {},
      confidence: 0.5,
      culturalImpact: 0.5,
      economicImpact: 0.5
    }
  ];

  switch (agentType) {
    case 'tourist-matching':
      return [
        ...baseActions,
        {
          id: uuidv4(),
          type: 'recommend-experience' as const,
          parameters: { experienceType: 'cultural-immersion' },
          confidence: 0.7,
          culturalImpact: 0.8,
          economicImpact: 0.6
        }
      ];
    case 'artisan-development':
      return [
        {
          id: uuidv4(),
          type: 'suggest-skill-path' as const,
          parameters: { skillLevel: 'intermediate' },
          confidence: 0.6,
          culturalImpact: 0.7,
          economicImpact: 0.8
        }
      ];
    case 'content-creation':
      return [
        {
          id: uuidv4(),
          type: 'create-content' as const,
          parameters: { contentType: 'story' },
          confidence: 0.6,
          culturalImpact: 0.8,
          economicImpact: 0.5
        }
      ];
    case 'cultural-validation':
      return [
        {
          id: uuidv4(),
          type: 'validate-authenticity' as const,
          parameters: { validationType: 'technique' },
          confidence: 0.8,
          culturalImpact: 0.9,
          economicImpact: 0.4
        }
      ];
    case 'economic-optimization':
      return [
        {
          id: uuidv4(),
          type: 'optimize-pricing' as const,
          parameters: { strategy: 'value-based' },
          confidence: 0.7,
          culturalImpact: 0.3,
          economicImpact: 0.9
        }
      ];
    default:
      return baseActions;
  }
}

function createDefaultCulturalContext() {
  return {
    region: 'Morocco',
    traditions: [
      {
        name: 'Traditional Pottery',
        origin: 'Fez',
        significance: 0.9,
        practices: ['Blue glazing', 'Hand throwing', 'Traditional firing'],
        preservation: 0.8
      }
    ],
    historicalSignificance: 0.9,
    authenticity: {
      techniques: ['Traditional hand methods', 'Natural materials'],
      materials: ['Local clay', 'Natural pigments'],
      patterns: ['Geometric designs', 'Calligraphy'],
      stories: ['Historical narratives', 'Cultural legends'],
      verification: 0.9
    },
    expertValidation: {
      expertId: 'default-expert',
      validationDate: new Date(),
      score: 0.8,
      comments: 'Culturally authentic approach',
      recommendations: ['Maintain traditional methods', 'Document techniques']
    }
  };
}

function createDefaultEconomicContext() {
  return {
    marketConditions: {
      demand: 0.7,
      competition: 0.5,
      seasonality: 0.6,
      trends: ['Cultural tourism growth', 'Authentic experiences demand']
    },
    pricing: {
      basePrice: 100,
      premiumMultiplier: 1.5,
      discountThresholds: [0.1, 0.2, 0.3],
      valuePerception: 0.8
    },
    sustainability: {
      environmentalImpact: 0.8,
      socialBenefit: 0.9,
      economicViability: 0.7,
      culturalPreservation: 0.9
    },
    communityEconomics: {
      averageIncome: 500,
      employmentRate: 0.7,
      tourismDependency: 0.6,
      artisanCount: 150
    }
  };
} 