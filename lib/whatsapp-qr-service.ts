// WhatsApp QR Code Auto-Validation Service
// Generates QR codes that trigger automatic validation when user sends WhatsApp message

import { whatsappVerificationService } from './whatsapp-verification-service';
import { supabase } from './supabase';

export interface QRVerificationSession {
  id: string;
  phone: string;
  code: string;
  qrData: string;
  whatsappUrl: string;
  status: 'pending' | 'verified' | 'expired';
  expiresAt: string;
  createdAt: string;
}

class WhatsAppQRService {

  /**
   * Generate QR Code for Auto-Validation Flow
   * User scans QR → WhatsApp opens → User sends message → Auto verification
   */
  async generateAutoValidationQR(phone: string): Promise<{
    success: boolean;
    qrSession?: QRVerificationSession;
    qrCodeData?: string;
    whatsappUrl?: string;
    error?: string;
  }> {
    try {
      console.log('🚀 Generating WhatsApp QR auto-validation for:', phone);
      
      // Generate session ID and verification code
      const sessionId = `qr_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // Generate WhatsApp URL with pre-filled message
      const message = this.generateAutoValidationMessage(code, sessionId);
      const normalizedPhone = phone.replace(/\D/g, ''); // Remove non-digits
      const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
      
      // Create QR session object
      const qrSession: QRVerificationSession = {
        id: sessionId,
        phone: phone,
        code: code,
        qrData: whatsappUrl,
        whatsappUrl: whatsappUrl,
        status: 'pending',
        expiresAt: expiresAt.toISOString(),
        createdAt: new Date().toISOString()
      };
      
      // Store session in database (with development mode fallback)
      try {
        await this.storeVerificationSession(qrSession);
      } catch (dbError) {
        console.warn('⚠️  Database storage failed, continuing in memory mode:', dbError);
        // In development mode, continue without database storage
        if (process.env.NODE_ENV !== 'development') {
          throw dbError;
        }
      }
      
      console.log('✅ QR auto-validation session created:', {
        sessionId,
        phone,
        code: process.env.NODE_ENV === 'development' ? code : '******',
        expiresAt: expiresAt.toLocaleTimeString()
      });
      
      return {
        success: true,
        qrSession,
        qrCodeData: whatsappUrl,
        whatsappUrl
      };
      
    } catch (error) {
      console.error('💥 Error generating QR auto-validation:', error);
      return {
        success: false,
        error: error?.message || 'Failed to generate QR auto-validation'
      };
    }
  }

  /**
   * Generate WhatsApp message for auto-validation
   */
  private generateAutoValidationMessage(code: string, sessionId: string): string {
    return `🇲🇦 Morocco Made Real - Auto Verification

Your verification code: ${code}

📱 Just send this message and you'll be automatically verified!

Session: ${sessionId}
Valid for 10 minutes.

🔒 Don't share this code with anyone.`;
  }

  /**
   * Store verification session for webhook processing
   */
  private async storeVerificationSession(session: QRVerificationSession): Promise<void> {
    try {
      // Check if Supabase is configured before attempting database operations
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const isSupabaseConfigured = !!(supabaseUrl && supabaseKey && 
                                     supabaseUrl !== 'https://placeholder.supabase.co' && 
                                     supabaseKey !== 'placeholder_key');
      
      if (!isSupabaseConfigured) {
        console.warn('⚠️ Supabase not configured. Skipping database storage for QR session.');
        return;
      }

      // Store the verification code using existing tourist profile service with error handling
      try {
        const { touristProfileService } = await import('./tourist-profile-service');
        
        const result = await touristProfileService.sendVerificationCode(session.phone, {
          method: 'whatsapp'
        });
        
        if (!result.success) {
          console.warn('Could not store verification code via tourist profile service:', result.error);
          // Continue anyway in development mode
          if (process.env.NODE_ENV !== 'production') {
            return;
          }
        }
      } catch (profileServiceError) {
        console.warn('Tourist profile service failed:', profileServiceError);
        // In development mode, continue without failing
        if (process.env.NODE_ENV === 'development') {
          console.warn('🔄 Development mode: Continuing despite profile service error');
          return;
        }
        throw profileServiceError;
      }

      // Store additional QR session data
      const { error } = await supabase
        .from('whatsapp_qr_sessions')
        .insert({
          session_id: session.id,
          phone: session.phone,
          verification_code: session.code,
          qr_data: session.qrData,
          whatsapp_url: session.whatsappUrl,
          status: session.status,
          expires_at: session.expiresAt,
          created_at: session.createdAt
        });

      if (error) {
        console.warn('Could not store QR session in database:', error);
        // Continue anyway - the main verification code is stored via tourist profile service
      }

    } catch (error) {
      console.error('Error storing verification session:', error);
      // Don't fail the whole process if database storage fails
      if (process.env.NODE_ENV === 'development') {
        console.warn('🔄 Development mode: Continuing without database storage');
      } else {
        throw error;
      }
    }
  }

  /**
   * Check verification status for QR session
   */
  async checkVerificationStatus(sessionId: string): Promise<{
    success: boolean;
    status: 'pending' | 'verified' | 'expired' | 'not_found';
    profile?: any;
  }> {
    try {
      // Force development mode if NODE_ENV is development OR if Supabase is not configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      const isSupabaseConfigured = process.env.NODE_ENV === 'development' 
        ? false // Always use development mode in development
        : !!(supabaseUrl && supabaseKey && 
             supabaseUrl !== 'https://placeholder.supabase.co' && 
             supabaseKey !== 'placeholder_key');
      
      if (!isSupabaseConfigured) {
        console.log('⚠️ Development mode: Checking session storage for verification status');
        
        // In development mode, check localStorage or in-memory storage for verification status
        // This allows proper flow testing with manual webhook simulation
        try {
          const sessionStatus = localStorage?.getItem(`qr_session_${sessionId}`);
          if (sessionStatus === 'verified') {
            console.log('✅ Development mode: Session verified via webhook simulation');
            return { success: true, status: 'verified' };
          } else {
            console.log('🔄 Development mode: Session still pending verification');
            return { success: true, status: 'pending' };
          }
        } catch (error) {
          // If localStorage fails (SSR), default to pending
          console.log('🔄 Development mode: Defaulting to pending status');
          return { success: true, status: 'pending' };
        }
      }

      // Check in database
      const { data, error } = await supabase
        .from('whatsapp_qr_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error || !data) {
        return { success: false, status: 'not_found' };
      }

      // Check if expired
      if (new Date() > new Date(data.expires_at)) {
        return { success: true, status: 'expired' };
      }

      // Check if phone is verified
      const { touristProfileService } = await import('./tourist-profile-service');
      const profile = await touristProfileService.getProfile(data.phone);

      if (profile?.phone_verified) {
        // Update session status
        await supabase
          .from('whatsapp_qr_sessions')
          .update({ status: 'verified' })
          .eq('session_id', sessionId);

        return { success: true, status: 'verified', profile };
      }

      return { success: true, status: 'pending' };

    } catch (error) {
      console.error('Error checking verification status:', error);
      // In development mode, return pending status so user can experience proper flow
      if (process.env.NODE_ENV === 'development') {
        console.warn('🔄 Development mode: Returning pending status to allow proper flow testing');
        return { success: true, status: 'pending' };
      }
      return { success: false, status: 'not_found' };
    }
  }

  /**
   * Generate verification options including QR auto-validation
   */
  async generateVerificationOptions(phone: string): Promise<{
    link: { available: boolean; url?: string };
    qr: { available: boolean; qrData?: string; sessionId?: string };
    autoValidation: { available: boolean; qrData?: string; whatsappUrl?: string };
    recommended: 'link' | 'qr' | 'autoValidation';
  }> {
    try {
      // Generate standard link
      const linkResult = await whatsappVerificationService.generateWhatsAppLink(
        phone, 
        Math.floor(100000 + Math.random() * 900000).toString(),
        { method: 'link' }
      );

      // Generate auto-validation QR
      const qrResult = await this.generateAutoValidationQR(phone);

      // Determine recommendation based on device/context
      let recommended: 'link' | 'qr' | 'autoValidation' = 'autoValidation';
      
      // If on mobile, recommend direct link
      // If on desktop, recommend QR auto-validation
      // This could be determined on the frontend

      return {
        link: {
          available: linkResult.success,
          url: linkResult.whatsappUrl
        },
        qr: {
          available: qrResult.success,
          qrData: qrResult.qrCodeData,
          sessionId: qrResult.qrSession?.id
        },
        autoValidation: {
          available: qrResult.success,
          qrData: qrResult.qrCodeData,
          whatsappUrl: qrResult.whatsappUrl
        },
        recommended
      };

    } catch (error) {
      console.error('Error generating verification options:', error);
      return {
        link: { available: false },
        qr: { available: false },
        autoValidation: { available: false },
        recommended: 'link'
      };
    }
  }
}

// Export singleton instance
export const whatsappQRService = new WhatsAppQRService();
export default whatsappQRService; 