"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface TerminalStats {
  postCount: number;
  seriesCount: number;
  lastUpdate: string;
  pictureCount: number;
  totalViews: number; // If you track views
  isLoading: boolean;
}

export function useTerminalStats() {
  const [stats, setStats] = useState<TerminalStats>({
    postCount: 0,
    seriesCount: 0,
    lastUpdate: "LOADING...",
    pictureCount: 0,
    totalViews: 0,
    isLoading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      try {
        // Fetch post count
        const { count: postCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .not('published_at', 'is', null);

        // Fetch series count
        const { count: seriesCount } = await supabase
          .from('series')
          .select('*', { count: 'exact', head: true });

        // Fetch last update date
        const { data: latestPost } = await supabase
          .from('posts')
          .select('published_at')
          .not('published_at', 'is', null)
          .order('published_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Fetch picture count
        const { count: pictureCount } = await supabase
          .from('pictures')
          .select('*', { count: 'exact', head: true });

        // Format last update date
        let lastUpdateText = "NO POSTS";
        if (latestPost?.published_at) {
          const date = new Date(latestPost.published_at);
          lastUpdateText = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }).toUpperCase();
        }

        setStats({
          postCount: postCount || 0,
          seriesCount: seriesCount || 0,
          lastUpdate: lastUpdateText,
          pictureCount: pictureCount || 0,
          totalViews: 0, // Add view tracking if you have it
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching terminal stats:', error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    }

    fetchStats();
  }, []);

  return stats;
}
