import { defaultSchema } from 'rehype-sanitize';
import type { Options as SanitizeSchema } from 'rehype-sanitize';

/**
 * !!! KEEP IN SYNC !!!
 * A byte-identical copy of this schema lives in the separate admin repo at
 * `../blog-admin/src/lib/markdown/sanitizeSchema.ts`. Both render the same
 * admin-authored post markdown, so the two files MUST stay identical. If you
 * change one, change the other.
 *
 * Sanitization schema for rendering user-authored markdown.
 *
 * `rehypeRaw` parses raw HTML embedded in markdown into the hast tree, which
 * means a malicious `<script>`/`<iframe>`/`onerror=...` payload would otherwise
 * be rendered. `rehype-sanitize` runs AFTER `rehypeRaw` and strips anything not
 * explicitly allowed here.
 *
 * This schema extends hast-util-sanitize's `defaultSchema` (a GitHub-flavored
 * baseline that already permits headings, paragraphs, lists, links, images,
 * tables, code blocks, blockquotes, etc.) and widens it just enough to cover
 * the formatting the editor/preview actually uses:
 *   - GFM task-list checkboxes (`<input type="checkbox" disabled checked>`)
 *   - syntax-highlighted code blocks (`className="language-xyz"`)
 *   - heading anchor ids
 *   - `target`/`rel` on links (we open links in a new tab)
 */
export const markdownSanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Allow language-* class names on code/pre so syntax highlighting works,
    // plus className passthrough on the common formatting elements.
    code: [
      ...(defaultSchema.attributes?.code || []),
      ['className', /^language-./],
    ],
    pre: [
      ...(defaultSchema.attributes?.pre || []),
      ['className', /^language-./],
    ],
    span: [...(defaultSchema.attributes?.span || []), 'className'],
    // Links: keep default (href/title) and allow new-tab attributes.
    a: [...(defaultSchema.attributes?.a || []), 'target', 'rel'],
    // GFM task-list checkboxes.
    input: [
      ...(defaultSchema.attributes?.input || []),
      'type',
      'checked',
      'disabled',
    ],
    // Heading anchor ids (used by the public blog's table-of-contents).
    h1: [...(defaultSchema.attributes?.h1 || []), 'id'],
    h2: [...(defaultSchema.attributes?.h2 || []), 'id'],
    h3: [...(defaultSchema.attributes?.h3 || []), 'id'],
    h4: [...(defaultSchema.attributes?.h4 || []), 'id'],
    h5: [...(defaultSchema.attributes?.h5 || []), 'id'],
    h6: [...(defaultSchema.attributes?.h6 || []), 'id'],
  },
  tagNames: [
    ...(defaultSchema.tagNames || []),
    // Ensure formatting tags used by the preview are kept. Most are already in
    // defaultSchema; listing them is harmless and self-documenting.
    'span',
    'div',
  ],
};
