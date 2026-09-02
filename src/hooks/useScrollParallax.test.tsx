import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useRef } from 'react';
import {
  useScrollParallax,
  type UseScrollParallaxOptions,
} from './useScrollParallax';

// Queue frames instead of running them inline. A stub that invoked the callback
// synchronously would not match real rAF, where the id is assigned before the
// callback runs, and would hide throttle bugs rather than catch them. The id is
// 0 on purpose: it has to read as "a frame is pending", not as absent.
let frames: FrameRequestCallback[] = [];
vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
  frames.push(cb);
  return 0;
});
vi.stubGlobal('cancelAnimationFrame', () => {});

function flushFrames() {
  const pending = frames;
  frames = [];
  act(() => pending.forEach((cb) => cb(0)));
}

// This jsdom build ships no matchMedia, which useReducedMotion calls during
// render, so every test needs one.
function stubMatchMedia(matches: boolean) {
  vi.stubGlobal('matchMedia', () => ({
    matches,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}
stubMatchMedia(false);

function setViewportHeight(height: number) {
  Object.defineProperty(window, 'innerHeight', {
    value: height,
    configurable: true,
  });
}

function Parallax(options: UseScrollParallaxOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const offset = useScrollParallax(ref, options);
  return (
    <div ref={ref} data-testid="container">
      {offset}
    </div>
  );
}

// jsdom has no layout, so the scrollTop setter on the prototype is a no-op.
// An own property shadows it.
function scrollTo(container: HTMLElement, top: number) {
  Object.defineProperty(container, 'scrollTop', {
    value: top,
    configurable: true,
  });
  fireEvent.scroll(container);
  flushFrames();
}

// A 1000px viewport puts the travel range at 900px (SCROLL_RANGE_VH) and, at
// maxDistanceVh 0.4, the peak travel at 400px.
function renderParallax(options: UseScrollParallaxOptions) {
  setViewportHeight(1000);
  render(<Parallax {...options} />);
  const container = screen.getByTestId('container');
  flushFrames();
  return container;
}

describe('useScrollParallax', () => {
  it('starts at no offset', () => {
    const container = renderParallax({ maxDistanceVh: 0.4 });
    expect(container.textContent).toBe('0');
  });

  it('moves proportionally through the travel range', () => {
    const container = renderParallax({ maxDistanceVh: 0.4 });
    scrollTo(container, 450);
    expect(container.textContent).toBe('200');
  });

  it('clamps at the peak past the end of the range', () => {
    const container = renderParallax({ maxDistanceVh: 0.4 });
    scrollTo(container, 5000);
    expect(container.textContent).toBe('400');
  });

  it('holds at zero until the trigger threshold', () => {
    const container = renderParallax({
      maxDistanceVh: 0.4,
      triggerThresholdVh: 0.2,
    });
    scrollTo(container, 200);
    expect(container.textContent).toBe('0');
    scrollTo(container, 650);
    expect(container.textContent).toBe('200');
  });

  it('recomputes travel against the live viewport on resize', () => {
    const container = renderParallax({ maxDistanceVh: 0.4 });
    scrollTo(container, 900);
    expect(container.textContent).toBe('400');

    // Halving the viewport halves the travel. Taking pixel distances from the
    // caller meant this kept using the pre-resize viewport, because a resize
    // re-renders nothing in the landing tree.
    setViewportHeight(500);
    fireEvent(window, new Event('resize'));
    flushFrames();
    expect(container.textContent).toBe('200');
  });

  it('keeps updating after a frame that changes nothing', () => {
    const container = renderParallax({ maxDistanceVh: 0.4 });
    scrollTo(container, 900);
    // Already clamped, so this frame computes the same offset and sets no
    // state. It must still release the throttle, or the parallax dies here.
    scrollTo(container, 4000);
    scrollTo(container, 450);
    expect(container.textContent).toBe('200');
  });

  it('reports no offset under reduced motion', () => {
    stubMatchMedia(true);
    const container = renderParallax({ maxDistanceVh: 0.4 });
    scrollTo(container, 450);
    expect(container.textContent).toBe('0');
    stubMatchMedia(false);
  });
});
