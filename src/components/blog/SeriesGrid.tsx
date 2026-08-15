"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Series {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  postCount: number;
}

interface SeriesGridProps {
  isSmallScreen?: boolean;
}

export default function SeriesGrid({ isSmallScreen = false }: SeriesGridProps) {
  const router = useRouter();
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSeries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('series')
        .select(`
          id,
          slug,
          title,
          description,
          series_posts (count)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching series:', error);
      } else if (data) {
        setSeries(
          data.map((s: any) => ({
            id: s.id,
            slug: s.slug,
            title: s.title,
            description: s.description,
            postCount: s.series_posts?.[0]?.count ?? 0,
          }))
        );
      }
      setLoading(false);
    }

    fetchSeries();
  }, []);

  const scrollAreaStyle: React.CSSProperties = {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    maskImage:
      "linear-gradient(to bottom, #000 calc(100% - clamp(12px, 2vh, 24px)), transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(to bottom, #000 calc(100% - clamp(12px, 2vh, 24px)), transparent 100%)",
  };

  const messageStyle: React.CSSProperties = {
    color: "#8A929B",
    padding: "clamp(16px, 3vh, 28px) clamp(16px, 3vw, 28px)",
    fontFamily: "'Hubot Sans', sans-serif",
    fontSize: "clamp(12px, 1.5vw, 15px)",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };

  const styles = `
    .series-scroll::-webkit-scrollbar { width: 3px; }
    .series-scroll::-webkit-scrollbar-track { background: transparent; }
    .series-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
    .series-scroll::-webkit-scrollbar-thumb:hover { background: rgba(229,83,44,0.6); }
    .series-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }

    .series-list {
      display: flex;
      flex-direction: column;
      gap: clamp(14px, 2.6vh, 34px);
      padding: clamp(18px, 3vh, 34px) clamp(16px, 3vw, 32px);
    }

    .series-row {
      display: flex;
      align-items: baseline;
      gap: clamp(10px, 1.6vw, 20px);
      width: 100%;
      padding: 0;
      background: transparent;
      border: 0;
      text-align: left;
      cursor: pointer;
      font-family: 'Hubot Sans', sans-serif;
      transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
      animation: series-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) backwards;
    }
    .series-row:hover,
    .series-row:focus-visible { transform: translateX(clamp(4px, 0.8vw, 10px)); outline: none; }

    .series-num {
      flex-shrink: 0;
      font-size: clamp(9px, 0.95vw, 11px);
      font-weight: 500;
      font-variant-numeric: tabular-nums;
      letter-spacing: 0.14em;
      color: rgba(255, 255, 255, 0.28);
      transition: color 0.24s ease;
    }
    .series-row:hover .series-num,
    .series-row:focus-visible .series-num { color: #E5532C; }

    .series-body { min-width: 0; flex: 1; }

    .series-name {
      position: relative;
      display: inline-block;
      max-width: 100%;
      font-size: clamp(14px, 2vw, 26px);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.015em;
      text-transform: uppercase;
      color: #FFFFFF;
      padding-bottom: 0.18em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.24s ease;
    }

    /* Underline is the only ornament: grows under the title text alone. */
    .series-name::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: #E5532C;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .series-row:hover .series-name,
    .series-row:focus-visible .series-name { color: #E5532C; }
    .series-row:hover .series-name::after,
    .series-row:focus-visible .series-name::after { transform: scaleX(1); }

    .series-sub {
      display: block;
      margin-top: clamp(4px, 0.8vh, 9px);
      font-size: clamp(10px, 1.05vw, 13px);
      font-weight: 400;
      line-height: 1.35;
      color: #7C848D;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      transition: color 0.24s ease;
    }
    .series-row:hover .series-sub,
    .series-row:focus-visible .series-sub { color: #A7AEB6; }

    .series-count {
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .series-skeleton-row {
      height: clamp(38px, 6vh, 62px);
      background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%) 0 0 / 300% 100%;
      animation: series-shimmer 1.4s ease-in-out infinite;
    }

    @keyframes series-shimmer { to { background-position: -300% 0; } }
    @keyframes series-in {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .series-row { animation: none; transition: none; }
      .series-row:hover, .series-row:focus-visible { transform: none; }
      .series-skeleton-row { animation: none; }
    }
  `;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <style>{styles}</style>
      <div style={scrollAreaStyle} className="series-scroll">
        {loading ? (
          <div className="series-list">
            {Array.from({ length: isSmallScreen ? 3 : 5 }).map((_, i) => (
              <div key={i} className="series-skeleton-row" style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        ) : series.length === 0 ? (
          <div style={messageStyle}>No series yet</div>
        ) : (
          <div className="series-list">
            {series.map((s, i) => (
              <button
                key={s.id}
                className="series-row"
                style={{ animationDelay: `${Math.min(i, 11) * 0.05}s` }}
                onClick={() => router.push(`/series/${s.slug}`)}
              >
                <span className="series-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="series-body">
                  <span className="series-name">{s.title}</span>
                  <span className="series-sub">
                    <span className="series-count">
                      {s.postCount} {s.postCount === 1 ? "post" : "posts"}
                    </span>
                    {s.description ? ` — ${s.description}` : ""}
                  </span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
