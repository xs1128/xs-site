import React, { useState, useEffect } from 'react';
import type { FullScreenNavProps } from '@/types';
import { scrollToAbout, scrollToContact } from '@/lib/utils';

/**
 * Full-screen navigation overlay with slide animations
 * Features text fill effect on hover and staggered fade-in animations
 */
export function FullScreenNav({ isOpen, onClose, isSmallScreen, setIsDarkTheme }: FullScreenNavProps) {
  const [isClosing, setIsClosing] = useState(false);

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

  const handleAboutClick = () => {
    handleClose();
    setTimeout(() => scrollToAbout(setIsDarkTheme), 100);
  };

  const handleContactClick = () => {
    handleClose();
    setTimeout(() => scrollToContact(setIsDarkTheme), 100);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`fullscreen-nav ${isClosing ? 'fullscreen-nav--closing' : ''}`}>
      {/* Navigation items */}
      <div className="fullscreen-nav__items">
        {/* MENU label with close button - outer container with outline */}
        <div className="fullscreen-nav__header">
          {/* MENU word with outline */}
          <div className="fullscreen-nav__menu-label">
            MENU
          </div>

          {/* Spacer for gap */}
          <div className="fullscreen-nav__spacer"></div>

          {/* Close button with outline */}
          <div className="fullscreen-nav__close-wrapper">
            <button onClick={handleClose} className="fullscreen-nav__close-button" aria-label="Close navigation">
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

        <button
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
        </button>

        <a
          href="https://blog.xsooi.com"
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
