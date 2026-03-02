# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A blog with Supabase backend integration, featuring an admin panel for CRUD operations on posts, series, pictures, and site settings. Built with Next.js 16 (App Router), React 19, and Supabase for database, authentication, and storage.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **UI**: React 19
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Plain CSS with inline styles, shared constants in `src/styles/`
- **Fonts**: Hubot Sans (primary), Roboto Mono (code)

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

**CRITICAL**: Always run `npm install` and `npm run build` before pushing. Resolve any TypeScript errors or build warnings.

## Environment Variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Reference: `.env.example` in the project root.

## Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              # Admin panel layout with auth guard
│   │   ├── login/
│   │   │   ├── layout.tsx          # Login page layout (no auth check)
│   │   │   └── page.tsx           # Login form
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── hero/
│   │   │   └── page.tsx           # Hero image settings
│   │   ├── posts/
│   │   │   ├── page.tsx            # Posts list
│   │   │   ├── new/page.tsx        # Create post (with series selection)
│   │   │   └── [id]/edit/page.tsx  # Edit post (with series selection)
│   │   ├── series/
│   │   │   ├── page.tsx            # Series list
│   │   │   ├── new/page.tsx        # Create series
│   │   │   └── [id]/edit/page.tsx  # Edit series
│   │   └── pictures/
│   │       ├── page.tsx            # Pictures list
│   │       ├── new/page.tsx        # Upload picture
│   │       └── [id]/edit/page.tsx  # Edit picture
│   ├── test-supabase/
│   │   └── page.tsx                # Test Supabase connection
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page with dynamic hero image
│   └── globals.css                 # Global styles
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx         # Admin navigation header with user info & logout
│   │   └── SeriesMultiSelect.tsx   # Multi-select dropdown for series
│   ├── blog/
│   │   ├── LeftSidebar.tsx
│   │   ├── FunnyMarquee.tsx        # Infinite-scroll marquee
│   │   ├── FunnyMarqueeWrapper.tsx # Client wrapper for marquee data
│   │   ├── RecentLogs.tsx
│   │   ├── FeaturedSeries.tsx
│   │   └── FeaturedSeriesWrapper.tsx # Client wrapper for series data
│   └── ui/
│       └── AnimatedButton.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client with validation
│   │   ├── server.ts               # Server client with validation
│   │   ├── mutations.ts            # CRUD operations
│   │   ├── queries.ts              # Data fetching queries
│   │   ├── storage.ts              # File upload utilities
│   │   └── settings.ts            # Site settings management (hero image, etc.)
│   ├── mockPosts.ts                # Mock data (legacy)
│   ├── mockSeries.ts               # Mock data (legacy)
│   └── mockPictures.ts             # Mock data (legacy)
├── styles/
│   ├── colors.ts                   # Color constants
│   ├── animations.ts               # Animation timing & transitions
│   └── typography.ts               # Font & spacing constants
├── types/
│   ├── database.ts                 # Supabase generated types
│   └── post.ts                     # Post & Series interfaces
└── proxy.ts                        # API proxy for Next.js
```

## Supabase Database Schema

### Tables

**posts**:
- `id` (primary key)
- `title` (text)
- `slug` (text, unique)
- `content` (text, nullable)
- `excerpt` (text, nullable)
- `published_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**series**:
- `id` (primary key)
- `title` (text)
- `slug` (text, unique)
- `description` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**series_posts** (junction table):
- `id` (primary key)
- `series_id` (foreign key → series.id)
- `post_id` (foreign key → posts.id)
- `order_column` (integer, nullable)

**pictures**:
- `id` (primary key)
- `url` (text)
- `caption` (text, nullable)
- `location` (text, nullable)
- `date_taken` (timestamp, nullable)
- `order_column` (integer, nullable)

### Relationships

- Posts can belong to multiple series (many-to-many via `series_posts`)
- Series can have multiple posts (many-to-many via `series_posts`)
- Relationships are ordered via `order_column`

## Authentication System

### Overview

The admin panel uses Supabase Auth for user authentication. All admin routes except `/admin/login` are protected and require authentication.

### Key Components

**`src/app/admin/layout.tsx`** - Admin authentication guard
- Checks authentication on all admin routes
- Redirects unauthenticated users to `/admin/login`
- Skips auth check for login page (prevents infinite redirect loop)
- Listens for auth state changes (login/logout)
- Displays user info in header via `AdminHeader`

**`src/app/admin/login/page.tsx`** - Login form
- Simple email/password login form
- Redirects to `/admin` on successful login
- Error handling for failed login attempts

**`src/app/admin/login/layout.tsx`** - Login page layout
- Passthrough layout that doesn't check authentication
- Prevents infinite loading loop on login page

**`src/components/admin/AdminHeader.tsx`** - Admin navigation header
- Displays user email
- Logout button with loading state
- Navigation links to admin sections

### Authentication Flow

1. User navigates to any admin route (e.g., `/admin/posts`)
2. `AdminLayout` checks for active session
3. If no session, redirects to `/admin/login`
4. User enters credentials → Supabase Auth validates
5. On success, `AdminLayout` receives auth state change
6. User redirected to `/admin` (dashboard)
7. All subsequent requests include auth token

### Auth State Management

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

### Logout

```typescript
// In AdminHeader
async function handleLogout() {
  setLoading(true)
  const supabase = createClient()
  await supabase.auth.signOut()
  router.push('/admin/login')
}
```

### RLS Policies for Authentication

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

## Site Settings Management

### Overview

Site-wide configuration settings are stored in the `site_settings` table as key-value pairs. This allows dynamic configuration without code changes.

### Table Schema

**site_settings**:
- `id` (primary key)
- `key` (text, unique) - Setting identifier (e.g., 'hero_image_url')
- `value` (text, nullable) - Setting value
- `description` (text, nullable) - Human-readable description
- `updated_at` (timestamp)
- `updated_by` (UUID, nullable) - User who last updated

### Functions

**Located in**: `src/lib/supabase/settings.ts`

```typescript
// Get any site setting by key
const url = await getSiteSetting('hero_image_url')

// Get hero image URL specifically (with fallback)
const heroUrl = await getHeroImageUrl()

// Update or create a site setting
await updateSiteSetting('logo_url', 'https://...', 'Site logo')

// Update hero image URL
await updateHeroImageUrl('https://supabase.storage/...')
```

### Usage Pattern

```typescript
// Fetch setting
const value = await getSiteSetting('setting_key')

// Fallback if setting doesn't exist
return value || 'default_value'

// Update setting (upsert - creates if doesn't exist)
await updateSiteSetting('key', 'value', 'Optional description')
```

## Hero Image Feature

### Overview

The hero image on the landing page is dynamically loaded from the database. Admins can upload a new hero image through the admin panel at `/admin/hero`.

### Workflow

1. Admin navigates to `/admin/hero` (Quick Actions → "Update Hero")
2. Current hero image is displayed
3. Admin selects new image file
4. Preview of new image appears
5. Admin clicks "Update Hero Image"
6. Image is uploaded to Supabase Storage (`blog-images` bucket)
7. Image URL is saved to `site_settings` table (key: `hero_image_url`)
8. Landing page fetches and displays new image on next load

### Files Involved

**Backend**:
- `src/lib/supabase/settings.ts` - Get/update hero URL
- `src/lib/supabase/storage.ts` - Image upload to Supabase Storage

**Admin UI**:
- `src/app/admin/hero/page.tsx` - Hero image upload interface

**Frontend**:
- `src/app/page.tsx` - Landing page with dynamic hero image

### Implementation Details

**Admin Upload Page** (`src/app/admin/hero/page.tsx`):
```typescript
// Load current hero image
useEffect(() => {
  async function loadHeroImage() {
    const url = await getHeroImageUrl()
    setCurrentHeroUrl(url)
  }
  loadHeroImage()
}, [])

// Handle upload
async function handleSubmit(e: React.FormEvent) {
  // Upload to Supabase Storage
  const { url, error } = await uploadImage(file)

  // Save URL to database
  await updateHeroImageUrl(url)

  // Update state
  setCurrentHeroUrl(url)
}
```

**Landing Page** (`src/app/page.tsx`):
```typescript
import { getHeroImageUrl } from "@/lib/supabase/settings"

const [heroImageUrl, setHeroImageUrl] = useState('/IMG_1953.jpeg')

useEffect(() => {
  async function fetchHeroImage() {
    const url = await getHeroImageUrl()
    setHeroImageUrl(url)
  }
  fetchHeroImage()
}, [])

// Use in background
backgroundImage: `url(${heroImageUrl})`
```

### Next.js Image Configuration

Supabase Storage images are configured in `next.config.ts`:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'fopmnlxsudpgsdpaqrzd.supabase.co',
      pathname: '/storage/v1/object/public/**',
    },
  ],
}
```

## Supabase Setup Guide

### Prerequisites

1. Supabase project created
2. Environment variables set in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database Setup

Run these SQL commands in **Supabase SQL Editor** to create all tables:

#### 1. Create Tables

```sql
-- Posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Series table
CREATE TABLE IF NOT EXISTS public.series (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Series-Posts junction table
CREATE TABLE IF NOT EXISTS public.series_posts (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  series_id BIGINT NOT NULL REFERENCES public.series(id) ON DELETE CASCADE,
  post_id BIGINT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  order_column INTEGER,
  UNIQUE(series_id, post_id)
);

-- Pictures table
CREATE TABLE IF NOT EXISTS public.pictures (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT,
  location TEXT,
  date_taken TIMESTAMP WITH TIME ZONE,
  order_column INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_by UUID DEFAULT auth.uid()
);

-- Insert default hero image setting
INSERT INTO public.site_settings (key, value, description)
VALUES (
  'hero_image_url',
  '/IMG_1953.jpeg',
  'URL of the hero image displayed on the landing page'
)
ON CONFLICT (key) DO NOTHING;
```

#### 2. Enable Row Level Security

```sql
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pictures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
```

#### 3. Create RLS Policies

**Posts Table**:
```sql
CREATE POLICY "Authenticated users can view posts"
ON posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert posts"
ON posts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update posts"
ON posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete posts"
ON posts FOR DELETE TO authenticated USING (true);
```

**Series Table**:
```sql
CREATE POLICY "Authenticated users can view series"
ON series FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert series"
ON series FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update series"
ON series FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete series"
ON series FOR DELETE TO authenticated USING (true);
```

**Series Posts Junction Table**:
```sql
CREATE POLICY "Authenticated users can view series_posts"
ON series_posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert series_posts"
ON series_posts FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update series_posts"
ON series_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete series_posts"
ON series_posts FOR DELETE TO authenticated USING (true);
```

**Pictures Table**:
```sql
CREATE POLICY "Authenticated users can view pictures"
ON pictures FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert pictures"
ON pictures FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update pictures"
ON pictures FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pictures"
ON pictures FOR DELETE TO authenticated USING (true);
```

**Site Settings Table**:
```sql
-- Authenticated users can modify settings
CREATE POLICY "Authenticated users can view site settings"
ON site_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update site settings"
ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can insert site settings"
ON site_settings FOR INSERT TO authenticated WITH CHECK (true);

-- Public can view settings (for landing page hero image)
CREATE POLICY "Public can view site settings"
ON site_settings FOR SELECT TO public USING (true);
```

### Storage Setup

#### 1. Create Storage Bucket

In **Supabase Dashboard → Storage**:

1. Create a new bucket named `blog-images`
2. Make it **Public** (uncheck "Private bucket")
3. Configure allowed file types: `image/*`
4. Set file size limit (e.g., 5MB)

#### 2. Storage RLS Policies

In **Supabase Dashboard → Storage → blog-images → Policies**:

```sql
-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Authenticated users can view images
CREATE POLICY "Authenticated users can view images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'blog-images');

-- Public can view images (for landing page)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'blog-images');
```

### Authentication Setup

#### 1. Enable Auth

In **Supabase Dashboard → Authentication**:

1. Ensure Email/Password provider is enabled
2. Optionally disable email confirmation (for development)

#### 2. Create Admin User

In **Supabase Dashboard → Authentication → Users**:

1. Click "Add user" → "Create new user"
2. Enter email and password
3. Set "Auto Confirm User" to true

Or use SQL:
```sql
-- This will create a user - they'll need to reset password
INSERT INTO auth.users (email, email_confirmed_at)
VALUES ('admin@example.com', now());
```

### Verify Setup

1. **Database tables exist**:
   ```sql
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

2. **RLS policies enabled**:
   ```sql
   SELECT tablename, policyname
   FROM pg_policies
   WHERE schemaname = 'public';
   ```

3. **Test connection**: Navigate to `/test-supabase` (if exists)

4. **Test login**: Navigate to `/admin/login` and enter credentials

## Supabase Client Usage

### Client-Side (Browser)

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true)
```

### Server-Side (Server Components)

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()
const { data, error } = await supabase
  .from('posts')
  .select('*')
```

## CRUD Operations

### Posts

Located in: `src/lib/supabase/mutations.ts`

```typescript
import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
  getAllPosts,
} from '@/lib/supabase/mutations'

// Create post with series relationships
const { data: postData } = await createPost({
  title: 'My Post',
  slug: 'my-post',
  content: 'Post content',
  excerpt: 'Summary',
  published_at: new Date().toISOString(),
})

// Save series relationships
await savePostSeries(postData.id, [1, 2, 3])
```

### Series

```typescript
import {
  createSeries,
  updateSeries,
  deleteSeries,
  getSeriesById,
  getAllSeries,
} from '@/lib/supabase/mutations'

// Create series
const { data } = await createSeries({
  title: 'My Series',
  slug: 'my-series',
  description: 'Series description',
})
```

### Series-Post Relationships

```typescript
import {
  getSeriesForPost,
  savePostSeries,
  addPostToSeries,
  removePostFromSeries,
} from '@/lib/supabase/mutations'

// Get all series for a post
const { data: postSeries } = await getSeriesForPost(postId)

// Save/update post's series (replaces existing)
await savePostSeries(postId, [1, 2, 3])

// Add post to specific series
await addPostToSeries(seriesId, postId, 0)
```

## Admin Panel Components

### SeriesMultiSelect

Reusable multi-select dropdown for choosing series.

**Location**: `src/components/admin/SeriesMultiSelect.tsx`

**Usage**:
```typescript
import SeriesMultiSelect from '@/components/admin/SeriesMultiSelect'

<SeriesMultiSelect
  availableSeries={seriesList}
  selectedSeriesIds={selectedIds}
  onChange={setSelectedIds}
  disabled={loading}
/>
```

**Features**:
- Dropdown with checkboxes
- Selected items shown as tags
- Click-outside to close
- Disabled state support
- Dark theme styling

## Architecture Patterns

### Error Handling

All admin pages follow this error handling pattern:

```typescript
const [error, setError] = useState('')

// Display error
{error && <div style={errorStyle}>{error}</div>}

// Handle operation errors
if (error) {
  setError('Operation failed: ' + error.message)
  setLoading(false)
  return
}
```

### Loading States

Always use loading states for async operations:

```typescript
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [deleting, setDeleting] = useState(false)

// Disable interactions during operations
<button disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
```

### ID Validation

Always validate IDs before database calls:

```typescript
const postId = parseInt(id)

if (isNaN(postId)) {
  console.error('Invalid ID:', id)
  setNotFound(true)
  return
}
```

### Slug Generation

Use the improved slug generation with validation:

```typescript
function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!slug) {
    throw new Error('Please enter a valid title')
  }

  return slug
}
```

## Shared Styling Constants

**Always use shared constants instead of hardcoded values**:

```typescript
import { FONTS, clamp, spacing } from "@/styles/typography";
import { TRANSITIONS } from "@/styles/animations";
import { colors } from "@/styles/colors";

// Good
const style = {
  fontFamily: FONTS.primary,
  fontSize: clamp.base,
  padding: spacing.md,
  color: colors.accent,
};

// Bad
const style = {
  fontFamily: "'Hubot Sans', sans-serif",
  fontSize: "clamp(12px, 1.8vw, 18px)",
  padding: "clamp(12px, 2vh, 24px)",
  color: "#E5532C",
};
```

### Available Constants

**`src/styles/colors.ts`**:
- `colors.accent` - `#E5532C`
- `colors.darkBackground` - `#2A2F35`
- And all other project colors

**`src/styles/typography.ts`**:
- `FONTS.primary` - `'Hubot Sans', sans-serif`
- `FONTS.mono` - `'Roboto Mono', monospace`
- `clamp.xs` through `clamp.3xl` - Responsive font sizes
- `spacing.xs` through `spacing.lg` - Responsive spacing

**`src/styles/animations.ts`**:
- `TIMING.smooth` - Smooth cubic-bezier
- `TRANSITIONS.marqueeExpand` - Marquee hover expansion
- `TRANSITIONS.slower(property)` - 0.8s transition helper

## Admin Panel Styling

Admin pages use inline styles with these common patterns:

```typescript
// Form groups
const formGroupStyle: React.CSSProperties = {
  marginBottom: 'clamp(16px, 3vh, 24px)',
}

// Labels
const labelStyle: React.CSSProperties = {
  fontFamily: 'Hubot Sans, sans-serif',
  fontSize: 'clamp(12px, 1.8vw, 14px)',
  fontWeight: 600,
  color: '#CCCCCC',
  display: 'block',
  marginBottom: 'clamp(6px, 1vh, 8px)',
}

// Inputs
const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'Hubot Sans, sans-serif',
  fontSize: 'clamp(12px, 1.8vw, 14px)',
  color: '#FFFFFF',
  backgroundColor: '#2A2F35',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  padding: 'clamp(8px, 1.5vh, 12px)',
}

// Error messages
const errorStyle: React.CSSProperties = {
  fontFamily: 'Hubot Sans, sans-serif',
  fontSize: 'clamp(12px, 1.8vw, 14px)',
  color: '#FF6B6B',
  padding: 'clamp(8px, 1.5vh, 12px)',
  backgroundColor: 'rgba(255, 107, 107, 0.1)',
  borderRadius: '4px',
}
```

## Code Quality Standards

1. **TypeScript Strict Mode**: Always enabled
2. **ESLint**: Follow Next.js recommended config
3. **No Unused Imports**: Remove all unused imports
4. **No Unused Variables**: Remove dead code before committing
5. **Component Organization**: One component per file
6. **Naming Conventions**:
   - Components: PascalCase (`SeriesMultiSelect.tsx`)
   - Utilities: camelCase (`mutations.ts`)
   - Hooks: camelCase with `use` prefix (`useReadingProgress.ts`)
   - Types: PascalCase (`Series`)
   - Constants: UPPER_SNAKE_CASE for values (`API_URL`)

## Testing Checklist

Before pushing changes:

1. **Run build**: `npm run build` must succeed with no errors
2. **Check console**: No errors or warnings in browser console
3. **Test CRUD operations**:
   - Create post with series
   - Edit post and change series
   - Delete post
   - Create/edit/delete series
   - Upload/edit/delete pictures
4. **Check admin panel**: All pages load without errors
5. **Test frontend**: Blog components display Supabase data correctly
6. **Verify relationships**: Posts show up in correct series
7. **Check types**: No TypeScript errors

## Common Tasks

### Adding a New Field to Post Model

1. Update database schema in Supabase
2. Update `PostInput` interface in `src/lib/supabase/mutations.ts`
3. Update post forms in `src/app/admin/posts/new/page.tsx` and edit page
4. Update `Post` type in `src/types/post.ts` if needed

### Adding a New Admin Section

1. Create folder in `src/app/admin/[section-name]/`
2. Add `page.tsx` for list view
3. Add `new/page.tsx` for create form
4. Add `[id]/edit/page.tsx` for edit form
5. Add CRUD functions to `src/lib/supabase/mutations.ts`
6. Add link to `AdminHeader.tsx`

### Debugging Supabase Issues

1. Check environment variables in `.env.local`
2. Verify RLS policies in Supabase dashboard
3. Check browser console for errors
4. Use `src/app/test-supabase/page.tsx` to test connection
5. Check Supabase logs in dashboard

## Current Limitations / Future Work

### Not Yet Implemented
- Individual blog post pages (`/posts/[slug]`)
- Markdown/MDX processing
- Syntax highlighting for code blocks
- Reading progress tracker
- Sidebar with table of contents
- Full-screen navigation menu
- Search functionality
- RSS feed
- Comment system
- Post ordering within series (UI)
- Image optimization with Next.js Image component

### Technical Debt
- Large component files (admin pages at 300+ lines)
- Inline styles could be further extracted to constants
- No custom hooks for complex logic
- No comprehensive error boundary handling

## Deployment Considerations

- **Environment variables**: Set in hosting platform (Vercel, Netlify, etc.)
- **Supabase**: Ensure RLS policies are correctly configured
- **Build verification**: Always test production build before deploying
- **Storage**: Configure Supabase storage bucket for images if using file uploads

## Debugging Tips

### Admin Panel Issues

1. Check if user is authenticated (if auth is added)
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
