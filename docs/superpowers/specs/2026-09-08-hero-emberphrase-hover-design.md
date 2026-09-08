# Hero: pointer-reactive ember phrase ("AI breathes and thinks")

Date: 2026-09-08 · Status: approved (three design calls settled interactively)

## Goal

The highlighted phrase in the hero H1 — "AI breathes and thinks" — currently
renders as a static rust gradient. Give it a pointer-reactive life: the phrase
is a bed of coals, the pointer is breath. Where the pointer travels, a soft
halo blooms behind the letters and the glyphs nearest the cursor warm through
a fire ramp and pulse, hottest at the centre and fading over ~5 letters each
side.

Constraint above all: **subtle and smooth**. This sits in an editorial hero;
it must feel like the type is breathing, never like a toy.

## Where

`components/Hero.tsx` — the `<span>` at the H1's centre (currently
`bg-linear-to-r … bg-clip-text … text-transparent`). Replaced by a new
component `components/motion/EmberPhrase.tsx`. No other surface changes.

## Architecture

One component, three cooperating pieces, all fed by a single "heat field".

### 1. Splitting

The phrase is split word-by-word, then character-by-character:

- Each **word** is an `inline-block` span with `white-space: nowrap`, so the
  heading still wraps between words exactly as it does today.
- Each **character** is an `inline-block` span carrying `--h` (its heat) and
  `--i` (its index).
- The wrapper carries the readable text via `aria-label`; the split spans are
  `aria-hidden`. Text selection and copy still yield the original phrase
  because real space characters sit between word spans.

### 2. The heat field

On `pointermove` over the phrase, the pointer's x is compared against each
character's cached centre (rects measured on mount, re-measured on resize and
after `document.fonts.ready`).

Distance is expressed in **letter units** and converted to a target heat via a
gaussian: `h = exp(-(d / 2.2)^2)`. That yields 1.0 on the hovered glyph, ~0.6
two letters out, ~0.2 at five, ~0 by six — a smooth peak that slides as the
pointer moves, with no re-trigger or flicker at letter boundaries.

Each letter's heat is then run through **its own critically-ish damped spring**
(stiffness ~170, damping ~24, mass ~0.6) rather than used raw. Heat therefore
has inertia: it rises with a slight lag and decays with a longer tail, so a
fast sweep leaves a warm smear behind the cursor.

On pointer-leave every target drops to 0 and the springs exhale.

### 3. What heat drives, per letter

- **Colour** — a fire ramp from the letter's base rust to ember → amber → a
  pale gold core, mixed in `oklab` by `--h`.
- **Scale** — `1 + h * 0.12` at the peak, with `transform-origin` near the
  baseline (`50% 78%`) so letters grow *upward* and the baseline never jitters.
  Transform-based, so nothing reflows and neighbours are never shoved.
- **Glow** — a two-stop `text-shadow` whose blur radius and alpha scale with
  `h`, so hot letters bleed light into the halo behind them.
- **Pulse** — one global sine phase (period ~1.45s). A letter's oscillation
  amplitude is multiplied by its own heat, and its phase is offset by its
  distance from the hot centre, so the pulse **ripples outward** from the
  hovered glyph. The oscillation floor sits at `1 + h * 0.03`: a hot letter
  swings between ~1.12 and ~1.03 and **never dips below its rest size**.

### 4. The breath halo

A single absolutely-positioned radial-gradient element behind the glyphs
(`z-index` below the text, `pointer-events: none`).

- **Position** follows the pointer through a spring (stiffness ~260, damping
  ~31, mass ~1). Tuned tight on purpose: a slack halo makes the *pointer* look
  mispositioned, which reads as a bug rather than as physics. It still rounds
  off sharp direction changes without lagging behind.
- **Entry**: radius springs from ~35% to a fixed ~130px over ~450ms — it
  inflates rather than pops.
- **Exit**: opacity → 0 over ~600ms with the radius held, so it exhales.

### 5. The motes

A pool of twelve 6px specks, spawned at ~6/second at the pointer while it is
inside the phrase — sun-dust, not a particle system.

One random bearing per mote sets both its spawn offset and its direction of
travel, so the motes scatter outward in every direction from a single point
rather than rising — dust disturbed in a shaft of light, not bubbles. Speeds
are deliberately low (9–22 px/s, vertical component compressed to 70% so the
spread follows the shape of a line of type) and drag pulls each mote up short
within about 45px, where it hangs and fades over a 1.6–2.8s lifetime. A slow
sine on each axis keeps any one of them from travelling in a dead-straight
line.

Opacity is a fade envelope (fast in, slow out) times a slower twinkle, capped
at 0.62 and scaled by the halo's own visibility so the motes never outlive the
glow. Spawning recycles dead slots, so the pool never allocates. Dropped
entirely under reduced motion.

### 6. The wand tip

Inside the phrase the system cursor is hidden (`cursor: none`, scoped to
`(hover: hover) and (pointer: fine)`) and replaced by a small point of light —
a 15px hot core with a tight falloff, painted *above* the glyphs rather than
behind them, and the origin the motes scatter from.

It is the only layer with **no spring at all**. Any smoothing on the thing
standing in for the cursor reads as input latency rather than as physics, so it
tracks the pointer exactly and only its opacity is eased (in over 50ms, out
over 100ms). A slow ±7% breath on its scale is the one liberty taken.

## Colour decisions

**Theme-adaptive halo.** On the dark canvas the halo is the whitish breath
glow, composited with `plus-lighter`. On the light parchment canvas (#fbfaf7) a
white halo would be invisible, so the same gesture renders as a warm gold haze,
composited normally — but kept deliberately faint (alpha 0.26). The halo sits
*behind* the glyphs, so anything stronger hazes the contrast of the very
letters it is meant to be lighting.

**Fire ramp, per theme.** Dark: rust → `#f2692f` → `#ffa53c` → `#fff0c8`
(white-hot core). Light: the same ramp but topping out at a saturated gold
(~`#ffb020`) instead of near-white, which would vanish against parchment.

Both are expressed as CSS custom properties defined alongside the existing
palette in `app/globals.css`, so they flip with the theme like every other
token.

## The gradient trade

The existing look is a `background-clip: text` gradient on the wrapper. A
clipped-text parent and transformed children fight each other, and the effect
needs per-letter colour control regardless. So the wrapper gradient is
**dropped** and each letter instead receives its slice of the same
rust-deep → rust → rust-soft ramp, interpolated by its index, as its base
colour. At rest this is visually indistinguishable (a ~22-step interpolation of
a 3-stop ramp), and it behaves *better* across line wraps than
`box-decoration-clone` does today.

**Motes and the wand tip** take their own colour tokens per theme: saturated
amber and hot orange on parchment (a pale speck would vanish there), warm
near-whites on the dark canvas.

## Performance

A single `requestAnimationFrame` loop advances every spring, the global pulse
phase, the wand and the mote pool, then writes two custom properties (`--h`, `--s`) per
glyph directly to the DOM node. Colour, scale, and shadow are derived from `--h` in CSS. There are
**zero React re-renders per frame**. The loop parks itself when every heat has
settled to 0 and no pointer is present.

## Accessibility & input

- **Reduced motion** (`useReducedMotion`): no pulse, no scale, no spring lag.
  Hovering still produces a gentle static warm-up of the nearby letters and a
  still halo, both cross-fading over ~300ms.
- **Coarse pointers** (`(hover: none)`): the effect is skipped entirely and the
  phrase renders at rest — no hover state to strand a touch user in.
- The heading text remains a single readable string to assistive tech and to
  copy/paste.

## Two traps worth recording

**`ResizeObserver` reports nothing for inline elements.** The phrase is an
inline box, so observing it for layout changes silently never fires and the
glyph geometry stays as measured with the *fallback* font — the heat field
lands about three letters out of register once the web font swaps in. The fix
is to observe the block that lays the phrase out, and to re-measure on every
pointer entry as the real backstop: geometry only matters while the pointer is
inside, and one layout read per hover is cheap.

**An absolutely-positioned child of a wrapped inline resolves against the first
line fragment**, not against the union box `getBoundingClientRect()` reports.
Once the heading wraps, that puts the halo a full line-indent off. The halo's
own origin is therefore measured once (with its transform cleared) and kept as
an offset from the wrapper.

## Out of scope

Any other heading, the H2 subline, and the existing `HeroSparkDivider` are
untouched.
