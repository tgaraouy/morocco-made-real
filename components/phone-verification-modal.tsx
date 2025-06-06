'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Smartphone, MessageCircle, Globe, Clock, CheckCircle2, Loader2, AlertCircle, X, ExternalLink } from 'lucide-react';
import { touristProfileService, TouristProfile, DEMO_PHONES } from '@/lib/tourist-profile-service';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (profile: TouristProfile) => void;
  title?: string;
  subtitle?: string;
}

export default function PhoneVerificationModal({
  isOpen,
  onClose,
  onVerified,
  title = "Welcome to Morocco! 🇲🇦",
  subtitle = "Enter your mobile number to continue"
}: PhoneVerificationModalProps) {
  
  const [step, setStep] = useState<'phone' | 'method' | 'code' | 'profile'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [demoCode, setDemoCode] = useState('');
  
  // WhatsApp verification states
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [recommendedMethod, setRecommendedMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [verificationOptions, setVerificationOptions] = useState<any>(null);

  // Timer for verification code expiration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('phone');
      setPhone('');
      setCode('');
      setFirstName('');
      setError('');
      setTimeLeft(0);
      setDemoCode('');
      setSelectedMethod('sms');
      setWhatsappUrl('');
      setVerificationOptions(null);
    }
  }, [isOpen]);

  const getCountryInfo = (phoneNumber: string) => {
    const countries = {
      '+212': { name: 'Morocco', flag: '🇲🇦', code: 'MA' },
      '+33': { name: 'France', flag: '🇫🇷', code: 'FR' },
      '+1': { name: 'USA/Canada', flag: '🇺🇸', code: 'US' },
      '+44': { name: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
      '+49': { name: 'Germany', flag: '🇩🇪', code: 'DE' },
      '+34': { name: 'Spain', flag: '🇪🇸', code: 'ES' },
      '+39': { name: 'Italy', flag: '🇮🇹', code: 'IT' },
      '+31': { name: 'Netherlands', flag: '🇳🇱', code: 'NL' },
      '+32': { name: 'Belgium', flag: '🇧🇪', code: 'BE' },
      '+41': { name: 'Switzerland', flag: '🇨🇭', code: 'CH' },
      '+43': { name: 'Austria', flag: '🇦🇹', code: 'AT' },
      '+351': { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
      '+46': { name: 'Sweden', flag: '🇸🇪', code: 'SE' },
      '+47': { name: 'Norway', flag: '🇳🇴', code: 'NO' },
      '+45': { name: 'Denmark', flag: '🇩🇰', code: 'DK' },
      '+358': { name: 'Finland', flag: '🇫🇮', code: 'FI' },
      '+61': { name: 'Australia', flag: '🇦🇺', code: 'AU' },
      '+81': { name: 'Japan', flag: '🇯🇵', code: 'JP' },
      '+82': { name: 'South Korea', flag: '🇰🇷', code: 'KR' },
      '+86': { name: 'China', flag: '🇨🇳', code: 'CN' },
      '+91': { name: 'India', flag: '🇮🇳', code: 'IN' },
      '+55': { name: 'Brazil', flag: '🇧🇷', code: 'BR' },
      '+52': { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
      '+27': { name: 'South Africa', flag: '🇿🇦', code: 'ZA' },
      '+20': { name: 'Egypt', flag: '🇪🇬', code: 'EG' },
      '+971': { name: 'UAE', flag: '🇦🇪', code: 'AE' },
      '+966': { name: 'Saudi Arabia', flag: '🇸🇦', code: 'SA' }
    };

    for (const [prefix, info] of Object.entries(countries)) {
      if (phoneNumber.startsWith(prefix)) {
        return info;
      }
    }
    return { name: 'International', flag: '🌍', code: 'XX' };
  };

  const handleGenerateOptions = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Import SMS service dynamically to get verification options
      const { smsService } = await import('@/lib/sms-service');
      
      // Generate verification code
      const result = await touristProfileService.sendVerificationCode(phone);
      
      if (result.success) {
        const verificationCode = result.code || '123456'; // Fallback for demo
        
        // Generate both SMS and WhatsApp options
        const options = await smsService.generateVerificationOptions(phone, verificationCode);
        
        setVerificationOptions(options);
        setRecommendedMethod(options.recommended);
        setSelectedMethod(options.recommended);
        setDemoCode(verificationCode);
        setTimeLeft(600); // 10 minutes
        
        if (options.whatsapp?.whatsappUrl) {
          setWhatsappUrl(options.whatsapp.whatsappUrl);
        }
        
        setStep('method');
        console.log('✅ Verification options generated!');
      } else {
        setError(result.error || 'Failed to generate verification options');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async (method: 'sms' | 'whatsapp') => {
    setIsLoading(true);
    setError('');
    setSelectedMethod(method);

    try {
      if (method === 'whatsapp') {
        // For WhatsApp, we already have the URL, just proceed to code entry
        if (whatsappUrl) {
          setStep('code');
          console.log('📱 WhatsApp verification ready');
        } else {
          setError('WhatsApp verification not available');
        }
      } else {
        // Send actual SMS
        const { smsService } = await import('@/lib/sms-service');
        const result = await smsService.sendVerificationSMS(phone, demoCode, { 
          preferSMS: true 
        });
        
        if (result.success) {
          setStep('code');
          console.log('📱 SMS sent successfully');
        } else {
          setError(result.error || 'Failed to send SMS');
        }
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await touristProfileService.verifyPhoneCode(phone, code);
      
      if (result.success && result.profile) {
        if (result.profile.first_name) {
          // Profile complete, ready to use
          onVerified(result.profile);
          onClose();
        } else {
          // Need to complete profile
          setStep('profile');
        }
      } else {
        setError(result.error || 'Invalid verification code');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!firstName.trim()) {
      setError('Please enter your first name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const countryCode = touristProfileService.getCountryFromPhone(phone);
      
      const result = await touristProfileService.upsertProfile(phone, {
        first_name: firstName,
        country_code: countryCode
      });
      
      if (result.success && result.profile) {
        onVerified(result.profile);
        onClose();
      } else {
        setError(result.error || 'Failed to save profile');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const countryInfo = getCountryInfo(phone);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">{subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Step 1: Phone Number */}
          {step === 'phone' && (
            <div className="space-y-6">
              
              {/* Phone Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  <Smartphone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="+212-6-12-34-56-78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-center text-lg font-mono"
                  />
                  
                  {/* Country Detection */}
                  {phone && (
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span className="text-lg">{countryInfo.flag}</span>
                      <span>{countryInfo.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Demo Numbers */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="p-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-50">
                  📞 Demo Numbers (for testing)
                </summary>
                <div className="p-3 pt-0 space-y-2">
                  {Object.entries(DEMO_PHONES).map(([name, demoPhone]) => (
                    <button
                      key={name}
                      onClick={() => setPhone(demoPhone)}
                      className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                    >
                      <div className="font-medium">{name}</div>
                      <div className="text-gray-600 font-mono">{demoPhone}</div>
                    </button>
                  ))}
                </div>
              </details>

              {/* Why Phone Number */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">✅ Why we need your phone?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Save preferences across devices</li>
                  <li>• WhatsApp booking confirmations</li>
                  <li>• Access bookings anywhere</li>
                  <li>• No password needed!</li>
                </ul>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <Button 
                onClick={handleGenerateOptions}
                disabled={!phone.trim() || isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <MessageCircle className="w-4 h-4 mr-2" />
                )}
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Choose Verification Method */}
          {step === 'method' && (
            <div className="space-y-6">
              
              {/* Method Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">Choose verification method</h3>
                <p className="text-sm text-gray-600 text-center">
                  We'll send a 6-digit code to {phone}
                </p>

                {/* WhatsApp Option */}
                {verificationOptions?.whatsapp?.success && (
                  <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMethod === 'whatsapp' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                  }`} onClick={() => setSelectedMethod('whatsapp')}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">WhatsApp</div>
                          <div className="text-sm text-gray-600">Opens WhatsApp with code</div>
                          {recommendedMethod === 'whatsapp' && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Recommended</Badge>
                          )}
                        </div>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                        {selectedMethod === 'whatsapp' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* SMS Option */}
                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedMethod === 'sms' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`} onClick={() => setSelectedMethod('sms')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">SMS</div>
                        <div className="text-sm text-gray-600">Text message to your phone</div>
                        {recommendedMethod === 'sms' && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs">Recommended</Badge>
                        )}
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                      {selectedMethod === 'sms' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Send Code Button */}
              <Button 
                onClick={() => handleSendCode(selectedMethod)}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : selectedMethod === 'whatsapp' ? (
                  <MessageCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Smartphone className="w-4 h-4 mr-2" />
                )}
                Send {selectedMethod === 'whatsapp' ? 'WhatsApp' : 'SMS'} Code
              </Button>

              {/* Back Button */}
              <Button 
                variant="outline" 
                onClick={() => setStep('phone')}
                className="w-full"
              >
                Back to Phone Number
              </Button>
            </div>
          )}

          {/* Step 3: Code Verification */}
          {step === 'code' && (
            <div className="space-y-6">
              
              {/* Code Info */}
              <div className="text-center space-y-2">
                <div className="text-lg">
                  {selectedMethod === 'whatsapp' ? '📱' : '💬'}
                </div>
                <h3 className="text-lg font-semibold">
                  {selectedMethod === 'whatsapp' ? 'Check WhatsApp' : 'Check your messages'}
                </h3>
                <p className="text-sm text-gray-600">
                  Code sent to {phone}
                  {timeLeft > 0 && (
                    <span className="block mt-1">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Expires in {formatTime(timeLeft)}
                    </span>
                  )}
                </p>
              </div>

              {/* WhatsApp Link */}
              {selectedMethod === 'whatsapp' && whatsappUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center space-y-3">
                    <div className="text-green-800 font-medium">Open WhatsApp to get your code</div>
                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Open WhatsApp
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <div className="text-xs text-green-700">
                      The verification code will be in the message
                    </div>
                  </div>
                </div>
              )}

              {/* Demo Code Display */}
              {demoCode && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-green-800 font-medium mb-2">Demo Code</div>
                    <div className="text-2xl font-bold font-mono text-green-900 bg-white px-4 py-2 rounded border">
                      {demoCode}
                    </div>
                    <div className="text-xs text-green-700 mt-2">
                      Use this code for testing
                    </div>
                  </div>
                </div>
              )}

              {/* Code Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 text-center">
                  Enter 6-digit code
                </label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-2xl font-mono tracking-wider"
                  maxLength={6}
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Verify Button */}
              <Button 
                onClick={handleVerifyCode}
                disabled={code.length !== 6 || isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Verify Code
              </Button>

              {/* Back Button */}
              <Button 
                variant="outline" 
                onClick={() => setStep('method')}
                className="w-full"
              >
                Try Different Method
              </Button>
            </div>
          )}

          {/* Step 4: Complete Profile */}
          {step === 'profile' && (
            <div className="space-y-6">
              
              {/* Success Message */}
              <div className="text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold">Phone Verified! 🎉</h3>
                <p className="text-sm text-gray-600">
                  Complete your profile to continue
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="text-center"
                />
              </div>

              {/* Country Display */}
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-sm text-gray-600 mb-1">Detected Country</div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">{countryInfo.flag}</span>
                  <span className="font-medium">{countryInfo.name}</span>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Complete Button */}
              <Button 
                onClick={handleCompleteProfile}
                disabled={!firstName.trim() || isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                )}
                Complete Profile
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
} 