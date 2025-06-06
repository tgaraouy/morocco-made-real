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
      session: {
        id: session.id,
        status: session.status,
        phone: session.phone,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt
      }
    });
    
  } catch (error) {
    console.error('WhatsApp QR Status Check Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check session status' 
    }, { status: 500 });
  }
}

// Also handle GET requests for status checking
export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('sessionId');
  
  if (!sessionId) {
    return NextResponse.json({ 
      success: false, 
      error: 'Session ID is required' 
    }, { status: 400 });
  }
  
  try {
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
      session: {
        id: session.id,
        status: session.status,
        phone: session.phone,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt
      }
    });
    
  } catch (error) {
    console.error('WhatsApp QR Status Check Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check session status' 
    }, { status: 500 });
  }
} 