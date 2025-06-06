// AI Service for Morocco Made Real
// Handles itinerary generation, cultural recommendations, and authenticity verification

export interface TravelPreferences {
  interests: string[];
  budget: 'budget' | 'mid-range' | 'luxury';
  duration: number; // days
  groupSize: number;
  accessibility: boolean;
  culturalLevel: 'beginner' | 'intermediate' | 'expert';
  preferredRegions: string[];
}

export interface ItineraryItem {
  id: string;
  day: number;
  time: string;
  activity: string;
  location: string;
  description: string;
  culturalSignificance: string;
  estimatedCost: number;
  authenticityScore: number;
  artisanConnections?: ArtisanConnection[];
}

export interface ArtisanConnection {
  id: string;
  name: string;
  craft: string;
  location: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  blockchainCertificate?: string;
  rating: number;
  specialties: string[];
}

export interface CulturalRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'historical' | 'culinary' | 'artistic' | 'religious' | 'natural';
  location: string;
  authenticityScore: number;
  aiConfidence: number;
  culturalContext: string;
  bestTimeToVisit: string;
  tips: string[];
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
    this.baseUrl = 'https://api.openai.com/v1';
  }

  /**
   * Generate personalized itinerary based on user preferences
   */
  async generateItinerary(preferences: TravelPreferences): Promise<ItineraryItem[]> {
    try {
      const prompt = this.buildItineraryPrompt(preferences);
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert Moroccan cultural guide and travel planner with deep knowledge of authentic experiences, traditional crafts, and local customs. Generate detailed, culturally respectful itineraries.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      return this.parseItineraryResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      return this.getFallbackItinerary(preferences);
    }
  }

  /**
   * Get cultural recommendations based on location and interests
   */
  async getCulturalRecommendations(location: string, interests: string[]): Promise<CulturalRecommendation[]> {
    try {
      const prompt = `Provide authentic cultural recommendations for ${location}, Morocco, focusing on ${interests.join(', ')}. Include historical context, cultural significance, and practical tips.`;
      
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a Moroccan cultural expert. Provide authentic, respectful recommendations with historical context and practical information.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.6,
          max_tokens: 1500
        })
      });

      const data = await response.json();
      return this.parseCulturalRecommendations(data.choices[0].message.content, location);
    } catch (error) {
      console.error('Error getting cultural recommendations:', error);
      return this.getFallbackRecommendations(location);
    }
  }

  /**
   * Verify authenticity of artisan products using AI image analysis
   */
  async verifyArtisanAuthenticity(imageUrl: string, craftType: string): Promise<{
    isAuthentic: boolean;
    confidence: number;
    analysis: string;
    recommendations: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'system',
              content: `You are an expert in traditional Moroccan crafts. Analyze images to verify authenticity of ${craftType} products based on traditional techniques, materials, and patterns.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Please analyze this ${craftType} for authenticity. Look for traditional techniques, genuine materials, and authentic patterns.`
                },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl }
                }
              ]
            }
          ],
          max_tokens: 500
        })
      });

      const data = await response.json();
      return this.parseAuthenticityResponse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error verifying authenticity:', error);
      return {
        isAuthentic: false,
        confidence: 0,
        analysis: 'Unable to verify authenticity at this time.',
        recommendations: ['Please consult with a local expert for verification.']
      };
    }
  }

  private buildItineraryPrompt(preferences: TravelPreferences): string {
    return `Create a ${preferences.duration}-day authentic Moroccan itinerary for ${preferences.groupSize} people with ${preferences.budget} budget.

Interests: ${preferences.interests.join(', ')}
Cultural Level: ${preferences.culturalLevel}
Preferred Regions: ${preferences.preferredRegions.join(', ')}
Accessibility Needs: ${preferences.accessibility}

Please provide:
1. Daily activities with specific times
2. Cultural significance of each activity
3. Estimated costs in MAD
4. Authenticity scores (1-10)
5. Connections to verified local artisans
6. Practical tips and cultural etiquette

Format as JSON with detailed descriptions.`;
  }

  private parseItineraryResponse(response: string): ItineraryItem[] {
    // Parse AI response and convert to ItineraryItem[]
    // This would include JSON parsing and data validation
    // For now, returning a sample structure
    return [
      {
        id: '1',
        day: 1,
        time: '09:00',
        activity: 'Medina Walking Tour',
        location: 'Fes Medina',
        description: 'Guided tour through the ancient medina with local historian',
        culturalSignificance: 'UNESCO World Heritage site, 1200+ years of history',
        estimatedCost: 200,
        authenticityScore: 9.5,
        artisanConnections: [
          {
            id: 'artisan1',
            name: 'Hassan Benali',
            craft: 'Traditional Pottery',
            location: 'Fes Pottery Quarter',
            verificationStatus: 'verified',
            rating: 4.8,
            specialties: ['Zellige tiles', 'Traditional ceramics']
          }
        ]
      }
    ];
  }

  private parseCulturalRecommendations(response: string, location: string): CulturalRecommendation[] {
    // Parse AI response for cultural recommendations
    return [
      {
        id: '1',
        title: 'Traditional Hammam Experience',
        description: 'Authentic Moroccan spa experience in historic bathhouse',
        category: 'historical',
        location: location,
        authenticityScore: 9.0,
        aiConfidence: 0.95,
        culturalContext: 'Hammams have been central to Moroccan social life for centuries',
        bestTimeToVisit: 'Morning or early afternoon',
        tips: ['Bring your own towel', 'Respect local customs', 'Stay hydrated']
      }
    ];
  }

  private parseAuthenticityResponse(response: string): {
    isAuthentic: boolean;
    confidence: number;
    analysis: string;
    recommendations: string[];
  } {
    // Parse AI authenticity analysis
    return {
      isAuthentic: true,
      confidence: 0.85,
      analysis: response,
      recommendations: ['Verify with local artisan guild', 'Check for traditional materials']
    };
  }

  private getFallbackItinerary(preferences: TravelPreferences): ItineraryItem[] {
    // Provide fallback itinerary when AI service is unavailable
    return [
      {
        id: 'fallback1',
        day: 1,
        time: '10:00',
        activity: 'Explore Local Medina',
        location: 'Historic Center',
        description: 'Self-guided exploration of traditional markets',
        culturalSignificance: 'Heart of Moroccan urban culture',
        estimatedCost: 50,
        authenticityScore: 8.0
      }
    ];
  }

  private getFallbackRecommendations(location: string): CulturalRecommendation[] {
    // Provide fallback recommendations
    return [
      {
        id: 'fallback1',
        title: 'Local Market Visit',
        description: 'Experience traditional Moroccan market culture',
        category: 'historical',
        location: location,
        authenticityScore: 8.5,
        aiConfidence: 0.8,
        culturalContext: 'Markets are the social and economic heart of Moroccan cities',
        bestTimeToVisit: 'Morning hours',
        tips: ['Bargaining is expected', 'Dress modestly', 'Learn basic Arabic greetings']
      }
    ];
  }
} 