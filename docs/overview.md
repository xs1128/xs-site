# Overview

A personal blog with Supabase backend integration, featuring an admin panel for managing posts, series, pictures, and site settings.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with Turbopack
- **UI**: React 19 + TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Modular CSS with shared constants in `src/styles/`
- **Fonts**: Hubot Sans (primary), Roboto Mono (code)

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
```

**CRITICAL**: Always run `npm install` and `npm run build` before pushing.

## Environment Setup

Create `.env.local` with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Documentation

- **@project-structure** - File/directory layout and component organization
- **@supabase-setup** - Database schema, RLS policies, and authentication setup
- **@supabase-usage** - Client/server patterns and CRUD operations
- **@authentication** - Admin authentication system and flow
- **@admin-panel** - Admin components, patterns, and styling
- **@blog-features** - Blog post pages, navigation, and features
- **@ui-components** - Footer, home page, and UI elements
- **@css-architecture** - Styling system, hooks, and best practices
- **@standards** - Code quality, testing, and common tasks
- **@deployment** - Deployment considerations and debugging
