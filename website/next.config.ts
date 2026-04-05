import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

export default withMDX({
  reactStrictMode: true,
  transpilePackages: ['@ghostly-ui/core', '@ghostly-ui/react'],
})
