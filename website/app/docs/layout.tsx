import type { ReactNode } from 'react'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { source } from '@/lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span className="text-lg font-bold tracking-tight">
            Ghostly
          </span>
        ),
        url: '/',
      }}
      sidebar={{
        defaultOpenLevel: 1,
      }}
      links={[
        {
          text: 'Playground',
          url: 'https://ghostly-playground.vercel.app',
        },
      ]}
      githubUrl="https://github.com/AdanSerrano/ghostly"
    >
      {children}
    </DocsLayout>
  )
}
