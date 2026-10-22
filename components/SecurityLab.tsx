import Link from "next/link";
import { lab } from "@/content/lab";
import { href, type Lang } from "@/lib/i18n";
import { Footer } from "./Footer";
import { Header } from "./Header";

function CodeBlock({ code, label, output = false }: { code: string; label?: string; output?: boolean }) {
  return (
    <div className="min-w-0">
      {label ? <p className="label mb-2 text-concrete">{label}</p> : null}
      <pre
        className={`max-w-full overflow-x-auto border border-ink p-4 font-mono text-[12px] leading-relaxed ${
          output ? "bg-paper-dim text-ink" : "bg-ink text-paper"
        }`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function LabSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-ink">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
        <div>
          <p className="label text-violet">{number}</p>
          <h2 className="mt-3 font-display text-2xl font-black uppercase leading-[0.95] tracking-[-0.03em] md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="min-w-0 space-y-4">{children}</div>
      </div>
    </section>
  );
}

export function SecurityLab({ lang }: { lang: Lang }) {
  const t = lab[lang];

  return (
    <>
      <Header lang={lang} path="/security/lab-idor" />

      <main id="main">
        <section className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 md:px-8 md:pb-14 md:pt-12">
            <Link
              href={href(lang, "/security")}
              prefetch={false}
              className="label inline-flex items-center gap-2 text-concrete transition-colors duration-100 hover:text-violet"
            >
              <span aria-hidden>←</span>
              {t.back}
            </Link>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:gap-14">
              <div>
                <p className="label text-violet">{t.kicker}</p>
                <h1 className="mt-4 max-w-[18ch] break-words font-display text-[clamp(1.9rem,7.5vw,5.8rem)] font-black uppercase leading-[0.82] tracking-[-0.045em]">
                  {t.title}
                </h1>
                <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-ink/80 md:text-lg">
                  {t.intro}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {t.chips.map((chip) => (
                    <li key={chip} className="label border border-ink px-2.5 py-1.5 text-concrete">
                      {chip}
                    </li>
                  ))}
                </ul>
              </div>

              <aside className="self-start border border-ink bg-paper p-5 md:p-6">
                <p className="label text-violet">{lang === "it" ? "Avvertenza" : "Warning"}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{t.warning}</p>
                <p className="label mt-5 border-t border-ink pt-4 text-concrete">
                  {lang === "it" ? "Nessun dato reale" : "No real data"}
                </p>
              </aside>
            </div>
          </div>
        </section>

        <LabSection number="01" title={t.scope.title}>
          <p className="text-base leading-relaxed text-ink/80">{t.scope.intro}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {t.scope.items.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink/80">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-violet" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </LabSection>

        <LabSection number="02" title={t.setup.title}>
          <p className="text-base leading-relaxed text-ink/80">{t.setup.intro}</p>
          <CodeBlock code={t.setup.code} label={lang === "it" ? "Terminale" : "Terminal"} />
          <p className="text-sm leading-relaxed text-ink/60">{t.setup.note}</p>
        </LabSection>

        <LabSection number="03" title={t.bug.title}>
          <p className="text-base leading-relaxed text-ink/80">{t.bug.intro}</p>
          <CodeBlock code={t.bug.code} label={lang === "it" ? "Codice vulnerabile" : "Vulnerable code"} />
          <p className="text-sm leading-relaxed text-ink/60">{t.bug.caption}</p>
        </LabSection>

        <LabSection number="04" title={t.reproduction.title}>
          <p className="text-base leading-relaxed text-ink/80">{t.reproduction.intro}</p>
          <div className="grid gap-4 md:grid-cols-2">
            {t.reproduction.steps.map((step) => (
              <CodeBlock key={step.label} code={step.code} label={step.label} />
            ))}
          </div>
          <div>
            <p className="label mb-2 text-concrete">{lang === "it" ? "Output" : "Output"}</p>
            <CodeBlock code={t.reproduction.output} output />
          </div>
          <p className="text-sm leading-relaxed text-ink/60">{t.reproduction.note}</p>
        </LabSection>

        <LabSection number="05" title={t.impact.title}>
          <p className="text-base leading-relaxed text-ink/80">{t.impact.intro}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {t.impact.items.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink/80">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-violet" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </LabSection>

        <LabSection number="06" title={t.rootCause.title}>
          <p className="font-display text-xl font-black uppercase leading-tight tracking-[-0.02em]">
            {t.rootCause.intro}
          </p>
          <p className="text-base leading-relaxed text-ink/80">{t.rootCause.body}</p>
        </LabSection>

        <LabSection number="07" title={t.fix.title}>
          <p className="text-base leading-relaxed text-ink/80">{t.fix.intro}</p>
          <CodeBlock code={t.fix.code} label={lang === "it" ? "Codice corretto" : "Fixed code"} />
          <p className="text-sm leading-relaxed text-ink/60">{t.fix.body}</p>
        </LabSection>

        <LabSection number="08" title={t.test.title}>
          <p className="text-base leading-relaxed text-ink/80">{t.test.intro}</p>
          <CodeBlock code={t.test.code} label={lang === "it" ? "Test" : "Test"} />
          <div>
            <p className="label mb-2 text-concrete">{lang === "it" ? "Output" : "Output"}</p>
            <CodeBlock code={t.test.output} output />
          </div>
          <p className="text-sm leading-relaxed text-ink/60">{t.test.note}</p>
        </LabSection>

        <LabSection number="09" title={t.lessons.title}>
          <ul className="space-y-3">
            {t.lessons.items.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-relaxed text-ink/80">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-violet" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </LabSection>

        <LabSection number="10" title={t.limits.title}>
          <p className="max-w-[72ch] border border-ink bg-paper-dim p-5 text-base leading-relaxed text-ink/80">
            {t.limits.body}
          </p>
        </LabSection>

        <LabSection number="11" title={t.links.title}>
          <ul className="grid gap-px border border-ink bg-ink">
            {t.links.items.map((item) => (
              <li key={item.href} className="bg-paper p-5">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-arrow text-[11px]"
                >
                  {item.label} <span aria-hidden>↗</span>
                </a>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.note}</p>
              </li>
            ))}
          </ul>
        </LabSection>

        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-8">
          <Link
            href={href(lang, "/security")}
            prefetch={false}
            className="label inline-flex items-center gap-2 text-concrete transition-colors duration-100 hover:text-violet"
          >
            <span aria-hidden>←</span>
            {t.back}
          </Link>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
