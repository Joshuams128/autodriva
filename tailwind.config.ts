import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent:  '#1e6ef4',
        base:    '#0a0a0a',
        card:    '#0f0f0f',
        surface: '#0d0d0d',
        deep:    '#080808',
        footer:  '#050505',
      },
      fontFamily: {
        barlow: ['var(--font-barlow)', 'sans-serif'],
        inter:  ['var(--font-inter)',  'sans-serif'],
      },
      keyframes: {
        scrollPulse: {
          '0%, 100%': { transform: 'scaleY(1) translateY(0)', opacity: '0.4' },
          '50%':       { transform: 'scaleY(1.3) translateY(4px)', opacity: '0.9' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
        'fade-in-up':   'fadeInUp 0.15s ease',
        'spin-slow':    'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
