import { NextRequest, NextResponse } from 'next/server';

// Manual webhook testing endpoint
// This simulates what happens when WhatsApp sends a message to our webhook

export async function POST(request: NextRequest) {
  try {
    const { phone, code, sessionId } = await request.json();
    
    console.log(`🧪 Manual Webhook Test: ${phone} with code ${code}`);
    
    // Simulate the actual webhook processing
    const webhookResult = await processWebhookMessage(phone, code, sessionId);
    
    return NextResponse.json({
      success: true,
      message: 'Webhook processed successfully',
      result: webhookResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Manual webhook test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function processWebhookMessage(phone: string, code: string, sessionId?: string) {
  // This simulates the exact same processing that would happen in production
  
  console.log(`📱 Processing WhatsApp message from ${phone}`);
  console.log(`🔍 Extracting verification code: ${code}`);
  
  // Simulate code extraction from message
  const extractedCode = code.match(/\d{6}/)?.[0];
  
  if (!extractedCode) {
    return {
      status: 'failed',
      reason: 'No valid 6-digit code found in message'
    };
  }
  
  console.log(`✅ Code extracted: ${extractedCode}`);
  
  // Simulate database lookup and validation
  // In production, this would check against the actual database
  console.log(`🔍 Looking up verification session for ${phone}...`);
  
  // Simulate successful validation
  const isValid = extractedCode.length === 6;
  
  if (isValid) {
    console.log(`🎉 Verification successful for ${phone}!`);
    
    // Simulate database update
    console.log(`💾 Updating database: phone_verified = true`);
    
    // Simulate sending confirmation message back to user
    console.log(`📤 Sending WhatsApp confirmation: "✅ Phone verified successfully!"`);
    
    return {
      status: 'verified',
      phone: phone,
      code: extractedCode,
      verified_at: new Date().toISOString(),
      response_time_ms: Math.floor(Math.random() * 500) + 100, // 100-600ms
      confirmation_sent: true
    };
  } else {
    return {
      status: 'failed',
      reason: 'Invalid verification code format'
    };
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Manual Webhook Test Endpoint',
    usage: 'POST with { phone, code, sessionId }',
    example: {
      phone: '+212612345678',
      code: '340242',
      sessionId: 'qr_session_id'
    }
  });
} 