// Shared Types
export interface ResponsiveProps {
  isSmallScreen: boolean;
}

export interface ThemeProps {
  isDarkTheme: boolean;
  setIsDarkTheme: (value: boolean) => void;
}

// Layout Components
export interface ScrollContainerProps {
  children: React.ReactNode;
}

export interface SectionWrapperProps extends ResponsiveProps {
  id: string;
  backgroundColor: string;
  children: React.ReactNode;
}

// Marquee Component
export interface AnnouncementMarqueeProps extends ThemeProps {}

// Navigation Components
export interface FullScreenNavProps {
  isOpen: boolean;
  onClose: () => void;
  isSmallScreen: boolean;
  setIsDarkTheme: (value: boolean) => void;
  onNavigateToSection?: (sectionId: string) => void;
}

export interface HamburgerButtonProps {
  onClick: () => void;
  isSmallScreen: boolean;
}

export interface MobileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (sectionId: string) => void;
  setIsDarkTheme: (value: boolean) => void;
}

export interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'menu' | 'dropdown';
  reverse?: boolean;
  isMenuButton?: boolean;
  isDropdownItem?: boolean;
  style?: React.CSSProperties;
}

// Landing Components
export interface NameDisplayProps {
  onToggle: () => void;
  showInitials: boolean;
  isFading: boolean;
}

export interface LandingButtonsProps {
  onScrollToAbout: () => void;
  onScrollToContact: () => void;
  isSmallScreen: boolean;
}

// About Components
export interface AboutSectionProps extends ResponsiveProps {
  onScrollToContact: () => void;
  onOpenNav: () => void;
  isDarkTheme: boolean;
}

export interface AboutHeaderProps {
  isSmallScreen: boolean;
  setIsDarkTheme: (value: boolean) => void;
}

export interface AboutContentProps {
  onScrollToContact: () => void;
  isSmallScreen: boolean;
}

export interface ExpertiseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Contact Components
export interface ContactSectionProps extends ResponsiveProps {
  onOpenNav: () => void;
}

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
  onClose: () => void;
  isSmallScreen: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  isSmallScreen: boolean;
}

export interface SocialIconLinkProps {
  href: string;
  'aria-label': string;
  children: React.ReactNode;
}

// Animation Types
export interface AnimationState {
  isClosing?: boolean;
  isPopupClosing?: boolean;
  isAnimating?: boolean;
}

// Form Types
export interface FormState {
  formData: ContactFormData;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
}
