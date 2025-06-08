import { NextRequest, NextResponse } from 'next/server';
import { qrSessions } from '@/lib/session-storage';
import { touristProfileService } from '@/lib/tourist-profile-service';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, code, phone } = await request.json();
    
    if (!sessionId && !phone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session ID or phone number is required' 
      }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ 
        success: false, 
        error: 'Verification code is required' 
      }, { status: 400 });
    }

    let session = null;

    // Find session by sessionId or phone number
    if (sessionId) {
      session = qrSessions.get(sessionId);
    } else {
      // Find by phone number if sessionId not provided
      let cleanPhone = phone.replace(/[^\d+]/g, ''); // Keep + and digits only
      
      // Remove + from the beginning for processing
      if (cleanPhone.startsWith('+')) {
        cleanPhone = cleanPhone.substring(1);
      }
      
      const formattedPhone = `+${cleanPhone}`;
      
      for (const [id, sess] of qrSessions.entries()) {
        if (sess.phone === formattedPhone && sess.status === 'pending') {
          session = sess;
          break;
        }
      }
    }

    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session not found or expired' 
      }, { status: 404 });
    }

    // Check if session is expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    if (now > expiresAt) {
      session.status = 'expired';
      qrSessions.set(session.id, session);
      
      return NextResponse.json({ 
        success: false, 
        error: 'Verification code has expired' 
      }, { status: 400 });
    }

    // Verify the code
    const isValidCode = session.code === code.toString() || 
                        session.smsCode === code.toString() ||
                        (session.method === 'sms' && session.code === code.toString());
    
    // In development, also accept common demo codes for testing
    const isDemoCode = process.env.NODE_ENV === 'development' && 
                       (code === '550998' || code === '123456' || code === '000000');
    
    if (!isValidCode && !isDemoCode) {
      console.log(`❌ Code verification failed: session.code=${session.code}, session.smsCode=${session.smsCode}, provided=${code}`);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid verification code' 
      }, { status: 400 });
    }

    // Mark session as verified
    session.status = 'verified';
    session.verifiedAt = new Date().toISOString();
    qrSessions.set(session.id, session);

    // Create or update tourist profile
    let profile = await touristProfileService.getProfile(session.phone);
    
    if (!profile) {
      const basicProfile = {
        id: `tourist_${Date.now()}`,
        phone: session.phone,
        phone_verified: true,
        first_name: 'Cultural Explorer',
        preferences: {
          mood: 'creative',
          timeAvailable: 'half-day',
          priceRange: 'moderate'
        },
        saved_experiences: [],
        booking_history: [],
        preferences_set: false,
        total_bookings: 0,
        total_spent: 0,
        whatsapp_enabled: true,
        sms_enabled: true,
        marketing_consent: false,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString()
      };
      
      const result = await touristProfileService.upsertProfile(session.phone, basicProfile);
      profile = result.profile;
    } else {
      // Update existing profile to mark as verified
      const updateData = {
        phone_verified: true,
        last_active: new Date().toISOString()
      };
      
      const result = await touristProfileService.upsertProfile(profile.phone, updateData);
      profile = result.profile || profile;
    }

    // Send confirmation message
    await sendConfirmationMessage(session.phone);

    console.log(`✅ Phone verified successfully: ${session.phone}`);
    
    return NextResponse.json({
      success: true,
      message: 'Phone verified successfully',
      profile: {
        phone: profile.phone,
        phone_verified: profile.phone_verified,
        first_name: profile.first_name
      }
    });
    
  } catch (error) {
    console.error('WhatsApp Code Verification Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to verify code' 
    }, { status: 500 });
  }
}

async function sendConfirmationMessage(phone: string) {
  try {
    const token = process.env.WHATSAPP_BUSINESS_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_ID;
    
    // Check if we have real tokens or just placeholders
    const hasRealTokens = token && 
                         phoneNumberId && 
                         !token.includes('your_') && 
                         !token.includes('placeholder') &&
                         !phoneNumberId.includes('your_') && 
                         !phoneNumberId.includes('placeholder') &&
                         token.length > 20; // Real tokens are long
    
    if (!hasRealTokens) {
      console.log('🔧 Development Mode: Skipping confirmation message - placeholder tokens detected');
      console.log(`📱 Would send confirmation to ${phone}`);
      return;
    }

    console.log('🚀 Production Mode: Sending real confirmation message via Cloud API');

    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    const message = {
      messaging_product: 'whatsapp',
      to: cleanPhone,
      type: 'text',
      text: {
        body: `🎉 *Welcome to Morocco Made Real!*\n\nYour phone has been verified successfully. You can now:\n\n🔍 Discover authentic artisan stories\n🎨 Book cultural experiences\n🏆 Earn your Cultural Explorer Pass\n\nStart exploring: morocco-made-real.com`
      }
    };

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    if (response.ok) {
      console.log('✅ Confirmation message sent successfully');
    } else {
      console.error('❌ Failed to send confirmation message');
    }

  } catch (error) {
    console.error('Error sending confirmation message:', error);
  }
} 