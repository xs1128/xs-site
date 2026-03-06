import { useState, useEffect } from 'react';

/**
 * Custom hook for calculating marquee items based on screen width
 * @param text - The text to display in the marquee
 * @param gap - The gap between items in pixels (default: 120)
 * @returns Array of indices for marquee items
 */
export function useMarquee(text: string, gap: number = 120) {
  const [items, setItems] = useState<number[]>([]);

  useEffect(() => {
    const tempSpan = document.createElement("span");
    tempSpan.style.font = "14px Hubot Sans, sans-serif";
    tempSpan.style.whiteSpace = "nowrap";
    tempSpan.textContent = text;
    document.body.appendChild(tempSpan);
    const textWidth = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);

    const itemWidth = textWidth + gap;
    const screenWidth = window.innerWidth;
    const itemsNeeded = Math.ceil(screenWidth / itemWidth) * 2 + 4;

    setItems(Array.from({ length: itemsNeeded }, (_, i) => i));
  }, [text, gap]);

  return items;
}
