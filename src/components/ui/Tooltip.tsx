'use client';

import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { FocusEvent, MouseEvent, PointerEvent, ReactElement } from 'react';
import { createPortal } from 'react-dom';

type Placement = 'top' | 'bottom' | 'left' | 'right';

const OPEN_DELAY_MS = 350;
const CLOSE_DELAY_MS = 80;
const SKIP_DELAY_MS = 300;
const GAP = 8;
const EDGE = 8;

const OPPOSITE: Record<Placement, Placement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

// Shared across every tooltip: moving along an icon row should feel instant
// once the first one has paid the open delay.
let lastClosedAt = 0;

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

interface Position {
  x: number;
  y: number;
  placement: Placement;
}

// A zero-size rect at the cursor. place() reads nothing else, so cursor
// anchoring gets the same flip and edge clamping as element anchoring.
const cursorRect = (x: number, y: number) =>
  ({ top: y, bottom: y, left: x, right: x, width: 0, height: 0 }) as DOMRect;

// tip is measured with offsetWidth/Height, not a rect: the enter transition
// scales the tooltip, and a scaled rect would offset the centering.
function place(
  trigger: DOMRect,
  tip: { width: number; height: number },
  preferred: Placement,
): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const fits = (candidate: Placement) => {
    switch (candidate) {
      case 'top':
        return trigger.top - tip.height - GAP >= EDGE;
      case 'bottom':
        return trigger.bottom + tip.height + GAP <= vh - EDGE;
      case 'left':
        return trigger.left - tip.width - GAP >= EDGE;
      case 'right':
        return trigger.right + tip.width + GAP <= vw - EDGE;
    }
  };

  const flipped = OPPOSITE[preferred];
  const placement = fits(preferred)
    ? preferred
    : fits(flipped)
      ? flipped
      : preferred;

  let x: number;
  let y: number;

  if (placement === 'top' || placement === 'bottom') {
    x = trigger.left + trigger.width / 2 - tip.width / 2;
    y =
      placement === 'top'
        ? trigger.top - tip.height - GAP
        : trigger.bottom + GAP;
  } else {
    x =
      placement === 'left'
        ? trigger.left - tip.width - GAP
        : trigger.right + GAP;
    y = trigger.top + trigger.height / 2 - tip.height / 2;
  }

  return {
    x: Math.min(Math.max(x, EDGE), Math.max(EDGE, vw - tip.width - EDGE)),
    y: Math.min(Math.max(y, EDGE), Math.max(EDGE, vh - tip.height - EDGE)),
    placement,
  };
}

function useCanHover(): boolean {
  const query = '(hover: hover) and (pointer: fine)';
  const [canHover, setCanHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setCanHover(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return canHover;
}

type TriggerProps = {
  'aria-describedby'?: string;
  onPointerEnter?: (event: PointerEvent<HTMLElement>) => void;
  onPointerMove?: (event: PointerEvent<HTMLElement>) => void;
  onPointerLeave?: (event: PointerEvent<HTMLElement>) => void;
  onFocus?: (event: FocusEvent<HTMLElement>) => void;
  onBlur?: (event: FocusEvent<HTMLElement>) => void;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  ref?: React.Ref<HTMLElement>;
};

export interface TooltipProps {
  /** Text shown in the tip */
  label: string;
  /** Preferred side; flips to the opposite one when it won't fit */
  placement?: Placement;
  /** Track the cursor instead of the trigger box. Falls back to the box on keyboard focus */
  followCursor?: boolean;
  /** Single element trigger — it is cloned, so it must take a ref and handlers */
  children: ReactElement<TriggerProps>;
}

/**
 * Hover/focus tooltip portalled to document.body, so no ancestor `overflow`
 * or stacking context can clip it. Returns `children` untouched on touch —
 * a tooltip nothing can hover is dead weight.
 */
export function Tooltip({
  label,
  placement = 'top',
  followCursor = false,
  children,
}: TooltipProps) {
  const canHover = useCanHover();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [instant, setInstant] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursor = useRef<{ x: number; y: number } | null>(null);
  // Cached at open: re-reading offsetWidth per frame would force layout
  const tipSize = useRef({ width: 0, height: 0 });
  const raf = useRef<number | null>(null);
  const id = useId();

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const show = useCallback((immediate: boolean) => {
    clearTimer();
    // Second tip in a row: no delay, and no entrance either — the eye is
    // already there, so replaying the animation just reads as lag
    const skipping = Date.now() - lastClosedAt < SKIP_DELAY_MS;
    setInstant(skipping);
    const delay = immediate || skipping ? 0 : OPEN_DELAY_MS;
    timer.current = setTimeout(() => setOpen(true), delay);
  }, []);

  const hide = useCallback((immediate: boolean) => {
    clearTimer();
    const finish = () => {
      setOpen((wasOpen) => {
        if (wasOpen) lastClosedAt = Date.now();
        return false;
      });
      setPosition(null);
    };
    if (immediate) finish();
    else timer.current = setTimeout(finish, CLOSE_DELAY_MS);
  }, []);

  useEffect(() => clearTimer, []);

  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tipRef.current;
    if (!trigger || !tip) return;
    tipSize.current = { width: tip.offsetWidth, height: tip.offsetHeight };
    const anchor =
      followCursor && cursor.current
        ? cursorRect(cursor.current.x, cursor.current.y)
        : trigger.getBoundingClientRect();
    setPosition(place(anchor, tipSize.current, placement));
  }, [placement, followCursor]);

  // Follow updates bypass React: one rAF-throttled style write per frame
  useEffect(() => {
    if (!open || !followCursor) return;

    const onMove = (event: globalThis.PointerEvent) => {
      cursor.current = { x: event.clientX, y: event.clientY };
      if (raf.current !== null) return;
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        const tip = tipRef.current;
        const at = cursor.current;
        if (!tip || !at) return;
        const next = place(cursorRect(at.x, at.y), tipSize.current, placement);
        tip.style.left = `${next.x}px`;
        tip.style.top = `${next.y}px`;
      });
    };

    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [open, followCursor, placement]);

  useIsomorphicLayoutEffect(() => {
    if (open) reposition();
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;

    const onScrollOrResize = () => reposition();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hide(true);
    };

    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, reposition, hide]);

  if (!canHover) return children;

  const childProps = children.props;

  // eslint-disable-next-line react-hooks/refs -- cloneElement only forwards the ref, nothing reads .current during render
  const trigger = cloneElement(children, {
    ref: triggerRef,
    'aria-describedby': open ? id : childProps['aria-describedby'],
    onPointerEnter: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerEnter?.(event);
      cursor.current = { x: event.clientX, y: event.clientY };
      show(false);
    },
    // Keeps the open-delay from placing the tip where the cursor used to be
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerMove?.(event);
      cursor.current = { x: event.clientX, y: event.clientY };
    },
    onPointerLeave: (event: PointerEvent<HTMLElement>) => {
      childProps.onPointerLeave?.(event);
      hide(false);
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(event);
      // No cursor to follow on a keyboard focus — anchor to the box
      cursor.current = null;
      if (event.currentTarget.matches(':focus-visible')) show(true);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(event);
      hide(true);
    },
    onClick: (event: MouseEvent<HTMLElement>) => {
      childProps.onClick?.(event);
      hide(true);
    },
  });

  return (
    <>
      {trigger}
      {open &&
        createPortal(
          <div
            ref={tipRef}
            id={id}
            role="tooltip"
            className="tooltip"
            data-placement={position?.placement ?? placement}
            data-ready={position !== null}
            data-instant={instant ? 'true' : undefined}
            style={{ left: position?.x ?? 0, top: position?.y ?? 0 }}
          >
            {label}
          </div>,
          document.body,
        )}
    </>
  );
}
