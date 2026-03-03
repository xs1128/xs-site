# Personal Website - Landing Page

## Overview
Minimalist personal landing page with a scrolling announcement bar, centered name display, navigation buttons, and a full-screen navigation overlay.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with Turbopack
- **UI**: React 19
- **Language**: TypeScript
- **Styling**: Plain CSS with inline styles and CSS-in-JS via useEffect
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

### Contact Section
- Located below the about section
- Features a spinning circular text with "Xinsheng Ooi" that expands on click
- Clicking the circle opens a contact form with smooth animations
- **Form submissions are automatically sent via email using Resend API**
- Form includes: Name, Email, and Message fields
- **Large screens (>625px)**:
  - Circle moves left when form opens
  - Vertical divider appears between circle and form
  - Form slides in from right
- **Small screens (≤625px)**:
  - Circle fades and swipes up when form opens
  - Form swipes up from bottom
  - Horizontal layout for header (title left, close button right)

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
- **Large screens**: Independent circle and form animations
  - Circle: `translateX(-100%)` to move left, 0.8s cubic-bezier
  - Form: `translateX(100% → 0)` to slide in, 0.8s cubic-bezier with 0.4s delay
  - Divider: Fades in at 0.4s, opacity transition
- **Small screens**: Simplified fade and swipe animations
  - Circle: `translateY(-150%)` to swipe up, 0.3s ease
  - Form: `translateY(100% → 0)` to swipe up, 0.5s cubic-bezier with 0.3s delay
- **States**: `isPopupOpen`, `isPopupClosing`, `isAnimating` for smooth transitions
- **Quick-tap protection**: `isAnimating` blocks interaction during transitions

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
├── page.tsx           # Main landing page with marquee, full-screen nav, about section, contact form
├── globals.css        # Global styles and font imports
└── api/
    └── contact/
        └── route.ts   # API route for handling contact form submissions via Resend

.env.local             # Environment variables (RESEND_API_KEY)
package.json           # Dependencies including Resend SDK
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

### Contact Form Implementation

**API Route (`src/app/api/contact/route.ts`):**
- POST endpoint that accepts JSON body with `{ name, email, message }`
- Validates all required fields before sending
- Uses Resend SDK to send emails via `resend.emails.send()`
- Returns success/error responses with appropriate status codes
- Gracefully handles missing API key (returns 503)

**Frontend Form (`ContactPopup` component in `page.tsx`):**
- State management: `formData`, `isSubmitting`, `submitStatus`, `errorMessage`
- Async `handleSubmit` function that calls `/api/contact` endpoint
- Shows "Sending..." on button during submission (button disabled)
- Displays success message (dark green) for 1.5s before closing form
- Displays error message (red) with details if API call fails
- Form resets after successful submission

**Animation States:**
- `isPopupOpen`: Controls form visibility
- `isPopupClosing`: Triggers close animation
- `isAnimating`: Blocks quick taps during transitions (1.2s total)
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
