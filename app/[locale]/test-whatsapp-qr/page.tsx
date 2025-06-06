'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, QrCode, Smartphone, RefreshCw, CheckCircle2, Clock, AlertCircle, ExternalLink, PlayCircle, TestTube } from 'lucide-react';
import { QRCode } from '@/components/ui/qr-code';

export default function TestWhatsAppQRPage() {
  const [phone, setPhone] = useState('');
  const [qrSession, setQrSession] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, generating, pending, verified, expired, error
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  // Demo steps for showing the flow
  const demoSteps = [
    { 
      title: "📱 User Opens Camera", 
      description: "Tourist points phone camera at QR code",
      action: "Camera detects QR code..."
    },
    { 
      title: "🔗 WhatsApp Opens", 
      description: "WhatsApp app launches automatically",
      action: "WhatsApp opening with pre-filled message..."
    },
    { 
      title: "💬 Message Pre-filled", 
      description: "Verification code message appears ready to send",
      action: "Message ready: 'Morocco Made Real verification code: 123456'"
    },
    { 
      title: "⚡ User Taps Send", 
      description: "Just one tap - no typing needed!",
      action: "Sending message to webhook..."
    },
    { 
      title: "🔄 Webhook Receives", 
      description: "Our system receives the WhatsApp message",
      action: "Processing verification code..."
    },
    { 
      title: "🎉 Auto-Verified!", 
      description: "User is verified instantly!",
      action: "Verification complete in 2.3 seconds!"
    }
  ];

  // Fix hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  // Auto-demo functionality
  useEffect(() => {
    let demoInterval;
    if (demoMode && qrSession) {
      demoInterval = setInterval(() => {
        setDemoStep(prev => {
          if (prev >= demoSteps.length - 1) {
            setDemoMode(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => {
      if (demoInterval) clearInterval(demoInterval);
    };
  }, [demoMode, qrSession]);

  const generateQRAutoValidation = async () => {
    setIsLoading(true);
    setError('');
    setVerificationStatus('generating');
    
    try {
      // Import the QR service
      const { whatsappQRService } = await import('@/lib/whatsapp-qr-service');
      
      console.log('🔄 Generating QR auto-validation for:', phone);
      
      // Generate auto-validation QR
      const result = await whatsappQRService.generateAutoValidationQR(phone);
      
      if (result.success && result.qrSession) {
        setQrSession(result.qrSession);
        setVerificationStatus('pending');
        
        // Start checking verification status every 2 seconds
        const interval = setInterval(async () => {
          await checkVerificationStatus(result.qrSession.id);
        }, 2000);
        
        setStatusCheckInterval(interval);
        
        console.log('✅ QR auto-validation generated successfully');
      } else {
        setError(result.error || 'Failed to generate QR auto-validation');
        setVerificationStatus('error');
      }
      
    } catch (err) {
      console.error('Error generating QR auto-validation:', err);
      setError('Failed to generate QR auto-validation');
      setVerificationStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const checkVerificationStatus = async (sessionId) => {
    try {
      const { whatsappQRService } = await import('@/lib/whatsapp-qr-service');
      
      const result = await whatsappQRService.checkVerificationStatus(sessionId);
      
      if (result.success) {
        if (result.status === 'verified') {
          setVerificationStatus('verified');
          // Stop checking
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
        } else if (result.status === 'expired') {
          setVerificationStatus('expired');
          if (statusCheckInterval) {
            clearInterval(statusCheckInterval);
            setStatusCheckInterval(null);
          }
        }
        // If still pending, keep checking
      }
      
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

  const simulateWebhook = async () => {
    if (!qrSession) {
      setError('Generate QR session first');
      return;
    }

    try {
      console.log('🧪 Simulating webhook for testing...');
      
      const response = await fetch('/api/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: qrSession.phone,
          code: qrSession.code,
          sessionId: qrSession.id
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Webhook simulated successfully!');
        // The status will be updated via the polling interval
      } else {
        setError(result.error || 'Webhook simulation failed');
      }
      
    } catch (error) {
      console.error('Error simulating webhook:', error);
      setError('Failed to simulate webhook');
    }
  };

  const resetDemo = () => {
    setQrSession(null);
    setVerificationStatus('idle');
    setError('');
    setDemoMode(false);
    setDemoStep(0);
    if (statusCheckInterval) {
      clearInterval(statusCheckInterval);
      setStatusCheckInterval(null);
    }
  };

  const startDemo = () => {
    if (!qrSession) {
      generateQRAutoValidation().then(() => {
        setDemoMode(true);
        setDemoStep(0);
      });
    } else {
      setDemoMode(true);
      setDemoStep(0);
    }
  };

  const getCountryInfo = (phoneNumber) => {
    // Use enhanced country detection service
    try {
      const countryDetectionService = require('@/lib/country-detection-service').default;
      const country = countryDetectionService.detectCountry(phoneNumber);
      
      if (country) {
        const recommendation = countryDetectionService.getVerificationRecommendation(phoneNumber, {
          touristMode: true // Morocco Made Real tourist context
        });
        
        return {
          name: country.name,
          flag: country.flag,
          whatsappUsage: `${country.whatsappUsage}%`,
          recommendation: recommendation.primaryMethod,
          confidence: `${recommendation.confidence}%`,
          reasoning: recommendation.reasoning,
          userExperience: recommendation.userExperience
        };
      }
    } catch (error) {
      console.error('Country detection error:', error);
    }
    
    // Fallback to simple detection
    if (phoneNumber.startsWith('+212')) return { 
      name: 'Morocco', 
      flag: '🇲🇦', 
      whatsappUsage: '95%',
      recommendation: 'whatsapp',
      confidence: '95%',
      reasoning: 'Morocco has extremely high WhatsApp adoption',
      userExperience: 'excellent'
    };
    if (phoneNumber.startsWith('+33')) return { 
      name: 'France', 
      flag: '🇫🇷', 
      whatsappUsage: '65%',
      recommendation: 'whatsapp',
      confidence: '75%',
      reasoning: 'French tourists prefer WhatsApp for international travel',
      userExperience: 'good'
    };
    if (phoneNumber.startsWith('+1')) return { 
      name: 'USA/Canada', 
      flag: '🇺🇸', 
      whatsappUsage: '25%',
      recommendation: 'sms',
      confidence: '75%',
      reasoning: 'North America has strong SMS infrastructure',
      userExperience: 'good'
    };
    if (phoneNumber.startsWith('+44')) return { 
      name: 'United Kingdom', 
      flag: '🇬🇧', 
      whatsappUsage: '30%',
      recommendation: 'sms',
      confidence: '70%',
      reasoning: 'UK prefers traditional SMS verification',
      userExperience: 'good'
    };
    return { 
      name: 'International', 
      flag: '🌍', 
      whatsappUsage: 'Unknown',
      recommendation: 'auto',
      confidence: '60%',
      reasoning: 'Unknown country - will detect optimal method',
      userExperience: 'fair'
    };
  };

  const getStatusInfo = () => {
    switch (verificationStatus) {
      case 'idle':
        return { color: 'gray', icon: Clock, text: 'Ready to generate QR code' };
      case 'generating':
        return { color: 'blue', icon: RefreshCw, text: 'Generating QR code...' };
      case 'pending':
        return { color: 'yellow', icon: Clock, text: 'Waiting for WhatsApp message...' };
      case 'verified':
        return { color: 'green', icon: CheckCircle2, text: 'Auto-verified successfully! 🎉' };
      case 'expired':
        return { color: 'red', icon: AlertCircle, text: 'Session expired. Generate new QR.' };
      case 'error':
        return { color: 'red', icon: AlertCircle, text: 'Error occurred' };
      default:
        return { color: 'gray', icon: Clock, text: 'Unknown status' };
    }
  };

  const countryInfo = getCountryInfo(phone);
  const statusInfo = getStatusInfo();

  // Prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📱 <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">WhatsApp QR Auto-Validation</span> Demo
          </h1>
          <p className="text-gray-600">Scan QR → WhatsApp opens → Send message → Instant verification! ⚡</p>
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
            <strong>🚀 Revolutionary:</strong> The most seamless phone verification ever created!
          </div>
          
          {/* Developer Testing Toggle */}
          <div className="mt-4">
            <div className="flex gap-3 justify-center">
              <Button
                onClick={startDemo}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold"
                disabled={demoMode}
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                {demoMode ? 'Demo Running...' : '🚀 Watch Zero-Touch Demo'}
              </Button>
              
              <Button
                onClick={() => setShowTestPanel(!showTestPanel)}
                variant="outline"
                size="sm"
                className="text-purple-600 border-purple-300 hover:bg-purple-50"
              >
                <TestTube className="w-4 h-4 mr-2" />
                {showTestPanel ? 'Hide' : 'Show'} Developer Panel
              </Button>
            </div>
          </div>

          {/* Live Demo Display */}
          {demoMode && qrSession && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-300 rounded-lg p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-blue-800">🎬 Live Zero-Touch Demo</h3>
                <p className="text-blue-600">Watch the revolutionary verification flow in action!</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {demoStep + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-blue-800 text-lg">
                      {demoSteps[demoStep]?.title}
                    </div>
                    <div className="text-blue-600">
                      {demoSteps[demoStep]?.description}
                    </div>
                    <div className="text-sm text-blue-500 italic mt-1">
                      {demoSteps[demoStep]?.action}
                    </div>
                  </div>
                  
                  {demoStep === demoSteps.length - 1 && (
                    <div className="text-4xl animate-bounce">🎉</div>
                  )}
                </div>
                
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1">
                    Step {demoStep + 1} of {demoSteps.length} • {Math.round(((demoStep + 1) / demoSteps.length) * 100)}% Complete
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Step 1: Phone Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Step 1: Phone Number
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Enhanced Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  International Phone Number
                </label>
                <div className="relative">
                  {/* Auto-formatting phone input */}
                  <Input
                    type="tel"
                    placeholder="+212-6-12-34-56-78"
                    value={phone}
                    onChange={(e) => {
                      let value = e.target.value;
                      
                      // Remove all non-digits and plus signs
                      let digitsOnly = value.replace(/[^\d]/g, '');
                      
                      // Auto-add + sign if user starts typing digits
                      if (digitsOnly && !value.startsWith('+')) {
                        value = '+' + digitsOnly;
                      } else if (value.startsWith('+')) {
                        // Keep the + and digits only
                        value = '+' + digitsOnly;
                      }
                      
                      // Format based on country code as user types
                      if (value.startsWith('+212') && digitsOnly.length >= 3) {
                        // Morocco: +212-6-12-34-56-78
                        const numbers = digitsOnly.substring(3);
                        let formatted = '+212';
                        if (numbers.length > 0) formatted += '-' + numbers.substring(0, 1);
                        if (numbers.length > 1) formatted += '-' + numbers.substring(1, 3);
                        if (numbers.length > 3) formatted += '-' + numbers.substring(3, 5);
                        if (numbers.length > 5) formatted += '-' + numbers.substring(5, 7);
                        if (numbers.length > 7) formatted += '-' + numbers.substring(7, 9);
                        value = formatted;
                      } else if (value.startsWith('+33') && digitsOnly.length >= 2) {
                        // France: +33-6-98-76-54-32
                        const numbers = digitsOnly.substring(2);
                        let formatted = '+33';
                        if (numbers.length > 0) formatted += '-' + numbers.substring(0, 1);
                        if (numbers.length > 1) formatted += '-' + numbers.substring(1, 3);
                        if (numbers.length > 3) formatted += '-' + numbers.substring(3, 5);
                        if (numbers.length > 5) formatted += '-' + numbers.substring(5, 7);
                        if (numbers.length > 7) formatted += '-' + numbers.substring(7, 9);
                        value = formatted;
                      } else if (value.startsWith('+1') && digitsOnly.length >= 1) {
                        // USA/Canada: +1-555-123-4567
                        const numbers = digitsOnly.substring(1);
                        let formatted = '+1';
                        if (numbers.length > 0) formatted += '-' + numbers.substring(0, 3);
                        if (numbers.length > 3) formatted += '-' + numbers.substring(3, 6);
                        if (numbers.length > 6) formatted += '-' + numbers.substring(6, 10);
                        value = formatted;
                      } else if (value.startsWith('+49') && digitsOnly.length >= 2) {
                        // Germany: +49-30-12345678
                        const numbers = digitsOnly.substring(2);
                        let formatted = '+49';
                        if (numbers.length > 0) formatted += '-' + numbers.substring(0, 2);
                        if (numbers.length > 2) formatted += '-' + numbers.substring(2, 10);
                        value = formatted;
                      }
                      
                      setPhone(value);
                    }}
                    className="font-mono text-lg pr-12 bg-white border-2 focus:border-green-500 transition-all duration-200"
                    disabled={verificationStatus === 'pending'}
                  />
                  
                  {/* Country flag overlay - fixed positioning */}
                  {phone && countryInfo.flag !== '🌍' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-2xl pointer-events-none">
                      {countryInfo.flag}
                    </div>
                  )}
                </div>
              </div>

              {/* Simple Country Detection */}
              {phone && countryInfo.flag !== '🌍' && (
                <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-2xl">{countryInfo.flag}</span>
                  <div className="text-center">
                    <div className="font-semibold text-green-800">{countryInfo.name}</div>
                    <div className="text-sm text-green-600">WhatsApp Usage: {countryInfo.whatsappUsage}</div>
                  </div>
                </div>
              )}

              {/* Simplified Quick Test Numbers */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Quick Test:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhone('+212612345678')}
                    className="text-left p-3 h-auto"
                    disabled={verificationStatus === 'pending'}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇲🇦</span>
                      <div>
                        <div className="font-medium">Morocco</div>
                        <div className="text-xs text-gray-500">95% WhatsApp</div>
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhone('+33698765432')}
                    className="text-left p-3 h-auto"
                    disabled={verificationStatus === 'pending'}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇫🇷</span>
                      <div>
                        <div className="font-medium">France</div>
                        <div className="text-xs text-gray-500">65% WhatsApp</div>
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhone('+15551234567')}
                    className="text-left p-3 h-auto"
                    disabled={verificationStatus === 'pending'}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇺🇸</span>
                      <div>
                        <div className="font-medium">USA</div>
                        <div className="text-xs text-gray-500">25% WhatsApp</div>
                      </div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhone('+493012345678')}
                    className="text-left p-3 h-auto"
                    disabled={verificationStatus === 'pending'}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇩🇪</span>
                      <div>
                        <div className="font-medium">Germany</div>
                        <div className="text-xs text-gray-500">45% WhatsApp</div>
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={generateQRAutoValidation}
                disabled={!phone.trim() || isLoading || verificationStatus === 'pending'}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating QR...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate Auto-Validation QR
                  </>
                )}
              </Button>

              {/* Reset Button */}
              {verificationStatus !== 'idle' && (
                <Button 
                  onClick={resetDemo}
                  variant="outline"
                  className="w-full"
                >
                  🔄 Reset Demo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Step 2: QR Code Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Step 2: Scan QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {qrSession ? (
                <>
                  {/* QR Code Display */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
                    <QRCode 
                      value={qrSession.whatsappUrl} 
                      size={200} 
                      className="mx-auto mb-4"
                    />
                    <div className="text-xs text-gray-500 break-all font-mono bg-gray-50 p-2 rounded">
                      Session: {qrSession.id}
                    </div>
                  </div>

                  {/* Zero-Touch Flow Instructions */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-2 border-green-200">
                    <div className="font-bold text-green-800 mb-3 text-center">
                      🚀 Zero-Touch Verification Flow
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                        <div>
                          <div className="font-medium text-green-800">📱 Scan QR Code</div>
                          <div className="text-sm text-green-700">Point your phone camera at the QR code above</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                        <div>
                          <div className="font-medium text-green-800">💬 WhatsApp Opens</div>
                          <div className="text-sm text-green-700">Message with verification code auto-filled</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                        <div>
                          <div className="font-medium text-green-800">⚡ One Tap Send</div>
                          <div className="text-sm text-green-700">Just tap the send button - no typing needed!</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                        <div>
                          <div className="font-medium text-green-800">🎉 Instant Verification</div>
                          <div className="text-sm text-green-700">Webhook auto-validates - you're verified in seconds!</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What the message will look like */}
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <div className="font-medium text-gray-700 mb-2">📱 WhatsApp Message Preview:</div>
                    <div className="bg-white p-3 rounded border-l-4 border-green-500 font-mono text-sm">
                      Morocco Made Real verification code: <span className="font-bold text-green-600">{qrSession.code}</span>
                      <br/><br/>
                      Valid for 10 minutes. Reply with this code to verify your number.
                      <br/><br/>
                      Do not share this code.
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      ↑ This message will appear pre-filled when you scan the QR code
                    </div>
                  </div>

                  {/* Manual WhatsApp Link */}
                  <div className="border-t pt-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Can't scan? Open directly:</div>
                    <a 
                      href={qrSession.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        📱 Open WhatsApp with Pre-filled Message
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                    <div className="text-xs text-gray-500 text-center mt-1">
                      Click to see the pre-filled message in WhatsApp
                    </div>
                  </div>

                  {/* Developer Testing Panel */}
                  {showTestPanel && (
                    <div className="border-t pt-4">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="font-medium text-purple-800 mb-2">🧪 Developer Testing:</div>
                        <div className="text-sm text-purple-700 mb-3">
                          Simulate receiving the WhatsApp message to test webhook validation
                        </div>
                        <Button
                          onClick={simulateWebhook}
                          size="sm"
                          className="w-full bg-purple-500 hover:bg-purple-600"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          🧪 Simulate WhatsApp Message Received
                        </Button>
                        <div className="text-xs text-purple-600 mt-2">
                          This simulates what happens when you actually send the WhatsApp message
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-600">
                    Enter phone number and generate QR code to see auto-validation in action
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Verification Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <statusInfo.icon className={`w-5 h-5 ${statusInfo.color === 'green' ? 'text-green-600' : statusInfo.color === 'yellow' ? 'text-yellow-600' : statusInfo.color === 'blue' ? 'text-blue-600' : statusInfo.color === 'red' ? 'text-red-600' : 'text-gray-600'}`} />
                Step 3: Auto-Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Status Display */}
              <div className={`p-4 rounded-lg border-2 ${
                statusInfo.color === 'green' ? 'bg-green-50 border-green-200' :
                statusInfo.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
                statusInfo.color === 'blue' ? 'bg-blue-50 border-blue-200' :
                statusInfo.color === 'red' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className={`flex items-center gap-2 font-medium mb-2 ${
                  statusInfo.color === 'green' ? 'text-green-800' :
                  statusInfo.color === 'yellow' ? 'text-yellow-800' :
                  statusInfo.color === 'blue' ? 'text-blue-800' :
                  statusInfo.color === 'red' ? 'text-red-800' :
                  'text-gray-800'
                }`}>
                  <statusInfo.icon className={`w-4 h-4 ${verificationStatus === 'generating' || verificationStatus === 'pending' ? 'animate-spin' : ''}`} />
                  {statusInfo.text}
                </div>
                {verificationStatus === 'pending' && (
                  <div className="text-sm text-yellow-700">
                    Checking every 2 seconds for WhatsApp message...
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Session Info */}
              {qrSession && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Session Details:</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div><strong>Code:</strong> {qrSession.code}</div>
                    <div><strong>Expires:</strong> {new Date(qrSession.expiresAt).toLocaleTimeString()}</div>
                    <div><strong>Status:</strong> {verificationStatus}</div>
                  </div>
                </div>
              )}

              {/* Verification Success */}
              {verificationStatus === 'verified' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-green-800 font-medium mb-2">🎉 Success!</div>
                  <div className="text-sm text-green-700">
                    Phone number verified automatically via WhatsApp webhook! The user received a confirmation message in WhatsApp.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🔄 How WhatsApp Auto-Validation Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-6 text-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mx-auto mb-2">1</div>
                <div className="font-medium">Generate QR</div>
                <div className="text-gray-600">System creates unique QR with verification code</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg mx-auto mb-2">2</div>
                <div className="font-medium">Scan Code</div>
                <div className="text-gray-600">User scans QR with phone camera</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-lg mx-auto mb-2">3</div>
                <div className="font-medium">WhatsApp Opens</div>
                <div className="text-gray-600">Message pre-filled with verification code</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-lg mx-auto mb-2">4</div>
                <div className="font-medium">Send Message</div>
                <div className="text-gray-600">User sends message (one tap!)</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-lg mx-auto mb-2">5</div>
                <div className="font-medium">Auto-Verify</div>
                <div className="text-gray-600">Webhook validates instantly</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-green-900 mb-4">🌟 Revolutionary Benefits for International Tourists:</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs mt-0.5">✓</div>
                <div>
                  <div className="font-medium">Zero Manual Input</div>
                  <div className="text-gray-600">No typing verification codes - just scan and send!</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs mt-0.5">✓</div>
                <div>
                  <div className="font-medium">Instant Validation</div>
                  <div className="text-gray-600">Webhook receives message and validates immediately</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs mt-0.5">✓</div>
                <div>
                  <div className="font-medium">Universal Compatibility</div>
                  <div className="text-gray-600">Works on any device with camera and WhatsApp</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 