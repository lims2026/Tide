import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cinzel, Manrope } from 'next/font/google'
import './globals.css'

/**
 * Elegant serif display font used for travel journal headings and passport stamps.
 */
const displayFont = Cinzel({ subsets: ['latin'], variable: '--font-display' })

/**
 * Clean sans font used for readable field notes and itinerary labels.
 */
const sansFont = Manrope({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: "Larry's Tour Guide",
  description: 'An interactive tourist passport and live field journal for the trip.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f5ead3',
}

/**
 * Root layout for the passport-themed itinerary interface.
 *
 * It loads the serif/sans typography pair used throughout the field journal and
 * wraps the app in the warm parchment page background.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable} bg-[#f9f1df]`}>
      <body className="font-sans antialiased text-slate-900">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
