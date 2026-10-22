"use client";

// Theme switch: real-page iris wipe.
//
// Path A — View Transitions API (Chrome 124+ / Safari 18+ / Edge):
//   document.startViewTransition() snapshots the CURRENT page, our callback
//   flips the theme, and the browser owns the old → new cross-fade. The NEW
//   snapshot — the genuine page re-rendered in the destination theme — is
//   clipped to a circle whose radius animates from 0 to "covers the viewport",
//   centred on a chosen origin. Inside the circle you see the REAL new page;
//   outside it, the old one.
//
//   GEOMETRY (per viewport shape):
//   • landscape (desktop): the iris starts EXACTLY at the toggle button.
//     A single radius animates from 0 to "farthest corner" with a smooth
//     ease, so the arc grows evenly instead of jumping.
//   • portrait (mobile): an iris anchored to the header button reads as a
//     vertical wipe on a tall narrow screen — the arc is flatter than the
//     viewport itself. Start from the VIEWPORT CENTRE instead: a clean,
//     symmetric, unmistakably-round circle that covers evenly.
//
//   The keyframes use CONCRETE, click-time-computed numbers (no var(), no
//   @property) — the canonical recipe that works on every browser that has
//   the API. The rules are injected as runtime <style> text so Turbopack
//   never parses the exotic ::view-transition-* selectors.
//
// Path B — fallback (Firefox, older Safari): a single flat disc in the
//   destination theme's paper colour grows from the origin point, the theme
//   swaps behind it, the disc shrinks away. Self-contained.
//
// Reduced-motion users always get the instant swap.

const WIPE_ID = "theme-wipe";
const WIPE_STYLE_ID = "theme-wipe-style";
const DISK_CSS = /* css */ `
.theme-wipe {
  position: fixed;
  z-index: 9998;
  border-radius: 50%;
  background-color: var(--color-ink);
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
  will-change: transform;
}
`;
const IRIS_CSS = /* css */ `
:root {
  view-transition-name: root;
}

::view-transition-old(root) {
  z-index: 0;
  opacity: 1;
}

::view-transition-new(root) {
  z-index: 1;
  clip-path: circle(0px at 50% 50%);
}

/* The OLD snapshot must hold still: any default animation on it paints an
   opaque full-screen frame over the clipped NEW one until the very end —
   perceived as a flash of the old page. Keep it frozen. */
:root::view-transition-old(root) {
  animation: none;
}

/* The theme flip must be INSTANTANEOUS across the whole DOM. The site's
   elements carry transition-colors duration-100 utilities: without this the
   NEW snapshot is captured mid-lerp and the colors visibly "run" inside the
   opening circle — the flash on a real (non-headless) GPU. While the wipe is
   live, freeze every element's transitions; the attribute is removed right
   after the transition ends.

   Only TRANSITIONS are frozen. Never touch animation-duration here: that
   restarts every looping CSS animation (the marquee, the status dot, the
   cursor) when the wipe begins — the "freeze then jump" glitch. */
html[data-wiping] *,
html[data-wiping] {
  transition: none !important;
}

:root::view-transition-new(root) {
  /* A fill mode is essential: without it the clip-path snaps back to the
     base circle(0px) on the last frame, revealing the OLD snapshot for one
     frame right before the transition tears down — the full-screen flash. */
  animation: theme-iris-in 480ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

/* Same-shape static fallback (center origin) — overridden at click time by
   #theme-iris-now-style with the concrete per-click keyframes. */
@keyframes theme-iris-in {
  from {
    clip-path: circle(0px at 50% 50%);
  }
  to {
    clip-path: circle(65vw at 50% 50%);
  }
}
`;

type Geo = { cx: number; cy: number; rTo: number; cover: string; duration: number };

/** Choose the iris origin + keyframe shape for the current viewport. */
function wipeGeometry(px: number, py: number): Geo {
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (h > w) {
    // Portrait: the header button sits on the right edge; a circle from there
    // has an almost flat arc on a tall screen — reads as a curtain. Use the
    // viewport centre: round, symmetric, covers evenly.
    const cx = w / 2;
    const cy = h / 2;
    const r = Math.ceil(Math.hypot(cx, cy) * 1.02);
    return {
      cx,
      cy,
      rTo: r,
      cover: `0% { clip-path: circle(0px at ${cx}px ${cy}px); }
100% { clip-path: circle(${r}px at ${cx}px ${cy}px); }`,
      duration: 480,
    };
  }

  // Landscape: start at the toggle button. One continuous radius with a
  // smooth ease (no multi-stop keyframes) — intermediate stops made the
  // circle jump from a small arc to full screen in a couple of frames.
  const farthest = Math.hypot(Math.max(px, w - px), Math.max(py, h - py));
  return {
    cx: px,
    cy: py,
    rTo: farthest,
    cover: `0% { clip-path: circle(0px at ${px}px ${py}px); }
100% { clip-path: circle(${Math.ceil(farthest * 1.02)}px at ${px}px ${py}px); }`,
    duration: 480,
  };
}

/** Build a <style> with the per-click concrete keyframes that OVERRIDE the
    static ones in the cascade. Turbopack never sees these — they're
    injected at runtime with real numbers. */
function irisFor(g: Geo): string {
  return `
:root::view-transition-new(root) {
  animation: theme-iris-now ${g.duration}ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

@keyframes theme-iris-now {
  ${g.cover}
}
`;
}
const IRIS_NOW_STYLE_ID = "theme-iris-now-style";

function ensureIrisNowStyle(css: string) {
  let style = document.getElementById(IRIS_NOW_STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = IRIS_NOW_STYLE_ID;
    document.head.append(style);
  }
  style.textContent = css;
}

/** Idempotent: inject the ::view-transition-* rules once, as plain text. */
export function ensureWipeStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(WIPE_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = WIPE_STYLE_ID;
  style.textContent = `${IRIS_CSS}\n${DISK_CSS}`;
  document.head.append(style);
}

function reduceMotion() {
  try {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  } catch {
    return false;
  }
}

export function runThemeWipe(next: "light" | "dark", x: number, y: number): Promise<void> {
  const root = document.documentElement;

  // Persist the user's choice even before the switcher runs (the <html> data
  // attribute is what actually styles the page).
  try {
    localStorage.setItem("theme", next);
  } catch {
    // storage disabled / private mode — theme still applies for this session
  }

  if (reduceMotion()) {
    root.dataset.theme = next;
    return Promise.resolve();
  }

  const g = wipeGeometry(x, y);

  // Path A — View Transitions.
  if (typeof document.startViewTransition === "function") {
    // Inject concrete per-click keyframes (canonical recipe): no var() inside
    // clip-path keyframes — Chrome won't interpolate those.
    ensureIrisNowStyle(irisFor(g));

    // The browser has ALREADY captured the old snapshot before invoking this
    // callback, so flip synchronously: an artificial frame of delay here is
    // exactly the "click, nothing happens, then the circle starts" hitch.
    // Transitions are frozen (html[data-wiping]) so the NEW snapshot shows
    // the FINAL colors, never an in-flight lerp.
    const t = document.startViewTransition(() => {
      root.dataset.wiping = "true";
      root.dataset.theme = next;
    });
    return new Promise((resolve) =>
      void t.finished.then(() => {
        // Release the freeze two frames after the transition ends, once the
        // live page is back at rest (colors are already final — no jumper).
        requestAnimationFrame(() =>
          requestAnimationFrame(() => delete root.dataset.wiping),
        );
        resolve();
      }),
    );
  }

  // Path B — flat disc fallback.
  if (document.getElementById(WIPE_ID)) return Promise.resolve(); // a wipe is already running

  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  const disc = document.createElement("div");
  disc.id = WIPE_ID;
  disc.className = "theme-wipe";
  disc.style.left = `${x}px`;
  disc.style.top = `${y}px`;
  disc.style.width = `${radius * 2}px`;
  disc.style.height = `${radius * 2}px`;
  // Freeze the destination paper colour as a LITERAL. `var(--color-ink)`
  // flips the instant data-theme changes, so the covering disc would change
  // colour over the old page and flash right before the reveal.
  const paper = getComputedStyle(root).getPropertyValue("--color-ink").trim();
  if (paper) disc.style.backgroundColor = paper;
  document.body.append(disc);

  disc.style.transition = `transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
  void disc.getBoundingClientRect();
  disc.style.transform = "translate(-50%, -50%) scale(1)";

  window.setTimeout(() => {
    root.dataset.wiping = "true";
    root.dataset.theme = next;
    disc.style.transition = `transform 300ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
    disc.style.transform = "translate(-50%, -50%) scale(0)";
  }, 404);

  window.setTimeout(() => delete root.dataset.wiping, 480);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      disc.remove();
      resolve();
    }, 820);
  });
}