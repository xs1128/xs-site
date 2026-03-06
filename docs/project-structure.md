# Project Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              # Admin panel layout with auth guard
│   │   ├── login/
│   │   │   ├── layout.tsx          # Login page layout (no auth check)
│   │   │   └── page.tsx           # Login form
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── avatar/
│   │   │   └── page.tsx           # Avatar management page
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
│   ├── posts/
│   │   └── [slug]/
│   │       ├── page.tsx            # Blog post server component
│   │       ├── post-detail-client.tsx # Blog post client component
│   │       └── not-found.tsx       # Blog post 404 page
│   ├── test-supabase/
│   │   └── page.tsx                # Test Supabase connection
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page with dynamic hero image
│   ├── home-client.tsx             # Landing page client component
│   └── globals.css                 # Global styles
├── components/
│   ├── admin/
│   │   ├── AdminHeader.tsx         # Admin navigation header with user info & logout
│   │   └── SeriesMultiSelect.tsx   # Multi-select dropdown for series
│   ├── blog/
│   │   ├── BlogPageHeader.tsx      # Blog page header with navigation
│   │   ├── PostHeader.tsx          # Post title and metadata display
│   │   ├── PostHero.tsx            # Featured image component
│   │   ├── PostContent.tsx         # Markdown content with syntax highlighting
│   │   ├── CodeBlock.tsx           # Syntax highlighted code blocks
│   │   ├── TableOfContents.tsx     # Sidebar TOC with scroll tracking
│   │   ├── TagList.tsx             # Post tags display
│   │   ├── SeriesBanner.tsx        # Series navigation banner
│   │   ├── PostNavigation.tsx      # Previous/next post navigation
│   │   ├── OtherPosts.tsx          # Related posts sidebar
│   │   ├── LeftSidebar.tsx         # Left sidebar wrapper
│   │   ├── FunnyMarquee.tsx        # Infinite-scroll marquee
│   │   ├── FunnyMarqueeWrapper.tsx # Client wrapper for marquee data
│   │   ├── RecentLogs.tsx          # Recent posts list
│   │   ├── FeaturedSeries.tsx      # Featured series display
│   │   └── FeaturedSeriesWrapper.tsx # Client wrapper for series data
│   └── ui/
│       ├── Footer.tsx              # Responsive footer with profile, links, social
│       ├── FullScreenNav.tsx       # Full-screen navigation overlay
│       └── AnimatedButton.tsx     # Animated button component
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client with validation
│   │   ├── server.ts               # Server client with validation
│   │   ├── mutations.ts            # CRUD operations
│   │   ├── queries.ts              # Data fetching queries
│   │   ├── storage.ts              # File upload utilities
│   │   └── settings.ts            # Site settings management (hero, avatar, etc.)
│   ├── utils/
│   │   └── post.ts                 # Post utility functions (slug, date formatting)
│   ├── mockPosts.ts                # Mock data (legacy)
│   ├── mockSeries.ts               # Mock data (legacy)
│   └── mockPictures.ts             # Mock data (legacy)
├── styles/
│   ├── breakpoints.ts              # Standardized breakpoint definitions
│   ├── colors.ts                   # Color constants
│   ├── animations.ts               # Animation timing & transitions
│   ├── typography.ts               # Font & spacing constants
│   ├── blog.css                    # Blog component styles
│   └── admin.css                   # Admin panel styles
├── hooks/
│   ├── useBreakpoint.ts            # Custom breakpoint detection hook
│   ├── useScrollDetection.ts       # Scroll progress & footer visibility hooks
│   └── useActiveHeading.ts         # Active heading tracking for TOC
├── types/
│   ├── database.ts                 # Supabase generated types
│   └── post.ts                     # Post & Series interfaces
└── proxy.ts                        # API proxy for Next.js
```

## Key Directories

- **`app/admin/`** - Admin panel routes with authentication guard
- **`app/posts/[slug]/`** - Blog post pages with markdown rendering
- **`components/blog/`** - Reusable blog components (TOC, navigation, etc.)
- **`lib/supabase/`** - Supabase client setup, queries, and mutations
- **`styles/`** - Shared constants and modular CSS files
- **`hooks/`** - Custom React hooks for responsive behavior and scroll tracking
