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
      <p className="min-h-[4.5em] text-[#e9e4d8]">
        {TOKENS.slice(0, shown).join('')}
        {streaming && <span className="ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-[#f0a35e]" />}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[0.7rem] uppercase tracking-[0.14em] text-[#9aa3ad]">
        <span>tokens {String(shown).padStart(2, '0')}</span>
        <span>renders {String(shown).padStart(2, '0')}</span>
        <span className={streaming ? 'text-[#f0a35e]' : 'text-[#7fc4a8]'}>{streaming ? '● streaming' : '● done'}</span>
      </div>
    </div>
  );
}
