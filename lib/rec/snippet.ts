/**
 * The console capture snippet, shown in the gateway with a copy button.
 *
 * Paste it into the DevTools console of the app you're testing, trigger a
 * streamed OpenAI Chat Completions response, then run `copy(rec.last)`.
 *
 * It tees every text/event-stream response: the app reads one branch as
 * normal, the snippet times the other. It records response chunks only —
 * never request headers, bodies or API keys.
 */
export const CAPTURE_SNIPPET = `(() => {
  if (window.rec) return console.log('rec: already recording.');
  const tapes = [];
  const realFetch = window.fetch;
  window.rec = { tapes, get last() { return tapes.at(-1); } };
  window.fetch = async function (...args) {
    const t0 = performance.now();
    const res = await realFetch.apply(this, args);
    const type = res.headers.get('content-type') || '';
    if (!type.includes('text/event-stream') || !res.body) return res;
    const [mine, theirs] = res.body.tee();
    const capture = { provider: 'openai', t0, chunks: [] };
    (async () => {
      const reader = mine.pipeThrough(new TextDecoderStream()).getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        capture.chunks.push({ t: performance.now(), raw: value });
      }
      tapes.push(capture);
      console.log('rec: captured ' + capture.chunks.length + ' chunks. Run copy(rec.last), then paste into rec.');
    })().catch((e) => console.warn('rec: capture failed', e));
    return new Response(theirs, { status: res.status, statusText: res.statusText, headers: res.headers });
  };
  console.log('rec: recording. Trigger a streamed response.');
})();`;
