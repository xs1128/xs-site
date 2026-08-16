"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface TerminalStats {
  postCount: number;
  seriesCount: number;
  lastUpdate: string;
  pictureCount: number;
  totalViews: number | null;
  isLoading: boolean;
}

// basePath is not applied to client fetches, so the proxy route needs its prefix spelled out.
async function fetchTotalViews(): Promise<number | null> {
  try {
    const res = await fetch('/blog/api/visits');
    if (!res.ok) return null;

    // count comes back formatted, e.g. "1 088 394" or "441,799"
    const { count } = await res.json();
    if (typeof count !== 'string') return null;

    const parsed = Number(count.replace(/\D/g, ''));
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function useTerminalStats() {
  const [stats, setStats] = useState<TerminalStats>({
    postCount: 0,
    seriesCount: 0,
    lastUpdate: "LOADING...",
    pictureCount: 0,
    totalViews: null,
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

        const totalViews = await fetchTotalViews();

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
          totalViews,
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
