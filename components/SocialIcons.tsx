import { site } from '@/lib/site';

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const icons = {
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect {...stroke} x="3" y="3" width="18" height="18" rx="3" />
      <path {...stroke} d="M7 10.5V17M7 7.4v.1M11 17v-3.6c0-1.4 1-2.4 2.3-2.4S16 11.9 16 13.3V17" />
    </svg>
  ),
  medium: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <ellipse {...stroke} cx="7" cy="12" rx="4.5" ry="5" />
      <ellipse {...stroke} cx="16" cy="12" rx="1.8" ry="5" />
      <path {...stroke} d="M21 7.4v9.2" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" className="h-5 w-5">
      <rect {...stroke} x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path {...stroke} d="M4 7.5l8 5.5 8-5.5" />
    </svg>
  ),
};

const socials = [
  { key: 'linkedin' as const, href: site.social.linkedin, label: 'LinkedIn' },
  { key: 'medium' as const, href: site.social.medium, label: 'Medium' },
  { key: 'email' as const, href: site.social.email, label: 'Email' },
];

export function SocialIcons({
  className,
  tone = 'default',
}: {
  className?: string;
  /** 'light' for use on dark backgrounds (e.g. the footer). */
  tone?: 'default' | 'light';
}) {
  const toneClass =
    tone === 'light'
      ? 'text-white/70 hover:text-[#e8c9a0] focus-visible:text-[#e8c9a0]'
      : 'text-parchment-muted hover:text-sand focus-visible:text-sand';
  return (
    <ul className={`flex items-center gap-6 ${className ?? ''}`}>
      {socials.map((s) => (
        <li key={s.key}>
          <a
            href={s.href}
            target={s.key === 'email' ? undefined : '_blank'}
            rel={s.key === 'email' ? undefined : 'noopener noreferrer'}
            aria-label={`Abhirupa Mitra on ${s.label}`}
            className={`inline-flex items-center gap-2 transition-colors duration-500 focus-visible:outline-none ${toneClass}`}
          >
            {icons[s.key]}
            <span className="label text-[0.62rem] text-current">{s.label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
