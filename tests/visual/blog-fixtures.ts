import type { Page } from '@playwright/test';

const publishedAt = '2026-01-15T12:00:00Z';
const posts = [
  'Building a reliable deployment pipeline',
  'Understanding Docker networking',
  'Notes on TypeScript and React',
  'Automating everyday tasks with Python',
].map((title, index) => ({
  id: index + 1,
  slug: `visual-post-${index + 1}`,
  title,
  created_at: publishedAt,
  published_at: publishedAt,
  excerpt: 'A fixed post used to test the blog layout.',
  featured_image: '/og-image.png',
  tags: ['Engineering'],
  read_time: 5,
  author_name: 'Xinsheng Ooi',
}));

const series = ['Docker', 'Web Development', 'Automation'].map(
  (title, index) => ({
    id: index + 1,
    slug: `visual-series-${index + 1}`,
    title,
    description: 'Practical notes and examples',
    series_posts: [{ posts: { published_at: publishedAt } }],
  }),
);

// Only browser reads are mocked. The production build still uses the existing
// Supabase configuration to generate the real post and series routes.
export async function mockBlogContent(page: Page) {
  // These fixture slugs have no server pages; keep Next's link prefetches local.
  await page.route('**/blog/posts/visual-post-*', (route) =>
    route.fulfill({ status: 404, body: '' }),
  );
  await page.route('**/rest/v1/**', async (route) => {
    const url = new URL(route.request().url());
    const table = url.pathname.split('/').pop();
    const rows = table === 'posts' ? posts : table === 'series' ? series : [];
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'content-range': `0-${Math.max(0, rows.length - 1)}/${rows.length}`,
      },
      body:
        route.request().method() === 'HEAD'
          ? ''
          : JSON.stringify(
              url.searchParams.get('select') === 'published_at'
                ? [{ published_at: publishedAt }]
                : rows,
            ),
    });
  });
  await page.route('**/blog/api/visits', (route) =>
    route.fulfill({ json: { count: '1,234' } }),
  );
}
