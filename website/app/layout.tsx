import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Outfit, JetBrains_Mono } from 'next/font/google'
import { RootProvider } from 'fumadocs-ui/provider'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s — Ghostly',
    default: 'Ghostly — Zero-config skeleton loaders',
  },
  description: 'Zero-config skeleton loaders for React. Wrap your component, done.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-[family-name:var(--font-outfit)]" suppressHydrationWarning>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
