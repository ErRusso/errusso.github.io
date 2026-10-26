"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import type { Copy } from "@/content/copy";
import { href, type Lang } from "@/lib/i18n";

export type HeroProofData = {
  updated: string;
  version: string;
  buildJobs: number;
  trackedFiles: number;
  cppKb: number;
  testFunctions: number;
  assertions: number;
  packages: number;
  vulnerabilities: number;
};

const TABS = ["build", "test", "audit"] as const;
type TabId = (typeof TABS)[number];

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));
}

/**
 * The hero signature: real repository data, one tab at a time.
 * It is not a decorative illustration, it is the actual proof behind the
 * headline: build jobs, test assertions, dependency audit.
 */
export function HeroProof({
  lang,
  copy,
  data,
}: {
  lang: Lang;
  copy: Copy["hero"]["proof"];
  data: HeroProofData;
}) {
  const [active, setActive] = useState<TabId>("build");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const content = {
    build: {
      label: copy.tabs.build,
      value: data.buildJobs,
      unit: copy.build.unit,
      detail: fill(copy.build.detail, {
        version: `v${data.version}`,
        files: data.trackedFiles,
        kb: data.cppKb,
      }),
      link: href(lang, "/work/pipeduck"),
      linkLabel: copy.linkCase,
    },
    test: {
      label: copy.tabs.test,
      value: data.assertions,
      unit: copy.test.unit,
      detail: fill(copy.test.detail, { tests: data.testFunctions }),
      link: href(lang, "/work/pipeduck"),
      linkLabel: copy.linkCase,
    },
    audit: {
      label: copy.tabs.audit,
      value: data.vulnerabilities,
      unit: copy.audit.unit,
      detail: fill(copy.audit.detail, { packages: data.packages }),
      link: href(lang, "/security"),
      linkLabel: copy.linkSecurity,
    },
  };

  const item = content[active];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const current = TABS.indexOf(active);
    let next = current;

    if (event.key === "ArrowRight") next = (current + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (current + TABS.length - 1) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;

    event.preventDefault();
    setActive(TABS[next]);
    tabs.current[next]?.focus();
  }

  return (
    <aside className="border border-on-surface/25 bg-surface text-on-surface">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-on-surface/15 px-4 py-3">
        <span className="label flex items-center gap-2 text-violet-soft">
          <span aria-hidden className="h-2 w-2 shrink-0 bg-violet-soft" />
          {copy.label}
        </span>
        <span className="label text-on-surface/60">
          {copy.updated} {data.updated}
        </span>
      </div>

      <div
        role="tablist"
        aria-label={copy.label}
        className="grid grid-cols-3 border-b border-on-surface/15"
      >
        {TABS.map((id, index) => {
          const selected = id === active;
          return (
            <button
              key={id}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`proof-tab-${id}`}
              aria-selected={selected}
              aria-controls="proof-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(id)}
              onKeyDown={onKeyDown}
              className={`label relative min-h-11 border-r border-on-surface/15 px-2 transition-colors duration-100 last:border-r-0 ${
                selected
                  ? "text-violet-soft"
                  : "text-on-surface/55 hover:text-on-surface"
              }`}
            >
              {content[id].label}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-0.5 ${
                  selected ? "bg-violet-soft" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="proof-panel"
        aria-labelledby={`proof-tab-${active}`}
        className="p-4 md:p-5"
      >
        <p className="font-display text-[clamp(2.6rem,4vw,3.8rem)] font-black leading-none tracking-[-0.045em]">
          {item.value}
        </p>
        <p className="label mt-2 text-violet-soft">{item.unit}</p>
        <p className="mt-4 min-h-[3.25rem] text-sm leading-relaxed text-on-surface/70">
          {item.detail}
        </p>
        <Link
          href={item.link}
          prefetch={false}
          className="link-arrow mt-5 text-on-surface hover:text-violet-soft"
        >
          {item.linkLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
