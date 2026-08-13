# Backlog

Outstanding work, ranked. Tiers 1–3 are cleanup on what exists; tier 4 is the
work that changes what the site *is*.

Everything here was verified against the codebase, not assumed. Items resolved
along the way are in `git log`, not repeated here.

## Tier 1 — correctness and user impact

### 1. Migrate fonts to `next/font`

`layout.tsx` imports `@fontsource` CSS, which gets no preload and no
`size-adjust` fallback metrics, so first paint flashes and shifts. Largest
remaining measurable perf item.

Complication: Hubot Sans is not on Google Fonts, and `public/fonts/` was
deleted as unreferenced. `next/font/local` needs those `.woff2` files back —
recover from `git show 568ac2e:public/fonts/HubotSans-Regular.woff2` or from
`node_modules/@fontsource/hubot-sans/files/`. Roboto Mono can go through
`next/font/google` directly.

### 2. Contact rate limiter is per-instance

`api/contact/route.ts` holds an in-process `Map`, so on serverless the real
limit is 5/hour × instance count. Adequate against casual form spam, not
against a determined sender. Needs Upstash Redis or Vercel KV for a global
limit. Only worth doing if spam actually arrives.

### 3. No tests

Nothing guards the recent fixes. In priority order:

- the scroll listener in `page.tsx` attaches exactly once
- `useFocusTrap` cycles at both edges and restores focus on close
- `api/contact` validation branches (429, invalid email, length caps, CRLF strip)

Vitest + Testing Library for the first two, plain handler tests for the third.

## Tier 2 — architecture

### 4. `isSmallScreen` prop drilling

Now down to real consumers only, but still threads `page.tsx` →
`AboutSection` → `AboutContent` → `ExpertiseCard`. Remaining uses are mostly
CSS decisions that media queries already make. The one genuine JS need is
`ExpertiseCard` swapping `CardScene` for a plain `div`. Push the rest into CSS
and the prop mostly disappears.

### 5. `AboutSection` mixes concerns

Composition plus imperative pointer tracking plus rAF writing `--glow-x` /
`--glow-y`. Extract `useCursorGlow(ref)`.

### 6. Prop-type placement is inconsistent

`types/index.ts` is down from 198 to ~110 lines, but four components
(`AnimatedHeadline`, `MagneticCTA`, `HamburgerButton`, `CardScene`) declare
props locally while the rest live in the shared file. Not wrong, just two
conventions. Pick one.

## Tier 3 — polish

### 7. OG card contradicts site metadata

`og-image.png` advertises Kubernetes / CI-CD / Cloud Infrastructure /
Observability. `layout.tsx` metadata and the JSON-LD `knowsAbout` say Python /
Bash / Docker / Cloudflare. The card is what people see when the site is
shared — the two should agree.

### 8. Sitemap hash URLs

`sitemap.ts` lists `/#about` and `/#contact`. Search engines ignore fragments.
Harmless noise.

### 9. Redundant reduced-motion block

The block at the end of `about.css` is superseded by the global one in
`animations.css`. Safe to delete, zero value either way.

### 10. No formatter

Prettier, plus a pre-commit hook if commit-time enforcement is wanted.

## Tier 4 — direction

None of the above moves the needle on what the portfolio actually does. This
tier does.

### 11. A work / case-study layer

The biggest structural gap. Three sections, no projects. Award-tier portfolios
are roughly 70% work. For a DevOps portfolio that means infra case studies with
real numbers: deploy time before and after, cost saved, MTTR.

### 12. CSS scroll-driven animations

`animation-timeline: view()` / `scroll()` replaces the IntersectionObserver and
rAF JS with compositor-threaded CSS. Around 84% global support mid-2026; gate
with `@supports (animation-timeline: scroll())`. Directly serves the
60fps-on-mid-range-Android bar that award juries score.

### 13. View Transitions API

For the nav overlay and the `/blog` cross-document jump. Same-document is
widely supported; Firefox falls back to a cross-fade on cross-document.

### 14. Kinetic typography over WebGL

The layered `name-3d-layer` system is already the seed of a signature. Pushing
it is cheaper, more distinctive, and holds 60fps better than adding a 3D scene
that every other portfolio has.

### 15. Live infrastructure data

The actual differentiator. Uptime, deploy status, real pipeline visualisation,
rendered in the warm-paper palette. Nobody owns "infrastructure made
beautiful"; everybody owns "spinning 3D cube."

## Suggested order

1 (closes out the perf audit), then straight to 11. Tier 2 is genuine
cleanliness but no visitor can perceive it, and 11 is the item that changes
what the site is.
