'use client'

import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

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

  return (
    <footer className={`bg-gray-800 text-gray-300 py-6 px-4 mt-auto ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
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
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700 text-center">
        <p className={`text-xs text-gray-400 ${isRTL ? 'font-arabic' : ''}`}>
          &copy; {new Date().getFullYear()} {t('title')}. {t('all_rights_reserved')} | {t('ai_platform')} | {t('vision')} 🇲🇦
        </p>
      </div>
    </footer>
  )
} 