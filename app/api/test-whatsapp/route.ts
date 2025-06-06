import { NextRequest, NextResponse } from 'next/server';
import { whatsappVerificationService } from '@/lib/whatsapp-verification-service';

export async function POST(request: NextRequest) {
  try {
    const { phone, code, language, method } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    // Generate a verification code if not provided
    const verificationCode = code || Math.floor(100000 + Math.random() * 900000).toString();
    
    // Generate WhatsApp verification
    const result = await whatsappVerificationService.sendWhatsAppVerification(phone, verificationCode, {
      method: method || 'link',
      language: language || 'en'
    });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        whatsappUrl: result.whatsappUrl,
        verificationId: result.verificationId,
        code: verificationCode, // For testing only
        message: `WhatsApp verification ready! Click the URL to open WhatsApp.`
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('WhatsApp test API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate WhatsApp verification' 
    }, { status: 500 });
  }
} 