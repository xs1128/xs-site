"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/types/post";

export default function RecentLogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .not('published_at', 'is', null)  // Only fetch published posts
        .order('published_at', { ascending: false })
        .limit(5);

      if (data) {
        const transformedPosts: Post[] = data.map(post => ({
          id: post.id,
          title: post.title,
          date: post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : '',
          summary: post.excerpt || '',
          slug: post.slug
        }));
        setPosts(transformedPosts);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
  };

  const headerStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(12px, 1.8vw, 18px)",
    fontWeight: 700,
    color: "#FFFFFF",
    padding: "clamp(8px, 1.5vh, 16px)",
    margin: "0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    flexShrink: 0,
  };

  const listContainerStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "clamp(8px, 1.5vh, 16px)",
    padding: "clamp(8px, 1.5vh, 16px)",
    overflowY: "auto",
    overflowX: "hidden",
    minHeight: 0,
  };

  const emptyStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(10px, 1.3vw, 14px)",
    fontWeight: 400,
    color: "#666666",
    textAlign: "center",
    padding: "clamp(20px, 3vh, 40px)",
  };

  const postItemStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(10px, 1.3vw, 14px)",
    fontWeight: 400,
    color: "#FFFFFF",
    textDecoration: "none",
    transition: "color 0.2s ease",
  };

  const dateStyle: React.CSSProperties = {
    fontSize: "clamp(9px, 1.1vw, 12px)",
    color: "#999999",
    marginBottom: "clamp(4px, 0.8vh, 8px)",
  };

  const summaryStyle: React.CSSProperties = {
    fontSize: "clamp(9px, 1.1vw, 12px)",
    color: "#CCCCCC",
    marginTop: "clamp(4px, 0.8vh, 8px)",
    lineHeight: 1.4,
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <h2 style={headerStyle}>Recent</h2>
        <div style={listContainerStyle}>
          <p style={emptyStyle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Recent</h2>
      <div style={listContainerStyle}>
        {posts.length === 0 ? (
          <p style={emptyStyle}>No recent posts yet</p>
        ) : (
          posts.map((post) => (
            <a
              key={post.id}
              href={`/posts/${post.slug}`}
              style={postItemStyle}
              onMouseEnter={(e) => e.currentTarget.style.color = "#E5532C"}
              onMouseLeave={(e) => e.currentTarget.style.color = "#FFFFFF"}
            >
              <div style={dateStyle}>{post.date}</div>
              <div>{post.title}</div>
              {post.summary && <div style={summaryStyle}>{post.summary}</div>}
            </a>
          ))
        )}
      </div>
    </div>
  );
}
