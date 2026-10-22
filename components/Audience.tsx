import { copy } from "@/content/copy";
import type { Lang } from "@/lib/i18n";
import { site } from "@/lib/site";

export function Audience({ lang }: { lang: Lang }) {
  const t = copy[lang].audience;

  return (
    <div className="border-t border-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
        <h3 className="label text-concrete">{t.title}</h3>

        <div className="mt-6 grid gap-px bg-ink md:grid-cols-2">
          {t.tracks.map((track) => (
            <article key={track.subject} className="flex flex-col gap-4 bg-paper p-5 md:p-8">
              <span className="label text-violet">{track.label}</span>
              <h4 className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
                {track.title}
              </h4>
              <p className="max-w-[44ch] text-sm leading-relaxed text-ink/75 md:text-base">{track.body}</p>

              <ul className="mt-1 space-y-2">
                {track.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5 font-mono text-[12px] leading-relaxed">
                    <span aria-hidden className="text-violet">
                      →
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:${site.email}?subject=${encodeURIComponent(track.subject)}`}
                className="group mt-auto flex w-fit items-center gap-4 border border-ink px-4 py-3 transition-colors duration-100 hover:bg-ink hover:text-paper"
              >
                <span className="label">{track.cta}</span>
                <span aria-hidden className="text-base leading-none transition-transform duration-100 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
