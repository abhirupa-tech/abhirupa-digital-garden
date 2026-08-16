import type { Zone } from '@/lib/data';
import type { LabProject } from '@/lib/lab';
import { Reveal } from '../motion/Reveal';
import { SectionHeader } from './SectionHeader';
import { ViewAllLink } from './ViewAllLink';
import { LabPreviewTile } from '../lab/LabPreviewTile';

/**
 * Homepage Lab row: the editorial section header, then a bento of project
 * preview tiles. The first project is featured (wider, taller media); the rest
 * fill a compact grid beside it. Reads projects from the lab registry.
 */
export function LabBento({ zone, projects }: { zone: Zone; projects: LabProject[] }) {
  const [lead, ...rest] = projects;
  if (!lead) return null;

  return (
    <div>
      <SectionHeader zone={zone} from="up" />

      <div className="mt-9 grid gap-5 md:grid-cols-12">
        <Reveal className="md:col-span-7" delay={0.04}>
          <LabPreviewTile project={lead} feature />
        </Reveal>

        <div className="grid gap-5 md:col-span-5">
          {rest.slice(0, 2).map((project, i) => (
            <Reveal key={project.slug} delay={0.08 * (i + 1)}>
              <LabPreviewTile project={project} />
            </Reveal>
          ))}
          {rest.length === 0 && (
            <Reveal delay={0.08} className="flex">
              <div className="flex flex-1 items-center rounded-2xl border border-dashed border-hairline px-6 py-8">
                <p className="font-rounded text-sm leading-relaxed text-parchment-faint">
                  More experiments are in the workshop. New agentic-interface
                  prototypes land here as they come to life.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      <Reveal delay={0.16} className="mt-6">
        <ViewAllLink href="/lab/" label="Enter the lab" count={projects.length} />
      </Reveal>
    </div>
  );
}
