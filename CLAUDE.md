# Claude Code Instructions

Hard rules and gotchas for agents editing this repo. Stack/setup/features: README.md.

## CSS

- New styles go in the matching `src/styles/` file, not `globals.css`. Custom properties go in `globals.css` `:root` only.
- Every CSS file must be imported in `src/app/layout.tsx` — a new file under `src/styles/` does nothing until it is. The two blog sheets are the exception: `blog-globals.css` and `blog.css` are imported by `src/app/blog/layout.tsx` so they only load on `/blog/*`.
- Breakpoint is 640px everywhere (`--breakpoint-small`, media queries, `useIsSmallScreen`).
- Keep hover styles inside `@media (hover: hover)` — otherwise touch devices get stuck states.
- Reduced motion is handled by one catch-all block at the end of `animations.css`. Don't add per-file `prefers-reduced-motion` blocks. It can't reach JS-driven motion, so anything animating from JS checks `matchMedia('(prefers-reduced-motion: reduce)')` itself — `useScrollParallax`, `useCursorGlow`, `lib/utils.ts`.
- Never hand-type `cubic-bezier(...)`. Use `--ease-out-expo` / `--ease-in-out-soft` / `--ease-out-quint` / `--ease-out-quart` / `--ease-out-back`.
- `:focus-visible` is styled globally. No `outline: none` without a replacement indicator.
- **`--color-accent` fails WCAG AA as small text** (3.11:1 sand, 3.60:1 charcoal) — large/bold text and UI chrome only. Body text and links use `--color-accent-on-light` / `--color-accent-on-dark`.
- Palette — read it from `globals.css` `:root`, don't recall hex values from memory: `--color-landing-bg #f2e9d8`, `--color-about-bg #2A2F35`, `--color-nav-bg #363D44`, `--color-nav-panel #444C55`, `--color-text-on-dark #f2e9d8`, `--color-text-on-light #2A2F35`, `--color-accent #E5532C`, `--color-accent-hover #D64626`, `--color-accent-on-light #b73e1d`, `--color-accent-on-dark #e87a4d`, `--color-terracotta #e87a4d`, `--color-card-bg #e4d9c2`, `--color-border #d6cbb3`, `--color-dropdown-hover #e9dfca`, `--color-muted #666666`.
- The blog segment shares this palette. `src/styles/blog-globals.css` only aliases blog-local names (`--color-background`, `--color-card`, …) onto these; it declares no colours of its own.
- Blog components style through inline `style={{}}`, so their colours are `'var(--color-…)'` strings, not hexes — the vars resolve on `.blog-root`. Alpha variants use `color-mix(in srgb, var(--color-accent) N%, transparent)`; a hex with an alpha suffix can't take a var.
- `blog-globals.css` sets link colour with `.blog-root a` — specificity (0,1,1), which beats any bare class. Blog rules that recolour an anchor (`.footer-link`, …) need the `.blog-root` prefix to win.
- `src/styles/blog/colors.ts` is **WebGL only** — three.js materials need a literal, so `accent` and `background` are re-stated there. Nothing in the DOM may import it; keep the two values equal to `globals.css`.

## Components

- Props are declared and exported from the component that takes them. `src/types/index.ts` holds only cross-file types (`ResponsiveProps`, `ContactFormData`, `FormState`, `useIntersectionAnimation`). No `*Props` there, and never in both places.
- Theme is owned by the scroll listener in `page.tsx`. Nothing else sets it; `setIsDarkTheme` reaches no child. Scroll helpers just scroll. Don't thread a theme setter down the tree.
- `ScrollContainer` uses `forwardRef`; `page.tsx` passes a plain ref and wires the listener in a mount-once `useEffect`. An inline callback ref leaked a listener per render — don't reintroduce it.
- **Viewport branching is CSS by default.** No `isSmallScreen` prop, no screen-size state in `page.tsx`. `ExpertiseCard` is the only JS consumer (`useIsSmallScreen()` swaps `CardScene` for a `div`, which CSS can't do). The hook returns `false` on the server, so a JS branch costs a post-hydration flip; styling-only cases belong in a 640px media query.
- `CardScene` / `NameScene` are DOM + CSS transforms despite living in `components/3d/`. They use no 3D libs, even though the blog installs them.
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
- ~~`three`, `@react-three/fiber`, `@react-three/drei` — uninstalled~~ — reinstated by the blog merge. They render the `/blog` terminal cube only; nothing under `/` uses WebGL.
- `NameDisplay`'s name/initials toggle and its `onToggle`/`showInitials`/`isFading`/`isSmallScreen` props; it takes only `containerRef`. Check why it was disabled before "fixing" it back.
- `ContactSection`'s `onOpenNav` prop.
- `VisitorCount.tsx`, the site's own `src/app/api/visits/route.ts` and the `.contact-section__visits*` rules. (`/blog/api/visits` is a different route, still live, feeding the blog's terminal cube.) A visit counter under the social icons broke the footer's rhythm. GoatCounter still records; read the numbers at `xsooi.goatcounter.com`. The route existed only to dodge content blockers for that display.
- `setIsDarkTheme` props on `FullScreenNavProps` / `AboutSectionProps` / `AboutHeaderProps`, and the `ThemeProps` / `AnimationState` / `SectionWrapperProps` / `ContactFormProps` interfaces.
- `src/lib/utils.ts` exports only `scrollToAbout` and `scrollToContact`, both argument-less. `scrollToSection` and `getThemeForScrollPosition` don't exist.

## Routing

`/blog/*` is served from `src/app/blog/` in this repo — the rewrite to
`blog.xsooi.com` is gone, as is the blog's `basePath`. Consequences:

- Internal blog links must be written `/blog/...` in full. Nothing prefixes them.
- Blog public assets live in `public/blog/`; blog metadata references them as `/blog/...`.
- `revalidatePath` in `src/app/blog/api/revalidate/route.ts` targets `/blog`, not `/`.
- One `robots.txt` and one root `sitemap.xml`, both owned by site. The blog has its own `/blog/sitemap.xml`.

## Env vars

- `RESEND_API_KEY` — contact route returns 503 without it.
- `NEXT_PUBLIC_SITE_URL` — defaults to `https://www.xsooi.com`; feeds layout metadata, `robots.ts`, `sitemap.ts`. www is canonical: the apex 308s to it, so every emitted URL must carry the `www.`.
- `NEXT_PUBLIC_GOATCOUNTER_CODE` — GoatCounter site code (the subdomain, not a URL). Unset means no script is rendered, which keeps dev and preview traffic out of the stats. `NEXT_PUBLIC_` is inlined at build time, so changing it needs a redeploy, not just a restart.
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — blog content. The build fails without them: `/blog/posts/[slug]` and `/blog/series/[slug]` call `generateStaticParams`.
- `REVALIDATE_SECRET` — `/blog/api/revalidate` returns 401 without a matching `x-revalidate-secret`. Shared with `blog-admin`.
- `VISITS_OFFSET` — pre-GoatCounter visit count added to the blog cube's total.

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
