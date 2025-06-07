import { NextRequest, NextResponse } from 'next/server';
import { qrSessions } from '@/lib/session-storage';

// WhatsApp Cloud API Webhook for Auto-Validation
// Receives messages from Meta's WhatsApp Cloud API and auto-validates verification codes

const WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFICATION_TOKEN || 'morocco_made_real_webhook_2024';

// Verify webhook (required by Meta WhatsApp Cloud API)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  console.log('🔍 Webhook verification attempt:', { mode, token: token ? 'PROVIDED' : 'MISSING' });

  if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ WhatsApp Cloud API Webhook verified successfully');
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error('❌ WhatsApp Cloud API Webhook verification failed - invalid token');
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

// Handle incoming WhatsApp messages from Cloud API
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📱 WhatsApp Cloud API Webhook received:', JSON.stringify(body, null, 2));

    // Verify this is a WhatsApp Business Account webhook
    if (body.object === 'whatsapp_business_account') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === 'messages') {
            const value = change.value;
            
            // Check for incoming messages
            if (value.messages && value.messages.length > 0) {
              for (const message of value.messages) {
                await processIncomingMessage(message, value);
              }
            }

            // Check for message status updates (delivered, read, etc.)
            if (value.statuses && value.statuses.length > 0) {
              for (const status of value.statuses) {
                console.log('📊 Message status update:', {
                  messageId: status.id,
                  status: status.status,
                  timestamp: status.timestamp
                });
              }
            }
          }
        }
      }
    } else {
      console.log('🔍 Non-WhatsApp webhook received:', body.object);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ status: 'received' }, { status: 200 });
    
  } catch (error) {
    console.error('❌ WhatsApp Cloud API Webhook Error:', error);
    // Still return 200 to prevent Meta from retrying
    return NextResponse.json({ 
      status: 'error',
      message: 'Webhook processing failed' 
    }, { status: 200 });
  }
}

async function processIncomingMessage(message: any, value: any) {
  try {
    const phoneNumber = message.from;
    const messageType = message.type;
    
    console.log(`📨 Processing message from ${phoneNumber}, type: ${messageType}`);

    // Only process text messages for verification codes
    if (messageType === 'text') {
      const messageText = message.text?.body;
      const messageId = message.id;
      const timestamp = message.timestamp;

      console.log(`💬 Text message: "${messageText}"`);
      
      // Look for verification code pattern (6 digits)
      const codeMatch = messageText?.match(/\b(\d{6})\b/);
      
      if (codeMatch) {
        const receivedCode = codeMatch[1];
        console.log(`🔢 Found verification code: ${receivedCode}`);
        
        // Find matching session by phone number and code
        await processVerificationCode(phoneNumber, receivedCode, messageId);
      } else {
        console.log('📝 Message does not contain verification code');
        
        // Optional: Send helpful response for non-code messages
        if (messageText?.toLowerCase().includes('help') || messageText?.toLowerCase().includes('code')) {
          await sendHelpMessage(phoneNumber);
        }
      }
    } else {
      console.log(`📎 Received ${messageType} message - ignoring for verification`);
    }

  } catch (error) {
    console.error('❌ Error processing incoming message:', error);
  }
}

async function processVerificationCode(phoneNumber: string, code: string, messageId: string) {
  try {
    // Don't force Morocco country code - use the number as WhatsApp provides it
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    console.log(`🔍 Looking for verification session for ${formattedPhone} with code ${code}`);

    // Find matching session
    let verifiedSessionId = null;
    let session = null;

    for (const [sessionId, sess] of qrSessions.entries()) {
      if (sess.phone === formattedPhone && 
          sess.code === code && 
          sess.status === 'pending') {
        
        // Check if not expired
        const now = new Date();
        const expiresAt = new Date(sess.expiresAt);
        
        if (now <= expiresAt) {
          sess.status = 'verified';
          sess.verifiedAt = new Date().toISOString();
          sess.messageId = messageId;
          qrSessions.set(sessionId, sess);
          
          verifiedSessionId = sessionId;
          session = sess;
          
          console.log(`✅ Auto-verified session ${sessionId} for phone ${formattedPhone}`);
          break;
        } else {
          sess.status = 'expired';
          qrSessions.set(sessionId, sess);
          console.log(`⏰ Session ${sessionId} expired`);
        }
      }
    }
    
    if (verifiedSessionId) {
      // Send success confirmation
      await sendVerificationSuccessMessage(phoneNumber);
      
      // Log the verification event
      console.log('📊 Verification event logged:', {
        phone: formattedPhone,
        code,
        method: 'whatsapp_cloud_api_auto',
        messageId,
        sessionId: verifiedSessionId,
        status: 'success',
        timestamp: new Date().toISOString()
      });
      
    } else {
      console.log(`❌ No valid session found for ${formattedPhone} with code ${code}`);
      await sendVerificationErrorMessage(phoneNumber);
    }

  } catch (error) {
    console.error('❌ Error processing verification code:', error);
  }
}

async function sendVerificationSuccessMessage(phoneNumber: string) {
  try {
    const token = process.env.WHATSAPP_BUSINESS_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_ID;
    
    if (!token || !phoneNumberId) {
      console.log('⚠️ WhatsApp Business API not configured for auto-responses');
      return;
    }

    const message = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: {
        body: `✅ *Verification Successful!*\n\nWelcome to Morocco Made Real! Your phone has been verified.\n\n🎉 You can now discover authentic artisan stories and book cultural experiences.\n\nStart exploring: morocco-made-real.com`
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
      console.log('✅ Verification success message sent');
    } else {
      const error = await response.json();
      console.error('❌ Failed to send success message:', error);
    }

  } catch (error) {
    console.error('❌ Error sending verification success message:', error);
  }
}

async function sendVerificationErrorMessage(phoneNumber: string) {
  try {
    const token = process.env.WHATSAPP_BUSINESS_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_ID;
    
    if (!token || !phoneNumberId) {
      return;
    }

    const message = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: {
        body: `❌ *Invalid or Expired Code*\n\nThe verification code you sent is either invalid or has expired.\n\n🔄 Please request a new code from the app and try again.\n\nNeed help? Visit: morocco-made-real.com`
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
      console.log('✅ Verification error message sent');
    }

  } catch (error) {
    console.error('❌ Error sending verification error message:', error);
  }
}

async function sendHelpMessage(phoneNumber: string) {
  try {
    const token = process.env.WHATSAPP_BUSINESS_API_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_BUSINESS_PHONE_ID;
    
    if (!token || !phoneNumberId) {
      return;
    }

    const message = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: {
        body: `🆘 *Morocco Made Real Help*\n\nTo verify your phone:\n1️⃣ Request a verification code in the app\n2️⃣ Reply with the 6-digit code you receive\n\n💡 The code expires in 10 minutes.\n\nVisit: morocco-made-real.com`
      }
    };

    await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

  } catch (error) {
    console.error('❌ Error sending help message:', error);
  }
} 