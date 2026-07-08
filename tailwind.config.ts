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
        // Near-black canvas flowing into deep, muted blue
        ink: {
          900: '#08090f',
          800: '#0a0e1a',
          700: '#0b1122',
          600: '#0d1530',
          500: '#101c3a',
          400: '#152449',
        },
        // Sandy / warm — the hero highlight. Accents earn their place.
        sand: {
          DEFAULT: '#d4a574',
          soft: '#e2bd94',
          deep: '#b98a58',
        },
        // Muted navy — quiet hover wash, never bright
        navy: {
          muted: '#111a33',
        },
        // Whispers, secondary only
        teal: {
          whisper: '#7fb3ab',
        },
        blush: {
          whisper: '#d99fae',
        },
        // Readable text tones on dark
        parchment: {
          DEFAULT: '#ece7dd',
          muted: '#b9b4ac',
          faint: '#7d7a76',
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
