/**
 * Adaptive Matching Service - LLM-Style Memory for Cultural Experience Matching
 * Learns user preferences implicitly through interactions without extensive data collection
 */

export interface UserInteraction {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: string;
  type: 'swipe_right' | 'swipe_left' | 'match_celebration' | 'booking_intent' | 'experience_view' | 'price_reaction' | 'time_spent';
  experienceId: string;
  context: InteractionContext;
  metadata: Record<string, any>;
}

export interface InteractionContext {
  // Experience details at time of interaction
  craft: string;
  location: string;
  price: number;
  duration: string;
  artisan_age: number;
  experience_styles: string[];
  quick_moods: string[];
  tags: string[];
  
  // User context
  time_of_day: string;
  day_of_week: string;
  sequence_position: number; // Position in swipe sequence
  previous_swipes: string[]; // Last 5 swipe directions
  session_duration: number; // How long in current session
}

export interface UserContext {
  userId: string;
  sessionId: string;
  
  // Implicit preferences learned from behavior
  preferences: {
    craft_affinity: Record<string, number>; // Learned craft preferences (-1 to 1)
    price_sensitivity: number; // Learned price tolerance
    experience_style_preference: Record<string, number>;
    mood_alignment: Record<string, number>;
    location_preference: Record<string, number>;
    artisan_age_preference: { min: number; max: number; strength: number };
    duration_preference: Record<string, number>;
    tag_resonance: Record<string, number>;
  };
  
  // Behavioral patterns
  patterns: {
    swipe_velocity: number; // How quickly they swipe
    decision_confidence: number; // How consistent their choices are
    exploration_vs_exploitation: number; // Do they try new things or stick to preferences?
    time_of_day_activity: Record<string, number>;
    session_engagement: number; // How long they typically browse
  };
  
  // Memory-like context (similar to LLM conversation history)
  conversationMemory: ConversationMemory[];
  
  // Current session state
  currentSession: {
    start_time: string;
    interactions_count: number;
    current_mood: string;
    energy_level: number; // High energy = more adventurous choices
    focus_areas: string[]; // What they seem focused on this session
  };
}

export interface ConversationMemory {
  timestamp: string;
  type: 'preference_signal' | 'behavior_pattern' | 'contextual_insight';
  content: string;
  confidence: number;
  relevance_decay: number; // How much this memory fades over time
  related_experiences: string[];
}

export interface MatchPrediction {
  experienceId: string;
  confidence: number;
  reasoning: MatchReasoning;
  contextual_prompt: string; // LLM-style explanation
  adaptation_signals: string[]; // What we're learning from this prediction
}

export interface MatchReasoning {
  preference_alignment: number;
  behavioral_fit: number;
  contextual_relevance: number;
  novelty_factor: number;
  confidence_factors: string[];
  uncertainty_areas: string[];
}

class AdaptiveMatchingService {
  private readonly MEMORY_RETENTION_DAYS = 30;
  private readonly MAX_CONVERSATION_MEMORY = 50;
  private readonly CONFIDENCE_THRESHOLD = 0.7;

  // Initialize minimal user context (like starting a conversation)
  async initializeUserContext(userId: string, sessionId: string): Promise<UserContext> {
    const existingContext = await this.loadUserContext(userId);
    
    if (existingContext) {
      // Continue existing "conversation"
      const updatedContext = {
        ...existingContext,
        sessionId,
        currentSession: {
          start_time: new Date().toISOString(),
          interactions_count: 0,
          current_mood: this.inferCurrentMood(existingContext),
          energy_level: this.inferEnergyLevel(existingContext),
          focus_areas: this.inferFocusAreas(existingContext)
        }
      };
      
      // Save the updated context
      await this.saveUserContext(updatedContext);
      return updatedContext;
    }

    // Start fresh "conversation"
    const newContext: UserContext = {
      userId,
      sessionId,
      preferences: {
        craft_affinity: {},
        price_sensitivity: 0.5, // Neutral starting point
        experience_style_preference: {},
        mood_alignment: {},
        location_preference: {},
        artisan_age_preference: { min: 20, max: 80, strength: 0 },
        duration_preference: {},
        tag_resonance: {}
      },
      patterns: {
        swipe_velocity: 0.5,
        decision_confidence: 0.5,
        exploration_vs_exploitation: 0.5,
        time_of_day_activity: {},
        session_engagement: 0.5
      },
      conversationMemory: [],
      currentSession: {
        start_time: new Date().toISOString(),
        interactions_count: 0,
        current_mood: 'neutral',
        energy_level: 0.7, // Assume good energy to start
        focus_areas: []
      }
    };

    // Save the new context to localStorage
    await this.saveUserContext(newContext);
    return newContext;
  }

  // Record interaction and update context (like adding to conversation history)
  async recordInteraction(interaction: UserInteraction): Promise<UserContext> {
    const context = await this.loadUserContext(interaction.userId);
    if (!context) throw new Error('User context not found');

    // Update interaction count
    context.currentSession.interactions_count++;

    // Learn from this interaction
    await this.learnFromInteraction(context, interaction);

    // Update conversation memory
    await this.updateConversationMemory(context, interaction);

    // Save updated context
    await this.saveUserContext(context);

    return context;
  }

  // Generate contextual matches (like LLM generating responses based on conversation)
  async generateContextualMatches(
    userId: string, 
    availableExperiences: any[], 
    count: number = 10
  ): Promise<MatchPrediction[]> {
    try {
      const context = await this.loadUserContext(userId);
      
      if (!context) {
        console.warn(`User context not found for userId: ${userId}. Initializing new context.`);
        // Try to initialize a new context if none exists
        const newContext = await this.initializeUserContext(userId, `fallback_session_${Date.now()}`);
        if (!newContext) {
          throw new Error(`Failed to initialize user context for userId: ${userId}`);
        }
        // Use the newly created context
        return this.generateMatchesWithContext(newContext, availableExperiences, count);
      }

      return this.generateMatchesWithContext(context, availableExperiences, count);
    } catch (error) {
      console.error('Error in generateContextualMatches:', error);
      // Fallback to basic matching if everything fails
      return this.generateFallbackMatches(availableExperiences, count);
    }
  }

  // Helper method to generate matches with a valid context
  private async generateMatchesWithContext(
    context: UserContext,
    availableExperiences: any[],
    count: number
  ): Promise<MatchPrediction[]> {
    // Build contextual prompt (like LLM context window)
    const contextualPrompt = await this.buildContextualPrompt(context);

    // Score and rank experiences
    const scoredExperiences = await Promise.all(
      availableExperiences.map(exp => this.scoreExperience(exp, context, contextualPrompt))
    );

    // Sort by confidence and return top matches
    return scoredExperiences
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, count);
  }

  // Fallback matching when context is unavailable
  private generateFallbackMatches(availableExperiences: any[], count: number): MatchPrediction[] {
    console.warn('Using fallback matching - no user context available');
    
    return availableExperiences.slice(0, count).map((experience, index) => ({
      experienceId: experience.id,
      confidence: 0.5 + (Math.random() * 0.3), // Random confidence between 0.5-0.8
      reasoning: {
        preference_alignment: 0.5,
        behavioral_fit: 0.5,
        contextual_relevance: 0.5,
        novelty_factor: 0.8, // High novelty for new users
        confidence_factors: ['Fallback matching - exploring new experiences'],
        uncertainty_areas: ['No user preference data available']
      },
      contextual_prompt: 'Since you\'re new, we\'re showing you a variety of authentic Moroccan experiences to help discover your interests.',
      adaptation_signals: [
        'Learn initial preferences',
        'Establish baseline interests',
        'Track engagement patterns'
      ]
    }));
  }

  // Build LLM-style contextual prompt from user history
  private async buildContextualPrompt(context: UserContext): Promise<string> {
    const recentMemory = context.conversationMemory
      .filter(m => m.relevance_decay > 0.3)
      .slice(-10)
      .map(m => m.content)
      .join('\n');

    const currentPreferences = Object.entries(context.preferences.craft_affinity)
      .filter(([_, score]) => Math.abs(score) > 0.3)
      .map(([craft, score]) => `${craft}: ${score > 0 ? 'likes' : 'dislikes'}`)
      .join(', ');

    const behaviorPattern = this.describeBehaviorPattern(context);
    const sessionContext = this.describeSessionContext(context);

    return `
User Context for Cultural Experience Matching:

RECENT INTERACTIONS:
${recentMemory || 'New user, no previous interactions'}

LEARNED PREFERENCES:
${currentPreferences || 'Still learning preferences'}

BEHAVIOR PATTERN:
${behaviorPattern}

CURRENT SESSION:
${sessionContext}

Based on this context, recommend cultural experiences that would resonate with this user's journey.
    `.trim();
  }

  // Score experience against user context
  private async scoreExperience(
    experience: any, 
    context: UserContext, 
    contextualPrompt: string
  ): Promise<MatchPrediction> {
    const reasoning: MatchReasoning = {
      preference_alignment: this.calculatePreferenceAlignment(experience, context),
      behavioral_fit: this.calculateBehavioralFit(experience, context),
      contextual_relevance: this.calculateContextualRelevance(experience, context),
      novelty_factor: this.calculateNoveltyFactor(experience, context),
      confidence_factors: [],
      uncertainty_areas: []
    };

    // Calculate overall confidence
    const confidence = (
      reasoning.preference_alignment * 0.4 +
      reasoning.behavioral_fit * 0.3 +
      reasoning.contextual_relevance * 0.2 +
      reasoning.novelty_factor * 0.1
    );

    // Generate adaptation signals (what we'll learn from user's response)
    const adaptation_signals = this.generateAdaptationSignals(experience, context);

    return {
      experienceId: experience.id,
      confidence,
      reasoning,
      contextual_prompt: this.generateExperienceExplanation(experience, context, reasoning),
      adaptation_signals
    };
  }

  // Learn from user interaction (like LLM learning from feedback)
  private async learnFromInteraction(context: UserContext, interaction: UserInteraction): Promise<void> {
    const { type, context: interactionContext } = interaction;
    const learningRate = this.calculateLearningRate(context, interaction);

    switch (type) {
      case 'swipe_right':
        // Positive signal - increase preferences for this experience's attributes
        this.adjustPreference(context.preferences.craft_affinity, interactionContext.craft, learningRate);
        this.adjustExperienceStyles(context, interactionContext.experience_styles, learningRate);
        this.adjustMoodAlignment(context, interactionContext.quick_moods, learningRate);
        this.adjustPriceTolerance(context, interactionContext.price, learningRate);
        break;

      case 'swipe_left':
        // Negative signal - decrease preferences
        this.adjustPreference(context.preferences.craft_affinity, interactionContext.craft, -learningRate);
        this.adjustExperienceStyles(context, interactionContext.experience_styles, -learningRate * 0.5);
        break;

      case 'match_celebration':
        // Strong positive signal
        this.adjustPreference(context.preferences.craft_affinity, interactionContext.craft, learningRate * 2);
        break;

      case 'booking_intent':
        // Very strong positive signal
        this.adjustPreference(context.preferences.craft_affinity, interactionContext.craft, learningRate * 3);
        break;

      case 'time_spent':
        // Learn from engagement time
        const timeSpent = interaction.metadata.seconds || 0;
        if (timeSpent > 10) { // Spent time reading = interest
          this.adjustPreference(context.preferences.craft_affinity, interactionContext.craft, learningRate * 0.5);
        }
        break;
    }

    // Update behavioral patterns
    this.updateBehavioralPatterns(context, interaction);
  }

  // Update conversation memory (like maintaining LLM context)
  private async updateConversationMemory(context: UserContext, interaction: UserInteraction): Promise<void> {
    const memoryContent = this.generateMemoryContent(interaction);
    
    const memory: ConversationMemory = {
      timestamp: interaction.timestamp,
      type: this.classifyMemoryType(interaction),
      content: memoryContent,
      confidence: this.calculateMemoryConfidence(interaction),
      relevance_decay: 1.0, // Starts at full relevance
      related_experiences: [interaction.experienceId]
    };

    context.conversationMemory.push(memory);

    // Decay older memories
    context.conversationMemory.forEach(mem => {
      const ageInDays = (Date.now() - new Date(mem.timestamp).getTime()) / (1000 * 60 * 60 * 24);
      mem.relevance_decay = Math.max(0, 1 - (ageInDays / this.MEMORY_RETENTION_DAYS));
    });

    // Keep only recent and relevant memories
    context.conversationMemory = context.conversationMemory
      .filter(mem => mem.relevance_decay > 0.1)
      .slice(-this.MAX_CONVERSATION_MEMORY);
  }

  // Helper methods for preference adjustment
  private adjustPreference(preferences: Record<string, number>, key: string, adjustment: number): void {
    preferences[key] = Math.max(-1, Math.min(1, (preferences[key] || 0) + adjustment));
  }

  private adjustExperienceStyles(context: UserContext, styles: string[], adjustment: number): void {
    styles.forEach(style => {
      this.adjustPreference(context.preferences.experience_style_preference, style, adjustment);
    });
  }

  private adjustMoodAlignment(context: UserContext, moods: string[], adjustment: number): void {
    moods.forEach(mood => {
      this.adjustPreference(context.preferences.mood_alignment, mood, adjustment);
    });
  }

  private adjustPriceTolerance(context: UserContext, price: number, adjustment: number): void {
    // Learn from price acceptance/rejection
    if (adjustment > 0) {
      // Accepted this price - increase tolerance if price is higher than current
      if (price > context.preferences.price_sensitivity * 200) {
        context.preferences.price_sensitivity += adjustment * 0.1;
      }
    }
  }

  // Calculate learning rate based on user confidence and session state
  private calculateLearningRate(context: UserContext, interaction: UserInteraction): number {
    const baseLearningRate = 0.1;
    const confidenceMultiplier = context.patterns.decision_confidence;
    const energyMultiplier = context.currentSession.energy_level;
    const sequenceMultiplier = Math.max(0.5, 1 - (interaction.context.sequence_position * 0.05));
    
    return baseLearningRate * confidenceMultiplier * energyMultiplier * sequenceMultiplier;
  }

  // Generate explanation for experience recommendation
  private generateExperienceExplanation(experience: any, context: UserContext, reasoning: MatchReasoning): string {
    const reasons = [];
    
    if (reasoning.preference_alignment > 0.7) {
      reasons.push(`You've shown strong interest in ${experience.craft} experiences`);
    }
    
    if (reasoning.behavioral_fit > 0.7) {
      reasons.push(`This matches your exploration style and pace`);
    }
    
    if (reasoning.contextual_relevance > 0.7) {
      reasons.push(`Perfect for your current session mood and energy`);
    }
    
    if (reasoning.novelty_factor > 0.7) {
      reasons.push(`This offers a fresh experience while staying within your comfort zone`);
    }

    return reasons.length > 0 
      ? `Recommended because: ${reasons.join(', ')}`
      : `This experience aligns with your developing cultural interests`;
  }

  // Database operations (simplified for now)
  private async loadUserContext(userId: string): Promise<UserContext | null> {
    // Implementation would load from database
    // For now, return mock or localStorage
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering - no localStorage available
        console.warn('localStorage not available (SSR)');
        return null;
      }
      
      const stored = localStorage.getItem(`user_context_${userId}`);
      if (!stored) {
        console.log(`No stored context found for userId: ${userId}`);
        return null;
      }
      
      const parsed = JSON.parse(stored);
      console.log(`Loaded context for userId: ${userId}`, {
        sessionId: parsed.sessionId,
        interactionCount: parsed.currentSession?.interactions_count || 0,
        memoryCount: parsed.conversationMemory?.length || 0
      });
      
      return parsed;
    } catch (error) {
      console.error('Error loading user context:', error);
      return null;
    }
  }

  private async saveUserContext(context: UserContext): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering - no localStorage available
        console.warn('Cannot save context: localStorage not available (SSR)');
        return;
      }
      
      localStorage.setItem(`user_context_${context.userId}`, JSON.stringify(context));
      console.log(`Saved context for userId: ${context.userId}`, {
        sessionId: context.sessionId,
        interactionCount: context.currentSession.interactions_count,
        memoryCount: context.conversationMemory.length
      });
    } catch (error) {
      console.error('Error saving user context:', error);
      throw error;
    }
  }

  // Additional helper methods
  private inferCurrentMood(context: UserContext): string {
    const recentMoods = context.conversationMemory
      .slice(-5)
      .filter(m => m.type === 'preference_signal')
      .map(m => m.content);
    
    // Simple mood inference logic
    return recentMoods.length > 0 ? 'engaged' : 'neutral';
  }

  private inferEnergyLevel(context: UserContext): number {
    const recentActivity = context.currentSession.interactions_count;
    return Math.min(1, 0.7 + (recentActivity * 0.05));
  }

  private inferFocusAreas(context: UserContext): string[] {
    return Object.entries(context.preferences.craft_affinity)
      .filter(([_, score]) => score > 0.5)
      .map(([craft, _]) => craft)
      .slice(0, 3);
  }

  private describeBehaviorPattern(context: UserContext): string {
    const patterns = context.patterns;
    
    if (patterns.swipe_velocity > 0.7) return "Quick decision maker, prefers clear options";
    if (patterns.exploration_vs_exploitation > 0.7) return "Adventurous explorer, likes trying new things";
    if (patterns.decision_confidence > 0.8) return "Confident and decisive in choices";
    
    return "Still developing decision patterns";
  }

  private describeSessionContext(context: UserContext): string {
    const session = context.currentSession;
    return `Active for ${session.interactions_count} interactions, ${session.current_mood} mood, ${session.energy_level > 0.7 ? 'high' : 'moderate'} energy`;
  }

  private calculatePreferenceAlignment(experience: any, context: UserContext): number {
    const craftScore = context.preferences.craft_affinity[experience.craft] || 0;
    const styleScore = experience.experience_styles?.reduce((acc: number, style: string) => 
      acc + (context.preferences.experience_style_preference[style] || 0), 0) / (experience.experience_styles?.length || 1);
    
    return (craftScore + styleScore) / 2;
  }

  private calculateBehavioralFit(experience: any, context: UserContext): number {
    // Implementation would analyze behavioral patterns
    return 0.7; // Placeholder
  }

  private calculateContextualRelevance(experience: any, context: UserContext): number {
    // Implementation would consider current session context
    return 0.6; // Placeholder
  }

  private calculateNoveltyFactor(experience: any, context: UserContext): number {
    // Implementation would balance familiarity vs novelty
    return 0.5; // Placeholder
  }

  private generateAdaptationSignals(experience: any, context: UserContext): string[] {
    return [
      `Learn from ${experience.craft} preference`,
      `Track price sensitivity at €${experience.price}`,
      `Monitor engagement with ${experience.experience_styles?.join(', ')} styles`
    ];
  }

  private updateBehavioralPatterns(context: UserContext, interaction: UserInteraction): void {
    // Update swipe velocity
    const timeBetweenSwipes = interaction.metadata.timeBetweenSwipes || 0;
    if (timeBetweenSwipes > 0) {
      context.patterns.swipe_velocity = (context.patterns.swipe_velocity + (timeBetweenSwipes < 3 ? 1 : 0)) / 2;
    }
  }

  private generateMemoryContent(interaction: UserInteraction): string {
    switch (interaction.type) {
      case 'swipe_right':
        return `Showed interest in ${interaction.context.craft} by ${interaction.context.artisan_age}yr artisan in ${interaction.context.location}`;
      case 'swipe_left':
        return `Passed on ${interaction.context.craft} experience (€${interaction.context.price}, ${interaction.context.duration})`;
      case 'match_celebration':
        return `Excited about match with ${interaction.context.craft} experience`;
      default:
        return `Interacted with ${interaction.context.craft} experience`;
    }
  }

  private classifyMemoryType(interaction: UserInteraction): ConversationMemory['type'] {
    if (interaction.type.includes('swipe')) return 'preference_signal';
    if (interaction.type === 'time_spent') return 'behavior_pattern';
    return 'contextual_insight';
  }

  private calculateMemoryConfidence(interaction: UserInteraction): number {
    switch (interaction.type) {
      case 'booking_intent': return 0.9;
      case 'match_celebration': return 0.8;
      case 'swipe_right': return 0.7;
      case 'swipe_left': return 0.6;
      default: return 0.5;
    }
  }
}

export default new AdaptiveMatchingService(); 