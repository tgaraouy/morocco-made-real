import QRCode from 'qrcode';

export interface PaymentQRData {
  bookingId: string;
  amount: number;
  currency: string;
  merchantName: string;
  description: string;
  recipientIBAN?: string;
  recipientPhone?: string;
}

export interface BlockchainCertificateQRData {
  bookingId: string;
  experienceType: string;
  artisanName: string;
  completionDate: string;
  certificateHash: string;
  blockchainNetwork: string;
  verificationUrl: string;
}

export interface LocationQRData {
  latitude: number;
  longitude: number;
  placeName: string;
  address: string;
  instructions?: string;
}

class QRService {
  // Generate payment QR codes
  async generatePaymentQR(paymentData: PaymentQRData): Promise<string> {
    try {
      // For Morocco, we can use multiple payment standards
      const paymentUrl = this.createPaymentUrl(paymentData);
      
      const qrCodeDataUrl = await QRCode.toDataURL(paymentUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Failed to generate payment QR:', error);
      return this.generateFallbackQR(`Payment: €${paymentData.amount} - Booking: ${paymentData.bookingId}`);
    }
  }

  private createPaymentUrl(paymentData: PaymentQRData): string {
    // Create a comprehensive payment URL that supports multiple methods
    const baseUrl = 'https://pay.moroccomadereal.com';
    const params = new URLSearchParams({
      booking_id: paymentData.bookingId,
      amount: paymentData.amount.toString(),
      currency: paymentData.currency,
      description: paymentData.description,
      merchant: paymentData.merchantName
    });

    // Add bank details if available
    if (paymentData.recipientIBAN) {
      params.append('iban', paymentData.recipientIBAN);
    }

    // Add mobile money if available
    if (paymentData.recipientPhone) {
      params.append('mobile_pay', paymentData.recipientPhone);
    }

    return `${baseUrl}/pay?${params.toString()}`;
  }

  // Generate blockchain certificate QR codes
  async generateBlockchainCertificateQR(certificateData: BlockchainCertificateQRData): Promise<string> {
    try {
      const certificateUrl = this.createCertificateUrl(certificateData);
      
      const qrCodeDataUrl = await QRCode.toDataURL(certificateUrl, {
        errorCorrectionLevel: 'H', // High error correction for certificates
        type: 'image/png',
        margin: 2,
        color: {
          dark: '#1F2937', // Dark gray for better scanning
          light: '#F9FAFB'  // Light gray background
        },
        width: 300
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Failed to generate blockchain certificate QR:', error);
      return this.generateFallbackQR(`Certificate: ${certificateData.experienceType} - ${certificateData.artisanName}`);
    }
  }

  private createCertificateUrl(certificateData: BlockchainCertificateQRData): string {
    // Create a URL that links to the blockchain certificate verification
    const baseUrl = 'https://verify.moroccomadereal.com';
    const params = new URLSearchParams({
      booking_id: certificateData.bookingId,
      experience: certificateData.experienceType,
      artisan: certificateData.artisanName,
      date: certificateData.completionDate,
      hash: certificateData.certificateHash,
      network: certificateData.blockchainNetwork
    });

    return `${baseUrl}/certificate?${params.toString()}`;
  }

  // Generate location QR codes
  async generateLocationQR(locationData: LocationQRData): Promise<string> {
    try {
      const locationUrl = this.createLocationUrl(locationData);
      
      const qrCodeDataUrl = await QRCode.toDataURL(locationUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#059669', // Green for location
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Failed to generate location QR:', error);
      return this.generateFallbackQR(`Location: ${locationData.placeName}`);
    }
  }

  private createLocationUrl(locationData: LocationQRData): string {
    // Create Google Maps URL with coordinates
    const gmapsUrl = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;
    
    // Also create a more detailed URL for our app
    const appUrl = `https://moroccomadereal.com/location?lat=${locationData.latitude}&lng=${locationData.longitude}&name=${encodeURIComponent(locationData.placeName)}&address=${encodeURIComponent(locationData.address)}`;
    
    // For QR code, use the simpler Google Maps URL
    return gmapsUrl;
  }

  // Generate contact QR codes for artisans
  async generateArtisanContactQR(artisanData: {
    name: string;
    phone: string;
    whatsapp: string;
    workshop: string;
    specialty: string;
  }): Promise<string> {
    try {
      // Create vCard format for easy contact saving
      const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${artisanData.name}
ORG:Morocco Made Real - ${artisanData.specialty}
TEL;TYPE=CELL:${artisanData.phone}
URL:https://wa.me/${artisanData.whatsapp.replace(/\D/g, '')}
ADR;TYPE=WORK:;;${artisanData.workshop};;;Morocco
NOTE:Master artisan specializing in ${artisanData.specialty}. Book authentic experiences through Morocco Made Real.
END:VCARD`;

      const qrCodeDataUrl = await QRCode.toDataURL(vCard, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#DC2626', // Red for contact
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Failed to generate artisan contact QR:', error);
      return this.generateFallbackQR(`Contact: ${artisanData.name} - ${artisanData.phone}`);
    }
  }

  // Generate booking details QR for quick access
  async generateBookingDetailsQR(bookingData: {
    id: string;
    experienceType: string;
    date: string;
    time: string;
    artisanName: string;
    location: string;
    status: string;
  }): Promise<string> {
    try {
      const bookingUrl = `https://moroccomadereal.com/booking/${bookingData.id}`;
      
      const qrCodeDataUrl = await QRCode.toDataURL(bookingUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#7C3AED', // Purple for booking details
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('Failed to generate booking details QR:', error);
      return this.generateFallbackQR(`Booking: ${bookingData.id} - ${bookingData.experienceType}`);
    }
  }

  // Fallback QR generator for error cases
  private async generateFallbackQR(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'L',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#6B7280',
          light: '#FFFFFF'
        },
        width: 200
      });
    } catch (error) {
      // Return a simple data URL with text
      return 'data:image/svg+xml;base64,' + btoa(`
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#f3f4f6"/>
          <text x="100" y="100" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">
            QR Code Error
          </text>
        </svg>
      `);
    }
  }

  // Utility method to validate QR data before generation
  validateQRData(data: any, type: 'payment' | 'certificate' | 'location' | 'contact' | 'booking'): boolean {
    switch (type) {
      case 'payment':
        return !!(data.bookingId && data.amount && data.currency);
      case 'certificate':
        return !!(data.bookingId && data.experienceType && data.certificateHash);
      case 'location':
        return !!(data.latitude && data.longitude && data.placeName);
      case 'contact':
        return !!(data.name && data.phone);
      case 'booking':
        return !!(data.id && data.experienceType);
      default:
        return false;
    }
  }

  // Get QR code styling options for different types
  getQRStyling(type: 'payment' | 'certificate' | 'location' | 'contact' | 'booking') {
    const styles = {
      payment: {
        color: '#059669', // Green
        icon: '💳',
        title: 'Payment QR'
      },
      certificate: {
        color: '#7C3AED', // Purple
        icon: '🏆',
        title: 'Certificate QR'
      },
      location: {
        color: '#DC2626', // Red
        icon: '📍',
        title: 'Location QR'
      },
      contact: {
        color: '#EA580C', // Orange
        icon: '👤',
        title: 'Contact QR'
      },
      booking: {
        color: '#2563EB', // Blue
        icon: '📋',
        title: 'Booking QR'
      }
    };

    return styles[type];
  }
}

export default new QRService(); 