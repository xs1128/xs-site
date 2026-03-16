"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Series {
  id: number;
  slug: string;
  title: string;
  description: string | null;
}

interface SeriesGridProps {
  isSmallScreen?: boolean;
}

export default function SeriesGrid({ isSmallScreen = false }: SeriesGridProps) {
  const [series, setSeries] = useState<Series[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = isSmallScreen ? 8 : 12; // Fewer items on mobile
  const totalPages = Math.ceil(series.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleSeries = series.slice(startIndex, endIndex);

  useEffect(() => {
    async function fetchSeries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('series')
        .select(`
          id,
          slug,
          title,
          description
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching series:', error);
      } else if (data) {
        setSeries(data as Series[]);
      }
      setLoading(false);
    }

    fetchSeries();
  }, []);

  const handleSeriesClick = (seriesSlug: string) => {
    // Navigate to series page or filter posts by series
    window.location.href = `/series/${seriesSlug}`;
  };

  const handlePageUp = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageDown = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: isSmallScreen ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
    gridTemplateRows: isSmallScreen ? "auto" : "repeat(4, 1fr)",
    gap: "clamp(8px, 1.5vh, 16px)",
    padding: "clamp(12px, 2vh, 24px)",
    overflowY: "auto",
    minHeight: 0,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    padding: 0,
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(11px, 1.5vw, 16px)",
    fontWeight: 700,
    color: "#FFFFFF",
    textTransform: "uppercase",
    textAlign: "center",
    cursor: "pointer",
    transition: "color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: isSmallScreen ? "auto" : "clamp(60px, 10vh, 80px)",
  };

  const arrowContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(12px, 2vh, 24px)",
    padding: "clamp(8px, 1.5vh, 16px)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
    flexShrink: 0,
  };

  const arrowButtonStyle = (disabled: boolean): React.CSSProperties => ({
    width: "clamp(40px, 6vw, 60px)",
    height: "clamp(40px, 6vw, 60px)",
    borderRadius: "50%",
    backgroundColor: "#363D44",
    border: "2px solid " + (disabled ? "#666666" : "#E5532C"),
    color: disabled ? "#666666" : "#E5532C",
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 900,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.3 : 1,
  });

  if (loading) {
    return (
      <div style={{ color: '#666666', textAlign: 'center', padding: '20px', fontFamily: "'Hubot Sans', sans-serif" }}>
        Loading series...
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div style={{ color: '#666666', textAlign: 'center', padding: '20px', fontFamily: "'Hubot Sans', sans-serif" }}>
        No series found
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={gridStyle}>
        {visibleSeries.map((series) => (
          <button
            key={series.id}
            style={buttonStyle}
            onClick={() => handleSeriesClick(series.slug)}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#E5532C";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#FFFFFF";
            }}
          >
            {series.title}
          </button>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={arrowContainerStyle}>
          <button
            onClick={handlePageUp}
            disabled={currentPage === 0}
            style={arrowButtonStyle(currentPage === 0)}
            onMouseEnter={(e) => {
              if (currentPage > 0) {
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ↑
          </button>
          <button
            onClick={handlePageDown}
            disabled={currentPage === totalPages - 1}
            style={arrowButtonStyle(currentPage === totalPages - 1)}
            onMouseEnter={(e) => {
              if (currentPage < totalPages - 1) {
                e.currentTarget.style.transform = "translateY(2px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
}
