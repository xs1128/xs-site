import Image from 'next/image';
import { StaticIconProps } from '@/types';

export function StaticIcon({ src, alt, style, width = 48, height = 48 }: StaticIconProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={{
        width: "clamp(36px, 5vw, 48px)",
        height: "auto",
        ...style
      }}
      className="static-icon"
      priority={false}
    />
  );
}
