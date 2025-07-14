// src/utils/accessibility.js
/**
 * Utility functions for improving accessibility
 */

// Add proper ARIA attributes to elements
export const makeAccessible = (element, role, label) => {
  if (element) {
    if (role) element.setAttribute('role', role);
    if (label) element.setAttribute('aria-label', label);
  }
};

// Ensure keyboard navigation works properly
export const enableKeyboardNavigation = (element, onEnter, onSpace) => {
  if (!element) return;
  
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && onEnter) {
      e.preventDefault();
      onEnter(e);
    } else if (e.key === ' ' && onSpace) {
      e.preventDefault();
      onSpace(e);
    }
  });
  
  // Ensure the element is focusable
  if (element.tabIndex < 0) {
    element.tabIndex = 0;
  }
};

// Announce messages to screen readers
export const announceToScreenReader = (message) => {
  const announcer = document.getElementById('sr-announcer') || createAnnouncer();
  announcer.textContent = message;
};

// Create a screen reader announcer element if it doesn't exist
const createAnnouncer = () => {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
  return announcer;
};

// Add skip to content link for keyboard users
export const addSkipToContentLink = () => {
  if (document.getElementById('skip-to-content')) return;
  
  const skipLink = document.createElement('a');
  skipLink.id = 'skip-to-content';
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to content';
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary';
  
  document.body.insertBefore(skipLink, document.body.firstChild);
};

// Check contrast ratio between foreground and background colors
export const checkContrastRatio = (foreground, background) => {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  // Calculate relative luminance
  const luminance = (r, g, b) => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };
  
  const rgb1 = hexToRgb(foreground);
  const rgb2 = hexToRgb(background);
  
  if (!rgb1 || !rgb2) return null;
  
  const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return {
    ratio: ratio.toFixed(2),
    passes: {
      AA: ratio >= 4.5,
      AAA: ratio >= 7,
      'AA Large': ratio >= 3,
      'AAA Large': ratio >= 4.5
    }
  };
};
