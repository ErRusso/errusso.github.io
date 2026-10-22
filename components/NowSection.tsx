import Link from "next/link";
import { professional } from "@/content/professional";
import { href, type Lang } from "@/lib/i18n";
import { now, type NowGoal } from "@/lib/now";
import { SectionHeading } from "./SectionHeading";

function formatDate(value: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function Card({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`bg-paper p-5 md:p-6 ${className}`}>
      <p className="label text-violet">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Status({ status, label }: { status: NowGoal["status"]; label: string }) {
  const styles = {
    done: "bg-violet text-paper",
    active: "bg-ink text-paper",
    next: "border border-concrete text-concrete",
  } as const;

  return (
    <span className={`label inline-flex shrink-0 px-2 py-1 ${styles[status]}`}>{label}</span>
  );
}

export function NowSection({ lang, full = false }: { lang: Lang; full?: boolean }) {
  const copy = professional[lang].now;
  const labels = copy.labels;

  return (
    <section id="now" className="border-b border-ink">
      <SectionHeading number={copy.number} title={copy.title} intro={copy.intro} />

      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
        <div
          className={`grid gap-px border border-ink bg-ink ${
            full ? "lg:grid-cols-6" : "md:grid-cols-3"
          }`}
        >
          <Card title={labels.building} className={full ? "lg:col-span-2" : ""}>
            <ul className="space-y-5">
              {(full ? now.building : now.building.slice(0, 2)).map((item) => {
                const itemHref = typeof item.href === "string" ? item.href : item.href?.[lang];
                const external = itemHref?.startsWith("http") ?? false;
                const cta = item.cta?.[lang] ?? "GitHub";

                return (
                  <li key={item.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="font-display text-lg font-bold leading-tight tracking-[-0.02em]">
                        {item.title}
                      </h3>
                      <span className="label text-concrete">{item.meta}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{item.body[lang]}</p>
                    {itemHref ? (
                      <a
                        href={itemHref}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                        className="link-arrow mt-2.5 text-[11px]"
                      >
                        {cta} <span aria-hidden>{external ? "↗" : "→"}</span>
                      </a>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title={labels.release} className={full ? "lg:col-span-2" : ""}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="font-display text-xl font-black uppercase leading-none tracking-[-0.03em]">
                {now.release.name}
              </h3>
              <span className="label text-concrete">{formatDate(now.release.date, lang)}</span>
            </div>
            <p className="mt-2 label text-concrete">{now.release.meta[lang]}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">{now.release.body[lang]}</p>
            <a
              href={now.release.href}
              target="_blank"
              rel="noreferrer"
              className="link-arrow mt-4"
            >
              {lang === "it" ? "Vedi la release" : "See the release"} <span aria-hidden>↗</span>
            </a>
          </Card>

          {full ? (
            <Card title={labels.projects} className="lg:col-span-2">
              <ul className="space-y-5">
                {now.projects.map((project) => (
                  <li key={project.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="font-display text-base font-bold leading-tight tracking-[-0.01em]">
                        {project.label}
                      </h3>
                      <span className="label text-concrete">{formatDate(project.date, lang)}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{project.body[lang]}</p>
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link-arrow mt-2.5 text-[11px]"
                    >
                      {lang === "it" ? "Apri il progetto" : "Open the project"} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {full ? (
            <Card title={labels.goals} className="lg:col-span-3">
              <ul className="grid gap-3 sm:grid-cols-2">
                {now.goals.map((goal) => {
                  const label =
                    goal.status === "done"
                      ? labels.statusDone
                      : goal.status === "active"
                        ? labels.statusActive
                        : labels.statusNext;
                  return (
                    <li
                      key={goal.id}
                      className="flex items-start justify-between gap-3 border-t border-ink/20 pt-3"
                    >
                      <div>
                        <p className="text-sm leading-relaxed">{goal.body[lang]}</p>
                        {goal.date ? (
                          <p className="mt-1 label text-concrete">{formatDate(goal.date, lang)}</p>
                        ) : null}
                      </div>
                      <Status status={goal.status} label={label} />
                    </li>
                  );
                })}
              </ul>
            </Card>
          ) : null}

          <Card title={labels.studying} className={full ? "lg:col-span-3" : ""}>
            <ul className={full ? "grid gap-4 sm:grid-cols-2" : "space-y-4"}>
              {(full ? now.studying : now.studying.slice(0, 2)).map((item) => (
                <li key={item.id}>
                  <h3 className="font-display text-base font-bold leading-tight tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/75">{item.body[lang]}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="label text-concrete">
            {labels.updated}: {formatDate(now.updated, lang)}
          </p>
          {!full ? (
            <Link href={href(lang, "/professional")} prefetch={false} className="link-arrow">
              {labels.all} <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
