# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A blog with Supabase backend integration, featuring an admin panel for CRUD operations on posts, series, and pictures. Built with Next.js 16 (App Router), React 19, and Supabase for database and authentication.

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
│   │   ├── layout.tsx              # Admin panel layout
│   │   ├── page.tsx                # Admin dashboard
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
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Global styles
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx         # Admin navigation header
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
│   │   └── storage.ts              # File upload utilities
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
