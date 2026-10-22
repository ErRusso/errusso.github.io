"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ENTER_KEY = "portfolio:lang-enter";
const PANEL_IN_MS = 420;
const PANEL_HOLD_MS = 160;
const NAV_MS = PANEL_IN_MS + PANEL_HOLD_MS;

type Target = { label: string; dir: number };

/**
 * Language switch choreography.
 *
 * The language links point at a different route group with its own layout.
 * Instead of a raw reload:
 *   1. the click is captured before Next's Link handler (capture phase),
 *   2. a solid ink panel showing the target language rises over the page,
 *   3. once it covers the viewport we push the new route client-side,
 *   4. the new layout keeps the panel (it lives on <html>) and flips it into
 *      its exit animation, while the page content slides in.
 *
 * One continuous move, no white gap, no scroll jump (ScrollMemory still
 * stores/restores the ratio). `lib/lang.ts` covers the hard-load fallback.
 */
export function LanguageTransition() {
  const router = useRouter();

  // Client-side navigation keeps the panel mounted on <html>: switch the
  // covering exit animation into the entrance as soon as the new layout is
  // live. No document reload, so there is no white gap while the page loads.
  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.langExit) return;

    root.dataset.langEnter = "";
    delete root.dataset.langExit;
    try {
      sessionStorage.removeItem(ENTER_KEY);
    } catch {
      // ignore
    }

    const clean = window.setTimeout(() => {
      delete root.dataset.langEnter;
      delete root.dataset.langTarget;
    }, 700);

    return () => window.clearTimeout(clean);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
        "a[data-language-switch]",
      );
      if (!link || link.getAttribute("aria-current") === "true") return;

      const href = link.getAttribute("href");
      if (!href) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;

      const target: Target["label"] =
        url.pathname === "/it" || url.pathname.startsWith("/it/") ? "IT" : "EN";
      const current = document.documentElement.lang === "it" ? "IT" : "EN";
      if (target === current) return;

      // Take over the navigation: Next's Link bails out on defaultPrevented.
      event.preventDefault();

      // If the router falls back to a full document load, disable the
      // browser's own scroll restoration so ScrollMemory can apply the saved
      // ratio after the new page has laid out.
      try {
        history.scrollRestoration = "manual";
      } catch {
        // unsupported: ScrollMemory's restore still runs
      }

      const reduce = (() => {
        try {
          return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        } catch {
          return false;
        }
      })();

      if (reduce) {
        router.push(`${url.pathname}${url.search}${url.hash}`);
        return;
      }

      const dir = target === "IT" ? 1 : -1;
      try {
        sessionStorage.setItem(ENTER_KEY, JSON.stringify({ label: target, dir }));
      } catch {
        // storage disabled: the switch still works, just without the entrance
      }

      const root = document.documentElement;
      root.dataset.langExit = "";
      root.dataset.langTarget = target;
      root.style.setProperty("--lang-dir", String(dir));

      // Safety net: never leave the panel covering the page if navigation is
      // blocked (offline, extension, cancelled download...).
      window.setTimeout(() => {
        delete root.dataset.langExit;
        delete root.dataset.langTarget;
        try {
          sessionStorage.removeItem(ENTER_KEY);
        } catch {
          // ignore
        }
      }, 2500);

      // Let the panel sit fully covering for a beat before revealing the new
      // page: the destination language must be readable, not a blink.
      window.setTimeout(() => {
        router.push(`${url.pathname}${url.search}${url.hash}`);
      }, NAV_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
