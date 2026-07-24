/**
 * Zone metadata for the homepage. The *entries* each zone previews now live as
 * files under /content (see lib/content.ts) — this file only holds the framing:
 * the kicker, title, and a one-to-two line blurb. Copy carries SEO weight
 * (agentic UI, frontend for AI, design thinking, UX research, women in tech).
 */
import { featureFlags } from './featureflag';

export type Zone = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  /** One to two lines only — what this section is, at a glance. */
  blurb: string;
};

export const zones: Zone[] = [
  {
    id: 'the-practice',
    index: '01',
    kicker: 'The Practice',
    title: 'Interfaces where agents think out loud',
    blurb:
      'Frontend work at Slack for agentic AI — the surfaces where agents reason, pause, and hand control back.',
  },
  {
    id: 'field-notes',
    index: '02',
    kicker: 'Field Notes',
    title: 'Essays on human–AI interaction',
    blurb:
      'Working notes on designing frontends for AI, published while the ink is still wet.',
  },
  {
    id: 'design-thinking',
    index: '03',
    kicker: 'Design Thinking',
    title: 'A human-centered method for intelligent systems',
    blurb:
      'UI/UX research and process — starting from the person, treating the model as a material.',
  },
  {
    id: 'knowledge-library',
    index: '04',
    kicker: 'Knowledge Library',
    title: 'The things I read, keep, and return to',
    blurb: 'Papers, essays, books, and art — a place for finding, not browsing.',
  },
];

export const zoneById = Object.fromEntries(zones.map((z) => [z.id, z])) as Record<
  string,
  Zone
>;

// Zones actually surfaced in nav, the sitemap, and static generation — gated
// by feature flags so a hidden section disappears everywhere consistently.
export const visibleZones = zones.filter(
  (z) => z.id !== 'knowledge-library' || featureFlags.showKnowledgeSection,
);

export const sitemapLinks: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'The Garden',
    links: [
      { label: 'The Practice', href: '/#the-practice' },
      { label: 'Field Notes', href: '/#field-notes' },
      { label: 'Design Thinking', href: '/#design-thinking' },
      ...(featureFlags.showKnowledgeSection
        ? [{ label: 'Knowledge Library', href: '/#knowledge-library' }]
        : []),
    ],
  },
  {
    heading: 'Writing',
    links: [
      { label: 'Essays', href: '/collections/essay' },
      { label: 'Guides', href: '/collections/guide' },
      { label: 'Playbooks', href: '/collections/playbook' },
      ...(featureFlags.showKnowledgeSection
        ? [
            { label: 'Research Notes', href: '/#knowledge-library' },
            { label: 'Reading List', href: '/#knowledge-library' },
          ]
        : []),
    ],
  },
  {
    heading: 'Elsewhere',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/abhirupa' },
      { label: 'Medium', href: 'https://medium.com/@abhirupa' },
      { label: 'Email', href: 'mailto:hello@abhirupa.com' },
    ],
  },
];
