'use client';

/**
 * Light / dark theme switch.
 *
 * The active theme lives as the `dark` class on <html>, set before first
 * paint by the inline no-flash script in app/layout.tsx (which seeds from a
 * saved choice, else the OS / browser preference). This button just flips that
 * class and remembers the explicit choice in localStorage.
 *
 * The icon shown is driven purely by CSS — the moon shows in light mode (tap to
 * go dark), the sun shows in dark mode (tap to go light) — so there's no
 * client/server icon mismatch to reconcile on hydration.
 */
export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle('dark');
    root.style.colorScheme = isDark ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      /* storage may be unavailable (private mode) — the toggle still works */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch light / dark theme"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-secondary-text transition-colors duration-300 hover:bg-hairline hover:text-highlight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-highlight"
    >
      {/* Moon — shown in light mode (tap to switch to dark) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5 dark:hidden"
      >
        <path d="M20 13.5A8 8 0 1 1 10.5 4a6.2 6.2 0 0 0 9.5 9.5Z" />
      </svg>
      {/* Sun — shown in dark mode (tap to switch to light) */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="hidden h-5 w-5 dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
