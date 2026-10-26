import type { CSSProperties } from "react";

import { copy } from "@/content/copy";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/i18n";
import { CopyEmail } from "./CopyEmail";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Contact({ lang }: { lang: Lang }) {
  const t = copy[lang].contact;

  return (
    <section id="contact" className="border-b border-ink">
      <SectionHeading number={t.number} title={t.title} intro={t.intro} />

      <Reveal className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-16">
        <p className="max-w-[22ch] font-display text-[clamp(1.6rem,3.6vw,2.8rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
          {t.line}
        </p>

        <div className="mt-10 border-y border-ink">
          <a
            href={`mailto:${site.email}`}
            aria-label={site.email}
            className="contact-link relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-6 pr-3"
          >
            <span aria-hidden className="contact-fill" />
            <span className="contact-email relative font-display text-[clamp(1.45rem,5.6vw,4.2rem)] font-black leading-none tracking-[-0.04em] break-all">
              {Array.from(site.email).map((letter, index) => (
                <span
                  key={index}
                  className="contact-letter"
                  style={{ "--i": index } as CSSProperties}
                >
                  {letter}
                </span>
              ))}
            </span>
            <span aria-hidden className="contact-arrow relative text-3xl leading-none md:text-4xl">
              →
            </span>
          </a>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
          <CopyEmail email={site.email} label={t.copy} copied={t.copied} />
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="label flex items-center gap-2 border-b border-ink pb-0.5 transition-colors duration-100 hover:border-violet hover:text-violet"
          >
            {t.github}
            <span aria-hidden>↗</span>
          </a>
          <span className="label flex items-center gap-2">
            <span aria-hidden className="status-dot" />
            {t.availability}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
