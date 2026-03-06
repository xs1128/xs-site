"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface TerminalStats {
  postCount: number;
  categoryCount: number;
  lastUpdate: string;
  pictureCount: number;
  totalViews: number; // If you track views
  isLoading: boolean;
}

export function useTerminalStats() {
  const [stats, setStats] = useState<TerminalStats>({
    postCount: 0,
    categoryCount: 0,
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
          .select('*', { count: 'exact', head: true });

        // Fetch category (series) count
        const { count: categoryCount } = await supabase
          .from('series')
          .select('*', { count: 'exact', head: true });

        // Fetch last update date
        const { data: latestPost } = await supabase
          .from('posts')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Fetch picture count
        const { count: pictureCount } = await supabase
          .from('pictures')
          .select('*', { count: 'exact', head: true });

        // Format last update date
        let lastUpdateText = "NO POSTS";
        if (latestPost?.created_at) {
          const date = new Date(latestPost.created_at);
          lastUpdateText = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }).toUpperCase();
        }

        setStats({
          postCount: postCount || 0,
          categoryCount: categoryCount || 0,
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
