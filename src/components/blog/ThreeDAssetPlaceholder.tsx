'use client';

const SPINNER_FRAMES = ['|', '/', '-', '\\'];
const SPIN_CYCLE_MS = 640;
const EDGE_CYCLE_MS = 1600;
const INK = 'rgba(30, 38, 48, ';

const SKELETON_CSS = `
@keyframes scene-skeleton-spin {
  0%, 24.99% { opacity: 1; }
  25%, 100% { opacity: 0; }
}
@keyframes scene-skeleton-caret {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes scene-skeleton-shell {
  0%, 49.99% { stroke-width: 1.5; }
  50%, 100% { stroke-width: 3.6; }
}
@keyframes scene-skeleton-spokes {
  0%, 49.99% { stroke-width: 3.6; }
  50%, 100% { stroke-width: 1.5; }
}

.scene-skeleton-spin {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  animation: scene-skeleton-spin ${SPIN_CYCLE_MS}ms steps(1, end) infinite;
}
.scene-skeleton-caret {
  animation: scene-skeleton-caret 1060ms steps(1, end) infinite;
}
.scene-skeleton-shell {
  animation: scene-skeleton-shell ${EDGE_CYCLE_MS}ms steps(1, end) infinite;
}
.scene-skeleton-spokes {
  animation: scene-skeleton-spokes ${EDGE_CYCLE_MS}ms steps(1, end) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .scene-skeleton-spin,
  .scene-skeleton-caret,
  .scene-skeleton-shell,
  .scene-skeleton-spokes {
    animation: none;
  }
  .scene-skeleton-spin:first-child {
    opacity: 1;
  }
}
`;

interface ThreeDAssetPlaceholderProps {
  isMobile?: boolean;
}

export default function ThreeDAssetPlaceholder({
  isMobile = false,
}: ThreeDAssetPlaceholderProps) {
  const lineStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontFamily: "'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace",
    fontSize: isMobile ? '11px' : '13px',
    letterSpacing: '0.04em',
    lineHeight: 2,
    whiteSpace: 'nowrap',
  };

  const gutterStyle: React.CSSProperties = {
    position: 'relative',
    flexShrink: 0,
    width: '1.1em',
    height: '1.1em',
  };

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: 'var(--color-background, var(--color-landing-bg))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '18px' : '24px',
      }}
    >
      <style>{SKELETON_CSS}</style>

      <svg
        viewBox="0 0 100 100"
        width={isMobile ? 68 : 92}
        height={isMobile ? 68 : 92}
        fill="none"
        stroke={`${INK}0.62)`}
        strokeWidth="2.5"
      >
        <polygon
          className="scene-skeleton-shell"
          points="50,8 88,30 88,74 50,96 12,74 12,30"
          strokeLinejoin="round"
        />
        <path
          className="scene-skeleton-spokes"
          d="M50 52 L50 8 M50 52 L88 74 M50 52 L12 74"
          strokeLinecap="round"
        />
      </svg>

      <div>
        <div style={{ ...lineStyle, color: `${INK}0.72)` }}>
          <span style={gutterStyle}>
            {SPINNER_FRAMES.map((frame, index) => (
              <span
                key={frame}
                className="scene-skeleton-spin"
                style={{
                  animationDelay: `${(index * SPIN_CYCLE_MS) / SPINNER_FRAMES.length}ms`,
                }}
              >
                {frame}
              </span>
            ))}
          </span>
          <span>building scene</span>
        </div>
        <div style={{ ...lineStyle, color: `${INK}0.4)` }}>
          <span style={gutterStyle} />
          <span>
            compiling shaders
            <span className="scene-skeleton-caret"> █</span>
          </span>
        </div>
      </div>
    </div>
  );
}
