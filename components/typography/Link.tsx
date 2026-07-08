import type { ReactNode } from 'react';

type LinkProps = {
  href?: string;
  children: ReactNode;
};

/** Maps markdown's `a`. External links (http/https) open in a new tab. */
export function Link({ href = '#', children }: LinkProps) {
  const external = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="text-sand underline decoration-sand/40 underline-offset-4 transition-colors duration-300 hover:text-sand-soft hover:decoration-sand"
    >
      {children}
    </a>
  );
}
