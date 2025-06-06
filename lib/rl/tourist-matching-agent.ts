// Tourist Matching Agent - Real Database Integration
import { BaseRLAgent } from './base-agent';
import { 
  State, 
  Action, 
  Experience, 
  Recommendation,
  TouristProfile,
  ArtisanProfile,
  Environment,
  RewardFunction,
  RLConfig
} from '@/types/rl';
import { rlDatabaseService } from '../rl-database-service';

export class TouristMatchingAgent extends BaseRLAgent {
  private touristProfiles: Map<string, TouristProfile> = new Map();
  private artisanProfiles: Map<string, ArtisanProfile> = new Map();
  private matchingHistory: Map<string, MatchingRecord[]> = new Map();

  constructor(
    environment: Environment,
    rewardFunction: RewardFunction,
    config: RLConfig
  ) {
    super('tourist-matching', environment, rewardFunction, config);
    this.initializeFromDatabase();
  }

  // Initialize agent with data from database
  private async initializeFromDatabase(): Promise<void> {
    try {
      // Load existing artisan profiles
      const { data: artisanProfiles } = await rlDatabaseService.getArtisanProfiles();
      if (artisanProfiles) {
        artisanProfiles.forEach(dbProfile => {
          const profile = this.convertDbToArtisanProfile(dbProfile);
          this.artisanProfiles.set(profile.id, profile);
        });
      }

      // Load existing experiences for learning
      const { data: experiences } = await rlDatabaseService.getExperiences(this.type, 50);
      if (experiences && experiences.length > 0) {
        const convertedExperiences = experiences.map(exp => this.convertDbToExperience(exp));
        await this.learn(convertedExperiences);
      }

      console.log(`🧠 Tourist Matching Agent initialized with ${artisanProfiles?.length || 0} artisans and ${experiences?.length || 0} experiences`);
    } catch (error) {
      console.error('Error initializing agent from database:', error);
    }
  }

  async getRecommendations(): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    
    for (const [touristId, tourist] of this.touristProfiles) {
      try {
        // Check for existing recommendations in database first
        const { data: dbRecommendations } = await rlDatabaseService.getRecommendations(touristId, 5);
        
        if (dbRecommendations && dbRecommendations.length > 0) {
          // Convert database recommendations to our format
          const convertedRecs = dbRecommendations.map(dbRec => this.convertDbToRecommendation(dbRec));
          recommendations.push(...convertedRecs);
        } else {
          // Generate new recommendations
          const newRecommendations = await this.generateTouristRecommendations(tourist);
          
          // Save new recommendations to database
          for (const rec of newRecommendations) {
            await rlDatabaseService.saveRecommendation(rec, this.type);
          }
          
          recommendations.push(...newRecommendations);
        }
      } catch (error) {
        console.error(`Error getting recommendations for tourist ${touristId}:`, error);
        // Fallback to generating recommendations without database
        const fallbackRecs = await this.generateTouristRecommendations(tourist);
        recommendations.push(...fallbackRecs);
      }
    }

    return recommendations;
  }

  private async generateTouristRecommendations(tourist: TouristProfile): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    
    for (const [artisanId, artisan] of this.artisanProfiles) {
      const matchScore = await this.calculateMatchScore(tourist, artisan);
      
      if (matchScore > 0.6) { // Only recommend if match score is above threshold
        const culturalScore = await this.calculateCulturalScore(tourist, artisan);
        const economicScore = await this.calculateEconomicScore(tourist, artisan);
        
        const recommendation: Recommendation = {
          id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'artisan-match',
          artisan,
          confidence: matchScore,
          culturalScore,
          economicScore,
          reasoning: this.generateMatchingReasoning(tourist, artisan, matchScore),
          experience: {
            id: `exp_${Date.now()}`,
            title: `${artisan.craft} Experience with ${artisan.name}`,
            description: `Learn traditional ${artisan.craft} techniques from master artisan ${artisan.name} in ${artisan.region}`,
            duration: this.calculateOptimalDuration(tourist, artisan),
            difficulty: artisan.techniques.reduce((sum, tech) => sum + tech.difficulty, 0) / artisan.techniques.length,
            culturalDepth: this.encodeCulturalDepth(tourist.preferences.culturalDepth),
            maxParticipants: artisan.availability.capacity,
            price: this.estimateExperienceCost(tourist, artisan),
            location: artisan.region,
            requirements: [`Interest in ${artisan.craft}`, 'Basic cultural respect']
          }
        };

        recommendations.push(recommendation);
      }
    }

    // Sort by overall score and return top 5
    return recommendations
      .sort((a, b) => (b.confidence + b.culturalScore + b.economicScore) - (a.confidence + a.culturalScore + a.economicScore))
      .slice(0, 5);
  }

  protected async selectAction(state: State): Promise<Action> {
    // Use the current policy to select the best action
    const touristProfile = state.touristProfile;
    const artisanProfile = state.artisanProfile;
    
    if (!touristProfile || !artisanProfile) {
      throw new Error('Invalid state: missing tourist or artisan profile');
    }

    const matchScore = await this.calculateMatchScore(touristProfile, artisanProfile);
    
    return {
      id: `action_${Date.now()}`,
      type: 'recommend-experience',
      parameters: {
        recommendationId: `rec_${Date.now()}`,
        matchScore,
        experienceType: this.selectOptimalExperienceType(touristProfile, artisanProfile)
      },
      confidence: matchScore,
      culturalImpact: await this.calculateCulturalScore(touristProfile, artisanProfile),
      economicImpact: await this.calculateEconomicScore(touristProfile, artisanProfile)
    };
  }

  protected async updatePolicy(experiences: Experience[]): Promise<void> {
    // Update preference weights based on successful experiences
    await this.updatePreferenceWeights(experiences);
    
    // Update cultural parameters
    await this.updateCulturalParameters(experiences);
    
    // Update economic parameters
    await this.updateEconomicParameters(experiences);
    
    // Learn from expert feedback
    await this.learnFromExpertFeedback(experiences);

    // Update performance metrics in database
    const performance = {
      experienceCount: this.experienceCount,
      culturalScore: this.currentPerformance.culturalScore,
      economicScore: this.currentPerformance.economicScore,
      satisfactionScore: this.currentPerformance.satisfactionScore,
      policyVersion: this.policyVersion,
      isLearning: this.isCurrentlyLearning,
      config: this.config
    };

    await rlDatabaseService.updateAgentPerformance(this.type, performance);
  }

  // Override learn method to save experiences to database
  async learn(experiences: Experience[]): Promise<void> {
    // Save experiences to database
    for (const experience of experiences) {
      await rlDatabaseService.recordExperience(experience);
    }

    // Call parent learn method
    await super.learn(experiences);
  }

  public async addTouristProfile(profile: TouristProfile): Promise<void> {
    this.touristProfiles.set(profile.id, profile);
    
    // Save to database
    await rlDatabaseService.createTouristProfile(profile);
  }

  public async updateTouristProfile(profile: TouristProfile): Promise<void> {
    this.touristProfiles.set(profile.id, profile);
    
    // Update in database
    await rlDatabaseService.updateTouristProfile(profile);
  }

  public async addArtisanProfile(profile: ArtisanProfile): Promise<void> {
    this.artisanProfiles.set(profile.id, profile);
    
    // Save to database
    await rlDatabaseService.createArtisanProfile(profile);
  }

  // Database conversion methods
  private convertDbToArtisanProfile(dbProfile: any): ArtisanProfile {
    return {
      id: dbProfile.artisan_id,
      name: dbProfile.name,
      craft: dbProfile.craft,
      region: dbProfile.region,
      skillLevel: dbProfile.skill_level,
      techniques: dbProfile.techniques || [],
      culturalKnowledge: dbProfile.cultural_knowledge || {},
      teachingStyle: {
        approach: dbProfile.teaching_approach,
        patience: dbProfile.patience_level,
        adaptability: dbProfile.adaptability,
        culturalSensitivity: dbProfile.cultural_sensitivity,
        languageSkills: dbProfile.language_skills || []
      },
      availability: dbProfile.availability || {},
      economicGoals: {
        monthlyTarget: dbProfile.monthly_target,
        yearlyTarget: dbProfile.yearly_target,
        growthRate: dbProfile.growth_rate,
        diversificationGoals: dbProfile.diversification_goals || []
      }
    };
  }

  private convertDbToExperience(dbExp: any): Experience {
    return {
      state: dbExp.state_data,
      action: dbExp.action_data,
      reward: dbExp.reward,
      nextState: dbExp.next_state_data,
      culturalValidation: dbExp.cultural_validation || {},
      economicOutcome: dbExp.economic_outcome || {}
    };
  }

  private convertDbToRecommendation(dbRec: any): Recommendation {
    return {
      id: dbRec.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'artisan-match',
      artisan: this.artisanProfiles.get(dbRec.artisan_profile_id),
      confidence: dbRec.confidence,
      culturalScore: dbRec.cultural_score,
      economicScore: dbRec.economic_score,
      reasoning: dbRec.reasoning,
      experience: {
        id: `exp_${dbRec.id || Date.now()}`,
        title: `Experience with ${this.artisanProfiles.get(dbRec.artisan_profile_id)?.name || 'Artisan'}`,
        description: dbRec.cultural_context || 'Traditional craft experience',
        duration: dbRec.estimated_duration,
        difficulty: 0.5, // Default difficulty
        culturalDepth: 0.7, // Default cultural depth
        maxParticipants: 4, // Default max participants
        price: dbRec.estimated_cost,
        location: this.artisanProfiles.get(dbRec.artisan_profile_id)?.region || 'Morocco',
        requirements: ['Basic interest in traditional crafts']
      }
    };
  }

  // Core matching algorithms
  private async calculateMatchScore(tourist: TouristProfile, artisan: ArtisanProfile): Promise<number> {
    // Weighted scoring algorithm
    const craftAlignment = this.calculateCraftAlignment(tourist, artisan);
    const regionAlignment = this.calculateRegionAlignment(tourist, artisan);
    const experienceAlignment = this.calculateExperienceAlignment(tourist, artisan);
    const learningAlignment = this.calculateLearningAlignment(tourist, artisan);
    const historicalSuccess = await this.getHistoricalSuccessRate(tourist, artisan);

    // Apply policy weights
    const weights = this.policy.parameters.weights;
    const score = (
      craftAlignment * (weights.craftWeight || 0.3) +
      regionAlignment * (weights.regionWeight || 0.2) +
      experienceAlignment * (weights.experienceWeight || 0.25) +
      learningAlignment * (weights.learningWeight || 0.15) +
      historicalSuccess * (weights.historyWeight || 0.1)
    );

    return Math.min(Math.max(score, 0), 1); // Clamp between 0 and 1
  }

  private calculateCraftAlignment(tourist: TouristProfile, artisan: ArtisanProfile): number {
    return tourist.preferences.crafts.includes(artisan.craft) ? 1.0 : 0.3;
  }

  private calculateRegionAlignment(tourist: TouristProfile, artisan: ArtisanProfile): number {
    return tourist.preferences.regions.includes(artisan.region) ? 1.0 : 0.5;
  }

  private calculateExperienceAlignment(tourist: TouristProfile, artisan: ArtisanProfile): number {
    const preferredTypes = tourist.preferences.experienceTypes;
    
    // Check if artisan's teaching style matches preferred experience types
    let alignment = 0.5; // Base alignment
    
    if (preferredTypes.includes('hands-on-workshop') && artisan.teachingStyle.approach !== 'modern') {
      alignment += 0.3;
    }
    
    if (preferredTypes.includes('cultural-immersion') && artisan.culturalKnowledge.traditions.length > 2) {
      alignment += 0.2;
    }
    
    if (preferredTypes.includes('technique-learning') && artisan.skillLevel === 'master') {
      alignment += 0.3;
    }
    
    return Math.min(alignment, 1.0);
  }

  private calculateLearningAlignment(tourist: TouristProfile, artisan: ArtisanProfile): number {
    let alignment = 0.5; // Base alignment
    
    // Learning style compatibility
    if (tourist.learningStyle.type === 'kinesthetic' && artisan.teachingStyle.approach === 'traditional') {
      alignment += 0.2;
    }
    
    if (tourist.learningStyle.type === 'visual' && artisan.techniques.some(t => t.difficulty > 0.7)) {
      alignment += 0.1;
    }
    
    // Group preference alignment
    const groupSize = this.getGroupSize(tourist.preferences.groupSize);
    if (artisan.availability.capacity >= groupSize) {
      alignment += 0.2;
    }
    
    // Language compatibility
    const commonLanguages = tourist.preferences.languages.filter(lang => 
      artisan.teachingStyle.languageSkills.includes(lang)
    );
    if (commonLanguages.length > 0) {
      alignment += 0.1;
    }
    
    return Math.min(alignment, 1.0);
  }

  private async getHistoricalSuccessRate(tourist: TouristProfile, artisan: ArtisanProfile): Promise<number> {
    const history = this.matchingHistory.get(tourist.id) || [];
    const artisanHistory = history.filter(record => record.artisanId === artisan.id);
    
    if (artisanHistory.length === 0) {
      return 0.5; // Neutral score for no history
    }
    
    const averageSatisfaction = artisanHistory.reduce((sum, record) => sum + record.satisfaction, 0) / artisanHistory.length;
    return averageSatisfaction;
  }

  private async calculateCulturalScore(tourist: TouristProfile, artisan: ArtisanProfile): Promise<number> {
    let score = 0.5; // Base cultural score
    
    // Cultural depth alignment
    const depthScore = this.calculateCulturalDepthScore(tourist, artisan);
    score += depthScore * 0.4;
    
    // Artisan's cultural knowledge depth
    const knowledgeDepth = artisan.culturalKnowledge.traditions.length * 0.1 +
                          artisan.culturalKnowledge.history.length * 0.1 +
                          artisan.culturalKnowledge.techniques.length * 0.1;
    score += Math.min(knowledgeDepth, 0.3);
    
    // Cultural sensitivity
    score += artisan.teachingStyle.culturalSensitivity * 0.3;
    
    return Math.min(score, 1.0);
  }

  private calculateCulturalDepthScore(tourist: TouristProfile, artisan: ArtisanProfile): number {
    const touristDepth = this.encodeCulturalDepth(tourist.preferences.culturalDepth);
    const artisanDepth = artisan.culturalKnowledge.traditions.length + 
                        artisan.culturalKnowledge.history.length;
    
    // Score based on how well artisan's knowledge matches tourist's desired depth
    if (touristDepth === 1 && artisanDepth >= 2) return 0.8; // Surface seeker with knowledgeable artisan
    if (touristDepth === 2 && artisanDepth >= 3) return 1.0; // Moderate seeker with good knowledge
    if (touristDepth === 3 && artisanDepth >= 5) return 1.0; // Deep seeker with extensive knowledge
    
    return 0.5; // Default moderate score
  }

  private async calculateEconomicScore(tourist: TouristProfile, artisan: ArtisanProfile): Promise<number> {
    const budgetCompatibility = this.calculateBudgetCompatibility(tourist, artisan);
    const economicImpact = this.calculateEconomicImpact(tourist, artisan);
    
    return (budgetCompatibility * 0.6 + economicImpact * 0.4);
  }

  private calculateBudgetCompatibility(tourist: TouristProfile, artisan: ArtisanProfile): number {
    const estimatedCost = this.estimateExperienceCost(tourist, artisan);
    const budgetRange = tourist.budget.max - tourist.budget.min;
    const flexibility = tourist.budget.flexibility;
    
    if (estimatedCost <= tourist.budget.max) {
      return 1.0;
    } else if (estimatedCost <= tourist.budget.max * (1 + flexibility)) {
      return 0.7;
    } else {
      return 0.3;
    }
  }

  private calculateEconomicImpact(tourist: TouristProfile, artisan: ArtisanProfile): number {
    // Calculate positive economic impact for the artisan and community
    const groupSize = this.getGroupSize(tourist.preferences.groupSize);
    const baseImpact = groupSize * 0.2;
    
    // Bonus for supporting traditional crafts
    const traditionalBonus = artisan.teachingStyle.approach === 'traditional' ? 0.2 : 0.1;
    
    return Math.min(baseImpact + traditionalBonus, 1.0);
  }

  private estimateExperienceCost(tourist: TouristProfile, artisan: ArtisanProfile): number {
    const baseCost = 150; // Base cost in USD
    const groupSize = this.getGroupSize(tourist.preferences.groupSize);
    const skillMultiplier = artisan.skillLevel === 'master' ? 1.5 : 1.2;
    const durationMultiplier = tourist.timeAvailable.duration / 3; // Normalize to 3-hour base
    
    return baseCost * skillMultiplier * durationMultiplier * groupSize;
  }

  private getGroupSize(groupPreference: string): number {
    switch (groupPreference) {
      case 'solo': return 1;
      case 'couple': return 2;
      case 'small-group': return 4;
      case 'large-group': return 8;
      default: return 2;
    }
  }

  // Helper methods
  private createPreferenceVector(tourist: TouristProfile): number[] {
    return [
      tourist.preferences.crafts.length,
      tourist.preferences.regions.length,
      this.encodeCulturalDepth(tourist.preferences.culturalDepth),
      this.encodeGroupSize(tourist.preferences.groupSize),
      tourist.timeAvailable.duration
    ];
  }

  private encodeCulturalDepth(depth: string): number {
    switch (depth) {
      case 'surface': return 1;
      case 'moderate': return 2;
      case 'deep': return 3;
      default: return 2;
    }
  }

  private encodeGroupSize(size: string): number {
    return this.getGroupSize(size);
  }

  private generateMatchingReasoning(tourist: TouristProfile, artisan: ArtisanProfile, score: number): string {
    const reasons = [];
    
    if (tourist.preferences.crafts.includes(artisan.craft)) {
      reasons.push(`Perfect craft match: ${artisan.craft}`);
    }
    
    if (tourist.preferences.regions.includes(artisan.region)) {
      reasons.push(`Regional preference: ${artisan.region}`);
    }
    
    if (artisan.skillLevel === 'master' || artisan.skillLevel === 'grandmaster') {
      reasons.push(`Expert level artisan: ${artisan.skillLevel}`);
    }
    
    if (score > 0.8) {
      reasons.push('Exceptional compatibility based on learning history');
    }
    
    return reasons.join('. ') || 'Good overall compatibility based on preferences and availability.';
  }

  private selectOptimalExperienceType(tourist: TouristProfile, artisan: ArtisanProfile): string {
    // Select the best experience type based on preferences and artisan capabilities
    const preferences = tourist.preferences.experienceTypes;
    
    if (preferences.includes('hands-on-workshop') && artisan.teachingStyle.approach !== 'modern') {
      return 'hands-on-workshop';
    }
    
    if (preferences.includes('cultural-immersion') && artisan.culturalKnowledge.traditions.length > 3) {
      return 'cultural-immersion';
    }
    
    if (preferences.includes('technique-learning') && artisan.skillLevel === 'master') {
      return 'technique-learning';
    }
    
    return preferences[0] || 'artisan-meeting';
  }

  private calculateOptimalDuration(tourist: TouristProfile, artisan: ArtisanProfile): number {
    const availableTime = tourist.timeAvailable.duration;
    const complexity = artisan.techniques.reduce((sum, tech) => sum + tech.difficulty, 0) / artisan.techniques.length;
    
    // Adjust duration based on complexity and tourist's cultural depth preference
    let optimalDuration = availableTime;
    
    if (tourist.preferences.culturalDepth === 'deep' && complexity > 0.7) {
      optimalDuration = Math.min(availableTime, availableTime * 1.2);
    } else if (tourist.preferences.culturalDepth === 'surface') {
      optimalDuration = Math.min(availableTime, availableTime * 0.8);
    }
    
    return Math.max(optimalDuration, 2); // Minimum 2 hours
  }

  // Learning and adaptation methods
  private async updatePreferenceWeights(successfulExperiences: Experience[]): Promise<void> {
    // Analyze patterns in successful matches to update preference weights
    const patterns = this.analyzeSuccessPatterns(successfulExperiences);
    
    // Update policy parameters based on patterns
    Object.keys(patterns).forEach(key => {
      if (this.policy.parameters.weights[key]) {
        this.policy.parameters.weights[key] *= (1 + patterns[key] * 0.1);
      }
    });
  }

  private analyzeSuccessPatterns(experiences: Experience[]): Record<string, number> {
    // Analyze what factors contributed most to successful experiences
    const patterns: Record<string, number> = {};
    
    experiences.forEach(exp => {
      if (exp.culturalValidation.score > 0.8) {
        patterns['cultural'] = (patterns['cultural'] || 0) + 0.1;
      }
      if (exp.economicOutcome.artisanRevenue > exp.economicOutcome.costEfficiency) {
        patterns['economic'] = (patterns['economic'] || 0) + 0.1;
      }
      if (exp.nextState.engagementMetrics.satisfactionScore > 0.8) {
        patterns['satisfaction'] = (patterns['satisfaction'] || 0) + 0.1;
      }
    });
    
    return patterns;
  }

  private async updateCulturalParameters(experiences: Experience[]): Promise<void> {
    // Update cultural sensitivity and authenticity parameters
    const culturalScores = experiences.map(exp => exp.culturalValidation.score);
    const averageCulturalScore = culturalScores.reduce((sum, score) => sum + score, 0) / culturalScores.length;
    
    if (averageCulturalScore < 0.7) {
      // Increase cultural weight if cultural scores are low
      this.policy.parameters.thresholds.minCulturalScore = Math.min(
        this.policy.parameters.thresholds.minCulturalScore + 0.05,
        0.9
      );
    }
  }

  private async updateEconomicParameters(experiences: Experience[]): Promise<void> {
    // Update economic optimization parameters
    const economicScores = experiences.map(exp => exp.economicOutcome.sustainabilityImpact);
    const averageEconomicScore = economicScores.reduce((sum, score) => sum + score, 0) / economicScores.length;
    
    if (averageEconomicScore < 0.6) {
      this.policy.parameters.thresholds.minEconomicScore = Math.min(
        this.policy.parameters.thresholds.minEconomicScore + 0.05,
        0.8
      );
    }
  }

  private async learnFromExpertFeedback(experiences: Experience[]): Promise<void> {
    // Learn from expert validation patterns
    const expertApprovals = experiences.filter(exp => exp.culturalValidation.expertApproval);
    const expertRejections = experiences.filter(exp => !exp.culturalValidation.expertApproval);
    
    // Adjust cultural alignment based on expert feedback
    if (expertRejections.length > expertApprovals.length) {
      this.policy.culturalAlignment = Math.max(this.policy.culturalAlignment - 0.05, 0.5);
    } else {
      this.policy.culturalAlignment = Math.min(this.policy.culturalAlignment + 0.02, 1.0);
    }
  }

  // Record matching results for learning
  public recordMatchingResult(
    touristId: string,
    artisanId: string,
    satisfaction: number,
    culturalLearning: number,
    economicImpact: number
  ): void {
    const record: MatchingRecord = {
      touristId,
      artisanId,
      satisfaction,
      culturalLearning,
      economicImpact,
      timestamp: new Date()
    };
    
    const history = this.matchingHistory.get(touristId) || [];
    history.push(record);
    this.matchingHistory.set(touristId, history);
  }

  private async calculateCulturalAlignment(tourist: TouristProfile, artisan: ArtisanProfile): Promise<number> {
    // Calculate how well the tourist's cultural interests align with the artisan's cultural knowledge
    const culturalScore = await this.calculateCulturalScore(tourist, artisan);
    const craftAlignment = this.calculateCraftAlignment(tourist, artisan);
    const regionAlignment = this.calculateRegionAlignment(tourist, artisan);
    
    return (culturalScore * 0.5 + craftAlignment * 0.3 + regionAlignment * 0.2);
  }

  private async calculateEconomicViability(tourist: TouristProfile, artisan: ArtisanProfile): Promise<number> {
    // Calculate the economic viability of the match
    const economicScore = await this.calculateEconomicScore(tourist, artisan);
    const budgetCompatibility = this.calculateBudgetCompatibility(tourist, artisan);
    const economicImpact = this.calculateEconomicImpact(tourist, artisan);
    
    return (economicScore * 0.4 + budgetCompatibility * 0.4 + economicImpact * 0.2);
  }
}

interface MatchingRecord {
  touristId: string;
  artisanId: string;
  satisfaction: number;
  culturalLearning: number;
  economicImpact: number;
  timestamp: Date;
} 