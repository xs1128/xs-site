"use client";

import { useState, useEffect } from "react";

export function BlurOverlay() {
  const [isBlurActive, setIsBlurActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = () => setIsBlurActive(true);
    const handleMouseLeave = () => setIsBlurActive(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={`blur-overlay ${isBlurActive ? "blur-overlay--active" : ""}`}
    />
  );
}
