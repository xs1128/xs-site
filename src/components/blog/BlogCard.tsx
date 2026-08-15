"use client";

import Link from "next/link";
import Image from "next/image";
import { isOptimizable } from "@/lib/images";
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
    height: isSmallScreen ? "min(100%, 200px)" : "min(100%, 260px)",
    aspectRatio: isSmallScreen ? "160 / 200" : "200 / 260",
    width: "auto",
    containerType: "size", // makes the cqh text sizes below resolve against the card
    flexShrink: 0,
  };

  const imageAreaStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    flex: "1 1 60%",
    minHeight: 0,
    backgroundColor: "#FFFFFF",
  };

  const titleBarStyle: React.CSSProperties = {
    backgroundColor: "#1A1D21",
    padding: "clamp(6px, 4.5cqh, 20px) clamp(8px, 4.5cqh, 20px)",
    textAlign: "left",
    flex: "0 0 auto",
    minHeight: "40%", // grows past 40% for long titles rather than clipping them
    maxHeight: "55%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    overflow: "hidden",
    gap: "0"
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(9px, 5.4cqh, 14px)",
    fontWeight: 700,
    color: "#FFFFFF",
    margin: "0",
    padding: "0",
    lineHeight: 1.2,
    wordBreak: "keep-all",
    overflowWrap: "break-word",
    hyphens: "auto",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 5,
    overflow: "hidden",
    minHeight: 0,
  };

  const metadataStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(7px, 4.2cqh, 11px)",
    fontWeight: 400,
    color: "#CCCCCC",
    padding: "0",
    flexShrink: 0,
  };

  return (
    <Link
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
      <div style={imageAreaStyle}>
        {post.featured_image && (
          isOptimizable(post.featured_image) ? (
            <Image
              src={post.featured_image}
              alt=""
              fill
              sizes="(max-width: 480px) 160px, 200px"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          ) : (
            <img
              src={post.featured_image}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          )
        )}
      </div>
      <div style={titleBarStyle}>
        <h3 style={titleStyle}>{post.title}</h3>
        <div style={metadataStyle}>
          {post.date} {post.author_name && ` • ${post.author_name}`}
        </div>
      </div>
    </Link>
  );
}
