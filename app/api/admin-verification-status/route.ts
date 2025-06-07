import { NextRequest, NextResponse } from 'next/server';
import { qrSessions } from '@/lib/session-storage';

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Session ID is required' 
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
    }
    
    return NextResponse.json({
      success: true,
      verified: session.status === 'verified',
      status: session.status,
      userPhone: session.userPhone,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      verifiedAt: session.verifiedAt || null
    });
    
  } catch (error) {
    console.error('Admin verification status check error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check verification status' 
    }, { status: 500 });
  }
} 