/**
 * Static feature flags — flip a value here to toggle a feature sitewide.
 * Read at build time, no remote config.
 */
export const featureFlags = {
  showNewsletterSection: false,
} as const;
