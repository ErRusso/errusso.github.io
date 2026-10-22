import { copy } from "@/content/copy";
import type { Lang } from "@/lib/i18n";
import { Portrait } from "./Portrait";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function About({ lang }: { lang: Lang }) {
  const t = copy[lang].about;

  return (
    <section id="about" className="border-b border-ink">
      <SectionHeading number={t.number} title={t.title} intro={t.intro} />

      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-14 md:px-8 md:py-14">
        <Reveal className="md:max-w-[440px]">
          <Portrait lang={lang} />
        </Reveal>

        <div className="flex flex-col gap-6 md:justify-center md:gap-10">
          <div className="space-y-5">
            {t.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="max-w-[62ch] text-base leading-relaxed md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          <blockquote className="max-w-[54ch] border-l-2 border-violet pl-5">
            <p className="font-display text-lg font-bold leading-snug tracking-[-0.015em] md:text-xl">
              “{t.quote}”
            </p>
          </blockquote>
        </div>
      </div>

      <div className="border-t border-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-8 md:py-8">
          <h3 className="label text-concrete">{t.loadoutTitle}</h3>
          <dl className="mt-4 grid gap-px bg-ink sm:grid-cols-2 md:grid-cols-5">
            {t.loadout.map((item) => (
              <div key={item.key} className="bg-paper px-4 py-4">
                <dt className="label text-violet">{item.key}</dt>
                <dd className="mt-2 font-display text-base font-bold leading-tight tracking-[-0.01em]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
