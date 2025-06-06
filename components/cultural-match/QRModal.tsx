'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Download, 
  Share, 
  Copy, 
  CheckCircle,
  CreditCard,
  Award,
  MapPin,
  Phone,
  Bookmark,
  RefreshCw
} from 'lucide-react';
import QRService, { PaymentQRData, BlockchainCertificateQRData, LocationQRData } from '@/lib/qr-service';
import WhatsAppService, { BookingDetails } from '@/lib/whatsapp-service';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'payment' | 'certificate' | 'location' | 'contact' | 'booking';
  booking: BookingDetails;
  data?: any; // Additional data specific to QR type
}

export default function QRModal({ isOpen, onClose, type, booking, data }: QRModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      generateQRCode();
    }
  }, [isOpen, type, booking]);

  const generateQRCode = async () => {
    setIsLoading(true);
    try {
      let qrDataUrl = '';
      
      switch (type) {
        case 'payment':
          const paymentData: PaymentQRData = {
            bookingId: booking.id,
            amount: booking.totalPrice,
            currency: 'EUR',
            merchantName: 'Morocco Made Real',
            description: `Payment for ${booking.experienceType}`,
            recipientIBAN: 'MA64011519000001234567890',
            recipientPhone: '+212612345678'
          };
          qrDataUrl = await QRService.generatePaymentQR(paymentData);
          
          // Generate WhatsApp message for payment
          setWhatsappUrl(WhatsAppService.sendPaymentRequest(booking, data?.customerPhone || '', qrDataUrl));
          break;
          
        case 'certificate':
          const certificateData: BlockchainCertificateQRData = {
            bookingId: booking.id,
            experienceType: booking.experienceType,
            artisanName: booking.artisanName,
            completionDate: booking.date,
            certificateHash: `0x${Math.random().toString(16).substr(2, 64)}`, // Mock hash
            blockchainNetwork: 'Polygon',
            verificationUrl: `https://verify.moroccomadereal.com/certificate/${booking.id}`
          };
          qrDataUrl = await QRService.generateBlockchainCertificateQR(certificateData);
          
          // Generate WhatsApp message for certificate
          setWhatsappUrl(WhatsAppService.sendBlockchainCertificate(booking, data?.customerPhone || '', qrDataUrl));
          break;
          
        case 'location':
          const locationData: LocationQRData = {
            latitude: data?.latitude || 31.6295,
            longitude: data?.longitude || -7.9811,
            placeName: data?.placeName || `${booking.artisanName}'s Workshop`,
            address: data?.address || 'Traditional Medina Quarter, Morocco'
          };
          qrDataUrl = await QRService.generateLocationQR(locationData);
          
          // Generate WhatsApp message for location
          setWhatsappUrl(WhatsAppService.sendExperienceReminder(booking, data?.customerPhone || '', qrDataUrl));
          break;
          
        case 'contact':
          qrDataUrl = await QRService.generateArtisanContactQR({
            name: booking.artisanName,
            phone: data?.phone || '+212612345678',
            whatsapp: data?.whatsapp || '+212612345678',
            workshop: data?.workshop || 'Traditional Medina Workshop',
            specialty: booking.experienceType
          });
          break;
          
        case 'booking':
          qrDataUrl = await QRService.generateBookingDetailsQR({
            id: booking.id,
            experienceType: booking.experienceType,
            date: booking.date,
            time: booking.time,
            artisanName: booking.artisanName,
            location: data?.location || 'Morocco',
            status: 'BOOKED'
          });
          break;
      }
      
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      const textToCopy = qrCodeDataUrl.startsWith('http') ? qrCodeDataUrl : `QR Code for ${booking.experienceType}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `${type}-qr-${booking.id}.png`;
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} QR Code`,
          text: `QR Code for ${booking.experienceType} booking`,
          url: qrCodeDataUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyUrl();
    }
  };

  const handleWhatsAppSend = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  if (!isOpen) return null;

  const styling = QRService.getQRStyling(type);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md glass-qr rounded-2xl border-0 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full glass-interactive flex items-center justify-center">
                <span className="text-2xl">{styling.icon}</span>
              </div>
              <CardTitle className="text-lg text-gray-800">{styling.title}</CardTitle>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose}
              className="glass-button border-0 hover:bg-white/30"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Badge 
              style={{ backgroundColor: styling.color + '40', color: styling.color, borderColor: styling.color + '60' }} 
              className="text-xs border glass-interactive"
            >
              {type.toUpperCase()}
            </Badge>
            <p className="text-sm text-gray-700">
              {type === 'payment' && 'Scan to pay securely'}
              {type === 'certificate' && 'Your blockchain authenticity certificate'}
              {type === 'location' && 'Scan to get directions'}
              {type === 'contact' && 'Save artisan contact'}
              {type === 'booking' && 'Quick access to booking details'}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* QR Code Display */}
          <div className="text-center">
            {isLoading ? (
              <div className="w-64 h-64 mx-auto glass-loading rounded-2xl flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-gray-500 animate-spin" />
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={qrCodeDataUrl} 
                  alt={`${type} QR Code`}
                  className="w-64 h-64 mx-auto rounded-xl shadow-lg"
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-black/5"></div>
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <h4 className="font-semibold text-sm text-gray-800">{booking.experienceType}</h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span>📅</span> {booking.date}
              </div>
              <div className="flex items-center gap-1">
                <span>⏰</span> {booking.time}
              </div>
              <div className="flex items-center gap-1">
                <span>👤</span> {booking.artisanName}
              </div>
              <div className="flex items-center gap-1">
                <span>💰</span> €{booking.totalPrice}
              </div>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              ID: {booking.id}
            </div>
          </div>

          {/* Type-specific information */}
          {type === 'payment' && (
            <div className="glass-booking-success rounded-xl p-4">
              <h5 className="font-semibold text-green-800 text-sm mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payment Options
              </h5>
              <div className="text-xs text-green-700 space-y-1">
                <div>• Scan QR code for instant payment</div>
                <div>• Bank transfer: MA64011519000001234567890</div>
                <div>• Reference: {booking.id}</div>
                <div>• Cash payment on arrival accepted</div>
              </div>
            </div>
          )}

          {type === 'certificate' && (
            <div className="glass-purple rounded-xl p-4">
              <h5 className="font-semibold text-purple-800 text-sm mb-2 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Blockchain Certificate
              </h5>
              <div className="text-xs text-purple-700 space-y-1">
                <div>• Permanently stored on Polygon network</div>
                <div>• Proves authentic cultural experience</div>
                <div>• Cannot be faked or duplicated</div>
                <div>• Share your achievement globally!</div>
              </div>
            </div>
          )}

          {type === 'location' && (
            <div className="glass-atlas-mountains rounded-xl p-4">
              <h5 className="font-semibold text-slate-800 text-sm mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Workshop Location
              </h5>
              <div className="text-xs text-slate-700 space-y-1">
                <div>• Scan to open in Google Maps</div>
                <div>• Traditional medina location</div>
                <div>• Look for the Morocco Made Real sign</div>
                <div>• Call artisan if you need help finding us</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopyUrl}
              disabled={isLoading}
              className="glass-button border-0 hover:bg-white/30"
            >
              {copied ? <CheckCircle className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
              disabled={isLoading}
              className="glass-button border-0 hover:bg-white/30"
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>

          {/* WhatsApp Send Button (for payment and certificate) */}
          {(type === 'payment' || type === 'certificate' || type === 'location') && whatsappUrl && (
            <Button 
              className="w-full glass-morocco hover:bg-orange-500/30 border-0 text-orange-800 font-semibold"
              onClick={handleWhatsAppSend}
              disabled={isLoading}
            >
              <Phone className="w-4 h-4 mr-2" />
              Send via WhatsApp
            </Button>
          )}

          {/* Instructions */}
          <div className="text-center glass-card rounded-lg p-3">
            <p className="text-xs text-gray-600">
              {type === 'payment' && '💡 Save this QR code to pay later or share with someone else to pay for you'}
              {type === 'certificate' && '🏆 Keep this certificate forever as proof of your authentic Moroccan experience'}
              {type === 'location' && '📍 Screenshot this QR to have offline access to directions'}
              {type === 'contact' && '📱 Scan to add artisan contact to your phone'}
              {type === 'booking' && '📋 Use this QR for quick access to your booking details'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 