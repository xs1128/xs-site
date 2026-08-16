/**
 * SEO config for the blog segment. NEXT_PUBLIC_SITE_URL is the site root
 * (no /blog) — blog paths carry their own prefix.
 */
export const siteConfig = {
  name: 'Blog',
  title: 'Blog | downtime & inspiration',
  description:
    'Personal blog for downtime & inspiration. Posts, series, and a 3D terminal cube.',
  // No trailing slash. Falls back to localhost in dev.
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
    /\/$/,
    '',
  ),
  basePath: '/blog',
  author: 'xs1128',
  locale: 'en_US',
  ogImage: '/blog/og-default.png',
} as const;

/** Absolute URL from a site-root-relative path. Absolute URLs pass through. */
export function absoluteUrl(path = ''): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Absolute URL from a blog-relative path: blogUrl('/posts/x') -> .../blog/posts/x */
export function blogUrl(path = ''): string {
  const suffix = path === '/' ? '' : path;
  return absoluteUrl(
    `${siteConfig.basePath}${suffix.startsWith('/') || !suffix ? suffix : `/${suffix}`}`,
  );
}
