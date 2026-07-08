/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Bundling is handled by webpack (not Turbopack). `next dev` / `next build`
  // use webpack by default here; this hook makes that explicit and is the
  // place to customize the bundle.
  webpack: (config, { dev }) => {
    if (dev) {
      // In memory-constrained environments the default filesystem cache
      // (PackFileCacheStrategy) can fail to allocate its pack buffer
      // ("Array buffer allocation failed"), which leaves compiled chunks
      // unemitted — the browser 404s on main-app.js / page.js and hydration
      // breaks with a dev-overlay error. In-memory caching skips that large
      // serialization and keeps dev output consistent.
      config.cache = { type: 'memory' };
    }
    return config;
  },
};

export default nextConfig;
