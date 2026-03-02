"use client";

import { useState, useRef, useEffect } from "react";
import { FONTS, clamp, spacing } from "@/styles/typography";
import { colors } from "@/styles/colors";

interface Series {
  id: number;
  title: string;
  slug: string;
}

interface SeriesMultiSelectProps {
  availableSeries: Series[];
  selectedSeriesIds: number[];
  onChange: (selectedIds: number[]) => void;
  disabled?: boolean;
}

export default function SeriesMultiSelect({
  availableSeries,
  selectedSeriesIds,
  onChange,
  disabled = false,
}: SeriesMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function toggleSeries(seriesId: number) {
    if (selectedSeriesIds.includes(seriesId)) {
      onChange(selectedSeriesIds.filter((id) => id !== seriesId));
    } else {
      onChange([...selectedSeriesIds, seriesId]);
    }
  }

  function removeSeries(seriesId: number) {
    onChange(selectedSeriesIds.filter((id) => id !== seriesId));
  }

  const selectedSeries = availableSeries.filter((s) =>
    selectedSeriesIds.includes(s.id)
  );

  const containerStyle: React.CSSProperties = {
    position: "relative",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    fontWeight: 400,
    color: colors.darkText,
    backgroundColor: "#2A2F35",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    padding: spacing.sm,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    textAlign: "left" as const,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s ease",
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "4px",
    backgroundColor: "#2A2F35",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
    maxHeight: "300px",
    overflowY: "auto" as const,
    zIndex: 1000,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
  };

  const optionStyle: React.CSSProperties = {
    padding: spacing.sm,
    fontFamily: FONTS.primary,
    fontSize: clamp.base,
    color: colors.darkText,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "background-color 0.2s ease",
  };

  const tagsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    marginTop: spacing.sm,
  };

  const tagStyle: React.CSSProperties = {
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    fontWeight: 500,
    color: colors.darkText,
    backgroundColor: "#363D44",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "4px",
    padding: "4px 8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const removeButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    color: "#999999",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    padding: "0",
    display: "flex",
    alignItems: "center",
    lineHeight: 1,
    transition: "color 0.2s ease",
  };

  const checkboxStyle: React.CSSProperties = {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle} ref={dropdownRef}>
      <button
        type="button"
        style={buttonStyle}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = colors.accent;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }}
      >
        <span>
          {selectedSeriesIds.length === 0
            ? "Select Series"
            : `${selectedSeriesIds.length} Series Selected`}
        </span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && !disabled && (
        <div style={dropdownStyle}>
          {availableSeries.length === 0 ? (
            <div style={{ ...optionStyle, cursor: "default" }}>
              No series available
            </div>
          ) : (
            availableSeries.map((series) => (
              <div
                key={series.id}
                style={optionStyle}
                onClick={() => toggleSeries(series.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedSeriesIds.includes(series.id)}
                  onChange={() => {}}
                  style={checkboxStyle}
                  onClick={(e) => e.stopPropagation()}
                />
                <span>{series.title}</span>
              </div>
            ))
          )}
        </div>
      )}

      {selectedSeries.length > 0 && (
        <div style={tagsContainerStyle}>
          {selectedSeries.map((series) => (
            <div key={series.id} style={tagStyle}>
              <span>{series.title}</span>
              <button
                type="button"
                style={removeButtonStyle}
                onClick={() => removeSeries(series.id)}
                disabled={disabled}
                onMouseEnter={(e) => {
                  if (!disabled) {
                    e.currentTarget.style.color = colors.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#999999";
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
