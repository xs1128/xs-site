"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/types/post";
import BlogCard from "./BlogCard";
import { SkeletonCard } from "@/components/skeleton";

interface RecentBlogsGridProps {
  isExpanded?: boolean;
  isSmallScreen?: boolean;
}

// Helper function to format date as YYYY-MM-DD
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear(); // YYYY
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // MM
  const day = date.getDate().toString().padStart(2, "0"); // DD
  return `${year}-${month}-${day}`; // YYYY-MM-DD
}

export default function RecentBlogsGrid({
  isExpanded = false,
  isSmallScreen = false
}: RecentBlogsGridProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(12);

      if (data) {
        const transformedPosts: Post[] = data.map(post => ({
          id: post.id,
          title: post.title,
          date: post.published_at ? formatDate(post.published_at) : '',
          summary: post.excerpt || '',
          slug: post.slug,
          featured_image: post.featured_image,
          tags: post.tags,
          read_time: post.read_time,
          author_name: post.author_name,
        }));
        setPosts(transformedPosts);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  // Scroll left or right by one card width
  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const cardWidth = isSmallScreen ? 180 : 280; // Approximate card width + gap
      const scrollAmount = cardWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll(); // Initial check
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [posts]);

  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
    height: "100%",
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
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    flexShrink: 0,
  };

  const carouselWrapperStyle: React.CSSProperties = {
    position: "relative",
    flex: 1,
    display: "flex",
    overflow: "hidden",
    minHeight: 0,
  };

  const carouselStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: "clamp(12px, 2vh, 24px)",
    paddingLeft: "clamp(12px, 2vh, 24px)",
    paddingRight: "clamp(12px, 2vh, 24px)",
    paddingTop: "clamp(24px, 4vh, 48px)",
    paddingBottom: "clamp(24px, 4vh, 48px)",
    overflowX: "auto",
    overflowY: "hidden",
    flex: 1,
    alignItems: "center",
    scrollBehavior: "smooth",
    // Hide scrollbar
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  } as React.CSSProperties;

  const arrowButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "#363D44",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    width: "clamp(32px, 5vw, 48px)",
    height: "clamp(32px, 5vw, 48px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 10,
    transition: "background-color 0.2s ease, border-color 0.2s ease",
    color: "#FFFFFF",
    fontSize: "clamp(16px, 2vw, 24px)",
    fontWeight: "bold",
    userSelect: "none",
  };

  const emptyStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(10px, 1.3vw, 14px)",
    fontWeight: 400,
    color: "#666666",
    textAlign: "center",
    padding: "clamp(20px, 3vh, 40px)",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Recent Blogs</h2>
        <div style={carouselWrapperStyle}>
          <div style={carouselStyle}>
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} variant="blog" isSmallScreen={isSmallScreen} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Recent Blogs</h2>
      <div style={carouselWrapperStyle}>
        {canScrollLeft && (
          <button
            style={{
              ...arrowButtonStyle,
              left: "clamp(8px, 1vh, 16px)",
            }}
            onClick={() => scroll("left")}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E5532C";
              e.currentTarget.style.borderColor = "#E5532C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#363D44";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            ‹
          </button>
        )}
        <div
          ref={scrollContainerRef}
          style={carouselStyle}
        >
          {posts.length === 0 ? (
            <p style={emptyStyle}>No recent posts yet</p>
          ) : (
            posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                isSmallScreen={isSmallScreen}
              />
            ))
          )}
        </div>
        {canScrollRight && (
          <button
            style={{
              ...arrowButtonStyle,
              right: "clamp(8px, 1vh, 16px)",
            }}
            onClick={() => scroll("right")}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#E5532C";
              e.currentTarget.style.borderColor = "#E5532C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#363D44";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
