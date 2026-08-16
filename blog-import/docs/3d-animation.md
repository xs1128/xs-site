# 3D Animation Feature

## Overview

The blog features an interactive 3D terminal cube built with React Three Fiber that displays real-time blog statistics on its six faces.

## Tech Stack

- **Three.js** (`three@^0.183.2`) - Core 3D graphics library
- **React Three Fiber** (`@react-three/fiber@^9.5.0`) - React renderer for Three.js
- **React Three Drei** (`@react-three/drei@^10.7.7`) - Helper components and abstractions

## Component Structure

```
src/components/blog/
├── ThreeDCanvas.tsx              # Canvas wrapper and layout
└── scene/
    ├── InteractiveScene.tsx      # Main 3D scene (lighting, particles, controls)
    ├── TerminalCube.tsx          # The cube component
    ├── useTerminalStats.ts       # Data fetching hook
    └── createFaceTexture.ts      # Canvas texture helper
```

## Components

### ThreeDCanvas.tsx

**Purpose**: Wrapper component that manages layout, responsiveness, and canvas initialization.

**Key Features**:
- Uses `useIsMobile()` hook for responsive camera positioning
- Maintains flex layout to fill available space
- Handles border styling (all sides on desktop, no left border on mobile)
- Vintage yellow background (`colors.background`)

**Props**:
```typescript
interface ThreeDCanvasProps {
  isSmallScreen?: boolean;
}
```

### InteractiveScene.tsx

**Purpose**: Main 3D scene with lighting, background elements, and camera controls.

**Elements**:
- **Background**: Solid vintage yellow color
- **Background Particles**: 50 floating octahedrons with gentle animations
- **Lighting**: Multi-source setup for room effect
  - Ambient light for overall illumination
  - Directional light from above (main light source)
  - Point lights for fill and accent
  - Hemisphere light for soft ambient fill
- **OrbitControls**: Camera controls for user interaction
  - Drag to rotate view
  - Scroll/pinch to zoom (min: 3, max: 10)
  - No pan (disabled)

**Usage**:
```tsx
<InteractiveScene />
```

### TerminalCube.tsx

**Purpose**: The main 3D cube displaying blog stats on all six faces.

**Features**:
- Auto-rotates on Y axis when not interacting
- Smooth rotation with `useFrame()` hook
- Six faces with different content
- Canvas textures created programmatically

**Faces** (in order: right, left, top, bottom, front, back):
1. **POSTS** - Total post count (real data)
2. **CATEGORIES** - Series/category count (real data)
3. **LAST UPDATE** - Most recent post date (real data)
4. **PICTURES** - Picture count (real data)
5. **VISITS** - All-time GoatCounter total (real data, `—` when unavailable)
6. **© [YEAR] / BLOG v1.0** - Copyright and version (dynamic/static)

**Props**:
```typescript
interface TerminalCubeProps {
  stats: TerminalStats;
}
```

**TerminalStats Interface**:
```typescript
interface TerminalStats {
  postCount: number;
  categoryCount: number;
  lastUpdate: string;
  pictureCount: number;
  totalViews: number | null;
  isLoading: boolean;
}
```

### useTerminalStats.ts

**Purpose**: Custom hook that fetches blog statistics from Supabase.

**Queries**:
- Posts count from `posts` table
- Categories count from `series` table
- Latest post date from `posts` table
- Pictures count from `pictures` table
- Visit total from `/blog/api/visits`, which proxies GoatCounter's `TOTAL.json`

**Usage**:
```tsx
const stats = useTerminalStats();
// Returns: { postCount, categoryCount, lastUpdate, pictureCount, totalViews, isLoading }
```

### createFaceTexture.ts

**Purpose**: Helper function that creates HTML5 canvas textures for cube faces.

**Function**:
```typescript
function createFaceTexture(config: FaceTextConfig): THREE.CanvasTexture

interface FaceTextConfig {
  mainText: string;      // Top text (e.g., "POSTS")
  valueText?: string;    // Center large text (e.g., "42")
  subtext?: string;      // Bottom text (e.g., "BLOG v1.0")
}
```

**Style**:
- Canvas size: 512x512 pixels (crisp text)
- Background: Black (#000000)
- Text color: Terminal green (#00FF00)
- Font: Roboto Mono (monospace)
- Glow effect: Canvas shadow blur

## Responsive Behavior

### Desktop (width ≥ 480px)
- 3D canvas appears to the right of Categories section
- Grid layout: Categories (30%), 3D Canvas (70%)
- Left border visible
- All borders visible (top, right, bottom, left)

### Mobile (width < 480px)
- 3D canvas appears above Categories section
- Stacked vertical layout (100% width each)
- No left border (full width)
- Camera positioned further back (z: 5 vs 4)

## Styling

### Colors
- **Background**: `colors.background` (#F2E9D8) - vintage yellow/cream
- **Cube faces**: Black (#000000)
- **Text**: Terminal green (#00FF00)
- **Particles**: Accent color with transparency
- **Borders**: rgba(0, 0, 0, 0.08)

### Border Styling
```tsx
borderTop: "1px solid rgba(0, 0, 0, 0.08)"
borderRight: "1px solid rgba(0, 0, 0, 0.08)"
borderBottom: "1px solid rgba(0, 0, 0, 0.08)"
borderLeft: isSmallScreen ? "none" : "1px solid rgba(0, 0, 0, 0.08)"
```

## Integration Points

### BlogExpandedContent.tsx

The 3D canvas is integrated into `BlogExpandedContent`:

```tsx
{/* Mobile: 3D Animation Section first, Desktop: Categories first */}
{isSmallScreen && <ThreeDCanvas isSmallScreen={isSmallScreen} />}

{/* Featured Series Section */}
<div style={sectionStyle}>
  <h2 style={headerStyle}>Categories</h2>
  <div style={contentStyle}>
    <SeriesGrid isSmallScreen={isSmallScreen} />
  </div>
</div>

{/* Desktop: 3D Animation Section second */}
{!isSmallScreen && <ThreeDCanvas isSmallScreen={isSmallScreen} />}
```

## Performance Considerations

- **Textures**: Created once on mount, memoized to prevent recreation
- **Canvas Size**: 512x512 for crisp text without excessive memory
- **Cleanup**: Textures disposed on unmount
- **Animation**: Uses R3F's optimized `useFrame()` hook
- **Data Fetching**: Supabase queries run once on mount
- **Resize Handling**: Efficient camera aspect ratio updates

## Future Enhancements

- Add more complex 3D objects/models (GLTFLoader)
- Implement post-processing effects (bloom, depth of field)
- Add particle systems around the cube
- Custom shaders for advanced visual effects
- Click face to navigate to related pages
- Add sound effects on rotation
- Performance optimization (LOD, instancing for many cubes)

## Troubleshooting

### Cube Not Visible
- Check browser console for WebGL errors
- Verify Three.js dependencies are installed
- Ensure Canvas size is not zero (flex parent with minHeight: 0)

### Text Not Appearing
- Verify `useTerminalStats` is fetching data correctly
- Check canvas texture creation (see console for errors)
- Ensure font (Roboto Mono) is loaded

### Performance Issues
- Reduce particle count (currently 50)
- Decrease canvas texture resolution
- Simplify lighting setup
- Check for memory leaks (texture disposal)

### Data Not Loading
- Verify Supabase connection in `useTerminalStats.ts`
- Check table names and permissions
- Inspect browser network tab for failed queries

## Dependencies

Install required packages:
```bash
npm install three@^0.183.2 @react-three/fiber@^9.5.0 @react-three/drei@^10.7.7
```

TypeScript types are included with these packages.
