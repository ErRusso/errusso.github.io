import Link from "next/link";
import { copy } from "@/content/copy";
import { projects } from "@/content/projects";
import { href, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Poster } from "./Poster";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function WorkList({ lang }: { lang: Lang }) {
  const t = copy[lang];

  return (
    <section id="work" className="border-b border-ink">
      <SectionHeading number={t.work.number} title={t.work.title} intro={t.work.intro} />

      <ul>
        {projects.map((project, index) => {
          const reversed = index % 2 === 1;
          return (
            <li key={project.slug} className="border-b border-ink last:border-b-0">
              <Link
                href={href(lang, `/work/${project.slug}`)}
                prefetch={false}
                className="group mx-auto grid max-w-[1440px] gap-8 px-5 py-8 md:grid-cols-2 md:gap-12 md:px-8 md:py-12"
              >
                <div className={reversed ? "md:order-2" : ""}>
                  <div className="hard-shadow-violet transition-transform duration-150 ease-linear group-hover:-translate-x-1.5 group-hover:-translate-y-1.5">
                    <Poster project={project} lang={lang} />
                  </div>
                </div>

                <div className={`flex flex-col justify-between gap-6 ${reversed ? "md:order-1" : ""}`}>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink pb-3">
                    <span className="label text-violet">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="label text-concrete">
                      {project.year} · {t.work.status[project.statusKey]}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-[clamp(2.1rem,5vw,4.4rem)] font-black uppercase leading-[0.88] tracking-[-0.045em] transition-colors duration-100 group-hover:text-violet">
                      {project.name[lang]}
                    </h3>
                    <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-ink/80 md:text-lg">
                      {project.copy[lang].summary}
                    </p>
                    <p className="label mt-4 flex items-start gap-2 text-concrete normal-case">
                      <span aria-hidden className="text-violet">
                        →
                      </span>
                      {project.highlight[lang]}
                    </p>
                  </div>

                  <span className="link-arrow self-start">
                    {t.work.read}
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <Reveal className="mx-auto max-w-[1440px] px-5 py-8 md:px-8">
        <a href={site.github} target="_blank" rel="noreferrer" className="link-arrow">
          {t.work.all}
          <span aria-hidden>↗</span>
        </a>
      </Reveal>
    </section>
  );
}
