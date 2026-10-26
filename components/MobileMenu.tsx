"use client";

import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

type MenuLink = { label: string; target: string; current?: boolean };

/**
 * The mobile navigation. It holds everything that is not essential in the top
 * bar (links, language, theme), so the header itself stays down to a logo and
 * one button. It closes on selection, outside clicks and Escape, restores
 * focus to the trigger, and exposes its state to assistive technology.
 */
export function MobileMenu({
  links,
  label,
  lang,
  path = "",
  themeLabel,
}: {
  links: MenuLink[];
  label: string;
  lang: "en" | "it";
  path?: string;
  themeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const first = panel.current?.querySelector<HTMLAnchorElement>("a");
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };

    // Keep the page still behind the full-width menu: scrolling the content
    // underneath makes it hard to tell what is interactive.
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative shrink-0 lg:hidden">
      <button
        ref={trigger}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        className="label flex h-9 items-center justify-center gap-2 border border-ink px-2.5 transition-colors duration-100 hover:bg-ink hover:text-paper"
      >
        <span aria-hidden className="relative block h-3 w-4">
          <span
            className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-150 ${
              open ? "translate-y-[5.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[5.5px] h-px w-full bg-current transition-opacity duration-100 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-[11px] h-px w-full bg-current transition-transform duration-150 ${
              open ? "-translate-y-[5.5px] -rotate-45" : ""
            }`}
          />
        </span>
        <span className="hidden sm:inline">{label}</span>
      </button>

      <div
        ref={panel}
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-14 z-40 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-ink bg-paper md:top-16 md:max-h-[calc(100dvh-4rem)]"
      >
        <nav aria-label={lang === "it" ? "Navigazione mobile" : "Mobile"}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.target}
              aria-current={link.current ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`label flex min-h-12 items-center justify-between gap-4 border-b border-ink px-4 py-3.5 transition-colors duration-100 last:border-b-0 hover:bg-ink hover:text-paper ${
                link.current ? "bg-ink text-paper" : ""
              }`}
            >
              {link.label}
              <span aria-hidden className="text-[13px]">
                {link.current ? "●" : "→"}
              </span>
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-between gap-4 border-t border-ink px-4 py-3">
          <LanguageSwitcher lang={lang} path={path} onSelect={() => setOpen(false)} />
          <ThemeToggle label={themeLabel} />
        </div>
      </div>
    </div>
  );
}
