'use client'

import { colors } from '@/styles/colors'

// Translucent variants of the brand accent (colors.accent === '#E5532C').
// colors.ts exposes the accent only as an opaque hex with no alpha helper, so
// the alpha forms are spelled out here as named constants rather than left as
// bare magic values inline. Keep these in sync with colors.accent.
const TRACK_BG = 'rgba(229, 83, 44, 0.2)' // colors.accent @ 0.2 alpha
const GLOW = '0 0 10px rgba(229, 83, 44, 0.5)' // colors.accent @ 0.5 alpha

interface ReadingProgressBarProps {
  /** Smoothed reading progress, 0..100. */
  progress: number
  /** Whether the footer is in view (swaps fixed -> absolute positioning). */
  footerVisible: boolean
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
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
        transformOrigin: 'left',
        transform: `scaleX(${progress / 100})`,
        backgroundColor: colors.accent,
        // No CSS transition: the rAF lerp in useScrollProgress already
        // smooths the value. A transition here would double-smooth and
        // reintroduce the very lag we're removing.
        transition: 'none',
        boxShadow: GLOW,
      }} />
    </div>
  )
}
