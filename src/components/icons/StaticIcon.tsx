interface StaticIconProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
}

export function StaticIcon({ src, alt, style }: StaticIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: "clamp(36px, 5vw, 48px)",
        height: "auto",
        ...style
      }}
    />
  );
}
