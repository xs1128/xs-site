# Migration: fold `blog` into `site`

Plan for collapsing the two-project multi-zone setup into a single Next.js
application. Written 2026-08-16. Nothing here has been executed yet.

Every claim about the current state was checked against the two repos, not
assumed. File references are accurate as of `site@65e6564` and `blog@216292c`.

## Decision

Merge `xs1128/blog` into `xs1128/site` as a route segment at `/blog`. One repo,
one Next app, one Vercel project.

The alternative that Vercel now recommends — its Microfrontends product — was
evaluated and rejected. Reasoning is in "Alternatives considered" below. The
short version: microfrontends buy independent deployment across teams, this is
a one-person site, and the cost is paid three times over.

## What is wrong with the current setup

`site` rewrites `/blog/*` to `https://blog.xsooi.com/blog/*`
(`site/next.config.ts:5-11`) and `blog` sets `basePath: '/blog'`
(`blog/next.config.ts:4`). That is the standard Next.js Multi-Zones pattern and
was a reasonable call when it shipped. It has six defects.

**1. Every blog request makes a second outbound trip.** A rewrite to a public
domain means user to edge (site), to the site function, back out over the public
internet, to edge (blog), to the blog function. Vercel's own routing would do
this inside the network on the same request.

**2. Bandwidth is billed twice.** The rewrite fetches from the child and
re-serves it, so `site` and `blog` each consume transfer for the same bytes.
Neither Vercel's nor Next.js' docs mention this. On Hobby the allowance is
100 GB/month, and the blog ships three.js.

**3. Preview deployments are fiction.** The rewrite destination is hardcoded to
production. Every `site` preview branch renders the _production_ blog, and no
`blog` preview is ever reachable under `www`. There is no commit pairing between
the two projects, so a change spanning both cannot be reviewed before it is
live. Parameterising the destination URL does not fix this: preview URLs carry
Deployment Protection, which breaks rewrites to them.

**4. The duplicate host has no crawl rules.** `blog.xsooi.com/blog` serves the
identical pages. Worse, `basePath` moves the output of `blog/src/app/robots.ts`
to `/blog/robots.txt`, so `blog.xsooi.com/robots.txt` is a 404. Crawlers read
robots only at the host root, so the duplicate is entirely unguarded. There is
no canonical pointing home either.

**5. `basePath` leaks into hand-written strings.**
`blog/src/components/blog/scene/useTerminalStats.ts:17` hardcodes
`/blog/api/visits` with a comment explaining that basePath does not apply to
client fetches. `blog/src/app/layout.tsx:26-33` hardcodes `/blog/favicon.ico`
and friends on top of a `metadataBase` that already carries `/blog` — verify
whether that currently emits `/blog/blog/favicon.ico`.

**6. `NEXT_PUBLIC_SITE_URL` is a URL with a path.** `blog/.env.local:5` sets it
to `https://www.xsooi.com/blog`, which feeds `metadataBase` via
`blog/src/lib/seo.ts:10`. Join semantics for a base URL with a path are subtle
and are the root of defect 5.

A seventh item is not a defect but is worth naming: navigation between the site
and the blog is a full page reload in both directions, and always will be while
they are separate deployments.

## Collision surface

Measured, not estimated.

**CSS is the only real work.** Six `:root` custom properties are defined in both
`site/src/app/globals.css` and `blog/src/app/globals.css`: `--color-accent`,
`--color-border`, `--font-primary`, `--transition-fast`, `--transition-medium`,
`--transition-slow`. Both files also carry global `*`, `html`, and `body`
resets. Total CSS across both repos is about 2,984 lines.

**One duplicate filename**, `ui/Tooltip.tsx`. `FullScreenNav` exists in both but
at different paths (`site/src/components/navigation/` versus
`blog/src/components/ui/`), so it does not collide, though unifying the two is
worth doing later.

**No version tax.** Both are Next 16 and React 19.

**No route collisions.** `site` owns `/`, `/robots.txt`, `/sitemap.xml`, and
`/api/contact`. `blog` moves wholesale under `/blog`.

**Bundle size is not a concern.** Next code-splits per route, so three.js and
`@react-three/*` ship only on `/blog/*` either way. The cost is build time, not
user bytes.

## Steps

1. `git subtree add` the `blog` repo into `site` so its history survives the
   merge rather than being flattened into one commit.

2. Move `blog/src/app/{page,home-client,posts,series,api}` to
   `site/src/app/blog/`. Blog's `layout.tsx` becomes a _nested_ layout at
   `src/app/blog/layout.tsx`, not a second root layout.

3. Namespace blog's CSS. Scope the six colliding custom properties and the
   global resets under a class on the blog layout's root element. This is the
   bulk of the migration; budget accordingly.

4. Merge `src/components`, `src/lib`, `src/hooks`, and `src/types`. Rename one
   of the two `Tooltip` components.

5. Merge dependencies into one `package.json`. `blog` currently carries both
   `bun.lock` and `package-lock.json`; keep `package-lock.json` to match `site`.
   Blog inherits site's prettier, vitest, and `.github` CI, none of which it
   has today.

6. Delete `blog/src/app/robots.ts`. One domain gets one robots.txt, owned by
   `site`. Move blog's `sitemap.ts` to `src/app/blog/sitemap.ts` so it emits
   `/blog/sitemap.xml`, which `site/src/app/robots.ts:14` already advertises and
   which only now becomes true.

7. Set `metadataBase` to `https://www.xsooi.com` with no path. Update the
   `absoluteUrl()` call sites in blog's sitemap to pass paths that carry
   `/blog` themselves.

8. Keep blog's favicon independent. Put its icons at `public/blog/` and declare
   them via `metadata.icons` in `src/app/blog/layout.tsx`. Next injects
   `<link rel="icon">` for blog routes, which overrides the root icon that
   `site/src/app/icon.png` provides. Do not use the `app/favicon.ico` file
   convention inside the blog segment — it emits at the domain root. Browsers
   cache favicons aggressively; append `?v=2` while testing.

9. Delete `basePath` and the development-only `redirects()` from blog's config.
   Delete the `rewrites()` block at `site/next.config.ts:5-11` entirely, keeping
   `headers()`. Drop the now-obsolete basePath comments at
   `blog/src/components/blog/scene/useTerminalStats.ts:15` and
   `blog/src/components/ui/AnimatedButton.tsx:125`.

10. Move blog's environment variables into the `site` Vercel project: the
    Supabase pair, `NEXT_PUBLIC_GOATCOUNTER_CODE`, `VISITS_OFFSET`, and
    `REVALIDATE_SECRET`.

11. Fix revalidation. `blog/src/app/api/revalidate/route.ts:15-16` calls
    `revalidatePath('/', 'layout')` and `revalidatePath('/sitemap.xml')`. Those
    are correct today only because `basePath` makes internal paths
    root-relative. Once the routes live at `/blog/*` they must become
    `revalidatePath('/blog', 'layout')` and `revalidatePath('/blog/sitemap.xml')`
    or the admin panel's "Refresh Blog" button silently stops working. Update
    `blog/docs/deployment.md` to match when that file moves across.

12. Repoint `blog-admin`. It is cleanly env-driven, so only values change:
    `BLOG_REVALIDATE_URL` to `https://www.xsooi.com/blog/api/revalidate` and
    `NEXT_PUBLIC_BLOG_URL` to `https://www.xsooi.com/blog`. No code edits.

13. Delete the `blog` Vercel project. Either remove `blog.xsooi.com` or keep it
    configured as a 308 redirect to `www.xsooi.com/blog` — do not leave it
    serving content, or defect 4 survives the migration untouched.

14. Archive the `blog` GitHub repo rather than deleting it. The history now
    lives in two places and there is no reason to destroy either copy.

Roughly a day of work, most of it step 3.

## What this costs

Every push rebuilds both applications. With three.js in the dependency tree that
is a slower CI loop than blog-only builds are today. For a personal site this is
an easy trade, but it is the one genuine argument for keeping the split: if the
landing page is being iterated on twenty times a day, the wait is felt.

Independent deployment is also lost. For a single maintainer this is worth
approximately nothing, which is the entire basis for the decision.

## Alternatives considered

**Vercel Microfrontends, two repos.** The current recommendation in Vercel's
knowledge base, and it does fix defects 1 through 4 — routing happens inside
Vercel's network on the same request, and deployment pairing across branch and
deployment URLs is handled for us.

It was rejected on cost. `withMicrofrontends` does not support `basePath`
("Next.js applications that use `basePath` are not supported right now"), so the
same `src/app/blog/` restructure is required either way — the directory move is
not avoided, it is merely accompanied by extra machinery. On top of that
restructure it adds: a `microfrontends.json` that a polyrepo child must pull at
build time or fail, asset-prefix handling for `public/`, a local development
proxy on a third port, and Hobby's metering.

That last item is the sharpest edge. Hobby includes 50,000 routed requests per
month with no overage tier. Routed requests are not pageviews — every asset and
JS chunk under `/blog/*` counts. At fifteen to thirty requests per view, 50,000
is on the order of 2,000 pageviews per month. Check GoatCounter before treating
that as headroom.

Vercel's own documentation makes the case against: "Microfrontends may add
additional complexity to your development process. To improve developer
velocity, consider alternatives like Monorepos, Feature flags, faster
compilation with Turbopack." A Next.js maintainer put it more bluntly in
discussion #34616 — you may not need two Next.js instances.

**Monorepo with two apps, still on microfrontends.** The worst of the three. It
fixes local development ergonomics via Turborepo's proxy and keeps every runtime
cost: routed-request metering, asset prefixes, deployment pairing. Only worth it
if independent deploys are genuinely wanted.

**Fixing multi-zone in place.** Parameterise the rewrite destination, remove the
public blog domain, clean up `NEXT_PUBLIC_SITE_URL`. About an hour of work and
it addresses defects 4, 5, and 6. It cannot address 1 or 2 at all, and cannot
address 3 because of Deployment Protection on preview URLs. Reasonable as a
stopgap if the merge slips; not a destination.

## Escape hatch

Steps 2 and 3 — real `/blog/*` routes with no `basePath`, and namespaced CSS —
are the foundation of every option above, not just this one. If the merge turns
out to be wrong, converting to microfrontends afterwards is configuration work
rather than another directory move. The expensive part of this migration is not
specific to the choice being made.

## References

- [Serving multiple projects under one domain](https://vercel.com/kb/guide/how-can-i-serve-multiple-projects-under-a-single-domain)
- [Vercel Microfrontends: limits and pricing](https://vercel.com/docs/microfrontends)
- [Microfrontends path routing](https://vercel.com/docs/microfrontends/path-routing)
- [Microfrontends local development and polyrepo setup](https://vercel.com/docs/microfrontends/local-development)
- [Next.js Multi-Zones](https://nextjs.org/docs/pages/guides/multi-zones)
- [Next.js app icons metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- [Multi-zone bandwidth double-billing](https://dev.to/matthewwilson/eliminating-additional-bandwidth-charges-for-multi-zone-sites-on-vercel-1k5a)
- [Deployment Protection breaks multi-zone rewrites](https://community.vercel.com/t/vercel-authentication-breaks-multi-zone-rewrite-domain/42731)
- [next.js discussion #34616](https://github.com/vercel/next.js/discussions/34616)
