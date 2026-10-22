import { copy } from "@/content/copy";
import type { Lang } from "@/lib/i18n";
import { Audience } from "./Audience";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Services({ lang }: { lang: Lang }) {
  const t = copy[lang];

  return (
    <section id="services" className="border-b border-ink">
      <SectionHeading number={t.services.number} title={t.services.title} intro={t.services.intro} />

      <Reveal className="mx-auto grid max-w-[1440px] md:grid-cols-3">
        {t.services.items.map((service, index) => {
          const inverted = index === 1;
          return (
            <article
              key={service.id}
              className={[
                "flex flex-col gap-5 border-b border-ink px-5 py-8 md:border-b-0 md:border-r md:px-8 md:py-10",
                index === t.services.items.length - 1 ? "border-b-0 md:border-r-0" : "",
                inverted ? "bg-surface text-on-surface" : "bg-paper",
              ].join(" ")}
            >
              <span className={`label ${inverted ? "text-violet-soft" : "text-violet"}`}>{service.id}</span>
              <h3 className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-black uppercase leading-[0.95] tracking-[-0.02em]">
                {service.title}
              </h3>
              <p className={`text-sm leading-relaxed ${inverted ? "text-on-surface/75" : "text-ink/75"}`}>
                {service.body}
              </p>
              <ul className="mt-auto space-y-2 border-t border-current/20 pt-5">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5 font-mono text-[12px] leading-relaxed">
                    <span aria-hidden className={`text-[13px] font-bold leading-[1.1] ${inverted ? "text-violet-soft" : "text-violet"}`}>
                      →
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </Reveal>

      <Audience lang={lang} />
    </section>
  );
}
