// Core RL Types and Interfaces for Morocco Made Real Platform

export interface RLAgent {
  id: string;
  type: AgentType;
  environment: Environment;
  rewardFunction: RewardFunction;
  policy: Policy;
  learn(experience: Experience[]): Promise<void>;
  act(state: State): Promise<Action>;
  evaluate(state: State): Promise<number>;
  getRecommendations(): Promise<Recommendation[]>;
  
  // Additional properties for monitoring and management
  readonly isCurrentlyLearning: boolean;
  readonly experienceCount: number;
  readonly currentPerformance: PerformanceMetrics;
  readonly policyVersion: number;
}

export type AgentType = 
  | 'tourist-matching'
  | 'artisan-development' 
  | 'content-creation'
  | 'cultural-validation'
  | 'economic-optimization';

export interface Environment {
  id: string;
  type: EnvironmentType;
  state: State;
  availableActions: Action[];
  culturalContext: CulturalContext;
  economicContext: EconomicContext;
}

export type EnvironmentType = 
  | 'cultural-tourism'
  | 'artisan-workshop'
  | 'content-creation'
  | 'validation-network'
  | 'economic-ecosystem';

export interface State {
  timestamp: number;
  userId?: string;
  artisanId?: string;
  touristProfile?: TouristProfile;
  artisanProfile?: ArtisanProfile;
  culturalMetrics: CulturalMetrics;
  economicMetrics: EconomicMetrics;
  engagementMetrics: EngagementMetrics;
}

export interface Action {
  id: string;
  type: ActionType;
  parameters: Record<string, any>;
  confidence: number;
  culturalImpact: number;
  economicImpact: number;
}

export type ActionType = 
  | 'recommend-experience'
  | 'suggest-skill-path'
  | 'create-content'
  | 'validate-authenticity'
  | 'optimize-pricing';

export interface Experience {
  state: State;
  action: Action;
  reward: number;
  nextState: State;
  culturalValidation: CulturalValidation;
  economicOutcome: EconomicOutcome;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  confidence: number;
  culturalScore: number;
  economicScore: number;
  artisan?: ArtisanProfile;
  experience?: ExperienceDetails;
  reasoning: string;
  geminiContext?: string;
}

export type RecommendationType = 
  | 'artisan-match'
  | 'experience-suggestion'
  | 'skill-development'
  | 'content-enhancement'
  | 'cultural-validation';

export interface TouristProfile {
  id: string;
  preferences: TouristPreferences;
  experiences: ExperienceHistory[];
  culturalInterests: CulturalInterest[];
  learningStyle: LearningStyle;
  budget: BudgetRange;
  timeAvailable: TimeRange;
}

export interface TouristPreferences {
  crafts: string[];
  regions: string[];
  experienceTypes: ExperienceType[];
  culturalDepth: 'surface' | 'moderate' | 'deep';
  groupSize: 'solo' | 'couple' | 'small-group' | 'large-group';
  languages: string[];
}

export type ExperienceType = 
  | 'hands-on-workshop'
  | 'cultural-immersion'
  | 'historical-tour'
  | 'artisan-meeting'
  | 'technique-learning'
  | 'cultural-exchange';

export interface ArtisanProfile {
  id: string;
  name: string;
  craft: string;
  region: string;
  skillLevel: SkillLevel;
  techniques: Technique[];
  culturalKnowledge: CulturalKnowledge;
  teachingStyle: TeachingStyle;
  availability: Availability;
  economicGoals: EconomicGoals;
}

export type SkillLevel = 'apprentice' | 'journeyman' | 'master' | 'grandmaster';

export interface Technique {
  id: string;
  name: string;
  difficulty: number;
  culturalSignificance: number;
  timeToLearn: number;
  prerequisites: string[];
}

export interface CulturalContext {
  region: string;
  traditions: Tradition[];
  historicalSignificance: number;
  authenticity: AuthenticityMarkers;
  expertValidation: ExpertValidation;
}

export interface CulturalMetrics {
  authenticityScore: number;
  preservationImpact: number;
  culturalRespect: number;
  traditionalAccuracy: number;
  innovationBalance: number;
}

export interface EconomicMetrics {
  artisanIncome: number;
  communityBenefit: number;
  sustainabilityScore: number;
  marketDemand: number;
  priceOptimization: number;
}

export interface EngagementMetrics {
  satisfactionScore: number;
  learningOutcome: number;
  culturalAppreciation: number;
  repeatVisitProbability: number;
  recommendationLikelihood: number;
}

export interface RewardFunction {
  culturalPreservation: (outcome: CulturalOutcome) => number;
  economicSustainability: (outcome: EconomicOutcome) => number;
  touristSatisfaction: (outcome: TouristOutcome) => number;
  expertValidation: (outcome: ExpertOutcome) => number;
  communityImpact: (outcome: CommunityOutcome) => number;
}

export interface Policy {
  id: string;
  version: number;
  parameters: PolicyParameters;
  performance: PerformanceMetrics;
  culturalAlignment: number;
  lastUpdated: Date;
}

export interface PolicyParameters {
  weights: Record<string, number>;
  thresholds: Record<string, number>;
  culturalConstraints: CulturalConstraint[];
  economicConstraints: EconomicConstraint[];
}

export interface PerformanceMetrics {
  averageReward: number;
  culturalScore: number;
  economicScore: number;
  satisfactionScore: number;
  validationScore: number;
}

export interface CulturalValidation {
  score: number;
  expertApproval: boolean;
  communityConsensus: number;
  traditionalAccuracy: number;
  respectLevel: number;
  suggestions: string[];
}

export interface EconomicOutcome {
  artisanRevenue: number;
  communityBenefit: number;
  sustainabilityImpact: number;
  marketResponse: number;
  costEfficiency: number;
}

export interface LearningMilestone {
  id: string;
  agentId: string;
  type: MilestoneType;
  achievement: string;
  culturalImpact: number;
  economicImpact: number;
  timestamp: Date;
  blockchainHash?: string;
}

export type MilestoneType = 
  | 'cultural-preservation'
  | 'economic-optimization'
  | 'satisfaction-improvement'
  | 'validation-accuracy'
  | 'innovation-balance';

export interface GeminiIntegration {
  generateCulturalContext(artisan: ArtisanProfile, craft: string): Promise<string>;
  validateCulturalContent(content: string, context: CulturalContext): Promise<CulturalValidation>;
  enhanceStorytellingContent(content: string, audience: TouristProfile): Promise<string>;
  predictCulturalAcceptance(innovation: Innovation): Promise<AcceptancePrediction>;
}

export interface Innovation {
  id: string;
  artisanId: string;
  description: string;
  traditionalBase: string;
  modernAdaptation: string;
  culturalRisk: number;
  economicPotential: number;
}

export interface AcceptancePrediction {
  culturalScore: number;
  communityAcceptance: number;
  expertApproval: number;
  marketPotential: number;
  recommendations: string[];
}

export interface BlockchainIntegration {
  recordLearningMilestone(milestone: LearningMilestone): Promise<string>;
  validateCulturalProvenance(artisanId: string): Promise<CulturalProvenance>;
  distributeRewards(outcomes: LearningOutcome[]): Promise<RewardDistribution>;
  getCulturalConsensus(validationId: string): Promise<ConsensusResult>;
}

export interface CulturalProvenance {
  artisanId: string;
  validationHistory: ValidationRecord[];
  culturalLineage: CulturalLineage;
  authenticityScore: number;
  blockchainVerification: boolean;
}

export interface RewardDistribution {
  culturalPreservationTokens: number;
  economicSustainabilityTokens: number;
  communityImpactTokens: number;
  innovationTokens: number;
  recipients: RewardRecipient[];
}

export interface RewardRecipient {
  id: string;
  type: 'artisan' | 'expert' | 'content-team' | 'ai-agent';
  amount: number;
  reason: string;
}

// Utility types for RL system
export interface RLConfig {
  learningRate: number;
  discountFactor: number;
  explorationRate: number;
  batchSize: number;
  culturalWeight: number;
  economicWeight: number;
  satisfactionWeight: number;
}

export interface TrainingData {
  experiences: Experience[];
  culturalValidations: CulturalValidation[];
  economicOutcomes: EconomicOutcome[];
  expertFeedback: ExpertFeedback[];
}

export interface ExpertFeedback {
  expertId: string;
  validationId: string;
  score: number;
  comments: string;
  culturalAccuracy: number;
  suggestions: string[];
  timestamp: Date;
}

// Base utility types
export interface EconomicContext {
  marketConditions: MarketConditions;
  pricing: PricingStrategy;
  sustainability: SustainabilityMetrics;
  communityEconomics: CommunityEconomics;
}

export interface MarketConditions {
  demand: number;
  competition: number;
  seasonality: number;
  trends: string[];
}

export interface PricingStrategy {
  basePrice: number;
  premiumMultiplier: number;
  discountThresholds: number[];
  valuePerception: number;
}

export interface SustainabilityMetrics {
  environmentalImpact: number;
  socialBenefit: number;
  economicViability: number;
  culturalPreservation: number;
}

export interface CommunityEconomics {
  averageIncome: number;
  employmentRate: number;
  tourismDependency: number;
  artisanCount: number;
}

export interface ExperienceDetails {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: number;
  culturalDepth: number;
  maxParticipants: number;
  price: number;
  location: string;
  requirements: string[];
}

export interface ExperienceHistory {
  experienceId: string;
  artisanId: string;
  date: Date;
  satisfaction: number;
  culturalLearning: number;
  skillsAcquired: string[];
  feedback: string;
  wouldRecommend: boolean;
}

export interface CulturalInterest {
  category: string;
  level: number;
  specificAreas: string[];
  learningGoals: string[];
}

export interface LearningStyle {
  type: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  pace: 'slow' | 'moderate' | 'fast';
  groupPreference: 'individual' | 'small-group' | 'large-group';
  feedbackStyle: 'immediate' | 'periodic' | 'final';
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
  flexibility: number;
}

export interface TimeRange {
  duration: number;
  unit: 'hours' | 'days' | 'weeks';
  flexibility: number;
  preferredTimes: string[];
}

export interface CulturalKnowledge {
  traditions: KnowledgeArea[];
  history: KnowledgeArea[];
  techniques: KnowledgeArea[];
  stories: KnowledgeArea[];
  languages: string[];
}

export interface KnowledgeArea {
  topic: string;
  depth: number;
  sources: string[];
  verified: boolean;
}

export interface TeachingStyle {
  approach: 'traditional' | 'modern' | 'hybrid';
  patience: number;
  adaptability: number;
  culturalSensitivity: number;
  languageSkills: string[];
}

export interface Availability {
  schedule: TimeSlot[];
  seasonalVariations: SeasonalAvailability[];
  capacity: number;
  advanceBooking: number;
}

export interface TimeSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface SeasonalAvailability {
  season: string;
  availability: number;
  specialEvents: string[];
}

export interface EconomicGoals {
  monthlyTarget: number;
  yearlyTarget: number;
  growthRate: number;
  diversificationGoals: string[];
}

export interface Tradition {
  name: string;
  origin: string;
  significance: number;
  practices: string[];
  preservation: number;
}

export interface AuthenticityMarkers {
  techniques: string[];
  materials: string[];
  patterns: string[];
  stories: string[];
  verification: number;
}

export interface ExpertValidation {
  expertId: string;
  validationDate: Date;
  score: number;
  comments: string;
  recommendations: string[];
}

export interface CulturalConstraint {
  type: string;
  description: string;
  severity: number;
  enforcement: boolean;
}

export interface EconomicConstraint {
  type: string;
  description: string;
  threshold: number;
  penalty: number;
}

export interface CulturalOutcome {
  preservationScore: number;
  authenticityMaintained: boolean;
  knowledgeTransferred: number;
  respectLevel: number;
}

export interface TouristOutcome {
  satisfactionScore: number;
  learningAchieved: number;
  culturalAppreciation: number;
  recommendationLikelihood: number;
}

export interface ExpertOutcome {
  validationAccuracy: number;
  culturalAlignment: number;
  communityAcceptance: number;
  knowledgeContribution: number;
}

export interface CommunityOutcome {
  economicBenefit: number;
  culturalStrengthening: number;
  participationIncrease: number;
  sustainabilityImprovement: number;
}

export interface LearningOutcome {
  agentId: string;
  improvement: number;
  culturalImpact: number;
  economicImpact: number;
  validationScore: number;
}

export interface ValidationRecord {
  id: string;
  date: Date;
  validator: string;
  score: number;
  notes: string;
}

export interface CulturalLineage {
  masterArtisan: string;
  lineage: string[];
  techniques: string[];
  verification: boolean;
}

export interface ConsensusResult {
  consensus: boolean;
  score: number;
  participants: number;
  dissent: number;
} 