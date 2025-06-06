import { NextRequest, NextResponse } from 'next/server';
import { qrSessions, cleanupExpiredSessions } from '@/lib/session-storage';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Phone number is required' 
      }, { status: 400 });
    }
    
    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create session ID
    const sessionId = `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
    // Generate WhatsApp URL with pre-filled message
    const message = `🇲🇦 Morocco Made Real verification code: ${code}\n\nValid for 10 minutes. Reply with this code to verify your phone number.\n\nDo not share this code.`;
    const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
    
    // Store session
    const session = {
      id: sessionId,
      phone,
      code,
      whatsappUrl,
      status: 'pending',
      expiresAt,
      createdAt: new Date().toISOString()
    };
    
    qrSessions.set(sessionId, session);
    
    // Clean up expired sessions
    cleanupExpiredSessions();
    
    return NextResponse.json({
      success: true,
      session
    });
    
  } catch (error) {
    console.error('WhatsApp QR Generation Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate QR code' 
    }, { status: 500 });
  }
} 