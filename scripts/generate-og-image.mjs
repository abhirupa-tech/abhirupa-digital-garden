/**
 * Generates `public/og-image.png` — the 1200x630 social card used as the
 * OpenGraph / Twitter image for every page that has no cover art of its own
 * (home, about, lab, the section hubs, the collection indexes).
 *
 * This is a MANUAL, one-off script, deliberately not wired into `npm run
 * build`: the card only changes when the name, role, or pillars below change,
 * and baking it into the build would add an image-encoding step to every
 * deploy for a file that is otherwise byte-identical. Run it by hand after
 * editing the copy, then commit the regenerated PNG:
 *
 *   node scripts/generate-og-image.mjs
 *
 * `sharp` is resolved from the local install (it ships with Next) rather than
 * being declared as a dependency, since nothing in the build needs it.
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const W = 1200;
const H = 630;

// Straight from the light palette in app/globals.css, so the card reads as
// the same object as the site itself.
const c = {
  canvas: '#fbfaf7',
  raised: '#f4f1e8',
  ink: '#141210',
  inkSoft: '#3a3630',
  inkFaint: '#605a50',
  rust: '#d1480f',
  rustDeep: '#a83a12',
  navy: '#1d3a63',
};

const DISPLAY = 'Playfair Display, Didot, Georgia, Times New Roman, serif';
const BODY = 'EB Garamond, Georgia, Times New Roman, serif';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="canvas" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.canvas}"/>
      <stop offset="100%" stop-color="${c.raised}"/>
    </linearGradient>
    <radialGradient id="warmth" cx="0.86" cy="0.88" r="0.62">
      <stop offset="0%" stop-color="${c.rust}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${c.rust}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c.rust}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${c.rust}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#canvas)"/>
  <rect width="${W}" height="${H}" fill="url(#warmth)"/>

  <!-- The coastline side-mark the site uses as a visual bookmark. -->
  <rect x="88" y="150" width="3" height="330" fill="url(#rule)"/>

  <!-- Concentric arcs: the "spark" motif from the hero, pushed to the corner
       so it reads as texture rather than an illustration. -->
  <g fill="none" stroke="${c.navy}" stroke-opacity="0.14" stroke-width="2">
    <circle cx="1042" cy="500" r="58"/>
    <circle cx="1042" cy="500" r="96"/>
    <circle cx="1042" cy="500" r="134"/>
  </g>
  <circle cx="1042" cy="500" r="15" fill="${c.rust}" fill-opacity="0.9"/>

  <text x="132" y="168" font-family="${BODY}" font-size="21" letter-spacing="4.6"
        fill="${c.inkFaint}">ABHIRUPAMITRA.COM</text>

  <text x="128" y="286" font-family="${DISPLAY}" font-size="92" fill="${c.ink}">Abhirupa Mitra</text>

  <text x="132" y="348" font-family="${BODY}" font-size="36" font-style="italic"
        fill="${c.inkSoft}">Frontend Engineer at Slack</text>

  <rect x="132" y="396" width="82" height="3" fill="${c.rustDeep}"/>

  <text x="132" y="456" font-family="${BODY}" font-size="30" fill="${c.inkSoft}">Agentic AI interfaces &#183; Frontend for AI</text>
  <text x="132" y="498" font-family="${BODY}" font-size="30" fill="${c.inkSoft}">Design thinking &#183; Slow living</text>

  <text x="132" y="566" font-family="${BODY}" font-size="22" letter-spacing="3.2"
        fill="${c.rustDeep}">A DIGITAL GARDEN</text>
</svg>`;

const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(out, png);
console.log(`Wrote ${out} (${W}x${H}, ${(png.length / 1024).toFixed(1)} kB)`);
