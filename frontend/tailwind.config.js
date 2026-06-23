/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic palette aligned with the disaster-relief domain.
        primary: {
          50:  '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd2ff',
          300: '#8eb4ff',
          400: '#5a8bff',
          500: '#3563f0',
          600: '#1f47cc',
          700: '#1a3aa3',
          800: '#1a3380',
          900: '#1a2e66',
        },
        danger:  { 500: '#dc2626', 600: '#b91c1c' },
        warning: { 500: '#f59e0b', 600: '#d97706' },
        success: { 500: '#16a34a', 600: '#15803d' },
      },
    },
  },
  plugins: [],
};
