# Personal Website - Landing Page

## Overview
Minimalist personal landing page with a centered name display and navigation buttons.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Language**: TypeScript
- **Styling**: Plain CSS with inline styles
- **Font**: Roboto Mono via @fontsource/roboto-mono

## Color Scheme (Vintage Poster Palette - Warm Vermillion Edition)
- Background: `#F2E9D8` (warm aged paper)
- Text: `#2A2F35` (dark charcoal)
- Accent: `#E5532C` (warm vermilion)
- Cards: `#E4D9C2` (light cream)
- Borders: `#D6CBB3` (muted tan)

## Features

### Name Display
- Centered "Xinsheng Ooi" on desktop, "xs" on small screens (< 300px)
- Click to toggle between full name and initials with fade animation (0.4s)
- Unselectable text with `user-select: none`
- Responsive sizing: `clamp(65px, 10vw, 180px)` desktop, `clamp(48px, 15vw, 120px)` mobile
- Font weight: 570, letter spacing: -0.06em, line height: 0.95

### Navigation
- **Desktop**: ABOUT (bottom left) and CONTACT (bottom right) buttons
- **Small screens**: Hamburger menu with dropdown (top right)
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
- Hides bottom buttons on small screens, shows hamburger menu instead

## File Structure
```
src/app/
├── layout.tsx         # Root layout with font imports
├── page.tsx           # Main landing page component
└── globals.css        # Global styles and font imports
```

## Development Notes
- Client component with "use client" directive
- `suppressHydrationWarning` on body to prevent browser extension warnings
- All styling uses inline styles (no CSS framework)
- Font weights 400 and 500 imported
