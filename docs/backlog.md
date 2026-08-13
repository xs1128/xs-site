# Backlog

Outstanding work, ranked. Tiers 2–3 are cleanup on what exists; tier 4 is the
work that changes what the site *is*.

Everything here was verified against the codebase, not assumed. Items resolved
along the way are in `git log`, not repeated here.

## Tier 1 — done

All three items are implemented. Kept here briefly so the history is legible.

### 1. Fonts migrated to `next/font` — done

`next/font/local` with latin-subset woff2 files in `src/fonts/`, exposed as
`--font-roboto-mono` / `--font-hubot-sans` and consumed by the existing
`--font-primary` / `--font-secondary` tokens. Fonts are now preloaded with
`size-adjust` fallback metrics, which is the FOUT/CLS fix.

Found on the way: Hubot Sans is used at `font-weight: 700` but only 400 was
ever loaded, so the browser had been synthesising bold. The real 700 face is
now loaded.

`@fontsource/*` uninstalled.

### 2. Rate limiter extracted — done, with a caveat

`src/lib/rateLimit.ts`, still an in-process `Map`. On serverless the limit
therefore applies per instance, not globally.

Deliberately *not* wired to Redis. That solves spam nobody is currently
sending, and costs a service dependency to do it. The module is small enough
that swapping the `Map` for a shared store is a one-function change if spam
ever arrives.

### 3. Tests — done

Vitest + Testing Library, 15 tests, wired into CI:

- `useFocusTrap` — container focus, both wrap directions, Escape, focus restore
- `rateLimit` — limit boundary, key isolation, window expiry
- `api/contact` — happy path, missing field, bad email, oversize body, CRLF
  stripping, 429 on the sixth request, and that provider errors never reach
  the client

The scroll-listener regression from the original audit is *not* covered.
Asserting "exactly one listener" needs either a spy on the container or a
render-count harness, and neither reads clearly enough to be worth it. The
`useEffect` shape makes the leak hard to reintroduce by accident.

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

### 11. Broaden test coverage

Current tests cover the security-sensitive and regression-prone paths only.
Components have none. Worth adding only where behaviour is genuinely tricky,
not for coverage's sake.

## Tier 4 — direction

None of the above moves the needle on what the portfolio actually does. This
tier does.

### 12. A work / case-study layer

The biggest structural gap. Three sections, no projects. Award-tier portfolios
are roughly 70% work. For a DevOps portfolio that means infra case studies with
real numbers: deploy time before and after, cost saved, MTTR.

### 13. CSS scroll-driven animations

`animation-timeline: view()` / `scroll()` replaces the IntersectionObserver and
rAF JS with compositor-threaded CSS. Around 84% global support mid-2026; gate
with `@supports (animation-timeline: scroll())`. Directly serves the
60fps-on-mid-range-Android bar that award juries score.

### 14. View Transitions API

For the nav overlay and the `/blog` cross-document jump. Same-document is
widely supported; Firefox falls back to a cross-fade on cross-document.

### 15. Kinetic typography over WebGL

The layered `name-3d-layer` system is already the seed of a signature. Pushing
it is cheaper, more distinctive, and holds 60fps better than adding a 3D scene
that every other portfolio has.

### 16. Live infrastructure data

The actual differentiator. Uptime, deploy status, real pipeline visualisation,
rendered in the warm-paper palette. Nobody owns "infrastructure made
beautiful"; everybody owns "spinning 3D cube."

## Suggested order

Tier 1 is closed, which means the cleanup with real user impact is done.

Go to 12 next. Tier 2 and 3 are genuine tidiness but no visitor can perceive
any of it, and 12 is the item that changes what the site is. The rest can be
picked off opportunistically when touching nearby code.
