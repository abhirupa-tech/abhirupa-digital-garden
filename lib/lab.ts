/**
 * Registry of Lab projects — live, interactive experiments in agentic-interface
 * design. Single source of truth for the homepage Lab section, the /lab hub, and
 * the sitemap. Preview assets are optional: a tile shows a looping `video` when
 * present, else a live code-drawn `preview`, else a `poster` image, else a warm
 * gradient fallback.
 */
export type LabStatus = 'live' | 'wip';

/** A live, code-drawn preview of the project's UX (components/lab/previews). */
export type LabPreviewId = 'morphology' | 'rec';

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
  /** Optional live preview, shown when there's no video. */
  preview?: LabPreviewId;
  /** Scale-bar label on the specimen window, e.g. "1 word". */
  scale?: string;
};

export const labProjects: LabProject[] = [
  {
    slug: 'morphology-in-AI-components',
    title: 'Morphology in AI components',
    caption: 'Interface states that show what an agent is actually doing.',
    tags: ['Agentic UI', 'Interaction design', 'Prototype'],
    status: 'live',
    href: '/lab/morphology-in-AI-components/',
    preview: 'morphology',
    scale: '1 word',
  },
  {
    slug: 'rec',
    title: 'rec',
    caption: 'Record an LLM stream once, replay it from a URL with its original timing.',
    tags: ['Frontend for AI', 'Testing', 'Tool'],
    status: 'live',
    href: '/lab/rec/',
    preview: 'rec',
    scale: '100 ms',
  },
];

export const labProjectBySlug = Object.fromEntries(
  labProjects.map((p) => [p.slug, p]),
) as Record<string, LabProject>;
