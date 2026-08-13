# Personal Website

Minimalist single-page landing site: scroll-snapped Landing / About / Contact sections, full-screen nav overlay, and an email-backed contact form.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack by default)
- **UI**: React 19, TypeScript 5
- **Styling**: Plain CSS with custom properties (no CSS-in-JS, no Tailwind)
- **Fonts**: Roboto Mono, Hubot Sans (via `@fontsource`, imported in `layout.tsx`)
- **Email**: Resend
- **No 3D libraries**: `NameScene` and `CardScene` live under `components/3d/` but are DOM + CSS transforms, not WebGL. `three` / `@react-three/fiber` / `@react-three/drei` were uninstalled once their only consumer was removed.

## Development

```bash
npm install
npm run dev     # start dev server
npm run lint    # ESLint
npm test        # Vitest
npm run build   # production build — run before every push
npm run start   # serve the production build
```

Always run `npm install && npm run build` before pushing; fix any TypeScript/build errors first.

## Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes (contact form) | Server-side, used by `/api/contact`. Without it, POSTs return `503`. |
| `NEXT_PUBLIC_SITE_URL` | No | Base URL for metadata/canonical/OG/sitemap/robots/JSON-LD. Falls back to `https://xsooi.com`. |

Both are listed in `.env.example`. The build succeeds without either, so CI needs no secrets.

## Contact Form

`POST /api/contact` (`src/app/api/contact/route.ts`) — body `{ name, email, message }`.

- `400` on missing fields, invalid email, or a field over its length cap (name 100, email 200, message 5000); `429` over 5 requests/hour/IP; `503` if `RESEND_API_KEY` unset; `500` on send failure; `200 { success: true }` otherwise.
- Errors are logged server-side and returned generically — the response never carries provider internals. `name` and `email` are CRLF-stripped to keep the `subject` header on one line.
- Rate limiting is an in-process `Map`, so on serverless it applies per instance, not globally.
- Sends from `Portfolio Contact <onboarding@resend.dev>` to `hi@xsooi.com`, with `replyTo` set to the submitter's email.
- The free `onboarding@resend.dev` sender only delivers to the Resend account's own email — verify a domain in the Resend dashboard and update `from` to send to other recipients.

## SEO

- `src/app/layout.tsx`: full `Metadata` export (title, description, canonical, icons, OpenGraph + Twitter `summary_large_image` using `/og-image.png`, robots directives) plus inline JSON-LD `Person` schema.
- `src/components/seo/BreadcrumbSchema.tsx`: JSON-LD `BreadcrumbList` (Home / #about / #contact).
- `src/app/robots.ts`: allows `/`, disallows `/api/`, `/_next/`, `/static/`.
- `src/app/sitemap.ts`: `/`, `/#about`, `/#contact`.
- `src/app/error.tsx` / `src/app/not-found.tsx`: minimal inline-styled fallbacks.

## Behavior

- One `ScrollContainer` with `scroll-snap-type: y mandatory`; each section uses `scroll-snap-align: start` + `scroll-snap-stop: always`.
- `page.tsx` derives theme from scroll position: `<0.9vh` landing (light), `0.9–1.9vh` about (dark), `>1.9vh` contact (light). Also tracks `isPastLanding` (hamburger only shows past landing).
- **Landing**: name renders via `NameScene` (lazy-loaded, `next/dynamic` with `ssr:false`), with a ±5° mouse tilt and scroll parallax (name slides up 40vh from 0vh scroll; ABOUT/CONTACT buttons slide up the same 40vh but start after 20vh, creating a cascade). The old click-to-toggle name/initials feature is gone; `NameDisplay` now takes only `containerRef`.
- **About**: one-time entrance animation via `useIntersectionAnimation` (threshold 0.15, `-50px` rootMargin), latched by a ref so it never replays. `AboutSection` owns the hook and passes `isVisible` down. Word-by-word headline. Three `ExpertiseCard`s, wrapped in `CardScene` on desktop (±8° tilt, cursor spotlight) and a plain `div` on mobile. Section-level cursor glow (desktop only). `MagneticCTA` follows the cursor at 15% intensity.
- **Contact**: spinning circular text (320px / 280px expanded / 240px mobile) opens `ContactPopup` on click; success/error states, auto-closes 1.5s after success. Footer has a `mailto:hi@xsooi.com` link plus GitHub/Instagram/Facebook/LinkedIn.
- **Nav**: `FullScreenNav` — ABOUT, CONTACT, PROJECTS (github.com/xs1128), BLOG (xsooi.com/blog); 800ms close animation; locks body scroll while open.
- **Accessibility**: both overlays are `role="dialog"` + `aria-modal` and share `useFocusTrap` (Tab cycles inside, Escape closes, focus returns to the trigger). `:focus-visible` is styled globally. Reduced motion is honored across all CSS animations plus the JS-driven parallax and smooth scrolling.

Breakpoint: 640px (`--breakpoint-small` in CSS, `BREAKPOINT = 640` inlined in `page.tsx`). About cards get an extra tier at 641–1050px, contact at 641–900px. Hover styles are gated behind `@media (hover: hover)`, and a global block in `animations.css` honors `prefers-reduced-motion: reduce`.

## Colors

All custom properties live in `globals.css` under `:root`.

| Token | Value | Use |
|---|---|---|
| `--color-landing-bg` | `#fbf9f4` | Landing background (cream sand) |
| `--color-about-bg` | `#2A2F35` | About background |
| `--color-nav-bg` | `#363D44` | Nav overlay background |
| `--color-nav-panel` | `#444C55` | Nav button panels |
| `--color-text-on-dark` | `#fbf9f4` | Text on dark backgrounds |
| `--color-text-on-light` | `#2A2F35` | Text on light backgrounds |
| `--color-accent` | `#E5532C` | Accent / hover fill — large text and UI only, fails AA as body text |
| `--color-accent-hover` | `#D64626` | Accent hover state |
| `--color-accent-on-light` | `#C4421F` | AA-safe accent text on cream (4.8:1) |
| `--color-accent-on-dark` | `#e87a4d` | AA-safe accent text on charcoal (4.8:1) |
| `--color-terracotta` | `#e87a4d` | Secondary accent |
| `--color-card-bg` | `#f0ede5` | About card background |
| `--color-border` | `#e5e0d5` | Borders |
| `--color-dropdown-hover` | `#ebe6dd` | Dropdown hover |

## Structure

```
src/
  app/            layout.tsx, page.tsx, globals.css, error.tsx, not-found.tsx,
                   robots.ts, sitemap.ts, icon.png, api/contact/route.ts
  styles/         animations.css, navigation.css, about.css,
                   contact.css, landing.css   (all imported in layout.tsx)
  components/
    landing/      LandingSection, NameDisplay, LandingButtons
    about/        AboutSection, AboutHeader, AboutContent, ExpertiseCard,
                   AnimatedHeadline, MagneticCTA
    contact/      ContactSection, ContactHeader, SpinningCircularText,
                   ContactPopup, SocialIconLink
    navigation/   FullScreenNav, HamburgerButton, AnimatedButton
    layout/       ScrollContainer
    icons/        SocialIcons, StaticIcon
    3d/           landing/NameScene, about/CardScene
    seo/          BreadcrumbSchema
  hooks/          useIntersectionAnimation, useScrollParallax, useFocusTrap
  types/          index.ts
  lib/            utils.ts
public/           favicons, apple-touch-icon, android-chrome 192/512, og-image.png,
                  site.webmanifest, icons/
```

`@/*` resolves to `./src/*` — the only alias in effect (`tsconfig.json`). `tsconfig.paths.json` defines extra per-directory aliases but nothing extends it, so it is inert.

## Known Issues

- No formatter config. CI runs typecheck, lint, test and build on push to `main` and on PRs (`.github/workflows/ci.yml`).
- Tests cover `useFocusTrap`, `lib/rateLimit` and the contact route; components have none.
- Contact rate limiting is in-process, so on serverless it applies per instance. See `docs/backlog.md`.
- `tsconfig.paths.json` — not extended by `tsconfig.json`; has no effect.

## Deploy

`next.config.ts` proxies `/blog` and `/blog/:path*` to `https://blog.xsooi.com/blog...` — no local blog route exists. Set `RESEND_API_KEY` and (optionally) `NEXT_PUBLIC_SITE_URL` in the hosting platform's environment variables.
