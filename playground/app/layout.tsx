import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { GhostlyProvider } from '@ghostly/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ghostly Playground',
  description: 'Test and demo Ghostly skeleton loaders',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <GhostlyProvider animation="shimmer" radius="sm">
          {children}
        </GhostlyProvider>
      </body>
    </html>
  )
}
