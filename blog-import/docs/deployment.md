# Deployment & Debugging

## Deployment Considerations

- **Environment variables**: Set in hosting platform (Vercel, Netlify, etc.)
- **Supabase**: Ensure RLS policies are correctly configured
- **Build verification**: Always test production build before deploying
- **Storage**: Configure Supabase storage bucket for images if using file uploads

## On-Demand Revalidation

Pages set `revalidate = 3600`, so CMS edits can take an hour to appear.
`POST /api/revalidate` purges every page immediately via
`revalidatePath('/', 'layout')`.

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
