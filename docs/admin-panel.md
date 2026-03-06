# Admin Panel

## Components

### SeriesMultiSelect

Reusable multi-select dropdown for choosing series.

**Location**: `src/components/admin/SeriesMultiSelect.tsx`

**Usage**:
```typescript
import SeriesMultiSelect from '@/components/admin/SeriesMultiSelect'

<SeriesMultiSelect
  availableSeries={seriesList}
  selectedSeriesIds={selectedIds}
  onChange={setSelectedIds}
  disabled={loading}
/>
```

**Features**:
- Dropdown with checkboxes
- Selected items shown as tags
- Click-outside to close
- Disabled state support
- Dark theme styling

## Architecture Patterns

### Error Handling

All admin pages follow this error handling pattern:

```typescript
const [error, setError] = useState('')

// Display error
{error && <div style={errorStyle}>{error}</div>}

// Handle operation errors
if (error) {
  setError('Operation failed: ' + error.message)
  setLoading(false)
  return
}
```

### Loading States

Always use loading states for async operations:

```typescript
const [loading, setLoading] = useState(true)
const [saving, setSaving] = useState(false)
const [deleting, setDeleting] = useState(false)

// Disable interactions during operations
<button disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
```

### ID Validation

Always validate IDs before database calls:

```typescript
const postId = parseInt(id)

if (isNaN(postId)) {
  console.error('Invalid ID:', id)
  setNotFound(true)
  return
}
```

### Slug Generation

Use the improved slug generation with validation:

```typescript
function generateSlug(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  if (!slug) {
    throw new Error('Please enter a valid title')
  }

  return slug
}
```

## Admin Panel Styling

Admin pages use inline styles with these common patterns:

```typescript
// Form groups
const formGroupStyle: React.CSSProperties = {
  marginBottom: 'clamp(16px, 3vh, 24px)',
}

// Labels
const labelStyle: React.CSSProperties = {
  fontFamily: 'Hubot Sans, sans-serif',
  fontSize: 'clamp(12px, 1.8vw, 14px)',
  fontWeight: 600,
  color: '#CCCCCC',
  display: 'block',
  marginBottom: 'clamp(6px, 1vh, 8px)',
}

// Inputs
const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'Hubot Sans, sans-serif',
  fontSize: 'clamp(12px, 1.8vw, 14px)',
  color: '#FFFFFF',
  backgroundColor: '#2A2F35',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  padding: 'clamp(8px, 1.5vh, 12px)',
}

// Error messages
const errorStyle: React.CSSProperties = {
  fontFamily: 'Hubot Sans, sans-serif',
  fontSize: 'clamp(12px, 1.8vw, 14px)',
  color: '#FF6B6B',
  padding: 'clamp(8px, 1.5vh, 12px)',
  backgroundColor: 'rgba(255, 107, 107, 0.1)',
  borderRadius: '4px',
}
```

## Admin Routes

- `/admin` - Dashboard
- `/admin/login` - Login page
- `/admin/posts` - Posts list
- `/admin/posts/new` - Create post
- `/admin/posts/[id]/edit` - Edit post
- `/admin/series` - Series list
- `/admin/series/new` - Create series
- `/admin/series/[id]/edit` - Edit series
- `/admin/pictures` - Pictures list
- `/admin/pictures/new` - Upload picture
- `/admin/pictures/[id]/edit` - Edit picture
- `/admin/hero` - Update hero image
- `/admin/avatar` - Update avatar
