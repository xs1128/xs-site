# Visual regression tests

Chromatic uses Playwright to capture the running production build at desktop
(1440 × 1000) and mobile (390 × 844) sizes. The suite captures six states per
viewport: landing, about, site navigation, contact form, expanded blog, and blog
navigation. It never submits the contact form.

## Run locally

Use Node 22 or later. With the normal Supabase build environment configured:

```sh
npm ci
npx playwright install chromium
npm run build
npm run test:visual
```

Playwright starts and stops its own production server on port 3107. Keep that
port free. `npm test` runs only the existing Vitest unit tests; `test:visual`
runs the browser suite and creates Chromatic archives under `test-results/`.

To upload the captured archives, supply `CHROMATIC_PROJECT_TOKEN` through your
environment and run `npm run chromatic`. Never commit the token. Generated
reports and archives are ignored by Git, lint, and formatting.

## GitHub Actions and review

`.github/workflows/chromatic.yml` runs on pull requests from this repository,
pushes to `main`, and manual dispatch. It builds the current commit, captures
the pages, uploads to Chromatic, and retains test reports for 14 days. Fork PRs
are skipped because they cannot access the required secrets.

Connect a **Playwright** project to `xs1128/xs-site` in Chromatic and set these
repository Actions secrets:

- `CHROMATIC_PROJECT_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The first Chromatic build establishes a baseline. Subsequent visual changes
require review in Chromatic. The upload command uses `--exit-zero-on-changes`
so detected differences do not fail the upload job; Chromatic's separate UI
Tests check reports whether those differences have been accepted. Upload and
test execution errors still fail CI. No automatic acceptance is configured.

## Stable captures and coverage limits

Browser-side blog reads use fixed posts, series, and visit counts from
`tests/visual/blog-fixtures.ts`. Build-time post and series generation still
uses Supabase, just like the existing CI build. Dates, locale, timezone, and
viewport are fixed; reduced motion is enabled and fonts and finite animations
settle before each capture.

The changing WebGL canvas is ignored in pixel comparisons, while its layout
and controls remain covered. A browser assertion checks that its context is
available. Post/series detail pages, hover variants, other browsers, and
animation timing are not yet covered by this initial visual suite.

See the [Chromatic Playwright documentation](https://www.chromatic.com/docs/playwright/)
for the archive and review workflow.
