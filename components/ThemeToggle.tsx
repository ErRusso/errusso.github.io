"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { ensureWipeStyles, runThemeWipe } from "@/lib/wipe";

type Theme = "light" | "dark";

export function ThemeToggle({ label }: { label: string }) {
  const busy = useRef(false);
  const pending = useRef<Theme | null>(null);
  // Last theme requested (not necessarily applied yet). Using this instead of
  // dataset.theme means rapid clicks always alternate, even when a click lands
  // before the in-flight transition has flipped the attribute.
  const target = useRef<Theme | null>(null);
  // The button that started the wipe: the header and the mobile menu each
  // render one, so looking it up by selector could pick a hidden button.
  const origin = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Inject the ::view-transition-* iris-wipe rules as a runtime <style>:
    // Turbopack cannot parse those selectors, the browser can.
    ensureWipeStyles();
  }, []);

  // Run one full wipe animation, then chain the next queued intent (if any) as
  // a NEW wipe — never a raw attribute set, which would flip the theme
  // instantly (with per-element color lerps) outside the iris = a visible
  // glitch when toggling rapidly.
  function startWipe(nextTheme: Theme) {
    // The iris opens from the button's centre.
    const btn = origin.current;
    let x = window.innerWidth / 2;
    let y = 24;
    if (btn?.isConnected) {
      const rect = btn.getBoundingClientRect();
      if (rect.width > 0) {
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      }
    }

    void runThemeWipe(nextTheme, x, y)
      .then(() => {
        if (pending.current) {
          const queued = pending.current;
          pending.current = null;
          startWipe(queued);
        } else {
          busy.current = false;
        }
      })
      .catch(() => {
        // Never leave the button stuck (or a queued intent unapplied) if the
        // browser aborts a transition.
        const queued = pending.current;
        pending.current = null;
        if (queued) {
          target.current = queued;
          document.documentElement.dataset.theme = queued;
        }
        busy.current = false;
      });
  }

  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    origin.current = event.currentTarget;
    const root = document.documentElement;
    const current = target.current ?? (root.dataset.theme === "dark" ? "dark" : "light");
    const next: Theme = current === "dark" ? "light" : "dark";
    target.current = next;

    // If a wipe is still animating, remember the intent and let the current
    // animation finish; a rapid second click then flips back cleanly.
    if (busy.current) {
      pending.current = next;
      return;
    }
    busy.current = true;
    startWipe(next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink transition-colors duration-100 hover:bg-ink hover:text-paper md:h-8 md:w-8"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
        className="theme-icon-light h-4 w-4"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
        className="theme-icon-dark h-4 w-4"
      >
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}