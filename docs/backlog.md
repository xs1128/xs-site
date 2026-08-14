# Backlog

Outstanding work, ranked. Tier 1 is live defects; tier 3 is cleanup on what
exists; tier 4 is the work that changes what the site _is_. Tier 2 is empty,
the architecture items all shipped. Numbering is stable, so gaps are items that
shipped.

Everything here was verified against the codebase, not assumed. Items resolved
along the way are in `git log`, not repeated here.

## Tier 1: SEO decisions worth keeping

The defects here shipped on 2026-08-14 and were verified live. What remains is
the reasoning, so settled calls don't get relitigated.

**www is canonical.** The apex 308s to www, so every emitted URL carries the
`www.`: `NEXT_PUBLIC_SITE_URL` and its fallback in `layout.tsx`, `robots.ts`
and `sitemap.ts`, plus the same var on the blog project. Keep the apex to www
redirect. Do not add a second hop, and do not let a canonical point at a URL
that redirects.

### 24. `blog.xsooi.com` is directly reachable. Won't fix

`blog.xsooi.com/blog` serves 200 alongside the proxied copy at
`www.xsooi.com/blog`, so the content has two hostnames. It self-canonicals to
the www URL, which is Google's documented fix for cross-domain duplicates and
is verified working. Closing this: every way of removing the second hostname is
worse than the crawl budget it costs.

Investigated and rejected on 2026-08-14, so it doesn't get reopened:

- **301 on `Host: blog.xsooi.com`.** Loops. The site rewrites `/blog` by
  proxying to that host, so the proxy fetch takes the 301 to
  `www.xsooi.com/blog` and rewrites again.
- **`noindex` on the subdomain.** The rewrite proxies the response, headers
  included, so it lands on the real pages.
- **Detach the domain, rewrite to `blog-xsooi-projects.vercel.app`.** That URL
  is behind Vercel Deployment Protection (302 to SSO), so the proxy gets a
  login page. Disabling protection does not help: Vercel serves `.vercel.app`
  with `x-robots-tag: noindex`, which the rewrite would pass through and
  deindex `www.xsooi.com/blog`.
- **Disallow-all `robots.txt` at the root of `blog.xsooi.com`.** Safe for `www`,
  since robots.txt is per-host, but it stops Google reading the canonical on
  those URLs, which is what performs the consolidation.

Distinguishing a proxy fetch from a real visit needs `x-forwarded-host`.
Measured on production, it does not work: conditional header rules keyed on
that header returned `direct` for both `blog.xsooi.com/blog` and
`www.xsooi.com/blog`, so a rule meant for the subdomain fires on the real
pages too. Response headers pass through the rewrite unchanged, confirmed by
diffing both hosts, which is why every header-based fix leaks.

Full elimination means merging the blog into this repo as a native `/blog`
route: one project, no rewrite, no subdomain. Not done, and not free. The blog
brings `@react-three/fiber`, `drei` and `@fontsource`, all three listed under
"do not re-add" here; `basePath: '/blog'` has to come out; Supabase,
`/api/revalidate` and the `blog-admin` project all need rewiring; and the blog
stops deploying independently of the portfolio. Worth it only if the second
hostname starts causing real problems.

## Tier 3 — polish

### 7. OG card contradicts site metadata

`og-image.png` advertises Kubernetes / CI-CD / Cloud Infrastructure /
Observability. `layout.tsx` metadata and the JSON-LD `knowsAbout` say Python /
Bash / Docker / Cloudflare. The card is what people see when the site is
shared — the two should agree.

### 10. Pre-commit formatting hook

Prettier shipped and CI runs `format:check`; a Husky/lint-staged hook is the
only part left, and only if commit-time enforcement is wanted.

### 11. Broaden test coverage

Current tests cover the security-sensitive and regression-prone paths only.
Components have none. Worth adding only where behaviour is genuinely tricky,
not for coverage's sake.

### 19. Rate limiter is per-instance on serverless

`src/lib/rateLimit.ts` is an in-process `Map`, so the 5/hour limit applies per
instance, not globally. Deliberately not wired to Redis — that solves spam
nobody is sending and costs a service dependency. Swapping the `Map` for a
shared store is a one-function change if spam ever arrives.

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
4. **A tooltip on hover** — `src/components/ui/Tooltip.tsx` is in place.
   Desktop only by construction: it returns its child untouched when
   `(hover: hover) and (pointer: fine)` fails, so it does nothing for the
   mobile case, which is the worse one.
5. **A static hint below the circle.** Least elegant, most reliable.

Gotcha: the catch-all block at the end of `animations.css` neutralises every
CSS animation and transition under reduced motion, so a CSS-only cue silently
disappears for those users. If the cue is load-bearing for comprehension, it
has to survive — either make it non-motion (a label, not a pulse), or drive it
from JS with its own `matchMedia('(prefers-reduced-motion: reduce)')` check,
the way `useScrollParallax` does.

Verify against real behaviour before picking. If any analytics exist, the
contact-form open rate versus `mailto:` click rate answers this directly.

### 26. `site.webmanifest` is never linked

`public/site.webmanifest` exists and nothing references it, so no `manifest`
reaches the served HTML. Add `manifest: '/site.webmanifest'` to the metadata
object. While there: no `theme-color` is emitted either, and
`metadata.themeColor` has been deprecated since Next 14, so it belongs in a
[`viewport` export](https://nextjs.org/docs/app/api-reference/functions/generate-viewport).

### 27. Sitemap claims it changed on every build

`sitemap.ts:9` sets `lastModified: new Date()`, so each deploy asserts the page
changed whether or not it did. A hardcoded date or the git commit time is
honest; a false freshness signal is worth less than none.

### 28. The 404 self-canonicals to the homepage

`not-found.tsx` sets no metadata, so it inherits `alternates.canonical` from the
root layout and every missing URL declares itself canonical to `/`. Give it
`robots: { index: false }`.

### 30. No Search Console verification

Nothing measurable until this exists. Use `metadata.verification.google` or
DNS, but register the host chosen in 20, or a Domain property covering both.

### 31. `keywords` metadata is dead weight

`layout.tsx:21-31`. Google has [disregarded the keywords meta
tag](https://developers.google.com/search/blog/2009/09/google-does-not-use-keywords-meta-tag)
since 2009. Harmless, but it publishes the target terms to anyone reading the
source and moves nothing. Drop when convenient.

### 32. Entity signals are the real lever

The JSON-LD `Person` is the strongest SEO asset here, and `sameAs`
(`layout.tsx:103-108`) is what builds knowledge-panel eligibility. Add every
profile that names you identically. Wrapping it in `ProfilePage` is the correct
type for a personal site. Do not expand `knowsAbout`, which at ten entries is
already at the edge of stuffing.

Ruled out, so it doesn't get re-proposed: `llms.txt` (Google's June 2026 docs
say Search does not use it, and its AI guidance lists it as unnecessary for AI
Overviews and AI Mode; Anthropic and Perplexity do read it, but that argues for
developer docs, not a portfolio); `changefreq` and `priority` tuning in the
sitemap (Google ignores both); a sitelinks `SearchAction`, which needs a search
this site does not have.

### 33. `Host` is not a robots.txt directive

`robots.ts`. Google supports four fields: `user-agent`, `allow`, `disallow`,
`sitemap`. `Host` is Yandex-only and currently names the losing side of 20.
Harmless; remove with 20 or leave.

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

Tier 1 is closed. The SEO work left is tier 3, and of it only 30 is worth doing
soon: without Search Console there is no way to see whether any of this landed.

Then 12. It is the item that changes what the site is, and the one-pager will
never rank for anything but the name, so the blog and the case-study layer are
the same bet.

Item 17 is the exception to "Tier 3 is invisible." Most of that tier is
tidiness no visitor can perceive, but 17 sits on the only path to the contact
form and currently blocks keyboard users from it outright — treat the
accessibility half as not-optional and take it whenever contact code is next
open. The tooltip it can lean on already shipped.

The rest can be picked off opportunistically when touching nearby code.
