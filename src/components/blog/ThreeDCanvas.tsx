'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas } from '@react-three/fiber';
import { Waves, Sparkles, Maximize2, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/useBreakpoint';
import Tooltip from '@/components/blog/ui/Tooltip';
import InteractiveScene from './scene/InteractiveScene';
import ThreeDAssetPlaceholder from './ThreeDAssetPlaceholder';

const RICH_SCENE_KEY = 'blog:rich-scene';
const OVERLAY_Z = 10100;
const EXIT_MS = 200;
const READY_TIMEOUT_MS = 8000;
const MIN_SKELETON_MS = 1000;

const OVERLAY_CSS = `
.scene-overlay {
  position: fixed;
  inset: 0;
  z-index: ${OVERLAY_Z};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(18, 22, 28, 0);
  transition: background-color 320ms var(--ease-out-quint);
}
.scene-overlay[data-open="true"] {
  background-color: rgba(18, 22, 28, 0.55);
}
.scene-overlay[data-closing="true"] {
  transition-duration: ${EXIT_MS}ms;
}

.scene-panel {
  position: relative;
  width: min(1080px, 92vw);
  height: min(680px, 80vh);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  border: 1px solid rgba(0, 0, 0, 0.25);
  transform-origin: center;
  transform: scale(0.96);
  opacity: 0;
  transition:
    transform 320ms var(--ease-out-quint),
    opacity 320ms var(--ease-out-quint);
}
.scene-panel[data-open="true"] {
  transform: scale(1);
  opacity: 1;
}
.scene-panel[data-closing="true"] {
  transition-duration: ${EXIT_MS}ms;
}

.scene-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.scene-canvas-fade {
  position: absolute;
  inset: 0;
  opacity: 0;
  filter: blur(10px);
  transition:
    opacity 480ms var(--ease-out-quint),
    filter 480ms var(--ease-out-quint);
}
.scene-canvas-fade[data-ready="true"] {
  opacity: 1;
  filter: blur(0px);
}
.scene-canvas-fade[data-busy="true"],
.scene-skeleton[data-busy="true"] {
  transition-duration: 140ms;
}

.scene-skeleton {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 1;
  transition: opacity 380ms var(--ease-out-quint);
}
.scene-skeleton[data-ready="true"] {
  opacity: 0;
}

.scene-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  border-radius: 8px;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition:
    transform 160ms var(--ease-out-quint),
    background-color 200ms ease,
    color 200ms ease,
    border-color 200ms ease;
}
.scene-icon-btn:active {
  transform: scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
  .scene-canvas-fade {
    filter: none;
  }
  .scene-panel {
    transform: none;
  }
  .scene-panel[data-open="true"] {
    transform: none;
  }
  .scene-icon-btn:active {
    transform: none;
  }
}
`;

function iconButtonStyle(isDark: boolean): React.CSSProperties {
  return {
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.45)' : 'rgba(42,47,53,0.25)'}`,
    backgroundColor: isDark ? 'rgba(20,28,42,0.45)' : 'rgba(255,255,255,0.55)',
    color: isDark ? '#FFFFFF' : '#2A2F35',
  };
}

function SceneCanvas({
  isMobile,
  rich,
  active,
  busy = false,
}: {
  isMobile: boolean;
  rich: boolean;
  active: boolean;
  busy?: boolean;
}) {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [isMinElapsed, setIsMinElapsed] = useState(false);

  useEffect(() => {
    if (!active || isMinElapsed) return;
    const timer = setTimeout(() => setIsMinElapsed(true), MIN_SKELETON_MS);
    return () => clearTimeout(timer);
  }, [active, isMinElapsed]);

  useEffect(() => {
    if (!active || isSceneReady) return;
    const timer = setTimeout(() => setIsSceneReady(true), READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [active, isSceneReady]);

  const isReady = isSceneReady && isMinElapsed;
  const isShowing = isReady && !busy;

  return (
    <div className="scene-stage">
      <div
        className="scene-canvas-fade"
        data-ready={isShowing}
        data-busy={busy}
      >
        <Canvas
          camera={{
            position: (isMobile ? [0, 0, 5] : [0, 0, 4]) as [
              number,
              number,
              number,
            ],
            fov: 50,
          }}
          style={{ width: '100%', height: '100%', display: 'block' }}
          resize={{ offsetSize: true }}
          dpr={[1, isMobile ? 1.5 : 2]}
          frameloop={active && !busy ? 'always' : 'never'}
          gl={{ toneMappingExposure: rich ? 0.62 : 1 }}
        >
          <InteractiveScene
            isMobile={isMobile}
            rich={rich}
            onReady={() => setIsSceneReady(true)}
          />
        </Canvas>
      </div>
      <div className="scene-skeleton" data-ready={isShowing} data-busy={busy}>
        <ThreeDAssetPlaceholder isMobile={isMobile} />
      </div>
    </div>
  );
}

export default function ThreeDCanvas({
  isResizing = false,
}: {
  isResizing?: boolean;
}) {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOnscreen, setIsOnscreen] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRich, setIsRich] = useState(
    () =>
      typeof window === 'undefined' ||
      window.localStorage.getItem(RICH_SCENE_KEY) !== 'off',
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(([entry]) =>
      setIsOnscreen(entry.isIntersecting),
    );
    observer.observe(container);

    const onVisibilityChange = () => setIsPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    closeTimer.current = setTimeout(() => setIsMounted(false), EXIT_MS);
  }, []);

  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsMounted(true);
  };

  useEffect(() => {
    if (!isMounted) return;

    const frame = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(frame);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMounted, close]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const toggleRich = () => {
    setIsRich((previous) => {
      const next = !previous;
      window.localStorage.setItem(RICH_SCENE_KEY, next ? 'on' : 'off');
      return next;
    });
  };

  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: 0,
    border: '1px solid rgba(0, 0, 0, 0.22)',
    margin: 0,
    backgroundColor: 'var(--color-background)',
    position: 'relative',
  };

  const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 5,
    display: 'flex',
    gap: '8px',
  };

  const richButton = (
    <Tooltip
      label={isRich ? 'Animated background: on' : 'Animated background: off'}
      placement="bottom"
    >
      <button
        type="button"
        className="scene-icon-btn"
        onClick={toggleRich}
        style={iconButtonStyle(isRich)}
        aria-pressed={isRich}
        aria-label={
          isRich
            ? 'Turn off the animated background'
            : 'Turn on the animated background'
        }
      >
        {isRich ? <Waves size={18} /> : <Sparkles size={18} />}
      </button>
    </Tooltip>
  );

  return (
    <>
      <style>{OVERLAY_CSS}</style>

      <div ref={containerRef} style={containerStyle}>
        <div style={controlsStyle}>
          {richButton}
          {!isMobile && (
            <Tooltip label="Enlarge" placement="bottom">
              <button
                type="button"
                className="scene-icon-btn"
                onClick={open}
                style={iconButtonStyle(isRich)}
                aria-label="Enlarge the 3D scene"
              >
                <Maximize2 size={18} />
              </button>
            </Tooltip>
          )}
        </div>

        <SceneCanvas
          key={isRich ? 'rich' : 'plain'}
          isMobile={isMobile}
          rich={isRich}
          active={isOnscreen && isPageVisible && !isMounted}
          busy={isResizing}
        />
      </div>

      {isMounted &&
        createPortal(
          <div
            className="scene-overlay"
            data-open={isOpen}
            data-closing={!isOpen}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="3D scene"
          >
            <div
              className="scene-panel"
              data-open={isOpen}
              data-closing={!isOpen}
              onClick={(event) => event.stopPropagation()}
            >
              <div style={{ ...controlsStyle, top: '12px', right: '12px' }}>
                {richButton}
                <Tooltip label="Close" placement="bottom">
                  <button
                    type="button"
                    className="scene-icon-btn"
                    autoFocus
                    onClick={close}
                    style={iconButtonStyle(isRich)}
                    aria-label="Close the enlarged 3D scene"
                  >
                    <X size={18} />
                  </button>
                </Tooltip>
              </div>
              <SceneCanvas
                key={isRich ? 'rich' : 'plain'}
                isMobile={isMobile}
                rich={isRich}
                active={isPageVisible}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
