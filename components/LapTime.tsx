"use client";

import { useEffect, useState } from "react";

export function LapTime({ label }: { label: string }) {
  const [lap, setLap] = useState<string | null>(null);

  useEffect(() => {
    const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const navigation = entries[0];
    const ms = navigation && navigation.loadEventEnd > 0 ? navigation.loadEventEnd : performance.now();
    const frame = window.requestAnimationFrame(() => setLap((ms / 1000).toFixed(2)));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <span className="label flex items-center gap-2">
      <span className="opacity-60">{label}</span>
      <span className="tabular-nums">{lap ? `${lap}s` : "—"}</span>
    </span>
  );
}
