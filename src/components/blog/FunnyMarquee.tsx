"use client";

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { isOptimizable } from "@/lib/images";
import type { FunnyPicture } from "@/types/post";
import { TIMING, TRANSITIONS } from "@/styles/animations";
import { FONTS, clamp, spacing } from "@/styles/typography";
import { SkeletonElement } from "@/components/skeleton";

const SCROLL_SPEED = 40; // Pixels per second
const duplicateSetsFor = (count: number) => (count >= 8 ? 2 : 3);
const EXPANDED_WIDTH_RATIO = 0.8;
const DEFAULT_ASPECT_RATIO = 3 / 2; // Fallback until real image dimensions load
const EDGE_PADDING = 8;
const COLLAPSED_HEIGHT = "clamp(60px, 20vh, 120px)";
const EXPAND_TRANSITION = `0.4s ${TIMING.smooth}`;
const MARQUEE_SIZES = "(max-width: 1200px) 40vw, 30vw";
const OPEN_SETTLE_MS = 450;

const PANEL_COLOR = "#2A2F35";
const BORDER_COLOR = "rgba(255, 255, 255, 0.2)";

interface Size {
  width: number;
  height: number;
}

interface FunnyMarqueeProps {
  pictures: FunnyPicture[];
  isCollapsed?: boolean;
  isResizing?: boolean;
  onToggleCollapse?: () => void;
}

const isTouchDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0;

// Position lives in refs and is written straight to the DOM, so the ~60fps
// loop never re-renders the photo list.
function useMarqueeScroll(isActive: boolean, duplicateSets: number) {
  const contentRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const offsetRef = useRef(0);
  const [isOnscreen, setIsOnscreen] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new IntersectionObserver(([entry]) => setIsOnscreen(entry.isIntersecting));
    observer.observe(content);

    const onVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const isRunning = isActive && isOnscreen && isPageVisible;

  useEffect(() => {
    const content = contentRef.current;
    if (!content || !isRunning) return;

    let oneSetHeight = 0;
    let lastTimestamp = 0;
    let frame = 0;

    const observer = new ResizeObserver(([entry]) => {
      oneSetHeight = entry.contentRect.height / duplicateSets;
    });
    observer.observe(content);

    const step = (timestamp: number) => {
      const deltaTime = lastTimestamp ? timestamp - lastTimestamp : 0;
      lastTimestamp = timestamp;

      if (!isPausedRef.current && oneSetHeight > 0) {
        offsetRef.current = (offsetRef.current + (deltaTime / 1000) * SCROLL_SPEED) % oneSetHeight;
        content.style.transform = `translateY(-${offsetRef.current}px)`;
      }

      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [isRunning, duplicateSets]);

  const setPaused = useCallback((paused: boolean) => {
    isPausedRef.current = paused;
  }, []);

  return { contentRef, setPaused, isRunning };
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
    backgroundColor: "transparent",
    border: "none",
    zIndex: 300,
  }),

  handle: (isCollapsed: boolean): React.CSSProperties => ({
    width: "44px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease, opacity 0.2s ease",
    flexShrink: 0,
    border: isCollapsed ? "none" : `1px solid ${BORDER_COLOR}`,
    borderRadius: isCollapsed ? "0" : "8px 0 0 8px",
    backgroundColor: isCollapsed ? "transparent" : PANEL_COLOR,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  }),

  icon: (isCollapsed: boolean): React.CSSProperties => ({
    fontSize: "24px",
    color: "#E5532C",
    display: "inline-flex",
    transition: TRANSITIONS.fast("transform"),
    transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
  }),
};

function CollapseHandle({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  return (
    <div style={collapseHandleStyles.container(isCollapsed)}>
      <div
        style={collapseHandleStyles.handle(isCollapsed)}
        onClick={onToggle}
        onMouseEnter={(e) => {
          if (isCollapsed) e.currentTarget.style.opacity = "0.7";
          else e.currentTarget.style.backgroundColor = "#363D44";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.backgroundColor = isCollapsed ? "transparent" : PANEL_COLOR;
        }}
      >
        <span style={collapseHandleStyles.icon(isCollapsed)}>
          <Play size="0.8em" fill="currentColor" strokeWidth={1.5} />
        </span>
      </div>
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
  index: number;
  isExpanded: boolean;
  expandedSize: Size | null;
  hasError: boolean;
  isPrimarySet: boolean;
  onSlotRef: (index: number, el: HTMLDivElement | null) => void;
  /** Used as both <img> ref and onLoad handler, so it must tolerate repeat calls */
  onMeasure: (index: number, pictureId: number, img: HTMLImageElement | null) => void;
  onError: (pictureId: number) => void;
  onHover: (index: number, isEntering: boolean) => void;
  onTouch: (index: number) => void;
}

const MarqueePhoto = memo(function MarqueePhoto({
  picture,
  index,
  isExpanded,
  expandedSize,
  hasError,
  isPrimarySet,
  onSlotRef,
  onMeasure,
  onError,
  onHover,
  onTouch,
}: MarqueePhotoProps) {
  const size = isExpanded ? expandedSize : null;
  const measureImage = (img: HTMLImageElement | null) => onMeasure(index, picture.id, img);

  const imageLayer = (objectFit: "cover" | "contain", isVisible: boolean) =>
    isOptimizable(picture.image) ? (
      <Image
        ref={measureImage}
        src={picture.image}
        alt={picture.title}
        fill
        sizes={MARQUEE_SIZES}
        loading={isPrimarySet ? "eager" : "lazy"}
        style={photoStyles.layer(objectFit, isVisible)}
        onLoad={(e) => measureImage(e.currentTarget)}
        onError={() => onError(picture.id)}
      />
    ) : (
      <img
        ref={measureImage}
        src={picture.image}
        alt={picture.title}
        loading={isPrimarySet ? "eager" : "lazy"}
        decoding="async"
        style={photoStyles.layer(objectFit, isVisible)}
        onLoad={(e) => measureImage(e.currentTarget)}
        onError={() => onError(picture.id)}
      />
    );

  return (
    <div
      ref={(el) => { onSlotRef(index, el); }}
      style={photoStyles.slot(size)}
      onTouchStart={(e) => {
        e.preventDefault(); // Prevent mouse emulation
        onTouch(index);
      }}
      onMouseEnter={() => onHover(index, true)}
      onMouseLeave={() => onHover(index, false)}
    >
      <div style={photoStyles.frame(size)}>
        {hasError || !picture.image ? (
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
});

const marqueeStyles = {
  container: {
    height: "100%",
    overflow: "hidden",
    position: "relative",
    backgroundColor: PANEL_COLOR,
    display: "flex",
    flexDirection: "column",
    contain: "layout paint",
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

  track: (isRunning: boolean, isResizing: boolean): React.CSSProperties => ({
    padding: `${spacing.sm} clamp(6px, 1vw, 12px)`,
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
    willChange: isRunning ? "transform" : "auto",
    contentVisibility: isResizing ? "hidden" : "visible",
  }),

  skeletonTrack: {
    position: "absolute",
    inset: 0,
    padding: `${spacing.sm} clamp(6px, 1vw, 12px)`,
    display: "flex",
    flexDirection: "column",
    gap: spacing.sm,
    pointerEvents: "none",
  } as React.CSSProperties,
};

const SKELETON_SLOTS = 10;

function MarqueeSkeleton() {
  return (
    <div style={marqueeStyles.skeletonTrack}>
      {Array.from({ length: SKELETON_SLOTS }, (_, index) => (
        <SkeletonElement key={index} height={COLLAPSED_HEIGHT} style={{ flexShrink: 0 }} />
      ))}
    </div>
  );
}

export default function FunnyMarquee({
  pictures,
  isCollapsed = false,
  isResizing = false,
  onToggleCollapse,
}: FunnyMarqueeProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [expandedSize, setExpandedSize] = useState<Size | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const duplicateSets = duplicateSetsFor(pictures.length);
  const { contentRef, setPaused, isRunning } = useMarqueeScroll(!isCollapsed && !isResizing, duplicateSets);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Ref, not state: recording a ratio must not render, or the <img> ref refires in a loop
  const aspectRatios = useRef<Map<number, number>>(new Map());

  const visiblePictures = useMemo(
    () => Array.from({ length: duplicateSets }, () => pictures).flat(),
    [pictures, duplicateSets]
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

  const visiblePicturesRef = useRef(visiblePictures);
  const expandedIndexRef = useRef<number | null>(null);
  const isOpeningRef = useRef(false);

  useEffect(() => {
    visiblePicturesRef.current = visiblePictures;
    expandedIndexRef.current = expandedIndex;
  }, [visiblePictures, expandedIndex]);

  useEffect(() => {
    if (isCollapsed) {
      isOpeningRef.current = false;
      return;
    }
    isOpeningRef.current = true;
    const timer = setTimeout(() => { isOpeningRef.current = false; }, OPEN_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [isCollapsed]);

  const expand = useCallback((index: number) => {
    const pictureId = visiblePicturesRef.current[index].id;
    const aspectRatio = aspectRatios.current.get(pictureId) ?? DEFAULT_ASPECT_RATIO;
    setExpandedIndex(index);
    setExpandedSize(measureExpandedSize(index, aspectRatio));
    setPaused(true);
  }, [measureExpandedSize, setPaused]);

  // Also runs as the <img> ref: cached images can load before React attaches onLoad
  const measureImage = useCallback((index: number, pictureId: number, img: HTMLImageElement | null) => {
    if (!img?.complete || !img.naturalWidth) return;

    const aspectRatio = img.naturalWidth / img.naturalHeight;
    if (aspectRatios.current.get(pictureId) === aspectRatio) return;
    aspectRatios.current.set(pictureId, aspectRatio);

    // Photo was hovered before it loaded: re-measure with the real ratio
    if (index === expandedIndexRef.current) {
      setExpandedSize(measureExpandedSize(index, aspectRatio));
    }
  }, [measureExpandedSize]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || expandedIndex === null) return;

    const observer = new ResizeObserver(() => {
      const picture = visiblePicturesRef.current[expandedIndex];
      if (!picture) return;
      const aspectRatio = aspectRatios.current.get(picture.id) ?? DEFAULT_ASPECT_RATIO;
      setExpandedSize(measureExpandedSize(expandedIndex, aspectRatio));
    });
    observer.observe(viewport);

    return () => observer.disconnect();
  }, [expandedIndex, measureExpandedSize]);

  const handleSlotRef = useCallback((index: number, el: HTMLDivElement | null) => {
    slotRefs.current[index] = el;
  }, []);

  const handleError = useCallback((pictureId: number) => {
    setImageErrors(prev => new Set(prev).add(pictureId));
  }, []);

  const handleHover = useCallback((index: number, isEntering: boolean) => {
    if (isTouchDevice() || isOpeningRef.current) return;
    if (isEntering) expand(index); else collapse();
  }, [expand, collapse]);

  const handleTouch = useCallback((index: number) => {
    if (expandedIndexRef.current === index) collapse(); else expand(index);
  }, [expand, collapse]);

  return (
    <div style={marqueeStyles.container}>
      {onToggleCollapse && (
        <CollapseHandle isCollapsed={isCollapsed} onToggle={onToggleCollapse} />
      )}

      <div style={marqueeStyles.content(isCollapsed)}>
        <h2 style={marqueeStyles.header}>RANDOM MOMENT</h2>

        <div ref={viewportRef} style={marqueeStyles.viewport}>
          {isResizing && !isCollapsed && <MarqueeSkeleton />}
          <div ref={contentRef} style={marqueeStyles.track(isRunning, isResizing)}>
            {visiblePictures.map((picture, index) => (
              <MarqueePhoto
                key={`${picture.id}-${index}`}
                picture={picture}
                index={index}
                isExpanded={expandedIndex === index}
                expandedSize={expandedIndex === index ? expandedSize : null}
                hasError={imageErrors.has(picture.id)} // Track by ID, not index
                isPrimarySet={index < pictures.length}
                onSlotRef={handleSlotRef}
                onMeasure={measureImage}
                onError={handleError}
                onHover={handleHover}
                onTouch={handleTouch}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
