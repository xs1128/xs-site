'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { MoveUpRight, RotateCcw } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Drag = {
  element: HTMLButtonElement;
  pointer: number;
  index: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  width: number;
  height: number;
  bounds: [number, number, number, number];
  moved: boolean;
};

export function TypePlayground() {
  const [opened, setOpened] = useState(false);
  const [flipped, setFlipped] = useState(0);
  const [animated, setAnimated] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const offsets = useRef<Record<number, [number, number]>>({});
  const skipClick = useRef(false);
  const reducedMotion = useReducedMotion();

  const reset = (animate: boolean) => {
    const active = drag.current;
    drag.current = null;
    if (active) {
      delete active.element.dataset.dragging;
      active.element.style.transform = '';
      if (active.element.hasPointerCapture(active.pointer))
        active.element.releasePointerCapture(active.pointer);
    }
    skipClick.current = false;
    setAnimated(animate && !reducedMotion);
    setOpened(false);
    setFlipped(0);
    offsets.current = {};
    stage.current
      ?.querySelectorAll<HTMLButtonElement>('[data-tile]')
      .forEach((tile) => {
        tile.style.transform = '';
      });
  };

  const start = (event: PointerEvent<HTMLButtonElement>, index: number) => {
    if (drag.current || event.button !== 0) return;
    skipClick.current = false;
    if (index === -1 && opened) return;
    const element = event.currentTarget;
    const board = stage.current!.getBoundingClientRect();
    const tile = element.getBoundingClientRect();
    const [x, y] = offsets.current[index] ?? [0, 0];
    setAnimated(!reducedMotion);
    drag.current = {
      element,
      pointer: event.pointerId,
      index,
      startX: event.clientX,
      startY: event.clientY,
      x,
      y,
      width: element.offsetWidth,
      height: element.offsetHeight,
      bounds: [
        board.left + 12 - tile.left,
        board.right - 12 - tile.right,
        board.top + 12 - tile.top,
        board.bottom - 12 - tile.bottom,
      ],
      moved: false,
    };
    element.dataset.dragging = 'true';
    element.setPointerCapture(event.pointerId);
  };

  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const active = drag.current;
    if (!active || active.pointer !== event.pointerId) return;
    const dx = event.clientX - active.startX;
    const dy = event.clientY - active.startY;
    active.moved ||= Math.hypot(dx, dy) > 6;
    if (!active.moved) return;
    const [left, right, top, bottom] = active.bounds;
    const x =
      active.x + (Math.max(left, Math.min(right, dx)) / active.width) * 100;
    const y =
      active.y + (Math.max(top, Math.min(bottom, dy)) / active.height) * 100;
    active.element.style.transform = `translate(${x}%, ${y}%) rotate(${reducedMotion ? 0 : -4}deg)`;
    offsets.current[active.index] = [x, y];
  };

  const end = (event: PointerEvent<HTMLButtonElement>) => {
    const active = drag.current;
    if (!active || active.pointer !== event.pointerId) return;
    drag.current = null;
    const cancelled = event.type !== 'pointerup';
    skipClick.current = active.moved || cancelled;
    delete active.element.dataset.dragging;
    if (active.element.hasPointerCapture(active.pointer))
      active.element.releasePointerCapture(active.pointer);
    if (active.index === -1) {
      active.element.style.transform = '';
      delete offsets.current[-1];
      if (active.moved && !cancelled) setOpened(true);
    } else {
      const [x, y] = cancelled
        ? [active.x, active.y]
        : (offsets.current[active.index] ?? [0, 0]);
      offsets.current[active.index] = [x, y];
      active.element.style.transform = `translate(${x}%, ${y}%)`;
    }
  };

  const gestures = {
    onPointerMove: move,
    onPointerUp: end,
    onPointerCancel: end,
    onLostPointerCapture: end,
  };

  return (
    <section className="projects-playground" aria-labelledby="playground-title">
      <div className="projects-playground__heading">
        <h2 id="playground-title">Made to play.</h2>
        <button type="button" onClick={(event) => reset(event.detail > 0)}>
          Reset <RotateCcw size={22} aria-hidden="true" />
        </button>
      </div>
      <div
        ref={stage}
        className="projects-playground__stage"
        data-open={opened}
        data-animated={animated}
        role="group"
        aria-label="Letter box playground"
      >
        <div className="projects-playground__halo" aria-hidden="true" />
        <div className="projects-playground__machine">
          <div
            className="projects-playground__tray"
            inert={!opened}
            aria-hidden={!opened}
          >
            {Array.from('MAKEMORE', (letter, index) => (
              <button
                type="button"
                className="projects-playground__tile"
                key={index}
                data-tile={index}
                aria-label={`${flipped & (1 << index) ? 'PLAYNICE'[index] : letter} tile`}
                aria-pressed={Boolean(flipped & (1 << index))}
                aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
                onPointerDown={(event) => start(event, index)}
                {...gestures}
                onClick={(event) => {
                  if (drag.current || (event.detail > 0 && skipClick.current))
                    return;
                  setAnimated(event.detail > 0 && !reducedMotion);
                  setFlipped((value) => value ^ (1 << index));
                }}
                onKeyDown={(event) => {
                  const direction = {
                    ArrowLeft: [-1, 0],
                    ArrowRight: [1, 0],
                    ArrowUp: [0, -1],
                    ArrowDown: [0, 1],
                  }[event.key];
                  if (!direction) return;
                  event.preventDefault();
                  setAnimated(false);
                  const tile = event.currentTarget;
                  const bounds = tile.getBoundingClientRect();
                  const board = stage.current!.getBoundingClientRect();
                  const [x, y] = offsets.current[index] ?? [0, 0];
                  const dx = Math.max(
                    board.left + 12 - bounds.left,
                    Math.min(
                      board.right - 12 - bounds.right,
                      direction[0] * 20,
                    ),
                  );
                  const dy = Math.max(
                    board.top + 12 - bounds.top,
                    Math.min(
                      board.bottom - 12 - bounds.bottom,
                      direction[1] * 20,
                    ),
                  );
                  offsets.current[index] = [
                    x + (dx / tile.offsetWidth) * 100,
                    y + (dy / tile.offsetHeight) * 100,
                  ];
                  tile.style.transform = `translate(${offsets.current[index][0]}%, ${offsets.current[index][1]}%)`;
                }}
              >
                {flipped & (1 << index) ? 'PLAYNICE'[index] : letter}
              </button>
            ))}
          </div>
          <div className="projects-playground__ports" aria-hidden="true">
            <span />
            <span />
            <i />
          </div>
          <button
            type="button"
            className="projects-playground__lid"
            aria-label={opened ? 'Close the letter box' : 'Open the letter box'}
            aria-expanded={opened}
            onPointerDown={(event) => start(event, -1)}
            {...gestures}
            onClick={(event) => {
              if (drag.current || (event.detail > 0 && skipClick.current))
                return;
              if (opened) reset(event.detail > 0);
              else {
                setAnimated(event.detail > 0 && !reducedMotion);
                setOpened(true);
              }
            }}
          >
            <span className="projects-playground__lid-type" aria-hidden="true">
              <span>MAKE</span>
              <span>
                M<em>O</em>RE
              </span>
            </span>
            <span className="projects-playground__handle" aria-hidden="true">
              {opened ? 'Pack it up' : 'Slide to open'}{' '}
              <MoveUpRight size={22} />
            </span>
          </button>
        </div>
        <p className="projects-playground__hint" aria-live="polite">
          {opened
            ? 'Drag to move. Tap to flip.'
            : 'Slide the lid. Play with the type.'}
        </p>
      </div>
    </section>
  );
}
