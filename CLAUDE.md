# Claude Code Instructions

## Project Overview

Minimalist personal landing page with modular component architecture using plain CSS with CSS custom properties and @media queries for responsive design.

**Framework**: Next.js 16 (App Router) with Turbopack
**UI**: React 19
**Language**: TypeScript
**Styling**: Plain CSS (modular files under `src/styles/`)

## Architecture

### CSS Modular Structure

The project uses a modular CSS architecture with 7 separate CSS files:

- **globals.css** (73 lines): Base styles, CSS custom properties, global reset
- **animations.css**: All @keyframe animations
- **marquee.css**: Marquee component styles
- **navigation.css**: Navigation and dropdown styles
- **about.css**: About section styles
- **contact.css**: Contact section styles
- **landing.css**: Landing section styles

**Important**: When adding styles, put them in the appropriate modular CSS file, NOT in globals.css.

### Component Architecture

- **Props Interfaces**: All component props defined in `src/types/index.ts`
- **Composition**: Complex sections built from smaller, reusable components
- **State Management**: Global state in page.tsx, local state in components
- **Forward Refs**: ScrollContainer uses forwardRef to expose ref to parent

### Key Implementation Details

#### Landing Section Parallax Animation

**IMPORTANT**: The landing section has reversible scroll-based parallax animations.

- **Name Display**: Slides up 40vh starting immediately (0vh scroll)
- **Navigation Buttons**: Slides up 40vh starting after 20vh scroll
- Creates cascading parallax effect where name exits first, followed by buttons
- Uses `useScrollParallax` hook with continuous scroll tracking (bidirectional)
- Preserves existing 3D tilt effect alongside parallax translation
- All animations are reversible when scrolling back up

#### About Section Animation Behavior

**IMPORTANT**: The about section animation plays **ONLY ONCE** when scrolling from landing → about.

- Uses `useIntersectionAnimation` hook with `useRef` to track if animation has already played
- Does NOT replay when returning from contact section
- Hook uses `IntersectionAnimationState` interface (NOT `AnimationState` - that's a different interface)

#### Mobile vs Desktop Behavior

**Desktop (>640px)**:
- About section: `height: 100dvh` with `overflow: hidden`
- Expertise cards: 3D tilt effect, full hover animations
- Fixed viewport, no internal scroll

**Mobile (≤640px)**:
- About section: `height: auto` with `overflow: visible` (allows scroll if needed)
- Expertise cards: Tap animations with `:active` pseudo-class, NO levitation
- Cards have equal heights with `height: 100%`
- Compact padding: 20px 32px

#### Scroll Snap Behavior

All three sections have:
- `scroll-snap-align: start`
- `scroll-snap-stop: always`
- Container: `scroll-snap-type: y mandatory`

This ensures smooth section-by-section scrolling.

## Development Workflow

### Before Pushing

**ALWAYS** run:
```bash
npm install
npm run build
```

Resolve any TypeScript errors or build warnings before committing.

### After Writing Code

- Run `npm run build` to verify production build succeeds
- Fix any TypeScript errors
- Ensure no failing builds

## Important Notes

### CSS Custom Properties Location

All CSS custom properties are defined in `globals.css` under `:root`. Add new ones there, NOT in modular CSS files.

### Interface Naming

- `AnimationState`: Used for nav animations (isClosing, isPopupClosing, isAnimating)
- `IntersectionAnimationState`: Used for scroll-triggered animations (isVisible)

Don't confuse these two - they serve different purposes!

### Removed Components

The following have been removed and should NOT be re-added:
- BlurOverlay.tsx
- PrismOverlay.tsx
- overlay.css

### Utility Functions

Available in `src/lib/utils.ts`:
- `scrollToAbout(setIsDarkTheme)`: Scroll to about section and update theme
- `scrollToContact(setIsDarkTheme)`: Scroll to contact section and update theme

Removed (don't use):
- ~~`scrollToSection(sectionId)`~~ - unused
- ~~`getThemeForScrollPosition(scrollY, viewportHeight)`~~ - unused

## Contact Form

- **API Route**: `src/app/api/contact/route.ts`
- **Environment Variable**: `RESEND_API_KEY` in `.env.local`
- **Email Service**: Resend (free tier: 3,000 emails/month)

## File Structure Reference

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── api/contact/route.ts
│
├── styles/                    # Modular CSS files
│   ├── animations.css
│   ├── marquee.css
│   ├── navigation.css
│   ├── about.css
│   ├── contact.css
│   └── landing.css
│
├── components/
│   ├── about/
│   ├── contact/
│   ├── landing/
│   ├── layout/
│   ├── marquee/
│   ├── navigation/
│   └── icons/
│
├── hooks/
│   ├── useResponsive.ts
│   ├── useMarquee.ts
│   ├── useIntersectionAnimation.ts
│   └── useScrollParallax.ts
│
├── types/index.ts
└── lib/utils.ts
```
