// SMS Service for Phone Verification
// Supports multiple providers: Twilio, Textbelt, AWS SNS, and WhatsApp

import { whatsappVerificationService, WhatsAppVerificationResult } from './whatsapp-verification-service';

interface SMSResponse {
  success: boolean;
  messageId?: string;
  whatsappUrl?: string;
  method?: 'sms' | 'whatsapp';
  error?: string;
}

class SMSService {
  
  /**
   * Send SMS using Twilio (Recommended)
   */
  async sendViaTwilio(phone: string, code: string): Promise<SMSResponse> {
    try {
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: process.env.TWILIO_PHONE_NUMBER || '',
          To: phone,
          Body: `🇲🇦 Morocco Made Real verification code: ${code}\n\nValid for 10 minutes. Don't share this code with anyone.`
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, messageId: result.sid, method: 'sms' };
      } else {
        return { success: false, error: result.message, method: 'sms' };
      }
      
    } catch (error) {
      return { success: false, error: error?.message || 'Twilio SMS failed', method: 'sms' };
    }
  }

  /**
   * Send SMS using Textbelt (Budget Option - $0.001/SMS)
   */
  async sendViaTextbelt(phone: string, code: string): Promise<SMSResponse> {
    try {
      const response = await fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone,
          message: `Morocco Made Real verification: ${code}`,
          key: process.env.TEXTBELT_API_KEY
        })
      });

      const result = await response.json();
      
      if (result.success) {
        return { success: true, messageId: result.textId, method: 'sms' };
      } else {
        return { success: false, error: result.error, method: 'sms' };
      }
      
    } catch (error) {
      return { success: false, error: error?.message || 'Textbelt SMS failed', method: 'sms' };
    }
  }

  /**
   * Send SMS using Supabase Edge Function
   */
  async sendViaSupabase(phone: string, code: string): Promise<SMSResponse> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-sms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, code })
      });

      const result = await response.json();
      
      if (result.success) {
        return { ...result, method: 'sms' };
      } else {
        return { success: false, error: result.error, method: 'sms' };
      }
      
    } catch (error) {
      return { success: false, error: error?.message || 'Supabase SMS failed', method: 'sms' };
    }
  }

  /**
   * Send verification via WhatsApp
   */
  async sendViaWhatsApp(phone: string, code: string, options: any = {}): Promise<SMSResponse> {
    try {
      console.log('📱 Attempting WhatsApp verification for:', phone);
      
      const result = await whatsappVerificationService.sendWhatsAppVerification(phone, code, {
        method: options.whatsappMethod || 'link',
        language: options.language || 'en'
      });
      
      if (result.success) {
        return {
          success: true,
          messageId: result.verificationId,
          whatsappUrl: result.whatsappUrl,
          method: 'whatsapp'
        };
      } else {
        return {
          success: false,
          error: result.error || 'WhatsApp verification failed',
          method: 'whatsapp'
        };
      }
      
    } catch (error) {
      return { 
        success: false, 
        error: error?.message || 'WhatsApp verification failed',
        method: 'whatsapp'
      };
    }
  }

  /**
   * Mock SMS for development (current behavior)
   */
  async sendMockSMS(phone: string, code: string): Promise<SMSResponse> {
    console.log(`📱 MOCK SMS to ${phone}: Your verification code is ${code}`);
    
    // Simulate SMS delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { 
      success: true, 
      messageId: `mock_${Date.now()}`,
      method: 'sms'
    };
  }

  /**
   * Smart method selection based on country and preferences
   */
  private selectBestMethod(phone: string): { primary: string; fallback: string; useWhatsApp: boolean } {
    const countryCode = this.getCountryFromPhone(phone);
    
    // Countries with high WhatsApp usage - prefer WhatsApp
    const highWhatsAppCountries = ['MA', 'EG', 'IN', 'BR', 'AR', 'MX', 'ES', 'IT'];
    
    // Countries with good SMS infrastructure - prefer SMS
    const goodSmsCountries = ['US', 'CA', 'GB', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK'];
    
    if (highWhatsAppCountries.includes(countryCode)) {
      return {
        primary: 'whatsapp',
        fallback: process.env.SMS_PROVIDER || 'mock',
        useWhatsApp: true
      };
    } else if (goodSmsCountries.includes(countryCode)) {
      return {
        primary: process.env.SMS_PROVIDER || 'mock',
        fallback: 'whatsapp',
        useWhatsApp: false
      };
    } else {
      // Default: try WhatsApp first, fallback to SMS
      return {
        primary: 'whatsapp',
        fallback: process.env.SMS_PROVIDER || 'mock',
        useWhatsApp: true
      };
    }
  }

  /**
   * Main send method - intelligently chooses best available method
   */
  async sendVerificationSMS(phone: string, code: string, options: any = {}): Promise<SMSResponse> {
    // Check user preferences
    const forceWhatsApp = options.preferWhatsApp || process.env.PREFER_WHATSAPP === 'true';
    const forceSMS = options.preferSMS || process.env.PREFER_SMS === 'true';
    
    let selectedMethod: string;
    let fallbackMethod: string;
    
    if (forceWhatsApp) {
      selectedMethod = 'whatsapp';
      fallbackMethod = process.env.SMS_PROVIDER || 'mock';
    } else if (forceSMS) {
      selectedMethod = process.env.SMS_PROVIDER || 'mock';
      fallbackMethod = 'whatsapp';
    } else {
      // Smart selection based on country
      const methodSelection = this.selectBestMethod(phone);
      selectedMethod = methodSelection.primary;
      fallbackMethod = methodSelection.fallback;
    }
    
    console.log(`📤 Sending verification via ${selectedMethod} to ${phone} (fallback: ${fallbackMethod})`);
    
    // Try primary method
    let result = await this.sendByMethod(selectedMethod, phone, code, options);
    
    // If primary fails and it's production, try fallback
    if (!result.success && process.env.NODE_ENV === 'production' && fallbackMethod !== selectedMethod) {
      console.log(`⚠️ ${selectedMethod} failed, trying fallback: ${fallbackMethod}`);
      result = await this.sendByMethod(fallbackMethod, phone, code, options);
    }
    
    return result;
  }

  /**
   * Send using specific method
   */
  private async sendByMethod(method: string, phone: string, code: string, options: any = {}): Promise<SMSResponse> {
    switch (method) {
      case 'whatsapp':
        return this.sendViaWhatsApp(phone, code, options);
        
      case 'twilio':
        if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
          console.warn('⚠️ Twilio credentials missing');
          return { success: false, error: 'Twilio not configured', method: 'sms' };
        }
        return this.sendViaTwilio(phone, code);
        
      case 'textbelt':
        if (!process.env.TEXTBELT_API_KEY) {
          console.warn('⚠️ Textbelt API key missing');
          return { success: false, error: 'Textbelt not configured', method: 'sms' };
        }
        return this.sendViaTextbelt(phone, code);
        
      case 'supabase':
        return this.sendViaSupabase(phone, code);
        
      case 'mock':
      default:
        return this.sendMockSMS(phone, code);
    }
  }

  /**
   * Generate multiple verification options for user choice
   */
  async generateVerificationOptions(phone: string, code: string): Promise<{
    sms?: SMSResponse;
    whatsapp?: SMSResponse;
    recommended: 'sms' | 'whatsapp';
  }> {
    const results: any = {};
    const methodSelection = this.selectBestMethod(phone);
    
    // Generate WhatsApp option
    try {
      results.whatsapp = await this.sendViaWhatsApp(phone, code, { whatsappMethod: 'link' });
    } catch (error) {
      console.error('Failed to generate WhatsApp option:', error);
    }
    
    // Generate SMS option (just prepare, don't send)
    results.sms = {
      success: true,
      messageId: `sms_prepared_${Date.now()}`,
      method: 'sms'
    };
    
    results.recommended = methodSelection.useWhatsApp ? 'whatsapp' : 'sms';
    
    return results;
  }

  private getCountryFromPhone(phone: string): string {
    // Remove all non-digits except +
    let normalized = phone.replace(/[^\d+]/g, '');
    if (!normalized.startsWith('+')) {
      normalized = '+' + normalized;
    }
    
    // Extended country detection
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
}

export const smsService = new SMSService();
export default smsService; 