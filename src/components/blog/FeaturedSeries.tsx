"use client";

import { useState, useRef, useEffect } from "react";
import type { Series } from "@/types/post";

interface FeaturedSeriesProps {
  series: Series[]
}

export default function FeaturedSeries({ series }: FeaturedSeriesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 1);
      setCanScrollRight(
        Math.ceil(container.scrollLeft + container.clientWidth) < container.scrollWidth
      );
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = () => {
    checkScroll();
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

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
    fontSize: "clamp(12px, 1.8vw, 18px)",
    fontWeight: 700,
    color: "#FFFFFF",
    padding: "clamp(8px, 1.5vh, 16px)",
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

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#363D44",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "clamp(4px, 1vw, 8px)",
    padding: "clamp(8px, 1.5vh, 16px)",
    display: "flex",
    flexDirection: "column",
    gap: "clamp(6px, 1vh, 12px)",
    textDecoration: "none",
    transition: "transform 0.2s ease, borderColor 0.2s ease",
    cursor: "pointer",
    overflow: "hidden",
    flexShrink: 0,
    width: "clamp(120px, 20vw, 240px)",
  };

  const cardTitleStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(12px, 1.8vw, 18px)",
    fontWeight: 700,
    color: "#E5532C",
    margin: "0",
    lineHeight: "1.2",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  };

  const cardDescriptionStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(10px, 1.3vw, 14px)",
    fontWeight: 400,
    color: "#CCCCCC",
    margin: "0",
    lineHeight: "1.3",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  };

  const postsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "clamp(4px, 0.8vh, 8px)",
    marginTop: "clamp(4px, 0.8vh, 8px)",
  };

  const postPreviewStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  };

  const postTitleStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(10px, 1.3vw, 13px)",
    fontWeight: 500,
    color: "#FFFFFF",
    margin: "0",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const postDateStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(9px, 1.2vw, 12px)",
    fontWeight: 400,
    color: "#666666",
    margin: "0",
  };

  const viewAllStyle: React.CSSProperties = {
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(10px, 1.3vw, 13px)",
    fontWeight: 700,
    color: "#E5532C",
    margin: "0",
    display: "inline-flex",
    alignItems: "center",
    gap: "clamp(2px, 0.5vw, 4px)",
  };

  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    zIndex: 10,
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 900,
    color: "#E5532C",
    userSelect: "none",
    transition: "color 0.2s ease, transform 0.3s ease",
  };

  const leftArrowStyle: React.CSSProperties = {
    ...arrowStyle,
    left: "clamp(8px, 1.5vh, 16px)",
  };

  const rightArrowStyle: React.CSSProperties = {
    ...arrowStyle,
    right: "clamp(8px, 1.5vh, 16px)",
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          .cards-scroll::-webkit-scrollbar {
            display: none;
          }
          .cards-scroll {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      <h2 style={headerStyle}>Featured Series</h2>
      <div style={scrollContainerStyle}>
        <div
          ref={scrollContainerRef}
          style={cardsContainerStyle}
          className="cards-scroll"
          onScroll={handleScroll}
        >
          {series.map((series) => (
            <div
              key={series.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "#E5532C";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <h3 style={cardTitleStyle}>{series.title}</h3>
              {series.description && <p style={cardDescriptionStyle}>{series.description}</p>}
              <div style={postsContainerStyle}>
                {series.posts.map((post) => (
                  <div key={post.id} style={postPreviewStyle}>
                    <span style={postTitleStyle}>{post.title}</span>
                    <span style={postDateStyle}>{post.date}</span>
                  </div>
                ))}
              </div>
              <span style={viewAllStyle}>
                View all →
              </span>
            </div>
          ))}
        </div>
        {canScrollLeft && (
          <span
            style={leftArrowStyle}
            onClick={() => scroll("left")}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.transform = "translateY(-50%) translateX(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#E5532C";
              e.currentTarget.style.transform = "translateY(-50%) translateX(0)";
            }}
          >
            ←
          </span>
        )}
        {canScrollRight && (
          <span
            style={rightArrowStyle}
            onClick={() => scroll("right")}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.transform = "translateY(-50%) translateX(3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#E5532C";
              e.currentTarget.style.transform = "translateY(-50%) translateX(0)";
            }}
          >
            →
          </span>
        )}
      </div>
    </div>
  );
}
