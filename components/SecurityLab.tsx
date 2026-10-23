import Link from "next/link";
import { lab, type LabStep } from "@/content/lab";
import { href, type Lang } from "@/lib/i18n";
import { CopyButton } from "./CopyButton";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { IdorSimulator } from "./IdorSimulator";

function SectionHead({
  number,
  kicker,
  title,
  intro,
  invert = false,
}: {
  number: string;
  kicker: string;
  title: string;
  intro: string;
  invert?: boolean;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-[72px_minmax(0,1fr)] md:gap-8">
      <span className={`label-lg md:pt-2 ${invert ? "text-violet-soft" : "text-violet"}`}>{number}</span>
      <div>
        <p className={`label ${invert ? "text-on-surface/45" : "text-concrete"}`}>{kicker}</p>
        <h2 className="mt-3 max-w-[26ch] break-words font-display text-[clamp(1.8rem,4.4vw,3.5rem)] font-black uppercase leading-[0.9] tracking-[-0.035em]">
          {title}
        </h2>
        <p
          className={`mt-4 max-w-[64ch] text-base leading-relaxed ${
            invert ? "text-on-surface/70" : "text-ink/70"
          }`}
        >
          {intro}
        </p>
      </div>
    </div>
  );
}

function CommandBlock({
  step,
  labels,
}: {
  step: LabStep;
  labels: { terminal: string; output: string; copy: string; copied: string };
}) {
  return (
    <div className="min-w-0">
      <div className="border border-on-surface/20 bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-on-surface/15 px-3 py-2">
          <span className="label text-on-surface/40">{labels.terminal}</span>
          <CopyButton value={step.code} label={labels.copy} copied={labels.copied} />
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap break-words px-3 py-3 font-mono text-[11.5px] leading-relaxed text-on-surface/85">
          <code>{step.code}</code>
        </pre>
      </div>
      {step.output ? (
        <div className="mt-2 border border-ink/15 bg-paper px-3 py-2.5">
          <p className="label text-concrete">{labels.output}</p>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-ink/70">
            <code>{step.output}</code>
          </pre>
        </div>
      ) : null}
    </div>
  );
}

function CodeSample({ code, tone }: { code: string; tone: "bad" | "good" }) {
  return (
    <pre className="flex-1 overflow-x-auto whitespace-pre-wrap break-words bg-surface p-4 font-mono text-[11.5px] leading-relaxed text-on-surface/80 sm:text-[12px]">
      <code>
        {code.split("\n").map((line, index) => {
          const marked = line.startsWith("// !") || line.startsWith("// +");
          return (
            <span
              key={index}
              className={`block ${
                marked
                  ? tone === "bad"
                    ? "bg-red/10 text-red"
                    : "bg-violet/20 text-violet-soft"
                  : ""
              }`}
            >
              {line || " "}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

export function SecurityLab({ lang }: { lang: Lang }) {
  const t = lab[lang];

  const anchors = [
    { href: "#simulator", label: t.nav.simulator },
    { href: "#run", label: t.nav.run },
    { href: "#bug", label: t.nav.bug },
    { href: "#test", label: t.nav.test },
  ];

  return (
    <>
      <Header lang={lang} path="/security/lab-idor" />

      <main id="main">
        {/* Hero */}
        <section className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-8 md:px-8 md:pb-14 md:pt-10">
            <Link
              href={href(lang, "/security")}
              prefetch={false}
              className="label inline-flex items-center gap-2 text-concrete transition-colors duration-100 hover:text-violet"
            >
              <span aria-hidden>←</span>
              {t.back}
            </Link>

            <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:gap-14">
              <div>
                <p className="label text-violet">{t.kicker}</p>
                <h1 className="mt-4 max-w-[16ch] break-words font-display text-[clamp(2rem,7vw,5.4rem)] font-black uppercase leading-[0.84] tracking-[-0.045em]">
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

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <a
                    href="#simulator"
                    className="inline-flex items-center gap-3 border border-ink bg-ink px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-paper transition-colors duration-100 hover:border-violet hover:bg-violet"
                  >
                    {t.cta.play} <span aria-hidden>↓</span>
                  </a>
                  <a href="#run" className="link-arrow text-[11px]">
                    {t.cta.run} <span aria-hidden>→</span>
                  </a>
                </div>
              </div>

              <aside className="self-start border border-ink">
                <div className="bg-surface p-5 text-on-surface md:p-6">
                  <p className="label text-red">{t.warningLabel}</p>
                  <p className="mt-3 text-sm leading-relaxed text-on-surface/75">{t.warning}</p>
                </div>
                <dl className="grid grid-cols-2 gap-px bg-ink">
                  {t.facts.map((fact) => (
                    <div key={fact.label} className="bg-paper p-3.5 md:p-4">
                      <dt className="label text-concrete">{fact.label}</dt>
                      <dd className="mt-1.5 break-words font-mono text-[11px] text-ink/80">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </div>
        </section>

        {/* On this page */}
        <nav aria-label={t.onThisPage} className="border-b border-ink bg-paper-dim">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 md:px-8">
            {anchors.map((anchor, index) => (
              <a
                key={anchor.href}
                href={anchor.href}
                className="label whitespace-nowrap text-concrete transition-colors duration-100 hover:text-violet"
              >
                <span className="text-violet">{String(index + 1).padStart(2, "0")}</span>{" "}
                {anchor.label}
              </a>
            ))}
          </div>
        </nav>

        {/* 01 — Simulator */}
        <section id="simulator" className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <SectionHead
              number="01"
              kicker={t.simulator.kicker}
              title={t.simulator.title}
              intro={t.simulator.intro}
            />
            <div className="mt-8">
              <IdorSimulator t={t.simulator} />
            </div>
            <p className="mt-3 font-mono text-[10px] leading-relaxed text-concrete">
              {t.simulationNote}
            </p>
          </div>
        </section>

        {/* 02 — How to run */}
        <section id="run" className="border-b border-ink bg-paper-dim">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <SectionHead
              number="02"
              kicker={t.howto.kicker}
              title={t.howto.title}
              intro={t.howto.intro}
            />

            <ol className="mt-8 border border-ink bg-ink">
              {t.howto.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-5 border-b border-ink bg-paper p-5 last:border-b-0 md:grid-cols-[56px_minmax(0,0.9fr)_minmax(0,1.15fr)] md:gap-6 md:p-6"
                >
                  <span className="label-lg text-violet md:pt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-black uppercase leading-[0.95] tracking-[-0.02em] md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{step.body}</p>
                  </div>
                  <CommandBlock step={step} labels={t.howto} />
                </li>
              ))}
            </ol>

            <p className="mt-6 max-w-[80ch] border-l-2 border-red pl-4 text-sm leading-relaxed text-ink/70">
              {t.howto.hint}
            </p>
          </div>
        </section>

        {/* 03 — The bug */}
        <section id="bug" className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <SectionHead
              number="03"
              kicker={t.bug.kicker}
              title={t.bug.title}
              intro={t.bug.intro}
            />

            <div className="mt-8 grid gap-px border border-ink bg-ink lg:grid-cols-2">
              <article className="flex min-w-0 flex-col bg-paper">
                <div className="flex items-center justify-between gap-3 border-b border-ink bg-surface px-4 py-2.5 text-on-surface">
                  <span className="label text-red">{t.bug.vulnerableLabel}</span>
                  <span aria-hidden className="label text-red">
                    ● 200
                  </span>
                </div>
                <CodeSample code={t.bug.vulnerableCode} tone="bad" />
              </article>

              <article className="flex min-w-0 flex-col bg-paper">
                <div className="flex items-center justify-between gap-3 border-b border-ink bg-surface px-4 py-2.5 text-on-surface">
                  <span className="label text-violet-soft">{t.bug.fixedLabel}</span>
                  <span aria-hidden className="label text-violet-soft">
                    ● 404
                  </span>
                </div>
                <CodeSample code={t.bug.fixedCode} tone="good" />
              </article>
            </div>

            <p className="mt-4 max-w-[78ch] text-sm leading-relaxed text-ink/60">{t.bug.caption}</p>
          </div>
        </section>

        {/* 04 — Impact */}
        <section className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <SectionHead
              number="04"
              kicker={t.impact.kicker}
              title={t.impact.title}
              intro={t.impact.intro}
            />

            <ul className="mt-8 grid gap-px border border-ink bg-ink sm:grid-cols-2">
              {t.impact.items.map((item, index) => (
                <li key={item} className="flex gap-4 bg-paper p-5 md:p-6">
                  <span
                    aria-hidden
                    className="font-display text-2xl font-black leading-none text-violet"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-relaxed text-ink/75">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 05 — Root cause */}
        <section className="border-b border-ink bg-paper-dim">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-start">
            <div>
              <SectionHead
                number="05"
                kicker={t.rootCause.kicker}
                title={t.rootCause.title}
                intro={t.rootCause.intro}
              />
              <p className="mt-6 max-w-[60ch] text-base leading-relaxed text-ink/75">
                {t.rootCause.body}
              </p>
            </div>

            <div className="grid gap-px self-start border border-ink bg-ink sm:grid-cols-2">
              {t.rootCause.checks.map((check) => {
                const pass = check.state === "pass";
                return (
                  <div
                    key={check.title}
                    className={`p-5 md:p-6 ${pass ? "bg-paper" : "bg-surface text-on-surface"}`}
                  >
                    <span className={`label ${pass ? "text-violet" : "text-red"}`}>{check.label}</span>
                    <h3 className="mt-3 font-display text-xl font-black uppercase leading-[0.95] tracking-[-0.02em]">
                      {check.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        pass ? "text-ink/65" : "text-on-surface/65"
                      }`}
                    >
                      {check.body}
                    </p>
                    <p
                      className={`label mt-5 border-t pt-3 ${
                        pass ? "border-ink/20 text-violet" : "border-on-surface/20 text-red"
                      }`}
                    >
                      {check.result}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 06 — Test */}
        <section id="test" className="border-b border-ink">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <SectionHead
              number="06"
              kicker={t.test.kicker}
              title={t.test.title}
              intro={t.test.intro}
            />

            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
              <ul className="border-t border-ink">
                {t.test.assertions.map((item) => (
                  <li key={item} className="flex gap-3 border-b border-ink py-3.5">
                    <span aria-hidden className="pt-px text-violet">
                      ✓
                    </span>
                    <p className="text-sm leading-relaxed text-ink/75">{item}</p>
                  </li>
                ))}
              </ul>

              <div className="min-w-0">
                <div className="border border-on-surface/20 bg-surface">
                  <div className="flex items-center justify-between gap-3 border-b border-on-surface/15 px-3 py-2">
                    <span className="label text-on-surface/55">{t.howto.terminal}</span>
                    <CopyButton value={t.test.code} label={t.howto.copy} copied={t.howto.copied} />
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap break-words px-3 py-3 font-mono text-[11.5px] leading-relaxed">
                    <code>
                      <span className="block text-violet-soft">$ {t.test.code}</span>
                      <span className="mt-2 block text-on-surface/75">{t.test.output}</span>
                    </code>
                  </pre>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{t.test.note}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 07 — Lessons */}
        <section className="border-b border-ink bg-paper-dim">
          <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-14">
            <SectionHead
              number="07"
              kicker={t.lessons.kicker}
              title={t.lessons.title}
              intro={t.lessons.intro}
            />

            <ol className="mt-8 border-t border-ink">
              {t.lessons.items.map((item, index) => (
                <li key={item} className="flex gap-5 border-b border-ink py-4 md:gap-8 md:py-5">
                  <span className="label shrink-0 pt-1 text-violet">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="max-w-[90ch] text-base leading-relaxed text-ink/80">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 08 — Limits + references */}
        <section className="border-b border-ink bg-surface text-on-surface">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 md:px-8 md:py-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div>
              <p className="label text-red">{t.limits.kicker}</p>
              <h2 className="mt-3 max-w-[18ch] font-display text-[clamp(1.7rem,3.6vw,2.8rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]">
                {t.limits.title}
              </h2>
              <p className="mt-5 max-w-[54ch] border-l-2 border-red pl-4 text-sm leading-relaxed text-on-surface/70">
                {t.limits.body}
              </p>
            </div>

            <div>
              <p className="label text-violet-soft">{t.links.kicker}</p>
              <h2 className="mt-3 font-display text-xl font-black uppercase leading-[0.95] tracking-[-0.02em] md:text-2xl">
                {t.links.title}
              </h2>
              <ul className="mt-5 border-t border-on-surface/20">
                {t.links.items.map((item) => (
                  <li key={item.href} className="border-b border-on-surface/20">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-start justify-between gap-4 py-4 transition-colors duration-100 hover:text-violet-soft"
                    >
                      <span>
                        <span className="block font-mono text-[11px] uppercase tracking-[0.12em]">
                          {item.label}
                        </span>
                        <span className="mt-1.5 block text-sm leading-relaxed text-on-surface/55">
                          {item.note}
                        </span>
                      </span>
                      <span aria-hidden className="pt-0.5 text-on-surface/40 group-hover:text-violet-soft">
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-5 py-8 md:px-8">
          <Link
            href={href(lang, "/security")}
            prefetch={false}
            className="label inline-flex items-center gap-2 text-concrete transition-colors duration-100 hover:text-violet"
          >
            <span aria-hidden>←</span>
            {t.back}
          </Link>
          <a href="#simulator" className="label inline-flex items-center gap-2 text-concrete transition-colors duration-100 hover:text-violet">
            {t.nav.simulator} <span aria-hidden>↑</span>
          </a>
        </div>
      </main>

      <Footer lang={lang} />
    </>
  );
}
