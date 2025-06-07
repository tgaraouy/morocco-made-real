import { NextRequest, NextResponse } from 'next/server';
import { qrSessions, cleanupExpiredSessions } from '@/lib/session-storage';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Phone number is required' 
      }, { status: 400 });
    }

    // Clean and properly format international phone number
    let cleanPhone = phone.replace(/[^\d+]/g, ''); // Keep + and digits only
    
    // Remove + from the beginning for processing
    if (cleanPhone.startsWith('+')) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    // Don't force any specific country code - use as provided
    const formattedPhone = cleanPhone;

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create session ID
    const sessionId = `whatsapp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    
    // Store session
    const session = {
      id: sessionId,
      phone: `+${formattedPhone}`,
      code,
      status: 'pending',
      expiresAt,
      createdAt: new Date().toISOString(),
      method: 'whatsapp_cloud_api'
    };
    
    qrSessions.set(sessionId, session);

    // Send WhatsApp message via Cloud API
    const messageSent = await sendWhatsAppCode(formattedPhone, code);
    
    if (!messageSent.success) {
      return NextResponse.json({ 
        success: false, 
        error: messageSent.error || 'Failed to send WhatsApp message' 
      }, { status: 500 });
    }

    // Clean up expired sessions
    cleanupExpiredSessions();
    
    console.log(`✅ WhatsApp verification code sent to +${formattedPhone}`);
    
    return NextResponse.json({
      success: true,
      session: {
        id: sessionId,
        phone: `+${formattedPhone}`,
        expiresAt,
        messageId: messageSent.messageId
      }
    });
    
  } catch (error) {
    console.error('WhatsApp Code Send Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send verification code' 
    }, { status: 500 });
  }
}

async function sendWhatsAppCode(phone: string, code: string) {
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
      console.log('🔧 Development Mode: Using placeholder tokens - no real WhatsApp message sent');
      console.log(`📱 Would send code ${code} to ${phone}`);
      return { 
        success: true, 
        messageId: 'dev_mock_message_id',
        note: 'Development mode - no actual message sent. Configure real WhatsApp Cloud API tokens for production.' 
      };
    }

    console.log('🚀 Production Mode: Sending real WhatsApp message via Cloud API');

    const message = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'template',
      template: {
        name: 'verification_code', // You need to create this template in Meta Business
        language: {
          code: 'en'
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: code
              }
            ]
          }
        ]
      }
    };

    // Fallback to text message if template not available
    const fallbackMessage = {
      messaging_product: 'whatsapp',
      to: phone,
      type: 'text',
      text: {
        body: `🇲🇦 *Morocco Made Real* - Your verification code is: *${code}*\n\nThis code will expire in 10 minutes.\n\n_Do not share this code with anyone._`
      }
    };

    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fallbackMessage) // Using fallback for now
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ WhatsApp message sent successfully:', result.messages?.[0]?.id);
      return { 
        success: true, 
        messageId: result.messages?.[0]?.id 
      };
    } else {
      console.error('❌ WhatsApp API Error:', result);
      return { 
        success: false, 
        error: result.error?.message || 'WhatsApp API request failed' 
      };
    }

  } catch (error) {
    console.error('❌ WhatsApp Send Error:', error);
    return { 
      success: false, 
      error: 'Network error while sending WhatsApp message' 
    };
  }
} 