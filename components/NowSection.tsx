import Link from "next/link";
import { professional } from "@/content/professional";
import { href, type Lang } from "@/lib/i18n";
import { now, type NowIssue } from "@/lib/now";
import { SectionHeading } from "./SectionHeading";

function formatDate(value: string, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

function IssueList({
  title,
  marker,
  items,
  empty,
  lang,
}: {
  title: string;
  marker: string;
  items: NowIssue[];
  empty: string;
  lang: Lang;
}) {
  return (
    <div className="bg-paper">
      <div className="flex items-baseline justify-between gap-3 border-b border-ink px-5 py-3 md:px-6">
        <p className="label text-violet">{title}</p>
        <p className="label text-concrete">{String(items.length).padStart(2, "0")}</p>
      </div>

      {items.length === 0 ? (
        <p className="px-5 py-5 text-sm leading-relaxed text-ink/60 md:px-6">{empty}</p>
      ) : (
        <ul className="px-5 py-4 md:px-6">
          {items.map((issue) => (
            <li
              key={issue.id}
              className="border-t border-ink/20 py-3 first:border-t-0 first:pt-0 last:pb-0"
            >
              <a href={issue.href} target="_blank" rel="noreferrer" className="group flex gap-3">
                <span aria-hidden className="label mt-0.5 shrink-0 text-concrete">
                  {marker}
                </span>
                <span>
                  <span className="block text-sm leading-relaxed group-hover:underline">
                    {issue.title}
                  </span>
                  <span className="mt-1 block label text-concrete">
                    {issue.repo} #{issue.number} · {formatDate(issue.date, lang)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NowSection({ lang, full = false }: { lang: Lang; full?: boolean }) {
  const copy = professional[lang].now;
  const labels = copy.labels;
  const repos = now.repos.slice(0, 3);
  const done = full ? now.issues.done : now.issues.done.slice(0, 3);
  const next = full ? now.issues.next : now.issues.next.slice(0, 3);

  return (
    <section id="now" className="border-b border-ink">
      <SectionHeading number={copy.number} title={copy.title} intro={copy.intro} />

      <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
        <div className="border border-ink">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-ink px-5 py-3 md:px-6">
            <p className="label text-violet">{labels.repos}</p>
            <p className="label text-concrete">{labels.reposNote}</p>
          </div>

          <ol className="grid gap-px bg-ink md:grid-cols-3">
            {repos.map((repo, index) => (
              <li key={repo.id} className="flex flex-col bg-paper p-5 md:p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="label text-violet">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="label text-concrete">{repo.language}</p>
                </div>

                <h3 className="mt-4 font-display text-xl font-black uppercase leading-none tracking-[-0.03em]">
                  {repo.name}
                </h3>
                <p className="mt-1.5 label text-concrete">
                  {labels.lastPush} {formatDate(repo.date, lang)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{repo.body[lang]}</p>

                <a
                  href={repo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-arrow mt-auto pt-4 text-[11px]"
                >
                  {labels.open} <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 grid gap-px border border-ink bg-ink lg:grid-cols-2">
          <IssueList
            title={labels.done}
            marker="✓"
            items={done}
            empty={labels.nothingDone}
            lang={lang}
          />
          <IssueList
            title={labels.next}
            marker="○"
            items={next}
            empty={labels.nothingNext}
            lang={lang}
          />
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
