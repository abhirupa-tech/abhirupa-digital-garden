import { Reveal } from '../motion/Reveal';
import { SocialIcons } from '../SocialIcons';
import { Glyph, type GlyphName } from './Glyph';

const FACETS: { k: string; label: string; glyph: GlyphName }[] = [
  { k: '01', label: 'Agentic AI interfaces', glyph: 'spark' },
  { k: '02', label: 'Frontend engineering', glyph: 'brackets' },
  { k: '03', label: 'Design thinking', glyph: 'compass' },
  { k: '04', label: 'Slow living', glyph: 'sprout' },
];

/**
 * About-page opener text — an oversized display statement, a manifesto that
 * steps in from the left, and a compact index of what Abhirupa works on.
 * Layout (grid placement, the paired portrait) is owned by the page.
 */
export function AboutIntro() {
  return (
    <div>
      <Reveal>
        <span className="label text-parchment-muted">About</span>
        <h1 className="mt-6 font-display text-[clamp(1.8rem,5.2vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.015em] text-parchment">
          I design the quiet places where{' '}
          <span className="box-decoration-clone bg-linear-to-r from-rust-deep via-rust to-rust-soft bg-clip-text pr-[0.14em] font-semibold italic text-transparent">
            people and AI
          </span>{' '}
          think together.
        </h1>
      </Reveal>

      <Reveal delay={0.12} from="left" className="mt-9 max-w-xl">
        <p className="font-rounded text-[calc(1.25rem_-_1pt)] leading-relaxed sm:text-[1.25rem] text-parchment/85">
          I&rsquo;m <span className="font-medium text-parchment">Abhirupa Mitra</span> —
          I build the user experience for agentic solutions: the surfaces where AI
          agents do real work and people stay in control. At Slack, I&rsquo;m on the
          Intelligence team behind Agentforce — agent profiles, admin controls for
          agents, and the Salesforce MCP integrations that connect Slack to the
          systems teams already run on.
        </p>
      </Reveal>

      <Reveal delay={0.2} from="left" className="mt-6 max-w-xl">
        <p className="font-rounded text-[calc(1.25rem_-_1pt)] leading-relaxed sm:text-[1.25rem] text-parchment-muted">
          My work lives on the surfaces where agents reason out loud, pause, and
          hand control back to a person. I treat the model as a material and start,
          always, from the human on the other side of the screen.
        </p>
      </Reveal>

      {/* What I do — four pictogram tiles, sunset glyphs warming on hover */}
      <Reveal delay={0.28} from="left" className="mt-10 max-w-lg">
        <span className="label text-parchment-faint">What I do</span>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4">
          {FACETS.map((f) => (
            <li
              key={f.k}
              className="group rounded-2xl border border-parchment/10 bg-secondary-bg/50 p-4 backdrop-blur-[1px] transition-all duration-300 hover:-translate-y-0.5 hover:border-sunset/45 sm:p-5"
            >
              <Glyph
                name={f.glyph}
                className="h-7 w-7 text-sunset transition-transform duration-300 group-hover:-rotate-6"
              />
              <span className="mt-3 block font-display text-xs text-sunset/70 tabular-nums">{f.k}</span>
              <span className="mt-0.5 block font-rounded text-[1.02rem] font-medium leading-tight text-parchment">
                {f.label}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.36} from="left" className="mt-10">
        <SocialIcons />
      </Reveal>
    </div>
  );
}
