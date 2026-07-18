import type { Zone } from '@/lib/data';
import { Reveal } from '../motion/Reveal';

type SectionHeaderProps = {
  zone: Zone;
  /** Compact for sections that share a row; grand for full-width sections. */
  size?: 'compact' | 'grand';
  align?: 'left' | 'center';
  from?: 'up' | 'left' | 'right';
};

/**
 * Shared section framing: number + kicker, a title, and only one to two lines
 * of subtext explaining what the section is. Entries do the rest of the talking.
 */
export function SectionHeader({
  zone,
  size = 'compact',
  align = 'left',
  from = 'up',
}: SectionHeaderProps) {
  const titleClass =
    size === 'grand'
      ? 'font-display text-section font-medium'
      : 'font-display text-3xl md:text-4xl font-medium';

  return (
    <Reveal
      from={from}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}
    >
      <div
        className={`flex items-baseline gap-4 ${align === 'center' ? 'justify-center' : ''}`}
      >
        <span className="font-display text-lg text-sand/90">{zone.index}</span>
        <span className="label text-parchment-muted">{zone.kicker}</span>
      </div>
      <h2 className={`mt-4 text-parchment ${titleClass}`}>{zone.title}</h2>
      <p className="mt-3 font-rounded text-lg font-light not-italic leading-tight tracking-tight text-parchment-muted">
        {zone.blurb}
      </p>
    </Reveal>
  );
}
