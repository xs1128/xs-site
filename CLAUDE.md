# Personal Website - Landing Page

## Overview
Minimalist personal landing page with a scrolling announcement bar, centered name display, and navigation buttons.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Language**: TypeScript
- **Styling**: Plain CSS with inline styles
- **Fonts**: Roboto Mono (primary), Hubot Sans (announcements)

## Color Scheme (Vintage Poster Palette - Warm Vermillion Edition)
- Background: `#F2E9D8` (warm aged paper)
- Text: `#2A2F35` (dark charcoal)
- Accent: `#E5532C` (warm vermilion)
- Cards: `#E4D9C2` (light cream)
- Borders: `#D6CBB3` (muted tan)

## Features

### Announcement Marquee (Top Bar)
- Fixed position at top of screen with `z-index: 1000`
- Dark charcoal background (`#2A2F35`) with off-white text (`#F2E9D8`)
- **Infinite scrolling marquee** with dynamic item generation:
  - Automatically calculates required items based on screen width
  - Uses flexbox with 120px gap between items
  - 30s animation duration (translates -50% for seamless loop)
  - **Pause on hover** - stops when mouse is anywhere in the marquee container
- Font: Hubot Sans, 14px, 12px vertical padding
- Text: "Site Under Construction" (configurable)

#### Marquee Implementation Details
```tsx
// Dynamic item calculation based on screen width
const text = "Site Under Construction";
const textWidth = measureText(text);
const gap = 120;
const itemWidth = textWidth + gap;
const itemsNeeded = Math.ceil(screenWidth / itemWidth) * 2 + 4;
```

**CSS Classes:**
- `.marquee-container` - Outer container (handles hover pause)
- `.marquee-content` - Flex container with animation
- `.marquee-item` - Individual text items (flex-shrink: 0)

### Name Display
- Centered "Xinsheng Ooi" on desktop, "xs" on small screens (< 300px)
- Click to toggle between full name and initials with fade animation (0.4s)
- Unselectable text with `user-select: none`
- Prevents clicks during fade transition
- Responsive sizing: `clamp(65px, 10vw, 180px)` desktop, `clamp(48px, 15vw, 120px)` mobile
- Font: Roboto Mono, weight 570, letter spacing -0.06em, line height 0.95

### Navigation
- **Desktop**: ABOUT (bottom left) and CONTACT (bottom right) buttons
- **Small screens**: Hamburger menu with dropdown (top right, positioned below marquee)
- Animated underline on hover (left-to-right for ABOUT, right-to-left for CONTACT)
- Underline: 2px height, vermilion color, 0.3s ease transition

### AnimatedButton Component
Reusable button with hover underline effect:
- `isMenuButton`: Menu toggle (rounded, with shadow)
- `isDropdownItem`: Dropdown menu items (no border radius)
- `reverse`: Animates underline from right instead of left

### Responsive Behavior
- Breakpoint: 300px (for ultra-small screens)
- Adjusts padding and font size based on viewport
- Hamburger menu positioned at 56px from top (accounts for marquee height)
- Hides bottom buttons on small screens, shows hamburger menu instead

## File Structure
```
src/app/
├── layout.tsx         # Root layout with font imports (Roboto Mono, Hubot Sans)
├── page.tsx           # Main landing page component with marquee
└── globals.css        # Global styles and font imports
```

## Development Notes
- Client component with "use client" directive
- `suppressHydrationWarning` on body to prevent browser extension warnings
- All styling uses inline styles (no CSS framework)
- Font weights: Roboto Mono (400, 500), Hubot Sans (400)
- Marquee uses dynamic DOM measurement to calculate required items
- Animation CSS injected via `useEffect` for marquee keyframes

