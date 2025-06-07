import { NextRequest, NextResponse } from 'next/server';
import { qrSessions } from '@/lib/session-storage';

// Admin verification system - Admin WhatsApp sends codes TO users
export async function POST(request: NextRequest) {
  try {
    const { userPhone, adminPhone } = await request.json();
    
    if (!userPhone || !adminPhone) {
      return NextResponse.json({ 
        success: false, 
        error: 'User phone and admin phone are required' 
      }, { status: 400 });
    }
    
    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create session ID
    const sessionId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
    // Create admin message to send TO the user
    const adminMessage = `🇲🇦 Morocco Made Real verification code for ${userPhone}:

${code}

Valid for 5 minutes. Send this code to the user to complete their verification.

Session: ${sessionId}`;
    
    // Create WhatsApp URL for admin to send message
    const adminWhatsAppUrl = `https://wa.me/${userPhone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`🇲🇦 Morocco Made Real verification code: ${code}\n\nValid for 5 minutes. Reply "VERIFIED" to confirm.\n\nWelcome to authentic Moroccan experiences!`)}`;
    
    // Store session
    const session = {
      id: sessionId,
      userPhone,
      adminPhone,
      code,
      adminMessage,
      adminWhatsAppUrl,
      status: 'pending',
      expiresAt,
      createdAt: new Date().toISOString(),
      type: 'admin_verification'
    };
    
    qrSessions.set(sessionId, session);
    
    // In a real implementation, you would:
    // 1. Send the code directly via WhatsApp Business API
    // 2. Or trigger a notification to admin to send the code
    
    console.log(`📱 Admin verification requested for ${userPhone}`);
    console.log(`🔐 Code: ${code}`);
    console.log(`📧 Admin should send via WhatsApp: ${adminWhatsAppUrl}`);
    
    // For demo purposes, simulate admin sending the code
    // In production, replace with actual WhatsApp Business API call
    await simulateAdminSendCode(session);
    
    return NextResponse.json({
      success: true,
      sessionId,
      message: 'Verification code sent to user',
      // For demo/development only
      devInfo: {
        code,
        adminMessage,
        adminWhatsAppUrl
      }
    });
    
  } catch (error) {
    console.error('Admin verification send error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to send verification code' 
    }, { status: 500 });
  }
}

// Simulate admin sending code (replace with real WhatsApp Business API)
async function simulateAdminSendCode(session: any) {
  try {
    // In development, we simulate the admin action
    if (process.env.NODE_ENV === 'development') {
      // Wait 2 seconds to simulate admin action
      setTimeout(() => {
        console.log(`🤖 SIMULATED: Admin sent code ${session.code} to ${session.userPhone}`);
        
        // Auto-verify after 10 seconds for demo
        setTimeout(() => {
          session.status = 'verified';
          session.verifiedAt = new Date().toISOString();
          qrSessions.set(session.id, session);
          console.log(`✅ SIMULATED: User ${session.userPhone} verified with code ${session.code}`);
        }, 10000);
        
      }, 2000);
    }
    
    // In production, you would call WhatsApp Business API here:
    // await sendWhatsAppMessage(session.userPhone, `Your Morocco Made Real code: ${session.code}`);
    
  } catch (error) {
    console.error('Error simulating admin send:', error);
  }
} 