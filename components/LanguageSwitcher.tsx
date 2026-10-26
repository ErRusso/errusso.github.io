"use client";

import Link from "next/link";
import { href, langLabels, langs, type Lang } from "@/lib/i18n";

export function LanguageSwitcher({
  lang,
  path = "",
  onSelect,
}: {
  lang: Lang;
  path?: string;
  onSelect?: () => void;
}) {
  return (
    <div
      className="flex shrink-0 items-center gap-1 border border-ink p-1"
      role="group"
      aria-label={lang === "it" ? "Lingua" : "Language"}
    >
      {langs.map((code) => {
        const active = code === lang;
        return (
          <Link
            key={code}
            href={href(code, path)}
            prefetch={false}
            scroll={false}
            data-language-switch=""
            aria-current={active ? "true" : undefined}
            hrefLang={code}
            onClick={onSelect}
            className={`label flex min-h-6 items-center px-2 py-1 transition-colors duration-100 ${
              active ? "bg-ink text-paper" : "text-concrete hover:text-violet"
            }`}
          >
            {langLabels[code]}
          </Link>
        );
      })}
    </div>
  );
}
