# Backlog

Outstanding work, ranked. Tiers 2–3 are cleanup on what exists; tier 4 is the
work that changes what the site *is*. Numbering is stable, so gaps are items
that shipped.

Everything here was verified against the codebase, not assumed. Items resolved
along the way are in `git log`, not repeated here.

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

### 19. Rate limiter is per-instance on serverless

`src/lib/rateLimit.ts` is an in-process `Map`, so the 5/hour limit applies per
instance, not globally. Deliberately not wired to Redis — that solves spam
nobody is sending and costs a service dependency. Swapping the `Map` for a
shared store is a one-function change if spam ever arrives.

### 20. CTA arrow depends on a font fallback

`↓` (U+2193) isn't in Roboto Mono, so a fallback always draws it. That forces
`adjustFontFallback: false` on `robotoMono` in `src/fonts/index.ts`, which
costs the font its `size-adjust` metrics (CLS 0.0087). Replace the glyph with
an SVG and the flag can go.

### 21. Focus outline sits too far off the contact fields

The orange `:focus-visible` ring floats with a visible gap around text inputs.
Cause is the global `outline-offset: 3px` in `globals.css` — fine for the
circular and text controls it was written for, wrong on a rectangular field
that already has a border. Tighten the offset for inputs/textarea rather than
changing the global, and keep a visible indicator (see the `outline: none` rule
in `CLAUDE.md`).

### 17. The contact circle doesn't read as tappable

`SpinningCircularText` is the only way to open the contact form, and nothing
about it says "press me". Current affordances, in full:

- a `+` glyph in the centre
- `cursor: pointer` on the ring
- a `scale(1.1)` hover on the centre glyph, inside `@media (hover: hover)`

That's it, and each one is weaker than it looks. The chars carry
`pointer-events: none`, so the hover scale only fires when the pointer is over
the centre glyph itself, not the ring — the large, obvious target gives no
feedback. On touch there is no hover at all, so mobile visitors get a spinning
name and a `+`. The continuous 20s `contactSpin` actively works against it:
perpetual rotation reads as decoration or a loading spinner, not a control.
Meanwhile the footer offers `mailto:hi@xsooi.com`, an unambiguous link, so the
path of least resistance routes around the form entirely.

It is also not a control in markup. `SpinningCircularText` renders a `<div
onClick>` with no `role`, no `tabIndex`, no `aria-label`, no key handler.
Keyboard and screen-reader users cannot open the contact form. Fixing the
affordance and fixing the accessibility are the same edit — promote it to a
real `<button>` with an accessible name first, then decorate.

Cues worth trying, cheapest first:

1. **Say what it does.** The ring currently repeats `Xinsheng Ooi • ` three
   times. Alternating in `Get in touch •` costs nothing and turns decoration
   into a label.
2. **Widen the hover target.** Move the hover response to the ring wrapper so
   the whole circle reacts, not just the glyph.
3. **A one-shot attention cue on entry.** A pulse or expanding ring the first
   time the section scroll-snaps into view, not a permanent loop — a
   permanently pulsing thing becomes decoration again within seconds.
4. **A tooltip on hover** — see item 18. Desktop only by construction; that
   component returns its child untouched when `(hover: hover)` fails, so it
   does nothing for the mobile case, which is the worse one.
5. **A static hint below the circle.** Least elegant, most reliable.

Gotcha: the catch-all block at the end of `animations.css` neutralises every
CSS animation and transition under reduced motion, so a CSS-only cue silently
disappears for those users. If the cue is load-bearing for comprehension, it
has to survive — either make it non-motion (a label, not a pulse), or drive it
from JS with its own `matchMedia('(prefers-reduced-motion: reduce)')` check,
the way `useScrollParallax` does.

Verify against real behaviour before picking. If any analytics exist, the
contact-form open rate versus `mailto:` click rate answers this directly.

### 18. Port the tooltip system from `../blog`

The blog repo has a finished one at `src/components/ui/Tooltip.tsx` (~230
lines) with its `.tooltip` styles in `globals.css` around line 356. It is
better than anything worth writing fresh here:

- portals to `document.body`, so no clipping by `overflow` or stacking context
- flips to the opposite placement when the preferred side won't fit, then
  clamps to an 8px viewport margin
- shared `SKIP_DELAY_MS` grace period across every instance, so moving along a
  row of social icons feels instant after the first 350ms open delay
- `role="tooltip"` + `aria-describedby`, opens on `:focus-visible`, closes on
  Escape, blur, and click
- measures with `offsetWidth`/`offsetHeight` rather than a rect, because the
  enter transition scales the tip and a scaled rect would offset the centering
- returns `children` untouched when `(hover: hover) and (pointer: fine)` fails,
  so touch devices get no dead tooltip

Site-specific work on the way in, per `CLAUDE.md`:

- The CSS does **not** go in `globals.css`. New file `src/styles/tooltip.css`,
  and it does nothing until it is imported in `layout.tsx`.
- Restyle to this repo's palette and easing tokens. No hand-typed
  `cubic-bezier(...)` — use `--ease-out-expo` / `--ease-in-out-soft`.
- The blog copy is written without semicolons; this repo uses them. Match the
  destination, not the source.
- Drop or re-anchor the blog's z-index comment — it sits above a 3D scene
  overlay at 10100 that doesn't exist here.
- Props are declared locally in the component. Leave them there rather than
  splitting them into `types/index.ts`; see item 6.

Obvious first consumers: the footer social icons (already `aria-label`-only)
and the contact circle in item 17.

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

Go to 12 next. It is the item that changes what the site is.

Item 17 is the exception to "Tier 3 is invisible." Most of that tier is
tidiness no visitor can perceive, but 17 sits on the only path to the contact
form and currently blocks keyboard users from it outright — treat the
accessibility half as not-optional and take it whenever contact code is next
open. 18 is a prerequisite only if the tooltip route is chosen for 17; it is
otherwise independent and can wait.

The rest can be picked off opportunistically when touching nearby code.
