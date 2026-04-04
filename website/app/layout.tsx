import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { RootProvider } from 'fumadocs-ui/provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s — Ghostly',
    default: 'Ghostly — Zero-config skeleton loaders',
  },
  description: 'Zero-config skeleton loaders for React. Wrap your component, done.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
