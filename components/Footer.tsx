'use client'

import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { Facebook, Instagram, Twitter, Youtube, Linkedin, MessageCircle } from 'lucide-react'

export default function Footer() {
  const params = useParams()
  const locale = params.locale as string
  const isRTL = locale === 'ar'
  
  // Safely get translations with fallback
  let t: any
  try {
    t = useTranslations('footer')
  } catch (error) {
    // Fallback if translations are not available
    t = (key: string) => {
      const fallbacks: Record<string, string> = {
        title: 'Morocco Made Real',
        description: 'AI platform for cultural tourism and authentication of traditional Moroccan crafts.',
        vision: 'Supporting Morocco Tourism Vision 2030',
        travellers: 'Travellers',
        artisans_guides: 'Artisans & Guides',
        support: 'Support',
        follow_us: 'Follow Us',
        ai_itineraries: 'AI Itineraries',
        authenticity_scan: 'Authenticity Scan',
        local_guides: 'Local Guides',
        mobile_app: 'Mobile App',
        artisan_space: 'Artisan Space',
        guide_network: 'Guide Network',
        ai_training: 'AI Training',
        certification: 'Certification',
        help_center: 'Help Center',
        travel_contact: 'Travel Contact',
        tourism_partnerships: 'Tourism Partnerships',
        press_media: 'Press & Media',
        all_rights_reserved: 'All rights reserved',
        ai_platform: 'AI Tourism & Culture Platform'
      }
      return fallbacks[key] || key
    }
  }

  const getLocalizedHref = (href: string) => {
    if (href.startsWith("/#")) {
      return `/${locale}${href}`
    }
    return href
  }

  const socialMediaLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com/moroccomadereal',
      icon: Facebook,
      color: 'hover:text-blue-500'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/moroccomadereal',
      icon: Instagram,
      color: 'hover:text-pink-500'
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com/@moroccomadereal',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z"/>
        </svg>
      ),
      color: 'hover:text-black'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@moroccomadereal',
      icon: Youtube,
      color: 'hover:text-red-500'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/moroccomadereal',
      icon: Twitter,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/moroccomadereal',
      icon: Linkedin,
      color: 'hover:text-blue-600'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/212600000000',
      icon: MessageCircle,
      color: 'hover:text-green-500'
    }
  ]

  return (
    <footer className={`bg-gray-800 text-gray-300 py-6 px-4 mt-auto ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="footer-section">
          <h3 className={`text-base font-semibold text-white mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t('title')}</h3>
          <p className={`text-xs mb-2 leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
            {t('description')}
          </p>
          <p className={`text-xs font-semibold ${isRTL ? 'font-arabic' : ''}`}>
            🇲🇦 {t('vision')}
          </p>
        </div>

        <div className="footer-section">
          <h3 className={`text-base font-semibold text-white mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t('travellers')}</h3>
          <ul className="space-y-1 text-xs">
            <li><Link href={getLocalizedHref("/#itineraires")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('ai_itineraries')}</Link></li>
            <li><Link href={getLocalizedHref("/#authentification")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('authenticity_scan')}</Link></li>
            <li><Link href={getLocalizedHref("/#guides")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('local_guides')}</Link></li>
            <li><Link href={getLocalizedHref("/#mobile")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('mobile_app')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className={`text-base font-semibold text-white mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t('artisans_guides')}</h3>
          <ul className="space-y-1 text-xs">
            <li><Link href={getLocalizedHref("/artisan")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('artisan_space')}</Link></li>
            <li><Link href={getLocalizedHref("/#guide-network")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('guide_network')}</Link></li>
            <li><Link href={getLocalizedHref("/#formation")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('ai_training')}</Link></li>
            <li><Link href={getLocalizedHref("/#certification")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('certification')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className={`text-base font-semibold text-white mb-2 ${isRTL ? 'font-arabic' : ''}`}>{t('support')}</h3>
          <ul className="space-y-1 text-xs">
            <li><Link href={getLocalizedHref("/#help")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('help_center')}</Link></li>
            <li><Link href={getLocalizedHref("/#contact")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('travel_contact')}</Link></li>
            <li><Link href={getLocalizedHref("/#partnership")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('tourism_partnerships')}</Link></li>
            <li><Link href={getLocalizedHref("/#press")} className={`hover:text-white transition-colors ${isRTL ? 'font-arabic' : ''}`}>{t('press_media')}</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className={`text-base font-semibold text-white mb-3 ${isRTL ? 'font-arabic' : ''}`}>{t('follow_us')}</h3>
          <div className="grid grid-cols-4 gap-2 md:grid-cols-2 lg:grid-cols-4">
            {socialMediaLinks.map((social) => {
              const IconComponent = social.icon
              return (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 transition-colors duration-200 ${social.color} flex items-center justify-center p-2 rounded-lg hover:bg-gray-700`}
                  title={social.name}
                >
                  <IconComponent />
                </Link>
              )
            })}
          </div>
          <div className="mt-3 space-y-1 text-xs">
            <p className={`text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
              📱 WhatsApp: +212 6 00 00 00 00
            </p>
            <p className={`text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
              📧 hello@moroccomadereal.com
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <p className={`text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
            &copy; {new Date().getFullYear()} {t('title')}. {t('all_rights_reserved')} | {t('ai_platform')}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span className={`${isRTL ? 'font-arabic' : ''}`}>{t('vision')} 🇲🇦</span>
            <span className="hidden md:inline">|</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 