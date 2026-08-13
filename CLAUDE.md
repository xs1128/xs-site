# Claude Code Instructions

Conventions, gotchas, and hard rules for agents editing this repo. For stack/setup/features, see README.md.

## CSS Rules

- New styles go in the matching file under `src/styles/`, NOT `globals.css`.
- CSS custom properties go in `globals.css` `:root` only.
- Every CSS file must be manually imported in `src/app/layout.tsx` — adding a file under `src/styles/` does nothing until it's imported there.
- Breakpoint is 640px everywhere (`--breakpoint-small`, `BREAKPOINT` const in `page.tsx`, `@media max-width: 640px`).
- Hover effects are gated behind `@media (hover: hover)` throughout — keep new hover styles inside that guard so touch devices don't get stuck states.
- **Reduced motion is handled globally** by a catch-all block at the end of `animations.css` that neutralizes every animation and transition. Don't add per-file `prefers-reduced-motion` blocks. The older, now-redundant block at the end of `about.css` is kept only because it is harmless. CSS can't reach JS-driven motion, so anything animating from JS must check `matchMedia('(prefers-reduced-motion: reduce)')` itself — see `useScrollParallax` and `lib/utils.ts`.
- Palette (`globals.css` `:root`): `--color-landing-bg #fbf9f4`, `--color-about-bg #2A2F35`, `--color-nav-bg #363D44`, `--color-nav-panel #444C55`, `--color-text-on-dark #fbf9f4`, `--color-text-on-light #2A2F35`, `--color-accent #E5532C`, `--color-accent-hover #D64626`, `--color-accent-on-light #C4421F`, `--color-accent-on-dark #e87a4d`, `--color-terracotta #e87a4d`, `--color-card-bg #f0ede5`, `--color-border #e5e0d5`, `--color-dropdown-hover #ebe6dd`. Don't copy older hex values from memory — read this block.
- **`--color-accent` fails WCAG AA as small text** (3.56:1 on cream, 3.60:1 on charcoal). Use it only for large/bold text and UI chrome. For body text and links use `--color-accent-on-light` or `--color-accent-on-dark` depending on the background.
- Easing is tokenized: `--ease-out-expo`, `--ease-in-out-soft`. Never hand-type a `cubic-bezier(...)` — it was duplicated 38 times before being consolidated.
- `:focus-visible` is styled globally in `globals.css`. Don't add `outline: none` anywhere without a replacement indicator.

## Component Architecture

- Most component props live in `src/types/index.ts`, but `AnimatedHeadline`, `MagneticCTA`, `HamburgerButton` and `CardScene` declare theirs locally. Both placements are fine; what is not fine is declaring in both, which is how the file accumulated stale duplicates. Check the component before adding an interface here.
- Theme is owned entirely by the scroll listener in `page.tsx`. Nothing else sets it, and `setIsDarkTheme` is not passed to any child — scroll helpers just scroll, and the listener reacts. Don't thread a theme setter back through the tree.
- `ScrollContainer` uses `forwardRef`; `page.tsx` passes a plain ref and wires the scroll listener in a mount-once `useEffect`. It used to pass an inline callback ref that reattached every render and leaked a scroll listener each time — don't reintroduce that pattern.
- `ExpertiseCard` swaps wrapper by viewport: `CardScene` on desktop, plain `div` on mobile. `CardScene` and `NameScene` live under `components/3d/` but are DOM + CSS transforms, NOT WebGL. No 3D libraries are installed.
- Overlays (`FullScreenNav`, `ContactPopup`) use `useFocusTrap` and must keep `role="dialog"` + `aria-modal="true"`. The nav passes its animated `handleClose` as the dismiss handler so Escape still plays the exit.

## Key Behaviors

- **Landing parallax**: `useScrollParallax` is bidirectional/reversible, rAF-throttled, skips updates under 0.5px, progress denominator is `innerHeight * 0.9`, and no-ops entirely under reduced motion. `NameDisplay` slides up 40vh starting at scroll 0. `LandingButtons` slides up 40vh starting after `innerHeight * 0.2` scroll. Cascading effect: name exits first, buttons follow.
- **About entrance animation plays ONCE**: `useIntersectionAnimation` latches via a `hasAnimated` useRef (threshold 0.15, rootMargin -50px). It takes a target ref — `AboutSection` owns it and passes `isVisible` down to `AboutContent`. Does not replay on return from contact.
- Desktop about section: `height: 100dvh`. Mobile (≤640px): `height: auto` + `min-height: 100dvh`.
- All 3 sections: `scroll-snap-align: start` + `scroll-snap-stop: always`; container has `scroll-snap-type: y mandatory` (`.scroll-container` in `globals.css`).
- Theme thresholds in `page.tsx`: `scrollY < 0.9*vh` → landing/light, `0.9–1.9*vh` → about/dark, above → contact/light. `isDarkTheme` only drives `HamburgerButton`.
- The hamburger's opacity transition is deliberately asymmetric — 0.25s in (base rule), 0.5s out (`--faded` rule). A transition is taken from the state being entered, so editing the base rule changes fade-in only.

## Known Issues — real, unfixed

- The contact rate limiter (`src/lib/rateLimit.ts`) is an in-process `Map`, so on serverless it is per-instance, not global. Deliberate — see `docs/backlog.md`.

## Removed — do not re-add

- `BlurOverlay.tsx`, `PrismOverlay.tsx`, `overlay.css`
- `ThreeCanvas.tsx`, `AnnouncementMarquee.tsx`, `MobileDropdown.tsx`, `useResponsive.ts`, `useMarquee.ts`, `marquee.css`, `public/fonts/`
- `three`, `@react-three/fiber`, `@react-three/drei` — uninstalled. Nothing renders WebGL.
- `NameDisplay`'s name/initials toggle. Its `onToggle` / `showInitials` / `isFading` / `isSmallScreen` props were dead and are gone; the component takes only `containerRef`. Don't "fix" the toggle back in without checking why it was disabled.
- `ContactSection`'s `onOpenNav` prop — was passed but never destructured.
- `src/lib/utils.ts` exports only `scrollToAbout` and `scrollToContact`, both taking no arguments. `scrollToSection` and `getThemeForScrollPosition` don't exist — don't use them.
- `setIsDarkTheme` props on `FullScreenNavProps`, `AboutSectionProps`, `AboutHeaderProps`, and the `ThemeProps` / `AnimationState` / `SectionWrapperProps` / `ContactFormProps` interfaces — all deleted as unused.

## Routing

- `next.config.ts` rewrites `/blog` and `/blog/:path*` to `https://blog.xsooi.com`. `/blog` is NOT a local route — don't create `src/app/blog`.

## Environment Variables

- `RESEND_API_KEY` — contact API (`src/app/api/contact/route.ts`) returns 503 without it.
- `NEXT_PUBLIC_SITE_URL` — defaults to `https://xsooi.com`; feeds layout metadata, `robots.ts`, `sitemap.ts`, `BreadcrumbSchema`. `.env.example` only lists this one.

## Contact API Rules

- Never return raw provider errors or the Resend response body to the client — log server-side, return a generic message.
- `name` and `email` are CRLF-stripped before reaching the `subject` header. Keep that if you change the send call.
- Validation lives at the top of the route: 5 requests/hour/IP, email regex, and length caps (name 100, email 200, message 5000).

## SEO Surfaces — keep in sync when sections change

- `layout.tsx` metadata + JSON-LD `Person`
- `src/components/seo/BreadcrumbSchema.tsx`
- `sitemap.ts` (`/`, `/#about`, `/#contact`)
- `robots.ts`

## Fonts

- Loaded via `@fontsource` CSS imports in `layout.tsx`. A `next/font/local` migration was tried and reverted — it changed bold weights and introduced scroll lag. See `docs/backlog.md` before retrying.
- Only Hubot Sans 400 is loaded, but CSS uses `font-weight: 700` on headlines and card titles. That bold is browser-synthesised, and the design is built around how it looks. Loading a real 700 face changes the type.

## Before Pushing

Run `npm install && npm run build`, plus `npm test` and `npm run lint`. CI runs all four; resolve failures before committing.
