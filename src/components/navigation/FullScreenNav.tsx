import React, { useState, useEffect } from 'react';
import { scrollToAbout, scrollToContact } from '@/lib/utils';
import { useFocusTrap } from '@/hooks/useFocusTrap';

export interface FullScreenNavProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Full-screen navigation overlay with slide animations
 * Features text fill effect on hover and staggered fade-in animations
 */
export function FullScreenNav({ isOpen, onClose }: FullScreenNavProps) {
  const [isClosing, setIsClosing] = useState(false);

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

  const handleAboutClick = () => {
    handleClose();
    setTimeout(scrollToAbout, 100);
  };

  const handleContactClick = () => {
    handleClose();
    setTimeout(scrollToContact, 100);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div
      ref={navRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className={`fullscreen-nav ${isClosing ? 'fullscreen-nav--closing' : ''}`}
    >
      <div className="fullscreen-nav__items">
        <div className="fullscreen-nav__header">
          <div className="fullscreen-nav__menu-label">MENU</div>

          <div className="fullscreen-nav__spacer"></div>

          <div className="fullscreen-nav__close-wrapper">
            <button
              onClick={handleClose}
              className="fullscreen-nav__close-button"
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>
        </div>

        <button
          onClick={handleAboutClick}
          className={`nav-item ${isClosing ? 'nav-item-closing' : 'nav-item-opening'}`}
          data-text="ABOUT"
          style={{ animationDelay: isClosing ? '0ms' : '100ms' }}
        >
          ABOUT
        </button>

        <button
          onClick={handleContactClick}
          className={`nav-item ${isClosing ? 'nav-item-closing' : 'nav-item-opening'}`}
          data-text="CONTACT"
          style={{ animationDelay: isClosing ? '0ms' : '200ms' }}
        >
          CONTACT
        </button>

        <a
          href="https://github.com/xs1128"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className={`nav-item ${isClosing ? 'nav-item-closing' : 'nav-item-opening'}`}
          data-text="PROJECTS"
          style={{ animationDelay: isClosing ? '0ms' : '400ms' }}
        >
          <span className="nav-item__content">
            PROJECTS
            <svg
              className="nav-item__arrow"
              width="0.75em"
              height="0.75em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <polyline points="7,17 15,9" />
              <polyline points="17,17 17,7 7,7" />
            </svg>
          </span>
        </a>

        <a
          href="https://xsooi.com/blog"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClose}
          className={`nav-item ${isClosing ? 'nav-item-closing' : 'nav-item-opening'}`}
          data-text="BLOG"
          style={{ animationDelay: isClosing ? '0ms' : '500ms' }}
        >
          <span className="nav-item__content">
            BLOG
            <svg
              className="nav-item__arrow"
              width="0.75em"
              height="0.75em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="square"
              strokeLinejoin="miter"
            >
              <polyline points="7,17 15,9" />
              <polyline points="17,17 17,7 7,7" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
