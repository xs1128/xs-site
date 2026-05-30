/**
 * Central SEO config. Single source of truth for site-wide metadata.
 * Override the URL per-environment with NEXT_PUBLIC_SITE_URL.
 */
export const siteConfig = {
  name: 'Blog',
  title: 'Blog — downtime & inspiration',
  description: 'Personal blog for downtime & inspiration. Posts, series, and a 3D terminal cube.',
  // No trailing slash. Falls back to localhost in dev.
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  author: 'xs1128',
  locale: 'en_US',
  // Default share image. Drop a 1200x630 PNG at /public/og-default.png.
  ogImage: '/og-default.png',
} as const

/** Build an absolute URL from a path. OG/canonical tags need absolute URLs.
 *  Already-absolute URLs (e.g. Supabase storage) pass through untouched. */
export function absoluteUrl(path = ''): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`
}
