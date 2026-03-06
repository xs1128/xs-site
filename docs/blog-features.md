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
