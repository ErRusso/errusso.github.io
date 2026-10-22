import Link from "next/link";
import { copy } from "@/content/copy";
import { href, langLabels, langs, type Lang } from "@/lib/i18n";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ lang, path = "" }: { lang: Lang; path?: string }) {
  const t = copy[lang];
  const links = [
    { label: t.nav.work, target: `${href(lang)}#work` },
    { label: t.nav.services, target: `${href(lang)}#services` },
    { label: t.nav.about, target: `${href(lang)}#about` },
    { label: t.nav.cv, target: href(lang, "/professional") },
    { label: t.nav.security, target: href(lang, "/security") },
    { label: t.nav.contact, target: `${href(lang)}#contact` },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2"
      >
        {t.nav.skip}
      </a>
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-4 px-3.5 sm:px-5 md:h-16 md:px-8">
        <Link href={href(lang)} prefetch={false} className="group flex items-baseline gap-1.5" aria-label="Simone Russo — home">
          <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.12em] md:text-[13px] md:tracking-[0.16em]">
            Simone <span className="transition-colors duration-100 group-hover:text-red">Russo</span>
          </span>
          <span aria-hidden className="cursor-block text-[15px] leading-none text-violet">
            ▮
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.target}
                className="label border-b border-transparent pb-0.5 transition-colors duration-100 hover:border-violet hover:text-violet"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <ThemeToggle label={t.theme.toggle} />

          <div className="flex shrink-0 items-center gap-2 border border-ink px-2 py-1.5" role="group" aria-label="Language">
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
                  className={`label px-1 transition-colors duration-100 ${
                    active ? "bg-ink px-1.5 py-0.5 text-paper" : "text-concrete hover:text-violet"
                  }`}
                >
                  {langLabels[code]}
                </Link>
              );
            })}
          </div>

          <details className="relative shrink-0 md:hidden">
            <summary className="label cursor-pointer list-none border border-ink px-2.5 py-1.5 transition-colors duration-100 hover:bg-ink hover:text-paper">
              {t.nav.menu}
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 top-[calc(100%+10px)] w-56 border border-ink bg-paper shadow-[8px_8px_0_0_var(--color-ink)]"
            >
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.target}
                  className="label block border-b border-ink px-4 py-3.5 transition-colors duration-100 last:border-b-0 hover:bg-ink hover:text-paper"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
