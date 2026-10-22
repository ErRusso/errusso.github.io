import { professional } from "@/content/professional";
import type { CvTrack } from "@/lib/cv";
import type { Lang } from "@/lib/i18n";
import { site } from "@/lib/site";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-2 flex items-center gap-2 border-b border-ink pb-1.5 font-display text-[10pt] font-black uppercase leading-none tracking-[-0.01em]">
      <span aria-hidden className="h-[2.5mm] w-[2.5mm] shrink-0 bg-violet" />
      {children}
    </h2>
  );
}

export function CvDocument({ lang, track }: { lang: Lang; track: CvTrack }) {
  const { shared, tracks } = professional[lang].cv;
  const cv = tracks[track];
  const year = new Intl.DateTimeFormat("en", {
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(new Date());

  return (
    <main className="cv-screen flex min-h-screen justify-start overflow-x-auto px-4 py-8 lg:justify-center print:block print:min-h-0 print:overflow-visible print:p-0">
      <article className="cv-sheet font-sans text-[9.5pt] leading-[1.4] shadow-[10px_10px_0_0_#0b0b0c] print:shadow-none">
        <header className="border-b-2 border-ink pb-3.5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="label text-concrete">
                {`Curriculum vitae · ${year}`}
              </p>
              <h1 className="mt-2 font-display text-[31pt] font-black uppercase leading-[0.8] tracking-[-0.045em]">
                Simone
                <br />
                Russo<span className="text-violet">.</span>
              </h1>
              <p className="mt-2.5 font-display text-[10.5pt] font-bold uppercase leading-tight tracking-[-0.01em]">
                {cv.role}
              </p>
            </div>

            <div className="w-[60mm] shrink-0 border-l-2 border-violet pl-4 text-[8pt] leading-[1.55]">
              <p className="label text-violet">
                {lang === "it" ? "Contatti" : "Contact"}
              </p>
              <p className="mt-2">
                <a href={`mailto:${site.email}`} className="underline decoration-violet underline-offset-2">
                  {site.email}
                </a>
              </p>
              <p>
                <a href={site.url} className="underline decoration-violet underline-offset-2">
                  errusso.github.io
                </a>
              </p>
              <p>
                <a href={site.github} className="underline decoration-violet underline-offset-2">
                  github.com/ErRusso
                </a>
              </p>
              <p className="mt-2 text-ink/70">{lang === "it" ? "Italia · remoto (fuso UE)" : "Italy · remote (EU timezone)"}</p>
            </div>
          </div>
        </header>

        <div className="mt-4 grid grid-cols-[1fr_60mm] gap-6">
          <div>
            <section>
              <SectionTitle>{shared.profileTitle}</SectionTitle>
              <p className="text-[9.5pt] leading-[1.5]">{cv.profile}</p>
            </section>

            <section className="mt-4">
              <SectionTitle>{shared.experienceTitle}</SectionTitle>
              <div className="space-y-3.5">
                {cv.experience.map((item) => (
                  <article key={`${item.org}-${item.period}`} className="break-inside-avoid border-l border-ink/25 pl-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                      <h3 className="font-display text-[10pt] font-bold leading-tight tracking-[-0.01em]">
                        {item.role}
                      </h3>
                      <span className="label text-concrete">{item.period}</span>
                    </div>
                    <p className="mt-0.5 font-display text-[9pt] font-semibold leading-tight">{item.org}</p>
                    <p className="mt-0.5 text-[8.3pt] leading-[1.4] text-ink/65">{item.meta}</p>
                    <ul className="mt-1.5 space-y-1">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-1.5 text-[8.9pt] leading-[1.45]">
                          <span aria-hidden className="mt-[0.52em] h-1 w-1 shrink-0 bg-violet" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    {item.links?.length ? (
                      <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[8.3pt]">
                        {item.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            className="underline decoration-violet underline-offset-2"
                          >
                            {link.label}
                          </a>
                        ))}
                      </p>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section>
              <SectionTitle>{shared.skillsTitle}</SectionTitle>
              <dl className="space-y-1.5">
                {cv.skills.map((skill) => (
                  <div key={skill.label}>
                    <dt className="label text-violet">{skill.label}</dt>
                    <dd className="text-[8.5pt] leading-[1.4]">{skill.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <SectionTitle>{shared.educationTitle}</SectionTitle>
              <div className="space-y-2.5">
                {shared.education.map((item) => (
                  <div key={`${item.org}-${item.period}`}>
                    <p className="label text-concrete">{item.period}</p>
                    <h3 className="mt-0.5 font-display text-[9pt] font-bold leading-tight">{item.title}</h3>
                    <p className="text-[8.5pt] leading-[1.35]">{item.org}</p>
                    <p className="text-[8.3pt] leading-[1.35] text-ink/65">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle>{shared.linksTitle}</SectionTitle>
              <ul className="space-y-1">
                {shared.links.map((link) => (
                  <li key={link.href} className="text-[8.5pt] leading-[1.4]">
                    <a href={link.href} className="underline decoration-violet underline-offset-2">
                      {link.label}
                    </a>
                    <span className="text-ink/55">
                      {" — "}
                      {link.href.startsWith("mailto:")
                        ? link.href.slice("mailto:".length)
                        : link.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t-2 border-violet pt-2">
              <h2 className="label text-violet">{shared.availabilityTitle}</h2>
              <p className="mt-1 text-[8.8pt] font-semibold leading-[1.4]">{cv.availability}</p>
              <p className="mt-1.5 text-[8pt] leading-[1.4] text-ink/70">{shared.languages}</p>
            </section>
          </aside>
        </div>

        <footer className="mt-4 flex items-center justify-between gap-4 border-t border-ink pt-2 text-[7.5pt] text-ink/60">
          <span>{shared.footer}</span>
          <span className="label text-violet">SR / {year}</span>
        </footer>
      </article>
    </main>
  );
}
