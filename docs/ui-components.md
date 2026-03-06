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
   - Main Site (me.xsooi.com)
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
