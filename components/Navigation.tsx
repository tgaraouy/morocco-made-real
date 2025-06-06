'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MoroccoMadeRealLogo } from './ui/logo'
import LanguageSwitcher from './LanguageSwitcher'
import { User, Paintbrush, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'
  
  // Safely get translations with fallback
  let t: any
  try {
    t = useTranslations('navigation')
  } catch (error) {
    // Fallback if translations are not available
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        home: 'Home',
        tourist: 'Tourist',
        artisan: 'Artisan'
      }
      return fallbacks[key] || key
    }
  }

  const getLocalizedHref = (href: string) => {
    if (href === "/") {
      return `/${locale}`
    }
    return `/${locale}${href}`
  }

  const navItems = [
    {
      title: 'Artisan Portal',
      href: '/artisan',
      icon: Paintbrush,
      description: 'Share your craft with the world'
    }
  ];

  const isActivePath = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.includes(href);
  };

  return (
    <nav className={`bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-orange-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
          
          {/* Logo and Brand */}
          <Link href={`/${locale}`} className="flex items-center group transition-all duration-300">
            <MoroccoMadeRealLogo variant="icon" size="lg" className="mr-3 group-hover:scale-110 transition-transform duration-300" />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-red-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
                Morocco Made Real
              </h1>
              <p className="text-xs font-medium bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Where Stories Come Alive ✨
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center space-x-1 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              
              // Define colors based on item
              const getItemColors = (title: string, isActive: boolean) => {
                if (title === 'Tourist Experience') {
                  return isActive
                    ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-200'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                } else if (title === 'Artisan Portal') {
                  return isActive
                    ? 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-600 shadow-sm border border-purple-200'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-600'
                }
                return 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }
              
              return (
                <Link
                  key={item.href}
                  href={getLocalizedHref(item.href)}
                  className={cn(
                    'flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200',
                    getItemColors(item.title, isActive)
                  )}
                >
                  <Icon className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
            
            <div className={`${isRTL ? 'mr-4' : 'ml-4'} pl-4 border-l border-gray-200`}>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-orange-50 focus:outline-none transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              
              // Define colors based on item (same as desktop)
              const getItemColors = (title: string, isActive: boolean) => {
                if (title === 'Tourist Experience') {
                  return isActive
                    ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-200'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                } else if (title === 'Artisan Portal') {
                  return isActive
                    ? 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-600 shadow-sm border border-purple-200'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-violet-50 hover:text-purple-600'
                }
                return 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }
              
              return (
                <Link
                  key={item.href}
                  href={getLocalizedHref(item.href)}
                  className={cn(
                    'flex items-center w-full px-4 py-3 rounded-xl font-medium transition-all duration-200',
                    getItemColors(item.title, isActive)
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                  <div>
                    <span className="text-lg">{item.title}</span>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-gray-100">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 