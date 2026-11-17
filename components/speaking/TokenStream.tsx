'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const TOKENS =
  'Streaming tokens land faster than React can paint, so we batch them into frames instead of re-rendering on every chunk.'.split(
    /(?<= )/,
  );

/**
 * A tiny fake LLM stream: tokens arrive one by one, a render-count ticks up
 * beside them, then the line resets. Decoration for the MockGPT placeholder —
 * it hints at what the analyzer measures. Static (full sentence) under
 * reduced motion.
 */
export function TokenStream() {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setN((c) => (c >= TOKENS.length + 8 ? 0 : c + 1));
    }, 140);
    return () => window.clearInterval(id);
  }, [reduce]);

  const shown = reduce ? TOKENS.length : Math.min(n, TOKENS.length);
  const streaming = shown < TOKENS.length;

  return (
    <div aria-hidden="true" className="font-mono text-[0.8rem] leading-relaxed">
      <p className="min-h-[4.5em] text-pastel-ink">
        {TOKENS.slice(0, shown).join('')}
        {streaming && <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-pastel-peach" />}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-pastel-ink/10 pt-3 text-[0.7rem] uppercase tracking-[0.14em] text-pastel-ink/55">
        <span>tokens {String(shown).padStart(2, '0')}</span>
        <span>renders {String(shown).padStart(2, '0')}</span>
        <span className={streaming ? 'text-[#c77a4e] dark:text-[#e8b08c]' : 'text-[#5f8a6f] dark:text-[#a8c9b2]'}>{streaming ? '● streaming' : '● done'}</span>
      </div>
    </div>
  );
}
