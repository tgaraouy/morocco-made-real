'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Gift,
  Heart,
  Star,
  Camera,
  Coffee,
  Sparkles,
  CheckCircle,
  MessageSquare,
  QrCode,
  CreditCard,
  Navigation,
  X
} from 'lucide-react';
import AnimatedArtisan from './AnimatedArtisan';
import QRModal from './QRModal';
import WhatsAppService, { BookingDetails } from '@/lib/whatsapp-service';

interface ArtisanConfirmationProps {
  booking: any;
  artisan: any;
  isVisible: boolean;
  onClose: () => void;
}

interface DelightMessage {
  id: string;
  type: 'greeting' | 'personal_touch' | 'special_offer' | 'cultural_insight' | 'logistics';
  content: string;
  icon: React.ReactNode;
  timestamp: number;
}

export default function ArtisanConfirmation({ booking, artisan, isVisible, onClose }: ArtisanConfirmationProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<DelightMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // QR Modal state
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrModalType, setQrModalType] = useState<'payment' | 'location' | 'contact'>('payment');

  const delightMessages: DelightMessage[] = [
    {
      id: 'greeting',
      type: 'greeting',
      content: `Ahlan wa sahlan! This is ${artisan.name}. Your ${booking.experienceType} experience is CONFIRMED! 🎉 I'm so excited to welcome you!`,
      icon: <Heart className="w-4 h-4 text-red-500" />,
      timestamp: Date.now()
    },
    {
      id: 'personal',
      type: 'personal_touch',
      content: `Everything is ready for your visit on ${booking.date}! I've been practicing this beautiful art for over 20 years, and I can't wait to share my grandfather's secrets with you.`,
      icon: <Star className="w-4 h-4 text-yellow-500" />,
      timestamp: Date.now() + 3000
    },
    {
      id: 'special_offer',
      type: 'special_offer',
      content: `Since your booking is confirmed, I'm preparing something extra special - a traditional mint tea ceremony and homemade pastries to welcome you! 🍃`,
      icon: <Gift className="w-4 h-4 text-green-500" />,
      timestamp: Date.now() + 6000
    },
    {
      id: 'cultural_insight',
      type: 'cultural_insight',
      content: `You're going to love this! The clay we'll use comes from the Atlas Mountains and has been used by my family for 5 generations. You'll create something truly authentic!`,
      icon: <Sparkles className="w-4 h-4 text-purple-500" />,
      timestamp: Date.now() + 9000
    },
    {
      id: 'logistics',
      type: 'logistics',
      content: `I'll send you the workshop location and preparation details via WhatsApp tomorrow. Just bring yourself and comfortable clothes - everything else is provided! 🏺`,
      icon: <MapPin className="w-4 h-4 text-blue-500" />,
      timestamp: Date.now() + 12000
    }
  ];

  useEffect(() => {
    if (!isVisible) return;

    const showNextMessage = () => {
      if (currentMessageIndex < delightMessages.length) {
        setIsTyping(true);
        
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, delightMessages[currentMessageIndex]]);
          setIsTyping(false);
          setCurrentMessageIndex(prev => prev + 1);
        }, 2000); // Simulate typing delay
      }
    };

    const timer = setTimeout(showNextMessage, currentMessageIndex === 0 ? 1000 : 4000);
    return () => clearTimeout(timer);
  }, [currentMessageIndex, isVisible]);

  const handleQRCodeOpen = (type: 'payment' | 'location' | 'contact') => {
    setQrModalType(type);
    setIsQRModalOpen(true);
  };

  const handleWhatsAppMessage = (messageType: 'greeting' | 'payment' | 'location') => {
    // Convert booking to BookingDetails format for WhatsApp service
    const bookingDetails: BookingDetails = {
      id: booking.id,
      experienceType: booking.experienceType,
      artisanName: booking.artisanName || artisan.name,
      date: booking.date,
      time: booking.time,
      groupSize: booking.groupSize,
      totalPrice: booking.totalPrice,
      customerName: 'Cultural Explorer',
      specialRequests: booking.specialRequests
    };

    let whatsappUrl = '';
    
    switch (messageType) {
      case 'greeting':
        whatsappUrl = WhatsAppService.sendBookingConfirmation(bookingDetails, artisan.whatsapp);
        break;
      case 'payment':
        whatsappUrl = WhatsAppService.sendPaymentRequest(bookingDetails, artisan.whatsapp, 'QR_CODE_URL_PLACEHOLDER');
        break;
      case 'location':
        whatsappUrl = WhatsAppService.sendExperienceReminder(bookingDetails, artisan.whatsapp, 'LOCATION_QR_URL_PLACEHOLDER');
        break;
    }
    
    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank');
    }
  };

  const generatePersonalizedTouch = () => {
    const touches = [
      "I noticed you're a beginner - perfect! I love teaching first-timers because your enthusiasm is infectious! ✨",
      "Since you're coming with friends, I'll set up extra workspace so you can all create together! 👥",
      "I see you're interested in traditional patterns - I have some ancient designs that will blow your mind! 🎨",
      "Your timing is perfect! The morning light in my workshop creates the most beautiful atmosphere for creating! 🌅"
    ];
    return touches[Math.floor(Math.random() * touches.length)];
  };

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-modal-overlay"
        onClick={onClose}
      >
        <div 
          className="glass-modal rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden border-0 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Status Banner - Show immediately that booking is confirmed */}
          <div className="glass-booking-success border-0 p-3 text-center border-b border-green-200">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-bold text-green-800">✅ EXPERIENCE BOOKED & CONFIRMED</span>
            </div>
          </div>

          {/* Header - Artisan Profile */}
          <div className="glass-artisan text-white p-6 rounded-t-2xl relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full glass-interactive flex items-center justify-center text-gray-700 hover:text-gray-900 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full glass-floating flex items-center justify-center">
                  <AnimatedArtisan craftType={booking.craftType || 'pottery'} size="sm" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{artisan.name}</h3>
                <p className="text-sm text-gray-700 font-medium">Master Artisan • Online now</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 glass-card px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-gray-700 font-semibold">4.9 (127 reviews)</span>
              </div>
              <div className="flex items-center gap-1 glass-card px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-gray-700 font-semibold">Verified Master</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto bg-gradient-to-b from-white/80 to-white/60">
            {/* Booking confirmation - Make it more prominent */}
            <div className="glass-booking-success rounded-xl p-6 border-0 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-800">BOOKING CONFIRMED!</h3>
                  <p className="text-sm text-green-700">Your cultural experience is secured</p>
                </div>
              </div>
              
              <Badge className="mb-4 glass-booking-success border-green-400 text-green-800 text-sm font-bold px-4 py-2">
                ✅ PAYMENT CONFIRMED & BOOKED
              </Badge>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-green-700 bg-green-50/50 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span>📅</span> <strong>{booking.date}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏰</span> <strong>{booking.time}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span>👥</span> <strong>{booking.groupSize} people</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span>💰</span> <strong>€{booking.totalPrice} PAID</strong>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-green-600 font-mono bg-green-100 rounded px-3 py-2">
                Booking ID: {booking.id}
              </div>
            </div>

            {/* Artisan messages */}
            {visibleMessages.map((message, index) => (
              <div key={message.id} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full glass-interactive flex items-center justify-center">
                  {message.icon}
                </div>
                <div className="flex-1 glass-card rounded-xl p-3 shadow-sm">
                  <p className="text-sm text-gray-800">{message.content}</p>
                  <span className="text-xs text-gray-500 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full glass-interactive flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                </div>
                <div className="glass-card rounded-xl p-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Surprise elements that appear progressively */}
            {visibleMessages.length >= 2 && (
              <div className="glass-sahara rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-yellow-700" />
                  <span className="text-sm font-semibold text-yellow-800">Special Welcome Gift</span>
                </div>
                <p className="text-xs text-yellow-700">
                  A handcrafted bookmark with traditional Moroccan patterns - yours to keep! 🎁
                </p>
              </div>
            )}

            {visibleMessages.length >= 4 && (
              <div className="glass-purple rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Camera className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-800">Photo Memories</span>
                </div>
                <p className="text-xs text-purple-700">
                  I'll take photos of your creation process and send them to you! Perfect for sharing with friends 📸
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 glass-modal border-t-0 space-y-3 rounded-b-2xl">
            {/* QR Code Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex flex-col items-center gap-1 h-auto py-3 glass-button border-0 hover:bg-white/30"
                onClick={() => handleQRCodeOpen('payment')}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-xs font-semibold">Payment QR</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex flex-col items-center gap-1 h-auto py-3 glass-button border-0 hover:bg-white/30"
                onClick={() => handleQRCodeOpen('location')}
              >
                <Navigation className="w-4 h-4" />
                <span className="text-xs font-semibold">Location QR</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex flex-col items-center gap-1 h-auto py-3 glass-button border-0 hover:bg-white/30"
                onClick={() => handleQRCodeOpen('contact')}
              >
                <QrCode className="w-4 h-4" />
                <span className="text-xs font-semibold">Contact QR</span>
              </Button>
            </div>

            {/* Contact buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-2 glass-button border-0 hover:bg-white/30"
                onClick={() => window.open(`tel:${artisan.phone}`)}
              >
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
              <Button 
                size="sm" 
                className="flex items-center gap-2 glass-morocco hover:bg-orange-500/30 border-0 text-orange-800 font-semibold"
                onClick={() => handleWhatsAppMessage('greeting')}
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>

            {/* WhatsApp Quick Messages */}
            <div className="grid grid-cols-1 gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-8 glass-emerald hover:bg-green-500/20 border-0 text-green-800"
                onClick={() => handleWhatsAppMessage('payment')}
              >
                💳 "Send payment details via WhatsApp"
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-8 glass-atlas-mountains hover:bg-slate-500/20 border-0 text-slate-800"
                onClick={() => handleWhatsAppMessage('location')}
              >
                📍 "Send workshop location via WhatsApp"
              </Button>
            </div>

            {/* Pre-written responses */}
            <div className="grid grid-cols-1 gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-8 glass-interactive border-0"
                onClick={() => window.open(`https://wa.me/${artisan.whatsapp.replace(/\s/g, '')}?text=Thank you so much! I'm really excited for tomorrow!`)}
              >
                "Thank you! I'm so excited! 😊"
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-8 glass-interactive border-0"
                onClick={() => window.open(`https://wa.me/${artisan.whatsapp.replace(/\s/g, '')}?text=Can you send me the address please?`)}
              >
                "Can you send me the address?"
              </Button>
            </div>

            {/* Close button */}
            <Button 
              variant="outline" 
              className="w-full glass-button border-0 hover:bg-white/30 font-semibold" 
              onClick={onClose}
            >
              <X className="w-4 h-4 mr-2" />
              Close & Continue Browsing
            </Button>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        type={qrModalType}
        booking={{
          id: booking.id,
          experienceType: booking.experienceType,
          artisanName: booking.artisanName || artisan.name,
          date: booking.date,
          time: booking.time,
          groupSize: booking.groupSize,
          totalPrice: booking.totalPrice,
          customerName: 'Cultural Explorer'
        }}
        data={{
          customerPhone: '+212612345678', // In real app, get from user profile
          phone: artisan.phone,
          whatsapp: artisan.whatsapp,
          workshop: `${artisan.name}'s Traditional Workshop`,
          latitude: 31.6295, // Marrakech coordinates
          longitude: -7.9811,
          placeName: `${artisan.name}'s Workshop`,
          address: 'Traditional Medina Quarter, Morocco'
        }}
      />
    </>
  );
} 