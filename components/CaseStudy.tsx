import Link from "next/link";
import { copy } from "@/content/copy";
import { getNextProject, type Project } from "@/content/projects";
import { href, type Lang } from "@/lib/i18n";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Poster } from "./Poster";
import { Reveal } from "./Reveal";

export function CaseStudy({ lang, project }: { lang: Lang; project: Project }) {
  const t = copy[lang];
  const content = project.copy[lang];
  const next = getNextProject(project.slug);
  const evidenceCount = project.evidence[lang].length;
  const evidenceCols =
    evidenceCount === 2
      ? "md:grid-cols-2"
      : evidenceCount === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-4";

  const facts = [
    { key: t.caseStudy.facts.client, value: project.client[lang] },
    { key: t.caseStudy.facts.role, value: project.role[lang] },
    { key: t.caseStudy.facts.year, value: project.year },
    { key: t.caseStudy.facts.status, value: t.work.status[project.statusKey] },
  ];

  return (
    <>
      <Header lang={lang} path={`/work/${project.slug}`} />

      <main id="main">
        <article>
          <header className="border-b border-ink">
            <div className="mx-auto max-w-[1440px] px-5 pt-8 md:px-8 md:pt-10">
              <Link href={`${href(lang)}#work`} className="label-lg inline-flex items-center gap-2 text-[11px] text-concrete transition-colors duration-100 hover:text-violet">
                <span aria-hidden>←</span>
                {t.caseStudy.back}
              </Link>

              <div className="mt-10 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-ink pb-3">
                <span className="label text-violet">{project.kicker[lang]}</span>
                <span className="label text-concrete">{project.year}</span>
              </div>

              <h1 className="mt-6 font-display text-[clamp(2.6rem,7.6vw,6.5rem)] font-black uppercase leading-[0.85] tracking-[-0.045em]">
                {project.name}
              </h1>

              <p className="mt-6 max-w-[56ch] text-lg leading-relaxed md:text-xl">{content.tagline}</p>
            </div>

            <dl className="mx-auto mt-10 grid max-w-[1440px] grid-cols-2 border-t border-ink md:grid-cols-4">
              {facts.map((fact, index) => (
                <div
                  key={fact.key}
                  className={[
                    "border-ink px-5 py-4 md:px-8",
                    index % 2 === 1 ? "border-l" : "",
                    index >= 2 ? "border-t md:border-t-0" : "",
                    index > 0 ? "md:border-l" : "",
                  ].join(" ")}
                >
                  <dt className="label text-concrete">{fact.key}</dt>
                  <dd className="mt-2 font-display text-base font-bold uppercase leading-tight tracking-[-0.01em] md:text-lg">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <Reveal>
              <div className="hard-shadow-violet">
                <Poster project={project} lang={lang} size="hero" />
              </div>
            </Reveal>

            <section aria-label={t.caseStudy.evidence} className="mt-12 md:mt-16">
              <h2 className="label text-concrete">{t.caseStudy.evidence}</h2>
              <dl className={`mt-3 grid grid-cols-2 gap-px bg-ink ${evidenceCols}`}>
                {project.evidence[lang].map((item) => (
                  <div key={item.label} className="bg-paper px-4 py-4 md:px-5 md:py-5">
                    <dt className="font-display text-[clamp(1.1rem,2vw,1.9rem)] font-black leading-none tracking-[-0.03em] normal-case">
                      {item.value}
                    </dt>
                    <dd className="label mt-2 text-concrete">{item.label}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] md:gap-14">
              <aside className="h-fit md:sticky md:top-24">
                <h2 className="label text-concrete">{t.caseStudy.stack}</h2>
                <ul className="mt-3 flex flex-wrap gap-2 md:flex-col md:items-start">
                  {project.stack.map((tech) => (
                    <li key={tech} className="label border border-ink px-2 py-1 text-ink/75">
                      {tech}
                    </li>
                  ))}
                </ul>

                {project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="link-arrow mt-6"
                  >
                    {t.caseStudy.repo}
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
              </aside>

              <div className="space-y-12 md:space-y-14">
                {content.sections.map((section, index) => (
                  <section key={section.title}>
                    <div className="flex items-baseline gap-4 border-b border-ink pb-3">
                      <span className="label text-violet">{String(index + 1).padStart(2, "0")}</span>
                      <h2 className="font-display text-xl font-black uppercase tracking-[-0.02em] md:text-2xl">
                        {section.title}
                      </h2>
                    </div>
                    <p className="mt-5 max-w-[66ch] text-base leading-relaxed md:text-lg">{section.body}</p>
                  </section>
                ))}

                <div className="border border-ink bg-surface px-6 py-6 text-on-surface">
                  <span className="label text-violet-soft">{t.caseStudy.result}</span>
                  <p className="mt-2 font-display text-xl font-black uppercase leading-tight tracking-[-0.02em] md:text-2xl">
                    {content.result}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link href={href(lang, `/work/${next.slug}`)} prefetch={false} className="group block border-t border-ink">
            <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-10 md:px-8">
              <span className="label text-concrete">{t.caseStudy.next}</span>
              <span className="font-display text-[clamp(2rem,6vw,4.5rem)] font-black uppercase leading-none tracking-[-0.04em] transition-colors duration-100 group-hover:text-violet">
                {next.name}
                <span aria-hidden className="ml-3 inline-block transition-transform duration-150 group-hover:translate-x-2">
                  →
                </span>
              </span>
            </div>
          </Link>
        </article>
      </main>

      <Footer lang={lang} />
    </>
  );
}
