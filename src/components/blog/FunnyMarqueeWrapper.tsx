"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import FunnyMarquee from "./FunnyMarquee";
import type { FunnyPicture } from "@/types/post";
import { SkeletonText } from "@/components/skeleton";

interface FunnyMarqueeWrapperProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function FunnyMarqueeWrapper({ isCollapsed = false, onToggleCollapse }: FunnyMarqueeWrapperProps) {
  const [pictures, setPictures] = useState<FunnyPicture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPictures() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pictures')
        .select('*')
        .order('order_column', { ascending: true, nullsFirst: false });

      if (data) {
        const transformedPictures: FunnyPicture[] = data.map(picture => ({
          id: picture.id,
          image: picture.url,
          title: picture.caption || '',
          location: picture.location || '',
          date: picture.date_taken ? new Date(picture.date_taken).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : ''
        }));
        setPictures(transformedPictures);
      }
      setLoading(false);
    }

    fetchPictures();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <SkeletonText lines={2} width="100%" />
        <SkeletonText lines={1} width="60%" />
      </div>
    );
  }

  return <FunnyMarquee pictures={pictures} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />;
}
