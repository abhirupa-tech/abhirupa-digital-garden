/**
 * Central site configuration — single source of truth for identity, SEO,
 * and social links. Update these values when Abhirupa provides finals.
 */

export const site = {
  name: 'Abhirupa Mitra',
  shortName: 'Abhirupa',
  // Production domain (custom domain on GitHub Pages).
  url: 'https://abhirupamitra.com',
  role: 'Frontend Engineer at Slack',
  tagline:
    'Abhirupa architects spaces where AI breathes and thinks alongside humans.',
  subline: 'AI enthusiast and programmer at Slack',
  description:
    'Abhirupa Mitra is a senior frontend engineer at Slack designing agentic AI interfaces — the UI and UX research layer where AI agents think alongside people. A personal knowledge ecosystem on frontend for AI, design thinking, and slow living.',
  locale: 'en_US',
  email: 'mitra.abhirupa@gmail.com',
  social: {
    linkedin: 'https://www.linkedin.com/in/abhirupa-mitra',
    medium: 'https://medium.com/@mitra.abhirupa',
    email: 'mailto:mitra.abhirupa@gmail.com',
    github: 'https://github.com/abhirupa-tech',
  },
} as const;

export type SiteConfig = typeof site;
