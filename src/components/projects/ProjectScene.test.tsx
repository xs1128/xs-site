import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProjectScene } from './ProjectScene';

let frames: FrameRequestCallback[];
let reducedMotion: boolean;
let preferenceChanged: () => void;
let nativeTimelines: boolean;

beforeEach(() => {
  frames = [];
  reducedMotion = false;
  nativeTimelines = false;
  vi.stubGlobal('CSS', { supports: () => nativeTimelines });
  preferenceChanged = () => {};
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    frames.push(callback);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reducedMotion;
    },
    addEventListener: (_event: string, callback: () => void) => {
      preferenceChanged = callback;
    },
    removeEventListener: vi.fn(),
  }));
});

function flushFrames() {
  const pending = frames;
  frames = [];
  act(() => pending.forEach((callback) => callback(0)));
}

function renderScene(kind: 'intro' | 'access' = 'intro') {
  const result = render(
    <ProjectScene
      labelledBy="homelab"
      kind={kind}
      header={<h2 id="homelab">Homelab</h2>}
      artwork={
        <svg data-testid="illustration">
          <g data-part="lid" />
          <g data-part="power" />
        </svg>
      }
    />,
  );
  const scene = screen.getByRole('region', { name: 'Homelab' });
  const panel = scene.firstElementChild as HTMLElement;
  panel.style.position = 'sticky';
  const artwork = screen.getByTestId('illustration').parentElement!;
  let top = 0;

  Object.defineProperty(scene, 'offsetHeight', { value: 1400 });
  Object.defineProperty(panel, 'offsetHeight', { value: 1000 });
  vi.spyOn(scene, 'getBoundingClientRect').mockImplementation(
    () => ({ top }) as DOMRect,
  );
  flushFrames();

  return {
    ...result,
    artwork,
    scrollTo: (position: number) => {
      top = -position;
      fireEvent.scroll(window);
      flushFrames();
    },
  };
}

describe('ProjectScene', () => {
  it('curves the fallback layers in both directions and reassembles them', () => {
    const { artwork, scrollTo } = renderScene('access');
    const lid = artwork.querySelector<SVGElement>('[data-part="lid"]')!;
    const power = artwork.querySelector<SVGElement>('[data-part="power"]')!;
    const closed = lid.style.transform;
    scrollTo(200);
    expect(lid.style.transform).toContain('rotate(-');
    expect(power.style.transform).toMatch(/rotate\([1-5]deg\)/);
    const opened = lid.style.transform;
    scrollTo(90);
    const midway = lid.style.transform;
    expect(midway).not.toBe(closed);
    expect(midway).not.toBe(opened);
    scrollTo(320);
    const opening = midway.match(/-?[\d.]+/g)!.map(Number);
    lid.style.transform.match(/-?[\d.]+/g)!.forEach((value, index) => {
      expect(Number(value)).toBeCloseTo(opening[index], 8);
    });
    scrollTo(400);
    expect(lid.style.transform).toBe(closed);
    reducedMotion = true;
    act(() => preferenceChanged());
    flushFrames();
    expect(lid.style.transform).toBe('');
    expect(power.style.transform).toBe('');
  });

  it('leaves native scroll timelines in control without scheduling duplicate work', () => {
    nativeTimelines = true;
    const { artwork } = renderScene();
    fireEvent.scroll(window);
    expect(frames).toHaveLength(0);
    expect(artwork.style.transform).toBe('');
  });

  it('keeps the illustration visible before scrolling', () => {
    const { artwork } = renderScene();
    expect(artwork.style.transform).toBe(
      'translate(0px, 0px) scale(1) rotate(0deg)',
    );
    expect(screen.getByRole('heading', { name: 'Homelab' })).toBeDefined();
  });

  it('moves proportionally and clamps at both ends of the scene', () => {
    const { artwork, scrollTo } = renderScene();
    scrollTo(200);
    expect(artwork.style.transform).toBe(
      'translate(-40px, -16px) scale(1.7) rotate(-4.5deg)',
    );
    scrollTo(4000);
    expect(artwork.style.transform).toBe(
      'translate(-80px, -32px) scale(2.4) rotate(-9deg)',
    );
    scrollTo(-200);
    expect(artwork.style.transform).toBe(
      'translate(0px, 0px) scale(1) rotate(0deg)',
    );
  });

  it('coalesces scroll events, including when a frame ID is zero', () => {
    renderScene();
    fireEvent.scroll(window);
    fireEvent.scroll(window);
    expect(frames).toHaveLength(1);
    flushFrames();
    fireEvent.scroll(window);
    expect(frames).toHaveLength(1);
  });

  it('resets motion when the preference changes at runtime', () => {
    const { artwork, scrollTo } = renderScene();
    scrollTo(200);
    reducedMotion = true;
    act(() => preferenceChanged());
    flushFrames();
    expect(artwork.style.transform).toBe('');
    scrollTo(400);
    expect(artwork.style.transform).toBe('');
    reducedMotion = false;
    act(() => preferenceChanged());
    flushFrames();
    expect(artwork.style.transform).toBe(
      'translate(-80px, -32px) scale(2.4) rotate(-9deg)',
    );
  });

  it('cancels a pending frame on unmount', () => {
    const { unmount } = renderScene();
    fireEvent.scroll(window);
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(0);
  });
});
