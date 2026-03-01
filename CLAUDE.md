# Personal Website - Landing Page

## Overview
Minimalist personal landing page with a scrolling announcement bar, centered name display, navigation buttons, and a full-screen navigation overlay.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with Turbopack
- **UI**: React 19
- **Language**: TypeScript
- **Styling**: Plain CSS with inline styles and CSS-in-JS via useEffect
- **Fonts**: Roboto Mono (primary), Hubot Sans (announcements)

## Color Scheme (Vintage Poster Palette - Warm Vermillion Edition)
- Landing Page Background: `#F2E9D8` (warm aged paper)
- About Section Background: `#2A2F35` (dark charcoal)
- Full-Screen Nav Background: `#363D44` (dark gray)
- Nav Button Panels: `#444C55` (medium gray)
- Text: `#F2E9D8` (warm aged paper - on dark backgrounds)
- Text: `#2A2F35` (dark charcoal - on light backgrounds)
- Accent: `#E5532C` (warm vermilion)
- Cards: `#E4D9C2` (light cream)
- Borders: `#D6CBB3` (muted tan)

## Features

### Two-Section Layout
1. **Landing Section** (100dvh): Warm aged paper background with centered name
2. **About Section** (100dvh): Dark charcoal background with header navigation

### Announcement Marquee (Top Bar)
- Fixed position at top of screen with `z-index: 1000`
- **Dynamic theme switching** based on scroll position:
  - Default (landing section): Dark charcoal background (`#2A2F35`) with off-white text (`#F2E9D8`)
  - Scrolled to about section: Light cream background (`#F2E9D8`) with dark text (`#2A2F35`)
  - Switches at 90% scroll through first section
- **Infinite scrolling marquee** with dynamic item generation:
  - Automatically calculates required items based on screen width
  - Uses flexbox with 120px gap between items
  - 30s animation duration (translates -50% for seamless loop)
  - **Pause on hover** - stops when mouse is anywhere in the marquee container
- Font: Hubot Sans, 14px, 12px vertical padding
- Text: "Site Under Construction"

#### Marquee Implementation Details
```tsx
// Dynamic item calculation based on screen width
const text = "Site Under Construction";
const textWidth = measureText(text);
const gap = 120;
const itemWidth = textWidth + gap;
const itemsNeeded = Math.ceil(screenWidth / itemWidth) * 2 + 4;

// Theme switching based on scroll position
const checkScrollPosition = () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  if (scrollY >= viewportHeight * 0.9) {
    setIsDarkTheme(true); // Light marquee on about section
  } else {
    setIsDarkTheme(false); // Dark marquee on landing
  }
};
```

### Name Display
- Centered "Xinsheng Ooi" on desktop, "xs" on small screens (< 300px)
- Click to toggle between full name and initials with fade animation (0.4s)
- Unselectable text with `user-select: none`
- Prevents clicks during fade transition
- Responsive sizing: `clamp(65px, 10vw, 180px)` desktop, `clamp(48px, 15vw, 120px)` mobile
- Font: Roboto Mono, weight 570, letter spacing -0.06em, line height 0.95

### Full-Screen Navigation Overlay
- Triggered by hamburger menu on small screens and ABOUT button in about section
- **Background**: `#363D44` (dark gray with micro-contrast)
- **Button panels**: `#444C55` with `#D6CBB3` borders (vintage cream outline)
- **Animations**:
  - Slide in from right (0.8s cubic-bezier(0.16, 1, 0.3, 1))
  - Fade-in cascade for nav items (100ms, 200ms, 400ms, 500ms delays)
  - Slide out on close
- **Text color fill effect** on hover:
  - Left-to-right vermilion color fill with acceleration
  - Uses `::before` pseudo-element with `clip-path` animation
  - Duration: 0.7s with cubic-bezier(0.6, 0, 0.4, 1) for subtle acceleration
  - Arrows transition to vermilion after text completes (0.7s delay)
- **Buttons**: ABOUT, CONTACT, PROJECTS, BLOG with SVG arrow indicators
- All ABOUT buttons navigate to about section with smooth scroll
- Close button (✕) with hover color change to vermilion
- Disables page scroll when open

#### Text Fill Animation CSS
```css
.nav-item::before {
  content: attr(data-text);
  position: absolute;
  color: #E5532C;
  clip-path: inset(0 100% 0 0); /* Hidden initially */
  transition: clip-path 0.7s cubic-bezier(0.6, 0, 0.4, 1);
  width: fit-content; /* Only cover text, not arrow */
}

.nav-item:hover::before {
  clip-path: inset(0 0 0 0); /* Fully revealed */
}
```

### About Section
- Dark charcoal background (`#2A2F35`)
- Header with ABOUT button (scrolls to top) and hamburger menu
- Positioned at 100dvh from top (full viewport height below landing)

### Navigation
- **Desktop (landing page)**: ABOUT (bottom left) and CONTACT (bottom right) buttons
- **Small screens**: Hamburger menu with dropdown (top right, positioned below marquee)
- **About section header**: ABOUT button (left) and hamburger menu (right)
- **Full-screen nav**: Grid layout with MENU label, close button, and nav items
- All ABOUT buttons navigate to about section with:
  - Smooth scroll behavior
  - Theme update after scroll completes (1s delay)
  - Marquee theme switching to light

### AnimatedButton Component
Reusable button with hover underline effect:
- `isMenuButton`: Menu toggle (rounded, with shadow, cream background)
- `isDropdownItem`: Dropdown menu items (no border radius)
- `reverse`: Animates underline from right instead of left
- Underline: 2px height, vermilion color, 0.3s ease transition

### Responsive Behavior
- Breakpoint: 300px (for ultra-small screens)
- Adjusts padding and font size based on viewport
- Hamburger menu positioned at 56px from top (accounts for marquee height)
- Hides bottom buttons on small screens, shows hamburger menu instead

## File Structure
```
src/app/
├── layout.tsx         # Root layout with font imports (Roboto Mono, Hubot Sans)
├── page.tsx           # Main landing page with marquee, full-screen nav, about section
└── globals.css        # Global styles and font imports
```

## Development Notes
- Client component with "use client" directive
- `suppressHydrationWarning` on body to prevent browser extension warnings
- All styling uses inline styles (no CSS framework)
- Animation CSS injected via `useEffect` hooks
- Custom hooks:
  - `useMarquee`: Dynamic marquee item calculation
  - `useMarqueeAnimation`: Injects marquee keyframes and hover styles
  - `useNavAnimations`: Injects navigation animation keyframes and styles
- Font weights: Roboto Mono (400, 500, 570, 700), Hubot Sans (400)
- State management with React hooks (useState, useEffect)
- Scroll detection for theme switching with initial check on mount

## Development Workflow

### Before Pushing
**ALWAYS** run the following commands before pushing any changes:
```bash
npm install
npm run build
```

### After Writing Code
After making code changes, run `npm run build` and **resolve any issues** that arise:
- Fix TypeScript errors
- Resolve build warnings
- Ensure no failing builds
- Verify the production build succeeds completely

This ensures the codebase is always in a working state before deployment.

## Key Implementation Details

### Marquee Theme Switching
The marquee uses `isDarkTheme` state to control styling:
- `false` (default): Dark background, light text - for landing section
- `true`: Light background, dark text - for about section
- Scroll event listener updates state at 90% viewport scroll
- Initial check on mount handles direct navigation to about section
- All ABOUT buttons trigger manual theme update after scroll (1s delay)

### Full-Screen Nav Architecture
- Conditional rendering based on `isOpen` and `isClosing` states
- `isClosing` state prevents interaction during exit animation (800ms)
- Body scroll locked when nav is open (`overflow: hidden`)
- Cleanup of scroll lock on unmount

### Text Fill Animation
- Uses `data-text` attribute on buttons for duplication
- `::before` pseudo-element creates colored text layer
- `clip-path` animation reveals from left to right
- `width: fit-content` ensures only text is affected, not arrows
- SVG arrows have separate color transition with delay
- `z-index` layering ensures proper stacking

### Navigation Flow
1. Landing page: Scroll or click ABOUT to navigate to about section
2. About section: Click hamburger to open full-screen nav
3. Full-screen nav: Click any nav item to close and optionally navigate
4. Smooth scroll behavior with theme state updates
