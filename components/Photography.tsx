import Image from "next/image";
import { copy } from "@/content/copy";
import { photos } from "@/content/photos";
import type { Lang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Photography({ lang }: { lang: Lang }) {
  const t = copy[lang].photography;

  return (
    <section id="photography" className="border-b border-ink">
      <SectionHeading number={t.number} title={t.title} intro={t.intro} />

      <Reveal>
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-px bg-ink md:grid-cols-3">
          {photos.map((photo) => (
            <a
              key={photo.slug}
              href={photo.href}
              target="_blank"
              rel="noreferrer"
              className="group relative block bg-paper"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={photo.src}
                  alt={photo.copy[lang].alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <span
                  aria-hidden
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center border border-on-surface/50 bg-surface/70 text-[12px] text-on-surface opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  ↗
                </span>
              </div>
              <div className="flex flex-col items-start gap-y-1 border-t border-ink px-3 py-2 md:flex-row md:items-center md:justify-between md:gap-x-2">
                <span className="label">{photo.copy[lang].caption}</span>
                <span className="label text-concrete">{photo.date}</span>
              </div>
            </a>
          ))}

          <a
            href={site.instagram}
            target="_blank"
            rel="noreferrer"
            className="group col-span-2 flex min-h-[160px] flex-col justify-between gap-8 bg-accent-solid p-5 text-on-accent transition-colors duration-150 hover:bg-surface md:col-span-1 md:p-6"
          >
            <span className="label flex items-center justify-between text-on-accent/70">
              Instagram
              <span aria-hidden className="text-[12px]">↗</span>
            </span>
            <div>
              <span className="block font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-black uppercase leading-none tracking-[-0.035em]">
                {t.handle}
              </span>
              <span className="label mt-3 flex items-center gap-2 text-on-accent/80">
                {t.follow}
                <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-1.5">
                  →
                </span>
              </span>
            </div>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
