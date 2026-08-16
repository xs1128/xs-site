'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { colors } from '@/styles/blog/colors';
import Tooltip from '@/components/blog/ui/Tooltip';
import { useIsSmallScreen } from '@/hooks/useIsSmallScreen';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface FullScreenNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { label: 'SITE', href: 'https://www.xsooi.com', delay: '200ms' },
  { label: 'PROJECTS', href: 'https://github.com/xs1128', delay: '400ms' },
] as const;

export default function FullScreenNav({ isOpen, onClose }: FullScreenNavProps) {
  const [isClosing, setIsClosing] = useState(false);
  const isSmallScreen = useIsSmallScreen();

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

  const navRef = useFocusTrap<HTMLDivElement>(
    isOpen && !isClosing,
    handleClose,
  );

  if (!isOpen && !isClosing) return null;

  return (
    <div
      ref={navRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Blog navigation"
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
          ? 'slideOutRight 0.8s var(--ease-out-expo)'
          : 'slideInRight 0.8s var(--ease-out-expo)',
        pointerEvents: isClosing ? 'none' : 'auto',
        willChange: isClosing ? 'transform, opacity' : 'auto',
        contain: 'strict',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden' as const,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          textAlign: 'left',
        }}
      >
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
          <div
            style={{
              borderRight: `1px solid ${colors.border}`,
              color: colors.darkText,
              fontFamily: 'var(--font-mono)',
              fontSize: isSmallScreen ? '32px' : '48px',
              fontWeight: 500,
              padding: '0.5vh 1vw',
            }}
          >
            MENU
          </div>

          <div style={{ width: isSmallScreen ? '1vw' : '1.5vw' }}></div>

          <div
            style={{
              borderLeft: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'stretch',
              paddingLeft: '1vw',
              paddingRight: '1vw',
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
                  fontFamily: 'var(--font-mono)',
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

        {NAV_LINKS.map(({ label, href, delay }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className={`nav-item ${isClosing ? 'nav-item-closing' : 'nav-item-opening'}`}
            data-text={label}
            style={{
              backgroundColor: colors.navButtonPanel,
              border: `1px solid ${colors.border}`,
              color: colors.darkText,
              fontSize: isSmallScreen ? '14.5vw' : '10.5vw',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              textAlign: 'left',
              padding: '0.5vh 3vw 0.5vh 1vw',
              margin: '0',
              lineHeight: 0.85,
              transition: 'transform 0.2s ease',
              animationDelay: isClosing ? '0ms' : delay,
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
              {label}
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
        ))}
      </div>
    </div>
  );
}
