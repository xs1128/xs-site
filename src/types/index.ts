// Shared types. Component props live in the component — see CLAUDE.md.

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface FormState {
  formData: ContactFormData;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
}

export interface AnimationTriggerOptions {
  threshold?: number;
  rootMargin?: string;
}

export interface IntersectionAnimationState {
  isVisible: boolean;
}
