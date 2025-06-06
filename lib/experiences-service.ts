import { supabase } from './supabase';

// Interface matching the database schema
export interface CulturalExperience {
  id: string;
  title: string;
  artisan_name: string;
  craft: string;
  location: string;
  price: number;
  duration: string;
  match_percentage: number;
  image: string;
  description: string;
  reviews: number;
  rating: number;
  social_proof: string;
  artisan_age: number;
  artisan_experience: string;
  languages: string[];
  tags: string[];
  heritage: string;
  certification: string;
  quick_moods: string[];
  experience_styles: string[];
  interactive_content: {
    audioStory: {
      duration: string;
      title: string;
      description: string;
      audioUrl?: string;
    };
    videoPreview: {
      duration: string;
      title: string;
      highlights: string[];
      videoUrl?: string;
    };
    culturalContext: {
      tradition: string;
      significance: string;
      history: string;
      readTime: string;
    };
    learningOutcomes: {
      skills: string[];
      techniques: string[];
      takeaways: string[];
      materials: string[];
    };
    blockchainProofs: {
      artisanVerification: string;
      heritageAuthenticity: string;
      skillCertification: string;
      communityEndorsement: string;
      blockchainHash: string;
    };
    aiExplanation: {
      vibeMatch: string;
      styleMatch: string;
      personalityFit: string;
      confidenceScore: number;
    };
  };
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface ExperienceFilters {
  mood?: string;
  style?: string;
  craft?: string;
  maxPrice?: number;
  limit?: number;
}

export class ExperiencesService {
  /**
   * Get all cultural experiences with optional filtering
   */
  static async getExperiences(filters: ExperienceFilters = {}): Promise<CulturalExperience[]> {
    try {
      let query = supabase
        .from('cultural_experiences')
        .select('*')
        .eq('active', true);

      // Apply filters
      if (filters.mood) {
        query = query.contains('quick_moods', [filters.mood]);
      }

      if (filters.style) {
        query = query.contains('experience_styles', [filters.style]);
      }

      if (filters.craft) {
        query = query.eq('craft', filters.craft);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      // Order by rating and reviews
      query = query.order('rating', { ascending: false })
                   .order('reviews', { ascending: false });

      // Apply limit
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching experiences:', error);
        throw new Error(`Failed to fetch experiences: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getExperiences:', error);
      // Return empty array on error to prevent app crashes
      return [];
    }
  }

  /**
   * Get a single experience by ID
   */
  static async getExperienceById(id: string): Promise<CulturalExperience | null> {
    try {
      const { data, error } = await supabase
        .from('cultural_experiences')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .single();

      if (error) {
        console.error('Error fetching experience by ID:', error);
        throw new Error(`Failed to fetch experience: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getExperienceById:', error);
      return null;
    }
  }

  /**
   * Get experiences filtered by moods and styles for cultural matching
   */
  static async getMatchingExperiences(
    selectedMood?: string,
    selectedStyle?: string,
    maxPrice?: number
  ): Promise<CulturalExperience[]> {
    const filters: ExperienceFilters = {
      mood: selectedMood,
      style: selectedStyle,
      maxPrice,
      limit: 20
    };

    return this.getExperiences(filters);
  }

  /**
   * Get popular experiences (top rated)
   */
  static async getPopularExperiences(limit: number = 5): Promise<CulturalExperience[]> {
    try {
      const { data, error } = await supabase
        .from('cultural_experiences')
        .select('*')
        .eq('active', true)
        .order('rating', { ascending: false })
        .order('reviews', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching popular experiences:', error);
        throw new Error(`Failed to fetch popular experiences: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPopularExperiences:', error);
      return [];
    }
  }

  /**
   * Get experiences by craft category
   */
  static async getExperiencesByCraft(craft: string): Promise<CulturalExperience[]> {
    return this.getExperiences({ craft });
  }

  /**
   * Search experiences by text
   */
  static async searchExperiences(searchTerm: string): Promise<CulturalExperience[]> {
    try {
      const { data, error } = await supabase
        .from('cultural_experiences')
        .select('*')
        .eq('active', true)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,artisan_name.ilike.%${searchTerm}%,craft.ilike.%${searchTerm}%`)
        .order('rating', { ascending: false });

      if (error) {
        console.error('Error searching experiences:', error);
        throw new Error(`Failed to search experiences: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchExperiences:', error);
      return [];
    }
  }

  /**
   * Get unique crafts for filtering
   */
  static async getAvailableCrafts(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('cultural_experiences')
        .select('craft')
        .eq('active', true);

      if (error) {
        console.error('Error fetching crafts:', error);
        return [];
      }

      // Extract unique crafts with proper typing
      const crafts = (data as { craft: string }[])?.map(item => item.craft) || [];
      return [...new Set(crafts)];
    } catch (error) {
      console.error('Error in getAvailableCrafts:', error);
      return [];
    }
  }

  /**
   * Calculate match percentage based on user preferences
   * This could be enhanced with more sophisticated algorithms
   */
  static calculateMatchPercentage(
    experience: CulturalExperience,
    userMood?: string,
    userStyle?: string,
    userMaxPrice?: number
  ): number {
    let score = 0;
    let factors = 0;

    // Base score from database
    score += experience.match_percentage || 0;
    factors += 1;

    // Mood match
    if (userMood && experience.quick_moods.includes(userMood)) {
      score += 95;
      factors += 1;
    }

    // Style match
    if (userStyle && experience.experience_styles.includes(userStyle)) {
      score += 90;
      factors += 1;
    }

    // Price match
    if (userMaxPrice && experience.price <= userMaxPrice) {
      score += 85;
      factors += 1;
    }

    // Rating boost
    score += experience.rating * 10;
    factors += 1;

    return Math.min(Math.round(score / factors), 100);
  }
}

// Export for use in components
export default ExperiencesService; 