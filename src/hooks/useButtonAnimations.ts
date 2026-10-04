import { useEffect } from 'react';

/**
 * Injects CSS for button animations
 * Supports underline expansion in either direction
 */
export function useButtonAnimations() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Underline Animation */
      @media (hover: hover) {
        .btn-underline:hover .btn-underline-line {
          width: 100%;
        }
      }
      .btn-underline-line {
        position: absolute;
        bottom: 4px;
        left: 0;
        height: 2px;
        background-color: #E5532C;
        width: 0%;
        transition: width 0.3s ease;
      }

      /* Reverse Underline (right to left) */
      .btn-underline-reverse .btn-underline-line {
        left: auto;
        right: 0;
      }

    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}
