module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6b46c1', // Purple as primary color
        secondary: '#9f7aea',
        accent1: '#805ad5',
        accent2: '#d53f8c',
        background: '#f7fafc', // Light background (lighter than Superhuman)
        'background-dark': '#edf2f7',
        'background-paper': '#ffffff',
        'text-primary': '#2d3748',
        'text-secondary': '#4a5568',
        success: '#48bb78',
        error: '#e53e3e',
        'error-light': '#fed7d7',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
