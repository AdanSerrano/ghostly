# @ghostly/mcp

MCP (Model Context Protocol) server for [Ghostly](https://github.com/AdanSerrano/ghostly) skeleton loaders.

Gives AI assistants (Claude, Cursor, GitHub Copilot) direct access to Ghostly documentation, component API, and usage examples.

## Setup

### Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "ghostly": {
      "command": "npx",
      "args": ["@ghostly/mcp"]
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ghostly": {
      "command": "npx",
      "args": ["@ghostly/mcp"]
    }
  }
}
```

### VS Code (Copilot)

Add to `.vscode/mcp.json`:

```json
{
  "servers": {
    "ghostly": {
      "command": "npx",
      "args": ["@ghostly/mcp"]
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `list_components` | List all Ghostly components and hooks |
| `get_component` | Get full docs for a specific component (props, examples, import) |
| `get_installation` | Installation and setup instructions |
| `get_css_reference` | CSS custom properties, animations, data attributes |
| `get_examples` | Real-world usage examples |
| `search_docs` | Search documentation by keyword |

## How it works

When you ask your AI assistant about Ghostly, it can call these tools to get accurate, up-to-date documentation instead of relying on training data. This means:

- No hallucinated APIs or props
- Always current with the latest version
- Complete examples with correct syntax

## Example prompts

- "Add a skeleton loader to this product grid using Ghostly"
- "How do I use GhostlySuspense with React Server Components?"
- "What CSS variables does Ghostly support for dark mode?"
- "Show me how to customize skeleton colors per section"

## License

MIT
