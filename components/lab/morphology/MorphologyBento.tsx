import { Reveal } from '../../motion/Reveal';
import { StreamingRender } from './StreamingRender';
import { ChatComposer } from './ChatComposer';
import { LoadingButton } from './LoadingButton';
import { AgentThinking } from './AgentThinking';
import { AgentHandoff } from './AgentHandoff';

/**
 * Asymmetric bento of the five agent-state components. A 6-column grid on md+
 * gives an intentionally uneven rhythm: a wide streaming tile leads, the
 * composer and thinking states balance the second row, and the loading button
 * (narrow) sits beside the wider handoff tile. Single column on mobile.
 */
export function MorphologyBento() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
      <Reveal className="md:col-span-4" delay={0.04}>
        <StreamingRender />
      </Reveal>
      <Reveal className="md:col-span-2" delay={0.08}>
        <AgentThinking />
      </Reveal>
      <Reveal className="md:col-span-3" delay={0.12}>
        <ChatComposer />
      </Reveal>
      <Reveal className="md:col-span-3" delay={0.16}>
        <AgentHandoff />
      </Reveal>
      <Reveal className="md:col-span-6" delay={0.2}>
        <LoadingButton />
      </Reveal>
    </div>
  );
}
