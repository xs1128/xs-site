# Blog Post Pages

## Overview

Individual blog post pages are fully implemented at `/posts/[slug]` with markdown rendering, syntax highlighting, and series navigation.

## Key Components

### `src/app/posts/[slug]/page.tsx` - Server Component

Fetches post data:

```typescript
// Fetches post with series, headings, and related posts
const post = await getPostBySlug(params.slug)
const seriesData = await getSeriesForPost(post.id)
const headings = extractHeadings(post.content)
const relatedPosts = await getRelatedPosts(post.id)
```

### `src/app/posts/[slug]/post-detail-client.tsx` - Client Component

Handles interactivity:
- Reading progress bar (bottom of screen)
- Scroll-based footer detection
- Series navigation (previous/next)
- Table of contents highlighting

### `src/components/blog/PostContent.tsx` - Markdown Renderer

Features:
- `react-markdown` with `remark-gfm`
- Syntax highlighting via custom `CodeBlock` component
- Automatic heading ID generation
- Responsive styling with clamp()

## Blog Post Features

### Table of Contents

**Location**: `src/components/blog/TableOfContents.tsx`

Features:
- Auto-generated from markdown headings
- Scroll-based active state tracking
- Smooth scroll to section on click
- Hidden on small screens (< 768px)

### Series Navigation

**Location**: `src/components/blog/SeriesBanner.tsx`

Features:
- Shows series name and description
- Lists all posts in series with current post highlighted
- Click to navigate to other posts in series

### Post Navigation

**Location**: `src/components/blog/PostNavigation.tsx`

Features:
- Previous/next post links
- Series-aware navigation
- Automatic calculation based on series posts

### Syntax Highlighting

**Location**: `src/components/blog/CodeBlock.tsx`

Features:
- Uses custom tokenizer for code detection
- Responsive font sizing
- Copy button functionality
- Language detection from markdown

## Reading Progress

Located in `post-detail-client.tsx`:

```typescript
// Calculate reading progress
const [scrollProgress, setScrollProgress] = useState(0)

useEffect(() => {
  function updateProgress() {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight - windowHeight
    const scrolled = window.scrollY
    const progress = (scrolled / documentHeight) * 100
    setScrollProgress(Math.min(100, Math.max(0, progress)))
  }
  // ... update on scroll
}, [])
```

Displays as orange progress bar at bottom of screen, sticks above footer when visible.

## Loading States & Skeleton Screens

### Overview

The blog implements comprehensive skeleton screens with shimmer loading animation to improve perceived performance during data fetching. React Suspense is used for streaming SSR, allowing pages to render instantly while data loads in the background.

### Shimmer Animation

**Location**: `src/app/globals.css`

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-shimmer {
  background: linear-gradient(90deg, #3E454C 0%, #4A535C 50%, #3E454C 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

### Skeleton Components

**Location**: `src/components/skeleton/`

The skeleton system includes:

1. **SkeletonElement** - Atomic building block for all skeleton shapes
2. **SkeletonText** - Text lines with varying widths (titles, paragraphs)
3. **SkeletonHero** - Large featured image placeholders
4. **SkeletonCard** - Blog/series card placeholders
5. **SkeletonList** - TOC, related posts, tag lists

### React Suspense Integration

**Post Detail Page**: `src/app/posts/[slug]/page.tsx`

```typescript
async function PostDataFetcher({ slug }: { slug: string }) {
  const supabase = await createClient()
  const post = await getPostBySlug(slug)
  // ... fetch related data
  return <PostDetailClient post={post} />
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const emptyPost: Post = { /* empty state */ }

  return (
    <Suspense fallback={<PostDetailClient post={emptyPost} />}>
      <PostDataFetcher slug={slug} />
    </Suspense>
  )
}
```

**Home Page**: `src/app/page.tsx`

```typescript
async function HeroImageFetcher() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'hero_image_url')
    .single()

  return <HomePageClient heroImageUrl={data?.value || ''} />
}

export default function Home() {
  return (
    <Suspense fallback={<HomePageClient heroImageUrl="" />}>
      <HeroImageFetcher />
    </Suspense>
  )
}
```

### Component Loading States

#### PostHero

```typescript
interface PostHeroProps {
  imageUrl: string
  alt?: string
  loading?: boolean
}

export default function PostHero({ imageUrl, alt, loading = false }: PostHeroProps) {
  return (
    <div style={containerStyle}>
      {loading ? <SkeletonHero /> : <img src={imageUrl} alt={alt} />}
    </div>
  )
}
```

#### TableOfContents

Shows skeleton when headings array is empty:

```typescript
if (headings.length === 0) {
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Contents</h3>
      <SkeletonList variant="heading" items={5} />
    </div>
  )
}
```

#### RecentBlogsGrid & FeaturedSeries

```typescript
if (loading) {
  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Recent Blogs</h2>
      <div style={carouselStyle}>
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} variant="blog" />
        ))}
      </div>
    </div>
  )
}
```

### Design System

**Colors** (matching dark theme):
- Base skeleton: `#3E454C` (lighter than `#2A2F35` background)
- Shimmer highlight: `#4A535C` (gradient wave peak)

**Animation**:
- Duration: 1.5s ease-in-out infinite
- Gradient wave moves left to right
- 60fps target for smooth performance

## Other Blog Components

- **BlogPageHeader** - Blog page header with navigation
- **PostHeader** - Post title and metadata display
- **PostHero** - Featured image component
- **TagList** - Post tags display
- **OtherPosts** - Related posts sidebar
- **LeftSidebar** - Left sidebar wrapper
- **FunnyMarquee** - Infinite-scroll marquee
- **FunnyMarqueeWrapper** - Client wrapper for marquee data
- **RecentLogs** - Recent posts list
- **FeaturedSeries** - Featured series display
- **FeaturedSeriesWrapper** - Client wrapper for series data
