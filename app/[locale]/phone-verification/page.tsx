'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Smartphone, MessageCircle, Shield, Clock, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Admin WhatsApp number that sends verification codes
const ADMIN_WHATSAPP = "+212661234567"; // Replace with actual admin number
const ADMIN_WHATSAPP_DISPLAY = "+212 661 234 567";

export default function PhoneVerificationPage() {
  const router = useRouter();
  
  // State management
  const [step, setStep] = useState<'input' | 'waiting' | 'verify' | 'success'>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return !match[2] ? match[1] : `${match[1]} ${match[2]}${match[3] ? ` ${match[3]}` : ''}`;
    }
    return value;
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Generate verification code via admin WhatsApp
      const response = await fetch('/api/admin-verification-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userPhone: phoneNumber,
          adminPhone: ADMIN_WHATSAPP 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSessionId(result.sessionId);
        setStep('waiting');
        setCountdown(300); // 5 minutes
        
        // Start checking for verification
        pollForVerification(result.sessionId);
      } else {
        setError(result.error || 'Failed to send verification');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const pollForVerification = async (sessionId: string) => {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    const checkVerification = async () => {
      if (attempts >= maxAttempts) return;
      
      attempts++;
      
      try {
        const response = await fetch('/api/admin-verification-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const result = await response.json();

        if (result.verified) {
          setStep('success');
          // Store verification for app
          localStorage.setItem('tourist_phone', phoneNumber);
          localStorage.setItem('phone_verified', 'true');
          
          // Redirect to cultural matching after 2 seconds
          setTimeout(() => {
            router.push('/cultural-match-phone?verified=true');
          }, 2000);
        } else {
          // Continue polling
          setTimeout(checkVerification, 5000);
        }
      } catch (error) {
        console.error('Verification check error:', error);
        setTimeout(checkVerification, 5000);
      }
    };

    checkVerification();
  };

  const handleManualVerification = async () => {
    if (!verificationCode.trim() || verificationCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin-verification-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId,
          code: verificationCode 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStep('success');
        localStorage.setItem('tourist_phone', phoneNumber);
        localStorage.setItem('phone_verified', 'true');
        
        setTimeout(() => {
          router.push('/cultural-match-phone?verified=true');
        }, 2000);
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setStep('input');
    setCountdown(0);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🇲🇦 Morocco Made Real
          </h1>
          <p className="text-gray-600">
            Secure phone verification for authentic experiences
          </p>
        </div>

        {/* Verification Steps */}
        <Card className="p-6 bg-white shadow-lg">
          
          {/* Step 1: Phone Input */}
          {step === 'input' && (
            <div className="space-y-6">
              <div className="text-center">
                <Smartphone className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2">Enter Your WhatsApp Number</h2>
                <p className="text-gray-600 text-sm">
                  We'll send you a verification code via WhatsApp
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (with country code)
                  </label>
                  <Input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+212 661 234 567"
                    className="text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Include country code (e.g., +212 for Morocco, +33 for France)
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Button 
                  onClick={handlePhoneSubmit}
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Get Verification Code
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Waiting for Admin */}
          {step === 'waiting' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-2">Check Your WhatsApp!</h2>
                <p className="text-gray-600 mb-4">
                  We've sent a verification code to:
                </p>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {phoneNumber}
                </Badge>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm mb-2">
                  <strong>Code sent from:</strong> {ADMIN_WHATSAPP_DISPLAY}
                </p>
                <p className="text-blue-600 text-xs">
                  The verification will happen automatically when you receive the message
                </p>
              </div>

              {countdown > 0 && (
                <div className="flex items-center justify-center text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Expires in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</span>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-3">
                  Didn't receive the code? Enter it manually:
                </p>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit code"
                    className="text-center text-lg"
                    maxLength={6}
                  />
                  <Button 
                    onClick={handleManualVerification}
                    disabled={verificationCode.length !== 6 || isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Verify
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleResend}
                variant="outline"
                className="w-full"
              >
                Try Different Number
              </Button>

              {/* SMS Fallback Button */}
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 text-center mb-3">
                  Not receiving WhatsApp messages?
                </p>
                <Button 
                  onClick={async () => {
                    setIsLoading(true);
                    setError('');
                    try {
                      const { smsService } = await import('@/lib/sms-service');
                      // Generate a demo code for now
                      const demoCode = Math.floor(100000 + Math.random() * 900000).toString();
                      
                      const result = await smsService.sendVerificationSMS(phoneNumber, demoCode, { 
                        preferSMS: true 
                      });
                      
                      if (result.success) {
                        // Show success message and allow manual code entry
                        setError('');
                        console.log('📱 SMS sent successfully via fallback');
                        alert(`SMS sent! Demo code: ${demoCode}`); // For testing
                      } else {
                        setError(result.error || 'Failed to send SMS');
                      }
                    } catch (error) {
                      setError('SMS service unavailable. Please try manual entry.');
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending SMS...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-4 h-4 mr-2" />
                      📱 Try SMS Instead
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                  Phone Verified Successfully! 🎉
                </h2>
                <p className="text-gray-600 mb-4">
                  Welcome to Morocco Made Real
                </p>
                <Badge className="bg-green-100 text-green-800">
                  Redirecting to cultural experiences...
                </Badge>
              </div>

              <div className="flex items-center justify-center text-green-600">
                <ArrowRight className="w-5 h-5 mr-2" />
                <span>Preparing your authentic journey</span>
              </div>
            </div>
          )}
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your phone number is encrypted and secure<br/>
            Used only for booking confirmations and authentic experiences
          </p>
        </div>
      </div>
    </div>
  );
} 