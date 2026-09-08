'use client';

import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * The hero H1's highlighted phrase, treated as a bed of coals with the pointer
 * as breath.
 *
 * Two layers share one "heat field":
 *
 * 1. **The breath halo** — a soft radial light living *behind* the glyphs, so
 *    the letters read as lit from within rather than washed over. It follows
 *    the pointer through a laggy spring (the light trails a half-beat behind
 *    the cursor, which is what makes it feel like a physical thing), inflates
 *    on enter instead of popping, and exhales on leave with its radius held.
 *
 * 2. **The letters** — the phrase is split per character, and every frame each
 *    glyph's distance from the pointer becomes a heat value 0→1 through a
 *    gaussian falloff. Heat is 1.0 under the cursor, ~0.6 two letters out and
 *    ~0 by six, so moving between letters slides the peak rather than
 *    re-triggering anything. Each glyph's heat runs through its own spring, so
 *    heat has inertia: it rises with a slight lag and decays with a longer
 *    tail, and a fast sweep leaves a warm smear behind the cursor.
 *
 * Heat drives color (a rust → ember → amber → core fire ramp), a transform
 * scale that never dips below the glyph's rest size, a text-shadow bloom, and
 * a pulse whose phase is offset by distance from the hot centre — so the
 * oscillation ripples outward from the hovered letter like heat through coals.
 *
 * Everything visual is derived in CSS from two registered custom properties,
 * `--h` and `--s` (see `.ember-char` in app/globals.css). This component's job
 * is only to integrate the physics in a single rAF loop and write those two
 * numbers per glyph — there are no React renders per frame, and the loop parks
 * itself once every letter has cooled.
 *
 * Reduced motion drops the pulse, the scale and the spring lag, leaving a
 * gentle warm-up and a still halo. Coarse pointers skip the effect entirely.
 */

/** Gaussian width, in letter-widths: how far the heat reaches to each side. */
const SIGMA = 2.2;
/** Heat spring — rises with a little lag, decays with a longer tail. */
const HEAT_K = 170;
const HEAT_C = 24;
const HEAT_M = 0.6;
/** Halo-position spring. Tight enough that the light reads as being *at* the
 *  cursor rather than trailing it — a slack halo makes the pointer itself look
 *  mispositioned — but still soft enough to round off sharp direction changes. */
const HALO_K = 260;
const HALO_C = 31;
const HALO_M = 1;
/** Halo-radius spring — the inflate-on-enter. */
const BLOOM_K = 90;
const BLOOM_C = 18;
const BLOOM_M = 1;
/** Radius the halo settles at, in px (half the element's box). */
const HALO_R = 130;
/** Radius fraction the halo starts from before it inflates. */
const BLOOM_MIN = 0.35;
/** Seconds for the halo to fade in / exhale out. */
const HALO_IN = 0.12;
const HALO_OUT = 0.22;
/** The wand tip lights and dies faster than the halo — it is the cursor. */
const WAND_IN = 0.05;
const WAND_OUT = 0.1;
/** Pulse period in seconds, and how much a letter's phase lags per letter of
 *  distance from the hot centre — this is what makes the pulse ripple. */
const PULSE_PERIOD = 1.45;
const RIPPLE = 0.85;
/** A fully-hot letter oscillates between +3% and +12% of its rest size. */
const SWELL_FLOOR = 0.03;
const SWELL_RANGE = 0.09;
/** Exponential-smoothing time constant used in place of springs when the
 *  reader has asked for reduced motion. */
const CALM_TAU = 0.12;
/** Motes of light drifting off the hot letters. Kept deliberately sparse — a
 *  few specks of sun-dust, not a particle system. */
const SPARK_POOL = 12;
const SPARK_RATE = 6; // spawns per second while the pointer is inside
const SPARK_LIFE = [1.6, 2.8]; // seconds — slow drift needs room to read
const SPARK_ALPHA = 0.62; // ceiling on a mote's opacity
/** Motes leave in a random direction at this speed (px/s) and are pulled up
 *  short by drag, so they bloom outward from the pointer and hang there. */
const SPARK_SPEED = [9, 22];
const SPARK_DRAG = 0.85;

export function EmberPhrase({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const haloRef = useRef<HTMLSpanElement>(null);
  const wandRef = useRef<HTMLSpanElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const sparkRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Hover is meaningless on a touch screen, and leaving a finger-tapped letter
  // permanently lit would be worse than no effect at all.
  const [fine, setFine] = useState(false);

  // Words stay whole (each is an inline-block with `nowrap`) so the heading
  // wraps between words exactly as it did before the split.
  const words = useMemo(() => {
    const out: { chars: string[]; start: number }[] = [];
    let i = 0;
    for (const word of text.split(' ')) {
      out.push({ chars: Array.from(word), start: i });
      i += Array.from(word).length;
    }
    return out;
  }, [text]);

  const total = useMemo(() => words.reduce((n, w) => n + w.chars.length, 0), [words]);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    const halo = haloRef.current;
    const wand = wandRef.current;
    if (!wrap || !halo || !wand || !fine || total === 0) return;

    const nodes = charRefs.current.slice(0, total).filter(Boolean) as HTMLSpanElement[];
    if (nodes.length !== total) return;
    const sparkNodes = sparkRefs.current.slice(0, SPARK_POOL).filter(Boolean) as HTMLSpanElement[];

    // ── Geometry ───────────────────────────────────────────────────────────
    // Glyph centres are stored relative to the wrapper, so they survive
    // scrolling; only the wrapper's own rect needs refreshing per frame.
    const cx = new Float32Array(total);
    const cy = new Float32Array(total);
    let unit = 10; // average glyph width — the "letter" of "letters away"
    let wrapRect = wrap.getBoundingClientRect();
    // The phrase is an *inline* box, so when it wraps across lines its
    // absolutely-positioned child resolves against the first line fragment,
    // not against the union box getBoundingClientRect() reports. These are
    // the halo's own origin, measured once, expressed relative to the wrapper.
    let haloDX = 0;
    let haloDY = 0;

    const measure = () => {
      wrapRect = wrap.getBoundingClientRect();

      const prevTransform = halo.style.transform;
      halo.style.transform = 'none';
      const hr = halo.getBoundingClientRect();
      haloDX = hr.left - wrapRect.left;
      haloDY = hr.top - wrapRect.top;
      halo.style.transform = prevTransform;
      let widths = 0;
      for (let i = 0; i < total; i++) {
        const r = nodes[i].getBoundingClientRect();
        cx[i] = r.left + r.width / 2 - wrapRect.left;
        cy[i] = r.top + r.height / 2 - wrapRect.top;
        widths += r.width;
      }
      unit = Math.max(4, widths / total);
    };

    measure();
    // Web fonts land after first paint and re-cut every glyph's box.
    document.fonts?.ready.then(measure).catch(() => {});
    // The phrase itself is an *inline* element, and ResizeObserver reports
    // nothing for those — so watch the block that lays it out instead, and
    // re-measure on every pointer entry as the real backstop. Geometry only
    // matters while the pointer is inside, and one layout read per hover is
    // cheap next to being three letters out of register.
    const ro = new ResizeObserver(measure);
    ro.observe(wrap.parentElement ?? wrap);

    // ── State ──────────────────────────────────────────────────────────────
    const heat = new Float32Array(total);
    const heatV = new Float32Array(total);
    const dist = new Float32Array(total);
    const lastH = new Float32Array(total);
    const lastS = new Float32Array(total).fill(1);

    let clientX = 0;
    let clientY = 0;
    let active = false;

    let hx = 0;
    let hy = 0;
    let hvx = 0;
    let hvy = 0;
    let bloom = BLOOM_MIN;
    let bloomV = 0;
    let vis = 0;
    // The wand's own fade. Sharper than the halo's: it stands in for the
    // system cursor, so it has to arrive and leave with the pointer.
    let wandVis = 0;

    // Motes. Each slot is either dead (age >= life) or drifting; spawning
    // recycles the oldest dead slot, so there is no allocation per spark.
    const spool = sparkNodes.length;
    const spx = new Float32Array(spool);
    const spy = new Float32Array(spool);
    const svx = new Float32Array(spool);
    const svy = new Float32Array(spool);
    const sAge = new Float32Array(spool);
    const sLife = new Float32Array(spool);
    const sSeed = new Float32Array(spool);
    const sShown = new Uint8Array(spool);
    let spawnAcc = 0;

    let phase = 0;
    let raf = 0;
    let last = 0;
    let running = false;

    const writeHalo = () => {
      halo.style.opacity = vis.toFixed(3);
      halo.style.transform = `translate3d(${(hx - HALO_R).toFixed(1)}px, ${(
        hy - HALO_R
      ).toFixed(1)}px, 0) scale(${bloom.toFixed(3)})`;
    };

    /** Damped-spring step: F = -k·x - c·v, integrated semi-implicitly. */
    const spring = (x: number, v: number, target: number, k: number, c: number, m: number, dt: number) => {
      const a = (k * (target - x) - c * v) / m;
      const nv = v + a * dt;
      return [x + nv * dt, nv] as const;
    };

    /** Exponential approach — used wherever a spring would be too lively. */
    const ease = (x: number, target: number, tau: number, dt: number) =>
      x + (target - x) * (1 - Math.exp(-dt / tau));

    const frame = (t: number) => {
      const dt = Math.min(0.033, last ? (t - last) / 1000 : 0.016);
      last = t;

      // One rect read at the top of the frame, before any writes, so the
      // per-frame style writes below never force a second layout.
      if (active) wrapRect = wrap.getBoundingClientRect();
      const px = clientX - wrapRect.left;
      const py = clientY - wrapRect.top;
      // Same pointer, expressed in the halo's own coordinate space.
      const hpx = px - haloDX;
      const hpy = py - haloDY;

      phase += (dt * Math.PI * 2) / PULSE_PERIOD;

      let hottest = 0;

      for (let i = 0; i < total; i++) {
        let target = 0;
        if (active) {
          const dx = px - cx[i];
          // A wrapped heading puts letters on other lines; weighting dy hard
          // keeps the field on the line the pointer is actually over.
          const dy = (py - cy[i]) * 2.2;
          const d = Math.sqrt(dx * dx + dy * dy) / unit;
          dist[i] = d;
          target = Math.exp(-(d * d) / (SIGMA * SIGMA));
          if (target < 0.004) target = 0;
        }

        if (reduce) {
          heat[i] = ease(heat[i], target, CALM_TAU, dt);
        } else {
          const [x, v] = spring(heat[i], heatV[i], target, HEAT_K, HEAT_C, HEAT_M, dt);
          heat[i] = x;
          heatV[i] = v;
        }

        const h = heat[i] < 0.0015 ? 0 : heat[i];
        if (h > hottest) hottest = h;

        // Amplitude scales with this letter's own heat, and the phase lags by
        // its distance from the centre — so the pulse travels outward.
        const s = reduce
          ? 1
          : 1 + h * (SWELL_FLOOR + SWELL_RANGE * (0.5 + 0.5 * Math.sin(phase - dist[i] * RIPPLE)));

        if (Math.abs(h - lastH[i]) > 0.002 || Math.abs(s - lastS[i]) > 0.0006) {
          nodes[i].style.setProperty('--h', h.toFixed(3));
          nodes[i].style.setProperty('--s', s.toFixed(4));
          lastH[i] = h;
          lastS[i] = s;
        }
      }

      // ── Halo ─────────────────────────────────────────────────────────────
      if (reduce) {
        hx = hpx;
        hy = hpy;
        bloom = 1;
      } else {
        [hx, hvx] = spring(hx, hvx, hpx, HALO_K, HALO_C, HALO_M, dt);
        [hy, hvy] = spring(hy, hvy, hpy, HALO_K, HALO_C, HALO_M, dt);
        if (active) [bloom, bloomV] = spring(bloom, bloomV, 1, BLOOM_K, BLOOM_C, BLOOM_M, dt);
      }
      vis = ease(vis, active ? 1 : 0, active ? HALO_IN : HALO_OUT, dt);
      writeHalo();

      // ── Wand tip ─────────────────────────────────────────────────────────
      // No spring, no lag: this *is* the cursor while the pointer is inside
      // the phrase, so any smoothing here would read as input latency.
      wandVis = ease(wandVis, active ? 1 : 0, active ? WAND_IN : WAND_OUT, dt);
      const wandScale = reduce ? 1 : 1 + 0.07 * Math.sin(phase * 1.15);
      wand.style.opacity = wandVis.toFixed(3);
      wand.style.transform = `translate3d(${(hpx - 7.5).toFixed(1)}px, ${(hpy - 7.5).toFixed(
        1,
      )}px, 0) scale(${wandScale.toFixed(3)})`;

      // ── Motes ────────────────────────────────────────────────────────────
      // A trickle of specks lifting off the hot letters. They spawn at the
      // pointer (not at the lagging halo), scatter outward in every direction,
      // and are slowed almost to a hover by drag as they twinkle out — dust
      // disturbed in a shaft of light, not bubbles rising.
      let sparksAlive = 0;
      if (!reduce && spool > 0) {
        if (active) {
          spawnAcc += dt * SPARK_RATE;
          while (spawnAcc >= 1) {
            spawnAcc -= 1;
            let slot = -1;
            let oldest = -1;
            for (let i = 0; i < spool; i++) {
              if (sAge[i] >= sLife[i]) {
                slot = i;
                break;
              }
              const left = sLife[i] - sAge[i];
              if (oldest < 0 || left < sLife[oldest] - sAge[oldest]) oldest = i;
            }
            if (slot < 0) slot = oldest;
            if (slot >= 0) {
              // One random bearing sets both the spawn offset and the
              // direction of travel, so every mote reads as having been
              // pushed outward from the same point.
              const bearing = Math.random() * Math.PI * 2;
              const speed = SPARK_SPEED[0] + Math.random() * (SPARK_SPEED[1] - SPARK_SPEED[0]);
              const offset = 4 + Math.random() * 11;
              spx[slot] = hpx + Math.cos(bearing) * offset;
              spy[slot] = hpy + Math.sin(bearing) * offset * 0.7;
              svx[slot] = Math.cos(bearing) * speed;
              svy[slot] = Math.sin(bearing) * speed * 0.7;
              sAge[slot] = 0;
              sLife[slot] = SPARK_LIFE[0] + Math.random() * (SPARK_LIFE[1] - SPARK_LIFE[0]);
              sSeed[slot] = Math.random() * Math.PI * 2;
            }
          }
        }

        for (let i = 0; i < spool; i++) {
          if (sAge[i] >= sLife[i]) {
            if (sShown[i]) {
              sparkNodes[i].style.opacity = '0';
              sShown[i] = 0;
            }
            continue;
          }
          sAge[i] += dt;
          sparksAlive++;

          const drag = Math.exp(-SPARK_DRAG * dt);
          svx[i] *= drag;
          svy[i] *= drag;
          // A slow, tiny wander on each axis so a drifting mote never travels
          // in a dead-straight line.
          spx[i] += (svx[i] + Math.sin(phase * 0.35 + sSeed[i]) * 2.5) * dt;
          spy[i] += (svy[i] + Math.cos(phase * 0.31 + sSeed[i] * 1.7) * 2.5) * dt;

          const u = Math.min(1, sAge[i] / sLife[i]);
          const fade = u < 0.18 ? u / 0.18 : 1 - (u - 0.18) / 0.82;
          const twinkle = 0.62 + 0.38 * Math.sin(sAge[i] * 4.2 + sSeed[i] * 3);
          const alpha = Math.max(0, fade * twinkle * SPARK_ALPHA * vis);
          const scale = 0.45 + 0.7 * Math.max(0, fade);

          sparkNodes[i].style.opacity = alpha.toFixed(3);
          sparkNodes[i].style.transform = `translate3d(${(spx[i] - 3).toFixed(1)}px, ${(
            spy[i] - 3
          ).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          sShown[i] = 1;
        }
      }

      // Park the loop once the coals are out — nothing is moving, so nothing
      // needs a frame.
      if (!active && vis < 0.005 && wandVis < 0.005 && hottest < 0.002 && sparksAlive === 0) {
        vis = 0;
        wandVis = 0;
        wand.style.opacity = '0';
        bloom = BLOOM_MIN;
        bloomV = 0;
        writeHalo();
        for (let i = 0; i < total; i++) {
          if (lastH[i] === 0 && lastS[i] === 1) continue;
          nodes[i].style.setProperty('--h', '0');
          nodes[i].style.setProperty('--s', '1');
          lastH[i] = 0;
          lastS[i] = 1;
        }
        for (let i = 0; i < spool; i++) {
          sAge[i] = 1;
          sLife[i] = 0;
          if (sShown[i]) {
            sparkNodes[i].style.opacity = '0';
            sShown[i] = 0;
          }
        }
        spawnAcc = 0;
        running = false;
        last = 0;
        wrap.dataset.live = 'false';
        return;
      }

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = 0;
      wrap.dataset.live = 'true';
      raf = requestAnimationFrame(frame);
    };

    const onEnter = (e: PointerEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      if (!active) {
        measure();
        // Drop the halo in at the entry point rather than sliding it in from
        // wherever it was left last time.
        hx = clientX - wrapRect.left - haloDX;
        hy = clientY - wrapRect.top - haloDY;
        hvx = 0;
        hvy = 0;
        bloom = reduce ? 1 : BLOOM_MIN;
        bloomV = 0;
      }
      active = true;
      start();
    };

    const onMove = (e: PointerEvent) => {
      clientX = e.clientX;
      clientY = e.clientY;
      if (!active) onEnter(e);
    };

    const onLeave = () => {
      active = false;
      start();
    };

    wrap.addEventListener('pointerenter', onEnter);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    wrap.addEventListener('pointercancel', onLeave);

    return () => {
      wrap.removeEventListener('pointerenter', onEnter);
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      wrap.removeEventListener('pointercancel', onLeave);
      ro.disconnect();
      cancelAnimationFrame(raf);
      wrap.dataset.live = 'false';
    };
  }, [fine, reduce, total]);

  let index = 0;

  return (
    <span
      ref={wrapRef}
      aria-label={text}
      data-live="false"
      className={`ember-phrase ${className ?? ''}`}
    >
      <span ref={haloRef} aria-hidden="true" className="ember-halo" />
      <span ref={wandRef} aria-hidden="true" className="ember-wand" />
      {Array.from({ length: SPARK_POOL }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="ember-spark"
          ref={(el) => {
            sparkRefs.current[i] = el;
          }}
        />
      ))}
      {words.map((word, w) => (
        // The separating space sits *outside* the nowrap word span, so it stays
        // the line-break opportunity it was before the split.
        <Fragment key={w}>
          <span aria-hidden="true" className="ember-word">
            {word.chars.map((char, c) => {
              const i = index++;
              return (
                <span
                  key={c}
                  ref={(el) => {
                    charRefs.current[i] = el;
                  }}
                  className="ember-char"
                  // Position along the phrase, 0→1: reproduces the rust gradient
                  // the phrase used to get from `bg-clip-text`, one slice per glyph.
                  style={{ ['--p' as string]: total > 1 ? (i / (total - 1)).toFixed(4) : '0' }}
                >
                  {char}
                </span>
              );
            })}
          </span>
          {w < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
