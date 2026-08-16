# Supabase Client Usage

## Client-Side (Browser)

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('published', true)
```

## Server-Side (Server Components)

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

// Get avatar URL specifically (with fallback)
const avatarUrl = await getAvatarUrl()

// Update or create a site setting
await updateSiteSetting('logo_url', 'https://...', 'Site logo')

// Update hero image URL
await updateHeroImageUrl('https://supabase.storage/...')

// Update avatar URL
await updateAvatarUrl('https://supabase.storage/...')
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
