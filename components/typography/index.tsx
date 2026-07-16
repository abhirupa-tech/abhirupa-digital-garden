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
import { UnorderedList, OrderedList, ListItem } from './List';

export { Heading, Subtitle, Paragraph, Bold, Italic, Quote, Highlight, Figure, AudioNote, Subnote, Citation, Tag, TagList, Link, UnorderedList, OrderedList, ListItem };

/**
 * The MDX component map: standard markdown syntax (`**bold**`, `# heading`,
 * `> quote`, links, …) and explicit JSX tags (`<Quote>`, `<Highlight>`, …)
 * both resolve through this same set, so a piece can mix either freely.
 */
export const typographyComponents: MDXComponents = {
  h1: (props) => <Heading level={2} className="mt-20 mb-5 first:mt-0" {...props} />,
  h2: (props) => <Heading level={2} className="mt-20 mb-5 first:mt-0" {...props} />,
  h3: (props) => <Heading level={3} className="mt-14 mb-4" {...props} />,
  p: Paragraph,
  strong: Bold,
  em: Italic,
  blockquote: Quote,
  mark: Highlight,
  a: Link,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
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
