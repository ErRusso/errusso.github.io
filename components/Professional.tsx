import Link from "next/link";
import { labSource, professional } from "@/content/professional";
import { cvHref, type CvTrack } from "@/lib/cv";
import { href, type Lang } from "@/lib/i18n";
import { site } from "@/lib/site";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { NowSection } from "./NowSection";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function CvTrackCard({ lang, track }: { lang: Lang; track: CvTrack }) {
  const variant = professional[lang].cv.tracks[track];
  const dark = track === "fullstack";
  const currentHref = cvHref(track, lang);
  const otherLang: Lang = lang === "en" ? "it" : "en";
  const otherHref = cvHref(track, otherLang);
  const currentLabel = lang === "it" ? "CV italiano" : "CV English";
  const otherLabel = lang === "it" ? "English" : "Italiano";

  return (
    <article
      className={`flex flex-col border border-ink p-4 md:p-5 ${
        dark ? "bg-ink text-paper" : "bg-paper text-ink"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p className={`label ${dark ? "text-violet-soft" : "text-violet"}`}>{variant.label}</p>
        <span className={`label ${dark ? "text-paper/45" : "text-concrete"}`}>
          {track === "fullstack" ? "01" : "02"}
        </span>
      </div>
      <h2 className="mt-3 font-display text-lg font-black uppercase leading-[0.95] tracking-[-0.03em] md:text-xl">
        {variant.cardTitle}
      </h2>
      <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-paper/70" : "text-ink/70"}`}>
        {variant.cardBody}
      </p>
      <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
        {variant.cardBullets.map((bullet) => (
          <li key={bullet} className={`label ${dark ? "text-paper/65" : "text-concrete"}`}>
            · {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
        <a
          href={currentHref}
          download
          className={`group inline-flex items-center gap-2 border px-3 py-2 label transition-colors duration-100 ${
            dark
              ? "border-violet-soft bg-violet-soft text-surface hover:bg-paper hover:border-paper"
              : "border-ink bg-ink text-paper hover:border-violet hover:bg-violet"
          }`}
        >
          {currentLabel}
          <span aria-hidden className="transition-transform duration-100 group-hover:translate-y-0.5">
            ↓
          </span>
        </a>
        <a
          href={otherHref}
          download
          className={`label underline-offset-4 transition-colors duration-100 hover:underline ${
            dark ? "text-paper/60 hover:text-violet-soft" : "text-concrete hover:text-violet"
          }`}
        >
          {otherLabel} ↓
        </a>
      </div>
    </article>
  );
}

function CvInlineLinks({ lang, inverted = false }: { lang: Lang; inverted?: boolean }) {
  const tracks = professional[lang].cv.tracks;
  const fullstack = cvHref("fullstack", lang);
  const appsec = cvHref("appsec", lang);

  const primaryClass = inverted
    ? "label inline-flex items-center gap-2 border border-violet-soft bg-violet-soft px-4 py-2.5 text-surface transition-colors duration-100 hover:border-paper hover:bg-paper"
    : "label inline-flex items-center gap-2 border border-ink bg-ink px-4 py-2.5 text-paper transition-colors duration-100 hover:border-violet hover:bg-violet";
  const secondaryClass = inverted
    ? "label inline-flex items-center gap-2 border border-on-surface/40 px-4 py-2.5 text-on-surface transition-colors duration-100 hover:border-violet-soft hover:text-violet-soft"
    : "label inline-flex items-center gap-2 border border-ink px-4 py-2.5 transition-colors duration-100 hover:bg-ink hover:text-paper";

  return (
    <div className="flex flex-wrap gap-3">
      <a href={fullstack} download className={primaryClass}>
        CV {tracks.fullstack.label}
        <span aria-hidden>↓</span>
      </a>
      <a href={appsec} download className={secondaryClass}>
        CV {tracks.appsec.label}
        <span aria-hidden>↓</span>
      </a>
    </div>
  );
}

function TimelineItem({
  item,
  lang,
}: {
  item: (typeof professional)["en"]["timeline"]["items"][number];
  lang: Lang;
}) {
  return (
    <li className="grid gap-3 border-b border-ink py-7 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10">
      <div>
        <p className="label text-violet">{item.period}</p>
        {item.current ? (
          <span className="label mt-2 inline-block bg-violet px-2 py-1 text-paper">
            {lang === "it" ? "Ora" : "Now"}
          </span>
        ) : null}
      </div>

      <div className="relative md:border-l md:border-ink md:pl-8">
        <span
          aria-hidden
          className="absolute -left-[4.5px] top-1 hidden h-2 w-2 bg-violet md:block"
        />
        <h3 className="font-display text-xl font-black leading-tight tracking-[-0.025em] md:text-2xl">
          {item.title}
        </h3>
        <p className="label mt-1.5 text-concrete">{item.org}</p>
        <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-ink/75 md:text-base">
          {item.body}
        </p>

        {item.tags?.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <li key={tag} className="label border border-ink px-2 py-1.5 text-concrete">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {item.links?.length ? (
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {item.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="link-arrow text-[11px]"
              >
                {link.label} <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </li>
  );
}

export function Professional({ lang }: { lang: Lang }) {
  const t = professional[lang];
  const { shared } = t.cv;

  return (
    <>
      <Header lang={lang} path="/professional" />

      <main id="main">
        <section className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 md:px-8 md:pb-14 md:pt-12">
            <Link
              href={href(lang)}
              prefetch={false}
              className="label inline-flex items-center gap-2 text-concrete transition-colors duration-100 hover:text-violet"
            >
              <span aria-hidden>←</span>
              {lang === "it" ? "Torna alla home" : "Back to home"}
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)] lg:gap-14">
              <div>
                <p className="label text-violet">{t.hero.kicker}</p>
                <h1 className="mt-4 font-display text-[clamp(2.8rem,8.6vw,7.2rem)] font-black uppercase leading-[0.8] tracking-[-0.05em]">
                  Simone
                  <br />
                  Russo<span className="text-violet">.</span>
                </h1>
                <p className="mt-4 font-display text-[clamp(1.05rem,2.4vw,1.8rem)] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
                  {t.hero.role}
                </p>
                <p className="mt-5 max-w-[54ch] text-base leading-relaxed text-ink/80 md:text-lg">
                  {t.hero.intro}
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <CvTrackCard lang={lang} track="fullstack" />
                  <CvTrackCard lang={lang} track="appsec" />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a
                    href={`mailto:${site.email}`}
                    className="label flex items-center gap-2 border-b border-ink pb-0.5 transition-colors duration-100 hover:border-violet hover:text-violet"
                  >
                    {t.hero.emailCta}
                    <span aria-hidden>→</span>
                  </a>
                  <a
                    href={site.github}
                    target="_blank"
                    rel="noreferrer"
                    className="label flex items-center gap-2 border-b border-ink pb-0.5 transition-colors duration-100 hover:border-violet hover:text-violet"
                  >
                    {t.hero.githubCta}
                    <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>

              <aside className="self-start border border-ink bg-paper p-5 md:p-6">
                <p className="label text-violet">{lang === "it" ? "Stato" : "Status"}</p>
                <p className="mt-2 flex items-center gap-2 font-display text-lg font-bold leading-tight">
                  <span aria-hidden className="status-dot" />
                  {t.hero.status}
                </p>
                <p className="mt-1 text-sm text-ink/65">{t.hero.location}</p>

                <dl className="mt-5 grid gap-4 border-t border-ink pt-4 sm:grid-cols-2 lg:grid-cols-1">
                  {t.hero.spec.map((item) => (
                    <div key={item.key}>
                      <dt className="label text-concrete">{item.key}</dt>
                      <dd className="mt-1 font-display text-sm font-bold leading-tight">{item.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 border-t border-ink pt-4">
                  <p className="label text-concrete">{lang === "it" ? "Prova pubblica" : "Public proof"}</p>
                  <a
                    href="#proof"
                    className="mt-2 inline-flex items-center gap-2 font-display text-sm font-bold underline decoration-violet decoration-2 underline-offset-4"
                  >
                    {lang === "it" ? "Lab IDOR, dall'inizio alla fine" : "IDOR lab, end to end"}
                    <span aria-hidden>→</span>
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <NowSection lang={lang} />

        <section id="timeline" className="border-b border-ink">
          <SectionHeading number={t.timeline.number} title={t.timeline.title} intro={t.timeline.intro} />
          <Reveal className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
            <ol>
              {t.timeline.items.map((item) => (
                <TimelineItem key={`${item.period}-${item.title}`} item={item} lang={lang} />
              ))}
            </ol>
          </Reveal>
        </section>

        <section id="skills" className="border-b border-ink">
          <SectionHeading number={t.skills.number} title={t.skills.title} intro={t.skills.intro} />
          <Reveal className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
            <div className="grid gap-px border border-ink bg-ink md:grid-cols-2 lg:grid-cols-3">
              {t.skills.groups.map((group, index) => (
                <article key={group.id} className="bg-paper p-5 md:p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl font-black uppercase leading-none tracking-[-0.03em]">
                      {group.title}
                    </h3>
                    <span className="label text-violet">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">{group.body}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="border border-ink/25 bg-paper-dim px-2 py-1.5 font-mono text-[11px] leading-none tracking-[0.03em]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  {group.links?.length ? (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {group.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target={link.href.startsWith("http") ? "_blank" : undefined}
                          rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                          className="link-arrow text-[11px]"
                        >
                          {link.label} <span aria-hidden>↗</span>
                        </a>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="experience" className="border-b border-ink">
          <SectionHeading number={t.experience.number} title={t.experience.title} intro={t.experience.intro} />
          <Reveal className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
            <div>
              {t.experience.items.map((item) => (
                <article
                  key={`${item.org}-${item.period}`}
                  className="grid gap-4 border-b border-ink py-8 first:pt-0 last:border-b-0 last:pb-0 md:grid-cols-[210px_minmax(0,1fr)] md:gap-10"
                >
                  <div>
                    <p className="label text-violet">{item.period}</p>
                    <p className="label mt-2 max-w-[24ch] text-concrete">{item.meta}</p>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em] md:text-3xl">
                      {item.role}
                    </h3>
                    <p className="label mt-2 text-concrete">{item.org}</p>
                    <p className="mt-4 max-w-[72ch] text-sm leading-relaxed text-ink/75 md:text-base">
                      {item.body}
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {item.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-ink/80">
                          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-violet" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    {item.links?.length ? (
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                        {item.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target={link.href.startsWith("http") ? "_blank" : undefined}
                            rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                            className="link-arrow text-[11px]"
                          >
                            {link.label} <span aria-hidden>↗</span>
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section id="proof" className="border-b border-ink">
          <SectionHeading number={t.proof.number} title={t.proof.title} intro={t.proof.intro} />
          <Reveal className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
            <div className="grid border border-ink lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
              <div className="p-5 md:p-7">
                <p className="label text-violet">{t.proof.kicker}</p>
                <h3 className="mt-3 font-display text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em] md:text-3xl">
                  {t.proof.labTitle}
                </h3>
                <p className="mt-4 max-w-[64ch] text-sm leading-relaxed text-ink/75 md:text-base">
                  {t.proof.labBody}
                </p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {t.proof.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-ink/80">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-violet" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-ink bg-paper-dim p-5 md:p-7 lg:border-l lg:border-t-0">
                <p className="label text-concrete">{lang === "it" ? "Perimetro" : "Scope"}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{t.proof.note}</p>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                  <Link
                    href={href(lang, "/security/lab-idor")}
                    className="link-arrow text-[11px]"
                  >
                    {t.proof.pageCta} <span aria-hidden>→</span>
                  </Link>
                  <a
                    href={labSource}
                    target="_blank"
                    rel="noreferrer"
                    className="link-arrow text-[11px]"
                  >
                    {t.proof.sourceCta} <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="availability" className="border-b border-on-surface/20 bg-surface text-on-surface">
          <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 md:py-16">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:items-end lg:gap-16">
              <div>
                <p className="label text-violet-soft">
                  {t.availability.number} / {t.availability.title}
                </p>
                <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
                  {t.availability.intro}
                </h2>
                <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-on-surface/70">
                  {t.availability.body}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {t.availability.roles.map((role) => (
                    <li
                      key={role}
                      className="border border-on-surface/30 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em]"
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border border-on-surface/25 p-5 md:p-6">
                <p className="label text-violet-soft">{lang === "it" ? "CV e contatti" : "CV & contact"}</p>
                <div className="mt-4">
                  <CvInlineLinks lang={lang} inverted />
                </div>
                <a
                  href={`mailto:${site.email}`}
                  className="label mt-5 flex items-center justify-between gap-4 border-t border-on-surface/20 pt-4 transition-colors duration-100 hover:text-violet-soft"
                >
                  {site.email}
                  <span aria-hidden>→</span>
                </a>
                <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-on-surface/55">
                  {t.availability.note}
                </p>
              </div>
            </div>

            <p className="mt-10 border-t border-on-surface/15 pt-4 label text-on-surface/45">
              {shared.footer}
            </p>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </>
  );
}
