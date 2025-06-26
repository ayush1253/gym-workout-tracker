import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FitTracker Pro',
  description: 'Professional fitness tracking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className="min-h-screen bg-gray-950 text-white">
        {children}
      </body>
    </html>
  )
}