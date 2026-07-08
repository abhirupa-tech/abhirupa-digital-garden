import { zoneById } from '@/lib/data';
import { getEntries } from '@/lib/content';
import { Hero } from '@/components/Hero';
import { SideNav } from '@/components/SideNav';
import { PracticeList } from '@/components/sections/PracticeList';
import { FieldNotesCards } from '@/components/sections/FieldNotesCards';
import { DesignThinkingCollage } from '@/components/sections/DesignThinkingCollage';
import { SlowLivingJournal } from '@/components/sections/SlowLivingJournal';
import { KnowledgeLibrary } from '@/components/KnowledgeLibrary';
import { Footer } from '@/components/Footer';
import { Wave } from '@/components/Wave';
import { Sketch } from '@/components/Sketch';

export default function Home() {
  // Content is read from the /content folders at build time.
  const practice = getEntries('the-practice');
  const fieldNotes = getEntries('field-notes');
  const designThinking = getEntries('design-thinking');
  const library = getEntries('knowledge-library');
  const slowLiving = getEntries('slow-living');

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
          className="zone scroll-mt-24 grid gap-x-14 gap-y-14 pb-12 md:grid-cols-12 md:pb-16"
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

        {/* Row B — even, equal-height card row */}
        <section id="design-thinking" className="zone scroll-mt-24 pb-12 md:pb-16">
          <DesignThinkingCollage zone={zoneById['design-thinking']} entries={designThinking} />
        </section>

        <Wave tone="faint" className="my-2 opacity-70" />

        {/* Row C — discovery masonry */}
        <section id="knowledge-library" className="zone scroll-mt-24 pb-12 md:pb-16">
          <KnowledgeLibrary zone={zoneById['knowledge-library']} entries={library} />
        </section>

        <div className="zone flex justify-end py-1">
          <Sketch name="coastline" className="h-14 w-44 opacity-50" />
        </div>

        {/* Row D — quiet journal */}
        <section id="slow-living" className="zone scroll-mt-24 pb-12 md:pb-16">
          <SlowLivingJournal zone={zoneById['slow-living']} entries={slowLiving} />
        </section>
      </main>

        <Footer />
      </div>
    </>
  );
}
