import type { MDXComponents } from 'mdx/types';
import { Heading } from './Heading';
import { Subtitle } from './Subtitle';
import { Paragraph } from './Paragraph';
import { Bold, Italic } from './Emphasis';
import { Quote } from './Quote';
import { Highlight } from './Highlight';
import { Figure } from './Figure';
import { AudioNote } from './AudioNote';
import { Subnote } from './Subnote';
import { Citation } from './Citation';
import { Tag, TagList } from './Tag';
import { Link } from './Link';

export { Heading, Subtitle, Paragraph, Bold, Italic, Quote, Highlight, Figure, AudioNote, Subnote, Citation, Tag, TagList, Link };

/**
 * The MDX component map: standard markdown syntax (`**bold**`, `# heading`,
 * `> quote`, links, …) and explicit JSX tags (`<Quote>`, `<Highlight>`, …)
 * both resolve through this same set, so a piece can mix either freely.
 */
export const typographyComponents: MDXComponents = {
  h1: (props) => <Heading level={2} {...props} />,
  h2: (props) => <Heading level={2} {...props} />,
  p: Paragraph,
  strong: Bold,
  em: Italic,
  blockquote: Quote,
  mark: Highlight,
  a: Link,
  Heading,
  Subtitle,
  Quote,
  Highlight,
  Figure,
  AudioNote,
  Subnote,
  Citation,
  Tag,
  TagList,
};
