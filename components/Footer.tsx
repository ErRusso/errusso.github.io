import { copy } from "@/content/copy";
import type { Lang } from "@/lib/i18n";
import { href } from "@/lib/i18n";
import { site } from "@/lib/site";
import { LapTime } from "./LapTime";
import { LocalTime } from "./LocalTime";
import { Piano } from "./Piano";

export function Footer({ lang }: { lang: Lang }) {
  const t = copy[lang].footer;
  const contact = copy[lang].contact;
  const nav = copy[lang].nav;

  const linkClass =
    "label border-b border-on-surface/20 pb-0.5 text-on-surface/70 transition-colors duration-100 hover:border-violet-soft hover:text-violet-soft";

  return (
    <footer className="bg-surface text-on-surface">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 md:grid-cols-[1.2fr_0.8fr_1fr] md:px-8">
        <div>
          <p className="font-display text-2xl font-black uppercase leading-none tracking-[-0.035em]">
            Simone
            <span className="ml-0.5 inline-block bg-violet-soft px-1 leading-[0.92] text-surface">Russo</span>
          </p>
          <p className="mt-4 max-w-[40ch] font-mono text-[11px] leading-relaxed tracking-[0.06em] text-on-surface/60">
            {t.built}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col items-start gap-3">
          <a href={`mailto:${site.email}`} className={linkClass}>
            {site.email}
          </a>
          <a href={site.github} target="_blank" rel="noreferrer" className={linkClass}>
            GitHub ↗
          </a>
          <a href={href(lang, "/security")} className={linkClass}>
            {nav.security}
          </a>
          <a href={href(lang, "/professional")} className={linkClass}>
            {nav.cv}
          </a>
          <a href={`${href(lang)}#photography`} className={linkClass}>
            {nav.photos}
          </a>
          <a href={site.repo} target="_blank" rel="noreferrer" className={linkClass}>
            {t.source} ↗
          </a>
        </nav>

        <div className="flex flex-col items-start gap-3">
          <LapTime label={t.lap} />
          <LocalTime label={contact.localTime} timeZone={site.timeZone} />
          <div className="hidden md:block">
            <Piano label={t.piano} onLabel={t.pianoOn} hint={t.pianoHint} />
          </div>
        </div>
      </div>

      <div className="border-t border-on-surface/15">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8">
          <span className="label text-on-surface/60">{t.rights}</span>
          <a
            href="#top"
            className="label text-on-surface/60 transition-colors duration-100 hover:text-violet-soft"
          >
            {t.top} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
