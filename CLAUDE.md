# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This project is the public-facing blog frontend built with Next.js, TypeScript, and Supabase. It displays blog posts, series, and features an interactive 3D terminal cube. This repository only contains read-only functionality for displaying content from Supabase.

## Note

The admin panel for managing blog content has been separated into a separate repository at `../blog-admin`. This repository only contains the public blog frontend.

## Documentation

All detailed documentation is located in the `./docs` directory. When working on this codebase, always refer to these files:

### Setup & Configuration
- **[Project Structure](./docs/project-structure.md)** - File/directory layout
- **[Supabase Setup](./docs/supabase-setup.md)** - Database setup (for reference only)
- **[Supabase Usage](./docs/supabase-usage.md)** - Client patterns for read operations

### Features & Components
- **[Blog Features](./docs/blog-features.md)** - Blog post pages and features
- **[UI Components](./docs/ui-components.md)** - Footer, home page, and UI elements
- **[3D Animation](./docs/3d-animation.md)** - Interactive terminal cube with React Three Fiber

### Architecture & Standards
- **[CSS Architecture](./docs/css-architecture.md)** - Styling system and best practices
- **[Standards](./docs/standards.md)** - Code quality and testing guidelines

### Operations
- **[Deployment](./docs/deployment.md)** - Deployment and debugging guide

## 3D Animation Canvas

The blog features an interactive 3D terminal cube built with React Three Fiber.

For detailed documentation, see **[3D Animation](./docs/3d-animation.md)**.

**Quick Overview**:
- Displays blog stats on 6 faces (posts, categories, pictures, last update, etc.)
- Terminal-style black cube with glowing green text
- Drag to rotate, scroll to zoom
- Real-time data from Supabase
- Vintage yellow background with floating particles

**Key Files**:
- `src/components/blog/ThreeDCanvas.tsx` - Canvas wrapper
- `src/components/blog/scene/InteractiveScene.tsx` - Main 3D scene
- `src/components/blog/scene/TerminalCube.tsx` - The cube
- `src/components/blog/scene/useTerminalStats.ts` - Data hook
- `src/components/blog/scene/createFaceTexture.ts` - Texture helper

## Usage

When starting any task, always:
1. Read the relevant documentation file in `./docs`
2. Follow the patterns and conventions described in the documentation
3. Keep the documentation updated as you make changes to the codebase
