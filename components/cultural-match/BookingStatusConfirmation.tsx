'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Users, Euro, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingStatusConfirmationProps {
  isVisible: boolean;
  onClose: () => void;
  booking: {
    id: string;
    experienceType: string;
    date: string;
    time: string;
    groupSize: string;
    totalPrice: number;
    status: string;
  };
  artisanName: string;
}

export default function BookingStatusConfirmation({ 
  isVisible, 
  onClose, 
  booking, 
  artisanName 
}: BookingStatusConfirmationProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* Success Icon and Status */}
            <div className="space-y-3">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h2>
                <Badge className="bg-green-100 text-green-800 text-sm font-bold px-4 py-2">
                  STATUS: {booking.status} ✅
                </Badge>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">{booking.experienceType}</h3>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{booking.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{booking.groupSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-gray-500" />
                  <span>€{booking.totalPrice}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-600">
                  <strong>Booking ID:</strong> {booking.id}
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>✓ Your booking is confirmed with status: <strong>BOOKED</strong></p>
                <p>📞 {artisanName} will contact you within 30 minutes</p>
                <p>📧 You'll receive a confirmation email shortly</p>
                <p>💫 Get ready for an amazing cultural experience!</p>
              </div>
            </div>

            {/* Close Button */}
            <Button 
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              Continue Exploring
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 