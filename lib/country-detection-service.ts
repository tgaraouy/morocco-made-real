// Enhanced Country Detection Service
// Provides intelligent country detection with WhatsApp usage statistics

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
  whatsappUsage: number; // Percentage (0-100)
  smsUsage: number; // Percentage (0-100)
  preferredMethod: 'whatsapp' | 'sms' | 'auto';
  timezone: string;
  phoneFormat: string;
  emergencyNumber: string;
  currency: string;
  language: string;
  continent: string;
  touristPopular: boolean;
}

export interface VerificationRecommendation {
  primaryMethod: 'whatsapp' | 'sms';
  secondaryMethod: 'whatsapp' | 'sms';
  confidence: number; // 0-100
  reasoning: string;
  costEffective: boolean;
  userExperience: 'excellent' | 'good' | 'fair';
}

class CountryDetectionService {
  
  private countryDatabase: { [phonePrefix: string]: CountryInfo } = {
    '+212': {
      code: 'MA',
      name: 'Morocco',
      flag: '🇲🇦',
      whatsappUsage: 95,
      smsUsage: 5,
      preferredMethod: 'whatsapp',
      timezone: 'Africa/Casablanca',
      phoneFormat: '+212-6-XX-XX-XX-XX',
      emergencyNumber: '190',
      currency: 'MAD',
      language: 'ar',
      continent: 'Africa',
      touristPopular: true
    },
    '+33': {
      code: 'FR',
      name: 'France',
      flag: '🇫🇷',
      whatsappUsage: 65,
      smsUsage: 35,
      preferredMethod: 'whatsapp',
      timezone: 'Europe/Paris',
      phoneFormat: '+33-6-XX-XX-XX-XX',
      emergencyNumber: '112',
      currency: 'EUR',
      language: 'fr',
      continent: 'Europe',
      touristPopular: true
    },
    '+34': {
      code: 'ES',
      name: 'Spain',
      flag: '🇪🇸',
      whatsappUsage: 78,
      smsUsage: 22,
      preferredMethod: 'whatsapp',
      timezone: 'Europe/Madrid',
      phoneFormat: '+34-6XX-XXX-XXX',
      emergencyNumber: '112',
      currency: 'EUR',
      language: 'es',
      continent: 'Europe',
      touristPopular: true
    },
    '+49': {
      code: 'DE',
      name: 'Germany',
      flag: '🇩🇪',
      whatsappUsage: 45,
      smsUsage: 55,
      preferredMethod: 'sms',
      timezone: 'Europe/Berlin',
      phoneFormat: '+49-1XX-XXXXXXX',
      emergencyNumber: '112',
      currency: 'EUR',
      language: 'de',
      continent: 'Europe',
      touristPopular: true
    },
    '+1': {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      whatsappUsage: 25,
      smsUsage: 75,
      preferredMethod: 'sms',
      timezone: 'America/New_York',
      phoneFormat: '+1-XXX-XXX-XXXX',
      emergencyNumber: '911',
      currency: 'USD',
      language: 'en',
      continent: 'North America',
      touristPopular: true
    },
    '+44': {
      code: 'GB',
      name: 'United Kingdom',
      flag: '🇬🇧',
      whatsappUsage: 30,
      smsUsage: 70,
      preferredMethod: 'sms',
      timezone: 'Europe/London',
      phoneFormat: '+44-7XXX-XXXXXX',
      emergencyNumber: '999',
      currency: 'GBP',
      language: 'en',
      continent: 'Europe',
      touristPopular: true
    },
    '+91': {
      code: 'IN',
      name: 'India',
      flag: '🇮🇳',
      whatsappUsage: 89,
      smsUsage: 11,
      preferredMethod: 'whatsapp',
      timezone: 'Asia/Kolkata',
      phoneFormat: '+91-XXXXX-XXXXX',
      emergencyNumber: '112',
      currency: 'INR',
      language: 'hi',
      continent: 'Asia',
      touristPopular: true
    },
    '+55': {
      code: 'BR',
      name: 'Brazil',
      flag: '🇧🇷',
      whatsappUsage: 87,
      smsUsage: 13,
      preferredMethod: 'whatsapp',
      timezone: 'America/Sao_Paulo',
      phoneFormat: '+55-XX-9XXXX-XXXX',
      emergencyNumber: '190',
      currency: 'BRL',
      language: 'pt',
      continent: 'South America',
      touristPopular: true
    },
    '+54': {
      code: 'AR',
      name: 'Argentina',
      flag: '🇦🇷',
      whatsappUsage: 82,
      smsUsage: 18,
      preferredMethod: 'whatsapp',
      timezone: 'America/Argentina/Buenos_Aires',
      phoneFormat: '+54-9-XXX-XXX-XXXX',
      emergencyNumber: '911',
      currency: 'ARS',
      language: 'es',
      continent: 'South America',
      touristPopular: true
    },
    '+52': {
      code: 'MX',
      name: 'Mexico',
      flag: '🇲🇽',
      whatsappUsage: 74,
      smsUsage: 26,
      preferredMethod: 'whatsapp',
      timezone: 'America/Mexico_City',
      phoneFormat: '+52-1-XXX-XXX-XXXX',
      emergencyNumber: '911',
      currency: 'MXN',
      language: 'es',
      continent: 'North America',
      touristPopular: true
    },
    '+39': {
      code: 'IT',
      name: 'Italy',
      flag: '🇮🇹',
      whatsappUsage: 68,
      smsUsage: 32,
      preferredMethod: 'whatsapp',
      timezone: 'Europe/Rome',
      phoneFormat: '+39-3XX-XXX-XXXX',
      emergencyNumber: '112',
      currency: 'EUR',
      language: 'it',
      continent: 'Europe',
      touristPopular: true
    }
  };

  /**
   * Detect country from phone number
   */
  detectCountry(phoneNumber: string): CountryInfo | null {
    const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Try exact matches first
    for (const [prefix, country] of Object.entries(this.countryDatabase)) {
      if (normalizedPhone.startsWith(prefix)) {
        return country;
      }
    }
    
    // Handle special cases (e.g., +1 could be US or Canada)
    if (normalizedPhone.startsWith('+1')) {
      // Simple heuristic: assume US for now
      // In production, you'd use more sophisticated detection
      return this.countryDatabase['+1'];
    }
    
    return null;
  }

  /**
   * Get verification method recommendation
   */
  getVerificationRecommendation(
    phoneNumber: string,
    context?: {
      userAgent?: string;
      location?: string;
      previousMethod?: 'whatsapp' | 'sms';
      touristMode?: boolean;
    }
  ): VerificationRecommendation {
    const country = this.detectCountry(phoneNumber);
    
    if (!country) {
      return {
        primaryMethod: 'sms',
        secondaryMethod: 'whatsapp',
        confidence: 60,
        reasoning: 'Unknown country - defaulting to SMS with WhatsApp fallback',
        costEffective: true,
        userExperience: 'fair'
      };
    }

    // Base recommendation on WhatsApp usage
    const whatsappPreferred = country.whatsappUsage > 50;
    
    // Adjust for tourist mode (Morocco Made Real context)
    if (context?.touristMode && country.touristPopular) {
      return {
        primaryMethod: 'whatsapp',
        secondaryMethod: 'sms',
        confidence: Math.min(95, country.whatsappUsage + 10),
        reasoning: `${country.name} tourists prefer WhatsApp (${country.whatsappUsage}% usage). No roaming SMS charges.`,
        costEffective: true,
        userExperience: 'excellent'
      };
    }

    // Standard recommendation
    if (whatsappPreferred) {
      return {
        primaryMethod: 'whatsapp',
        secondaryMethod: 'sms',
        confidence: country.whatsappUsage,
        reasoning: `${country.name} has ${country.whatsappUsage}% WhatsApp adoption`,
        costEffective: true,
        userExperience: country.whatsappUsage > 80 ? 'excellent' : 'good'
      };
    } else {
      return {
        primaryMethod: 'sms',
        secondaryMethod: 'whatsapp',
        confidence: country.smsUsage,
        reasoning: `${country.name} has strong SMS infrastructure (${country.smsUsage}% usage)`,
        costEffective: false,
        userExperience: 'good'
      };
    }
  }

  /**
   * Get countries sorted by WhatsApp usage
   */
  getWhatsAppOptimizedCountries(): CountryInfo[] {
    return Object.values(this.countryDatabase)
      .sort((a, b) => b.whatsappUsage - a.whatsappUsage);
  }

  /**
   * Get tourist-popular countries
   */
  getTouristCountries(): CountryInfo[] {
    return Object.values(this.countryDatabase)
      .filter(country => country.touristPopular)
      .sort((a, b) => b.whatsappUsage - a.whatsappUsage);
  }

  /**
   * Format phone number according to country standards
   */
  formatPhoneNumber(phoneNumber: string): string {
    const country = this.detectCountry(phoneNumber);
    if (!country) return phoneNumber;

    const normalized = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Simple formatting based on country patterns
    switch (country.code) {
      case 'MA':
        // +212-6-12-34-56-78
        if (normalized.match(/^\+212\d{9}$/)) {
          return normalized.replace(/^\+212(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, '+212-$1-$2-$3-$4-$5');
        }
        break;
      case 'FR':
        // +33-6-98-76-54-32
        if (normalized.match(/^\+33\d{9}$/)) {
          return normalized.replace(/^\+33(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/, '+33-$1-$2-$3-$4-$5');
        }
        break;
      case 'US':
        // +1-555-123-4567
        if (normalized.match(/^\+1\d{10}$/)) {
          return normalized.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, '+1-$1-$2-$3');
        }
        break;
    }

    return phoneNumber;
  }

  /**
   * Check if phone number is valid for country
   */
  validatePhoneNumber(phoneNumber: string): {
    valid: boolean;
    country?: CountryInfo;
    formatted?: string;
    errors: string[];
  } {
    const errors: string[] = [];
    const normalized = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    if (!normalized.startsWith('+')) {
      errors.push('Phone number must include country code (e.g., +212...)');
    }

    if (normalized.length < 10) {
      errors.push('Phone number too short');
    }

    if (normalized.length > 15) {
      errors.push('Phone number too long');
    }

    const country = this.detectCountry(normalized);
    if (!country) {
      errors.push('Unsupported country code');
    }

    const valid = errors.length === 0;
    
    return {
      valid,
      country: country || undefined,
      formatted: valid ? this.formatPhoneNumber(phoneNumber) : undefined,
      errors
    };
  }

  /**
   * Get analytics for country distribution
   */
  getCountryAnalytics(): {
    totalCountries: number;
    whatsappOptimized: number;
    smsOptimized: number;
    touristFriendly: number;
    averageWhatsAppUsage: number;
  } {
    const countries = Object.values(this.countryDatabase);
    
    return {
      totalCountries: countries.length,
      whatsappOptimized: countries.filter(c => c.whatsappUsage > 50).length,
      smsOptimized: countries.filter(c => c.smsUsage > 50).length,
      touristFriendly: countries.filter(c => c.touristPopular).length,
      averageWhatsAppUsage: countries.reduce((sum, c) => sum + c.whatsappUsage, 0) / countries.length
    };
  }
}

// Export singleton instance
export const countryDetectionService = new CountryDetectionService();
export default countryDetectionService; 