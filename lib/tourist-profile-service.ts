import { supabase } from '@/lib/supabase';
import { smsService } from '@/lib/sms-service';

// Check if Supabase is configured with more robust checking
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Force development mode if NODE_ENV is development OR if Supabase is not configured
const isSupabaseConfigured = process.env.NODE_ENV === 'development' 
  ? false // Always use development mode in development
  : !!(
      supabaseUrl && 
      supabaseKey && 
      supabaseUrl.trim() !== '' && 
      supabaseKey.trim() !== '' &&
      supabaseUrl !== 'https://placeholder.supabase.co' && 
      supabaseKey !== 'placeholder_key'
    );

// Debug logging
console.log('🔧 Supabase Configuration Check:', {
  nodeEnv: process.env.NODE_ENV,
  url: supabaseUrl ? 'SET' : 'NOT SET',
  key: supabaseKey ? 'SET' : 'NOT SET',
  isConfigured: isSupabaseConfigured,
  forcedDevelopmentMode: process.env.NODE_ENV === 'development'
});

// Phone-based Tourist Profile Service
// Perfect for international tourists - always have their phone!

export interface TouristProfile {
  id: string;
  phone: string;
  first_name?: string;
  country_code?: string;
  preferences: {
    mood: string;
    timeAvailable: string;
    priceRange: string;
  };
  saved_experiences: string[];
  booking_history: string[];
  preferences_set: boolean;
  total_bookings: number;
  total_spent: number;
  phone_verified: boolean;
  current_visit?: {
    arrival_date?: string;
    departure_date?: string;
    group_size?: number;
    hotel_location?: string;
  };
  whatsapp_enabled: boolean;
  sms_enabled: boolean;
  marketing_consent: boolean;
  created_at: string;
  last_active: string;
}

export interface PhoneVerification {
  phone: string;
  code: string;
  expires_at: string;
}

class TouristProfileService {
  
  // ============ PHONE VERIFICATION ============
  
  /**
   * Send verification code with multiple options (SMS + WhatsApp)
   * - Development: Shows code in UI + sends via chosen method
   * - Production: Only sends via chosen method (no code display)
   */
  async sendVerificationCode(
    phone: string, 
    options: { 
      method?: 'auto' | 'sms' | 'whatsapp'; 
      language?: 'en' | 'fr' | 'es' | 'ar';
      preferWhatsApp?: boolean;
    } = {}
  ): Promise<{ success: boolean; code?: string; whatsappUrl?: string; method?: string; error?: string }> {
    try {
      // Force development mode if NODE_ENV is development
      const isDevelopmentMode = process.env.NODE_ENV === 'development' || !isSupabaseConfigured;
      
      // Check Supabase configuration first - before any processing
      console.log('🔍 Checking Supabase configuration in sendVerificationCode:', {
        nodeEnv: process.env.NODE_ENV,
        isSupabaseConfigured,
        isDevelopmentMode,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
      });
      
      if (isDevelopmentMode) {
        console.warn('⚠️ Running in DEVELOPMENT MODE - skipping all database operations');
        
        // Generate code for development mode without database storage
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const normalizedPhone = this.normalizePhone(phone);
        
        console.log('🔐 Development mode - Generated code:', code, 'for phone:', normalizedPhone);
        
        // Generate WhatsApp URL for development
        const { smsService } = await import('./sms-service');
        const smsResult = await smsService.sendVerificationSMS(normalizedPhone, code, { 
          preferWhatsApp: true,
          language: options.language
        });
        
        console.log('✅ Development mode early return executed successfully');
        return { 
          success: true, 
          code: code,
          whatsappUrl: smsResult.whatsappUrl,
          method: 'whatsapp'
        };
      }

      console.log('📱 Production mode - Supabase is configured, proceeding with normal flow...');

      // Normalize phone number
      const normalizedPhone = this.normalizePhone(phone);
      console.log('📱 Generating verification code for:', normalizedPhone);
      
      // Validate phone number format (basic check)
      if (!this.isValidPhoneNumber(normalizedPhone)) {
        return { 
          success: false, 
          error: 'Please enter a valid international phone number (e.g., +1-555-123-4567)' 
        };
      }
      
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      console.log('🔐 Generated code:', code, 'expires at:', expiresAt);
      
      // Store verification code in database with better error handling
      try {
        // Skip database operations if Supabase is not configured
        if (!isSupabaseConfigured) {
          console.warn('⚠️ Supabase not configured. Running in development mode without database storage.');
        } else {
          const { data, error } = await supabase
            .from('tourist_profiles_phone')
            .upsert({
              phone: normalizedPhone,
              verification_code: code,
              verification_expires_at: expiresAt.toISOString(),
              phone_verified: false,
              country_code: this.getCountryFromPhone(normalizedPhone)
            });
          
          if (error) {
            console.error('💥 Supabase upsert error:', {
              message: error.message || 'Unknown error',
              details: error.details || 'No details',
              hint: error.hint || 'No hint',
              code: error.code || 'No code',
              fullError: JSON.stringify(error)
            });
            
            // For development, continue without database storage
            if (process.env.NODE_ENV === 'development') {
              console.warn('🔄 Development mode: Continuing without database storage');
            } else {
              throw error;
            }
          } else {
            console.log('✅ Verification code stored in database successfully');
            // Note: data might be null for upsert operations, which is normal
          }
        }
      } catch (dbError) {
        console.error('💥 Database operation failed:', dbError);
        
        // In development, continue without database storage
        if (process.env.NODE_ENV === 'development') {
          console.warn('🔄 Development mode: Continuing without database, using memory storage');
        } else {
          throw dbError;
        }
      }
      
      // Determine best verification method
      let selectedMethod = options.method || 'auto';
      let whatsappUrl: string | undefined;
      
      if (selectedMethod === 'auto') {
        // Smart method selection based on country and preferences
        const countryCode = this.getCountryFromPhone(normalizedPhone);
        const highWhatsAppCountries = ['MA', 'EG', 'IN', 'BR', 'AR', 'MX', 'ES', 'IT'];
        
        if (options.preferWhatsApp || highWhatsAppCountries.includes(countryCode)) {
          selectedMethod = 'whatsapp';
        } else {
          selectedMethod = 'sms';
        }
      }
      
      // Send via selected method
      const { smsService } = await import('./sms-service');
      
      if (selectedMethod === 'whatsapp') {
        const smsResult = await smsService.sendVerificationSMS(normalizedPhone, code, { 
          preferWhatsApp: true,
          language: options.language
        });
        
        if (smsResult.success) {
          whatsappUrl = smsResult.whatsappUrl;
          console.log('✅ WhatsApp verification ready:', smsResult.messageId);
        } else {
          console.error('📱 WhatsApp verification failed:', smsResult.error);
          // Fallback to SMS if WhatsApp fails
          selectedMethod = 'sms';
        }
      }
      
      if (selectedMethod === 'sms') {
        const smsResult = await smsService.sendVerificationSMS(normalizedPhone, code, { 
          preferSMS: true 
        });
        
        if (!smsResult.success) {
          console.error('📱 SMS sending failed:', smsResult.error);
          // Don't fail the whole process if SMS fails in development
          if (process.env.NODE_ENV === 'production') {
            return { 
              success: false, 
              error: `Failed to send verification: ${smsResult.error}` 
            };
          }
        } else {
          console.log('✅ SMS sent successfully:', smsResult.messageId);
        }
      }
      
      // Return code for development mode only
      const shouldShowCode = process.env.NODE_ENV === 'development' || 
                           process.env.SMS_PROVIDER === 'mock';
      
      return { 
        success: true, 
        code: shouldShowCode ? code : undefined,
        whatsappUrl,
        method: selectedMethod
      };
      
    } catch (error) {
      console.error('💥 Error sending verification code:', {
        error: error || 'Unknown error',
        message: error?.message || 'Unknown error message',
        stack: error?.stack || 'No stack trace',
        name: error?.name || 'Unknown error type'
      });
      
      // Check if it's a table doesn't exist error
      if (error?.message?.includes('relation "tourist_profiles_phone" does not exist')) {
        return { 
          success: false, 
          error: 'Database not set up. Please run the phone profiles migration.' 
        };
      }
      
      return { 
        success: false, 
        error: error?.message || 'Failed to send verification code' 
      };
    }
  }
  
  /**
   * Verify phone number with SMS code
   */
  async verifyPhoneCode(phone: string, code: string): Promise<{ success: boolean; profile?: TouristProfile; error?: string }> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      // Development mode: accept any 6-digit code
      if (!isSupabaseConfigured) {
        console.warn('⚠️ Development mode: Accepting verification code without database check');
        if (code.length === 6 && /^\d+$/.test(code)) {
          const mockProfile: TouristProfile = {
            id: `dev_${Date.now()}`,
            phone: normalizedPhone,
            country_code: this.getCountryFromPhone(normalizedPhone),
            preferences: { mood: '', timeAvailable: '', priceRange: '' },
            saved_experiences: [],
            booking_history: [],
            preferences_set: false,
            total_bookings: 0,
            total_spent: 0,
            phone_verified: false,
            whatsapp_enabled: true,
            sms_enabled: true,
            marketing_consent: false,
            created_at: new Date().toISOString(),
            last_active: new Date().toISOString()
          };
          return { success: true, profile: mockProfile };
        } else {
          return { success: false, error: 'Please enter a valid 6-digit code' };
        }
      }
      
      // Check verification code
      const { data, error } = await supabase
        .from('tourist_profiles_phone')
        .select('*')
        .eq('phone', normalizedPhone)
        .eq('verification_code', code)
        .gt('verification_expires_at', new Date().toISOString())
        .single();
      
      if (error || !data) {
        return { success: false, error: 'Invalid or expired verification code' };
      }
      
      // Mark as verified
      const { data: updatedProfile, error: updateError } = await supabase
        .from('tourist_profiles_phone')
        .update({ 
          phone_verified: true, 
          verification_code: null,
          verification_expires_at: null,
          last_active: new Date().toISOString()
        })
        .eq('phone', normalizedPhone)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      return { success: true, profile: updatedProfile };
      
    } catch (error) {
      console.error('Error verifying phone code:', error);
      return { success: false, error: 'Failed to verify code' };
    }
  }
  
  // ============ PROFILE MANAGEMENT ============
  
  /**
   * Get or create tourist profile by phone
   */
  async getProfile(phone: string): Promise<TouristProfile | null> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      // Development mode: return mock profile
      if (!isSupabaseConfigured) {
        console.warn('⚠️ Development mode: Returning mock profile');
        return {
          id: `dev_${Date.now()}`,
          phone: normalizedPhone,
          country_code: this.getCountryFromPhone(normalizedPhone),
          preferences: { mood: '', timeAvailable: '', priceRange: '' },
          saved_experiences: [],
          booking_history: [],
          preferences_set: false,
          total_bookings: 0,
          total_spent: 0,
          phone_verified: false,
          whatsapp_enabled: true,
          sms_enabled: true,
          marketing_consent: false,
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        };
      }
      
      const { data, error } = await supabase
        .from('tourist_profiles_phone')
        .select('*')
        .eq('phone', normalizedPhone)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Not found is ok
        throw error;
      }
      
      return data;
      
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }
  
  /**
   * Create or update tourist profile
   */
  async upsertProfile(
    phone: string, 
    profileData: Partial<TouristProfile>
  ): Promise<{ success: boolean; profile?: TouristProfile; error?: string }> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      // Use database function for atomic upsert
      const { data, error } = await supabase
        .rpc('upsert_tourist_profile', {
          p_phone: normalizedPhone,
          p_first_name: profileData.first_name,
          p_country_code: profileData.country_code,
          p_preferences: profileData.preferences ? JSON.stringify(profileData.preferences) : null
        });
      
      if (error) throw error;
      
      // Fetch updated profile
      const profile = await this.getProfile(normalizedPhone);
      
      return { success: true, profile: profile || undefined };
      
    } catch (error) {
      console.error('Error upserting profile:', error);
      return { success: false, error: 'Failed to save profile' };
    }
  }
  
  /**
   * Update preferences only
   */
  async updatePreferences(phone: string, preferences: any): Promise<boolean> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      const { error } = await supabase
        .from('tourist_profiles_phone')
        .update({ 
          preferences: JSON.stringify(preferences),
          preferences_set: true,
          last_active: new Date().toISOString()
        })
        .eq('phone', normalizedPhone);
      
      if (error) throw error;
      return true;
      
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }
  
  // ============ SAVED EXPERIENCES ============
  
  /**
   * Add experience to saved list
   */
  async saveExperience(phone: string, experienceId: string): Promise<boolean> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      const { data, error } = await supabase
        .rpc('add_saved_experience', {
          p_phone: normalizedPhone,
          p_experience_id: experienceId
        });
      
      if (error) throw error;
      return true;
      
    } catch (error) {
      console.error('Error saving experience:', error);
      return false;
    }
  }
  
  /**
   * Get saved experiences for user
   */
  async getSavedExperiences(phone: string): Promise<string[]> {
    try {
      const profile = await this.getProfile(phone);
      return profile?.saved_experiences || [];
      
    } catch (error) {
      console.error('Error getting saved experiences:', error);
      return [];
    }
  }
  
  // ============ BOOKING MANAGEMENT ============
  
  /**
   * Add booking to history
   */
  async addBooking(phone: string, bookingId: string, amount: number = 0): Promise<boolean> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      const { data, error } = await supabase
        .rpc('add_booking_to_history', {
          p_phone: normalizedPhone,
          p_booking_id: bookingId,
          p_booking_amount: amount
        });
      
      if (error) throw error;
      return true;
      
    } catch (error) {
      console.error('Error adding booking:', error);
      return false;
    }
  }
  
  /**
   * Get booking history for user
   */
  async getBookingHistory(phone: string): Promise<string[]> {
    try {
      const profile = await this.getProfile(phone);
      return profile?.booking_history || [];
      
    } catch (error) {
      console.error('Error getting booking history:', error);
      return [];
    }
  }
  
  /**
   * Check if user has booked specific experience
   */
  async hasBookedExperience(phone: string, experienceId: string): Promise<boolean> {
    try {
      const bookingHistory = await this.getBookingHistory(phone);
      return bookingHistory.includes(experienceId);
      
    } catch (error) {
      console.error('Error checking booking:', error);
      return false;
    }
  }
  
  // ============ VISIT MANAGEMENT ============
  
  /**
   * Update current visit information
   */
  async updateCurrentVisit(phone: string, visitInfo: any): Promise<boolean> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      const { error } = await supabase
        .from('tourist_profiles_phone')
        .update({ 
          current_visit: JSON.stringify(visitInfo),
          last_active: new Date().toISOString()
        })
        .eq('phone', normalizedPhone);
      
      if (error) throw error;
      return true;
      
    } catch (error) {
      console.error('Error updating visit info:', error);
      return false;
    }
  }
  
  // ============ UTILITY FUNCTIONS ============
  
  /**
   * Normalize phone number to international format
   */
  private normalizePhone(phone: string): string {
    // Remove all non-digits and spaces/dashes
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Add + if missing
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  }
  
  /**
   * Get country from phone number
   */
  getCountryFromPhone(phone: string): string {
    const normalized = this.normalizePhone(phone);
    
    // Extended country detection for international tourists
    if (normalized.startsWith('+212')) return 'MA'; // Morocco
    if (normalized.startsWith('+33')) return 'FR';  // France
    if (normalized.startsWith('+1')) return 'US';   // USA/Canada
    if (normalized.startsWith('+44')) return 'GB';  // UK
    if (normalized.startsWith('+49')) return 'DE';  // Germany
    if (normalized.startsWith('+34')) return 'ES';  // Spain
    if (normalized.startsWith('+39')) return 'IT';  // Italy
    if (normalized.startsWith('+31')) return 'NL';  // Netherlands
    if (normalized.startsWith('+32')) return 'BE';  // Belgium
    if (normalized.startsWith('+41')) return 'CH';  // Switzerland
    if (normalized.startsWith('+43')) return 'AT';  // Austria
    if (normalized.startsWith('+351')) return 'PT'; // Portugal
    if (normalized.startsWith('+46')) return 'SE';  // Sweden
    if (normalized.startsWith('+47')) return 'NO';  // Norway
    if (normalized.startsWith('+45')) return 'DK';  // Denmark
    if (normalized.startsWith('+358')) return 'FI'; // Finland
    if (normalized.startsWith('+61')) return 'AU';  // Australia
    if (normalized.startsWith('+81')) return 'JP';  // Japan
    if (normalized.startsWith('+82')) return 'KR';  // South Korea
    if (normalized.startsWith('+86')) return 'CN';  // China
    if (normalized.startsWith('+91')) return 'IN';  // India
    if (normalized.startsWith('+55')) return 'BR';  // Brazil
    if (normalized.startsWith('+52')) return 'MX';  // Mexico
    if (normalized.startsWith('+27')) return 'ZA';  // South Africa
    if (normalized.startsWith('+20')) return 'EG';  // Egypt
    if (normalized.startsWith('+971')) return 'AE'; // UAE
    if (normalized.startsWith('+966')) return 'SA'; // Saudi Arabia
    
    return 'XX'; // Unknown
  }
  
  /**
   * Activity tracking
   */
  async updateLastActive(phone: string): Promise<void> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      await supabase
        .from('tourist_profiles_phone')
        .update({ last_active: new Date().toISOString() })
        .eq('phone', normalizedPhone);
        
    } catch (error) {
      console.error('Error updating last active:', error);
    }
  }

  /**
   * Basic phone number validation
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Check if it starts with + and has enough digits
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Generate verification options for user choice
   */
  async generateVerificationOptions(phone: string): Promise<{
    sms: { available: boolean; recommended?: boolean };
    whatsapp: { available: boolean; recommended?: boolean; url?: string };
    defaultMethod: 'sms' | 'whatsapp';
    code?: string;
  }> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      // Generate verification code first
      const result = await this.sendVerificationCode(normalizedPhone, { method: 'whatsapp' });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate verification');
      }
      
      const countryCode = this.getCountryFromPhone(normalizedPhone);
      
      // Determine availability and recommendations
      const highWhatsAppCountries = ['MA', 'EG', 'IN', 'BR', 'AR', 'MX', 'ES', 'IT'];
      const goodSmsCountries = ['US', 'CA', 'GB', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK'];
      
      const whatsappRecommended = highWhatsAppCountries.includes(countryCode);
      const smsRecommended = goodSmsCountries.includes(countryCode);
      
      return {
        sms: {
          available: true,
          recommended: smsRecommended && !whatsappRecommended
        },
        whatsapp: {
          available: !!result.whatsappUrl,
          recommended: whatsappRecommended,
          url: result.whatsappUrl
        },
        defaultMethod: whatsappRecommended ? 'whatsapp' : 'sms',
        code: result.code // For development
      };
      
    } catch (error) {
      console.error('Error generating verification options:', error);
      
      // Fallback options
      return {
        sms: { available: true, recommended: true },
        whatsapp: { available: false },
        defaultMethod: 'sms'
      };
    }
  }
}

// Singleton instance
export const touristProfileService = new TouristProfileService();

// For demo purposes - get demo profiles
export const DEMO_PHONES = {
  SARAH: '+212-6-12-34-56-78',    // French tourist in Morocco
  AHMED: '+33-6-98-76-54-32',     // French-Moroccan diaspora  
  LISA: '+1-555-123-4567'         // American backpacker
};

export default touristProfileService; 