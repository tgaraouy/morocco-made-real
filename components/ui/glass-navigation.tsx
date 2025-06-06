'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Search, 
  Heart, 
  User, 
  Bell,
  Menu,
  X,
  Sparkles,
  Map,
  Calendar,
  Gift
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface GlassNavigationProps {
  currentPath?: string;
  notificationCount?: number;
  userName?: string;
  isLoggedIn?: boolean;
}

export default function GlassNavigation({ 
  currentPath = '/', 
  notificationCount = 0,
  userName = 'Cultural Explorer',
  isLoggedIn = true 
}: GlassNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      id: 'home',
      label: 'Discover',
      icon: <Home className="w-5 h-5" />,
      path: '/',
      gradient: 'glass-morocco-sunset'
    },
    {
      id: 'match',
      label: 'Cultural Match',
      icon: <Sparkles className="w-5 h-5" />,
      path: '/cultural-match',
      gradient: 'glass-emerald'
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: <Map className="w-5 h-5" />,
      path: '/explore',
      gradient: 'glass-atlas-mountains'
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: <Calendar className="w-5 h-5" />,
      path: '/bookings',
      gradient: 'glass-purple'
    },
    {
      id: 'rewards',
      label: 'Rewards',
      icon: <Gift className="w-5 h-5" />,
      path: '/rewards',
      gradient: 'glass-sahara'
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav backdrop-blur-xl' : 'glass-nav backdrop-blur-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full glass-morocco flex items-center justify-center">
                <span className="text-xl font-bold text-orange-700">🇲🇦</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-gray-800">Morocco Made Real</h1>
                <p className="text-xs text-gray-600">Authentic Cultural Experiences</p>
              </div>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigation(item.path)}
                  className={`glass-interactive relative h-10 px-4 ${
                    isActive(item.path) 
                      ? `${item.gradient} text-gray-800 font-semibold` 
                      : 'hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {isActive(item.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full"></div>
                  )}
                </Button>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="glass-interactive relative"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 glass-booking-success border-0 text-xs font-bold">
                    {notificationCount}
                  </Badge>
                )}
              </Button>

              {/* User Profile */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full">
                  <div className="w-8 h-8 rounded-full glass-floating flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800">{userName}</p>
                    <p className="text-xs text-gray-600">🌟 Explorer Level</p>
                  </div>
                </div>
              ) : (
                <Button className="glass-morocco text-orange-800 border-0 font-semibold">
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden glass-interactive"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="glass-modal-overlay" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-16 left-4 right-4 glass-modal rounded-2xl border-0 shadow-2xl">
            <div className="p-6 space-y-4">
              {/* User Profile - Mobile */}
              {isLoggedIn && (
                <div className="glass-artisan rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full glass-floating flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{userName}</p>
                      <p className="text-sm text-gray-600">🌟 Explorer Level</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="glass-emerald border-0 text-green-800 text-xs">
                          3 Experiences
                        </Badge>
                        <Badge className="glass-sahara border-0 text-yellow-800 text-xs">
                          €150 Rewards
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items - Mobile */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="lg"
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full justify-start h-12 glass-interactive ${
                      isActive(item.path) 
                        ? `${item.gradient} text-gray-800 font-semibold` 
                        : 'hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {isActive(item.path) && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-emerald-500"></div>
                    )}
                  </Button>
                ))}
              </div>

              {/* Quick Actions - Mobile */}
              <div className="border-t border-white/20 pt-4 space-y-2">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start glass-interactive"
                >
                  <Bell className="w-5 h-5 mr-3" />
                  Notifications
                  {notificationCount > 0 && (
                    <Badge className="ml-auto glass-booking-success border-0 text-xs">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start glass-interactive"
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Favorites
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden glass-nav border-t border-white/10">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-1 h-12 glass-interactive ${
                isActive(item.path) 
                  ? `${item.gradient} text-gray-800` 
                  : 'text-gray-600'
              }`}
            >
              {React.cloneElement(item.icon, { className: 'w-4 h-4' })}
              <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
              {isActive(item.path) && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full"></div>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="h-16 md:h-16"></div>
      <div className="h-16 md:h-0"></div> {/* Bottom nav spacer for mobile */}
    </>
  );
} 