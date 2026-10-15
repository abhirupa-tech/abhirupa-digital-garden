import { JetBrains_Mono, Silkscreen, Space_Grotesk } from 'next/font/google';

/**
 * rec's type, declared once. next/font fails the build intermittently when the
 * same family is declared in two modules with different options, so the page
 * and the Lab tile preview both import from here.
 */

// Pixel font for labels and numbers only; body text stays a readable sans.
export const silkscreen = Silkscreen({
  subsets: ['latin'],
  variable: '--font-silkscreen',
  display: 'swap',
  weight: ['400', '700'],
});

// rec's own type: a technical grotesk and a mono, nothing from the blog.
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-rec-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-rec-mono',
  display: 'swap',
  weight: ['400', '500'],
});
