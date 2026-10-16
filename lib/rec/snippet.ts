/**
 * The console capture snippet, shown in the gateway with a copy button.
 *
 * Paste it into the DevTools console of the app you're testing, trigger a
 * streamed OpenAI Chat Completions response, then run `rec.copy()`.
 *
 * It tees every streamed response (text/event-stream, or any call to
 * /chat/completions): the app reads one branch as normal, the snippet times the
 * other. It records response chunks only — never request headers, bodies or
 * API keys.
 *
 * `copy` is a DevTools console helper that only exists while console code is
 * being evaluated, so the snippet grabs it up front for `rec.copy()` to use
 * later. Where it's missing, rec.copy() prints the JSON to copy by hand.
 */
export const CAPTURE_SNIPPET = `(() => {
  const say = (msg) => console.log('%c● rec%c ' + msg, 'color:#ff3b5c;font-weight:bold', '');
  if (window.rec) return say('already recording. Trigger a streamed response, then run rec.copy()');
  const devtoolsCopy = typeof copy === 'function' ? copy : null;
  const tapes = [];
  const realFetch = window.fetch;
  window.rec = {
    tapes,
    get last() { return tapes[tapes.length - 1]; },
    copy() {
      const last = tapes[tapes.length - 1];
      if (!last) return say('nothing captured yet. Trigger a streamed response first.');
      const json = JSON.stringify(last);
      try {
        if (devtoolsCopy) { devtoolsCopy(json); return say('copied ' + last.chunks.length + ' chunks. Paste them into rec.'); }
      } catch (e) {}
      console.log(json);
      say('right-click the line above, choose "Copy string contents", and paste it into rec.');
    },
  };
  window.fetch = async function (input, init) {
    const t0 = performance.now();
    const res = await realFetch.call(this, input, init);
    const url = typeof input === 'string' ? input : (input && input.url) || String(input);
    const type = res.headers.get('content-type') || '';
    if (!res.body || !(type.includes('event-stream') || /chat\\/completions/.test(url))) return res;
    let where = url;
    try { where = new URL(url, location.href).pathname; } catch (e) {}
    const [mine, theirs] = res.body.tee();
    const capture = { provider: 'openai', t0, chunks: [] };
    const finish = (cutOff) => {
      const n = capture.chunks.length;
      if (!n) return cutOff && say('a stream to ' + where + ' was cancelled before any data arrived. Ignored.');
      tapes.push(capture);
      say((cutOff ? 'the app closed the stream early; kept the ' : 'captured ') + n + ' chunks from ' + where + '. Now run: rec.copy()');
    };
    (async () => {
      const reader = mine.pipeThrough(new TextDecoderStream()).getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          capture.chunks.push({ t: performance.now(), raw: value });
        }
      } catch (e) {
        // Apps often abort their own request once the answer is in (or when
        // they replace it). Keep everything that arrived before the cut.
        return finish(true);
      }
      finish(false);
    })();
    return new Response(theirs, { status: res.status, statusText: res.statusText, headers: res.headers });
  };
  say('recording. Now send a message in your app and let the answer stream in.');
})();`;
