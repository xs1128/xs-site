import { cache } from 'react';
import { getPublicClient } from './public';
import type { Post } from '@/types/post';
import type { Database } from '@/types/database';

type PostRow = Database['public']['Tables']['posts']['Row'];
type SeriesRow = Database['public']['Tables']['series']['Row'];

// Supabase nested selects: the generated Database types don't describe the
// joined shape, so name it here instead of reaching for `any`.
type JoinedSeries = { series: SeriesRow | null };
type JoinedPost = { order_column: number; posts: PostRow | null };

export async function getRecentPosts(limit = 5) {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data;
}

export async function getFeaturedSeries(limit = 3) {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('series')
    .select('*, posts(*)')
    .limit(limit);

  if (error) {
    console.error('Error fetching series:', error);
    return [];
  }

  return data;
}

export async function getPictures() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('pictures')
    .select('*')
    .order('order_column', { ascending: true, nullsFirst: false });

  if (error) {
    console.error('Error fetching pictures:', error);
    return [];
  }

  return data;
}

/**
 * Get published post by slug with series relationships
 */
export const getPostBySlug = cache(async (slug: string) => {
  const supabase = getPublicClient();

  // First get the post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .not('published_at', 'is', null)
    .single<PostRow>();

  if (postError || !post) {
    console.error('Error fetching post by slug:', {
      message: postError?.message,
      details: postError?.details,
      hint: postError?.hint,
      code: postError?.code,
      fullError: postError,
    });
    return null;
  }

  // Then get series relationships through series_posts
  const { data: seriesData, error: seriesError } = await supabase
    .from('series_posts')
    .select(
      `
      series_id,
      series (
        id,
        title,
        slug,
        description
      )
    `,
    )
    .eq('post_id', post.id);

  if (seriesError) {
    console.error('Error fetching series:', seriesError);
  }

  // Combine post with series data
  const series =
    (seriesData as JoinedSeries[] | null)
      ?.map((sp) => sp.series)
      .filter((s): s is SeriesRow => s !== null) || [];

  return {
    ...post,
    series,
  };
});

/**
 * Get related posts based on tags
 */
export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 5,
): Promise<Post[]> {
  if (!tags || tags.length === 0) return [];

  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .neq('slug', currentSlug) // Exclude current post
    .not('published_at', 'is', null) // Only published
    .contains('tags', `{${tags[0]}}`) // Posts that have at least one matching tag
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching related posts:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error,
    });
    return [];
  }

  // Map DB rows to the Post shape the UI expects (date/summary derived).
  return (data || []).map((p) => ({
    ...p,
    tags: p.tags ?? undefined,
    date: p.published_at || p.created_at,
    summary: p.excerpt || '',
  }));
}

/**
 * Get posts in the same series (for navigation)
 */
export async function getSeriesPosts(seriesId: number) {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('series_posts')
    .select(
      `
      order_column,
      posts (*)
    `,
    )
    .eq('series_id', seriesId)
    .order('order_column', { ascending: true });

  if (error) {
    console.error('Error fetching series posts:', error);
    return [];
  }

  return data;
}

/**
 * Get series by slug with all posts ordered
 */
export const getSeriesBySlug = cache(async (slug: string) => {
  const supabase = getPublicClient();

  const { data, error } = await supabase
    .from('series')
    .select(
      `
      *,
      series_posts (
        order_column,
        posts (*)
      )
    `,
    )
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching series by slug:', error);
    return null;
  }

  // Transform to match SeriesDetail interface
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    description: data.description,
    posts: ((data.series_posts || []) as JoinedPost[])
      .filter((sp): sp is JoinedPost & { posts: PostRow } =>
        Boolean(sp.posts?.published_at),
      )
      .sort((a, b) => a.order_column - b.order_column)
      .map((sp) => ({
        ...sp.posts,
        order_in_series: sp.order_column + 1, // Add 1 to make it 1-based (Part 1, Part 2, etc.)
        date: sp.posts.published_at || sp.posts.created_at,
        summary: sp.posts.excerpt || '',
      })),
  };
});

/**
 * Lightweight slug + lastmod lists for the sitemap.
 */
export async function getAllPostSlugs() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('posts')
    .select('slug, updated_at, published_at')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
  return data;
}

export async function getAllSeriesSlugs() {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('series')
    .select('slug, created_at')
    .order('created_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('Error fetching series slugs:', error);
    return [];
  }
  return data;
}

/**
 * Read a single site setting (e.g. hero image URL) for server rendering.
 */
export const getHeroImageUrl = cache(async (): Promise<string> => {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'hero_image_url')
    .single();

  if (error) {
    console.error('Error fetching hero image url:', error);
    return '';
  }
  return data?.value || '';
});
