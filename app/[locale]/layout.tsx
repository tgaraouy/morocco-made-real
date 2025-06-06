import React from 'react'
import '../globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap'
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://morocco-made-real.com' : 'http://localhost:3000'),
  title: 'Morocco Made Real: Verified Authentic - Multi-Ministerial Initiative',
  description: 'Government-backed platform bridging Tourism, Digital Innovation, and Traditional Crafts. Connect with verified artisans, explore heritage sites, and experience authentic Moroccan traditions. Supporting Morocco Vision 2030.',
  keywords: 'Morocco tourism, government initiative, Ministry of Tourism, Ministry of Digital, Ministry of Artisans, AI travel planner, cultural discovery, authentic experiences, Morocco Vision 2030, verified artisans, heritage tourism, traditional crafts',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/logo-icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' }
    ],
    apple: [
      { url: '/logo-icon.svg', sizes: '180x180', type: 'image/svg+xml' }
    ],
    other: [
      { rel: 'mask-icon', url: '/logo-icon.svg', color: '#DC143C' }
    ]
  },
  openGraph: {
    title: 'Morocco Made Real: Verified Authentic',
    description: 'Technology Meets Tradition - Your gateway to authentic Moroccan experiences',
    url: 'https://morocco-made-real.com',
    siteName: 'Morocco Made Real',
    images: [
      {
        url: '/logo.svg',
        width: 300,
        height: 100,
        alt: 'Morocco Made Real Logo',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morocco Made Real: Verified Authentic',
    description: 'Technology Meets Tradition - Your gateway to authentic Moroccan experiences',
    images: ['/logo.svg'],
    creator: '@moroccoMadeReal'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#006233',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

const supportedLocales = ['en', 'fr', 'ar', 'es'];

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  
  // Validate and fallback locale
  const validLocale = locale && supportedLocales.includes(locale) ? locale : 'en';
  
  // Get messages using next-intl's server function with explicit locale
  const messages = await getMessages({ locale: validLocale });

  return (
    <html lang={validLocale} suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans bg-moroccan-sand min-h-screen antialiased scroll-smooth`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          <div className="moroccan-gradient h-2 w-full"></div>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <div className="moroccan-gradient h-2 w-full"></div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
} 