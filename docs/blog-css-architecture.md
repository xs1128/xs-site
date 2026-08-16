# CSS Architecture & Refactoring

## Overview

The codebase has been refactored from inline styles to modular CSS with global utility classes. This improves maintainability, reduces bundle size, and provides consistent styling across components.

## CSS File Structure

### `src/styles/breakpoints.ts` - Standardized Breakpoints

```typescript
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
} as const;

export const media = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  // ... etc
};
```

### `src/styles/blog.css` - Blog Component Styles

- Post content typography (headings, paragraphs, lists, code blocks)
- Table of contents styling
- Footer responsive layout
- Reading progress bar
- Featured series cards

### `src/styles/admin.css` - Admin Panel Styles

- Form inputs, textareas, selects
- Button variants (primary, secondary, danger)
- Error message styling
- Card layouts
- Admin header/navigation

### `src/app/globals.css` - Global Styles & Utilities

- CSS custom properties (colors, fonts, spacing)
- Utility classes (flex, spacing, typography)
- Responsive utility classes
- Animation keyframes
- Hover effect utilities

## Custom Hooks

### `src/hooks/useBreakpoint.ts` - Responsive Detection

```typescript
// Check if screen matches breakpoint
const isTablet = useBreakpoint('md');

// Convenience hook for mobile detection
const isMobile = useIsMobile(); // < 768px
```

Replaces all `window.innerWidth` checks with performant `matchMedia()` API.

### `src/hooks/useScrollDetection.ts` - Scroll Tracking

```typescript
const scrollProgress = useScrollProgress(); // 0-100
const footerVisible = useFooterVisibility(); // boolean
```

### `src/hooks/useActiveHeading.ts` - TOC Active State

```typescript
const activeId = useActiveHeading(headings);
```

## Component Refactoring Examples

### Footer (`src/components/ui/Footer.tsx`)

**Before**: 421 lines with inline styles and state
**After**: 193 lines (54% reduction)

Changes:

- Removed `isWrapped` and `isVerticalStack` state
- Uses `useIsMobile()` hook for responsive behavior
- All inline styles moved to `blog.css` classes

**Footer CSS Classes**:

```css
.footer-top-section {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: clamp(32px, 5vw, 64px);
}

.footer-section {
  width: 18%;
  min-width: 160px;
}

.footer-section-links {
  width: 14%;
  min-width: 120px;
}

.footer-social-button {
  width: 32px;
  height: 32px;
  background-color: #e4d9c2;
  color: #2a2f35;
}

.footer-social-button:hover {
  transform: scale(1.1);
  background-color: #2a2f35;
  color: #e4d9c2;
}
```

### BlogPageHeader (`src/components/blog/BlogPageHeader.tsx`)

- Replaced `isSmallScreen` state with `useIsMobile()` hook
- Removed resize event listener

### PostDetailClient (`src/app/posts/[slug]/post-detail-client.tsx`)

**Before**: 220 lines
**After**: 173 lines (21% reduction)

- Uses `useScrollProgress()` and `useFooterVisibility()` hooks
- Uses `useIsMobile()` for responsive sidebar
- Scroll progress bar sticks above footer when visible

### TableOfContents (`src/components/blog/TableOfContents.tsx`)

- Integrated `useActiveHeading()` hook for scroll tracking
- Active heading highlighted with accent color
- Smooth scroll to section on click

## Responsive Design Standards

### Standard Breakpoints

- `sm`: 640px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (desktops)
- `xl`: 1280px (large desktops)

### Mobile Detection

Uses `< 768px` (md breakpoint)

### Pattern

Always use `useIsMobile()` or `useBreakpoint()` instead of `window.innerWidth` checks.

## CSS Best Practices

### Use CSS Classes

```tsx
// Good
<footer className="footer">
  <div className="footer-top-section">
    <div className="footer-section">...</div>
  </div>
</footer>

// Bad (inline styles)
<footer style={{ backgroundColor: '#F2E9D8' }}>
  <div style={{ display: 'flex', gap: '24px' }}>
    <div>...</div>
  </div>
</footer>
```

### Responsive Utilities

```css
/* Mobile-first approach */
.component {
  padding: 16px;
}

@media (min-width: 768px) {
  .component {
    padding: 32px;
  }
}

/* Or use hover detection */
@media (hover: hover) {
  .button:hover {
    transform: scale(1.1);
  }
}
```

### clamp() for Responsive Sizing

```css
font-size: clamp(12px, 1.8vw, 18px);
padding: clamp(16px, 3vh, 32px);
gap: clamp(24px, 4vw, 48px);
```

## Migration Examples

### Before: Footer with Inline Styles

```typescript
const [isVerticalStack, setIsVerticalStack] = useState(false);

useEffect(() => {
  const checkVerticalStack = () => {
    setIsVerticalStack(window.innerWidth < 550);
  };
  checkVerticalStack();
  window.addEventListener('resize', checkVerticalStack);
  return () => window.removeEventListener('resize', checkVerticalStack);
}, []);

const topSectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: isVerticalStack ? 'column' : 'row',
  gap: '24px',
};
```

### After: Footer with CSS Classes

```typescript
import { useIsMobile } from '@/hooks/useBreakpoint'

export default function Footer() {
  const isMobile = useIsMobile()

  return (
    <footer className="footer">
      <div className="footer-top-section">
        <div className="footer-section">...</div>
      </div>
    </footer>
  )
}
```

```css
.footer-top-section {
  display: flex;
  flex-direction: row;
  gap: clamp(32px, 5vw, 64px);
}

@media (max-width: 767px) {
  .footer-top-section {
    flex-direction: column;
  }
}
```

## Benefits

1. **Reduced Bundle Size**: CSS classes are shared, inline styles repeated
2. **Better Performance**: `matchMedia()` more efficient than resize listeners
3. **Easier Maintenance**: Styles in CSS files, not scattered in components
4. **Consistent Responsive Behavior**: Standard breakpoints across all components
5. **Cleaner Components**: 40-54% reduction in component file sizes
6. **Better DX**: Easier to theme and update styles globally
