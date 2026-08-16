"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import FeaturedSeries from "./FeaturedSeries";
import type { Series } from "@/types/post";
import { SkeletonCard } from "@/components/skeleton";

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
    const containerStyle: React.CSSProperties = {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minHeight: 0,
      borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    };

    const headerStyle: React.CSSProperties = {
      fontFamily: "'Hubot Sans', sans-serif",
      fontSize: "clamp(20px, 3vw, 28px)",
      fontWeight: 700,
      color: "#FFFFFF",
      paddingLeft: "clamp(16px, 3vw, 24px)",
      paddingRight: "clamp(6px, 1vh, 12px)",
      paddingTop: "clamp(6px, 1vh, 12px)",
      paddingBottom: "clamp(6px, 1vh, 12px)",
      margin: "0",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      flexShrink: 0,
      borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    };

    const scrollContainerStyle: React.CSSProperties = {
      position: "relative",
      flex: 1,
      display: "flex",
      alignItems: "flex-start",
      minHeight: 0,
    };

    const cardsContainerStyle: React.CSSProperties = {
      display: "flex",
      flexDirection: "row",
      gap: "clamp(8px, 1.5vh, 16px)",
      paddingTop: "clamp(8px, 1.5vh, 16px)",
      paddingBottom: "clamp(8px, 1.5vh, 16px)",
      paddingLeft: "clamp(8px, 1.5vh, 16px)",
      paddingRight: "clamp(8px, 1.5vh, 16px)",
      overflowX: "auto",
      overflowY: "hidden",
      minHeight: 0,
      width: "100%",
      alignItems: "flex-start",
    };

    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Featured Series</h2>
        <div style={scrollContainerStyle}>
          <div style={cardsContainerStyle}>
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} variant="series" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <FeaturedSeries series={series} />;
}
