import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Morocco Made Real - Authentic Cultural Tourism',
  description: 'AI + Blockchain cultural preservation platform connecting tourists with authentic Moroccan artisan experiences',
  keywords: ['Morocco', 'cultural tourism', 'artisan experiences', 'blockchain', 'AI', 'authentic travel'],
  authors: [{ name: 'Morocco Made Real Team' }],
  openGraph: {
    title: 'Morocco Made Real - Authentic Cultural Tourism',
    description: 'Connect with authentic Moroccan artisan experiences through AI matching and blockchain verification',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morocco Made Real - Authentic Cultural Tourism',
    description: 'Connect with authentic Moroccan artisan experiences through AI matching and blockchain verification',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  )
} 