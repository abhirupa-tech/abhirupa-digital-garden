import type { LabProject } from '@/lib/lab';
import { LabSpecimen } from './LabSpecimen';

/**
 * The lab bench: one graph-paper surface the experiments sit on as specimens,
 * with a ruler along the top edge, registration marks at the corners, and a
 * bench label. Specimens share one size, so the bench reads as a set.
 */
export function LabBench({ projects }: { projects: LabProject[] }) {
  const live = projects.filter((p) => p.status === 'live').length;

  return (
    <div className="lab-bench relative overflow-hidden rounded-2xl border border-hairline">
      <Ruler />
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <span key={corner} aria-hidden className={`lab-reg lab-reg-${corner}`} />
      ))}

      <div className="relative px-5 pb-8 pt-10 md:px-10 md:pb-12 md:pt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <span className="label text-parchment-faint">Bench 05 · Agentic interfaces</span>
          <span className="label flex items-center gap-2 text-parchment-faint">
            <span className="h-1.5 w-1.5 rounded-full bg-highlight motion-safe:animate-pulse" aria-hidden />
            {projects.length} specimens · {live} under observation
          </span>
        </div>

        <div className="mt-8 grid gap-x-10 gap-y-12 md:grid-cols-2 md:gap-x-12">
          {projects.map((project, i) => (
            <LabSpecimen key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Millimetre ticks along the bench's top edge, a longer tick every centimetre. */
function Ruler() {
  return (
    <svg aria-hidden className="absolute inset-x-0 top-0 h-3 w-full text-parchment-faint" preserveAspectRatio="none">
      <defs>
        <pattern id="lab-ruler" width="80" height="12" patternUnits="userSpaceOnUse">
          {Array.from({ length: 10 }, (_, i) => (
            <line
              key={i}
              x1={i * 8 + 0.5}
              x2={i * 8 + 0.5}
              y1={0}
              y2={i === 0 ? 11 : i === 5 ? 7 : 4}
              stroke="currentColor"
              strokeOpacity={i === 0 ? 0.55 : 0.35}
            />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="12" fill="url(#lab-ruler)" />
    </svg>
  );
}
