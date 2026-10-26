"use client";

import { useEffect, useState } from "react";

/**
 * Long pages (the CV and the case studies especially) need a way back to the
 * top that does not require scrolling to the footer. The button only appears
 * once the reader is well into the page, and it is not rendered at all when
 * hidden so keyboard focus never lands on an invisible control.
 */
export function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  function scrollToTop() {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      className="label fixed bottom-4 right-4 z-40 flex h-10 w-10 items-center justify-center border border-ink bg-paper text-base shadow-[4px_4px_0_0_var(--color-ink)] transition-colors duration-100 hover:bg-ink hover:text-paper sm:bottom-6 sm:right-6"
    >
      <span aria-hidden>↑</span>
    </button>
  );
}
