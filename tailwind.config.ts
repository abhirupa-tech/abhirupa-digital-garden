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
        // Every token below resolves through a CSS variable (defined per
        // theme in globals.css), so light/dark switching never touches
        // component code — only the variable values change. The
        // `<alpha-value>` placeholder keeps Tailwind's opacity modifiers
        // (e.g. `bg-sand/10`) working.
        ink: {
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
          800: 'rgb(var(--color-ink-800) / <alpha-value>)',
          700: 'rgb(var(--color-ink-700) / <alpha-value>)',
          600: 'rgb(var(--color-ink-600) / <alpha-value>)',
          500: 'rgb(var(--color-ink-500) / <alpha-value>)',
          400: 'rgb(var(--color-ink-400) / <alpha-value>)',
        },
        // Primary highlight — warm sand in dark mode, dark navy in light mode.
        sand: {
          DEFAULT: 'rgb(var(--color-sand) / <alpha-value>)',
          soft: 'rgb(var(--color-sand-soft) / <alpha-value>)',
          deep: 'rgb(var(--color-sand-deep) / <alpha-value>)',
        },
        // Secondary highlight — bold, bright rust orange.
        rust: {
          DEFAULT: 'rgb(var(--color-rust) / <alpha-value>)',
          soft: 'rgb(var(--color-rust-soft) / <alpha-value>)',
          deep: 'rgb(var(--color-rust-deep) / <alpha-value>)',
        },
        // Warm off-white hover wash — no blue in it, always lighter than canvas.
        wash: 'rgb(var(--color-wash) / <alpha-value>)',
        // Whispers, secondary only
        teal: {
          whisper: 'rgb(var(--color-teal-whisper) / <alpha-value>)',
        },
        blush: {
          whisper: 'rgb(var(--color-blush-whisper) / <alpha-value>)',
        },
        // Body text tones — parchment on dark, dark grey on light.
        parchment: {
          DEFAULT: 'rgb(var(--color-parchment) / <alpha-value>)',
          muted: 'rgb(var(--color-parchment-muted) / <alpha-value>)',
          faint: 'rgb(var(--color-parchment-faint) / <alpha-value>)',
        },
      },
      fontFamily: {
        // 4-level serif hierarchy
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-garamond)', 'Georgia', 'serif'],
        rounded: ['var(--font-quicksand)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Spacious, breathable, luxurious scale
        'hero': ['clamp(2.75rem, 7vw, 6rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'section': ['clamp(2rem, 4.5vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'sub': ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.3' }],
      },
      letterSpacing: {
        label: '0.28em',
      },
      maxWidth: {
        editorial: '78rem',
      },
      keyframes: {
        'drift': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-24px)' },
        },
        'breathe': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        drift: 'drift 18s ease-in-out infinite',
        breathe: 'breathe 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
