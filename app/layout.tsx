import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gym Workout Tracker',
  description: 'A modern app to track your gym workouts and progress.',
  manifest: '/manifest.json',
  themeColor: '#030712',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Workout',
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-gray-950 text-white">
        {children}
      </body>
    </html>
  )
}