export interface WhatsAppMessage {
  phone: string;
  message: string;
  type: 'booking_confirmation' | 'payment_request' | 'experience_reminder' | 'feedback_request' | 'general';
}

export interface BookingDetails {
  id: string;
  experienceType: string;
  artisanName: string;
  date: string;
  time: string;
  groupSize: string;
  totalPrice: number;
  customerName?: string;
  specialRequests?: string;
}

class WhatsAppService {
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digits and ensure international format
    const cleaned = phone.replace(/\D/g, '');
    // If starts with 212 (Morocco), keep as is
    // Otherwise assume it needs +212 prefix
    if (cleaned.startsWith('212')) {
      return cleaned;
    }
    return `212${cleaned.replace(/^0/, '')}`;
  }

  generateBookingConfirmationMessage(booking: BookingDetails): string {
    const message = `🎉 *Booking Confirmed - ${booking.experienceType}*

📋 *Booking Details:*
• ID: ${booking.id}
• Experience: ${booking.experienceType}
• Date: ${booking.date}
• Time: ${booking.time}
• Group Size: ${booking.groupSize}
• Total: €${booking.totalPrice}

👨‍🎨 *Your Artisan:* ${booking.artisanName}

${booking.specialRequests ? `📝 *Special Requests:* ${booking.specialRequests}\n\n` : ''}✨ *What's Next:*
1. We'll send payment QR code shortly
2. Location details will follow
3. Prepare for an amazing cultural experience!

Need help? Just reply to this message! 🇲🇦`;

    return message;
  }

  generatePaymentRequestMessage(booking: BookingDetails, paymentQRUrl: string): string {
    return `💳 *Payment Request - ${booking.experienceType}*

🆔 Booking: ${booking.id}
💰 Amount: €${booking.totalPrice}

📱 *Easy Payment Options:*
1. Scan QR code: ${paymentQRUrl}
2. Bank transfer details below
3. Pay cash on arrival

🏦 *Bank Details:*
Account: Morocco Cultural Experiences
IBAN: MA64011519000001234567890
Reference: ${booking.id}

✅ Once paid, we'll send your blockchain certificate!

Questions? Reply here! 🙋‍♂️`;
  }

  generateExperienceReminderMessage(booking: BookingDetails, locationQRUrl?: string): string {
    return `⏰ *Tomorrow: ${booking.experienceType}*

📅 *Reminder Details:*
• Date: ${booking.date}
• Time: ${booking.time}
• Artisan: ${booking.artisanName}
• Group: ${booking.groupSize}

📍 *Location:*
${locationQRUrl ? `📱 Location QR: ${locationQRUrl}` : 'Address will be shared 2 hours before'}

🎒 *What to Bring:*
• Comfortable clothes
• Enthusiasm for learning!
• Camera for memories

See you tomorrow! Can't wait to share our culture! 🇲🇦✨`;
  }

  generateBlockchainCertificateMessage(booking: BookingDetails, certificateQRUrl: string): string {
    return `🏆 *Your Authentic Experience Certificate*

🎯 *Experience Completed:* ${booking.experienceType}
🗓️ *Date:* ${booking.date}
👨‍🎨 *Master Artisan:* ${booking.artisanName}

🔗 *Blockchain Certificate:*
📱 Scan QR: ${certificateQRUrl}

✨ *Your certificate proves:*
• Authentic Moroccan cultural experience
• Direct artisan training
• Traditional techniques learned
• Cultural heritage participation

Share your achievement! This certificate is permanently stored on blockchain and can never be faked! 🛡️

Rate your experience: Reply with ⭐⭐⭐⭐⭐`;
  }

  generateArtisanNotificationMessage(booking: BookingDetails): string {
    return `🔔 *New Booking Alert!*

📋 *Booking Details:*
• ID: ${booking.id}
• Experience: ${booking.experienceType}
• Customer: ${booking.customerName || 'Cultural Explorer'}
• Date: ${booking.date}
• Time: ${booking.time}
• Group: ${booking.groupSize}
• Total: €${booking.totalPrice}

${booking.specialRequests ? `📝 *Special Requests:*\n${booking.specialRequests}\n\n` : ''}👤 *Customer Profile:*
• First time visitor
• Excited about learning
• Booked through Cultural Match Assistant

🎯 *Next Steps:*
1. Confirm availability
2. Prepare materials
3. Send welcome message to customer

Customer's WhatsApp: [Will be shared after confirmation]

Accept booking? Reply YES or NO`;
  }

  sendWhatsAppMessage(message: WhatsAppMessage): string {
    const formattedPhone = this.formatPhoneNumber(message.phone);
    const encodedMessage = encodeURIComponent(message.message);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // In a real app, this would also log to analytics
    console.log('📱 WhatsApp message prepared:', {
      phone: formattedPhone,
      type: message.type,
      messageLength: message.message.length
    });

    return whatsappUrl;
  }

  sendBookingConfirmation(booking: BookingDetails, customerPhone: string): string {
    const message = this.generateBookingConfirmationMessage(booking);
    return this.sendWhatsAppMessage({
      phone: customerPhone,
      message,
      type: 'booking_confirmation'
    });
  }

  sendPaymentRequest(booking: BookingDetails, customerPhone: string, paymentQRUrl: string): string {
    const message = this.generatePaymentRequestMessage(booking, paymentQRUrl);
    return this.sendWhatsAppMessage({
      phone: customerPhone,
      message,
      type: 'payment_request'
    });
  }

  sendExperienceReminder(booking: BookingDetails, customerPhone: string, locationQRUrl?: string): string {
    const message = this.generateExperienceReminderMessage(booking, locationQRUrl);
    return this.sendWhatsAppMessage({
      phone: customerPhone,
      message,
      type: 'experience_reminder'
    });
  }

  sendBlockchainCertificate(booking: BookingDetails, customerPhone: string, certificateQRUrl: string): string {
    const message = this.generateBlockchainCertificateMessage(booking, certificateQRUrl);
    return this.sendWhatsAppMessage({
      phone: customerPhone,
      message,
      type: 'feedback_request'
    });
  }

  notifyArtisan(booking: BookingDetails, artisanPhone: string): string {
    const message = this.generateArtisanNotificationMessage(booking);
    return this.sendWhatsAppMessage({
      phone: artisanPhone,
      message,
      type: 'booking_confirmation'
    });
  }

  // Quick message templates for common scenarios
  getQuickMessages() {
    return {
      customerSupport: "Hello! 👋 How can we help you with your cultural experience booking?",
      locationHelp: "📍 Need help finding the location? We can send you the exact coordinates and a map!",
      rescheduling: "📅 Need to reschedule? No problem! Let us know your preferred new date and time.",
      emergency: "🚨 Emergency? Please call us directly at +212 6 XX XX XX XX for immediate assistance.",
      thankYou: "🙏 Thank you for choosing Morocco Made Real! We hope you loved your authentic cultural experience!"
    };
  }
}

export default new WhatsAppService(); 