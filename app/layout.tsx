import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Morocco Made Real - Authentic Cultural Experiences',
  description: 'Discover authentic Moroccan artisans and cultural experiences. Connect directly with master craftspeople and preserve traditional heritage.',
  keywords: 'Morocco, artisans, cultural tourism, authentic experiences, traditional crafts, heritage preservation',
  authors: [{ name: 'Morocco Made Real' }],
  openGraph: {
    title: 'Morocco Made Real - Authentic Cultural Experiences',
    description: 'Discover authentic Moroccan artisans and cultural experiences',
    type: 'website',
    locale: 'en_US',
    siteName: 'Morocco Made Real',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morocco Made Real - Authentic Cultural Experiences',
    description: 'Discover authentic Moroccan artisans and cultural experiences',
  },
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <div id="root">{children}</div>
      </body>
    </html>
  )
} 