import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Cormorant_Garamond, EB_Garamond, Quicksand } from 'next/font/google';
import { site } from '@/lib/site';
import './globals.css';

// 4-level serif hierarchy loaded as CSS variables (see tailwind.config.ts).
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap',
  weight: ['400', '500'],
});

// Simple rounded sans — used thin (300) for the section subtext.
const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
  weight: ['300', '400', '500'],
});

export const viewport: Viewport = {
  themeColor: '#08090f',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Agentic AI Interfaces & Frontend for AI | ${site.role}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  applicationName: `${site.name} — Digital Garden`,
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'profile',
    firstName: 'Abhirupa',
    lastName: 'Mitra',
    title: `${site.name} — Agentic AI Interfaces & Frontend for AI`,
    description: site.description,
    url: site.url,
    siteName: `${site.name} — Digital Garden`,
    locale: site.locale,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.role}, designing agentic AI interfaces`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Agentic AI Interfaces & Frontend for AI`,
    description: site.description,
    images: ['/og-image.png'],
  },
  verification: {
    // Add search-console tokens here when available.
  },
};

/**
 * Structured data: Person + WebSite + ProfilePage. This is what lets search
 * engines understand *who* Abhirupa is and connect the target queries to her.
 */
function StructuredData() {
  const person = {
    '@type': 'Person',
    '@id': `${site.url}/#person`,
    name: site.name,
    givenName: 'Abhirupa',
    familyName: 'Mitra',
    url: site.url,
    email: site.email,
    jobTitle: 'Senior Frontend Engineer',
    description: site.description,
    worksFor: {
      '@type': 'Organization',
      name: 'Slack',
      url: 'https://slack.com',
    },
    knowsAbout: [
      'Agentic UI',
      'Agentic AI interfaces',
      'Frontend for AI',
      'Human-AI interaction',
      'UI/UX research',
      'Design thinking',
      'Frontend engineering',
      'Women in technology',
    ],
    sameAs: [site.social.linkedin, site.social.medium],
  };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      person,
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: `${site.name} — Digital Garden`,
        description: site.description,
        publisher: { '@id': `${site.url}/#person` },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${site.url}/#profilepage`,
        url: site.url,
        name: `${site.name} — Agentic AI Interfaces & Frontend for AI`,
        about: { '@id': `${site.url}/#person` },
        isPartOf: { '@id': `${site.url}/#website` },
        inLanguage: 'en-US',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, static content generated at build time.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${garamond.variable} ${quicksand.variable}`}
    >
      <head>
        <StructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
