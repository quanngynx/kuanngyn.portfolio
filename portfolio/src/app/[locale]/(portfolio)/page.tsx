import ManifestoFlow from "@/common/components/effects/manifesto-flow";
import { Hero } from "@/common/components/organisms/hero";
import { About } from "@/common/components/organisms/about";
import { Stack } from "@/common/components/organisms/stack";
import { Projects } from "@/common/components/organisms/projects";
import { Roadmap } from "@/common/components/organisms/roadmap";
import { Contact } from "@/common/components/organisms/contact";
import { ScrollProgress } from "@/common/components/atoms/scroll/scroll-progress";

export default function Home() {
  return (
    <>
      <ScrollProgress />

      <main className="relative bg-background">
        <div className="mx-4 mt-4 mb-8 rounded-[2rem] bg-[#1f2937]">
          <Hero />
        </div>

        <div className="relative z-10 border-t border-border bg-background">
          <section id="about">
            <About />
          </section>

          <ManifestoFlow />

          <section id="stack">
            <Stack />
          </section>

          <ManifestoFlow reverse />

          <section id="projects">
            <Projects />
          </section>

          <ManifestoFlow />

          <section id="roadmap">
            <Roadmap />
          </section>

          <ManifestoFlow reverse />

          <section id="contact">
            <Contact />
          </section>
        </div>
      </main>
    </>
  );
}
