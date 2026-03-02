"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import FeaturedSeries from "./FeaturedSeries";
import type { Series } from "@/types/post";

export default function FeaturedSeriesWrapper() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('series')
        .select(`
          id,
          slug,
          title,
          description,
          series_posts (
            order_column,
            posts (
              id,
              title,
              slug,
              excerpt,
              published_at
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching series:', error);
      } else if (data) {
        const transformedSeries: Series[] = data.map(s => {
          // Get posts from series_posts relationship
          const posts = s.series_posts
            ?.map((sp: any) => sp.posts)
            .filter((p: any) => p !== null) || [];

          // Sort by order_column if available, otherwise by published_at
          const sortedPosts = posts.sort((a: any, b: any) => {
            // Check if we have order_column from series_posts
            const aOrder = s.series_posts?.find((sp: any) => sp.posts?.id === a.id)?.order_column;
            const bOrder = s.series_posts?.find((sp: any) => sp.posts?.id === b.id)?.order_column;

            if (aOrder !== undefined && bOrder !== undefined) {
              return aOrder - bOrder;
            }

            // Fallback to published_at (newest first)
            return new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime();
          });

          // Take only top 2 posts
          const topPosts = sortedPosts.slice(0, 2).map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            date: post.published_at
              ? new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Draft',
            summary: post.excerpt || ''
          }));

          return {
            id: s.id,
            slug: s.slug,
            title: s.title,
            description: s.description || '',
            posts: topPosts
          };
        });
        setSeries(transformedSeries);
      }
      setLoading(false);
    }

    fetchSeries();
  }, []);

  if (loading) {
    return <div style={{ color: '#666666' }}>Loading series...</div>;
  }

  return <FeaturedSeries series={series} />;
}
