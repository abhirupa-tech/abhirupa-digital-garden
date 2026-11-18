import localFont from 'next/font/local';

/**
 * rec's type, declared once so the page and the Lab tile preview share the
 * same font instances. Self-hosted from app/fonts (Fontsource builds, SIL OFL):
 * next/font/google downloads at build time and intermittently failed deploys.
 */

// Pixel font for labels and numbers only; body text stays a readable sans.
export const silkscreen = localFont({
  src: [
    { path: '../../../app/fonts/silkscreen-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../../../app/fonts/silkscreen-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-silkscreen',
  display: 'swap',
});

// rec's own type: a technical grotesk and a mono, nothing from the blog.
export const spaceGrotesk = localFont({
  src: '../../../app/fonts/space-grotesk-latin-wght-normal.woff2',
  weight: '300 700',
  variable: '--font-rec-sans',
  display: 'swap',
});

export const jetbrainsMono = localFont({
  src: '../../../app/fonts/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--font-rec-mono',
  display: 'swap',
});
