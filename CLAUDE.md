# Claude Code Instructions

Hard rules and gotchas for agents editing this repo. Stack/setup/features: README.md.

## CSS

- New styles go in the matching `src/styles/` file, not `globals.css`. Custom properties go in `globals.css` `:root` only.
- Every CSS file must be imported in `src/app/layout.tsx` — a new file under `src/styles/` does nothing until it is. `blog.css` is the exception: imported by `src/app/blog/layout.tsx` only, so it loads on `/blog/*` alone. Never import it elsewhere; its `html:has(.blog-root)` rules leak onto the host page.
- Breakpoint is 640px everywhere (`--breakpoint-small`, media queries, `useIsSmallScreen`).
- Keep hover styles inside `@media (hover: hover)` — otherwise touch devices get stuck states.
- Reduced motion is handled by one catch-all block at the end of `animations.css`. Don't add per-file `prefers-reduced-motion` blocks, except in `*.module.css`: a global sheet can't name hashed module classes. It can't reach JS-driven motion, so anything animating from JS checks `matchMedia('(prefers-reduced-motion: reduce)')` itself — `useScrollParallax` and `NameDisplay`'s pointer tilt via `useReducedMotion`, plus `useCursorGlow` and `lib/utils.ts` inline. Prefer the hook: it re-reads the preference, where an inline check in an effect body latches it at mount.
- CSS modules rename keyframe names, so `animation: shimmer` in a `*.module.css` never finds the global `@keyframes shimmer` and silently does nothing. Declare a local copy in the module.
- Never hand-type `cubic-bezier(...)`. Use `--ease-out-expo` / `--ease-in-out-soft` / `--ease-out-quint` / `--ease-out-quart` / `--ease-out-back`.
- `:focus-visible` is styled globally. No `outline: none` without a replacement indicator.
- **`--color-accent` fails WCAG AA as small text** (3.11:1 sand, 3.60:1 charcoal) — large/bold text and UI chrome only. Body text and links use `--color-accent-on-light` / `--color-accent-on-dark`.
- Palette — read it from `globals.css` `:root`, don't recall hex values from memory: `--color-landing-bg #f2e9d8`, `--color-about-bg #2A2F35`, `--color-nav-bg #363D44`, `--color-nav-panel #444C55`, `--color-text-on-dark #f2e9d8`, `--color-text-on-light #2A2F35`, `--color-accent #E5532C`, `--color-accent-hover #D64626`, `--color-accent-on-light #b73e1d`, `--color-accent-on-dark #e87a4d`, `--color-terracotta #e87a4d`, `--color-card-bg #e4d9c2`, `--color-border #d6cbb3`, `--color-dropdown-hover #e9dfca`, `--color-muted #666666`.
- The blog segment shares this palette. `src/styles/blog.css` only aliases blog-local names (`--color-background`, `--color-card`, …) onto these; it declares no colours of its own.
- Blog components style through inline `style={{}}`, so their colours are `'var(--color-…)'` strings, not hexes — the vars resolve on `.blog-root`. Alpha variants use `color-mix(in srgb, var(--color-accent) N%, transparent)`; a hex with an alpha suffix can't take a var.
- `blog.css` sets link colour with `.blog-root a` — specificity (0,1,1), which beats any bare class. Blog rules that recolour an anchor need the `.blog-root` prefix to win; module rules use two classes (`.footer .link`).
- The blog `Footer` and `Tooltip` style through their own `footer.module.css` / `tooltip.module.css`, not `blog.css`, so `/projects` renders them without the blog sheet. `Footer` attaches the blog font variables itself.
- `src/styles/blog/colors.ts` is **WebGL only** — three.js materials need a literal, so `accent` and `background` are re-stated there. Nothing in the DOM may import it; keep the two values equal to `globals.css`.

## Components

- Props are declared and exported from the component that takes them. `src/types/index.ts` holds only cross-file types (`ResponsiveProps`, `ContactFormData`, `FormState`, `useIntersectionAnimation`). No `*Props` there, and never in both places.
- Theme is owned by the scroll listener in `page.tsx`. Nothing else sets it; `setIsDarkTheme` reaches no child. Scroll helpers just scroll. Don't thread a theme setter down the tree.
- `ScrollContainer` uses `forwardRef`; `page.tsx` passes a plain ref and wires the listener in a mount-once `useEffect`. An inline callback ref leaked a listener per render — don't reintroduce it.
- **Viewport branching is CSS by default.** No `isSmallScreen` prop, no screen-size state in `page.tsx`. Styling-only cases belong in a 640px media query. `useIsSmallScreen()` is for when CSS can't swap the tree (`FullScreenNav`); it returns `false` on the server, so a JS branch costs a post-hydration flip.
- `NameScene` is DOM + CSS transforms despite living in `components/3d/`. It uses no 3D libs, even though the blog installs them.
- `Tooltip` (`components/ui/`) clones its single child to attach a ref and handlers, and portals the tip to `document.body` (z-index 4000, above the hamburger's 3001). It returns the child untouched when `(hover: hover) and (pointer: fine)` fails, so nothing it says can be the only place that information exists. `followCursor` anchors to the pointer instead of the trigger box (keyboard focus still uses the box) and updates by writing `style.left/top` on the tip directly from a rAF callback — deliberately outside React, and the tip size is cached at open so the move handler never reads layout. Consumers: `SocialIconLink`, the footer email link, `NameDisplay` (follow).
- Overlays (`FullScreenNav`, `ContactPopup`) use `useFocusTrap` and keep `role="dialog"` + `aria-modal="true"`. The nav passes its animated `handleClose` as dismiss so Escape plays the exit.

## Behaviors

- **Landing parallax** (`useScrollParallax`): bidirectional, rAF-throttled, skips sub-0.5px updates, denominator `innerHeight * 0.9`, no-op under reduced motion. `NameDisplay` slides up 40vh from scroll 0; `LandingButtons` the same but only after `innerHeight * 0.2` — name exits first, buttons follow.
- Those distances are passed as **fractions of the viewport** (`maxDistanceVh: 0.4`, `triggerThresholdVh: 0.2`) and multiplied by a live `innerHeight` inside the hook. Don't go back to passing pixels: the callers had to compute them from `window.innerHeight` at render time, and since a resize re-renders nothing in the landing tree, the travel distance went stale while the hook's own viewport read stayed current.
- The hook's rAF id is `number | null` and is cleared as the first statement of the frame callback. A truthiness guard treats id `0` as "no frame pending", and an early return before the clear leaves the throttle latched, which silently kills the parallax for the life of the component. `useScrollParallax.test.tsx` covers both.
- **About entrance plays once**: `useIntersectionAnimation` latches on a `hasAnimated` ref (threshold 0.15, rootMargin -50px). `AboutSection` owns the target ref and passes `isVisible` to `AboutContent`. No replay on return from contact.
- About section: `height: 100dvh` desktop; `height: auto` + `min-height: 100dvh` at ≤640px.
- About has a short-desktop block (`max-height: 760px`, e.g. 150% zoom) and a large-screen block (`min-width: 1800px` and `min-height: 1100px`, e.g. 67% zoom). Sizes in between are untouched. The cards use `align-content: safe center` so they never spill up onto the headline.
- About expertise is **numbered pillars** on the charcoal: ghost `01`–`03` in `--font-body`, hairline column rules, no cream card chrome. At ≤640px they become index-left / copy-right rows. Don't bring back `CardScene` or the cream tiles.
- All 3 sections use `scroll-snap-align: start` + `scroll-snap-stop: always`; `.scroll-container` has `scroll-snap-type: y mandatory`.
- Theme thresholds in `page.tsx`: `< 0.9*vh` landing/light, `0.9–1.9*vh` about/dark, above contact/light. `isDarkTheme` only drives `HamburgerButton`.
- The hamburger's opacity transition is asymmetric on purpose — 0.25s in (base rule), 0.5s out (`--faded`). A transition comes from the state being entered, so the base rule only affects fade-in.

## Known issues — real, unfixed

- Contact rate limiter (`src/lib/rateLimit.ts`) is an in-process `Map` → per-instance on serverless. Deliberate; see `docs/backlog.md`.

## Removed — do not re-add

- `CardScene.tsx` — cream-card 3D tilt. About expertise is numbered pillars now.
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

## Projects

- `/projects` is the gallery (`ProjectsGallery`); `/projects/[slug]` is one page per `works` entry in `src/lib/projects.ts`. `projects` is the subset with a scroll story (`ProjectPanel`): Homelab (`MacMiniArtwork`) and Portfolio & Blog (`SiteArtwork`). Each story's closing text lives in its `ending` field.
- Portfolio and Blog are one entry (slug `portfolio`); `next.config.ts` 308s `/projects/blog` to it. Don't split them again without removing that redirect.
- Story drawings share one recipe: flat parts drawn on a page, laid into an isometric `matrix(...)` plane, moved by per-part keyframes on the `--project-scene` view timeline. Each moving part (and the logos, labels and ring) is its own `Layer`: a small `<svg>` in an HTML box, so the compositor moves it. Never animate shapes inside one big SVG; Chrome repaints the whole drawing every frame. Keyframe offsets are drawing units (`var(--unit)`), and a layer's box is the part's fill-box, so rotations pivot where they did. `partMotion` in `ProjectScene` mirrors those keyframes for browsers without scroll timelines, so change both together.
- The Mac mini's app logos (`[data-app]`) are local copies in `public/projects/apps/` (Jellyfin from dashboard-icons, the rest from the homelab dashboard). They sit behind the chassis and only move, never fade, so the case hides them when shut. `mini-app` keyframes and the `data-app` branch in `ProjectScene` share timing.
- Covers are portrait by `aspect-ratio: 3 / 4`; the label sits in flow above the title area and the title is capped at `max-height: 100%`, so long titles wrap into a second column instead of reaching the label.
- The gallery ends with `SunField`: a fixed mellow yellow sun on charcoal whose beam follows the pointer (or a tap) and lights hidden notes through an SVG mask. Each note has `wide` and `narrow` spots; phones crop the sides, so keep `narrow` within x 320-880. It replaced the drag-and-flip letter box.
- Lenis (`ProjectScroll`) runs on the detail pages only, not the gallery.
- The projects menu button is pinned (`position: fixed`) and `ProjectNavigation` picks its `data-tone` from the background behind it, skipping the nav bar itself. Its menu links to `#selected-work` and `#made-to-play`.
- Outer sections pad with `--project-edge` (the gutter, growing past 1760px so content stays within 1600px). Panels nested inside them keep `--project-gutter`; giving them the edge would double the inset.
- A `liveUrl` starting with `/` is internal and opens in the same tab.
- Loading states are shimmer skeletons on the global `shimmer` keyframes: the Homelab status list, the lazily loaded story, cover images and the footer avatar (`data-loaded`). The sculpture's fallback is its first frame projected in JS with the shader's maths, so changing the shader's angles, tilt or scale means updating `FALLBACK_DOTS` too.
- Phone hero: the Explore row shares a line with the sculpture controls (`bottom: 43px` centres it on their box). Below 345px there is no room, so the copy sits above them. Below 300px (split-screen, zoomed phones) gutters drop to 12px and the nav hides its label visually.
- `.projects-collection__list` and `.projects-details-reveal` are grids with `minmax(0, 1fr)` columns. An implicit `auto` column grows to the widest content and pushes the page sideways on narrow screens.
- `instagram` stats on a `Work` are hand-copied from the public profile (no API: the Graph API account is suspended). Update `asOf` with the numbers.
- `WorkGallery`'s close holds the reveal's bottom edge, pinned no lower than the viewport and never above the gallery, then scrolls up only. Without the pin, the top Close button dragged the page to the hero.

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

`layout.tsx` metadata + JSON-LD `Person`, `sitemap.ts` (`/`, `/projects`, one `/projects/<slug>` per `works` entry; no fragments), `robots.ts`.

## Fonts

- `next/font/local` from `src/fonts/`, via `--font-roboto-mono` / `--font-hubot-sans`. Don't go back to `@fontsource` — no preload.
- **Ship only Roboto Mono 400/500 and Hubot Sans 400.** CSS asks for 700; that bold is synthesised and the design is built on it. A real 700 file changes the type — tried once, reverted.
- Both faces keep next/font's default `adjustFontFallback` (`size-adjust` metrics, holds CLS down), which only works while every rendered character exists in the font. The CTA arrow was `↓` (U+2193), absent from Roboto Mono, and the Arial fallback redrew it — it's a lucide `ArrowDown` now. Check the cmap before adding non-ASCII to Roboto Mono text.

## Before pushing

`npm install && npm run build`, plus `npm test`, `npm run lint`, `npm run format:check`. CI runs all five. Prettier config is `.prettierrc.json` (single quotes, semicolons); `npm run format` fixes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
