# Claude Code Instructions

Conventions, gotchas, and hard rules for agents editing this repo. For stack/setup/features, see README.md.

## CSS Rules

- New styles go in the matching file under `src/styles/`, NOT `globals.css`.
- CSS custom properties go in `globals.css` `:root` only.
- Every CSS file must be manually imported in `src/app/layout.tsx` — adding a file under `src/styles/` does nothing until it's imported there.
- Breakpoint is 640px everywhere that matters (`--breakpoint-small`, `BREAKPOINT` const in `page.tsx`, `@media max-width: 640px`). The unused `useResponsive` hook defaults to 625 — inconsistent, don't copy it.
- Hover effects are gated behind `@media (hover: hover)` throughout — keep new hover styles inside that guard so touch devices don't get stuck states.
- `about.css` ends with a `@media (prefers-reduced-motion: reduce)` block that neutralizes the about-section animations. Add new about animations there too.
- Palette (`globals.css` `:root`): `--color-landing-bg #fbf9f4`, `--color-about-bg #2A2F35`, `--color-nav-bg #363D44`, `--color-nav-panel #444C55`, `--color-text-on-dark #fbf9f4`, `--color-text-on-light #2A2F35`, `--color-accent #E5532C`, `--color-accent-hover #D64626`, `--color-terracotta #e87a4d`, `--color-card-bg #f0ede5`, `--color-border #e5e0d5`, `--color-dropdown-hover #ebe6dd`. Don't copy older hex values from memory — read this block.

## Component Architecture

- Component props live in `src/types/index.ts`. Two similarly-named interfaces — don't confuse them:
  - `AnimationState` — nav animations (`isClosing`, `isPopupClosing`, `isAnimating`)
  - `IntersectionAnimationState` — scroll-triggered animations (`isVisible`)
- `ScrollContainer` uses `forwardRef`; `page.tsx` passes a callback ref that also wires the scroll listener.
- `ExpertiseCard` swaps wrapper by viewport: `CardScene` on desktop, plain `div` on mobile. `CardScene` and `NameScene` live under `components/3d/` but are DOM + CSS transforms, NOT WebGL — `three`/`@react-three/fiber`/`@react-three/drei` are installed yet unrendered.

## Key Behaviors

- **Landing parallax**: `useScrollParallax` is bidirectional/reversible, rAF-throttled, skips updates under 0.5px, progress denominator is `innerHeight * 0.9`. `NameDisplay` slides up 40vh starting at scroll 0. `LandingButtons` slides up 40vh starting after `innerHeight * 0.2` scroll. Cascading effect: name exits first, buttons follow.
- **About entrance animation plays ONCE**: `useIntersectionAnimation` latches via a `hasAnimated` useRef, observing `.about-section` directly (threshold 0.15, rootMargin -50px). Does not replay on return from contact.
- Desktop about section: `height: 100dvh`. Mobile (≤640px): `height: auto` + `min-height: 100dvh`.
- All 3 sections: `scroll-snap-align: start` + `scroll-snap-stop: always`; container has `scroll-snap-type: y mandatory` (`.scroll-container` in `globals.css`).
- Theme thresholds in `page.tsx`: `scrollY < 0.9*vh` → landing/light, `0.9–1.9*vh` → about/dark, above → contact/light. `isDarkTheme` currently only drives `HamburgerButton` since the marquee is unmounted (see Dead Code).

## Dead Code — unused, confirm intent before extending

- `NameDisplay`'s name/initials toggle is dead: `showInitials` is hardcoded `false`, `onToggle` is `() => {}`. No click-to-toggle behavior exists anymore — don't "fix" it back in without checking why it was disabled.
- `AnnouncementMarquee` (`marquee/`) and `MobileDropdown` (`navigation/`) are never rendered by `page.tsx`.
- `useResponsive` hook is never imported — `page.tsx` inlines its own resize listener with `const BREAKPOINT = 640`.
- `ThreeCanvas` is never imported.
- `marquee.css` is still imported in `layout.tsx` even though the marquee is unmounted.

## Removed — do not re-add

- `BlurOverlay.tsx`, `PrismOverlay.tsx`, `overlay.css`
- `src/lib/utils.ts` exports only `scrollToAbout` and `scrollToContact`. `scrollToSection` and `getThemeForScrollPosition` don't exist — don't use them.

## Routing

- `next.config.ts` rewrites `/blog` and `/blog/:path*` to `https://blog.xsooi.com`. `/blog` is NOT a local route — don't create `src/app/blog`.

## Environment Variables

- `RESEND_API_KEY` — contact API (`src/app/api/contact/route.ts`) returns 503 without it.
- `NEXT_PUBLIC_SITE_URL` — defaults to `https://xsooi.com`; feeds layout metadata, `robots.ts`, `sitemap.ts`, `BreadcrumbSchema`. `.env.example` only lists this one.

## SEO Surfaces — keep in sync when sections change

- `layout.tsx` metadata + JSON-LD `Person`
- `src/components/seo/BreadcrumbSchema.tsx`
- `sitemap.ts` (`/`, `/#about`, `/#contact`)
- `robots.ts`

## Before Pushing

Always run `npm install && npm run build` and resolve all TypeScript errors before committing.
