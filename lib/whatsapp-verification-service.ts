// WhatsApp Verification Service for Tourist Profiles
// Multiple approaches for international tourists who prefer WhatsApp

export interface WhatsAppVerificationResult {
  success: boolean;
  whatsappUrl?: string;
  qrCode?: string;
  verificationId?: string;
  error?: string;
}

export interface WhatsAppVerificationOptions {
  method: 'link' | 'qr' | 'business-api' | 'webhook';
  language?: 'en' | 'fr' | 'es' | 'ar';
  customMessage?: string;
}

class WhatsAppVerificationService {
  
  /**
   * Method 1: WhatsApp Web Link (Simplest - works immediately)
   * Opens WhatsApp with pre-filled verification message
   */
  async generateWhatsAppLink(phone: string, code: string, options: WhatsAppVerificationOptions = { method: 'link' }): Promise<WhatsAppVerificationResult> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      // Generate verification message in multiple languages
      const messages = {
        en: `🇲🇦 Morocco Made Real verification code: ${code}\n\nValid for 10 minutes. Reply with this code to verify your phone number.\n\nDon't share this code with anyone.`,
        fr: `🇲🇦 Code de vérification Morocco Made Real: ${code}\n\nValide 10 minutes. Répondez avec ce code pour vérifier votre numéro.\n\nNe partagez pas ce code.`,
        es: `🇲🇦 Código de verificación Morocco Made Real: ${code}\n\nVálido por 10 minutos. Responde con este código para verificar tu número.\n\nNo compartas este código.`,
        ar: `🇲🇦 رمز التحقق من Morocco Made Real: ${code}\n\nصالح لمدة 10 دقائق. رد بهذا الرمز للتحقق من رقم هاتفك.\n\nلا تشارك هذا الرمز.`
      };
      
      const message = options.customMessage || messages[options.language || 'en'];
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
      
      console.log('📱 WhatsApp verification link generated:', {
        phone: normalizedPhone,
        method: 'link',
        language: options.language || 'en'
      });
      
      return {
        success: true,
        whatsappUrl,
        verificationId: `whatsapp_link_${Date.now()}`
      };
      
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Failed to generate WhatsApp link'
      };
    }
  }
  
  /**
   * Method 2: QR Code for WhatsApp Web
   * Generate QR code that opens WhatsApp with verification message
   */
  async generateWhatsAppQR(phone: string, code: string, options: WhatsAppVerificationOptions = { method: 'qr' }): Promise<WhatsAppVerificationResult> {
    try {
      // First generate the WhatsApp link
      const linkResult = await this.generateWhatsAppLink(phone, code, options);
      
      if (!linkResult.success || !linkResult.whatsappUrl) {
        return linkResult;
      }
      
      // Generate QR code (we'll need to add qrcode package)
      // For now, return the data needed to generate QR on frontend
      const qrData = {
        url: linkResult.whatsappUrl,
        phone: this.normalizePhone(phone),
        code: code,
        timestamp: Date.now()
      };
      
      console.log('📱 WhatsApp QR code data generated');
      
      return {
        success: true,
        whatsappUrl: linkResult.whatsappUrl,
        qrCode: JSON.stringify(qrData), // Frontend can generate actual QR
        verificationId: `whatsapp_qr_${Date.now()}`
      };
      
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Failed to generate WhatsApp QR'
      };
    }
  }
  
  /**
   * Method 3: WhatsApp Business API (Most Professional)
   * Requires WhatsApp Business API setup - sends message automatically
   */
  async sendViaBusinessAPI(phone: string, code: string, options: WhatsAppVerificationOptions = { method: 'business-api' }): Promise<WhatsAppVerificationResult> {
    try {
      const normalizedPhone = this.normalizePhone(phone);
      
      // Check if WhatsApp Business API is configured
      if (!process.env.WHATSAPP_BUSINESS_API_TOKEN || !process.env.WHATSAPP_BUSINESS_PHONE_ID) {
        console.warn('⚠️ WhatsApp Business API not configured, falling back to link method');
        return this.generateWhatsAppLink(phone, code, options);
      }

      // Generate message based on language - simplified format
      const messages = {
        en: `Your verification code is ${code}`,
        fr: `Votre code de vérification: ${code}`,
        es: `Su código de verificación: ${code}`,
        ar: `رمز التحقق: ${code}`
      };

      const message = messages[options.language || 'en'];
      
      console.log('📤 Sending WhatsApp Business API message to:', normalizedPhone);
      
      const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_BUSINESS_PHONE_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_BUSINESS_API_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: normalizedPhone,
          type: 'text',
          text: {
            body: message
          }
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.messages && result.messages[0]) {
        console.log('✅ WhatsApp message sent successfully:', result.messages[0].id);
        return {
          success: true,
          verificationId: result.messages[0].id
        };
      } else {
        console.error('❌ WhatsApp Business API error:', result);
        throw new Error(result.error?.message || `API Error: ${response.status}`);
      }
      
    } catch (error) {
      console.error('💥 WhatsApp Business API error:', error);
      // Fallback to link method
      console.log('🔄 Falling back to WhatsApp link method');
      return this.generateWhatsAppLink(phone, code, options);
    }
  }
  
  /**
   * Method 4: Webhook Verification (Advanced)
   * Set up webhook to receive WhatsApp messages for automatic verification
   */
  async setupWebhookVerification(phone: string, code: string): Promise<WhatsAppVerificationResult> {
    try {
      // This would require setting up webhook endpoints
      // For now, return link method with special tracking
      const result = await this.generateWhatsAppLink(phone, code, { method: 'webhook' });
      
      if (result.success) {
        result.verificationId = `whatsapp_webhook_${Date.now()}`;
        
        // In a real implementation, you'd:
        // 1. Store the code and phone in database with webhook ID
        // 2. Set up webhook to listen for messages from this phone
        // 3. Auto-verify when user replies with correct code
        
        console.log('📱 WhatsApp webhook verification prepared');
      }
      
      return result;
      
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'Failed to setup webhook verification'
      };
    }
  }
  
  /**
   * Main verification method - chooses best available option
   */
  async sendWhatsAppVerification(
    phone: string, 
    code: string, 
    options: WhatsAppVerificationOptions = { method: 'link' }
  ): Promise<WhatsAppVerificationResult> {
    console.log(`📤 Sending WhatsApp verification via ${options.method} to ${phone}`);
    
    switch (options.method) {
      case 'business-api':
        return this.sendViaBusinessAPI(phone, code, options);
        
      case 'qr':
        return this.generateWhatsAppQR(phone, code, options);
        
      case 'webhook':
        return this.setupWebhookVerification(phone, code);
        
      case 'link':
      default:
        return this.generateWhatsAppLink(phone, code, options);
    }
  }
  
  /**
   * Verify code from WhatsApp message (for webhook method)
   */
  async verifyWhatsAppCode(phone: string, receivedCode: string, verificationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // This would check against stored verification codes
      // For now, delegate to the main tourist profile service
      const { touristProfileService } = await import('./tourist-profile-service');
      
      const result = await touristProfileService.verifyPhoneCode(phone, receivedCode);
      
      if (result.success) {
        console.log('✅ WhatsApp verification successful');
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
      
    } catch (error) {
      return {
        success: false,
        error: error?.message || 'WhatsApp verification failed'
      };
    }
  }
  
  /**
   * Generate country-specific WhatsApp verification
   */
  async generateCountrySpecificVerification(phone: string, code: string): Promise<WhatsAppVerificationResult> {
    const countryCode = this.getCountryFromPhone(phone);
    
    // Choose language based on country
    let language: 'en' | 'fr' | 'es' | 'ar' = 'en';
    if (['MA', 'DZ', 'TN', 'EG', 'SA', 'AE'].includes(countryCode)) {
      language = 'ar';
    } else if (['FR', 'BE', 'CH'].includes(countryCode)) {
      language = 'fr';
    } else if (['ES', 'MX', 'AR'].includes(countryCode)) {
      language = 'es';
    }
    
    // Choose method based on country preferences
    let method: 'link' | 'qr' | 'business-api' | 'webhook' = 'link';
    if (['MA', 'EG', 'IN', 'BR'].includes(countryCode)) {
      // Countries with high WhatsApp usage prefer direct links
      method = 'link';
    } else if (['DE', 'NL', 'US'].includes(countryCode)) {
      // Tech-savvy countries might prefer QR codes
      method = 'qr';
    }
    
    return this.sendWhatsAppVerification(phone, code, { method, language });
  }
  
  // ============ UTILITY FUNCTIONS ============
  
  private normalizePhone(phone: string): string {
    // Remove all non-digits except +
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    // Add + if missing
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    // Remove + for WhatsApp (they expect just numbers)
    return cleaned.substring(1);
  }
  
  private getCountryFromPhone(phone: string): string {
    const normalized = '+' + this.normalizePhone(phone);
    
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

// Export singleton instance
export const whatsappVerificationService = new WhatsAppVerificationService();
export default whatsappVerificationService; 