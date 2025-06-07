import { NextRequest, NextResponse } from 'next/server';
import { touristProfileService } from '@/lib/tourist-profile-service';
import { qrSessions } from '@/lib/session-storage';

// WhatsApp Webhook for Auto-Validation
// When user sends WhatsApp message with verification code, this endpoint receives it and auto-validates

// WhatsApp webhook verification token (set this in your environment variables)
const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFICATION_TOKEN || 'morocco_made_real_webhook_2024';

// Verify webhook (required by WhatsApp)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ WhatsApp Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error('❌ WhatsApp Webhook verification failed');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

// Handle incoming WhatsApp messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📱 WhatsApp Webhook received:', JSON.stringify(body, null, 2));

    // Check if this is a WhatsApp message
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const message = change.value.messages?.[0];
            const contact = change.value.contacts?.[0];
            
            if (message && contact) {
              const phoneNumber = contact.wa_id;
              const messageText = message.text?.body;
              
              console.log(`📞 Message from ${phoneNumber}: ${messageText}`);
              
              // Look for verification code pattern (6 digits)
              const codeMatch = messageText?.match(/\b(\d{6})\b/);
              if (codeMatch) {
                const receivedCode = codeMatch[1];
                console.log(`🔢 Extracted code: ${receivedCode}`);
                
                // Find matching session by phone number and code
                let verifiedSessionId = null;
                for (const [sessionId, session] of qrSessions.entries()) {
                  if (session.phone.replace(/[^\d]/g, '') === phoneNumber && 
                      session.code === receivedCode && 
                      session.status === 'pending') {
                    
                    // Check if not expired
                    const now = new Date();
                    const expiresAt = new Date(session.expiresAt);
                    
                    if (now <= expiresAt) {
                      session.status = 'verified';
                      session.verifiedAt = new Date().toISOString();
                      qrSessions.set(sessionId, session);
                      verifiedSessionId = sessionId;
                      
                      console.log(`✅ Phone ${phoneNumber} verified with session ${sessionId}`);
                      break;
                    } else {
                      session.status = 'expired';
                      qrSessions.set(sessionId, session);
                      console.log(`⏰ Session ${sessionId} expired`);
                    }
                  }
                }
                
                if (!verifiedSessionId) {
                  console.log(`❌ No matching session found for ${phoneNumber} with code ${receivedCode}`);
                }
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
    
  } catch (error) {
    console.error('❌ WhatsApp Webhook Error:', error);
    return NextResponse.json({ 
      error: 'Webhook processing failed' 
    }, { status: 500 });
  }
}

async function processWhatsAppMessage(message: any, metadata: any) {
  try {
    console.log('📨 Processing WhatsApp message:', message);

    // Extract phone number and message content
    const phone = message.from;
    const messageText = message.text?.body || '';
    const messageId = message.id;

    // Look for 6-digit verification codes in the message
    const codeMatch = messageText.match(/\b\d{6}\b/);
    
    if (codeMatch) {
      const verificationCode = codeMatch[0];
      console.log(`🔐 Found verification code ${verificationCode} from ${phone}`);

      // Auto-validate the code
      const result = await touristProfileService.verifyPhoneCode(`+${phone}`, verificationCode);

      if (result.success) {
        console.log('✅ Auto-verification successful!');
        
        // Send confirmation message back to user
        await sendWhatsAppConfirmation(phone, {
          success: true,
          message: '🎉 Phone verified successfully! Welcome to Morocco Made Real!'
        });

        // Store the verification event
        await logVerificationEvent({
          phone: `+${phone}`,
          code: verificationCode,
          method: 'whatsapp_webhook',
          messageId,
          status: 'success',
          timestamp: new Date().toISOString()
        });

      } else {
        console.log('❌ Auto-verification failed:', result.error);
        
        // Send error message back to user
        await sendWhatsAppConfirmation(phone, {
          success: false,
          message: '❌ Invalid or expired code. Please try again.'
        });
      }
    } else {
      console.log('No verification code found in message');
    }

  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
  }
}

async function sendWhatsAppConfirmation(phone: string, result: { success: boolean; message: string }) {
  try {
    // Only send confirmation if WhatsApp Business API is configured
    if (!process.env.WHATSAPP_BUSINESS_API_TOKEN) {
      console.log('WhatsApp Business API not configured, skipping confirmation message');
      return;
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_BUSINESS_PHONE_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_BUSINESS_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: {
          body: result.message
        }
      })
    });

    if (response.ok) {
      console.log('✅ Confirmation message sent');
    } else {
      console.error('❌ Failed to send confirmation message');
    }

  } catch (error) {
    console.error('Error sending WhatsApp confirmation:', error);
  }
}

async function logVerificationEvent(event: any) {
  try {
    // Log to database or analytics service
    console.log('📊 Verification event:', event);
    
    // You could store this in Supabase or your analytics system
    // await supabase.from('verification_events').insert(event);
    
  } catch (error) {
    console.error('Error logging verification event:', error);
  }
} 