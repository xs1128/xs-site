import React, { useState, useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { scrollToAbout, scrollToContact } from '@/lib/utils';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type NavItem =
  | { kind: 'action'; label: string; onSelect: () => void }
  | { kind: 'link'; label: string; href: string; newTab?: boolean };

export interface FullScreenNavProps {
  isOpen: boolean;
  onClose: () => void;
}

// viewBox cropped to ink bounds so it sits flush with the letter tops.
const ExternalArrow = () => (
  <ArrowUpRight
    className="nav-item__arrow"
    viewBox="5.5 5.5 13 13"
    strokeWidth={3}
    strokeLinecap="butt"
    strokeLinejoin="miter"
  />
);

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

  const resolved: NavItem[] = [
    { kind: 'action', label: 'ABOUT', onSelect: handleAboutClick },
    { kind: 'action', label: 'CONTACT', onSelect: handleContactClick },
    {
      kind: 'link',
      label: 'PROJECTS',
      href: 'https://github.com/xs1128',
      newTab: true,
    },
    { kind: 'link', label: 'BLOG', href: '/blog' },
  ];

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
              <X
                viewBox="5 5 14 14"
                style={{ width: '0.62em', height: '0.62em' }}
                strokeWidth={2}
                strokeLinecap="butt"
              />
            </button>
          </div>
        </div>

        {resolved.map((item, i) => {
          const cls = `nav-item ${isClosing ? 'nav-item-closing' : 'nav-item-opening'}`;
          const delay = {
            animationDelay: isClosing ? '0ms' : `${(i + 1) * 100}ms`,
          };

          if (item.kind === 'action') {
            return (
              <button
                key={item.label}
                onClick={item.onSelect}
                className={cls}
                data-text={item.label}
                style={delay}
              >
                {item.label}
              </button>
            );
          }

          const external = item.newTab ?? /^https?:/.test(item.href);
          return (
            <a
              key={item.label}
              href={item.href}
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              onClick={handleClose}
              className={cls}
              data-text={item.label}
              style={delay}
            >
              <span className="nav-item__content">
                {item.label}
                {external && <ExternalArrow />}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
