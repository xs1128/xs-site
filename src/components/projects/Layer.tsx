import type { CSSProperties, ReactNode } from 'react';
import styles from './projects.module.css';

// x, y, width, height in drawing units.
export type Box = readonly [number, number, number, number];

// Moving parts are drawn in a 1200 x 800 space.
export const PARTS: Box = [0, 0, 1200, 800];

export interface LayerProps {
  box: Box;
  // The box it is placed in: the parts' space, or a parent layer.
  within?: Box;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  over?: ReactNode;
  'data-part'?: string;
  'data-app'?: string;
}

// One moving part in its own <svg>. Chrome repaints a whole SVG whenever
// anything inside it moves, but slides a box on the compositor. The box is
// the part's fill-box, so rotations pivot where they did inside the SVG.
export function Layer({
  box,
  within: [px, py, pw, ph] = PARTS,
  children,
  className,
  style,
  over,
  ...data
}: LayerProps) {
  const [x, y, w, h] = box;
  return (
    <div
      {...data}
      className={className ? `${styles.layer} ${className}` : styles.layer}
      style={{
        left: `${((x - px) / pw) * 100}%`,
        top: `${((y - py) / ph) * 100}%`,
        width: `${(w / pw) * 100}%`,
        height: `${(h / ph) * 100}%`,
        ...style,
      }}
    >
      <svg viewBox={box.join(' ')} fill="none">
        {children}
      </svg>
      {over}
    </div>
  );
}

// A drawing: still art behind and in front, moving parts between.
export function Stage({
  view,
  className,
  label,
  back,
  front,
  children,
}: {
  view: Box;
  className: string;
  label: string;
  back: ReactNode;
  front: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.stage} ${className}`}
      style={{ '--ratio': view[2] / view[3] } as CSSProperties}
      role="img"
      aria-label={label}
    >
      <svg viewBox={view.join(' ')} fill="none">
        {back}
      </svg>
      {children}
      <svg viewBox={view.join(' ')} fill="none">
        {front}
      </svg>
    </div>
  );
}

// Places the parts' space in the stage, as a translate() scale() group would.
export function Device({
  view,
  offset: [x, y] = [0, 0],
  scale = 1,
  children,
}: {
  view: Box;
  offset?: readonly [number, number];
  scale?: number;
  children: ReactNode;
}) {
  return (
    <div
      className={styles.device}
      style={{
        left: `${((x - view[0]) / view[2]) * 100}%`,
        top: `${((y - view[1]) / view[3]) * 100}%`,
        width: `${((PARTS[2] * scale) / view[2]) * 100}%`,
        height: `${((PARTS[3] * scale) / view[3]) * 100}%`,
      }}
    >
      {children}
    </div>
  );
}
