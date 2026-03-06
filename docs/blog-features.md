# Blog Features

## Home Page Layout

The home page (`src/app/home-client.tsx`) features a modern carousel-based blog layout.

### Components

**RecentBlogsGrid** (`src/components/blog/RecentBlogsGrid.tsx`)
- Horizontal carousel of blog post cards
- Arrow navigation (‹ ›) that appears based on scroll position
- Fetches 12 most recent posts with featured images
- Date format: YYYY-MM-DD
- Smooth scrolling with hidden scrollbar

**BlogCard** (`src/components/blog/BlogCard.tsx`)
- Fixed dimensions: 200px × 260px (desktop), 160px × 200px (mobile)
- 70% height for featured image, 30% for title bar
- Left-aligned text with smart word breaking
- Hover: lifts 4px with orange border (#E5532C)

**BlogExpandedContent** (`src/components/blog/BlogExpandedContent.tsx`)
- Container for Categories and 3D Animation sections
- Side-by-side flex layout (50/50 split on desktop)

**SeriesGrid** (`src/components/blog/SeriesGrid.tsx`)
- 4×3 grid of category buttons (12 per page)
- Up/down arrow pagination
- Fetches from Supabase `series` table

**ThreeDAssetPlaceholder** (`src/components/blog/ThreeDAssetPlaceholder.tsx`)
- Empty placeholder for future 3D assets

## Specifications

**Card Dimensions:**
- Desktop: 200px width × 260px height
- Mobile: 160px width × 200px height

**Typography:**
- Title: `clamp(10px, 1.4vw, 14px)`, weight 700
- Metadata: `clamp(8px, 1.1vw, 11px)`, weight 400

**Colors:**
- Card background: `#363D44`
- Title bar: `#1A1D21`
- Accent: `#E5532C`

**Responsive:**
| Feature | Desktop | Mobile |
|---------|---------|--------|
| Card Size | 200×260px | 160×200px |
| Categories | 3×4 grid | 2×N grid |
| Items per page | 12 | 8 |
| Layout | Side-by-side | Stacked |
