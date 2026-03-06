import React, { useState } from 'react';
import type { ContactPopupProps, ContactFormData, FormState } from '@/types';

/**
 * Contact form popup with validation and submission
 * Handles form state, API submission, and status messages
 */
export function ContactPopup({
  isOpen,
  isClosing,
  onClose,
  isSmallScreen,
}: ContactPopupProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [formState, setFormState] = useState<FormState>({
    formData: { name: "", email: "", message: "" },
    isSubmitting: false,
    submitStatus: 'idle',
    errorMessage: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFormState(prev => ({ ...prev, isSubmitting: true, submitStatus: 'idle', errorMessage: '' }));

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        throw new Error(errorMsg);
      }

      setFormState({
        formData: { name: "", email: "", message: "" },
        isSubmitting: false,
        submitStatus: 'success',
        errorMessage: '',
      });
      setFormData({ name: "", email: "", message: "" });

      // Close form after short delay to show success
      setTimeout(() => {
        onClose();
        setFormState(prev => ({ ...prev, submitStatus: 'idle' }));
      }, 1500);
    } catch (error) {
      console.error('Submit error:', error);
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitStatus: 'error',
        errorMessage: error instanceof Error ? error.message : 'Failed to send message',
      }));
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className="contact-popup">
      {/* Header with close button and title */}
      <div className="contact-popup__header">
        <h2 className="contact-popup__title">
          Get in Touch
        </h2>

        {/* Close button */}
        <button
          onClick={onClose}
          className="contact-popup__close-button"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="contact-popup__form">
        <div className="contact-popup__field">
          <label className="contact-popup__label">
            Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="contact-popup__input"
          />
        </div>

        <div className="contact-popup__field">
          <label className="contact-popup__label">
            Email
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="contact-popup__input"
          />
        </div>

        <div className="contact-popup__field">
          <label className="contact-popup__label">
            Message
          </label>
          <textarea
            required
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            rows={4}
            className="contact-popup__textarea"
          />
        </div>

        {/* Status messages */}
        {formState.submitStatus === 'success' && (
          <div className="contact-popup__status contact-popup__status--success">
            Message sent successfully!
          </div>
        )}

        {formState.submitStatus === 'error' && (
          <div className="contact-popup__status contact-popup__status--error">
            {formState.errorMessage || 'Failed to send message. Please try again.'}
          </div>
        )}

        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="contact-popup__submit-button"
        >
          {formState.isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
