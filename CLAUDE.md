# CLAUDE.md

Guidance for Claude Code (claude.ai/code) in this repo.

## Overview

Public blog frontend. Next.js + TypeScript + Supabase. Shows posts, series, interactive 3D terminal cube. Read-only — displays Supabase content.

## Note

Admin panel moved to separate repo `../blog-admin`. This repo = public frontend only.

## Documentation

Detailed docs in `./docs`. Always refer to these:

### Setup & Configuration
- **[Project Structure](./docs/project-structure.md)** - File/directory layout
- **[Supabase Setup](./docs/supabase-setup.md)** - Database setup (reference only)
- **[Supabase Usage](./docs/supabase-usage.md)** - Client patterns for reads

### Features & Components
- **[Blog Features](./docs/blog-features.md)** - Blog post pages and features
- **[UI Components](./docs/ui-components.md)** - Footer, home page, UI elements
- **[3D Animation](./docs/3d-animation.md)** - Terminal cube with React Three Fiber

### Architecture & Standards
- **[CSS Architecture](./docs/css-architecture.md)** - Styling system + best practices
- **[Standards](./docs/standards.md)** - Code quality + testing

### Operations
- **[Deployment](./docs/deployment.md)** - Deploy + debug guide

## 3D Animation Canvas

Interactive 3D terminal cube, React Three Fiber.

Detail: **[3D Animation](./docs/3d-animation.md)**.

**Quick Overview**:
- Blog stats on 6 faces (posts, categories, pictures, last update, etc.)
- Terminal-style black cube, glowing green text
- Drag rotate, scroll zoom
- Real-time Supabase data
- Vintage yellow background, floating particles

**Key Files**:
- `src/components/blog/ThreeDCanvas.tsx` - Canvas wrapper
- `src/components/blog/scene/InteractiveScene.tsx` - Main 3D scene
- `src/components/blog/scene/TerminalCube.tsx` - The cube
- `src/components/blog/scene/useTerminalStats.ts` - Data hook
- `src/components/blog/scene/createFaceTexture.ts` - Texture helper

## Usage

Starting any task:
1. Read relevant doc in `./docs`
2. Follow patterns/conventions in the docs
3. Keep docs updated as you change code
