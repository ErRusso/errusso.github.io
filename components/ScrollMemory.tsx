"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "portfolio:scroll-ratio";

function rememberScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return;
  sessionStorage.setItem(STORAGE_KEY, String(window.scrollY / max));
}

/**
 * Keeps the reader in place when switching language. The language links carry
 * `data-language-switch` and `scroll={false}`; here we save the scroll ratio
 * before the navigation and restore it on the next route, so the footer stays
 * the footer and a mid-page section stays roughly where it was.
 */
export function ScrollMemory() {
  const pathname = usePathname();

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === null) return;

    const ratio = Number.parseFloat(stored);
    if (!Number.isFinite(ratio)) return;

    // After a full document load the layout can still report scrollHeight 0
    // for a few frames (hydration/fonts), so retry instead of giving up on
    // the first empty measurement.
    let frame = 0;
    let tries = 0;
    let cancelled = false;

    const restore = () => {
      if (cancelled) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) {
        if (tries++ < 120) frame = requestAnimationFrame(restore);
        return;
      }
      window.scrollTo(0, ratio >= 0.999 ? max : Math.round(ratio * max));
      // Remove only after a successful restore: React StrictMode runs the
      // mount effect twice in development, and an early remove would let the
      // first (cancelled) pass consume the saved ratio.
      sessionStorage.removeItem(STORAGE_KEY);
      // Language switches disable native restoration before navigating; put
      // it back once our own restore has been applied.
      try {
        history.scrollRestoration = "auto";
      } catch {
        // ignore
      }
    };

    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(restore);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

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
      rememberScroll();
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
