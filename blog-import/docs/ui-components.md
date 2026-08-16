# UI Components

## Footer Component

### Overview

Responsive footer with profile section, navigation links, and social media icons.

**Location**: `src/components/ui/Footer.tsx`

### Features

**Responsive Behavior**:
- Desktop (≥550px): Horizontal layout with 3 sections
- Mobile (<550px): Vertical stacking with centered sections
- Divider only shows on desktop

**Sections**:
1. **Profile** (27% width on desktop):
   - Avatar image (loaded from Supabase or fallback)
   - Name: "xs"
   - Tagline: "Building things for the web"

2. **Links** (23% width on desktop):
   - Main Site (www.xsooi.com)
   - Projects (projects.xsooi.com)
   - Contact me link
   - Diagonal arrow icons on hover

3. **Social** (27% width on desktop):
   - Email display: "hi@xsooi.com"
   - Social buttons: GitHub, LinkedIn, Facebook, Instagram
   - Circular buttons with hover effects

### Implementation Details

```typescript
// Avatar management
const [avatarUrl, setAvatarUrl] = useState<string>('')
useEffect(() => {
  async function loadAvatar() {
    const url = await getAvatarUrl()
    setAvatarUrl(url || 'https://...default-avatar.jpeg')
  }
  loadAvatar()
}, [])
```

### Avatar Management

Admin can upload avatar at `/admin/avatar`:
- Image uploaded to Supabase Storage (`blog-images` bucket)
- URL saved to `site_settings` table (key: `avatar_url`)
- Fallback to default if not set

## Home Page Layout

### Centering Approach

The home page uses flexbox centering (matching main site approach):

```typescript
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  alignItems: "center", // Centers content horizontally
}

const mainStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", // Centers content vertically
  alignItems: "center", // Centers content horizontally
  width: "100%",
}

const cardContainerStyle = {
  width: isExpanded ? "100vw" : "clamp(300px, 90vw, 1100px)",
  // Positioned absolutely with left: 50% and transform: translateX(-50%)
}
```

**Key Changes**:
- Removed `minWidth: "1000px"` constraint that caused cutoff
- Added `alignItems: "center"` to container for proper flexbox centering
- Card width uses `90vw` for better responsiveness
- Content flows naturally based on viewport width

## FullScreenNav

**Location**: `src/components/ui/FullScreenNav.tsx`

Full-screen navigation overlay for mobile and desktop.

## AnimatedButton

**Location**: `src/components/ui/AnimatedButton.tsx`

Animated button component with hover effects.

## Skeleton Components

**Location**: `src/components/skeleton/`

A comprehensive system of skeleton loading components with shimmer animation for improved perceived performance.

### SkeletonElement

The atomic building block for all skeleton shapes.

**Props**:
```typescript
interface SkeletonElementProps {
  width?: string | number
  height?: string | number
  variant?: 'text' | 'circular' | 'rectangular'
  className?: string
  style?: React.CSSProperties
}
```

**Usage**:
```typescript
<SkeletonElement width="100%" height={20} variant="text" />
<SkeletonElement width={40} height={40} variant="circular" />
```

### SkeletonText

Simulates text content with multiple lines of varying widths.

**Props**:
```typescript
interface SkeletonTextProps {
  lines?: number
  width?: string | string[]  // Array for varying widths per line
  height?: string
  className?: string
}
```

**Usage**:
```typescript
// Uniform width
<SkeletonText lines={3} width="100%" />

// Varying widths (e.g., title + metadata)
<SkeletonText lines={3} width={['80%', '60%', '40%']} />
```

### SkeletonHero

Large featured image placeholders.

**Props**:
```typescript
interface SkeletonHeroProps {
  width?: string | number
  height?: string | number
  className?: string
}
```

**Usage**:
```typescript
<SkeletonHero width="100%" height={280} />
```

### SkeletonCard

Blog/series card placeholders matching actual card dimensions.

**Props**:
```typescript
interface SkeletonCardProps {
  variant?: 'blog' | 'series' | 'post'
  showImage?: boolean
  className?: string
}
```

**Variants**:
- `blog`: Image area (60% height) + title bar (40%)
- `series`: Title + description + post preview lines
- `post`: Title + metadata + excerpt lines

**Usage**:
```typescript
<SkeletonCard variant="blog" />
<SkeletonCard variant="series" />
```

### SkeletonList

List placeholders for TOC, related posts, tags.

**Props**:
```typescript
interface SkeletonListProps {
  items?: number
  variant?: 'heading' | 'post' | 'tag'
  className?: string
}
```

**Variants**:
- `heading`: Indented heading lines (TOC)
- `post`: Title + metadata lines (related posts)
- `tag`: Pill-shaped tag placeholders

**Usage**:
```typescript
<SkeletonList variant="heading" items={5} />
<SkeletonList variant="tag" items={6} />
```

### Design System

**Colors**:
- Base: `#3E454C`
- Shimmer: `#4A535C`

**Animation**: 1.5s shimmer (gradient wave left to right)

### Integration Pattern

```typescript
// 1. Add loading prop to component
interface ComponentProps {
  loading?: boolean
  // ... other props
}

// 2. Render skeleton when loading
export default function MyComponent({ loading, data }: ComponentProps) {
  if (loading) {
    return <SkeletonText lines={3} />
  }

  return <div>{data}</div>
}
```
