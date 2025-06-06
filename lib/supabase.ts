// Supabase Client Configuration for Morocco Made Real
import { createClient } from '@supabase/supabase-js';

// Database type definitions
export interface Database {
  public: {
    Tables: {
      artisan_pieces: {
        Row: {
          id: string;
          artisan_id: string;
          title: string;
          description: string;
          price: number;
          blockchain_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['artisan_pieces']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['artisan_pieces']['Insert']>;
      };
      digital_certificates: {
        Row: {
          id: string;
          piece_id: string;
          certificate_data: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['digital_certificates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['digital_certificates']['Insert']>;
      };
      museum_extracts: {
        Row: {
          id: string;
          piece_id: string;
          extract_data: any;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['museum_extracts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['museum_extracts']['Insert']>;
      };
      artisans: {
        Row: {
          id: string;
          name: string;
          email: string;
          bio?: string;
          region: string;
          specialization: string;
          verified: boolean;
          verification_level: 'bronze' | 'silver' | 'gold' | 'master';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['artisans']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['artisans']['Insert']>;
      };
    };
    Enums: {
      piece_status: 'draft' | 'pending_review' | 'approved' | 'published' | 'archived';
      verification_level: 'bronze' | 'silver' | 'gold' | 'master';
      certificate_type: 'authenticity' | 'provenance' | 'quality' | 'cultural_heritage' | 'master_craft';
    };
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// Check if Supabase is configured
const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Create Supabase client (even with placeholder values for development)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log mode
if (!isSupabaseConfigured) {
  console.warn('⚠️ Supabase environment variables not found. Running in DEVELOPMENT MODE.');
  console.warn('📋 Database operations will fail gracefully. See WHATSAPP_VERIFICATION_SETUP.md for full setup.');
}

// Supabase Service Class
export class SupabaseService {
  private client = supabase;
  private isMockMode = !isSupabaseConfigured;

  async createArtisanPiece(piece: any) {
    if (this.isMockMode) {
      console.log('🔧 Mock: Creating artisan piece:', piece.title);
      return { success: true, id: `mock_${Date.now()}` };
    }
    
    try {
      const { data, error } = await this.client
        .from('artisan_pieces')
        .insert(piece)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating artisan piece:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getArtisanPieces() {
    if (this.isMockMode) {
      console.log('🔧 Mock: Fetching artisan pieces');
      return { success: true, data: [] };
    }
    
    try {
      const { data, error } = await this.client
        .from('artisan_pieces')
        .select('*');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching artisan pieces:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createDigitalCertificate(certificate: any) {
    if (this.isMockMode) {
      console.log('🔧 Mock: Creating digital certificate:', certificate.id || 'new certificate');
      return { success: true, id: certificate.id || `cert_${Date.now()}` };
    }
    
    try {
      const { data, error } = await this.client
        .from('digital_certificates')
        .insert(certificate)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating digital certificate:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async validateCertificate(certificateId: string) {
    if (this.isMockMode) {
      console.log('🔧 Mock: Validating certificate:', certificateId);
      return { success: true, valid: true };
    }
    
    try {
      const { data, error } = await this.client
        .from('digital_certificates')
        .select('*')
        .eq('id', certificateId)
        .single();
      
      if (error) throw error;
      return { success: true, valid: !!data, data };
    } catch (error) {
      console.error('Error validating certificate:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async createMuseumExtract(extract: any) {
    if (this.isMockMode) {
      console.log('🔧 Mock: Creating museum extract:', extract.title || 'new extract');
      return { success: true, id: `extract_${Date.now()}` };
    }
    
    try {
      const { data, error } = await this.client
        .from('museum_extracts')
        .insert(extract)
        .select()
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating museum extract:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getMuseumExtracts() {
    if (this.isMockMode) {
      console.log('🔧 Mock: Fetching museum extracts');
      return { success: true, data: [] };
    }
    
    try {
      const { data, error } = await this.client
        .from('museum_extracts')
        .select('*');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching museum extracts:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getAnalytics() {
    if (this.isMockMode) {
      console.log('🔧 Mock: Fetching analytics');
      return { success: true, data: { totalPieces: 0, totalCertificates: 0 } };
    }
    
    try {
      // Get counts from different tables
      const [piecesResult, certificatesResult] = await Promise.all([
        this.client.from('artisan_pieces').select('id', { count: 'exact' }),
        this.client.from('digital_certificates').select('id', { count: 'exact' })
      ]);

      return {
        success: true,
        data: {
          totalPieces: piecesResult.count || 0,
          totalCertificates: certificatesResult.count || 0
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export service instance
export const supabaseService = new SupabaseService(); 