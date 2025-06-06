// Real RL Database Service - Supabase Integration
import { supabase } from './supabase';
import { 
  TouristProfile, 
  ArtisanProfile, 
  Experience, 
  Recommendation, 
  AgentType,
  RLConfig 
} from '@/types/rl';

export interface DatabaseTouristProfile {
  id: string;
  user_id: string;
  preferred_crafts: string[];
  preferred_regions: string[];
  preferred_experience_types: string[];
  cultural_depth: 'surface' | 'moderate' | 'deep';
  group_size: 'solo' | 'couple' | 'small-group' | 'large-group';
  languages: string[];
  cultural_interests: any[];
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  learning_pace: string;
  group_preference: string;
  feedback_style: string;
  budget_min: number;
  budget_max: number;
  budget_currency: string;
  budget_flexibility: number;
  time_duration: number;
  time_unit: string;
  time_flexibility: number;
  preferred_times: string[];
  total_experiences: number;
  successful_experiences: number;
  average_satisfaction: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseArtisanProfile {
  id: string;
  artisan_id: string;
  name: string;
  craft: string;
  region: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'master' | 'grandmaster';
  techniques: any[];
  cultural_knowledge: any;
  teaching_approach: 'traditional' | 'modern' | 'hybrid';
  patience_level: number;
  adaptability: number;
  cultural_sensitivity: number;
  language_skills: string[];
  availability: any;
  monthly_target: number;
  yearly_target: number;
  growth_rate: number;
  diversification_goals: string[];
  total_tourists_hosted: number;
  average_rating: number;
  cultural_score: number;
  economic_score: number;
  created_at: string;
  updated_at: string;
}

export interface DatabaseRecommendation {
  id: string;
  agent_type: AgentType;
  tourist_profile_id: string;
  artisan_profile_id: string;
  confidence: number;
  cultural_score: number;
  economic_score: number;
  overall_score: number;
  reasoning: string;
  cultural_context: string;
  experience_type: string;
  estimated_duration: number;
  estimated_cost: number;
  presented_to_user: boolean;
  user_clicked: boolean;
  user_booked: boolean;
  user_completed: boolean;
  user_rating?: number;
  created_at: string;
  expires_at: string;
  policy_version: number;
}

export interface DatabaseExperience {
  id: string;
  agent_type: AgentType;
  state_data: any;
  tourist_profile_id?: string;
  artisan_profile_id?: string;
  action_data: any;
  action_type: string;
  confidence: number;
  reward: number;
  cultural_reward: number;
  economic_reward: number;
  satisfaction_reward: number;
  next_state_data: any;
  cultural_validation: any;
  economic_outcome: any;
  timestamp: string;
  session_id?: string;
  experiment_id?: string;
}

export interface DatabaseAgentPerformance {
  id: string;
  agent_type: AgentType;
  experience_count: number;
  cultural_score: number;
  economic_score: number;
  satisfaction_score: number;
  overall_performance: number;
  policy_version: number;
  learning_rate: number;
  exploration_rate: number;
  config: any;
  is_learning: boolean;
  last_learning_session?: string;
  created_at: string;
  updated_at: string;
}

export class RLDatabaseService {
  private isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  private isDatabaseAvailable = false;

  constructor() {
    if (!this.isSupabaseConfigured) {
      console.warn('⚠️ Supabase not configured. RL Database Service running in mock mode.');
      console.info('💡 To enable real database functionality, set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file');
    } else {
      console.log('✅ RL Database Service initialized with Supabase connection');
      console.log(`🔗 Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}`);
      console.log(`🔑 Supabase Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***configured***' : 'missing'}`);
      
      // Test the connection
      this.testConnection();
    }
  }

  private async testConnection(): Promise<void> {
    try {
      console.log('🔍 Testing Supabase connection...');
      const { data, error } = await supabase
        .from('rl_agent_performance')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('❌ Supabase connection test failed:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.warn('⚠️ Falling back to mock mode due to database connection issues');
        this.isDatabaseAvailable = false;
      } else {
        console.log('✅ Supabase connection test successful');
        this.isDatabaseAvailable = true;
      }
    } catch (err) {
      console.error('❌ Supabase connection test error:', err);
      console.warn('⚠️ Falling back to mock mode due to database connection issues');
      this.isDatabaseAvailable = false;
    }
  }

  // Tourist Profile Operations
  async createTouristProfile(profile: TouristProfile): Promise<{ success: boolean; data?: DatabaseTouristProfile; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Creating tourist profile for ${profile.id}`);
      return { success: true, data: this.convertTouristProfileToDb(profile) as DatabaseTouristProfile };
    }

    try {
      const dbProfile = this.convertTouristProfileToDb(profile);
      console.log(`👤 Creating tourist profile for ${profile.id} in database...`);
      
      const { data, error } = await supabase
        .from('tourist_profiles')
        .insert(dbProfile)
        .select()
        .single();

      if (error) {
        console.error(`❌ Database error creating tourist profile for ${profile.id}:`, error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        
        // Check if it's a table/schema issue
        if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('💡 The tourist_profiles table does not exist. Please run the database migrations.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.createTouristProfile(profile); // Retry in mock mode
        }
        
        // Check if it's an authentication issue
        if (error.message && (error.message.includes('JWT') || error.message.includes('auth'))) {
          console.error('💡 Authentication issue. Please check your Supabase credentials.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.createTouristProfile(profile); // Retry in mock mode
        }
        
        // For any other database error, fall back to mock mode
        console.warn('⚠️ Database operation failed, switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.createTouristProfile(profile); // Retry in mock mode
      }
      
      console.log(`✅ Successfully created tourist profile for ${profile.id}`);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ Error creating tourist profile for ${profile.id}:`, error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.createTouristProfile(profile); // Retry in mock mode
    }
  }

  async getTouristProfile(userId: string): Promise<{ success: boolean; data?: DatabaseTouristProfile; error?: string }> {
    if (!this.isSupabaseConfigured) {
      console.log('🔧 Mock: Getting tourist profile for', userId);
      return { success: true, data: undefined };
    }

    try {
      const { data, error } = await supabase
        .from('tourist_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return { success: true, data: data || undefined };
    } catch (error) {
      console.error('Error getting tourist profile:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async updateTouristProfile(profile: TouristProfile): Promise<{ success: boolean; data?: DatabaseTouristProfile; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Updating tourist profile for ${profile.id}`);
      return { success: true, data: this.convertTouristProfileToDb(profile) as DatabaseTouristProfile };
    }

    try {
      const dbProfile = this.convertTouristProfileToDb(profile);
      console.log(`👤 Updating tourist profile for ${profile.id} in database...`);
      
      const { data, error } = await supabase
        .from('tourist_profiles')
        .update(dbProfile)
        .eq('user_id', profile.id)
        .select()
        .single();

      if (error) {
        console.error(`❌ Database error updating tourist profile for ${profile.id}:`, error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        
        // Check if it's a table/schema issue
        if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('💡 The tourist_profiles table does not exist. Please run the database migrations.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.updateTouristProfile(profile); // Retry in mock mode
        }
        
        // Check if it's an authentication issue
        if (error.message && (error.message.includes('JWT') || error.message.includes('auth'))) {
          console.error('💡 Authentication issue. Please check your Supabase credentials.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.updateTouristProfile(profile); // Retry in mock mode
        }
        
        // For any other database error, fall back to mock mode
        console.warn('⚠️ Database operation failed, switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.updateTouristProfile(profile); // Retry in mock mode
      }
      
      console.log(`✅ Successfully updated tourist profile for ${profile.id}`);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ Error updating tourist profile for ${profile.id}:`, error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.updateTouristProfile(profile); // Retry in mock mode
    }
  }

  // Artisan Profile Operations
  async createArtisanProfile(profile: ArtisanProfile): Promise<{ success: boolean; data?: DatabaseArtisanProfile; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Creating artisan profile for ${profile.name}`);
      return { success: true, data: this.convertArtisanProfileToDb(profile) as DatabaseArtisanProfile };
    }

    try {
      const dbProfile = this.convertArtisanProfileToDb(profile);
      console.log(`🎨 Creating artisan profile for ${profile.name} in database...`);
      
      const { data, error } = await supabase
        .from('artisan_profiles_rl')
        .insert(dbProfile)
        .select()
        .single();

      if (error) {
        console.error(`❌ Database error creating artisan profile for ${profile.name}:`, error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        
        // Check if it's a table/schema issue
        if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('💡 The artisan_profiles_rl table does not exist. Please run the database migrations.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.createArtisanProfile(profile); // Retry in mock mode
        }
        
        // Check if it's an authentication issue
        if (error.message && (error.message.includes('JWT') || error.message.includes('auth'))) {
          console.error('💡 Authentication issue. Please check your Supabase credentials.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.createArtisanProfile(profile); // Retry in mock mode
        }
        
        // For any other database error, fall back to mock mode
        console.warn('⚠️ Database operation failed, switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.createArtisanProfile(profile); // Retry in mock mode
      }
      
      console.log(`✅ Successfully created artisan profile for ${profile.name}`);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ Error creating artisan profile for ${profile.name}:`, error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.createArtisanProfile(profile); // Retry in mock mode
    }
  }

  async getArtisanProfiles(): Promise<{ success: boolean; data?: DatabaseArtisanProfile[]; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Getting artisan profiles`);
      return { success: true, data: [] };
    }

    try {
      console.log('🎨 Getting artisan profiles from database...');
      
      const { data, error } = await supabase
        .from('artisan_profiles_rl')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Database error getting artisan profiles:', error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        
        // Check if it's a table/schema issue
        if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('💡 The artisan_profiles_rl table does not exist. Please run the database migrations.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.getArtisanProfiles(); // Retry in mock mode
        }
        
        // For any other database error, fall back to mock mode
        console.warn('⚠️ Database operation failed, switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.getArtisanProfiles(); // Retry in mock mode
      }
      
      console.log(`✅ Successfully retrieved ${data?.length || 0} artisan profiles`);
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ Error getting artisan profiles:', error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.getArtisanProfiles(); // Retry in mock mode
    }
  }

  async getArtisanProfile(artisanId: string): Promise<{ success: boolean; data?: DatabaseArtisanProfile; error?: string }> {
    if (!this.isSupabaseConfigured) {
      console.log('🔧 Mock: Getting artisan profile for', artisanId);
      return { success: true, data: undefined };
    }

    try {
      const { data, error } = await supabase
        .from('artisan_profiles_rl')
        .select('*')
        .eq('id', artisanId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { success: true, data: data || undefined };
    } catch (error) {
      console.error('Error getting artisan profile:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Experience Operations
  async recordExperience(experience: Experience): Promise<{ success: boolean; data?: DatabaseExperience; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Recording experience with reward ${experience.reward}`);
      return { success: true, data: this.convertExperienceToDb(experience) as DatabaseExperience };
    }

    try {
      const dbExperience = this.convertExperienceToDb(experience);
      console.log(`📝 Recording experience with reward ${experience.reward} in database...`);
      
      const { data, error } = await supabase
        .from('rl_experiences')
        .insert(dbExperience)
        .select()
        .single();

      if (error) {
        console.error(`❌ Database error recording experience:`, error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        
        // Check if it's a table/schema issue
        if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('💡 The rl_experiences table does not exist. Please run the database migrations.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.recordExperience(experience); // Retry in mock mode
        }
        
        // Check if it's an authentication issue
        if (error.message && (error.message.includes('JWT') || error.message.includes('auth'))) {
          console.error('💡 Authentication issue. Please check your Supabase credentials.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.recordExperience(experience); // Retry in mock mode
        }
        
        // For any other database error, fall back to mock mode
        console.warn('⚠️ Database operation failed, switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.recordExperience(experience); // Retry in mock mode
      }
      
      console.log(`✅ Successfully recorded experience with reward ${experience.reward}`);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ Error recording experience:`, error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.recordExperience(experience); // Retry in mock mode
    }
  }

  async getExperiences(agentType: AgentType, limit: number = 100): Promise<{ success: boolean; data?: DatabaseExperience[]; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Getting experiences for ${agentType}`);
      return { success: true, data: [] };
    }

    try {
      console.log(`📝 Getting experiences for ${agentType} from database...`);
      
      const { data, error } = await supabase
        .from('rl_experiences')
        .select('*')
        .eq('agent_type', agentType)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (error) {
        console.error(`❌ Database error getting experiences for ${agentType}:`, error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        
        // Check if it's a table/schema issue
        if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('💡 The rl_experiences table does not exist. Please run the database migrations.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.getExperiences(agentType, limit); // Retry in mock mode
        }
        
        // For any other database error, fall back to mock mode
        console.warn('⚠️ Database operation failed, switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.getExperiences(agentType, limit); // Retry in mock mode
      }
      
      console.log(`✅ Successfully retrieved ${data?.length || 0} experiences for ${agentType}`);
      return { success: true, data: data || [] };
    } catch (error) {
      console.error(`❌ Error getting experiences for ${agentType}:`, error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.getExperiences(agentType, limit); // Retry in mock mode
    }
  }

  // Recommendation Operations
  async saveRecommendation(recommendation: Recommendation, agentType: AgentType): Promise<{ success: boolean; data?: DatabaseRecommendation; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Saving recommendation with confidence ${recommendation.confidence}`);
      return { success: true, data: this.convertRecommendationToDb(recommendation, agentType) as DatabaseRecommendation };
    }

    try {
      console.log(`💡 Saving recommendation for agent ${agentType} in database...`);
      
      // First, look up the tourist profile UUID if recommendation.id is a user_id string
      let touristProfileId = recommendation.id;
      
      // Check if this looks like a user ID (string) rather than a UUID
      if (typeof recommendation.id === 'string' && !recommendation.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        const { data: touristProfile, error: touristError } = await supabase
          .from('tourist_profiles')
          .select('id')
          .eq('user_id', recommendation.id)
          .single();

        if (touristError || !touristProfile) {
          console.log(`ℹ️ No tourist profile found for ${recommendation.id}, cannot save recommendation`);
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.saveRecommendation(recommendation, agentType); // Retry in mock mode
        }
        
        touristProfileId = touristProfile.id;
      }
      
      // Create the database recommendation with the correct UUID
      const dbRecommendation = {
        agent_type: agentType,
        tourist_profile_id: touristProfileId,
        artisan_profile_id: recommendation.artisan?.id,
        confidence: recommendation.confidence,
        cultural_score: recommendation.culturalScore,
        economic_score: recommendation.economicScore,
        overall_score: (recommendation.confidence + recommendation.culturalScore + recommendation.economicScore) / 3,
        reasoning: recommendation.reasoning,
        cultural_context: recommendation.reasoning,
        experience_type: 'hands-on-workshop',
        estimated_duration: 3,
        estimated_cost: 250,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        policy_version: 1
      };
      
      const { data, error } = await supabase
        .from('rl_recommendations')
        .insert(dbRecommendation)
        .select()
        .single();

      if (error) {
        console.error(`❌ Database error saving recommendation for agent ${agentType}:`, error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        
        // Check if it's a table/schema issue
        if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('💡 The rl_recommendations table does not exist. Please run the database migrations.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.saveRecommendation(recommendation, agentType); // Retry in mock mode
        }
        
        // Check if it's an authentication issue
        if (error.message && (error.message.includes('JWT') || error.message.includes('auth'))) {
          console.error('💡 Authentication issue. Please check your Supabase credentials.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.saveRecommendation(recommendation, agentType); // Retry in mock mode
        }
        
        // Check if it's a foreign key constraint issue
        if (error.message && error.message.includes('foreign key constraint')) {
          console.error('💡 Foreign key constraint violation. Tourist or artisan profile may not exist.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.saveRecommendation(recommendation, agentType); // Retry in mock mode
        }
        
        // For any other database error, fall back to mock mode
        console.warn('⚠️ Database operation failed, switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.saveRecommendation(recommendation, agentType); // Retry in mock mode
      }
      
      console.log(`✅ Successfully saved recommendation for agent ${agentType}`);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ Error saving recommendation for agent ${agentType}:`, error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.saveRecommendation(recommendation, agentType); // Retry in mock mode
    }
  }

  async getRecommendations(touristProfileId: string, limit: number = 5): Promise<{ success: boolean; data?: DatabaseRecommendation[]; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Getting recommendations for tourist ${touristProfileId}`);
      return { success: true, data: [] };
    }

    try {
      console.log(`📋 Getting recommendations for tourist ${touristProfileId} from database...`);
      
      // First, check if the tourist profile exists and get its UUID
      const { data: touristProfile, error: touristError } = await supabase
        .from('tourist_profiles')
        .select('id')
        .eq('user_id', touristProfileId)
        .single();

      if (touristError || !touristProfile) {
        console.log(`ℹ️ No tourist profile found for ${touristProfileId}, returning empty recommendations`);
        return { success: true, data: [] };
      }

      // Now get recommendations using the tourist profile UUID
      const { data, error } = await supabase
        .rpc('get_tourist_recommendations', {
          p_tourist_id: touristProfile.id,
          p_limit: limit
        });

      if (error) {
        console.error(`❌ Database error getting recommendations for tourist ${touristProfileId}:`, error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        
        // Check if it's a function/table issue
        if (error.message && (error.message.includes('function') || error.message.includes('does not exist'))) {
          console.error('💡 The get_tourist_recommendations function or related tables do not exist. Please run the database migrations.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.getRecommendations(touristProfileId, limit); // Retry in mock mode
        }
        
        // Check if it's a UUID format issue
        if (error.message && error.message.includes('invalid input syntax for type uuid')) {
          console.error('💡 UUID format issue. This should not happen after the tourist profile lookup.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.getRecommendations(touristProfileId, limit); // Retry in mock mode
        }
        
        // For any other database error, fall back to mock mode
        console.warn('⚠️ Database operation failed, switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.getRecommendations(touristProfileId, limit); // Retry in mock mode
      }
      
      console.log(`✅ Successfully retrieved ${data?.length || 0} recommendations`);
      return { success: true, data: data || [] };
    } catch (error) {
      console.error(`❌ Error getting recommendations for tourist ${touristProfileId}:`, error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.getRecommendations(touristProfileId, limit); // Retry in mock mode
    }
  }

  async recordRecommendationInteraction(
    recommendationId: string, 
    interactionType: 'click' | 'book' | 'complete',
    rating?: number
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.isSupabaseConfigured) {
      console.log('🔧 Mock: Recording interaction', interactionType, 'for recommendation', recommendationId);
      return { success: true };
    }

    try {
      const { data, error } = await supabase
        .rpc('record_recommendation_interaction', {
          p_recommendation_id: recommendationId,
          p_interaction_type: interactionType,
          p_rating: rating
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error recording recommendation interaction:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Agent Performance Operations
  async updateAgentPerformance(
    agentType: AgentType, 
    performance: {
      experienceCount: number;
      culturalScore: number;
      economicScore: number;
      satisfactionScore: number;
      policyVersion: number;
      isLearning: boolean;
      config: RLConfig;
    }
  ): Promise<{ success: boolean; data?: DatabaseAgentPerformance; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Updating agent performance for ${agentType} - Experience Count: ${performance.experienceCount}, Cultural: ${performance.culturalScore.toFixed(2)}, Economic: ${performance.economicScore.toFixed(2)}, Satisfaction: ${performance.satisfactionScore.toFixed(2)}`);
      
      // Return mock data that matches the expected structure
      const mockData: DatabaseAgentPerformance = {
        id: `mock-${agentType}-${Date.now()}`,
        agent_type: agentType,
        experience_count: performance.experienceCount,
        cultural_score: performance.culturalScore,
        economic_score: performance.economicScore,
        satisfaction_score: performance.satisfactionScore,
        overall_performance: (performance.culturalScore + performance.economicScore + performance.satisfactionScore) / 3,
        policy_version: performance.policyVersion,
        learning_rate: performance.config.learningRate,
        exploration_rate: performance.config.explorationRate,
        config: performance.config,
        is_learning: performance.isLearning,
        last_learning_session: performance.isLearning ? new Date().toISOString() : undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      return { success: true, data: mockData };
    }

    try {
      const performanceData = {
        agent_type: agentType,
        experience_count: performance.experienceCount,
        cultural_score: performance.culturalScore,
        economic_score: performance.economicScore,
        satisfaction_score: performance.satisfactionScore,
        overall_performance: (performance.culturalScore + performance.economicScore + performance.satisfactionScore) / 3,
        policy_version: performance.policyVersion,
        learning_rate: performance.config.learningRate,
        exploration_rate: performance.config.explorationRate,
        config: performance.config,
        is_learning: performance.isLearning,
        last_learning_session: performance.isLearning ? new Date().toISOString() : undefined
      };

      console.log(`📊 Updating agent performance for ${agentType} in database...`);

      const { data, error } = await supabase
        .from('rl_agent_performance')
        .upsert(performanceData, { onConflict: 'agent_type' })
        .select()
        .single();

      if (error) {
        console.error(`❌ Database error updating agent performance for ${agentType}:`, error);
        console.error('Error type:', typeof error);
        console.error('Error keys:', Object.keys(error));
        console.error('Error stringified:', JSON.stringify(error, null, 2));
        
        // Check if it's a table/schema issue
        if (error.message && error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('💡 The rl_agent_performance table does not exist. Please run the database migrations.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.updateAgentPerformance(agentType, performance); // Retry in mock mode
        }
        
        // Check if it's an authentication issue
        if (error.message && (error.message.includes('JWT') || error.message.includes('auth'))) {
          console.error('💡 Authentication issue. Please check your Supabase credentials.');
          console.warn('⚠️ Switching to mock mode for this session');
          this.isDatabaseAvailable = false;
          return this.updateAgentPerformance(agentType, performance); // Retry in mock mode
        }
        
        // For any other database error, fall back to mock mode
        console.warn('⚠️ Database operation failed, switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.updateAgentPerformance(agentType, performance); // Retry in mock mode
      }
      
      console.log(`✅ Successfully updated agent performance for ${agentType}`);
      return { success: true, data };
    } catch (error) {
      console.error(`❌ Error updating agent performance for ${agentType}:`, error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.updateAgentPerformance(agentType, performance); // Retry in mock mode
    }
  }

  async getAgentPerformance(agentType: AgentType): Promise<{ success: boolean; data?: DatabaseAgentPerformance; error?: string }> {
    if (!this.isSupabaseConfigured || !this.isDatabaseAvailable) {
      const mode = !this.isSupabaseConfigured ? 'Mock' : 'Mock (Database Unavailable)';
      console.log(`🔧 ${mode}: Getting agent performance for ${agentType}`);
      return { 
        success: true, 
        data: {
          id: 'mock-id',
          agent_type: agentType,
          experience_count: 15,
          cultural_score: 0.85,
          economic_score: 0.62,
          satisfaction_score: 0.78,
          overall_performance: 0.75,
          policy_version: 3,
          learning_rate: 0.01,
          exploration_rate: 0.1,
          config: {},
          is_learning: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    }

    try {
      const { data, error } = await supabase
        .rpc('get_agent_performance', {
          p_agent_type: agentType
        });

      if (error) {
        console.error(`❌ Database error getting agent performance for ${agentType}:`, error);
        console.warn('⚠️ Switching to mock mode for this session');
        this.isDatabaseAvailable = false;
        return this.getAgentPerformance(agentType); // Retry in mock mode
      }
      
      return { success: true, data: data?.[0] || undefined };
    } catch (error) {
      console.error(`❌ Error getting agent performance for ${agentType}:`, error);
      console.warn('⚠️ Database operation failed, switching to mock mode for this session');
      this.isDatabaseAvailable = false;
      return this.getAgentPerformance(agentType); // Retry in mock mode
    }
  }

  // Conversion methods
  private convertTouristProfileToDb(profile: TouristProfile): Partial<DatabaseTouristProfile> {
    return {
      user_id: profile.id,
      preferred_crafts: profile.preferences.crafts,
      preferred_regions: profile.preferences.regions,
      preferred_experience_types: profile.preferences.experienceTypes as any[],
      cultural_depth: profile.preferences.culturalDepth,
      group_size: profile.preferences.groupSize,
      languages: profile.preferences.languages,
      cultural_interests: profile.culturalInterests,
      learning_style: profile.learningStyle.type,
      learning_pace: profile.learningStyle.pace,
      group_preference: profile.learningStyle.groupPreference,
      feedback_style: profile.learningStyle.feedbackStyle,
      budget_min: profile.budget.min,
      budget_max: profile.budget.max,
      budget_currency: profile.budget.currency,
      budget_flexibility: profile.budget.flexibility,
      time_duration: profile.timeAvailable.duration,
      time_unit: profile.timeAvailable.unit,
      time_flexibility: profile.timeAvailable.flexibility,
      preferred_times: profile.timeAvailable.preferredTimes,
      total_experiences: profile.experiences.length,
      successful_experiences: profile.experiences.filter(exp => exp.satisfaction > 0.7).length,
      average_satisfaction: profile.experiences.length > 0 
        ? profile.experiences.reduce((sum, exp) => sum + exp.satisfaction, 0) / profile.experiences.length 
        : 0
    };
  }

  private convertArtisanProfileToDb(profile: ArtisanProfile): Partial<DatabaseArtisanProfile> {
    // Map skill level to match database enum
    const mapSkillLevel = (level: string): 'beginner' | 'intermediate' | 'advanced' | 'master' | 'grandmaster' => {
      switch (level) {
        case 'apprentice': return 'beginner';
        case 'grandmaster': return 'grandmaster';
        default: return level as 'beginner' | 'intermediate' | 'advanced' | 'master' | 'grandmaster';
      }
    };

    return {
      artisan_id: profile.id,
      name: profile.name,
      craft: profile.craft,
      region: profile.region,
      skill_level: mapSkillLevel(profile.skillLevel),
      techniques: profile.techniques,
      cultural_knowledge: profile.culturalKnowledge,
      teaching_approach: profile.teachingStyle.approach,
      patience_level: profile.teachingStyle.patience,
      adaptability: profile.teachingStyle.adaptability,
      cultural_sensitivity: profile.teachingStyle.culturalSensitivity,
      language_skills: profile.teachingStyle.languageSkills,
      availability: profile.availability,
      monthly_target: profile.economicGoals.monthlyTarget,
      yearly_target: profile.economicGoals.yearlyTarget,
      growth_rate: profile.economicGoals.growthRate,
      diversification_goals: profile.economicGoals.diversificationGoals,
      total_tourists_hosted: 0,
      average_rating: 0,
      cultural_score: 0,
      economic_score: 0
    };
  }

  private convertExperienceToDb(experience: Experience): Partial<DatabaseExperience> {
    return {
      agent_type: 'tourist-matching', // Default for now
      state_data: experience.state,
      action_data: experience.action,
      action_type: experience.action.type,
      confidence: experience.action.confidence,
      reward: experience.reward,
      cultural_reward: experience.culturalValidation.score,
      economic_reward: experience.economicOutcome.sustainabilityImpact,
      satisfaction_reward: experience.nextState.engagementMetrics.satisfactionScore,
      next_state_data: experience.nextState,
      cultural_validation: experience.culturalValidation,
      economic_outcome: experience.economicOutcome,
      session_id: `session_${Date.now()}`,
      experiment_id: `exp_${Date.now()}`
    };
  }

  private convertRecommendationToDb(recommendation: Recommendation, agentType: AgentType): Partial<DatabaseRecommendation> {
    return {
      agent_type: agentType,
      tourist_profile_id: recommendation.id, // Note: This should be the tourist profile UUID, not the user ID
      artisan_profile_id: recommendation.artisan?.id,
      confidence: recommendation.confidence,
      cultural_score: recommendation.culturalScore,
      economic_score: recommendation.economicScore,
      overall_score: (recommendation.confidence + recommendation.culturalScore + recommendation.economicScore) / 3,
      reasoning: recommendation.reasoning,
      cultural_context: recommendation.reasoning, // Use reasoning as cultural context for now
      experience_type: 'hands-on-workshop', // Default experience type
      estimated_duration: 3, // Default 3 hours
      estimated_cost: 250, // Default cost
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      policy_version: 1
    };
  }

  // Utility methods
  async initializeDefaultData(): Promise<void> {
    if (!this.isSupabaseConfigured) {
      console.log('🔧 Mock: Initializing default RL data');
      return;
    }

    // Initialize default agent performance records
    const agentTypes: AgentType[] = ['tourist-matching', 'artisan-development', 'content-creation', 'cultural-validation', 'economic-optimization'];
    
    for (const agentType of agentTypes) {
      const { data } = await this.getAgentPerformance(agentType);
      if (!data) {
        await this.updateAgentPerformance(agentType, {
          experienceCount: 0,
          culturalScore: 0.5,
          economicScore: 0.5,
          satisfactionScore: 0.5,
          policyVersion: 1,
          isLearning: false,
          config: {
            learningRate: 0.01,
            discountFactor: 0.95,
            explorationRate: 0.1,
            batchSize: 32,
            culturalWeight: 0.4,
            economicWeight: 0.3,
            satisfactionWeight: 0.3
          }
        });
      }
    }
  }
}

export const rlDatabaseService = new RLDatabaseService(); 