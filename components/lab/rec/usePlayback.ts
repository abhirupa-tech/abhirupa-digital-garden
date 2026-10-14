'use client';

import { useMotionValue } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Tape } from '@/lib/rec/tape';

/**
 * In-page preview: plays a tape with its recorded timing, no network.
 *
 * Text and the elapsed counter live in motion values, which framer-motion
 * writes to the DOM once per animation frame. A fast tape can emit many
 * deltas per frame without re-rendering React, so the page never janks.
 */
export function usePlayback() {
  const text = useMotionValue('');
  const elapsed = useMotionValue('0.00 s');
  const [playing, setPlaying] = useState(false);
  const controller = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
    setPlaying(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    text.set('');
    elapsed.set('0.00 s');
  }, [stop, text, elapsed]);

  const play = useCallback(
    async (tape: Tape, speed: number) => {
      controller.current?.abort();
      const ac = new AbortController();
      controller.current = ac;
      text.set('');
      setPlaying(true);

      const start = performance.now();
      const tick = () => {
        if (ac.signal.aborted) return;
        elapsed.set(`${((performance.now() - start) / 1000).toFixed(2)} s`);
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      try {
        await sleep(tape.f / speed, ac.signal);
        let out = '';
        for (const [gap, delta] of tape.c) {
          await sleep(gap / speed, ac.signal);
          out += delta;
          text.set(out);
        }
        elapsed.set(`${((performance.now() - start) / 1000).toFixed(2)} s`);
      } catch {
        return; // stopped
      }
      if (controller.current === ac) {
        ac.abort(); // ends the counter loop
        controller.current = null;
        setPlaying(false);
      }
    },
    [text, elapsed],
  );

  useEffect(() => () => controller.current?.abort(), []);

  return { text, elapsed, playing, play, stop, reset };
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    if (ms <= 0) return resolve();
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}
