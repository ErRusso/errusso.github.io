"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Progressive enhancement only: nothing is hidden until this component has
 * mounted and confirmed that IntersectionObserver works. If JavaScript fails,
 * the page stays fully visible instead of showing empty sections.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    // Leave anything already on screen untouched, so there is no flash.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) return;

    element.classList.add("reveal-hidden");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            element.classList.add("reveal-in");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 8% 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
