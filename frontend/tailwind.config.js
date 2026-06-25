/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Resilience Command — Material Design 3 inspired palette
      colors: {
        // Primary — Deep Navy
        primary: '#091426',
        'primary-container': '#1e293b',
        'on-primary': '#ffffff',
        'on-primary-container': '#8590a6',
        'primary-fixed': '#d8e3fb',
        'primary-fixed-dim': '#bcc7de',
        'on-primary-fixed': '#111c2d',
        'on-primary-fixed-variant': '#3c475a',
        'inverse-primary': '#bcc7de',

        // Secondary — Emergency Red
        secondary: '#bb0112',
        'secondary-container': '#e02928',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#fffbff',
        'secondary-fixed': '#ffdad6',
        'secondary-fixed-dim': '#ffb4ab',
        'on-secondary-fixed': '#410002',
        'on-secondary-fixed-variant': '#93000b',

        // Tertiary — Recovery Green
        tertiary: '#001907',
        'tertiary-container': '#003013',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#559f67',
        'tertiary-fixed': '#a6f4b5',
        'tertiary-fixed-dim': '#8bd79b',
        'on-tertiary-fixed': '#00210b',
        'on-tertiary-fixed-variant': '#005226',

        // Error
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        // Surface family
        background: '#f8f9ff',
        surface: '#f8f9ff',
        'surface-bright': '#f8f9ff',
        'surface-dim': '#cbdbf5',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'surface-variant': '#d3e4fe',
        'surface-tint': '#545f73',
        'inverse-surface': '#213145',
        'inverse-on-surface': '#eaf1ff',

        // On-* foreground colors
        'on-background': '#0b1c30',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#45474c',

        // Outlines
        outline: '#75777d',
        'outline-variant': '#c5c6cd',
      },

      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },

      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        gutter: '16px',
        margin: '24px',
      },

      fontFamily: {
        'body-md': ['Inter', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'headline-md': ['Inter', 'sans-serif'],
        'headline-lg': ['Inter', 'sans-serif'],
        'display-lg': ['Inter', 'sans-serif'],
        'label-md': ['"JetBrains Mono"', 'monospace'],
        'label-sm': ['"JetBrains Mono"', 'monospace'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },

      fontSize: {
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'headline-md': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-lg': ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-lg': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '500' }],
        'label-sm': ['10px', { lineHeight: '14px', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
};
