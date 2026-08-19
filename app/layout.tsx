import type { Metadata, Viewport } from 'next'
import { Geist, Michroma, Source_Serif_4 } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Header } from './header'
import { Footer } from './footer'
import { WEBSITE_URL } from '@/lib/constants'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f9f7f2',
}

export const metadata: Metadata = {
  metadataBase: new URL(WEBSITE_URL),
  title: {
    default: "Ryan D'Souza",
    template: "%s · Ryan D'Souza",
  },
  description:
    'I ask people about work and money. The Podcast: long conversations. The Blueprint: street interviews in Bengaluru.',
  openGraph: {
    title: "Ryan D'Souza",
    description:
      'The Podcast: long conversations. The Blueprint: street interviews in Bengaluru.',
    url: WEBSITE_URL,
    siteName: "Ryan D'Souza",
    type: 'website',
  },
}

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

const michroma = Michroma({
  variable: '--font-michroma',
  weight: '400',
  subsets: ['latin'],
})

const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  style: ['normal', 'italic'],
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${sourceSerif.variable} ${michroma.variable}`}
    >
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-HJK5F1S6YH"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-HJK5F1S6YH');
          `}
        </Script>
      </head>
      <body className="bg-paper font-sans text-ink">
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 sm:px-6">
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
