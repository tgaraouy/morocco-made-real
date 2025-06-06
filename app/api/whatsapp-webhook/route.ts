import { NextRequest, NextResponse } from 'next/server';
import { touristProfileService } from '@/lib/tourist-profile-service';

// WhatsApp Webhook for Auto-Validation
// When user sends WhatsApp message with verification code, this endpoint receives it and auto-validates

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📱 WhatsApp webhook received:', body);

    // WhatsApp webhook verification (first time setup)
    if (body.hub && body.hub.challenge) {
      const challenge = body.hub.challenge;
      console.log('✅ WhatsApp webhook challenge:', challenge);
      return new NextResponse(challenge, { status: 200 });
    }

    // Process incoming WhatsApp messages
    if (body.object === 'whatsapp_business_account' && body.entry) {
      for (const entry of body.entry) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'messages' && change.value.messages) {
              for (const message of change.value.messages) {
                await processWhatsAppMessage(message, change.value.metadata);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ WhatsApp webhook error:', error);
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // WhatsApp webhook verification
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ WhatsApp webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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