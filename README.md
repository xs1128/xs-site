# Personal Website - Landing Page

Minimalist personal landing page with a scrolling announcement bar, centered name display, navigation buttons, and a full-screen navigation overlay.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **UI**: React 19
- **Language**: TypeScript
- **Styling**: Plain CSS with CSS custom properties and @media queries
- **Fonts**: Roboto Mono (primary), Hubot Sans (announcements)
- **Email Service**: Resend (contact form submissions)

## Color Scheme (Vintage Poster Palette - Warm Vermillion Edition)

- **Landing Page Background**: `#F2E9D8` (warm aged paper)
- **About Section Background**: `#2A2F35` (dark charcoal)
- **Full-Screen Nav Background**: `#363D44` (dark gray)
- **Nav Button Panels**: `#444C55` (medium gray)
- **Text**: `#F2E9D8` (warm aged paper - on dark backgrounds)
- **Text**: `#2A2F35` (dark charcoal - on light backgrounds)
- **Accent**: `#E5532C` (warm vermilion)
- **Cards**: `#E4D9C2` (light cream)
- **Borders**: `#D6CBB3` (muted tan)

## Features

### Three-Section Layout with Scroll Snap

1. **Landing Section** (100dvh): Warm aged paper background with centered name
2. **About Section** (100dvh): Dark charcoal background with expertise cards
3. **Contact Section** (100dvh): Light background with spinning circular text and contact form

### Announcement Marquee

- Fixed position at top of screen with `z-index: 1000`
- **Dynamic theme switching** based on scroll position:
  - Default (landing section): Dark background with off-white text
  - Scrolled to about section: Light background with dark text
  - Switches at 90% scroll through first section
- **Infinite scrolling marquee** with dynamic item generation
- **Pause on hover** - stops when mouse is anywhere in the marquee container

### Name Display

- Centered "Xinsheng Ooi" on desktop, "xs" on small screens (< 625px)
- Click to toggle between full name and initials with fade animation (0.4s)
- Responsive sizing: `clamp(65px, 10vw, 180px)` desktop, `clamp(48px, 15vw, 120px)` mobile
- Font: Roboto Mono, weight 570, letter spacing -0.06em

### Full-Screen Navigation Overlay

- Triggered by hamburger menu on small screens and ABOUT button in about section
- **Animations**:
  - Slide in from right (0.8s cubic-bezier(0.16, 1, 0.3, 1))
  - Fade-in cascade for nav items
  - Slide out on close
- **Text color fill effect** on hover with left-to-right vermilion color fill
- **Buttons**: ABOUT, CONTACT, PROJECTS, BLOG with SVG arrow indicators
- Disables page scroll when open

### About Section

- Dark charcoal background (`#2A2F35`)
- **One-time scroll-triggered animations**: Elements animate in when scrolling from landing to about section (only plays once, does not replay when returning from contact)
- **Animated headline**: "I turn real problems into automated solutions." with word-by-word reveal effect
- **Three expertise cards** with enhanced interactions:
  - 3D tilt effect on desktop (follows cursor movement)
  - Icon bounce animation on hover/tap
  - Icon glow effect with vermilion shadow
  - Parallax depth (title and description float at different Z-levels)
  - Mobile: Tap animations with `:active` pseudo-class
  - Mobile: Equal heights, compact padding (20px/32px), no levitation
- **Magnetic CTA button**: Subtly follows cursor on desktop
- **Desktop viewport optimization**: Fixed height: `height: 100dvh` (fits exactly one viewport)
- **Mobile**: `height: auto` (allows scroll if needed)

### Contact Section

- Light cream background (`#F2E9D8`)
- Spinning circular text with "Xinsheng Ooi" featuring animated +/- symbol in center
- Clicking circle opens contact form with smooth sequential animations
- **Form submissions are automatically sent via email using Resend API**
- Email address at bottom: "email: hi@xsooi.com" with clickable mailto link
- Social media links at bottom (GitHub, Instagram, Facebook, LinkedIn)

## Development

### Before Pushing

**ALWAYS** run the following commands before pushing any changes:

```bash
npm install
npm run build
```

### Contact Form Email Setup

**Local Development:**

1. Sign up at https://resend.com/signup (free tier: 3,000 emails/month)
2. Get your API key from https://app.resend.com/api-keys
3. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   ```
4. Update the `to` field in `src/app/api/contact/route.ts` to match your Resend signup email
5. Test the contact form locally

**Production Deployment:**

1. Add `RESEND_API_KEY` to your hosting platform's environment variables (Vercel/Netlify)
2. **Recommended**: Verify your domain in Resend dashboard:
   - Go to https://app.resend.com/domains
   - Add your domain (e.g., `xsooi.com`)
   - Add provided DNS records to your domain provider
   - Update `from` address in API route

**Important Notes:**

- Free `@resend.dev` domain can only send to the email used for Resend signup
- Domain verification required to send to other recipients
- API route validates input and handles errors gracefully
- Frontend shows loading states and success/error messages

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with font imports
│   ├── page.tsx                # Main page - orchestrates sections and state
│   ├── globals.css             # Base styles, custom properties, global reset (73 lines)
│   └── api/
│       └── contact/
│           └── route.ts        # API route for contact form submissions
│
├── styles/
│   ├── animations.css          # All @keyframe animations
│   ├── marquee.css             # Marquee component styles
│   ├── navigation.css          # Navigation and dropdown styles
│   ├── about.css               # About section styles
│   ├── contact.css             # Contact section styles
│   └── landing.css             # Landing section styles
│
├── components/
│   ├── about/                  # About section components
│   ├── contact/                # Contact section components
│   ├── landing/                # Landing section components
│   ├── layout/                 # Layout components
│   ├── marquee/                # Marquee component
│   ├── navigation/             # Navigation components
│   └── icons/                  # Icon components
│
├── hooks/
│   ├── useResponsive.ts        # Screen size detection
│   ├── useMarquee.ts           # Dynamic marquee item calculation
│   └── useIntersectionAnimation.ts  # Scroll-triggered animation detection
│
├── types/
│   └── index.ts                # TypeScript interfaces
│
└── lib/
    └── utils.ts                # Utility functions

.env.local                     # Environment variables (RESEND_API_KEY)
package.json                   # Dependencies
```

## Recent Changes (2025)

### Code Cleanup & Optimization

- **Removed redundant code**: Duplicate interfaces, unused functions, unused state variables, unused overlay components
- **Modularized CSS**: Split `globals.css` from 1,823 → 73 lines (96% reduction)
- **Fixed scroll snap**: Added `scroll-snap-align: start` to all section containers
- **Animation improvements**: About section animation now plays only once
- **Mobile card enhancements**: Added `:active` pseudo-class for tap animations
- **Desktop viewport optimization**: About section fixed at `height: 100dvh`
