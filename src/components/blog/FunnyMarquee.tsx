"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { FunnyPicture } from "@/types/post";
import { TIMING, TRANSITIONS } from "@/styles/animations";
import { FONTS, clamp, spacing } from "@/styles/typography";

const SCROLL_SPEED = 40; // Pixels per second
const DUPLICATE_SETS = 3; // Keeps the loop seamless
const EXPANDED_WIDTH_RATIO = 0.8;
const DEFAULT_ASPECT_RATIO = 3 / 2; // Fallback until real image dimensions load
const EDGE_PADDING = 8;
const COLLAPSED_HEIGHT = "clamp(60px, 20vh, 120px)";
const EXPAND_TRANSITION = `0.4s ${TIMING.smooth}`;

const PANEL_COLOR = "#2A2F35";
const BORDER_COLOR = "rgba(255, 255, 255, 0.2)";

interface Size {
  width: number;
  height: number;
}

interface FunnyMarqueeProps {
  pictures: FunnyPicture[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const isTouchDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Position lives in refs and is written straight to the DOM, so the ~60fps
// loop never re-renders the photo list.
function useMarqueeScroll() {
  const contentRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    let offset = 0;
    let oneSetHeight = 0;
    let lastTimestamp = 0;
    let frame = 0;

    const observer = new ResizeObserver(([entry]) => {
      oneSetHeight = entry.contentRect.height / DUPLICATE_SETS;
    });
    observer.observe(content);

    const step = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 0;
      lastTimestamp = timestamp;

      if (!isPausedRef.current && oneSetHeight > 0) {
        offset = (offset + (deltaTime / 1000) * SCROLL_SPEED) % oneSetHeight;
        content.style.transform = `translateY(-${offset}px)`;
      }

      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const setPaused = useCallback((paused: boolean) => {
    isPausedRef.current = paused;
  }, []);

  return { contentRef, setPaused };
}

const collapseHandleStyles = {
  container: (isCollapsed: boolean): React.CSSProperties => ({
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "44px",
    display: "flex",
    flexDirection: isCollapsed ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isCollapsed ? PANEL_COLOR : "transparent",
    borderTop: isCollapsed ? `1px solid ${BORDER_COLOR}` : "none",
    borderBottom: isCollapsed ? `1px solid ${BORDER_COLOR}` : "none",
    borderLeft: isCollapsed ? `1px solid ${BORDER_COLOR}` : "none",
    borderRight: "none",
    borderRadius: "8px 0 0 8px",
    zIndex: 300,
  }),

  label: (isCollapsed: boolean): React.CSSProperties => ({
    fontFamily: FONTS.primary,
    fontSize: "clamp(14px, 2.5vw, 22px)",
    fontWeight: 700,
    color: "#F2E9D8",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    writingMode: "vertical-rl",
    textOrientation: "mixed",
    transform: "rotate(180deg)",
    whiteSpace: "nowrap",
    flex: 1,
    display: isCollapsed ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  }),

  handle: (isCollapsed: boolean): React.CSSProperties => ({
    width: "44px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.2s ease",
    flexShrink: 0,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: isCollapsed ? "0 8px 8px 0" : "8px 0 0 8px",
    backgroundColor: PANEL_COLOR,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  }),

  icon: (isCollapsed: boolean): React.CSSProperties => ({
    fontSize: "24px",
    color: "#E5532C",
    fontWeight: 700,
    transition: TRANSITIONS.fast("transform"),
    transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)",
    fontFamily: "monospace",
  }),
};

function CollapseHandle({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  // Repeated above and below the handle so it reads centred when collapsed
  const label = <div style={collapseHandleStyles.label(isCollapsed)}>RANDOM MOMENTS</div>;

  return (
    <div style={collapseHandleStyles.container(isCollapsed)}>
      {isCollapsed && label}
      <div
        style={collapseHandleStyles.handle(isCollapsed)}
        onClick={onToggle}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#363D44"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = PANEL_COLOR; }}
      >
        <span style={collapseHandleStyles.icon(isCollapsed)}>◀</span>
      </div>
      {isCollapsed && label}
    </div>
  );
}

const photoStyles = {
  // Slot grows with the photo so neighbours are pushed aside rather than covered
  slot: (expandedSize: Size | null): React.CSSProperties => ({
    position: "relative",
    width: "100%",
    height: expandedSize ? `${expandedSize.height}px` : COLLAPSED_HEIGHT,
    flexShrink: 0,
    cursor: "pointer",
    transition: TRANSITIONS.marqueeExpand,
  }),

  // Matches the photo's aspect ratio exactly, so `contain` never letterboxes
  frame: (expandedSize: Size | null): React.CSSProperties => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: expandedSize ? `${expandedSize.width}px` : "100%",
    height: "100%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: `width ${EXPAND_TRANSITION}`,
  }),

  layer: (objectFit: "cover" | "contain", isVisible: boolean): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit,
    objectPosition: "center",
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${EXPAND_TRANSITION}`,
    pointerEvents: "none",
  }),

  fallback: {
    position: "absolute",
    inset: 0,
    backgroundColor: "#444C55",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "clamp(24px, 5vw, 40px)",
    color: "#666666",
  } as React.CSSProperties,

  caption: (isExpanded: boolean): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.sm,
    opacity: isExpanded ? 1 : 0,
    transition: `opacity ${EXPAND_TRANSITION}`,
    zIndex: 2,
  }),

  title: {
    fontFamily: FONTS.primary,
    fontSize: clamp.sm,
    fontWeight: 700,
    color: "#FFFFFF",
    margin: "0",
    lineHeight: "1.3",
    textAlign: "center",
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
  } as React.CSSProperties,

  meta: {
    fontFamily: FONTS.primary,
    fontSize: clamp.xs,
    fontWeight: 400,
    color: "#CCCCCC",
    margin: "0",
    textAlign: "center",
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.5)",
  } as React.CSSProperties,
};

interface MarqueePhotoProps {
  picture: FunnyPicture;
  isExpanded: boolean;
  expandedSize: Size | null;
  hasError: boolean;
  slotRef: (el: HTMLDivElement | null) => void;
  /** Used as both <img> ref and onLoad handler, so it must tolerate repeat calls */
  measureImage: (img: HTMLImageElement | null) => void;
  onError: () => void;
  onHover: (isEntering: boolean) => void;
  onTouch: () => void;
}

function MarqueePhoto({
  picture,
  isExpanded,
  expandedSize,
  hasError,
  slotRef,
  measureImage,
  onError,
  onHover,
  onTouch,
}: MarqueePhotoProps) {
  const size = isExpanded ? expandedSize : null;

  const imageLayer = (objectFit: "cover" | "contain", isVisible: boolean) => (
    <img
      ref={measureImage}
      src={picture.image}
      alt={picture.title}
      loading="lazy"
      style={photoStyles.layer(objectFit, isVisible)}
      onLoad={(e) => measureImage(e.currentTarget)}
      onError={onError}
    />
  );

  return (
    <div
      ref={slotRef}
      style={photoStyles.slot(size)}
      onTouchStart={(e) => {
        e.preventDefault(); // Prevent mouse emulation
        onTouch();
      }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div style={photoStyles.frame(size)}>
        {hasError ? (
          <div style={photoStyles.fallback}>📸</div>
        ) : (
          <>
            {/* Cropped by default, swapped for the full photo once expanded */}
            {imageLayer("cover", !isExpanded)}
            {imageLayer("contain", isExpanded)}
          </>
        )}
        {/* Keeps pointer events so taps still toggle on mobile */}
        <div style={photoStyles.caption(isExpanded)}>
          <h3 style={photoStyles.title}>{picture.title}</h3>
          <p style={photoStyles.meta}>{picture.location} · {picture.date}</p>
        </div>
      </div>
    </div>
  );
}

const marqueeStyles = {
  container: {
    height: "100%",
    overflow: "hidden",
    position: "relative",
    backgroundColor: PANEL_COLOR,
    display: "flex",
    flexDirection: "column",
  } as React.CSSProperties,

  content: (isCollapsed: boolean): React.CSSProperties => ({
    position: "relative",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    opacity: isCollapsed ? 0 : 1,
    pointerEvents: isCollapsed ? "none" : "auto",
    transition: TRANSITIONS.fast("opacity"),
  }),

  header: {
    fontFamily: FONTS.primary,
    fontSize: "clamp(20px, 3vw, 28px)",
    fontWeight: 700,
    color: "#FFFFFF",
    padding: "clamp(6px, 1vh, 12px)",
    margin: "0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderTop: `1px solid ${BORDER_COLOR}`,
    borderBottom: `1px solid ${BORDER_COLOR}`,
    flexShrink: 0,
    textAlign: "center",
    position: "relative",
    zIndex: 100,
    backgroundColor: PANEL_COLOR,
  } as React.CSSProperties,

  viewport: {
    width: "100%",
    flex: 1,
    overflow: "hidden",
    position: "relative",
  } as React.CSSProperties,

  track: {
    padding: `${spacing.sm} clamp(6px, 1vw, 12px)`,
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
    willChange: "transform",
  } as React.CSSProperties,
};

export default function FunnyMarquee({ pictures, isCollapsed = false, onToggleCollapse }: FunnyMarqueeProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedSize, setExpandedSize] = useState<Size | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const { contentRef, setPaused } = useMarqueeScroll();
  const viewportRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Ref, not state: recording a ratio must not render, or the <img> ref refires in a loop
  const aspectRatios = useRef<Map<number, number>>(new Map());

  const visiblePictures = useMemo(
    () => Array.from({ length: DUPLICATE_SETS }, () => pictures).flat(),
    [pictures]
  );

  // As wide as the ratio allows, capped to the visible marquee height
  const measureExpandedSize = useCallback((index: number, aspectRatio: number): Size => {
    const slot = slotRefs.current[index];
    const viewport = viewportRef.current;
    if (!slot || !viewport) return { width: 0, height: 0 };

    const slotRect = slot.getBoundingClientRect();
    const maxHeight = Math.max(
      slotRect.height,
      viewport.getBoundingClientRect().height - EDGE_PADDING * 2
    );
    const width = Math.min(slotRect.width * EXPANDED_WIDTH_RATIO, maxHeight * aspectRatio);

    return { width, height: width / aspectRatio };
  }, []);

  const collapse = useCallback(() => {
    setExpandedIndex(null);
    setExpandedSize(null);
    setPaused(false);
  }, [setPaused]);

  const expand = useCallback((index: number) => {
    const pictureId = visiblePictures[index].id;
    const aspectRatio = aspectRatios.current.get(pictureId) ?? DEFAULT_ASPECT_RATIO;
    setExpandedIndex(index);
    setExpandedSize(measureExpandedSize(index, aspectRatio));
    setPaused(true);
  }, [measureExpandedSize, setPaused, visiblePictures]);

  // Also runs as the <img> ref: cached images can load before React attaches onLoad
  const measureImage = useCallback((index: number, pictureId: number, img: HTMLImageElement | null) => {
    if (!img?.complete || !img.naturalWidth) return;

    const aspectRatio = img.naturalWidth / img.naturalHeight;
    if (aspectRatios.current.get(pictureId) === aspectRatio) return;
    aspectRatios.current.set(pictureId, aspectRatio);

    // Photo was hovered before it loaded: re-measure with the real ratio
    if (index === expandedIndex) {
      setExpandedSize(measureExpandedSize(index, aspectRatio));
    }
  }, [expandedIndex, measureExpandedSize]);

  return (
    <div style={marqueeStyles.container}>
      {onToggleCollapse && (
        <CollapseHandle isCollapsed={isCollapsed} onToggle={onToggleCollapse} />
      )}

      <div style={marqueeStyles.content(isCollapsed)}>
        <h2 style={marqueeStyles.header}>RANDOM MOMENT</h2>

        <div ref={viewportRef} style={marqueeStyles.viewport}>
          <div ref={contentRef} style={marqueeStyles.track}>
            {visiblePictures.map((picture, index) => (
              <MarqueePhoto
                key={`${picture.id}-${index}`}
                picture={picture}
                isExpanded={expandedIndex === index}
                expandedSize={expandedSize}
                hasError={imageErrors.has(picture.id)} // Track by ID, not index
                slotRef={(el) => { slotRefs.current[index] = el; }}
                measureImage={(img) => measureImage(index, picture.id, img)}
                onError={() => setImageErrors(prev => new Set(prev).add(picture.id))}
                onHover={(isEntering) => {
                  if (isTouchDevice()) return;
                  if (isEntering) expand(index); else collapse();
                }}
                onTouch={() => {
                  if (expandedIndex === index) collapse(); else expand(index);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
