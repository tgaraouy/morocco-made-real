import { NextRequest, NextResponse } from 'next/server';
import { touristProfileService } from '@/lib/tourist-profile-service';

// Global session storage that matches other endpoints
// In production, this should be replaced with Redis or a database
declare global {
  var qrSessionStorage: Map<string, any> | undefined;
}

const qrSessions = globalThis.qrSessionStorage ?? new Map<string, any>();
globalThis.qrSessionStorage = qrSessions;

// Simulate WhatsApp webhook message for testing
// This simulates what happens when a user sends a WhatsApp message with verification code

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Simulating WhatsApp webhook response...');
    
    const body = await request.json();
    const { phone, code, sessionId } = body;
    
    if (!phone || !code) {
      return NextResponse.json(
        { success: false, error: 'Phone and verification code are required' },
        { status: 400 }
      );
    }

    console.log('📱 Simulating verification for:', phone, 'with code:', code, 'session:', sessionId);

    // Update QR session status if sessionId provided
    if (sessionId && qrSessions.has(sessionId)) {
      const session = qrSessions.get(sessionId);
      
      // Check if the code matches and session is still valid
      if (session.code === code && session.status === 'pending') {
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        if (now <= expiresAt) {
          // Mark session as verified
          session.status = 'verified';
          session.verifiedAt = new Date().toISOString();
          qrSessions.set(sessionId, session);
          console.log('✅ QR Session marked as verified:', sessionId);
        } else {
          session.status = 'expired';
          qrSessions.set(sessionId, session);
          console.log('⏰ QR Session expired:', sessionId);
        }
      }
    }

    // Simulate the webhook verification process
    const result = await touristProfileService.verifyPhoneCode(phone, code);
    
    if (result.success) {
      console.log('✅ Simulated webhook verification successful');
      
      // Return JSON response for API calls instead of HTML
      return NextResponse.json({
        success: true,
        verified: true,
        phone,
        code,
        sessionId,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('❌ Simulated webhook verification failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('💥 Error in simulated webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to simulate different webhook scenarios
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scenario = searchParams.get('scenario') || 'success';
  
  const scenarios = {
    success: {
      description: 'Successful verification code message',
      payload: {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messages: [{
                id: 'test_message_success',
                from: '212612345678',
                text: { body: 'Morocco Made Real verification code: 123456' },
                timestamp: Math.floor(Date.now() / 1000)
              }]
            }
          }]
        }]
      }
    },
    invalid_code: {
      description: 'Invalid verification code',
      payload: {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messages: [{
                id: 'test_message_invalid',
                from: '212612345678',
                text: { body: 'Morocco Made Real verification code: 999999' },
                timestamp: Math.floor(Date.now() / 1000)
              }]
            }
          }]
        }]
      }
    },
    no_code: {
      description: 'Message without verification code',
      payload: {
        object: 'whatsapp_business_account',
        entry: [{
          changes: [{
            field: 'messages',
            value: {
              messages: [{
                id: 'test_message_no_code',
                from: '212612345678',
                text: { body: 'Hello, how are you?' },
                timestamp: Math.floor(Date.now() / 1000)
              }]
            }
          }]
        }]
      }
    }
  };
  
  return NextResponse.json({
    success: true,
    scenarios: Object.keys(scenarios),
    selectedScenario: scenario,
    payload: scenarios[scenario] || scenarios.success
  });
} 