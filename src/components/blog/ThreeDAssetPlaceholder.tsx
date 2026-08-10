"use client";

import { colors } from "@/styles/colors";

const SKELETON_CSS = `
@keyframes scene-skeleton-pulse {
  0%, 100% { opacity: 0.28; }
  50% { opacity: 0.72; }
}
.scene-skeleton-cube { animation: scene-skeleton-pulse 2s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .scene-skeleton-cube { animation: none; opacity: 0.5; }
}
`;

interface ThreeDAssetPlaceholderProps {
  isMobile?: boolean;
}

export default function ThreeDAssetPlaceholder({
  isMobile = false,
}: ThreeDAssetPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: colors.background,
      }}
    >
      <style>{SKELETON_CSS}</style>

      <div
        className="scene-skeleton-cube"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "40%" : "30%",
          maxWidth: "220px",
          aspectRatio: "1 / 1",
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none">
          <polygon
            points="50,8 88,30 88,74 50,96 12,74 12,30"
            stroke="rgba(30, 38, 48, 0.55)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M50 52 L50 8 M50 52 L88 74 M50 52 L12 74"
            stroke="rgba(30, 38, 48, 0.45)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

    </div>
  );
}
