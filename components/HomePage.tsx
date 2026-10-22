import { copy } from "@/content/copy";
import type { Lang } from "@/lib/i18n";
import { About } from "./About";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Marquee } from "./Marquee";
import { NowSection } from "./NowSection";
import { Photography } from "./Photography";
import { Services } from "./Services";
import { WorkList } from "./WorkList";

export function HomePage({ lang }: { lang: Lang }) {
  return (
    <>
      <Header lang={lang} />
      <main id="main">
        <Hero lang={lang} />
        <Marquee items={copy[lang].marquee} />
        <WorkList lang={lang} />
        <Services lang={lang} />
        <About lang={lang} />
        <NowSection lang={lang} />
        <Photography lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  );
}
