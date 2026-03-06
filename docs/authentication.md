# Authentication System

## Overview

The admin panel uses Supabase Auth for user authentication. All admin routes except `/admin/login` are protected and require authentication.

## Key Components

### `src/app/admin/layout.tsx` - Admin Authentication Guard

- Checks authentication on all admin routes
- Redirects unauthenticated users to `/admin/login`
- Skips auth check for login page (prevents infinite redirect loop)
- Listens for auth state changes (login/logout)
- Displays user info in header via `AdminHeader`

### `src/app/admin/login/page.tsx` - Login Form

- Simple email/password login form
- Redirects to `/admin` on successful login
- Error handling for failed login attempts

### `src/app/admin/login/layout.tsx` - Login Page Layout

- Passthrough layout that doesn't check authentication
- Prevents infinite loading loop on login page

### `src/components/admin/AdminHeader.tsx` - Admin Navigation Header

- Displays user email
- Logout button with loading state
- Navigation links to admin sections

## Authentication Flow

1. User navigates to any admin route (e.g., `/admin/posts`)
2. `AdminLayout` checks for active session
3. If no session, redirects to `/admin/login`
4. User enters credentials → Supabase Auth validates
5. On success, `AdminLayout` receives auth state change
6. User redirected to `/admin` (dashboard)
7. All subsequent requests include auth token

## Auth State Management

```typescript
// In AdminLayout
const [user, setUser] = useState<User | null>(null)

// Listen for auth changes
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (_event, session) => {
    if (session?.user) {
      setUser(session.user)
      setLoading(false)
    } else {
      setUser(null)
      router.push('/admin/login')
    }
  }
)
```

## Logout

```typescript
// In AdminHeader
async function handleLogout() {
  setLoading(true)
  const supabase = createClient()
  await supabase.auth.signOut()
  router.push('/admin/login')
}
```

## RLS Policies for Authentication

All tables (posts, series, series_posts, pictures) have RLS policies that require authentication:

```sql
-- Authenticated users can perform all operations
CREATE POLICY "Authenticated users can insert posts"
ON posts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
ON posts FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete posts"
ON posts FOR DELETE TO authenticated USING (true);

-- Similar policies for series, series_posts, pictures
```
