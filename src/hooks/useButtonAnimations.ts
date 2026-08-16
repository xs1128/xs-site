import { useEffect } from 'react';

/**
 * Injects CSS for button animations
 * Supports underline expansion and text fill animations
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

      /* Text Fill Animation */
      .btn-text-fill {
        position: relative;
      }
      .btn-text-fill::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        right: auto;
        top: 0;
        bottom: 0;
        color: #E5532C;
        background-color: inherit;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        letter-spacing: inherit;
        text-align: inherit;
        padding: inherit;
        margin: inherit;
        clip-path: inset(0 100% 0 0);
        pointer-events: none;
        transition: clip-path 0.7s var(--ease-in-out-soft);
        z-index: 1;
      }
      .btn-text-fill > span {
        position: relative;
        z-index: 0;
      }
      @media (hover: hover) {
        .btn-text-fill:hover::before {
          clip-path: inset(0 0 0 0);
        }
      }

      /* Combined: Underline + Text Fill */
      .btn-both {
        position: relative;
      }
      .btn-both::before {
        content: attr(data-text);
        position: absolute;
        left: 0;
        right: auto;
        top: 0;
        bottom: 0;
        color: #E5532C;
        background-color: inherit;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        line-height: inherit;
        letter-spacing: inherit;
        text-align: inherit;
        padding: inherit;
        margin: inherit;
        clip-path: inset(0 100% 0 0);
        pointer-events: none;
        transition: clip-path 0.7s var(--ease-in-out-soft);
        z-index: 1;
      }
      .btn-both > span {
        position: relative;
        z-index: 0;
      }
      @media (hover: hover) {
        .btn-both:hover::before {
          clip-path: inset(0 0 0 0);
        }
        .btn-both:hover .btn-underline-line {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}
