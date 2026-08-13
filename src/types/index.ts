// Shared Types
export interface ResponsiveProps {
  isSmallScreen: boolean;
}

// Layout Components
export interface ScrollContainerProps {
  children: React.ReactNode;
}

// Navigation Components
export interface FullScreenNavProps {
  isOpen: boolean;
  onClose: () => void;
  isSmallScreen: boolean;
}

export interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'menu' | 'dropdown';
  reverse?: boolean;
  isMenuButton?: boolean;
  isDropdownItem?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

// Landing Components
export interface NameDisplayProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export interface LandingButtonsProps {
  onScrollToAbout: () => void;
  onScrollToContact: () => void;
  isSmallScreen: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

// About Components
export type AboutSectionProps = ResponsiveProps;

export interface AboutHeaderProps {
  isSmallScreen: boolean;
}

export interface AboutContentProps {
  onScrollToContact: () => void;
  isSmallScreen: boolean;
  isVisible: boolean;
}

export interface ExpertiseCardProps extends ResponsiveProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}

// Contact Components
export type ContactSectionProps = ResponsiveProps;

export interface ContactHeaderProps {
  isSmallScreen: boolean;
}

export interface SpinningCircularTextProps {
  text: string;
  diameter: number;
  onClick: () => void;
  isExpanded: boolean;
}

export interface ContactPopupProps {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;
  isSmallScreen: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface SocialIconLinkProps {
  href: string;
  'aria-label': string;
  children: React.ReactNode;
}

// Form Types
export interface FormState {
  formData: ContactFormData;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
}

export interface NameSceneProps {
  showInitials: boolean;
}

// Icon Components
export interface StaticIconProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

// Intersection Animation Hook
export interface AnimationTriggerOptions {
  threshold?: number;
  rootMargin?: string;
}

export interface IntersectionAnimationState {
  isVisible: boolean;
}
