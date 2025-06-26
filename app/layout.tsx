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
      <body className="min-h-screen bg-gray-950 text-white">
        {children}
      </body>
    </html>
  )
}