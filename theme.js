/**
 * Theme configuration for the Voice Journal App
 * Inspired by Superhuman.com but with a lighter color palette
 */

const theme = {
  colors: {
    // Primary colors
    primary: '#7B68EE', // Medium slate blue (purple)
    primaryLight: '#9F8FFF',
    primaryDark: '#5A4FCF',
    
    // Secondary colors
    secondary: '#6C7A89', // Slate gray
    secondaryLight: '#8D9CAA',
    secondaryDark: '#4A5568',
    
    // Background colors
    background: '#F8F9FC', // Very light gray/blue
    card: '#FFFFFF',
    cardDark: '#F0F2F7',
    
    // Text colors
    text: '#2D3748', // Dark slate gray
    textSecondary: '#4A5568',
    textLight: '#718096',
    
    // Accent colors
    accent1: '#38B2AC', // Teal
    accent2: '#ED8936', // Orange
    accent3: '#9F7AEA', // Lavender
    
    // Feedback colors
    success: '#48BB78', // Green
    warning: '#F6AD55', // Light orange
    error: '#F56565', // Red
    info: '#4299E1', // Blue
    
    // UI elements
    border: '#E2E8F0',
    divider: '#EDF2F7',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System-Medium',
      bold: 'System-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  },
  
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
};

export default theme;
