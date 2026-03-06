# Personal Website - Landing Page

## Overview
Minimalist personal landing page with a scrolling announcement bar, centered name display, navigation buttons, and a full-screen navigation overlay. Built with a modular component architecture using plain CSS with CSS custom properties and @media queries for responsive design.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with Turbopack
- **UI**: React 19
- **Language**: TypeScript
- **Styling**: Plain CSS with CSS custom properties and @media queries
- **Fonts**: Roboto Mono (primary), Hubot Sans (announcements)
- **Email Service**: Resend (contact form submissions)

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

All colors are defined as CSS custom properties in `globals.css` under `:root`.

## Features

### Three-Section Layout with Scroll Snap
1. **Landing Section** (100dvh): Warm aged paper background with centered name
2. **About Section** (100dvh): Dark charcoal background with expertise cards
3. **Contact Section** (100dvh): Light background with spinning circular text and contact form

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

### Name Display
- Centered "Xinsheng Ooi" on desktop, "xs" on small screens (< 625px)
- Click to toggle between full name and initials with fade animation (0.4s)
- Unselectable text with `user-select: none`
- Prevents clicks during fade transition
- Responsive sizing: `clamp(65px, 10vw, 180px)` desktop, `clamp(48px, 15vw, 120px)` mobile
- Font: Roboto Mono, weight 570, letter spacing -0.06em, line height 0.95
- **Component**: `NameDisplay` in `src/components/landing/NameDisplay.tsx`

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
  - Duration: 0.7s with cubic-bezier(0.6, 0, 0.4, 1)
  - Arrows transition to vermilion after text completes (0.7s delay)
- **Buttons**: ABOUT, CONTACT, PROJECTS, BLOG with SVG arrow indicators
- All ABOUT buttons navigate to about section with smooth scroll
- Close button (✕) with hover color change to vermilion
- Disables page scroll when open
- **Component**: `FullScreenNav` in `src/components/navigation/FullScreenNav.tsx`

### About Section
- Dark charcoal background (`#2A2F35`)
- Header with ABOUT button (scrolls to top) and hamburger menu
- Main content includes:
  - Headline: "I turn real problems into automated solutions."
  - Intro paragraph with bio
  - Three expertise cards with hover lift effect
  - CTA section to scroll to contact
- **Components**:
  - `AboutSection` in `src/components/about/AboutSection.tsx`
  - `AboutHeader` in `src/components/about/AboutHeader.tsx`
  - `AboutContent` in `src/components/about/AboutContent.tsx`
  - `ExpertiseCard` in `src/components/about/ExpertiseCard.tsx`

### Contact Section
- Light cream background (`#F2E9D8`)
- Header with CONTACT button (scrolls to top)
- Spinning circular text with "Xinsheng Ooi" that expands on click
- Clicking opens contact form with smooth animations
- **Form submissions are automatically sent via email using Resend API**
- Social media links at bottom (GitHub, Instagram, Facebook, LinkedIn)
- **Components**:
  - `ContactSection` in `src/components/contact/ContactSection.tsx`
  - `ContactHeader` in `src/components/contact/ContactHeader.tsx`
  - `SpinningCircularText` in `src/components/contact/SpinningCircularText.tsx`
  - `ContactPopup` in `src/components/contact/ContactPopup.tsx`
  - `SocialIconLink` in `src/components/contact/SocialIconLink.tsx`

#### Contact Form Email Implementation
- **Backend**: Serverless Next.js API route at `/api/contact`
- **Email Service**: Resend (free tier: 3,000 emails/month)
- **API Route**: `src/app/api/contact/route.ts`
- **Environment Variable**: `RESEND_API_KEY` in `.env.local`
- **Recipient Email**: Configured in API route (`to` field)
- **Sender Domain**: Uses `onboarding@resend.dev` (free testing domain)
  - Note: Free domain can only send to the email used for Resend signup
  - For production: Verify your domain and update `from` address

#### Form Animation Details
- **Large screens (>625px)**: Independent circle and form animations
  - Circle: `translateX(-100%)` to move left, 0.8s cubic-bezier
  - Form: `translateX(100% → 0)` to slide in, 0.8s cubic-bezier with 0.4s delay
  - Divider: Fades in at 0.4s, opacity transition
- **Small screens (≤625px)**: Simplified fade and swipe animations
  - Circle: `translateY(-150%)` to swipe up, 0.3s ease
  - Form: `translateY(100% → 0)` to swipe up, 0.5s cubic-bezier with 0.3s delay
- **States**: `isPopupOpen`, `isPopupClosing`, `isAnimating` for smooth transitions
- **Quick-tap protection**: `isAnimating` blocks interaction during transitions

### Navigation
- **Desktop (landing page)**: ABOUT (bottom left) and CONTACT (bottom right) buttons
- **Small screens (≤625px)**: Hamburger menu with dropdown (top right, positioned below marquee)
- **About section header**: ABOUT button (left) and hamburger menu (right)
- **Full-screen nav**: Grid layout with MENU label, close button, and nav items
- All ABOUT buttons navigate to about section with smooth scroll and theme update
- **Components**:
  - `HamburgerButton` in `src/components/navigation/HamburgerButton.tsx`
  - `MobileDropdown` in `src/components/navigation/MobileDropdown.tsx`
  - `LandingButtons` in `src/components/landing/LandingButtons.tsx`
  - `AnimatedButton` in `src/components/navigation/AnimatedButton.tsx` (reusable button with underline animation)

### Responsive Behavior
- **Breakpoint**: 625px (small screens)
- All responsive styling handled by CSS @media queries
- JavaScript only handles conditional rendering and state-based behavior
- Scroll snap behavior: `y mandatory` for smooth section-by-section scrolling
- Hamburger menu positioned at 60px (56px on mobile) from top

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with font imports (Roboto Mono, Hubot Sans)
│   ├── page.tsx                # Main page (130 lines) - orchestrates sections and state
│   ├── globals.css             # All styles, animations, and responsive CSS (1,348 lines)
│   └── api/
│       └── contact/
│           └── route.ts        # API route for contact form submissions via Resend
│
├── components/
│   ├── about/
│   │   ├── AboutSection.tsx    # About section wrapper
│   │   ├── AboutHeader.tsx     # Header with ABOUT button
│   │   ├── AboutContent.tsx    # Main content with headline, intro, cards, CTA
│   │   └── ExpertiseCard.tsx   # Individual expertise card with hover effect
│   │
│   ├── contact/
│   │   ├── ContactSection.tsx  # Contact section wrapper with form animations
│   │   ├── ContactHeader.tsx   # Header with CONTACT button
│   │   ├── SpinningCircularText.tsx  # Spinning circle component
│   │   ├── ContactPopup.tsx    # Contact form with validation and submission
│   │   └── SocialIconLink.tsx  # Social media icon link component
│   │
│   ├── landing/
│   │   ├── LandingSection.tsx  # Landing section wrapper
│   │   ├── NameDisplay.tsx     # Centered name with click-to-toggle
│   │   └── LandingButtons.tsx  # Desktop ABOUT/CONTACT buttons
│   │
│   ├── layout/
│   │   └── ScrollContainer.tsx # Main scroll wrapper with snap behavior
│   │
│   ├── marquee/
│   │   └── AnnouncementMarquee.tsx  # Top scrolling announcement bar
│   │
│   ├── navigation/
│   │   ├── FullScreenNav.tsx   # Full-screen overlay navigation
│   │   ├── HamburgerButton.tsx # Fixed hamburger button
│   │   ├── MobileDropdown.tsx  # Mobile dropdown menu
│   │   └── AnimatedButton.tsx  # Reusable button with underline animation
│   │
│   └── icons/
│       ├── StaticIcon.tsx      # Static icon component
│       └── SocialIcons.tsx      # Social media icon SVGs (GitHub, LinkedIn, etc.)
│
├── hooks/
│   ├── useResponsive.ts        # Reusable screen size detection
│   ├── useMarquee.ts           # Dynamic marquee item calculation
│   └── useScrollDetection.ts   # Scroll position detection
│
├── types/
│   └── index.ts                # TypeScript interfaces for all components
│
└── lib/
    └── utils.ts                # Utility functions (scrollToAbout, scrollToContact)

.env.local                     # Environment variables (RESEND_API_KEY)
package.json                   # Dependencies including Resend SDK
```

## Development Notes
- Client component with "use client" directive
- `suppressHydrationWarning` on body to prevent browser extension warnings
- **All styling uses CSS classes** (no inline styles except for dynamic state values)
- **All animations in static CSS** (no runtime CSS injection)
- **All responsive behavior via CSS @media queries** (not JavaScript ternaries)
- Custom hooks:
  - `useMarquee`: Dynamic marquee item calculation based on screen width
  - `useResponsive`: Screen size detection with configurable breakpoint
  - `useScrollDetection`: Scroll position tracking for theme switching
- Font weights: Roboto Mono (400, 500, 570, 700), Hubot Sans (400)
- State management with React hooks (useState, useEffect, useRef)
- Scroll detection for theme switching with initial check on mount
- **Contact form**: Async handleSubmit with loading states and error handling
- **Email API**: Serverless Next.js API route with Resend SDK integration

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
   - Update `from` address in API route: `from: 'Portfolio Contact <noreply@xsooi.com>'`
3. This allows sending to any email address, not just your signup email

**Important Notes:**
- Free `@resend.dev` domain can only send to the email used for Resend signup
- Domain verification required to send to other recipients
- API route validates input and handles errors gracefully
- Frontend shows loading states and success/error messages

## Key Implementation Details

### CSS Architecture
- **CSS Custom Properties**: All colors, fonts, spacing, and transitions defined in `:root`
- **BEM-like Naming**: Component classes use double underscore notation (e.g., `.contact-popup__header`)
- **Modifier Classes**: State variations use double dash notation (e.g., `.nav-item--active`)
- **@media Queries**: All responsive styling at 625px breakpoint
- **Zero Runtime CSS**: No CSS-in-JS or style injection - all static CSS in globals.css

### Component Architecture
- **Props Interfaces**: All component props defined in `src/types/index.ts`
- **Composition**: Complex sections built from smaller, reusable components
- **State Management**: Global state in page.tsx, local state in components
- **Forward Refs**: ScrollContainer uses forwardRef to expose ref to parent
- **Utility Functions**: Shared logic in `src/lib/utils.ts`

### Marquee Theme Switching
The marquee uses `isDarkTheme` state to control styling:
- `false` (default): Dark background, light text - for landing section
- `true` (Light background, dark text - for about section
- Scroll event listener updates state at 90% viewport scroll
- Initial check on mount handles direct navigation to about section
- All ABOUT buttons trigger manual theme update after scroll (1s delay)
- **Component**: `AnnouncementMarquee` in `src/components/marquee/AnnouncementMarquee.tsx`

### Full-Screen Nav Architecture
- Conditional rendering based on `isOpen` and `isClosing` states
- `isClosing` state prevents interaction during exit animation (800ms)
- Body scroll locked when nav is open (`overflow: hidden`)
- Cleanup of scroll lock on unmount
- CSS classes handle all animations and hover states

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
5. **Utility functions**: `scrollToAbout()` and `scrollToContact()` in `src/lib/utils.ts`

### Contact Form Implementation

**API Route (`src/app/api/contact/route.ts`):**
- POST endpoint that accepts JSON body with `{ name, email, message }`
- Validates all required fields before sending
- Uses Resend SDK to send emails via `resend.emails.send()`
- Returns success/error responses with appropriate status codes
- Gracefully handles missing API key (returns 503)

**Frontend Form (`ContactPopup` component):**
- State management: `formData`, `isSubmitting`, `submitStatus`, `errorMessage`
- Async `handleSubmit` function that calls `/api/contact` endpoint
- Shows "Sending..." on button during submission (button disabled)
- Displays success message for 1.5s before closing form
- Displays error message with details if API call fails
- Form resets after successful submission

**Animation States:**
- `isPopupOpen`: Controls form visibility
- `isPopupClosing`: Triggers close animation
- `isAnimating`: Blocks quick taps during transitions
- Responsive timing: Large screens (0.8s), Small screens (0.3-0.5s)

**Email Format:**
```
From: Portfolio Contact <onboarding@resend.dev>
To: hi@xsooi.com (or your Resend signup email)
Reply-To: [user's email from form]

Subject: Contact from [name]

Body:
Name: [name]
Email: [email]

Message:
[message content]
```

## Refactoring Summary (2024)

**Completed**: Full codebase refactoring from monolithic to modular architecture

**Before**:
- 1,974-line page.tsx with all components inline
- 195+ inline style objects
- 219 lines of CSS injected via useEffect hooks
- 250+ ternary patterns for responsive logic

**After**:
- 130-line page.tsx (93.4% reduction)
- 20 organized component files
- 1,348 lines of static CSS in globals.css
- All responsive behavior via CSS @media queries
- Zero CSS injection hooks

**Benefits**:
- Improved maintainability and code organization
- Better separation of concerns
- Easier to debug and modify
- Consistent styling with CSS custom properties
- Reusable components across the application
- Type-safe with comprehensive TypeScript interfaces
