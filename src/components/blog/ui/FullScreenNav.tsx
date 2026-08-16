'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { colors } from '@/styles/blog/colors';
import Tooltip from '@/components/blog/ui/Tooltip';

// Custom hook for navigation animations
function useNavAnimations() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes blogSlideInRight {
        0% {
          opacity: 0;
          transform: translateX(100%);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes blogSlideOutRight {
        0% {
          opacity: 1;
          transform: translateX(0);
        }
        100% {
          opacity: 0;
          transform: translateX(100%);
        }
      }
      @keyframes blogFadeInSlide {
        0% {
          opacity: 0;
          transform: translateX(50px);
        }
        100% {
          opacity: 1;
          transform: translateX(0);
        }
      }
      @keyframes blogFadeOutSlide {
        0% {
          opacity: 1;
          transform: translateX(0);
        }
        100% {
          opacity: 0;
          transform: translateX(50px);
        }
      }
      .blog-nav-item-opening {
        animation: blogFadeInSlide 0.9s cubic-bezier(0.16, 1, 0.3, 1) backwards;
      }
      .blog-nav-item-closing {
        animation: blogFadeOutSlide 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      /* Text fill animation for navigation buttons */
      .nav-item {
        position: relative;
      }
      .nav-item::before {
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
        padding-right: 0;
        margin: inherit;
        clip-path: inset(0 100% 0 0);
        pointer-events: none;
        transition: clip-path 0.7s cubic-bezier(0.6, 0, 0.4, 1);
        z-index: 1;
        width: fit-content;
      }
      .nav-item > span {
        position: relative;
        z-index: 0;
      }
      .nav-item svg {
        transition: stroke 0.3s cubic-bezier(0.6, 0, 0.4, 1);
        transition-delay: 0.7s;
        position: relative;
        z-index: 2;
      }
      @media (hover: hover) {
        .nav-item:hover {
          transform: translateX(20px);
        }
        .nav-item:hover::before {
          clip-path: inset(0 0 0 0);
        }
        .nav-item:hover svg {
          stroke: #E5532C;
        }
        .close-button:hover {
          color: #E5532C !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
}

interface FullScreenNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FullScreenNav({ isOpen, onClose }: FullScreenNavProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useNavAnimations();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 480);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Disable scrolling when nav is open
  useEffect(() => {
    if (isOpen || isClosing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 800);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.navBackground,
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: isClosing
          ? 'blogSlideOutRight 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
          : 'blogSlideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isClosing ? 'none' : 'auto',
        willChange: isClosing ? 'transform, opacity' : 'auto',
        contain: 'strict',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden' as const,
      }}
    >
      {/* Navigation items */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          textAlign: 'left',
        }}
      >
        {/* MENU label with close button - outer container with outline */}
        <div
          style={{
            border: `1px solid ${colors.border}`,
            backgroundColor: colors.navButtonPanel,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* MENU word with outline */}
          <div
            style={{
              borderRight: `1px solid ${colors.border}`,
              color: colors.darkText,
              fontFamily: 'Roboto Mono, monospace',
              fontSize: isSmallScreen ? '32px' : '48px',
              fontWeight: 500,
              padding: isSmallScreen ? '0.5vh 1vw' : '0.5vh 1vw',
            }}
          >
            MENU
          </div>

          {/* Spacer for gap */}
          <div style={{ width: isSmallScreen ? '1vw' : '1.5vw' }}></div>

          {/* Close button with outline */}
          <div
            style={{
              borderLeft: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'stretch',
              paddingLeft: isSmallScreen ? '1vw' : '1vw',
              paddingRight: isSmallScreen ? '1vw' : '1vw',
              paddingTop: '0',
              paddingBottom: '0',
              marginTop: '0',
              marginBottom: '0',
            }}
          >
            <Tooltip label="Close menu" placement="bottom">
              <button
                onClick={handleClose}
                className="close-button"
                aria-label="Close menu"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: colors.darkText,
                  fontSize: isSmallScreen ? '48px' : '64px',
                  cursor: 'pointer',
                  padding: '0',
                  lineHeight: 0.85,
                  fontFamily: 'Roboto Mono, monospace',
                  fontWeight: 500,
                  display: 'flex',
                }}
              >
                <X
                  viewBox="5 5 14 14"
                  style={{ width: '0.62em', height: '0.62em' }}
                  strokeWidth={2}
                  strokeLinecap="butt"
                />
              </button>
            </Tooltip>
          </div>
        </div>

        <a
          href="https://www.xsooi.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className={`blog-nav-item ${isClosing ? 'blog-nav-item-closing' : 'blog-nav-item-opening'}`}
          data-text="SITE"
          style={{
            backgroundColor: colors.navButtonPanel,
            border: `1px solid ${colors.border}`,
            color: colors.darkText,
            fontSize: isSmallScreen ? '14.5vw' : '10.5vw',
            fontWeight: 700,
            fontFamily: 'Roboto Mono, monospace',
            cursor: 'pointer',
            textAlign: 'left',
            padding: '0.5vh 3vw 0.5vh 1vw',
            margin: '0',
            lineHeight: 0.85,
            transition: 'transform 0.2s ease',
            animationDelay: isClosing ? '0ms' : '200ms',
            width: '100%',
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: isSmallScreen ? '2vw' : '1.5vw',
            }}
          >
            SITE
            <ArrowUpRight
              viewBox="5.5 5.5 13 13"
              style={{
                width: '0.8cap',
                height: '0.8cap',
                transform: 'translateY(-0.2cap)',
                flexShrink: 0,
              }}
              strokeWidth={3}
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
          </span>
        </a>

        <a
          href="https://github.com/xs1128"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className={`blog-nav-item ${isClosing ? 'blog-nav-item-closing' : 'blog-nav-item-opening'}`}
          data-text="PROJECTS"
          style={{
            backgroundColor: colors.navButtonPanel,
            border: `1px solid ${colors.border}`,
            color: colors.darkText,
            fontSize: isSmallScreen ? '14.5vw' : '10.5vw',
            fontWeight: 700,
            fontFamily: 'Roboto Mono, monospace',
            cursor: 'pointer',
            textAlign: 'left',
            padding: '0.5vh 3vw 0.5vh 1vw',
            margin: '0',
            lineHeight: 0.85,
            transition: 'transform 0.2s ease',
            animationDelay: isClosing ? '0ms' : '400ms',
            width: '100%',
            display: 'block',
            textDecoration: 'none',
          }}
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: isSmallScreen ? '2vw' : '1.5vw',
            }}
          >
            PROJECTS
            <ArrowUpRight
              viewBox="5.5 5.5 13 13"
              style={{
                width: '0.8cap',
                height: '0.8cap',
                transform: 'translateY(-0.2cap)',
                flexShrink: 0,
              }}
              strokeWidth={3}
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
          </span>
        </a>
      </div>
    </div>
  );
}
