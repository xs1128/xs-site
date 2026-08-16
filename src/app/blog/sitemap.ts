import type { MetadataRoute } from 'next';
import { blogUrl } from '@/lib/blog/seo';
import {
  getAllPostSlugs,
  getAllSeriesSlugs,
} from '@/lib/blog/supabase/queries';

// Re-crawl periodically so new posts show up. (ISR for the sitemap.)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, series] = await Promise.all([
    getAllPostSlugs(),
    getAllSeriesSlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: blogUrl('/'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: blogUrl(`/posts/${p.slug}`),
    lastModified: new Date(p.updated_at || p.published_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const seriesRoutes: MetadataRoute.Sitemap = (series ?? []).map((s) => ({
    url: blogUrl(`/series/${s.slug}`),
    lastModified: new Date(s.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...seriesRoutes];
}
