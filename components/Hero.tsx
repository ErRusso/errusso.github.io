import type { CSSProperties } from "react";
import type { Lang } from "@/lib/i18n";
import { copy } from "@/content/copy";
import { now } from "@/lib/now";
import { site } from "@/lib/site";
import { HeroProof, type HeroProofData } from "./HeroProof";

/* Each letter drifts when the word takes the hit. The pattern repeats for
   longer words (IT "rompersi"); values are in em so they scale with the
   clamp() headline. The delays keep the fracture from looking choreographed. */
const BREAK_PIECES = [
  { x: "-0.02em", y: "0.055em", rotate: "-2.4deg", delay: "0ms" },
  { x: "0.025em", y: "-0.045em", rotate: "1.8deg", delay: "14ms" },
  { x: "-0.03em", y: "0.035em", rotate: "2.6deg", delay: "5ms" },
  { x: "0.02em", y: "0.06em", rotate: "-1.7deg", delay: "21ms" },
  { x: "0.032em", y: "-0.03em", rotate: "2deg", delay: "9ms" },
  { x: "-0.024em", y: "-0.05em", rotate: "-2.2deg", delay: "17ms" },
  { x: "0.018em", y: "0.05em", rotate: "1.5deg", delay: "3ms" },
  { x: "-0.016em", y: "-0.032em", rotate: "-1.9deg", delay: "23ms" },
] as const;

function breakStyle(index: number): CSSProperties {
  const piece = BREAK_PIECES[index % BREAK_PIECES.length];
  return {
    "--break-x": piece.x,
    "--break-y": piece.y,
    "--break-rotate": piece.rotate,
    "--break-delay": piece.delay,
  } as CSSProperties;
}

const pipeduckFallback = {
  testFunctions: 29,
  assertions: 431,
  trackedFiles: 86,
  cppKb: 368,
  buildJobs: 4,
};

function proofDate(value: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function Hero({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const stats = now.projectStats?.pipeduck ?? pipeduckFallback;
  const proof: HeroProofData = {
    updated: proofDate(now.updated, lang),
    version: now.release.version,
    buildJobs: stats.buildJobs ?? pipeduckFallback.buildJobs,
    trackedFiles: stats.trackedFiles,
    cppKb: stats.cppKb,
    testFunctions: stats.testFunctions,
    assertions: stats.assertions,
    packages: now.audit.packages,
    vulnerabilities: now.audit.vulnerabilities,
  };

  return (
    <section id="hero" className="border-b border-ink">
      <div className="mx-auto w-full max-w-[1440px] px-5 pb-10 pt-8 md:px-8 md:pb-14 md:pt-12">
        <p className="label flex flex-wrap items-center gap-x-3 gap-y-2 text-concrete">
          <span className="flex items-center gap-2 text-ink">
            <span aria-hidden className="status-dot" />
            {t.hero.badge}
          </span>
          <span aria-hidden className="hidden sm:inline">/</span>
          <span>{t.hero.location}</span>
        </p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">
          <div>
            <h1 className="font-display text-[clamp(2.2rem,6vw,6rem)] font-black uppercase leading-[0.82] tracking-[-0.045em]">
              <span className="block">{t.hero.line1}</span>
              <span className="block">
                {t.hero.line2a}
                <span className="whitespace-nowrap">
                  <span className="sr-only">{t.hero.accent}</span>
                  <span className="hero-break text-violet" aria-hidden="true">
                    {Array.from(t.hero.accent).map((letter, index) => (
                      <span key={index} className="hero-break-letter" style={breakStyle(index)}>
                        {letter}
                      </span>
                    ))}
                  </span>
                  {t.hero.line2b}
                </span>
              </span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed md:text-xl">
              {t.hero.sub}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="group flex items-center justify-between gap-6 border border-ink bg-ink px-5 py-3.5 text-paper transition-colors duration-100 hover:border-violet hover:bg-violet"
              >
                <span className="label">{t.hero.workCta}</span>
                <span aria-hidden className="text-lg leading-none transition-transform duration-100 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-center justify-between gap-6 border border-ink px-5 py-3.5 transition-colors duration-100 hover:bg-ink hover:text-paper"
              >
                <span className="label">{t.hero.emailCta}</span>
                <span aria-hidden className="text-lg leading-none transition-transform duration-100 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>

          <HeroProof lang={lang} copy={t.hero.proof} data={proof} />
        </div>
      </div>
    </section>
  );
}
