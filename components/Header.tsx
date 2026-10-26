import Link from "next/link";
import { copy } from "@/content/copy";
import { href, type Lang } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Header({ lang, path = "" }: { lang: Lang; path?: string }) {
  const t = copy[lang];
  const currentPage = path ? href(lang, path) : "";
  const isCurrent = (target: string) => {
    if (!path) return false;
    if (target === currentPage) return true;
    if (target === `${href(lang)}#work` && path.startsWith("/work")) return true;
    if (target === href(lang, "/security") && path.startsWith("/security")) return true;
    if (target === href(lang, "/professional") && path.startsWith("/professional")) return true;
    return false;
  };
  const links = [
    { label: t.nav.work, target: `${href(lang)}#work` },
    { label: t.nav.services, target: `${href(lang)}#services` },
    { label: t.nav.about, target: `${href(lang)}#about` },
    { label: t.nav.cv, target: href(lang, "/professional") },
    { label: t.nav.security, target: href(lang, "/security") },
    { label: t.nav.contact, target: `${href(lang)}#contact` },
  ].map((link) => ({ ...link, current: isCurrent(link.target) }));

  return (
    <header id="top" className="sticky top-0 z-50 border-b border-ink bg-paper">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-2"
      >
        {t.nav.skip}
      </a>
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-4 px-3.5 sm:px-5 md:h-16 md:px-8">
        <Link href={href(lang)} prefetch={false} className="group flex items-baseline gap-1.5" aria-label={lang === "it" ? "Simone Russo — pagina iniziale" : "Simone Russo — home"}>
          <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase tracking-[0.12em] md:text-[13px] md:tracking-[0.16em]">
            Simone <span className="transition-colors duration-100 group-hover:text-violet">Russo</span>
          </span>
          <span aria-hidden className="cursor-block text-[15px] leading-none text-violet">
            ▮
          </span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
          <nav aria-label={lang === "it" ? "Navigazione principale" : "Primary"} className="hidden items-center gap-5 lg:flex xl:gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.target}
                aria-current={link.current ? "page" : undefined}
                className={`label border-b pb-0.5 transition-colors duration-100 hover:border-violet hover:text-violet ${
                  link.current ? "border-violet text-violet" : "border-transparent"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <ThemeToggle label={t.theme.toggle} />
            <LanguageSwitcher lang={lang} path={path} />
          </div>

          <MobileMenu
            links={links}
            label={t.nav.menu}
            lang={lang}
            path={path}
            themeLabel={t.theme.toggle}
          />
        </div>
      </div>
    </header>
  );
}
