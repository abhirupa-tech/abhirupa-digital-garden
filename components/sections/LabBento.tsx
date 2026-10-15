import type { Zone } from '@/lib/data';
import type { LabProject } from '@/lib/lab';
import { Reveal } from '../motion/Reveal';
import { SectionHeader } from './SectionHeader';
import { ViewAllLink } from './ViewAllLink';
import { LabBench } from '../lab/LabBench';

/**
 * Homepage Lab row: the editorial section header, then the lab bench — every
 * experiment mounted as a specimen under the same viewing optics. Reads
 * projects from the lab registry.
 */
export function LabBento({ zone, projects }: { zone: Zone; projects: LabProject[] }) {
  if (projects.length === 0) return null;

  return (
    <div>
      <SectionHeader zone={zone} from="up" />

      <Reveal className="mt-9" delay={0.06}>
        <LabBench projects={projects} />
      </Reveal>

      <Reveal delay={0.16} className="mt-6">
        <ViewAllLink href="/lab/" label="Enter the lab" count={projects.length} />
      </Reveal>
    </div>
  );
}
