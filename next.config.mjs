/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — GitHub Pages serves the `out/` folder as flat files.
  output: 'export',
  // Directory-style URLs (`/section/slug/index.html`) resolve most reliably on
  // static hosts like GitHub Pages.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // The default image optimizer needs a running server; a static export has
    // none. Our images are plain <img> (often already optimized via
    // Cloudinary), so serve them as-authored.
    unoptimized: true,
  },
  // Next.js 16 defaults to Turbopack for both `dev` and `build`. No custom
  // bundler config is needed — the old `webpack()` hook here worked around a
  // webpack-only filesystem-cache memory issue that doesn't apply to
  // Turbopack's (Rust-based) caching.
  turbopack: {},
};

export default nextConfig;
