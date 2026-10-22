"use client";

import { useEffect, useState } from "react";

export function LocalTime({ label, timeZone }: { label: string; timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span className="label flex items-center gap-2">
      <span className="opacity-60">{label}</span>
      <span className="tabular-nums">{time ?? "--:--"}</span>
    </span>
  );
}
