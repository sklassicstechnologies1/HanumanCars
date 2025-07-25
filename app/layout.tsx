import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/components/auth/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "HanumanCars - Premium Car Rental",
    template: "%s | HanumanCars"
  },
  description: "Experience the future of car rental with our premium fleet of vehicles. Book luxury cars, SUVs, and more with flexible rental options and exceptional service.",
  keywords: [
    "car rental",
    "luxury car rental",
    "premium vehicles",
    "car booking",
    "rental cars",
    "SUV rental",
    "HanumanCars",
    "vehicle rental",
    "car hire",
    "transportation"
  ],
  authors: [{ name: "HanumanCars Team" }],
  creator: "HanumanCars",
  publisher: "HanumanCars",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://hanumancars.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hanumancars.com',
    siteName: 'HanumanCars',
    title: 'HanumanCars - Premium Car Rental',
    description: 'Experience the future of car rental with our premium fleet of vehicles. Book luxury cars, SUVs, and more with flexible rental options and exceptional service.',
    images: [
      {
        url: '/og-image.jpg', // You'll need to create this image
        width: 1200,
        height: 630,
        alt: 'HanumanCars - Premium Car Rental',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HanumanCars - Premium Car Rental',
    description: 'Experience the future of car rental with our premium fleet of vehicles. Book luxury cars, SUVs, and more with flexible rental options and exceptional service.',
    images: ['/og-image.jpg'], // Same as OpenGraph image
    creator: '@hanumancars', // Replace with your actual Twitter handle
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
  },
  verification: {
    google: 'your-google-verification-code', // Replace with your actual verification code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: 'transportation',
  classification: 'car rental service',
  other: {
    'theme-color': '#3b82f6',
    'msapplication-TileColor': '#3b82f6',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'HanumanCars',
    'application-name': 'HanumanCars',
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
