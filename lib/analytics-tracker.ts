// Analytics Tracker for Cultural DNA Data Collection
interface AnalyticsEvent {
  id: string;
  name: string;
  properties: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private getCurrentUserId(): string | undefined {
    // Get from local storage or auth context
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cultural_dna_user_id') || undefined;
    }
    return undefined;
  }
  
  track(eventName: string, properties: Record<string, any>) {
    const event: AnalyticsEvent = {
      id: crypto.randomUUID(),
      name: eventName,
      properties,
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId
    };
    
    this.events.push(event);
    this.sendToConsole(event); // For now, log to console
    this.sendToLocalStorage(event); // Store locally for analysis
  }
  
  // Track cultural preferences revealed through behavior
  trackCulturalBehavior(action: string, data: any) {
    this.track('cultural_behavior', {
      action,
      ...data,
      inferredTraits: this.inferPersonalityTraits(data)
    });
  }
  
  // Track swipe behavior for personality insights
  trackSwipeBehavior(direction: 'left' | 'right', experienceId: string, hesitationTime: number, viewTime: number) {
    const inferredTraits = this.inferPersonalityFromSwipe(direction, hesitationTime, viewTime);
    
    this.track('swipe_behavior', {
      direction,
      experienceId,
      hesitationTime,
      viewTime,
      inferredTraits,
      timestamp: Date.now()
    });
  }
  
  // Track profile completion for data collection progress
  trackProfileProgress(step: string, data: any) {
    this.track('profile_progress', {
      step,
      completionPercentage: this.calculateCompletionPercentage(step),
      data,
      discoveredTraits: data.discoveredTraits || []
    });
  }
  
  // Infer personality traits from behavior patterns
  private inferPersonalityTraits(behaviorData: any): Record<string, number> {
    const traits: Record<string, number> = {};
    
    // Quick decision making = spontaneous personality
    if (behaviorData.hesitationTime < 2000) {
      traits.spontaneity = 0.8;
      traits.decisiveness = 0.9;
    }
    
    // Long viewing time = detail-oriented  
    if (behaviorData.viewTime > 30000) {
      traits.conscientiousness = 0.8;
      traits.thoroughness = 0.9;
    }
    
    // Prefer cultural context = heritage connection
    if (behaviorData.focusArea === 'cultural-context') {
      traits.heritageOrientation = 0.9;
    }
    
    return traits;
  }
  
  // Infer personality from swipe patterns
  private inferPersonalityFromSwipe(direction: string, hesitationTime: number, viewTime: number): Record<string, number> {
    const traits: Record<string, number> = {};
    
    // Fast swipes = impulsive, slow = deliberate
    if (hesitationTime < 1000) {
      traits.impulsiveness = 0.8;
    } else if (hesitationTime > 5000) {
      traits.deliberateness = 0.9;
    }
    
    // Long view times = thorough consideration
    if (viewTime > 45000) {
      traits.thoroughness = 0.8;
      traits.analyticalThinking = 0.7;
    }
    
    // Right swipes = openness, left = selectiveness
    if (direction === 'right') {
      traits.openness = 0.6;
    } else {
      traits.selectiveness = 0.7;
    }
    
    return traits;
  }
  
  private calculateCompletionPercentage(step: string): number {
    const stepValues = {
      'cultural_vibe': 25,
      'budget': 50,
      'time': 75,
      'languages': 100
    };
    return stepValues[step] || 0;
  }
  
  private sendToConsole(event: AnalyticsEvent) {
    console.log('🧬 Cultural DNA Analytics:', {
      event: event.name,
      properties: event.properties,
      timestamp: event.timestamp,
      sessionId: event.sessionId
    });
  }
  
  private sendToLocalStorage(event: AnalyticsEvent) {
    if (typeof window !== 'undefined') {
      const key = 'cultural_dna_analytics';
      const existing = localStorage.getItem(key);
      const events = existing ? JSON.parse(existing) : [];
      events.push(event);
      
      // Keep only last 100 events to avoid storage bloat
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem(key, JSON.stringify(events));
    }
  }
  
  // Get analytics summary for analysis
  getAnalyticsSummary(): any {
    if (typeof window === 'undefined') return null;
    
    const events = JSON.parse(localStorage.getItem('cultural_dna_analytics') || '[]');
    
    return {
      totalEvents: events.length,
      swipeBehavior: events.filter(e => e.name === 'swipe_behavior'),
      profileProgress: events.filter(e => e.name === 'profile_progress'),
      culturalBehavior: events.filter(e => e.name === 'cultural_behavior'),
      sessionData: {
        sessionId: this.sessionId,
        startTime: events[0]?.timestamp,
        duration: Date.now() - new Date(events[0]?.timestamp || Date.now()).getTime()
      }
    };
  }
  
  // Initialize user tracking
  initializeUser(userId?: string) {
    if (typeof window !== 'undefined' && userId) {
      localStorage.setItem('cultural_dna_user_id', userId);
    }
    
    this.track('user_session_start', {
      userId,
      sessionId: this.sessionId,
      timestamp: Date.now()
    });
  }
}

export const analyticsTracker = new AnalyticsTracker(); 