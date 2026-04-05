import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import pc from 'picocolors'

export const GHOSTLY = pc.bold(pc.cyan('ghostly'))

export function log(msg: string) { console.log(`  ${msg}`) }
export function success(msg: string) { console.log(`  ${pc.green('✓')} ${msg}`) }
export function warn(msg: string) { console.log(`  ${pc.yellow('!')} ${msg}`) }
export function error(msg: string) { console.log(`  ${pc.red('✗')} ${msg}`) }
export function info(msg: string) { console.log(`  ${pc.blue('i')} ${msg}`) }
export function step(n: number, msg: string) { console.log(`\n  ${pc.cyan(`[${n}]`)} ${msg}`) }

export function detectPackageManager(): 'bun' | 'pnpm' | 'yarn' | 'npm' {
  const cwd = process.cwd()
  if (existsSync(join(cwd, 'bun.lock')) || existsSync(join(cwd, 'bun.lockb'))) return 'bun'
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  return 'npm'
}

export function installCmd(pm: string, ...pkgs: string[]): string {
  const cmd = pm === 'npm' ? 'npm install' : `${pm} add`
  return `${cmd} ${pkgs.join(' ')}`
}

export function fileContains(path: string, text: string): boolean {
  if (!existsSync(path)) return false
  return readFileSync(path, 'utf-8').includes(text)
}

export function findFile(...candidates: string[]): string | null {
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  return null
}

export function readJson(path: string): Record<string, unknown> | null {
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf-8'))
  } catch {
    return null
  }
}

export function isNextJs(): boolean {
  const pkg = readJson('package.json')
  if (!pkg) return false
  const deps = { ...(pkg.dependencies as Record<string, string> || {}), ...(pkg.devDependencies as Record<string, string> || {}) }
  return 'next' in deps
}

export function hasAppRouter(): boolean {
  return existsSync('app') || existsSync('src/app')
}

export function getAppDir(): string | null {
  if (existsSync('src/app')) return 'src/app'
  if (existsSync('app')) return 'app'
  return null
}
