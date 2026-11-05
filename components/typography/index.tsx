import type { MDXComponents } from 'mdx/types';
import { Heading } from './Heading';
import { Subtitle } from './Subtitle';
import { Paragraph } from './Paragraph';
import { Bold, Italic } from './Emphasis';
import { Quote } from './Quote';
import { Figure } from './Figure';
import { AudioNote } from './AudioNote';
import { Subnote } from './Subnote';
import { Citation } from './Citation';
import { Tag, TagList } from './Tag';
import { Link } from './Link';
import { UnorderedList, OrderedList, ListItem } from './List';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import { LinkCard } from './LinkCard';
import { Stat, StatRow } from './Stat';

export { Heading, Subtitle, Paragraph, Bold, Italic, Quote, Figure, AudioNote, Subnote, Citation, Tag, TagList, Link, UnorderedList, OrderedList, ListItem, CodeBlock, Callout, LinkCard, Stat, StatRow };

/**
 * The MDX component map: standard markdown syntax (`**bold**`, `# heading`,
 * `> quote`, links, …) and explicit JSX tags (`<Quote>`, `<Callout>`, …)
 * both resolve through this same set, so a piece can mix either freely.
 */
export const typographyComponents: MDXComponents = {
  h1: (props) => <Heading level={2} className="mt-12 mb-3 first:mt-0 sm:mt-14 sm:mb-4" {...props} />,
  h2: (props) => <Heading level={2} className="mt-12 mb-3 first:mt-0 sm:mt-14 sm:mb-4" {...props} />,
  h3: (props) => <Heading level={3} className="mt-12 mb-3 first:mt-0 sm:mt-14 sm:mb-4" {...props} />,
  p: Paragraph,
  strong: Bold,
  em: Italic,
  blockquote: Quote,
  // Highlights were retired: a stray <mark> renders as plain text.
  mark: ({ children }) => <>{children}</>,
  a: Link,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  pre: CodeBlock,
  Heading,
  Subtitle,
  Quote,
  Figure,
  AudioNote,
  Subnote,
  Citation,
  Tag,
  TagList,
  Callout,
  LinkCard,
  Stat,
  StatRow,
};
