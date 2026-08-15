# Claude Code Instructions

Hard rules and gotchas for agents editing this repo. Stack/setup/features: README.md.

## CSS

- New styles go in the matching `src/styles/` file, not `globals.css`. Custom properties go in `globals.css` `:root` only.
- Every CSS file must be imported in `src/app/layout.tsx` — a new file under `src/styles/` does nothing until it is.
- Breakpoint is 640px everywhere (`--breakpoint-small`, media queries, `useIsSmallScreen`).
- Keep hover styles inside `@media (hover: hover)` — otherwise touch devices get stuck states.
- Reduced motion is handled by one catch-all block at the end of `animations.css`. Don't add per-file `prefers-reduced-motion` blocks. It can't reach JS-driven motion, so anything animating from JS checks `matchMedia('(prefers-reduced-motion: reduce)')` itself — `useScrollParallax`, `useCursorGlow`, `lib/utils.ts`.
- Never hand-type `cubic-bezier(...)`. Use `--ease-out-expo` / `--ease-in-out-soft`.
- `:focus-visible` is styled globally. No `outline: none` without a replacement indicator.
- **`--color-accent` fails WCAG AA as small text** (3.56:1 cream, 3.60:1 charcoal) — large/bold text and UI chrome only. Body text and links use `--color-accent-on-light` / `--color-accent-on-dark`.
- Palette — read it from `globals.css` `:root`, don't recall hex values from memory: `--color-landing-bg #fbf9f4`, `--color-about-bg #2A2F35`, `--color-nav-bg #363D44`, `--color-nav-panel #444C55`, `--color-text-on-dark #fbf9f4`, `--color-text-on-light #2A2F35`, `--color-accent #E5532C`, `--color-accent-hover #D64626`, `--color-accent-on-light #C4421F`, `--color-accent-on-dark #e87a4d`, `--color-terracotta #e87a4d`, `--color-card-bg #f0ede5`, `--color-border #e5e0d5`, `--color-dropdown-hover #ebe6dd`.

## Components

- Props are declared and exported from the component that takes them. `src/types/index.ts` holds only cross-file types (`ResponsiveProps`, `ContactFormData`, `FormState`, `useIntersectionAnimation`). No `*Props` there, and never in both places.
- Theme is owned by the scroll listener in `page.tsx`. Nothing else sets it; `setIsDarkTheme` reaches no child. Scroll helpers just scroll. Don't thread a theme setter down the tree.
- `ScrollContainer` uses `forwardRef`; `page.tsx` passes a plain ref and wires the listener in a mount-once `useEffect`. An inline callback ref leaked a listener per render — don't reintroduce it.
- **Viewport branching is CSS by default.** No `isSmallScreen` prop, no screen-size state in `page.tsx`. `ExpertiseCard` is the only JS consumer (`useIsSmallScreen()` swaps `CardScene` for a `div`, which CSS can't do). The hook returns `false` on the server, so a JS branch costs a post-hydration flip; styling-only cases belong in a 640px media query.
- `CardScene` / `NameScene` are DOM + CSS transforms despite living in `components/3d/`. No 3D libs installed.
- `CardScene` ignores every prop but `children`, so `ExpertiseCard`'s `onClick`/`className`/`index` are dropped on desktop and `expertise-card--hovered` is mobile-only. Pre-existing.
- `Tooltip` (`components/ui/`) clones its single child to attach a ref and handlers, and portals the tip to `document.body` (z-index 4000, above the hamburger's 3001). It returns the child untouched when `(hover: hover) and (pointer: fine)` fails, so nothing it says can be the only place that information exists. `followCursor` anchors to the pointer instead of the trigger box (keyboard focus still uses the box) and updates by writing `style.left/top` on the tip directly from a rAF callback — deliberately outside React, and the tip size is cached at open so the move handler never reads layout. Consumers: `SocialIconLink`, the footer email link, `NameDisplay` (follow).
- Overlays (`FullScreenNav`, `ContactPopup`) use `useFocusTrap` and keep `role="dialog"` + `aria-modal="true"`. The nav passes its animated `handleClose` as dismiss so Escape plays the exit.

## Behaviors

- **Landing parallax** (`useScrollParallax`): bidirectional, rAF-throttled, skips sub-0.5px updates, denominator `innerHeight * 0.9`, no-op under reduced motion. `NameDisplay` slides up 40vh from scroll 0; `LandingButtons` the same but only after `innerHeight * 0.2` — name exits first, buttons follow.
- **About entrance plays once**: `useIntersectionAnimation` latches on a `hasAnimated` ref (threshold 0.15, rootMargin -50px). `AboutSection` owns the target ref and passes `isVisible` to `AboutContent`. No replay on return from contact.
- About section: `height: 100dvh` desktop; `height: auto` + `min-height: 100dvh` at ≤640px.
- All 3 sections use `scroll-snap-align: start` + `scroll-snap-stop: always`; `.scroll-container` has `scroll-snap-type: y mandatory`.
- Theme thresholds in `page.tsx`: `< 0.9*vh` landing/light, `0.9–1.9*vh` about/dark, above contact/light. `isDarkTheme` only drives `HamburgerButton`.
- The hamburger's opacity transition is asymmetric on purpose — 0.25s in (base rule), 0.5s out (`--faded`). A transition comes from the state being entered, so the base rule only affects fade-in.

## Known issues — real, unfixed

- Contact rate limiter (`src/lib/rateLimit.ts`) is an in-process `Map` → per-instance on serverless. Deliberate; see `docs/backlog.md`.

## Removed — do not re-add

- `BlurOverlay.tsx`, `PrismOverlay.tsx`, `overlay.css`, `ThreeCanvas.tsx`, `AnnouncementMarquee.tsx`, `MobileDropdown.tsx`, `useResponsive.ts`, `useMarquee.ts`, `marquee.css`, `public/fonts/`
- `src/components/seo/BreadcrumbSchema.tsx` and the whole `seo/` dir. A one-page site has no breadcrumb trail, and its items were `#about` / `#contact` fragments, which are not pages. Earned no rich result. `Person` in `layout.tsx` is the only structured data now.
- `three`, `@react-three/fiber`, `@react-three/drei` — uninstalled. Nothing renders WebGL.
- `NameDisplay`'s name/initials toggle and its `onToggle`/`showInitials`/`isFading`/`isSmallScreen` props; it takes only `containerRef`. Check why it was disabled before "fixing" it back.
- `ContactSection`'s `onOpenNav` prop.
- `VisitorCount.tsx`, `src/app/api/visits/route.ts` and the `.contact-section__visits*` rules. A visit counter under the social icons broke the footer's rhythm. GoatCounter still records; read the numbers at `xsooi.goatcounter.com`. The route existed only to dodge content blockers for that display.
- `setIsDarkTheme` props on `FullScreenNavProps` / `AboutSectionProps` / `AboutHeaderProps`, and the `ThemeProps` / `AnimationState` / `SectionWrapperProps` / `ContactFormProps` interfaces.
- `src/lib/utils.ts` exports only `scrollToAbout` and `scrollToContact`, both argument-less. `scrollToSection` and `getThemeForScrollPosition` don't exist.

## Routing

`next.config.ts` rewrites `/blog` and `/blog/:path*` to `https://blog.xsooi.com`. Don't create `src/app/blog`.

## Env vars

- `RESEND_API_KEY` — contact route returns 503 without it.
- `NEXT_PUBLIC_SITE_URL` — defaults to `https://www.xsooi.com`; feeds layout metadata, `robots.ts`, `sitemap.ts`. www is canonical: the apex 308s to it, so every emitted URL must carry the `www.`.
- `NEXT_PUBLIC_GOATCOUNTER_CODE` — GoatCounter site code (the subdomain, not a URL). Unset means `layout.tsx` renders no script and `VisitorCount` renders nothing, which keeps dev and preview traffic out of the stats. `NEXT_PUBLIC_` is inlined at build time, so changing it needs a redeploy, not just a restart.

## Contact API

- Never return raw provider errors or the Resend response body to the client — log server-side, send a generic message.
- `name` and `email` are CRLF-stripped before the `subject` header. Keep that.
- Validation at the top of the route: 5 req/hour/IP, email regex, length caps (name 100, email 200, message 5000).

## SEO surfaces — keep in sync when sections change

`layout.tsx` metadata + JSON-LD `Person`, `sitemap.ts` (`/` only, no fragments), `robots.ts`.

## Fonts

- `next/font/local` from `src/fonts/`, via `--font-roboto-mono` / `--font-hubot-sans`. Don't go back to `@fontsource` — no preload.
- **Ship only Roboto Mono 400/500 and Hubot Sans 400.** CSS asks for 700; that bold is synthesised and the design is built on it. A real 700 file changes the type — tried once, reverted.
- Both faces keep next/font's default `adjustFontFallback` (`size-adjust` metrics, holds CLS down), which only works while every rendered character exists in the font. The CTA arrow was `↓` (U+2193), absent from Roboto Mono, and the Arial fallback redrew it — it's a lucide `ArrowDown` now. Check the cmap before adding non-ASCII to Roboto Mono text.

## Before pushing

`npm install && npm run build`, plus `npm test`, `npm run lint`, `npm run format:check`. CI runs all five. Prettier config is `.prettierrc.json` (single quotes, semicolons); `npm run format` fixes.
