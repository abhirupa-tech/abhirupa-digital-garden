import { zoneById } from '@/lib/data';
import { getEntries } from '@/lib/content';
import { featureFlags } from '@/lib/featureflag';
import { Hero } from '@/components/Hero';
import { SideNav } from '@/components/SideNav';
import { PracticeList } from '@/components/sections/PracticeList';
import { FieldNotesCards } from '@/components/sections/FieldNotesCards';
import { DesignThinkingCollage } from '@/components/sections/DesignThinkingCollage';
import { KnowledgeLibrary } from '@/components/KnowledgeLibrary';
import { Footer } from '@/components/Footer';
import { Sketch } from '@/components/Sketch';

export default function Home() {
  // Content is read from the /content folders at build time.
  const practice = getEntries('the-practice');
  const fieldNotes = getEntries('field-notes');
  const designThinking = getEntries('design-thinking');
  const library = getEntries('knowledge-library');

  return (
    <>
      <SideNav />

      {/* Offset content clear of the fixed full-height nav bar on large screens */}
      <div className="lg:pl-20">
        <Hero />

        <main>
        {/* Row A — two sections share one row: a vertical list beside horizontal cards */}
        <section
          id="the-practice"
          className="zone scroll-mt-24 grid gap-x-14 gap-y-8 pb-8 pt-4 md:grid-cols-12 md:gap-y-14 md:pb-16 md:pt-8"
        >
          <div className="md:col-span-5">
            <PracticeList zone={zoneById['the-practice']} entries={practice} />
          </div>
          <div id="field-notes" className="scroll-mt-24 md:col-span-7">
            <FieldNotesCards zone={zoneById['field-notes']} entries={fieldNotes} />
          </div>
        </section>

        <div className="zone flex justify-center py-1">
          <Sketch name="wave-line" className="h-10 w-36 opacity-40" />
        </div>

        {/* Row B — discovery masonry */}
        <section id="design-thinking" className="zone scroll-mt-24 pb-8 md:pb-16">
          <KnowledgeLibrary zone={zoneById['design-thinking']} entries={designThinking} />
        </section>

        {/* Row C — even, equal-height card row */}
        {featureFlags.showKnowledgeSection && (
          <section id="knowledge-library" className="zone scroll-mt-24 pt-8 md:pt-16">
            <DesignThinkingCollage zone={zoneById['knowledge-library']} entries={library} />
          </section>
        )}
      </main>

        <Footer />
      </div>
    </>
  );
}
