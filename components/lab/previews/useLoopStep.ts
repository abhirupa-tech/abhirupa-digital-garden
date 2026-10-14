'use client';

import { useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

/**
 * A looping step counter for tile previews: advances through `delays`
 * (ms before each step), then wraps to 0. Runs only while the tile is on
 * screen; reduced motion pins it at the last step, the finished frame.
 */
export function useLoopStep(delays: number[]) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '120px' });
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const running = inView && !reduce;

  useEffect(() => {
    if (!running) return;
    let timer: ReturnType<typeof setTimeout>;
    const advance = (current: number) => {
      timer = setTimeout(() => {
        const next = current + 1 >= delays.length ? 0 : current + 1;
        setStep(next);
        advance(next);
      }, delays[current]);
    };
    advance(step);
    return () => clearTimeout(timer);
    // Restart only when visibility changes; `step` resumes where it paused.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return { ref, step: reduce ? delays.length - 1 : step, running };
}
