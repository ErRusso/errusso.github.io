import Link from "next/link";
import { security } from "@/content/security";
import { href, type Lang } from "@/lib/i18n";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SecurityNotes({ lang }: { lang: Lang }) {
  const t = security[lang];

  const groups = [
    { key: "tested", data: t.tested, chip: "bg-violet" },
    { key: "hardened", data: t.hardened, chip: "bg-ink" },
    { key: "learning", data: t.learning, chip: "border border-concrete" },
  ] as const;

  return (
    <>
      <Header lang={lang} path="/security" />

      <main id="main">
        <section className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 md:px-8 md:pb-14 md:pt-12">
            <Link href={href(lang)} className="label inline-flex items-center gap-2 text-concrete transition-colors duration-100 hover:text-violet">
              <span aria-hidden>←</span>
              {t.back}
            </Link>

            <p className="label mt-10 text-violet">{t.kicker}</p>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,6rem)] font-black uppercase leading-[0.85] tracking-[-0.045em]">
              {t.title}
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-ink/80 md:text-xl">{t.intro}</p>

            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {groups.map((group) => (
                <li key={group.key} className="label flex items-center gap-2">
                  <span aria-hidden className={`h-2.5 w-2.5 ${group.chip}`} />
                  {group.data.title}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-label={t.legend.tested} className="border-b border-ink">
          <div className="mx-auto grid max-w-[1440px] gap-px bg-ink md:grid-cols-3">
            {groups.map((group, index) => (
              <article key={group.key} className="flex flex-col gap-4 bg-paper px-5 py-8 md:px-8 md:py-10">
                <span className="label text-concrete">{String(index + 1).padStart(2, "0")}</span>
                <h2 className="break-words font-display text-xl font-black uppercase tracking-[-0.02em] md:text-2xl xl:text-3xl">
                  {group.data.title}
                </h2>
                <p className="text-sm leading-relaxed text-ink/70">{group.data.intro}</p>
                <ul className="mt-2 space-y-3">
                  {group.data.items.map((item) => (
                    <li key={item} className="flex gap-2.5 text-[13px] leading-relaxed md:text-sm">
                      <span aria-hidden className="mt-[2px] text-violet">
                        →
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="lab" className="border-b border-ink bg-paper-dim">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <div className="grid gap-6 border border-ink bg-paper p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-10 md:p-7">
              <div>
                <p className="label text-violet">{t.lab.kicker}</p>
                <h2 className="mt-3 font-display text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em] md:text-3xl">
                  {t.lab.title}
                </h2>
                <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-ink/75 md:text-base">
                  {t.lab.body}
                </p>
                <p className="label mt-4 text-concrete">{t.lab.note}</p>
              </div>
              <Link
                href={href(lang, "/security/lab-idor")}
                className="link-arrow text-[11px] md:justify-self-end"
              >
                {t.lab.cta} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
              {t.model.title}
            </h2>
            <p className="mt-3 max-w-[56ch] text-base text-ink/70">{t.model.intro}</p>

            <div className="mt-8 grid gap-px bg-ink">
              {t.model.rows.map((row) => (
                <article
                  key={`${row.surface}-${row.threat}`}
                  className="grid gap-3 bg-paper px-4 py-5 md:grid-cols-[0.8fr_1fr_0.5fr_1.4fr] md:items-start md:gap-6 md:px-6"
                >
                  <span className="label text-concrete">{row.surface}</span>
                  <span className="font-display text-base font-bold uppercase leading-tight tracking-[-0.01em]">
                    {row.threat}
                  </span>
                  <span
                    className={`label inline-flex w-fit items-center gap-1.5 border px-2 py-1 ${
                      row.status === "verified" ? "border-violet text-violet" : "border-red text-red"
                    }`}
                  >
                    <span aria-hidden className={`h-1.5 w-1.5 ${row.status === "verified" ? "bg-violet" : "bg-red"}`} />
                    {t.status[row.status]}
                  </span>
                  <span className="text-[13px] leading-relaxed text-ink/70 md:text-sm">{row.evidence}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-ink bg-surface text-on-surface">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
              {t.checks.title}
            </h2>
            <p className="mt-3 max-w-[56ch] text-base text-on-surface/60">{t.checks.intro}</p>

            <ul className="mt-8 grid gap-6 md:grid-cols-3">
              {t.checks.items.map((item) => (
                <li key={item.command} className="border border-on-surface/25 p-4">
                  <code className="block break-words font-mono text-[12px] leading-relaxed text-violet-soft md:text-[13px]">$ {item.command}</code>
                  <p className="mt-3 font-mono text-[12px] leading-relaxed text-on-surface/70">{item.output}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <div className="border-l-2 border-red pl-5">
              <h2 className="font-display text-xl font-black uppercase tracking-[-0.02em] md:text-2xl">{t.limits.title}</h2>
              <p className="mt-3 max-w-[70ch] text-base leading-relaxed text-ink/80">{t.limits.body}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </>
  );
}
