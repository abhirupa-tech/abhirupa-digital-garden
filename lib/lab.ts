/**
 * Registry of Lab projects — live, interactive experiments in agentic-interface
 * design. Single source of truth for the homepage Lab section, the /lab hub, and
 * the sitemap. Preview assets are optional: a tile shows a looping `video` when
 * present, else a `poster` image, else a warm gradient fallback.
 */
export type LabStatus = 'live' | 'wip';

export type LabProject = {
  slug: string;
  title: string;
  /** The minimalist one-line caption shown on the preview tile. */
  caption: string;
  tags: string[];
  status: LabStatus;
  /** Canonical, trailing-slash route to the project page. */
  href: string;
  /** Optional Cloudinary public id or /public path for a still preview. */
  poster?: string;
  /** Optional /public path to a looping preview video (autoplay, muted). */
  video?: string;
};

export const labProjects: LabProject[] = [
  {
    slug: 'morphology-in-AI-components',
    title: 'Morphology in AI components',
    caption: 'Interface states that show what an agent is actually doing.',
    tags: ['Agentic UI', 'Interaction design', 'Prototype'],
    status: 'live',
    href: '/lab/morphology-in-AI-components/',
    // No video yet — falls back to the gradient preview.
  },
];

export const labProjectBySlug = Object.fromEntries(
  labProjects.map((p) => [p.slug, p]),
) as Record<string, LabProject>;
