/**
 * A sample capture, shaped exactly like what the console snippet produces from
 * an OpenAI Chat Completions stream, so the gateway can be tried without an app.
 */
const ANSWER =
  'Streams never repeat, but tapes do. Record a response once, then replay it in every test run with the same chunks and the same timing.';

export function sampleCapture(): string {
  const event = (delta: Record<string, string>, finish: string | null = null) =>
    `data: ${JSON.stringify({
      id: 'chatcmpl-sample',
      object: 'chat.completion.chunk',
      created: 1760400000,
      model: 'gpt-4.1-mini',
      choices: [{ index: 0, delta, finish_reason: finish }],
    })}\n\n`;

  const t0 = 1000;
  let t = t0 + 420;
  const chunks = [{ t, raw: event({ role: 'assistant', content: '' }) }];
  for (const [i, token] of (ANSWER.match(/\S+\s*/g) ?? []).entries()) {
    // A believable rhythm: mostly 20–60 ms, with the odd longer think.
    t += 20 + ((i * 37) % 41) + (i % 9 === 8 ? 140 : 0);
    chunks.push({ t, raw: event({ content: token }) });
  }
  chunks.push({ t: t + 4, raw: event({}, 'stop') + 'data: [DONE]\n\n' });

  return JSON.stringify({ provider: 'openai', t0, chunks }, null, 2);
}
