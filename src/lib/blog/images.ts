const optimizableHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').hostname
  } catch {
    return ''
  }
})()

// Posts and pictures can point at any host, but next.config only whitelists
// Supabase storage. Anything else has to bypass the optimizer or it throws.
export function isOptimizable(src: string): boolean {
  if (!optimizableHost) return false
  try {
    return new URL(src).hostname === optimizableHost
  } catch {
    return false
  }
}
