# Deployment & Debugging

## Deployment Considerations

- **Environment variables**: Set in hosting platform (Vercel, Netlify, etc.)
- **Supabase**: Ensure RLS policies are correctly configured
- **Build verification**: Always test production build before deploying
- **Storage**: Configure Supabase storage bucket for images if using file uploads

### Vercel Preview Builds

The `site` project needs `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` in **Preview** as well as **Production**. GitHub
Actions reads its own repository secrets; a successful CI build does not mean
Vercel has those variables. A variable scoped only to Production is unavailable
to pull-request preview builds.

In Vercel → Project Settings → Environment Variables, enable Preview for both
public Supabase variables using the existing project URL and anonymous client
key. Then redeploy the failed preview. Environment changes apply to new
deployments; the public variables are also embedded in the browser bundle at
build time. Use the anonymous client key that is protected by RLS.

## Public URLs and Security Headers

`NEXT_PUBLIC_SITE_URL` is the site-root origin, shared by the portfolio and blog.
It defaults to `https://www.xsooi.com`; `/blog` is appended by the blog helpers.
Paths and trailing slashes in a configured value are removed, and the apex
`xsooi.com` is normalized to `www.xsooi.com`. Production builds reject HTTP and
localhost origins so local URLs cannot accidentally reach canonical tags,
Open Graph metadata, JSON-LD, robots, or sitemaps.

`next.config.ts` applies these headers to every route, including static assets:

- `Content-Security-Policy`: restricts scripts and connections to this site and
  the configured Supabase/analytics services; blocks framing, embedded objects,
  inline event handlers, and production `eval`.
- `X-Frame-Options: DENY`: framing protection for older browsers.
- `X-Content-Type-Options: nosniff`: prevents MIME type guessing.
- `Referrer-Policy: strict-origin-when-cross-origin`: limits cross-origin
  referrer information to the origin.

The CSP permits inline script blocks for Next.js static/ISR hydration and inline
styles used by the UI. It is a baseline policy, not complete protection against
script injection. A stricter nonce policy would require dynamic rendering;
removing these allowances without changing rendering breaks the site. HTTPS
images remain allowed for externally hosted blog images. Development also
permits `eval` and WebSocket connections for Next.js tooling. Add any new
analytics provider's exact origins before enabling it, and verify a production
build in a browser after policy changes. Vercel supplies HSTS on the hosted site.

Next.js is updated to 16.3.8 and Sharp to 0.35.5, including the fix for the
[critical AVIF image optimization advisory](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4).
On 2026-10-04, `npm audit --omit=dev` reports no high or critical findings and
four remaining moderate findings: `baseline-browser-mapping` and the
Resend → Svix → UUID dependency chain. The full audit also flags development
tools; those remaining dependency findings require separate review.

## On-Demand Revalidation

Pages set `revalidate = 3600`, so CMS edits can take an hour to appear.
`POST /blog/api/revalidate` purges every blog page immediately via
`revalidatePath('/blog', 'layout')`.

Auth: `x-revalidate-secret` header must match `REVALIDATE_SECRET` (timing-safe
compare); anything else returns 401. Body is ignored.

Called by the admin panel's "Refresh Blog" button, which proxies through its own
route so the secret stays server-side. A Supabase Database Webhook sending the
same header also works.

## Debugging Tips

### Admin Panel Issues

1. Check if user is authenticated
2. Verify RLS policies allow operations
3. Check browser console for TypeScript errors
4. Verify Supabase connection using test page

### Database Issues

1. Check Supabase logs in dashboard
2. Verify table names match (lowercase)
3. Check foreign key relationships
4. Ensure RLS policies don't block operations

### Styling Issues

1. Check if using shared constants from `src/styles/`
2. Verify clamp values make sense
3. Check transition timing functions
4. Test responsive behavior on different screen sizes

### Performance Issues

1. Check React DevTools Profiler for excessive re-renders
2. Use `useRef` instead of `useState` for frequently updated values
3. Check Network tab for large bundle sizes
4. Consider code splitting for admin panel

## Current Limitations / Future Work

### Not Yet Implemented

- Search functionality
- RSS feed
- Comment system
- Post ordering within series (UI)
- Image optimization with Next.js Image component for blog images

### Technical Debt

- ~~Large component files (admin pages at 300+ lines)~~ - Partially addressed (Footer 54% reduction)
- ~~Inline styles could be further extracted to constants~~ - Addressed with blog.css, admin.css
- ~~No custom hooks for complex logic~~ - Created useBreakpoint, useScrollDetection, useActiveHeading
- No comprehensive error boundary handling
- Admin pages still use inline styles (future: migrate to admin.css classes)
