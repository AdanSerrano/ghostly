import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { COMPONENTS, INSTALLATION, CSS_REFERENCE, EXAMPLES } from './docs.js'

const server = new McpServer({
  name: 'ghostly',
  version: '0.2.4',
})

// --- Tool: list_components ---
server.tool(
  'list_components',
  'List all available Ghostly components and hooks',
  {},
  async () => {
    const list = Object.values(COMPONENTS).map((c) => ({
      name: c.name,
      description: c.description,
      import: c.import,
    }))

    return {
      content: [{ type: 'text' as const, text: JSON.stringify(list, null, 2) }],
    }
  },
)

// --- Tool: get_component ---
server.tool(
  'get_component',
  'Get full documentation for a specific Ghostly component',
  {
    name: z.string().describe(
      'Component name: Ghostly, GhostlyList, GhostlySuspense, GhostlyProvider, or useGhostly',
    ),
  },
  async ({ name }) => {
    const key = Object.keys(COMPONENTS).find(
      (k) => k.toLowerCase() === name.toLowerCase(),
    ) as keyof typeof COMPONENTS | undefined

    if (!key) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Component "${name}" not found. Available: ${Object.keys(COMPONENTS).join(', ')}`,
          },
        ],
        isError: true,
      }
    }

    const component = COMPONENTS[key]
    const doc = [
      `# ${component.name}`,
      '',
      component.description,
      '',
      '## Import',
      '```tsx',
      component.import,
      '```',
      '',
    ]

    if (Object.keys(component.props).length > 0) {
      doc.push('## Props', '')
      for (const [propName, prop] of Object.entries(component.props)) {
        const p = prop as { type: string; required?: boolean; default?: string; description?: string }
        const parts = [`- **${propName}**: \`${p.type}\``]
        if (p.required) parts.push('(required)')
        if (p.default) parts.push(`— default: \`${p.default}\``)
        if (p.description) parts.push(`— ${p.description}`)
        doc.push(parts.join(' '))
      }
      doc.push('')
    }

    doc.push('## Example', '', '```tsx', component.example, '```')

    return {
      content: [{ type: 'text' as const, text: doc.join('\n') }],
    }
  },
)

// --- Tool: get_installation ---
server.tool(
  'get_installation',
  'Get Ghostly installation and setup instructions',
  {},
  async () => ({
    content: [{ type: 'text' as const, text: INSTALLATION }],
  }),
)

// --- Tool: get_css_reference ---
server.tool(
  'get_css_reference',
  'Get CSS custom properties, animations, data attributes, and accessibility',
  {},
  async () => ({
    content: [{ type: 'text' as const, text: CSS_REFERENCE }],
  }),
)

// --- Tool: get_examples ---
server.tool(
  'get_examples',
  'Get real-world usage examples for Ghostly skeleton loaders',
  {},
  async () => ({
    content: [{ type: 'text' as const, text: EXAMPLES }],
  }),
)

// --- Tool: search_docs ---
server.tool(
  'search_docs',
  'Search Ghostly documentation by keyword',
  {
    query: z.string().describe(
      'Search term (e.g., "suspense", "dark mode", "list", "tailwind")',
    ),
  },
  async ({ query }) => {
    const q = query.toLowerCase()
    const results: string[] = []

    for (const comp of Object.values(COMPONENTS)) {
      if (
        comp.name.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q) ||
        comp.example.toLowerCase().includes(q)
      ) {
        results.push(`## ${comp.name}\n${comp.description}\n\`\`\`tsx\n${comp.example}\n\`\`\``)
      }
    }

    const sections = [
      { title: 'Installation', content: INSTALLATION },
      { title: 'CSS Reference', content: CSS_REFERENCE },
      { title: 'Examples', content: EXAMPLES },
    ]

    for (const section of sections) {
      if (section.content.toLowerCase().includes(q)) {
        const lines = section.content.split('\n')
        const matchIdx = lines.findIndex((l) => l.toLowerCase().includes(q))
        if (matchIdx >= 0) {
          const start = Math.max(0, matchIdx - 2)
          const end = Math.min(lines.length, matchIdx + 8)
          results.push(`## ${section.title}\n${lines.slice(start, end).join('\n')}`)
        }
      }
    }

    if (results.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `No results for "${query}". Try: components, suspense, dark mode, tailwind, animation, color, list, accessibility`,
          },
        ],
      }
    }

    return {
      content: [{ type: 'text' as const, text: results.join('\n\n---\n\n') }],
    }
  },
)

// --- Start ---
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error('Ghostly MCP server error:', error)
  process.exit(1)
})
