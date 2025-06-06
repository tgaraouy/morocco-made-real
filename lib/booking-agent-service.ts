import QRService from './qr-service';
import WhatsAppService from './whatsapp-service';
import { supabase } from './supabase';

export interface BookingStep {
  id: string;
  title: string;
  question: string;
  type: 'single_choice' | 'multi_choice' | 'text_input' | 'date_picker' | 'time_picker' | 'number_input' | 'confirmation';
  options?: string[];
  required: boolean;
  aiResponse: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface BookingFlow {
  categoryId: string;
  categoryName: string;
  steps: BookingStep[];
  artisanGreeting: string;
  confirmationMessage: string;
}

export interface BookingData {
  id?: string;
  experience_id: string;
  user_id: string;
  responses: Record<string, any>;
  status: 'booked' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  booking_date: string;
  created_at?: string;
  updated_at?: string;
  human_handoff_at?: string;
  artisan_id?: string;
  // Analytics fields
  booking_source?: string;
  user_agent?: string;
  session_id?: string;
  // Extracted booking details
  craft_type?: string;
  group_size?: string;
  preferred_date?: string;
  preferred_time?: string;
  special_requests?: string;
}

class BookingAgentService {
  private bookingFlows: Record<string, BookingFlow> = {
    pottery: {
      categoryId: 'pottery',
      categoryName: 'Pottery Workshop',
      artisanGreeting: "Ahlan wa sahlan! I'm Hassan, and I'm so excited to share the ancient art of pottery with you. Let me help you book the perfect pottery experience.",
      confirmationMessage: "Perfect! I can't wait to welcome you to my workshop. You'll love working with the sacred clay from our Atlas Mountains!",
      steps: [
        {
          id: 'group_size',
          title: 'Group Size',
          question: 'How many people will be joining this pottery experience?',
          type: 'single_choice',
          options: ['Just me (1 person)', '2 people', '3-4 people', '5-6 people', 'Larger group (7+)'],
          required: true,
          aiResponse: "Excellent! {selection} is perfect for a pottery workshop. We'll prepare the right number of pottery wheels and clay portions for everyone."
        },
        {
          id: 'experience_level',
          title: 'Experience Level',
          question: 'What\'s your pottery experience level?',
          type: 'single_choice',
          options: ['Complete beginner', 'I\'ve tried it once or twice', 'Some experience', 'Experienced potter'],
          required: true,
          aiResponse: "Wonderful! As a {selection}, I'll tailor the workshop perfectly to your skill level. We'll make sure you create something beautiful!"
        },
        {
          id: 'preferred_date',
          title: 'Preferred Date',
          question: 'When would you like to visit my pottery workshop?',
          type: 'date_picker',
          required: true,
          aiResponse: "Great choice! {selection} will be perfect. The clay is always ready, and I'll make sure everything is prepared for your visit."
        },
        {
          id: 'preferred_time',
          title: 'Preferred Time',
          question: 'What time works best for you?',
          type: 'single_choice',
          options: ['Morning (9:00-13:00)', 'Afternoon (14:00-18:00)', 'Evening (17:00-21:00)'],
          required: true,
          aiResponse: "Perfect timing! {selection} is my favorite time to work with clay. The light is beautiful then."
        },
        {
          id: 'special_requests',
          title: 'Special Requests',
          question: 'Any special requests or things I should know? (dietary restrictions, mobility needs, special occasions, etc.)',
          type: 'text_input',
          required: false,
          aiResponse: "Thank you for letting me know! I'll make sure everything is arranged perfectly for you. {response}"
        }
      ]
    },
    cooking: {
      categoryId: 'cooking',
      categoryName: 'Tagine Cooking',
      artisanGreeting: "Marhaba! I'm Aicha, and cooking is the language of love in my family. Let me guide you through booking an unforgettable culinary journey!",
      confirmationMessage: "Alhamdulillah! I'm thrilled to cook with you. My kitchen will be filled with the most beautiful aromas, and you'll learn secrets passed down for generations!",
      steps: [
        {
          id: 'group_size',
          title: 'Group Size',
          question: 'How many people will be joining our cooking experience?',
          type: 'single_choice',
          options: ['Just me (1 person)', '2 people', '3-4 people', '5-6 people', 'Family group (7+)'],
          required: true,
          aiResponse: "Magnificent! {selection} is perfect for our cooking class. I'll prepare enough ingredients and workspace for everyone to cook together."
        },
        {
          id: 'dietary_preferences',
          title: 'Dietary Preferences',
          question: 'Do you have any dietary preferences or restrictions?',
          type: 'multi_choice',
          options: ['No restrictions', 'Vegetarian', 'Vegan', 'Gluten-free', 'No nuts', 'No dairy', 'Halal only'],
          required: true,
          aiResponse: "Absolutely! I'll prepare everything according to your {selection} needs. Moroccan cuisine has beautiful options for every preference!"
        },
        {
          id: 'spice_level',
          title: 'Spice Preference',
          question: 'How do you like your spices?',
          type: 'single_choice',
          options: ['Mild & gentle', 'Medium spice', 'Love it spicy!', 'Let the chef decide'],
          required: true,
          aiResponse: "Perfect! {selection} will be delicious. I know exactly which spice blend will make your tagine sing with flavor!"
        },
        {
          id: 'preferred_date',
          title: 'Preferred Date',
          question: 'When would you like to cook with us?',
          type: 'date_picker',
          required: true,
          aiResponse: "Excellent! {selection} will be wonderful. I'll visit the souk that morning to get the freshest ingredients for our cooking."
        },
        {
          id: 'preferred_time',
          title: 'Preferred Time',
          question: 'What time works best for your cooking experience?',
          type: 'single_choice',
          options: ['Morning session (10:00-13:00)', 'Afternoon session (15:00-18:00)', 'Evening session (18:00-21:00)'],
          required: true,
          aiResponse: "Beautiful choice! {selection} is perfect for cooking. We'll have plenty of time to prepare, cook, and enjoy our meal together!"
        }
      ]
    },
    weaving: {
      categoryId: 'weaving',
      categoryName: 'Berber Weaving',
      artisanGreeting: "Azul! I'm Fatima from the Atlas Mountains. Each thread tells a story, and I'm honored to weave yours into our ancient tradition.",
      confirmationMessage: "Barakallahu fik! Your hands will learn the language of my ancestors. Together we'll create something that carries the soul of the mountains!",
      steps: [
        {
          id: 'group_size',
          title: 'Group Size',
          question: 'How many souls will learn the art of weaving?',
          type: 'single_choice',
          options: ['Just me (1 person)', '2 people', '3-4 people', 'Small group (5-6)', 'Larger gathering (7+)'],
          required: true,
          aiResponse: "Beautiful! {selection} will create wonderful energy in our weaving circle. Each person will have their own traditional loom."
        },
        {
          id: 'pattern_interest',
          title: 'Pattern Interest',
          question: 'Which traditional patterns speak to your heart?',
          type: 'single_choice',
          options: ['Mountain symbols (protection)', 'Water patterns (life flow)', 'Star designs (guidance)', 'Geometric harmony', 'Let Fatima choose'],
          required: true,
          aiResponse: "Ah, {selection}! This pattern carries deep meaning in our culture. I'll teach you not just the technique, but the story each thread tells."
        },
        {
          id: 'preferred_date',
          title: 'Preferred Date',
          question: 'When shall we weave together?',
          type: 'date_picker',
          required: true,
          aiResponse: "The mountains will welcome you on {selection}. This will be a day where ancient wisdom flows through your hands."
        },
        {
          id: 'preferred_time',
          title: 'Preferred Time',
          question: 'What time feels right for learning this ancient art?',
          type: 'single_choice',
          options: ['Morning light (9:00-15:00)', 'Afternoon warmth (13:00-19:00)', 'Extended session (10:00-16:00)'],
          required: true,
          aiResponse: "Perfect! {selection} brings the most beautiful energy for weaving. The light will dance on our threads like ancestral spirits."
        }
      ]
    },
    leather: {
      categoryId: 'leather',
      categoryName: 'Leather Crafting',
      artisanGreeting: "Salaam! I'm Ahmed, master of leather from the souks of Marrakech. For 30 years, I've been turning raw hides into beautiful treasures. Let's create something special together!",
      confirmationMessage: "Excellent! You'll love the smell of quality leather and the satisfaction of creating something with your own hands. Welcome to my workshop!",
      steps: [
        {
          id: 'group_size',
          title: 'Group Size',
          question: 'How many people will be crafting leather?',
          type: 'single_choice',
          options: ['Just me (1 person)', '2 people', '3-4 people', '5-6 people', 'Group workshop (7+)'],
          required: true,
          aiResponse: "Perfect! {selection} will have plenty of space and tools. Each person will create their own unique leather piece."
        },
        {
          id: 'item_preference',
          title: 'What to Create',
          question: 'What would you like to craft?',
          type: 'single_choice',
          options: ['Traditional bag/purse', 'Leather journal cover', 'Belt with custom buckle', 'Decorative pouch', 'Surprise me!'],
          required: true,
          aiResponse: "Excellent choice! {selection} is one of my favorite pieces to teach. You'll learn traditional techniques passed down through generations."
        },
        {
          id: 'preferred_date',
          title: 'Preferred Date',
          question: 'When would you like to visit my leather workshop?',
          type: 'date_picker',
          required: true,
          aiResponse: "Great! {selection} works perfectly. I'll prepare the finest leather and all the traditional tools for your visit."
        },
        {
          id: 'preferred_time',
          title: 'Preferred Time',
          question: 'What time suits you best?',
          type: 'single_choice',
          options: ['Morning session (9:00-14:00)', 'Afternoon session (13:00-18:00)', 'Extended workshop (10:00-15:00)'],
          required: true,
          aiResponse: "Perfect timing! {selection} is ideal for leather work. The workshop will be ready with everything you need."
        }
      ]
    },
    metalwork: {
      categoryId: 'metalwork',
      categoryName: 'Traditional Metalwork',
      artisanGreeting: "Ahlan! I'm Youssef, and metal speaks to me like an old friend. In my forge in Fez, we'll shape copper and brass using techniques from the time of the sultans!",
      confirmationMessage: "Magnificent! The fire will be ready, and you'll hear the ancient songs of hammer on metal. This will be an unforgettable experience!",
      steps: [
        {
          id: 'group_size',
          title: 'Group Size',
          question: 'How many apprentices will join the forge?',
          type: 'single_choice',
          options: ['Just me (1 person)', '2 people', '3-4 people', '5-6 people', 'Large group (7+)'],
          required: true,
          aiResponse: "Excellent! {selection} will work perfectly in my forge. Each person will have their own anvil and tools to create their masterpiece."
        },
        {
          id: 'metal_preference',
          title: 'Metal Choice',
          question: 'Which metal calls to your spirit?',
          type: 'single_choice',
          options: ['Copper (warm and forgiving)', 'Brass (golden and strong)', 'Silver (pure and elegant)', 'Let the master choose'],
          required: true,
          aiResponse: "Ah, {selection}! This metal has its own personality. I'll teach you how to work with its unique character and create something beautiful."
        },
        {
          id: 'preferred_date',
          title: 'Preferred Date',
          question: 'When shall we light the forge together?',
          type: 'date_picker',
          required: true,
          aiResponse: "Perfect! {selection} will be a day of creation. The forge will be hot and ready for your metalworking journey."
        },
        {
          id: 'preferred_time',
          title: 'Preferred Time',
          question: 'What time feels right for forging?',
          type: 'single_choice',
          options: ['Morning forge (9:00-13:00)', 'Afternoon heat (14:00-18:00)', 'Extended session (10:00-14:00)'],
          required: true,
          aiResponse: "Excellent choice! {selection} brings the perfect energy for metalwork. The forge will sing with the rhythm of creation!"
        }
      ]
    },
    carpet: {
      categoryId: 'carpet',
      categoryName: 'Carpet Weaving',
      artisanGreeting: "Marhaba! I'm Khadija, keeper of the carpet traditions. Each knot holds a prayer, each pattern tells our history. Come, let's weave your story into our ancient art!",
      confirmationMessage: "Wonderful! Your hands will learn the sacred rhythm of carpet making. Together we'll create something that will last for generations!",
      steps: [
        {
          id: 'group_size',
          title: 'Group Size',
          question: 'How many weavers will join our circle?',
          type: 'single_choice',
          options: ['Just me (1 person)', '2 people', '3-4 people', '5-6 people', 'Weaving circle (7+)'],
          required: true,
          aiResponse: "Beautiful! {selection} will create a wonderful weaving energy. Each person will work on their own section of the traditional loom."
        },
        {
          id: 'carpet_style',
          title: 'Carpet Style',
          question: 'Which traditional style speaks to you?',
          type: 'single_choice',
          options: ['Berber geometric patterns', 'Floral garden designs', 'Tribal symbols', 'Modern interpretation', 'Traditional family pattern'],
          required: true,
          aiResponse: "Ah, {selection}! This style carries deep meaning in our culture. I'll teach you the significance of each knot and color choice."
        },
        {
          id: 'preferred_date',
          title: 'Preferred Date',
          question: 'When shall we begin weaving together?',
          type: 'date_picker',
          required: true,
          aiResponse: "Perfect timing! {selection} will be blessed for weaving. I'll prepare the finest wool and set up the traditional looms."
        },
        {
          id: 'preferred_time',
          title: 'Preferred Time',
          question: 'What time feels right for this sacred art?',
          type: 'single_choice',
          options: ['Morning blessing (9:00-14:00)', 'Afternoon meditation (13:00-18:00)', 'Extended session (10:00-15:00)'],
          required: true,
          aiResponse: "Wonderful! {selection} brings the perfect spirit for carpet weaving. The loom will be ready for your creative journey."
        }
      ]
    }
  };

  async getBookingFlow(categoryId: string): Promise<BookingFlow> {
    // First try to get experience data from Supabase to calculate dynamic time slots
    try {
      const { data: experiences, error } = await supabase
        .from('cultural_experiences')
        .select('duration, craft')
        .eq('craft', categoryId)
        .eq('active', true)
        .limit(1);

      if (!error && experiences && experiences.length > 0) {
        const experience = experiences[0];
        const durationHours = this.parseDurationToHours(experience.duration);
        const timeSlots = this.generateTimeSlots(durationHours);
        
        // Create dynamic booking flow with calculated time slots
        const dynamicFlow = this.createDynamicBookingFlow(categoryId, timeSlots);
        if (dynamicFlow) {
          return dynamicFlow;
        }
      }
    } catch (error) {
      console.warn('Failed to fetch experience data from Supabase, using fallback:', error);
    }

    // Fallback to hardcoded flows
    const flow = this.bookingFlows[categoryId];
    if (!flow) {
      // Return a generic flow for unknown categories
      return {
        categoryId: categoryId,
        categoryName: 'Cultural Experience',
        artisanGreeting: "Welcome! I'm excited to share this authentic Moroccan experience with you. Let me help you book the perfect visit.",
        confirmationMessage: "Wonderful! I can't wait to welcome you and share our beautiful traditions together!",
        steps: [
          {
            id: 'group_size',
            title: 'Group Size',
            question: 'How many people will be joining this experience?',
            type: 'single_choice',
            options: ['Just me (1 person)', '2 people', '3-4 people', '5+ people'],
            required: true,
            aiResponse: "Perfect! {selection} will have a wonderful time learning our traditional craft."
          },
          {
            id: 'preferred_date',
            title: 'Preferred Date',
            question: 'When would you like to visit?',
            type: 'date_picker',
            required: true,
            aiResponse: "Excellent choice! {selection} will be perfect for your visit."
          },
          {
            id: 'preferred_time',
            title: 'Preferred Time',
            question: 'What time works best?',
            type: 'single_choice',
            options: ['Morning', 'Afternoon', 'Evening'],
            required: true,
            aiResponse: "Great! {selection} will be wonderful for this experience."
          }
        ]
      };
    }
    return flow;
  }

  private parseDurationToHours(duration: string): number {
    // Parse duration strings like "4 hours", "3-4 hours", "6 hours", etc.
    const match = duration.match(/(\d+)(?:-(\d+))?\s*hours?/i);
    if (match) {
      const minHours = parseInt(match[1]);
      const maxHours = match[2] ? parseInt(match[2]) : minHours;
      return maxHours; // Use the maximum duration for time slot calculation
    }
    return 3; // Default fallback
  }

  private generateTimeSlots(durationHours: number): string[] {
    // Generate time slots based on duration
    const slots = [];
    
    // Morning slot
    const morningEnd = 9 + durationHours;
    slots.push(`Morning (9:00-${morningEnd}:00)`);
    
    // Afternoon slot  
    const afternoonStart = Math.max(13, 14);
    const afternoonEnd = afternoonStart + durationHours;
    slots.push(`Afternoon (${afternoonStart}:00-${afternoonEnd}:00)`);
    
    // Evening/Extended slot (if duration allows)
    if (durationHours <= 5) {
      const eveningStart = Math.max(17, 18 - durationHours);
      const eveningEnd = eveningStart + durationHours;
      slots.push(`Evening (${eveningStart}:00-${eveningEnd}:00)`);
    } else {
      // For longer experiences, offer an extended session
      const extendedStart = 10;
      const extendedEnd = extendedStart + durationHours;
      slots.push(`Extended session (${extendedStart}:00-${extendedEnd}:00)`);
    }
    
    return slots;
  }

  private createDynamicBookingFlow(categoryId: string, timeSlots: string[]): BookingFlow | null {
    const artisanData = this.getArtisanContact(categoryId);
    const craftDisplayName = this.getCraftDisplayName(categoryId);
    
    return {
      categoryId,
      categoryName: craftDisplayName,
      artisanGreeting: `Ahlan wa sahlan! I'm ${artisanData.name}, and I'm so excited to share the ancient art of ${categoryId} with you. Let me help you book the perfect ${categoryId} experience.`,
      confirmationMessage: `Perfect! I can't wait to welcome you to my workshop. You'll love working with traditional ${categoryId} techniques!`,
      steps: [
        {
          id: 'group_size',
          title: 'Group Size',
          question: `How many people will be joining this ${categoryId} experience?`,
          type: 'single_choice',
          options: ['Just me (1 person)', '2 people', '3-4 people', '5-6 people', 'Larger group (7+)'],
          required: true,
          aiResponse: `Excellent! {selection} is perfect for a ${categoryId} workshop. We'll prepare everything needed for everyone.`
        },
        {
          id: 'experience_level',
          title: 'Experience Level',
          question: `What's your ${categoryId} experience level?`,
          type: 'single_choice',
          options: ['Complete beginner', 'I\'ve tried it once or twice', 'Some experience', 'Experienced'],
          required: true,
          aiResponse: "Wonderful! As a {selection}, I'll tailor the workshop perfectly to your skill level. We'll make sure you create something beautiful!"
        },
        {
          id: 'preferred_date',
          title: 'Preferred Date',
          question: `When would you like to visit my ${categoryId} workshop?`,
          type: 'date_picker',
          required: true,
          aiResponse: "Great choice! {selection} will be perfect. I'll make sure everything is prepared for your visit."
        },
        {
          id: 'preferred_time',
          title: 'Preferred Time',
          question: 'What time works best for you?',
          type: 'single_choice',
          options: timeSlots,
          required: true,
          aiResponse: "Perfect timing! {selection} is ideal for this craft. The workshop will be ready with everything you need."
        },
        {
          id: 'special_requests',
          title: 'Special Requests',
          question: 'Any special requests or things I should know? (dietary restrictions, mobility needs, special occasions, etc.)',
          type: 'text_input',
          required: false,
          aiResponse: "Thank you for letting me know! I'll make sure everything is arranged perfectly for you."
        }
      ]
    };
  }

  async createBooking(bookingData: Partial<BookingData>): Promise<string> {
    try {
      const booking = {
        id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        experience_id: bookingData.experience_id,
        user_id: bookingData.user_id || 'user_demo',
        responses: bookingData.responses || {},
        status: 'booked', // Changed from 'pending_confirmation' to 'booked'
        total_price: bookingData.total_price || 0,
        booking_date: bookingData.booking_date || new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        human_handoff_at: new Date().toISOString(),
        artisan_id: this.getArtisanIdFromExperience(bookingData.experience_id),
        // Analytics fields
        booking_source: 'cultural_match_assistant',
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        session_id: `session_${Date.now()}`,
        // Additional booking details
        craft_type: this.extractCraftTypeFromResponses(bookingData.responses),
        group_size: this.extractGroupSizeFromResponses(bookingData.responses),
        preferred_date: this.extractPreferredDateFromResponses(bookingData.responses),
        preferred_time: this.extractPreferredTimeFromResponses(bookingData.responses),
        special_requests: this.extractSpecialRequestsFromResponses(bookingData.responses)
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();

      if (error) {
        console.warn('Failed to save booking to Supabase:', error);
        // Log analytics for failed database saves
        await this.logAnalyticsEvent('booking_database_failure', {
          booking_id: booking.id,
          error: error.message,
          fallback_used: true
        });
        // Return mock booking ID as fallback
        return booking.id;
      }

      // Log successful booking analytics
      await this.logAnalyticsEvent('booking_completed', {
        booking_id: data.id,
        experience_id: bookingData.experience_id,
        total_price: bookingData.total_price,
        craft_type: booking.craft_type,
        group_size: booking.group_size,
        booking_source: 'cultural_match_assistant',
        status: 'booked' // Log the status
      });

      // Console log for debugging
      console.log('✅ BOOKING CREATED SUCCESSFULLY:', {
        id: data.id,
        status: 'BOOKED',
        experience: bookingData.experience_id,
        user: bookingData.user_id,
        total_price: bookingData.total_price,
        craft_type: booking.craft_type,
        timestamp: new Date().toISOString()
      });

      // Generate QR codes and send communications
      await this.handlePostBookingCommunications(data);

      // Trigger human handoff notification
      await this.notifyArtisan(data);

      return data.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // Log analytics for errors
      await this.logAnalyticsEvent('booking_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        booking_data: bookingData
      });
      
      // Return mock booking ID as fallback
      return `booking_${Date.now()}_fallback`;
    }
  }

  private getArtisanIdFromExperience(experience_id?: string): string {
    // Map experience IDs to artisan IDs
    const experienceToArtisan: Record<string, string> = {
      'exp1': 'artisan_hassan_pottery',
      'exp2': 'artisan_fatima_weaving', 
      'exp3': 'artisan_aicha_cooking',
      'exp4': 'artisan_ahmed_leather',
      'exp5': 'artisan_youssef_metalwork',
      'exp6': 'artisan_khadija_carpet'
    };
    
    return experienceToArtisan[experience_id || ''] || 'artisan_unknown';
  }

  private extractCraftTypeFromResponses(responses?: Record<string, any>): string {
    // Extract craft type from experience or responses
    return responses?.craft_type || 'unknown';
  }

  private extractGroupSizeFromResponses(responses?: Record<string, any>): string {
    return responses?.group_size || 'unknown';
  }

  private extractPreferredDateFromResponses(responses?: Record<string, any>): string {
    return responses?.preferred_date || '';
  }

  private extractPreferredTimeFromResponses(responses?: Record<string, any>): string {
    return responses?.preferred_time || '';
  }

  private extractSpecialRequestsFromResponses(responses?: Record<string, any>): string {
    return responses?.special_requests || '';
  }

  private async logAnalyticsEvent(eventType: string, data: any): Promise<void> {
    try {
      const analyticsEvent = {
        id: `analytics_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        event_type: eventType,
        event_data: data,
        timestamp: new Date().toISOString(),
        user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
        session_id: `session_${Date.now()}`
      };

      const { error } = await supabase
        .from('booking_analytics')
        .insert([analyticsEvent]);

      if (error) {
        console.warn('Failed to log analytics event:', error);
      }
    } catch (error) {
      console.warn('Analytics logging failed:', error);
    }
  }

  private async notifyArtisan(booking: any): Promise<void> {
    try {
      // Create notification record
      const notification = {
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        booking_id: booking.id,
        artisan_id: booking.artisan_id,
        type: 'new_booking',
        title: 'New Booking Received!',
        message: `You have a new booking for ${booking.craft_type}. Group size: ${booking.group_size}. Date: ${booking.preferred_date}`,
        status: 'pending',
        created_at: new Date().toISOString(),
        // Communication channels
        phone_sent: false,
        whatsapp_sent: false,
        email_sent: false
      };

      const { error } = await supabase
        .from('artisan_notifications')
        .insert([notification]);

      if (error) {
        console.warn('Failed to create artisan notification:', error);
      }

      // Log notification analytics
      await this.logAnalyticsEvent('artisan_notification_created', {
        booking_id: booking.id,
        artisan_id: booking.artisan_id,
        notification_id: notification.id
      });

      // In real implementation, this would:
      // 1. Send SMS/WhatsApp to artisan
      // 2. Send email with booking details
      // 3. Create push notification in artisan mobile app
      console.log('Artisan notification created for booking:', booking.id);
    } catch (error) {
      console.error('Failed to notify artisan:', error);
    }
  }

  generateAIResponse(template: string, userInput: string): string {
    return template
      .replace('{selection}', userInput)
      .replace('{response}', userInput);
  }

  calculatePrice(basePrice: number, groupSize: string, additionalOptions: any[] = []): number {
    let multiplier = 1;
    
    // Group size pricing
    if (groupSize.includes('2 people')) multiplier = 1.8;
    else if (groupSize.includes('3-4')) multiplier = 3.2;
    else if (groupSize.includes('5-6')) multiplier = 4.5;
    else if (groupSize.includes('7+') || groupSize.includes('Larger')) multiplier = 6.0;

    const total = basePrice * multiplier;
    return Math.round(total * 100) / 100; // Round to 2 decimal places
  }

  getArtisanContact(categoryId: string): {name: string; phone: string; whatsapp: string; avatar: string} {
    const contacts = {
      pottery: {
        name: 'Hassan Benali',
        phone: '+212 6 12 34 56 78',
        whatsapp: '+212 6 12 34 56 78',
        avatar: '👨‍🎨'
      },
      cooking: {
        name: 'Aicha Benjelloun',
        phone: '+212 6 23 45 67 89',
        whatsapp: '+212 6 23 45 67 89',
        avatar: '👩‍🍳'
      },
      weaving: {
        name: 'Fatima Zahra',
        phone: '+212 6 34 56 78 90',
        whatsapp: '+212 6 34 56 78 90',
        avatar: '👩‍🎨'
      },
      leather: {
        name: 'Ahmed Tazi',
        phone: '+212 6 45 67 89 01',
        whatsapp: '+212 6 45 67 89 01',
        avatar: '👨‍🔧'
      },
      metalwork: {
        name: 'Youssef El Fassi',
        phone: '+212 6 56 78 90 12',
        whatsapp: '+212 6 56 78 90 12',
        avatar: '👨‍🏭'
      },
      carpet: {
        name: 'Khadija Alami',
        phone: '+212 6 67 89 01 23',
        whatsapp: '+212 6 67 89 01 23',
        avatar: '👩‍🎨'
      }
    };

    return contacts[categoryId as keyof typeof contacts] || {
      name: 'Artisan Master',
      phone: '+212 6 XX XX XX XX',
      whatsapp: '+212 6 XX XX XX XX',
      avatar: '🎨'
    };
  }

  private async handlePostBookingCommunications(booking: any): Promise<void> {
    try {
      const artisan = this.getArtisanContact(booking.craft_type);
      
      // Convert booking to WhatsApp format
      const bookingDetails = {
        id: booking.id,
        experienceType: this.getCraftDisplayName(booking.craft_type),
        artisanName: artisan.name,
        date: booking.preferred_date || 'To be confirmed',
        time: booking.preferred_time || 'To be confirmed',
        groupSize: booking.group_size || 'Not specified',
        totalPrice: booking.total_price,
        customerName: 'Cultural Explorer',
        specialRequests: booking.special_requests || ''
      };

      // Generate payment QR code
      const paymentQR = await QRService.generatePaymentQR({
        bookingId: booking.id,
        amount: booking.total_price,
        currency: 'EUR',
        merchantName: 'Morocco Made Real',
        description: `Payment for ${bookingDetails.experienceType}`,
        recipientIBAN: 'MA64011519000001234567890',
        recipientPhone: artisan.phone
      });

      // Generate location QR code
      const locationQR = await QRService.generateLocationQR({
        latitude: this.getWorkshopCoordinates(booking.craft_type).lat,
        longitude: this.getWorkshopCoordinates(booking.craft_type).lng,
        placeName: `${artisan.name}'s Workshop`,
        address: `Traditional ${this.getCraftDisplayName(booking.craft_type)} Workshop, Morocco`
      });

      // Generate artisan contact QR
      const contactQR = await QRService.generateArtisanContactQR({
        name: artisan.name,
        phone: artisan.phone,
        whatsapp: artisan.whatsapp,
        workshop: `${artisan.name}'s Traditional Workshop`,
        specialty: this.getCraftDisplayName(booking.craft_type)
      });

      // Log QR generation success
      console.log('✅ QR CODES GENERATED:', {
        booking_id: booking.id,
        payment_qr: paymentQR ? 'Generated' : 'Failed',
        location_qr: locationQR ? 'Generated' : 'Failed',
        contact_qr: contactQR ? 'Generated' : 'Failed'
      });

      // Store QR URLs in booking (in real app, save to database)
      await this.logAnalyticsEvent('qr_codes_generated', {
        booking_id: booking.id,
        qr_types: ['payment', 'location', 'contact'],
        artisan_id: booking.artisan_id
      });

    } catch (error) {
      console.error('Failed to handle post-booking communications:', error);
      await this.logAnalyticsEvent('communication_error', {
        booking_id: booking.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private getCraftDisplayName(categoryId: string): string {
    const displayNames: { [key: string]: string } = {
      'pottery': 'Traditional Pottery',
      'weaving': 'Berber Weaving',
      'cooking': 'Moroccan Cooking',
      'leather': 'Leather Crafting',
      'metalwork': 'Traditional Metalwork',
      'carpet': 'Carpet Weaving',
      'zellige mosaic': 'Zellige Mosaic Art',
      'rug weaving': 'Traditional Rug Weaving',
      'weaving & knitting': 'Traditional Weaving & Knitting',
      'weaving & cooperative leadership': 'Artisan Cooperative Experience',
      'traditional bread baking': 'Traditional Bread Making'
    };
    
    return displayNames[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  }

  private getWorkshopCoordinates(craftType: string): { lat: number; lng: number } {
    // Mock workshop coordinates for different crafts in Morocco
    const coordinates: Record<string, { lat: number; lng: number }> = {
      pottery: { lat: 34.0181, lng: -5.0078 }, // Fez
      cooking: { lat: 31.6295, lng: -7.9811 }, // Marrakech
      weaving: { lat: 31.2001, lng: -7.8500 }, // Atlas Mountains
      leather: { lat: 31.6340, lng: -7.9990 }, // Marrakech Medina
      metalwork: { lat: 34.0350, lng: -5.0000 }, // Fez Medina
      carpet: { lat: 34.0209, lng: -6.8341 }  // Rabat
    };
    return coordinates[craftType] || { lat: 31.6295, lng: -7.9811 }; // Default to Marrakech
  }

  // Enhanced method to send booking confirmation with QR codes
  async sendBookingConfirmationWithQR(bookingId: string, customerPhone: string): Promise<void> {
    try {
      // Get booking details from database
      const { data: booking } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .single();

      if (!booking) {
        throw new Error('Booking not found');
      }

      const artisan = this.getArtisanContact(booking.craft_type);
      
      const bookingDetails = {
        id: booking.id,
        experienceType: this.getCraftDisplayName(booking.craft_type),
        artisanName: artisan.name,
        date: booking.preferred_date || 'To be confirmed',
        time: booking.preferred_time || 'To be confirmed',
        groupSize: booking.group_size || 'Not specified',
        totalPrice: booking.total_price,
        customerName: 'Cultural Explorer'
      };

      // Generate fresh QR codes
      const paymentQR = await QRService.generatePaymentQR({
        bookingId: booking.id,
        amount: booking.total_price,
        currency: 'EUR',
        merchantName: 'Morocco Made Real',
        description: `Payment for ${bookingDetails.experienceType}`,
        recipientIBAN: 'MA64011519000001234567890'
      });

      // Send confirmation with payment QR
      const confirmationUrl = WhatsAppService.sendBookingConfirmation(bookingDetails, customerPhone);
      const paymentUrl = WhatsAppService.sendPaymentRequest(bookingDetails, customerPhone, paymentQR);

      console.log('📱 WHATSAPP MESSAGES PREPARED:', {
        booking_id: bookingId,
        confirmation_url: confirmationUrl ? 'Ready' : 'Failed',
        payment_url: paymentUrl ? 'Ready' : 'Failed'
      });

    } catch (error) {
      console.error('Failed to send booking confirmation with QR:', error);
    }
  }
}

export default new BookingAgentService(); 