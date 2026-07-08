'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Minimal newsletter capture. Client-side only for the mockup — wire the
 * onSubmit to a real provider (Buttondown, ConvertKit, Resend) when ready.
 */
export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'done'>('idle');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) return;
    // Placeholder: replace with real subscribe call.
    setStatus('done');
  }

  return (
    <div className="max-w-md">
      <AnimatePresence mode="wait">
        {status === 'idle' ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 border-b border-parchment/25 pb-2 focus-within:border-sand/60"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="w-full bg-transparent font-body text-lg text-parchment placeholder:text-parchment-faint/60 focus:outline-none"
            />
            <button
              type="submit"
              className="label whitespace-nowrap text-sand transition-opacity duration-300 hover:opacity-70"
            >
              Subscribe →
            </button>
          </motion.form>
        ) : (
          <motion.p
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-lg italic text-sand"
          >
            Thank you — you’re on the list. Something thoughtful is coming.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
