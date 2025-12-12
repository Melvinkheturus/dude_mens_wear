import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dude Menswear Brand Colors (Logo-Based)
        brand: {
          red: {
            DEFAULT: '#FF0000',      // Primary Red (Beard & Cap Fill)
            500: '#FF0000',          // Main CTAs, accents, sale badges
            600: '#CC0000',          // Cap Red (shadows/hovers)
            700: '#990000',          // Red Tint (hover states)
          },
          black: '#000000',          // Text & Outlines
          white: '#FFFFFF',          // Background/Base
        },
        // Semantic colors for easy reference
        primary: '#FF0000',
        secondary: '#000000',
        background: '#FFFFFF',
        foreground: '#000000',
        // Utility gray (minimal use - 60% white, 30% black, 10% red rule)
        gray: {
          800: '#333333',            // Secondary text only if needed
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Satoshi', 'Arial Black', 'sans-serif'],
        body: ['var(--font-body)', 'Manrope', 'Helvetica Neue', 'sans-serif'],
      },
      fontSize: {
        // Typography hierarchy
        'h1': ['64px', { lineHeight: '1.2', letterSpacing: '0.05em', fontWeight: '900' }],
        'h2': ['48px', { lineHeight: '1.3', letterSpacing: '0.05em', fontWeight: '900' }],
        'h3': ['32px', { lineHeight: '1.4', letterSpacing: '0.03em', fontWeight: '700' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '500' }],
        'button': ['16px', { lineHeight: '1', fontWeight: '700' }],
        'cta': ['20px', { lineHeight: '1', fontWeight: '500', letterSpacing: '0.05em' }],
      },
      spacing: {
        // 8px scale for consistency
        '18': '4.5rem',   // 72px
        '88': '22rem',    // 352px
      },
      maxWidth: {
        'container': '1200px',  // Desktop max-width
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.12)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'red-glow': '0 0 20px rgba(255, 0, 0, 0.3)',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        'pulse-red': 'pulse-red 1s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'zoom': 'zoom 0.3s ease-out forwards',
      },
      screens: {
        'xs': '320px',    // Mobile min
        'sm': '640px',
        'md': '768px',    // Tablet
        'lg': '1024px',   // Desktop
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
