# xsooi.com

Xinsheng Ooi’s portfolio and blog: an animated landing page, contact form, and
Supabase-powered posts and series, deployed on Vercel.

[![Portfolio status](https://img.shields.io/website?url=https%3A%2F%2Fwww.xsooi.com%2F&label=portfolio&up_message=online&down_message=offline)](https://www.xsooi.com/)
[![Blog status](https://img.shields.io/website?url=https%3A%2F%2Fwww.xsooi.com%2Fblog&label=blog&up_message=online&down_message=offline)](https://www.xsooi.com/blog)
[![CI](https://github.com/xs1128/xs-site/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/xs1128/xs-site/actions/workflows/ci.yml)
[![Chromatic](https://github.com/xs1128/xs-site/actions/workflows/chromatic.yml/badge.svg?branch=main)](https://github.com/xs1128/xs-site/actions/workflows/chromatic.yml)

![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=black)

Website badges show cached HTTP availability, not blog-data or contact-form health.
Workflow badges track `main`.

## Quick start

Use Node.js 22 and npm.

```sh
git clone https://github.com/xs1128/xs-site.git
cd xs-site
npm install
cp .env.example .env.local
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
for blog content; both are required for production builds. Use the public anon
key with Supabase Row Level Security enabled. Set `RESEND_API_KEY` to enable
contact emails; without it the contact API returns `503`.

```sh
npm run dev
```

Open [localhost:3000](http://localhost:3000). See [.env.example](.env.example)
for optional analytics, revalidation, and visit-count settings.

## Development

```sh
npm run lint          # ESLint
npm test              # Vitest unit tests
npm run format:check  # Prettier (npm run format to fix)
npm run build         # Production build and TypeScript validation
npm run start         # Serve the production build
```

Run install, build, tests, lint, and formatting checks before pushing.
For Playwright captures and Chromatic reviews, see [Visual testing](docs/visual-testing.md).

## Deployment & documentation

Set the Supabase variables in both Vercel **Production** and **Preview** environments.
`NEXT_PUBLIC_SITE_URL` defaults to `https://www.xsooi.com`; the blog lives at `/blog`.
Contact email uses Resend, with rate limiting applied per server instance.

- [Deployment](docs/blog-deployment.md) — environment scopes, security headers, and cache revalidation.
- [Visual testing](docs/visual-testing.md) — browser setup, CI secrets, and snapshot coverage.
- [Code conventions](CLAUDE.md) — component, styling, accessibility, and routing rules.
