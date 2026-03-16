"use client";

import type { Post } from "@/types/post";

interface BlogCardProps {
  post: Post;
  isSmallScreen?: boolean;
}

export default function BlogCard({ post, isSmallScreen = false }: BlogCardProps) {
  const cardStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#363D44",
    border: "1px solid " + "rgba(255, 255, 255, 0.1)",
    borderRadius: "clamp(6px, 1vw, 10px)",
    overflow: "hidden",
    textDecoration: "none",
    transition: "transform 0.2s ease, borderColor 0.2s ease",
    cursor: "pointer",
    height: isSmallScreen ? "200px" : "260px", // Smaller height on mobile
    width: isSmallScreen ? "160px" : "200px", // Fixed width, doesn't squeeze
    flexShrink: 0, // Prevent card from shrinking
  };

  const imageAreaStyle: React.CSSProperties = {
    width: "100%",
    height: "60%", // Image takes 60% of card height
    backgroundColor: "#FFFFFF",
    backgroundImage: post.featured_image
      ? `url(${post.featured_image})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    flexShrink: 0, // Prevent image from shrinking
  };

  const titleBarStyle: React.CSSProperties = {
    backgroundColor: "#1A1D21",
    padding: "clamp(12px, 2vh, 20px) clamp(12px, 2vh, 20px)", // Increased padding
    textAlign: "left", // Left align the text
    flex: 1, // Title area takes remaining 40% of space
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start", // Align to top
    minHeight: 0, // Allow flex to work properly
    gap: "0", // No gap between title and metadata
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(10px, 1.4vw, 14px)",
    fontWeight: 700,
    color: "#FFFFFF",
    margin: "0",
    padding: "0",
    lineHeight: 1.2, // Slightly better line height
    wordBreak: "keep-all", // Break only at word boundaries, not in middle of words
    overflowWrap: "break-word", // Break long words if needed
    hyphens: "auto", // Add hyphens for better word breaking
  };

  const metadataStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(8px, 1.1vw, 11px)",
    fontWeight: 400,
    color: "#CCCCCC",
    padding: "0",
  };

  return (
    <a
      href={`/posts/${post.slug}`}
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.borderColor = "#E5532C";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
      }}
    >
      <div style={imageAreaStyle} />
      <div style={titleBarStyle}>
        <h3 style={titleStyle}>{post.title}</h3>
        <div style={metadataStyle}>
          {post.date} {post.author_name && ` • ${post.author_name}`}
        </div>
      </div>
    </a>
  );
}
