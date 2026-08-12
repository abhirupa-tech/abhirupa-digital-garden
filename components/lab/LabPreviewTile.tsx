import type { LabProject } from '@/lib/lab';
import { cloudinaryUrl } from '@/lib/cloudinary';

/**
 * One Lab project preview: a looping muted video when the project has one, else
 * a poster image, else a warm sand->rust gradient (matching the FieldNotesCards
 * fallback). Minimalist caption + tags below, hairline frame, rust-warm hover.
 * The whole tile links to the project page.
 *
 * `feature` gives the tile a taller media area for hero placement in a bento.
 */
export function LabPreviewTile({
  project,
  feature = false,
}: {
  project: LabProject;
  feature?: boolean;
}) {
  const mediaAspect = feature ? 'aspect-[16/10]' : 'aspect-[4/3]';

  return (
    <a
      href={project.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.12] bg-secondary-bg/40 transition-all duration-300 hover:-translate-y-0.5 hover:border-highlight/60 hover:bg-white/70 hover:shadow-sm dark:border-white/[0.08] dark:hover:border-highlight/60 dark:hover:bg-white/[0.06]"
    >
      <div className={`relative w-full overflow-hidden ${mediaAspect}`}>
        {project.video ? (
          <video
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            src={project.video}
            poster={project.poster ? cloudinaryUrl(project.poster, { width: 1000 }) : undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : project.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cloudinaryUrl(project.poster, { width: 1000 })}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-sand-deep via-sand to-rust">
            <span className="flex h-full w-full items-center justify-center px-6 text-center font-display text-2xl text-white/85">
              {project.title}
            </span>
          </div>
        )}
        {project.status === 'wip' && (
          <span className="label absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-white/90">
            In progress
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 py-4">
        <h3 className="font-display text-xl font-medium text-parchment transition-colors duration-300 group-hover:text-highlight md:text-2xl">
          {project.title}
        </h3>
        <p className="mt-2 font-rounded text-sm leading-relaxed text-parchment/80">
          {project.caption}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="label rounded-full border border-hairline px-2 py-0.5 text-parchment-faint"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
