/**
 * Scaffolds the file-based content structure: one static folder per section
 * under /content, each with 5 placeholder entries. Idempotent — it will NOT
 * overwrite a file that already exists, so real content is safe.
 *
 *   node scripts/scaffold-content.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = join(root, 'content');

// Section slug -> display name + how the 5 entries are typed.
const sections = [
  { slug: 'the-practice', name: 'The Practice', type: () => 'Case Study' },
  { slug: 'field-notes', name: 'Field Notes', type: () => 'Essay' },
  { slug: 'design-thinking', name: 'Design Thinking', type: () => 'Method' },
  {
    slug: 'knowledge-library',
    name: 'Knowledge Library',
    type: (i) => ['Research Paper', 'Blog', 'Book', 'Art', 'Research Paper'][i],
  },
  { slug: 'slow-living', name: 'Slow Living', type: () => 'Journal' },
];

// The same dummy text lives in every entry (per request). Swap later.
const DUMMY_DESCRIPTION =
  'Placeholder summary standing in for the real piece. One or two lines that hint at the idea without giving everything away.';

const DUMMY_BODY = `Placeholder body copy. This is where the full piece will live once Abhirupa
writes it — an essay, a case study, a reading note, or a quiet journal entry.

For now every entry carries the same dummy text so the layouts can be judged on
form, not content. The prose is intentionally neutral: a few unhurried
paragraphs about designing interfaces where AI thinks alongside people, tended
slowly like a garden rather than shipped like a feature.

Replace this file's front matter and body with the real thing when ready.`;

const aspects = ['tall', 'wide', 'square', 'square', 'tall'];

let created = 0;
let skipped = 0;

for (const section of sections) {
  const dir = join(contentDir, section.slug);
  mkdirSync(dir, { recursive: true });

  for (let i = 0; i < 5; i++) {
    const n = String(i + 1).padStart(2, '0');
    const file = join(dir, `piece-${n}.md`);
    if (existsSync(file)) {
      skipped++;
      continue;
    }

    const frontmatter = [
      '---',
      `title: "${section.name} · Piece ${n}"`,
      `section: "${section.slug}"`,
      `type: "${section.type(i)}"`,
      `description: "${DUMMY_DESCRIPTION}"`,
      'tags: ["placeholder", "draft"]',
      'date: "2026-07-04"',
      'cover: ""',
      `aspect: "${aspects[i]}"`,
      'draft: true',
      '---',
      '',
    ].join('\n');

    writeFileSync(file, frontmatter + DUMMY_BODY + '\n', 'utf8');
    created++;
  }
}

console.log(`Content scaffold complete — ${created} created, ${skipped} skipped.`);
