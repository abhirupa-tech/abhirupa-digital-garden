/**
 * The rec deck: a chunky pixel-art tape recorder, drawn on a 96x56 grid where
 * one SVG unit is one pixel. Fixed night palette, violet with a hot red record
 * key (it's artwork, so it doesn't flip with the site theme); crispEdges keeps
 * every pixel square at any scale.
 *
 * The reels spin in 45° steps while a preview plays (see rec.css), at a rate
 * tied to playback speed. Reduced motion leaves them still.
 */

const P = {
  outline: '#05040a',
  body: '#2a2142',
  bodyLight: '#43356b',
  bodyDark: '#191329',
  cream: '#d9d1f2',
  creamDark: '#a99dd1',
  window: '#0a0814',
  reel: '#c4b5fd',
  red: '#ff3b5c',
  key: '#d9d1f2',
  keyDark: '#8f82bd',
  label: '#a78bfa',
} as const;

/** Pixel circle of radius 5, as [dx, from, to] row spans. */
const REEL_ROWS: [number, number, number][] = [
  [-5, -2, 2],
  [-4, -3, 3],
  [-3, -4, 4],
  [-2, -5, 5],
  [-1, -5, 5],
  [0, -5, 5],
  [1, -5, 5],
  [2, -5, 5],
  [3, -4, 4],
  [4, -3, 3],
  [5, -2, 2],
];

/** Four spokes and a hub; symmetric, so a 45° step reads as a turn. */
const SPOKES: [number, number][] = [
  [0, -4],
  [0, -3],
  [0, 3],
  [0, 4],
  [-4, 0],
  [-3, 0],
  [3, 0],
  [4, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
];

function Reel({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="rec-reel">
      {REEL_ROWS.map(([dy, from, to]) => (
        <rect key={dy} x={cx + from} y={cy + dy} width={to - from + 1} height={1} fill={P.reel} />
      ))}
      {SPOKES.map(([dx, dy]) => (
        <rect key={`${dx},${dy}`} x={cx + dx} y={cy + dy} width={1} height={1} fill={P.window} />
      ))}
    </g>
  );
}

function Grille() {
  const dots = [];
  for (let y = 18; y <= 44; y += 3) {
    for (let x = 10; x <= 28; x += 3) dots.push(<rect key={`${x},${y}`} x={x} y={y} width={2} height={2} fill={P.bodyDark} />);
  }
  return <g>{dots}</g>;
}

export function PixelDeck({ playing, speed }: { playing: boolean; speed: number }) {
  return (
    <div
      className="rec-deck"
      data-playing={playing}
      style={{ ['--rec-reel-duration' as string]: `${1.2 / speed}s` }}
    >
      <svg
        viewBox="0 0 96 56"
        role="img"
        aria-label={playing ? 'Tape recorder, playing' : 'Tape recorder, idle'}
        className="block h-auto w-full"
      >
        {/* Handle */}
        <rect x={28} y={1} width={40} height={2} fill={P.outline} />
        <rect x={28} y={1} width={2} height={7} fill={P.outline} />
        <rect x={66} y={1} width={2} height={7} fill={P.outline} />

        {/* Piano keys */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={9 + i * 6} y={4} width={5} height={5} fill={P.outline} />
            <rect x={10 + i * 6} y={5} width={3} height={3} fill={i === 0 ? P.red : P.key} />
            <rect x={10 + i * 6} y={7} width={3} height={1} fill={i === 0 ? '#b3203d' : P.keyDark} />
          </g>
        ))}

        {/* Body, stepped corners */}
        <rect x={5} y={8} width={86} height={45} fill={P.outline} />
        <rect x={4} y={9} width={88} height={43} fill={P.outline} />
        <rect x={6} y={9} width={84} height={43} fill={P.body} />
        <rect x={5} y={10} width={86} height={41} fill={P.body} />
        <rect x={6} y={10} width={84} height={2} fill={P.bodyLight} />
        <rect x={6} y={49} width={84} height={2} fill={P.bodyDark} />

        <Grille />

        {/* Cassette bay */}
        <rect x={35} y={14} width={53} height={27} fill={P.outline} />
        <rect x={36} y={15} width={51} height={25} fill={P.cream} />
        <rect x={36} y={38} width={51} height={2} fill={P.creamDark} />
        <rect x={39} y={17} width={45} height={3} fill={P.label} />
        <rect x={44} y={22} width={35} height={13} fill={P.window} />
        <Reel cx={51} cy={28} />
        <Reel cx={72} cy={28} />
        {/* Tape running between the reels */}
        <rect x={57} y={33} width={10} height={1} fill={P.bodyDark} />

        {/* Transport + record LED */}
        <rect className="rec-led" x={38} y={44} width={3} height={3} fill={P.red} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={46 + i * 9} y={43} width={7} height={4} fill={P.outline} />
        ))}
        <rect x={48} y={44} width={3} height={2} fill={P.cream} />
        <rect x={57} y={44} width={3} height={2} fill={P.cream} />
        <rect x={66} y={44} width={3} height={2} fill={P.cream} />
        <rect x={75} y={44} width={3} height={2} fill={P.red} />

        {/* Feet */}
        <rect x={10} y={53} width={8} height={2} fill={P.outline} />
        <rect x={78} y={53} width={8} height={2} fill={P.outline} />
      </svg>
    </div>
  );
}

/** A small pixel cassette for the Shelf rows. */
export function PixelCassette({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 10" aria-hidden className={`rec-pixelated ${className}`}>
      <rect x={0} y={0} width={16} height={10} fill={P.outline} />
      <rect x={1} y={1} width={14} height={8} fill={P.body} />
      <rect x={2} y={2} width={12} height={2} fill={P.label} />
      <rect x={3} y={5} width={10} height={3} fill={P.window} />
      <rect x={4} y={6} width={2} height={1} fill={P.reel} />
      <rect x={10} y={6} width={2} height={1} fill={P.reel} />
    </svg>
  );
}
