'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, ExternalLink, Smartphone, Globe, AlertCircle } from 'lucide-react';

export default function TestWhatsAppPage() {
  const [phone, setPhone] = useState('+212-6-12-34-56-78');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateWhatsAppLink = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Use the WhatsApp verification service directly
      const { whatsappVerificationService } = await import('@/lib/whatsapp-verification-service');
      
      // Generate verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      
      // Generate WhatsApp link
      const result = await whatsappVerificationService.sendWhatsAppVerification(phone, code, {
        method: 'link',
        language: 'en'
      });
      
      if (result.success && result.whatsappUrl) {
        setWhatsappUrl(result.whatsappUrl);
        console.log('✅ WhatsApp link generated:', result.whatsappUrl);
      } else {
        setError(result.error || 'Failed to generate WhatsApp link');
      }
      
    } catch (err) {
      console.error('Error generating WhatsApp link:', err);
      setError('Failed to generate WhatsApp link');
    } finally {
      setIsLoading(false);
    }
  };

  const getCountryInfo = (phoneNumber: string) => {
    if (phoneNumber.startsWith('+212')) return { name: 'Morocco', flag: '🇲🇦', whatsappUsage: '95%' };
    if (phoneNumber.startsWith('+33')) return { name: 'France', flag: '🇫🇷', whatsappUsage: '65%' };
    if (phoneNumber.startsWith('+1')) return { name: 'USA/Canada', flag: '🇺🇸', whatsappUsage: '25%' };
    if (phoneNumber.startsWith('+44')) return { name: 'United Kingdom', flag: '🇬🇧', whatsappUsage: '30%' };
    if (phoneNumber.startsWith('+49')) return { name: 'Germany', flag: '🇩🇪', whatsappUsage: '45%' };
    if (phoneNumber.startsWith('+34')) return { name: 'Spain', flag: '🇪🇸', whatsappUsage: '78%' };
    return { name: 'International', flag: '🌍', whatsappUsage: 'Unknown' };
  };

  const countryInfo = getCountryInfo(phone);

  // Prevent hydration mismatch by not rendering interactive content until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🇲🇦 <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">WhatsApp Verification</span> Test
            </h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🇲🇦 <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">WhatsApp Verification</span> Test
          </h1>
          <p className="text-gray-600">Real-time WhatsApp link generation for international tourists</p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>🚀 Live Test:</strong> This generates actual WhatsApp links that work on your device!
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Phone Number Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  International Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+212-6-12-34-56-78"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="font-mono text-center"
                />
              </div>

              {/* Country Detection */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{countryInfo.flag}</span>
                    <div>
                      <div className="font-medium">{countryInfo.name}</div>
                      <div className="text-sm text-gray-600">WhatsApp Usage: {countryInfo.whatsappUsage}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {countryInfo.whatsappUsage.includes('9') || countryInfo.whatsappUsage.includes('7') || countryInfo.whatsappUsage.includes('6') ? (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                        WhatsApp Recommended
                      </div>
                    ) : (
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        SMS Recommended
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Test Numbers */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Quick Test:</div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhone('+212-6-12-34-56-78')}
                    className="text-xs"
                  >
                    🇲🇦 Morocco
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhone('+33-6-98-76-54-32')}
                    className="text-xs"
                  >
                    🇫🇷 France
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhone('+1-555-123-4567')}
                    className="text-xs"
                  >
                    🇺🇸 USA
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPhone('+49-30-12345678')}
                    className="text-xs"
                  >
                    🇩🇪 Germany
                  </Button>
                </div>
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

              {/* Generate Button */}
              <Button 
                onClick={generateWhatsAppLink}
                disabled={!phone.trim() || isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Real WhatsApp Link...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Generate WhatsApp Link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Result Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                WhatsApp Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {whatsappUrl ? (
                <>
                  {/* Success Message */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 font-medium mb-2">
                      <MessageCircle className="w-4 h-4" />
                      Real WhatsApp Link Generated! 🎉
                    </div>
                    <div className="text-sm text-green-700">
                      This is a <strong>real working link</strong> that will open WhatsApp on your device.
                    </div>
                  </div>

                  {/* WhatsApp Link Button */}
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      📱 Open WhatsApp Now
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>

                  {/* Verification Code Display */}
                  {verificationCode && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-yellow-800 mb-2">Generated Verification Code:</div>
                      <div className="text-2xl font-bold font-mono text-yellow-900 bg-white px-4 py-2 rounded border text-center">
                        {verificationCode}
                      </div>
                      <div className="text-xs text-yellow-700 mt-2 text-center">
                        This code will be in the WhatsApp message
                      </div>
                    </div>
                  )}

                  {/* URL Preview */}
                  <details className="bg-gray-50 p-3 rounded-lg">
                    <summary className="text-sm font-medium text-gray-700 cursor-pointer">View Generated URL</summary>
                    <div className="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded border mt-2">
                      {whatsappUrl}
                    </div>
                  </details>

                  {/* Message Preview */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">Message Preview:</div>
                    <div className="bg-white p-3 rounded border text-sm">
                      🇲🇦 Morocco Made Real verification code: <strong>{verificationCode}</strong><br/>
                      <br/>
                      Valid for 10 minutes. Reply with this code to verify your phone number.<br/>
                      <br/>
                      Don't share this code with anyone.
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-600">
                    Enter a phone number and click "Generate WhatsApp Link" to test the real verification system.
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    This will create actual working WhatsApp links!
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>🌟 Real WhatsApp Verification Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs mt-0.5">✓</div>
                <div>
                  <div className="font-medium">Smart Country Detection</div>
                  <div className="text-gray-600">Automatically recommends WhatsApp for high-usage countries like Morocco (95%)</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs mt-0.5">✓</div>
                <div>
                  <div className="font-medium">Real WhatsApp Links</div>
                  <div className="text-gray-600">Generates actual wa.me URLs that open WhatsApp with pre-filled messages</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-xs mt-0.5">✓</div>
                <div>
                  <div className="font-medium">Tourist-Friendly</div>
                  <div className="text-gray-600">Perfect for international tourists - avoids SMS roaming charges</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Instructions */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-bold text-blue-900 mb-3">🧪 How to Test Real WhatsApp Verification:</h3>
            <ol className="text-sm text-blue-800 space-y-2">
              <li><strong>1.</strong> Choose a phone number (use Morocco +212 for best results)</li>
              <li><strong>2.</strong> Click "Generate WhatsApp Link" - this creates a real working link</li>
              <li><strong>3.</strong> Click "📱 Open WhatsApp Now" - this will actually open WhatsApp</li>
              <li><strong>4.</strong> See the verification message pre-filled in WhatsApp</li>
              <li><strong>5.</strong> Send the message (if you want to test the full flow)</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-100 rounded text-xs text-blue-700">
              <strong>Note:</strong> This is the same system used in the main cultural matching app for phone verification!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 