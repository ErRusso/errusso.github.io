"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, [role='button'], summary, label, .cursor-pointer";

/* Keep the pointer where it was across client-side layout swaps (the EN and IT
   layouts are separate roots, so this component remounts on language change).
   `visible` avoids restoring a cursor that had left the window. A hard
   navigation (language switch) resets module state, so internal link clicks
   also stash the click point and the next document resumes from it. */
const RESUME_KEY = "portfolio:cursor-resume";
const RESUME_MS = 5000;

type Point = { x: number; y: number };

let lastPoint: (Point & { visible: boolean }) | null = null;

function readResumePoint(): Point | null {
  try {
    const raw = sessionStorage.getItem(RESUME_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(RESUME_KEY);
    const point = JSON.parse(raw) as Point & { t?: number };
    if (typeof point.x !== "number" || typeof point.y !== "number") return null;
    if (typeof point.t !== "number" || Date.now() - point.t > RESUME_MS) return null;
    return { x: point.x, y: point.y };
  } catch {
    return null;
  }
}

export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let x = 0;
    let y = 0;
    let frame = 0;
    let shown = false;
    let link = false;

    const place = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const setTarget = (target: Element | null) => {
      const next = Boolean(target?.closest(INTERACTIVE));
      if (next === link) return;
      link = next;
      if (link) el.dataset.state = "link";
      else delete el.dataset.state;
    };

    const show = () => {
      if (shown) return;
      shown = true;
      place();
      el.dataset.visible = "true";
      document.documentElement.dataset.customCursor = "on";
    };

    const hide = () => {
      shown = false;
      delete el.dataset.visible;
      delete el.dataset.pressed;
      if (lastPoint) lastPoint = { ...lastPoint, visible: false };
    };

    const resume = lastPoint?.visible ? lastPoint : readResumePoint();
    if (resume) {
      x = resume.x;
      y = resume.y;
      show();
      setTarget(document.elementFromPoint(x, y));
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      lastPoint = { x, y, visible: true };
      show();
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          place();
        });
      }
      setTarget(event.target instanceof Element ? event.target : null);
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      el.dataset.pressed = "true";

      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
      const inPlace = link && (!link.target || link.target === "_self");
      if (link && inPlace && !link.hasAttribute("download") && link.origin === location.origin) {
        try {
          sessionStorage.setItem(
            RESUME_KEY,
            JSON.stringify({ x: event.clientX, y: event.clientY, t: Date.now() }),
          );
        } catch {
          /* storage unavailable in private mode: native pointer is the fallback */
        }
      }
    };

    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      delete el.dataset.pressed;
    };

    const onScroll = () => {
      if (!shown) return;
      setTarget(document.elementFromPoint(x, y));
    };

    const onFocus = () => {
      if (!lastPoint) return;
      x = lastPoint.x;
      y = lastPoint.y;
      show();
      setTarget(document.elementFromPoint(x, y));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("mouseleave", hide);
      cancelAnimationFrame(frame);
      delete document.documentElement.dataset.customCursor;
      delete el.dataset.visible;
    };
  }, []);

  return (
    <div ref={ref} className="site-cursor" aria-hidden="true">
      <div className="site-cursor-box" />
    </div>
  );
}
