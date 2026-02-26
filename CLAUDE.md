# Personal Website - Landing Page

## Overview
This is a personal website/landing page built with modern web technologies.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Language**: TypeScript
- **Linting**: ESLint 10 with Next.js config
- **Styling**: Plain CSS (no framework currently)
- **Font**: Hubot Sans via @fontsource/hubot-sans

## Project Structure

```
src/
├── app/                    # App Router pages and layouts
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page (currently empty)
│   ├── error.tsx          # Error boundary
│   ├── api/               # API routes (empty)
│   └── (routes)/          # Route groups (empty)
├── components/
│   ├── ui/                # Reusable UI components (empty)
│   ├── features/          # Feature-specific components (empty)
│   └── layout/            # Layout components (empty)
├── lib/                   # Utility functions (empty)
├── hooks/                 # Custom React hooks (empty)
└── types/                 # TypeScript definitions (empty)
public/                     # Static assets (empty)
```

## Current State
- **Landing Page**: "Under Construction" page with centered image and text
- **Typography**: Hubot Sans font configured (weights 400 and 700)
- **Theme**: Light mode with off-white background (`#fafafa`) and blue accents (`#3b82f6`)
- **Assets**: `smoking_elizabeth.jpg` in public folder

## Personal Details
*To be filled in by owner*
- Name:
- Role/Title:
- Location:
- Contact:

## Planned Features
*To be defined - examples below*
- [ ] Hero/intro section
- [ ] About me
- [ ] Portfolio/projects showcase
- [ ] Blog/writing section
- [ ] Contact form
- [ ] Social links

## Design Preferences

### Color Scheme
- **Dark Mode**: Black background with warm orange/vermilion accents (muted, not neon - comfortable for reading)
- **Light Mode**: Off-white background with blue accents (bright but not harsh/spiky)
- Both modes designed for comfortable long-form reading

### Typography
- **Primary Font**: Hubot Sans (GitHub's open-source geometric font)
- **Font Import**: Installed via `@fontsource/hubot-sans` package (weights 400 and 700)
- **Font Usage**: Applied globally in `src/app/globals.css`

### Layout Style
- Minimal and clean
- Ample whitespace
- Simple sections with clear visual hierarchy

### CSS Framework
- **Current**: Plain CSS with inline styles
- **Tailwind CSS**: Not currently installed (can be added later if needed)

### Component Library
- To be determined based on needs (shadcn/ui, Radix UI, or custom components)

## Development Notes
- Path alias configured: `@/*` maps to `./src/*`
- TypeScript strict mode enabled
- ESLint extends Next.js core web vitals rules
- Node version requirement: check `package.json` engines field
