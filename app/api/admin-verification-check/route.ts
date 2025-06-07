import { NextRequest, NextResponse } from 'next/server';
import { qrSessions } from '@/lib/session-storage';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, code } = await request.json();
    
    if (!sessionId || !code) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session ID and verification code are required' 
      }, { status: 400 });
    }
    
    const session = qrSessions.get(sessionId);
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session not found' 
      }, { status: 404 });
    }
    
    // Check if session has expired
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    if (now > expiresAt) {
      session.status = 'expired';
      qrSessions.set(sessionId, session);
      return NextResponse.json({ 
        success: false, 
        error: 'Verification code has expired' 
      }, { status: 400 });
    }
    
    // Check if code matches
    if (session.code !== code) {
      console.log(`❌ Invalid code attempt: ${code} vs ${session.code} for session ${sessionId}`);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid verification code' 
      }, { status: 400 });
    }
    
    // Verify the session
    session.status = 'verified';
    session.verifiedAt = new Date().toISOString();
    qrSessions.set(sessionId, session);
    
    console.log(`✅ Manual verification successful for ${session.userPhone} with session ${sessionId}`);
    
    return NextResponse.json({
      success: true,
      message: 'Phone number verified successfully',
      userPhone: session.userPhone,
      verifiedAt: session.verifiedAt
    });
    
  } catch (error) {
    console.error('Admin verification check error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to verify code' 
    }, { status: 500 });
  }
} 