import React, { useState } from 'react';
import { ContactHeader } from './ContactHeader';
import { SpinningCircularText } from './SpinningCircularText';
import { ContactPopup } from './ContactPopup';
import { SocialIconLink } from './SocialIconLink';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  GitHubIcon,
  InstagramIcon,
  FacebookIcon,
  LinkedInIcon,
} from '@/components/icons/SocialIcons';

/**
 * Contact section with spinning circular text and expandable form
 * Opens contact popup on circle click with complex animations
 * Small-screen layout is CSS-only — see the 640px blocks in contact.css
 */
export function ContactSection() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCircleClick = () => {
    if (isAnimating) return;

    if (isPopupOpen) {
      setIsAnimating(true);
      setIsPopupOpen(false);
      setIsPopupClosing(true);

      setTimeout(() => {
        setIsPopupClosing(false);
        setIsAnimating(false);
      }, 1200);
    } else {
      setIsAnimating(true);
      setIsPopupOpen(true);

      setTimeout(() => {
        setIsAnimating(false);
      }, 1200);
    }
  };

  const handlePopupClose = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsPopupOpen(false);
    setIsPopupClosing(true);

    setTimeout(() => {
      setIsPopupClosing(false);
      setIsAnimating(false);
    }, 1200);
  };

  return (
    <section id="contact" className="contact-section">
      <ContactHeader />

      <div className="contact-section__container">
        {/* Main content area with spinning text and form */}
        <div className="contact-section__content">
          <div
            className={`contact-section__circle-wrapper ${isPopupOpen ? 'contact-section__circle-wrapper--expanded' : ''}`}
          >
            <div
              className={`contact-section__circle ${isPopupOpen ? 'contact-section__circle--expanded' : ''}`}
              style={{
                pointerEvents: isAnimating ? 'none' : 'auto',
              }}
            >
              <SpinningCircularText
                text="Xinsheng Ooi • Xinsheng Ooi • Xinsheng Ooi • "
                onClick={handleCircleClick}
                isExpanded={isPopupOpen}
              />
            </div>
          </div>

          {/* Divider - hidden under 640px by CSS */}
          {(isPopupOpen || isPopupClosing) && (
            <div
              className={`contact-section__divider ${isPopupClosing ? 'contact-section__divider--fading' : 'contact-section__divider--visible'}`}
            />
          )}

          <div
            className={`contact-section__form-wrapper ${isPopupOpen ? 'contact-section__form-wrapper--open' : ''} ${isPopupClosing ? 'contact-section__form-wrapper--closing' : ''}`}
            style={{
              pointerEvents: isPopupOpen && !isPopupClosing ? 'auto' : 'none',
            }}
          >
            <ContactPopup
              isOpen={isPopupOpen}
              isClosing={isPopupClosing}
              onClose={handlePopupClose}
            />
          </div>
        </div>

        {/* Email and social icons at the bottom */}
        <div className="contact-section__footer">
          <div className="contact-section__email">
            email:{' '}
            <Tooltip label="Reach Out">
              <a
                href="mailto:hi@xsooi.com"
                className="contact-section__email-link"
              >
                hi@xsooi.com
              </a>
            </Tooltip>
          </div>

          <div className="contact-section__social-links">
            <SocialIconLink
              href="https://github.com/xs1128"
              aria-label="GitHub"
            >
              <GitHubIcon />
            </SocialIconLink>
            <SocialIconLink
              href="https://www.instagram.com/xs_ooi1128"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </SocialIconLink>
            <SocialIconLink
              href="https://www.facebook.com/ooi.xinsheng/"
              aria-label="Facebook"
            >
              <FacebookIcon />
            </SocialIconLink>
            <SocialIconLink
              href="https://www.linkedin.com/in/xinsheng-ooi-6738083b4"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </SocialIconLink>
          </div>
        </div>
      </div>
    </section>
  );
}
