import { readFileSync } from 'fs'
import { join } from 'path'

export function GET() {
  const content = readFileSync(join(process.cwd(), 'public', 'llms-full.txt'), 'utf-8')

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
