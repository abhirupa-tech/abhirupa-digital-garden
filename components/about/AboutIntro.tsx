import { Reveal } from '../motion/Reveal';
import { SocialIcons } from '../SocialIcons';

const FACETS = [
  { k: '01', label: 'Agentic AI interfaces' },
  { k: '02', label: 'Frontend engineering' },
  { k: '03', label: 'Design thinking' },
  { k: '04', label: 'Slow living' },
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
        <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.04] tracking-[-0.015em] text-parchment">
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

      {/* What I do — a compact index on a minimalist liquid-glass card */}
      <Reveal delay={0.28} from="left" className="mt-10 max-w-md">
        <div className="rounded-3xl bg-white/35 p-6 shadow-[0_12px_40px_-14px_rgba(20,18,16,0.22),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150 sm:p-7">
          <span className="label text-parchment-faint">What I do</span>
          <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {FACETS.map((f) => (
              <li key={f.k} className="flex items-baseline gap-3">
                <span className="font-display text-sm text-sand/80 tabular-nums">{f.k}</span>
                <span className="font-rounded text-[calc(1.25rem_-_1pt)] text-parchment sm:text-[1.25rem]">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.36} from="left" className="mt-10">
        <SocialIcons />
      </Reveal>
    </div>
  );
}
