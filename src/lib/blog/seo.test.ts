import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', 'production');
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', undefined);
});

afterEach(() => vi.unstubAllEnvs());

describe('production metadata URLs', () => {
  it('uses the same public fallback for blog paths, sitemap, and robots', async () => {
    const { blogUrl, absoluteUrl } = await import('./seo');
    const { default: sitemap } = await import('@/app/sitemap');
    const { default: robots } = await import('@/app/robots');

    expect(blogUrl('/')).toBe('https://www.xsooi.com/blog');
    expect(blogUrl('/posts/example')).toBe(
      'https://www.xsooi.com/blog/posts/example',
    );
    expect(blogUrl('/series/example')).toBe(
      'https://www.xsooi.com/blog/series/example',
    );
    expect(absoluteUrl('/blog/og-default.png')).toBe(
      'https://www.xsooi.com/blog/og-default.png',
    );
    expect(sitemap()[0].url).toBe('https://www.xsooi.com');
    expect(robots().sitemap).toContain(
      'https://www.xsooi.com/blog/sitemap.xml',
    );
  });

  it('normalizes the apex and an old blog-prefixed environment value', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://xsooi.com/blog/');
    const { blogUrl } = await import('./seo');

    expect(blogUrl('/posts/example')).toBe(
      'https://www.xsooi.com/blog/posts/example',
    );
  });

  it('uses a configured deployment origin without double slashes', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://preview.example.com/');
    const { blogUrl, absoluteUrl } = await import('./seo');

    expect(blogUrl('/')).toBe('https://preview.example.com/blog');
    expect(absoluteUrl('https://images.example.com/photo.jpg')).toBe(
      'https://images.example.com/photo.jpg',
    );
  });

  it.each([
    'http://localhost:3000',
    'https://localhost:3000',
    'http://www.xsooi.com',
  ])('rejects an unsafe production origin: %s', async (url) => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', url);
    await expect(import('./seo')).rejects.toThrow('public HTTPS URL');
  });

  it('allows an explicit local origin during development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000/');
    const { blogUrl } = await import('./seo');

    expect(blogUrl('/')).toBe('http://localhost:3000/blog');
  });
});
