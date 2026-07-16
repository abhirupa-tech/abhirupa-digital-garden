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
  email: 'hello@abhirupa.com',
  social: {
    linkedin: 'https://www.linkedin.com/in/abhirupa',
    medium: 'https://medium.com/@abhirupa',
    email: 'mailto:hello@abhirupa.com',
  },
  /**
   * Keyword surface for discoverability. These phrases are the search
   * intents this site is built to rank for.
   */
  keywords: [
    'Abhirupa Mitra',
    'senior software engineer',
    'staff software engineer',
    'senior frontend engineer',
    'frontend engineer Slack',
    'agentic UI',
    'agentic AI interfaces',
    'frontend for AI',
    'frontend for AI interfaces',
    'AI interaction design',
    'UI UX research',
    'human-AI interaction',
    'design thinking',
    'Slack engineer',
    'women in technology',
    'women in tech',
    'women in AI',
    'AI enthusiast',
    'design engineer',
    'human-centered AI',
    'slow living',
  ],
} as const;

export type SiteConfig = typeof site;
