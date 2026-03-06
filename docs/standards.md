# Code Quality Standards

## Standards

1. **TypeScript Strict Mode**: Always enabled
2. **ESLint**: Follow Next.js recommended config
3. **No Unused Imports**: Remove all unused imports
4. **No Unused Variables**: Remove dead code before committing
5. **Component Organization**: One component per file
6. **Naming Conventions**:
   - Components: PascalCase (`SeriesMultiSelect.tsx`)
   - Utilities: camelCase (`mutations.ts`)
   - Hooks: camelCase with `use` prefix (`useReadingProgress.ts`)
   - Types: PascalCase (`Series`)
   - Constants: UPPER_SNAKE_CASE for values (`API_URL`)

## Shared Styling Constants

**Always use shared constants instead of hardcoded values**:

```typescript
import { FONTS, clamp, spacing } from "@/styles/typography";
import { TRANSITIONS } from "@/styles/animations";
import { colors } from "@/styles/colors";

// Good
const style = {
  fontFamily: FONTS.primary,
  fontSize: clamp.base,
  padding: spacing.md,
  color: colors.accent,
};

// Bad
const style = {
  fontFamily: "'Hubot Sans', sans-serif",
  fontSize: "clamp(12px, 1.8vw, 18px)",
  padding: "clamp(12px, 2vh, 24px)",
  color: "#E5532C",
};
```

### Available Constants

**`src/styles/colors.ts`**:
- `colors.accent` - `#E5532C`
- `colors.darkBackground` - `#2A2F35`
- And all other project colors

**`src/styles/typography.ts`**:
- `FONTS.primary` - `'Hubot Sans', sans-serif`
- `FONTS.mono` - `'Roboto Mono', monospace`
- `clamp.xs` through `clamp.3xl` - Responsive font sizes
- `spacing.xs` through `spacing.lg` - Responsive spacing

**`src/styles/animations.ts`**:
- `TIMING.smooth` - Smooth cubic-bezier
- `TRANSITIONS.marqueeExpand` - Marquee hover expansion
- `TRANSITIONS.slower(property)` - 0.8s transition helper

## Testing Checklist

Before pushing changes:

1. **Run build**: `npm run build` must succeed with no errors
2. **Check console**: No errors or warnings in browser console
3. **Test CRUD operations**:
   - Create post with series
   - Edit post and change series
   - Delete post
   - Create/edit/delete series
   - Upload/edit/delete pictures
4. **Check admin panel**: All pages load without errors
5. **Test frontend**: Blog components display Supabase data correctly
6. **Verify relationships**: Posts show up in correct series
7. **Check types**: No TypeScript errors

## Common Tasks

### Adding a New Field to Post Model

1. Update database schema in Supabase
2. Update `PostInput` interface in `src/lib/supabase/mutations.ts`
3. Update post forms in `src/app/admin/posts/new/page.tsx` and edit page
4. Update `Post` type in `src/types/post.ts` if needed

### Adding a New Admin Section

1. Create folder in `src/app/admin/[section-name]/`
2. Add `page.tsx` for list view
3. Add `new/page.tsx` for create form
4. Add `[id]/edit/page.tsx` for edit form
5. Add CRUD functions to `src/lib/supabase/mutations.ts`
6. Add link to `AdminHeader.tsx`

### Debugging Supabase Issues

1. Check environment variables in `.env.local`
2. Verify RLS policies in Supabase dashboard
3. Check browser console for errors
4. Use `src/app/test-supabase/page.tsx` to test connection
5. Check Supabase logs in dashboard

## Development Workflow

1. Make your changes
2. Run `npm install` (if dependencies changed)
3. Run `npm run build` (check for errors)
4. Test your changes in the browser
5. Run `npm run lint` (check for linting issues)
6. Commit and push
