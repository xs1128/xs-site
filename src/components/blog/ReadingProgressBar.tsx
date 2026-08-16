'use client';

const TRACK_BG = 'color-mix(in srgb, var(--color-accent) 20%, transparent)';
const GLOW =
  '0 0 10px color-mix(in srgb, var(--color-accent) 50%, transparent)';

interface ReadingProgressBarProps {
  /** Smoothed reading progress, 0..100. */
  progress: number;
  /** Whether the footer is in view (swaps fixed -> absolute positioning). */
  footerVisible: boolean;
}

/**
 * Presentational reading-progress bar: a fixed track at the bottom of the
 * viewport with an accent fill scaled by `progress`. When the footer scrolls
 * into view it switches to absolute positioning so it sticks at the content
 * bottom instead of overlapping the footer.
 *
 * Smoothing is handled upstream by the rAF lerp in useScrollProgress, so the
 * fill intentionally has no CSS transition (that would double-smooth and
 * reintroduce lag). Reduced-motion behavior also lives in that hook.
 */
export default function ReadingProgressBar({
  progress,
  footerVisible,
}: ReadingProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: footerVisible ? 'absolute' : 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '6px',
        backgroundColor: TRACK_BG,
        zIndex: 101,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '100%',
          transformOrigin: 'left',
          transform: `scaleX(${progress / 100})`,
          backgroundColor: 'var(--color-accent)',
          // No CSS transition: the rAF lerp in useScrollProgress already
          // smooths the value. A transition here would double-smooth and
          // reintroduce the very lag we're removing.
          transition: 'none',
          boxShadow: GLOW,
        }}
      />
    </div>
  );
}
