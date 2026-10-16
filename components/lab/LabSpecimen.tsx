import type { LabProject } from '@/lib/lab';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { LAB_PREVIEWS } from './previews';

/**
 * One experiment, presented as a specimen on the bench: a dark-field viewing
 * window (viewfinder brackets, a faint reticle, a scale bar) over a notebook
 * label — specimen number, title, and a one-line note. Every specimen
 * gets the same window, so the bench reads as one set of observations rather
 * than a grid of unrelated cards.
 *
 * The window follows the site theme: a parchment light field in light mode, a
 * dark field in dark mode, with the optics drawn in ink or white to match.
 */
export function LabSpecimen({
  project,
  index,
  compact = false,
}: {
  project: LabProject;
  index: number;
  /** Shorter, wider viewing window (16:9 from lg up) for the homepage. */
  compact?: boolean;
}) {
  const number = String(index + 1).padStart(2, '0');
  const Preview = project.preview ? LAB_PREVIEWS[project.preview] : null;

  return (
    <a href={project.href} className="lab-specimen group block focus-visible:outline-none">
      {/* Viewing window */}
      <div className={`relative overflow-hidden ${compact ? 'aspect-[4/3] lg:aspect-video' : 'aspect-[4/3]'} rounded-lg bg-[#f3ede1] ring-1 ring-black/10 transition-[box-shadow] duration-500 group-hover:ring-highlight/50 group-focus-visible:ring-2 group-focus-visible:ring-highlight dark:bg-[#121110] dark:ring-white/10`}>
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.025]">
          {project.video ? (
            <video
              className="h-full w-full object-cover"
              src={project.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : Preview ? (
            <Preview />
          ) : project.poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cloudinaryUrl(project.poster, { width: 1000 })} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-linear-to-br from-sand-deep via-sand to-rust" />
          )}
        </div>

        {/* Optics: vignette, reticle, viewfinder brackets, tag, scale bar. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(120,90,60,0.14)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />

          <div className="lab-reticle absolute inset-0 opacity-25 transition-opacity duration-500 group-hover:opacity-50">
            <span className="absolute left-1/2 top-[calc(50%-34px)] h-5 w-px -translate-x-1/2 bg-black/50 dark:bg-white/70" />
            <span className="absolute left-1/2 top-[calc(50%+14px)] h-5 w-px -translate-x-1/2 bg-black/50 dark:bg-white/70" />
            <span className="absolute left-[calc(50%-34px)] top-1/2 h-px w-5 -translate-y-1/2 bg-black/50 dark:bg-white/70" />
            <span className="absolute left-[calc(50%+14px)] top-1/2 h-px w-5 -translate-y-1/2 bg-black/50 dark:bg-white/70" />
          </div>

          {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
            <span key={corner} className={`lab-bracket lab-bracket-${corner}`} />
          ))}

          <span className="absolute left-4 top-3.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-black/45 dark:text-white/55">
            Spec. {number}
          </span>
          <span className="absolute right-4 top-3.5 flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-black/45 dark:text-white/55">
            <span
              className={`h-1.5 w-1.5 rounded-full ${project.status === 'live' ? 'bg-highlight motion-safe:animate-pulse' : 'bg-black/30 dark:bg-white/40'}`}
            />
            {project.status === 'live' ? 'Observing' : 'Incubating'}
          </span>
          {project.scale && (
            <span className="absolute bottom-3.5 right-4 flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.12em] text-black/45 dark:text-white/55">
              <span className="relative h-px w-10 bg-black/35 dark:bg-white/50">
                <span className="absolute -top-1 left-0 h-2 w-px bg-black/35 dark:bg-white/50" />
                <span className="absolute -top-1 right-0 h-2 w-px bg-black/35 dark:bg-white/50" />
              </span>
              {project.scale}
            </span>
          )}
        </div>
      </div>

      {/* Notebook label */}
      {/* Number pinned to the top, level with the title, so every specimen's
          number lines up across the bench whatever its note length. */}
      <div className="mt-5 flex items-start gap-4 md:gap-5">
        <span className="font-display text-3xl leading-none text-sand/80 md:text-4xl">{number}</span>
        <div className="min-w-0 border-l border-hairline pl-4 md:pl-5">
          <h3 className="font-rounded text-[0.8rem] font-semibold uppercase leading-snug tracking-[0.16em] text-parchment transition-colors duration-300 group-hover:text-highlight md:text-sm">
            {project.title}
          </h3>
          <p className="mt-1.5 font-rounded text-sm leading-relaxed text-parchment-muted">{project.caption}</p>
        </div>
      </div>
    </a>
  );
}

