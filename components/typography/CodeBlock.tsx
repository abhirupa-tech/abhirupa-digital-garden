import type { ReactNode } from 'react';

/**
 * Maps markdown's fenced code blocks (`pre`, wrapping a `code` child). Styled
 * as a macOS Terminal window in "liquid glass": a translucent, heavily
 * blurred body with a soft sheen along the top edge, regardless of the
 * site's light palette, since it reads as its own chrome.
 */
export function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <div className="relative my-10 overflow-hidden rounded-2xl border border-white/15 bg-[#1b1e24]/50 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      {/* Glass sheen — light catching the curved top of the panel */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/[0.02] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      <div className="relative flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]" />
      </div>
      <pre className="relative overflow-x-auto px-5 py-4 font-mono text-[0.92rem] leading-relaxed text-[#e5e7eb]">
        {children}
      </pre>
    </div>
  );
}
