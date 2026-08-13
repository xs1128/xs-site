"use client";

interface HamburgerButtonProps {
  onClick: () => void;
  isPastLanding: boolean;
  isDarkTheme: boolean;
  isNavOpen: boolean;
}

// Vintage yellow on dark sections, charcoal on light
const iconColorFor = (isDarkTheme: boolean) => (isDarkTheme ? "#F2E9D8" : "#2A2F35");

export function HamburgerButton({ onClick, isPastLanding, isDarkTheme, isNavOpen }: HamburgerButtonProps) {
  const isFaded = isNavOpen;
  const iconColor = iconColorFor(isDarkTheme);

  const handleClick = () => {
    if (!isFaded) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`hamburger-button ${isFaded ? "hamburger-button--faded" : ""}`}
      aria-label="Open navigation menu"
      aria-expanded={isNavOpen}
      type="button"
      data-color={iconColor}
      data-color-name={iconColor === '#F2E9D8' ? 'Vintage Yellow' : 'Dark Charcoal'}
      data-section={isDarkTheme ? 'About' : 'Contact'}
      data-is-past-landing={isPastLanding.toString()}
      data-is-dark-theme={isDarkTheme.toString()}
    >
      <span
        className="hamburger-button__icon"
        style={{ color: iconColor }}
      >
        ☰
      </span>
    </button>
  );
}
