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
        .select('*')
        .limit(3);

      if (error) {
        console.error('Error fetching series:', error);
      } else if (data) {
        const transformedSeries: Series[] = data.map(s => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          description: s.description || '',
          posts: [] // Posts will be fetched separately if needed
        }));
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
