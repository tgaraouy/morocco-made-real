import { NextRequest, NextResponse } from 'next/server';
import { whatsappQRService } from '@/lib/whatsapp-qr-service';

export async function POST(request: NextRequest) {
  try {
    const { phone, action } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }
    
    console.log(`🔄 QR Testing API: ${action} for ${phone}`);
    
    if (action === 'generate') {
      // Generate auto-validation QR
      const result = await whatsappQRService.generateAutoValidationQR(phone);
      
      if (result.success) {
        return NextResponse.json({
          success: true,
          qrSession: result.qrSession,
          qrCodeData: result.qrCodeData,
          whatsappUrl: result.whatsappUrl,
          message: 'QR auto-validation generated successfully!'
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          error: result.error 
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('QR Testing API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process QR request' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }
    
    // Check verification status
    const result = await whatsappQRService.checkVerificationStatus(sessionId);
    
    return NextResponse.json({
      success: true,
      status: result.status,
      profile: result.profile
    });
    
  } catch (error) {
    console.error('QR Status Check error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to check verification status' 
    }, { status: 500 });
  }
} 