'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  BarChart3, 
  Zap,
  Users,
  Globe,
  Shield,
  ArrowRight,
  Sparkles,
  Play,
  Move,
  Camera
} from 'lucide-react';

export default function Home() {
  const t = useTranslations('homepage');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      
      {/* Mobile-First Hero Section */}
      <section className="container mx-auto px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Title - Mobile Optimized */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent leading-tight">
              Morocco Made Real
              </h1>
            <p className="text-lg md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto px-4">
              AI-powered cultural matching platform
            </p>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto px-4">
              Swipe through authentic Moroccan experiences. Match with verified artisans instantly.
            </p>
          </div>

          {/* Mobile-First Primary CTA */}
          <div className="mb-12">
            <Button 
              onClick={() => router.push('/tourist-onboarding')}
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 md:px-12 py-6 md:py-8 text-xl md:text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 mx-4"
            >
              <Heart className="w-8 h-8 mr-4" />
              🔥 Start Your Journey
              <ArrowRight className="w-7 h-7 ml-4" />
            </Button>
          </div>

          {/* Key Stats - Mobile Optimized */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto px-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 mr-3 text-orange-500" />
                  <span className="text-3xl md:text-4xl font-bold text-orange-500">1,156</span>
                </div>
                <p className="text-gray-600 font-medium text-lg">Verified Artisans</p>
                <Badge className="bg-orange-100 text-orange-700 mt-3 text-sm">+97 this week</Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Globe className="w-8 h-8 mr-3 text-blue-500" />
                  <span className="text-3xl md:text-4xl font-bold text-blue-500">92.7%</span>
                </div>
                <p className="text-gray-600 font-medium text-lg">Match Success</p>
                <Badge className="bg-blue-100 text-blue-700 mt-3 text-sm">Industry leading</Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 mr-3 text-green-500" />
                  <span className="text-3xl md:text-4xl font-bold text-green-500">47 sec</span>
                </div>
                <p className="text-gray-600 font-medium text-lg">Avg Match Time</p>
                <Badge className="bg-green-100 text-green-700 mt-3 text-sm">Lightning fast</Badge>
            </CardContent>
          </Card>
          </div>

          {/* Secondary Actions - Mobile Optimized */}
          <div className="flex flex-col gap-4 px-4">
            <Button 
              onClick={() => router.push('/platform-dashboard')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              Platform Dashboard
            </Button>
            
            <Button 
              onClick={() => router.push('/artisan-verification-dashboard')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
            >
              <Zap className="w-6 h-6 mr-3" />
              🚀 AI Verification Hub
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Mobile-First */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-2xl md:text-4xl font-bold mb-8 md:mb-12 px-4">
              Revolutionary Cultural Matching
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Move className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">Swipe to Match</h3>
                <p className="text-orange-100 text-base md:text-lg leading-relaxed">
                  Browse verified artisans with intuitive swipe gestures. Right for like, left to pass.
                </p>
                  </div>
                  
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-white" />
                          </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">Instant Verification</h3>
                <p className="text-orange-100 text-base md:text-lg leading-relaxed">
                  30-second WhatsApp onboarding. AI verifies authenticity. 1000+ artisans in 30 days.
                </p>
                      </div>
                      
              <div className="text-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">Blockchain Certified</h3>
                <p className="text-orange-100 text-base md:text-lg leading-relaxed">
                  Every artisan gets NFT verification. Immutable authenticity certificates.
                        </p>
                      </div>
                    </div>
                  </div>
        </div>
      </section>

      {/* Local Creator Network - New Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-gray-800">
                🔄 Complete Artisan Ecosystem
          </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                From AI verification to viral content creation to tourist bookings - a seamless workflow empowering artisans and locals.
              </p>
            </div>

            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-blue-700">1. AI Verification</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  30-second WhatsApp video gets AI-analyzed for authenticity. Instant blockchain certificate. 97% cost reduction vs traditional methods.
                </p>
                <Button 
                  onClick={() => router.push('/artisan-verification-dashboard')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  View Verification Hub
                </Button>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-purple-700">2. Content Creation</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Local creators with Android media kits create viral Instagram reels. €1,450/month average earnings while promoting artisans.
                </p>
                <Button 
                  onClick={() => router.push('/local-creator-network')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Join Creator Network
                </Button>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-green-700">3. Tourist Matching</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Swipe-based cultural matching connects tourists with verified artisans. 92.7% match success rate drives sustainable bookings.
                </p>
                <Button 
                  onClick={() => router.push('/cultural-match')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Start Matching
                </Button>
              </Card>
            </div>

            {/* Ecosystem Results */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Ecosystem Impact</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">1,156</div>
                  <div className="text-orange-100">Verified Artisans</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">847</div>
                  <div className="text-orange-100">Local Creators</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">12.3K</div>
                  <div className="text-orange-100">Viral Reels</div>
            </div>
            <div>
                  <div className="text-3xl md:text-4xl font-bold mb-2">€2.1M</div>
                  <div className="text-orange-100">Total Revenue</div>
                </div>
              </div>
            </div>

            {/* Old Problem vs New Solution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-12">
              <div>
                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white mb-8">
                  <h3 className="text-2xl font-bold mb-4">❌ The Old Way</h3>
                  <ul className="space-y-3 text-orange-100">
                    <li>• Tourists create basic phone videos</li>
                    <li>• Artisans struggle with social media</li>
                    <li>• No professional content creation</li>
                    <li>• Manual verification takes weeks</li>
                    <li>• Limited local job opportunities</li>
                  </ul>
                </div>
              </div>

            <div>
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">✅ Our Ecosystem</h3>
                  <ul className="space-y-3 text-green-100">
                    <li>• AI verification in 30 seconds</li>
                    <li>• Professional local content creators</li>
                    <li>• Viral Instagram marketing included</li>
                    <li>• Sustainable €1,450/month for locals</li>
                    <li>• 92.7% tourist match success</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Preview - Mobile Optimized */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 px-4">
              See It In Action
          </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 px-4">
              From WhatsApp video to verified artisan profile in 47 seconds.
            </p>
            
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-6 md:p-8 text-white mx-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Play className="w-12 h-12 text-white ml-1" />
                </div>
                </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">Watch Live Demo</h3>
              <p className="text-gray-300 mb-6 text-base md:text-lg px-4">
                See Hassan, a pottery master from Fez, get verified and matched with travelers.
              </p>
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Play className="w-5 h-5 mr-3" />
                Play Demo Video
                  </Button>
                </div>
          </div>
        </div>
      </section>

      {/* Final Mobile CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 px-4">
              Ready to Discover Authentic Morocco?
          </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 px-4">
              Join thousands finding their perfect cultural match.
            </p>
            
            {/* Large Mobile CTA */}
            <div className="px-4">
              <Button 
                onClick={() => router.push('/cultural-match')}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 md:px-12 py-6 md:py-8 text-xl md:text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                <Heart className="w-8 h-8 mr-4" />
                Start Your Journey
                <ArrowRight className="w-7 h-7 ml-4" />
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm text-gray-500 px-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>1,156 verified artisans</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>92.7% success rate</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Blockchain certified</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
} 