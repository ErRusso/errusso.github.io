"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const WHITE_KEYS = [
  { name: "C4", frequency: 261.63 },
  { name: "D4", frequency: 293.66 },
  { name: "E4", frequency: 329.63 },
  { name: "F4", frequency: 349.23 },
  { name: "G4", frequency: 392.0 },
  { name: "A4", frequency: 440.0 },
  { name: "B4", frequency: 493.88 },
  { name: "C5", frequency: 523.25 },
];

const BLACK_KEYS = [
  { name: "C♯4", frequency: 277.18, after: 0 },
  { name: "D♯4", frequency: 311.13, after: 1 },
  { name: "F♯4", frequency: 369.99, after: 3 },
  { name: "G♯4", frequency: 415.3, after: 4 },
  { name: "A♯4", frequency: 466.16, after: 5 },
];

const LETTERS = ["a", "s", "d", "f", "g", "h", "j", "k"];

// Geometry of the mini keyboard: 24px white keys, 2px gaps, 12px black keys
// drawn over them. The whole keyboard is one pointer target, with A–K as the
// keyboard path, so individual 12px keys do not fail target-size.
const WHITE_WIDTH = 24;
const GAP = 2;
const BLACK_WIDTH = 12;
const BLACK_HEIGHT = 22;

type AudioContextCtor = typeof AudioContext;

export function Piano({ label, onLabel, hint }: { label: string; onLabel: string; hint: string }) {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const play = useCallback((frequency: number, id: string) => {
    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return;

    if (!contextRef.current) contextRef.current = new Ctor();
    const context = contextRef.current;
    if (context.state === "suspended") void context.resume();

    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.16, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.7);

    setActive(id);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setActive(null), 150);
  }, []);

  const strike = useCallback(
    (frequency: number, id: string) => {
      setEnabled(true);
      play(frequency, id);
    },
    [play],
  );

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      const index = LETTERS.indexOf(event.key.toLowerCase());
      if (index === -1) return;
      play(WHITE_KEYS[index].frequency, WHITE_KEYS[index].name);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, play]);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      const context = contextRef.current;
      contextRef.current = null;
      if (context) void context.close();
    };
  }, []);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <button
          type="button"
          aria-label={label}
          aria-pressed={enabled}
          onClick={() => setEnabled((value) => !value)}
          className={`label flex items-center gap-2 border px-2.5 py-1.5 transition-colors duration-100 ${
            enabled
              ? "border-accent-solid bg-accent-solid text-on-accent"
              : "border-on-surface/25 text-on-surface/60 hover:border-on-surface hover:text-on-surface"
          }`}
        >
          <span aria-hidden>♪</span>
          {enabled ? onLabel : label}
        </button>

        {enabled ? <span className="label text-on-surface/50">{hint}</span> : null}
      </div>

      <div
        role="group"
        aria-label={`${label}. ${hint}`}
        onPointerDown={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          if (y <= BLACK_HEIGHT) {
            for (const note of BLACK_KEYS) {
              const left = (note.after + 1) * (WHITE_WIDTH + GAP) - BLACK_WIDTH / 2;
              if (x >= left && x <= left + BLACK_WIDTH) {
                strike(note.frequency, note.name);
                return;
              }
            }
          }

          const index = Math.max(
            0,
            Math.min(
              Math.floor(x / (WHITE_WIDTH + GAP)),
              WHITE_KEYS.length - 1,
            ),
          );
          const note = WHITE_KEYS[index];
          strike(note.frequency, note.name);
        }}
        className={`relative flex w-fit cursor-pointer touch-none select-none gap-[2px] transition-opacity duration-150 ${enabled ? "" : "opacity-70"}`}
      >
        {WHITE_KEYS.map((note) => (
          <span
            key={note.name}
            aria-hidden
            className={`h-9 w-6 transition-colors duration-75 ${
              active === note.name
                ? "bg-violet-soft"
                : "bg-on-surface hover:bg-violet-soft/40"
            }`}
          />
        ))}

        {BLACK_KEYS.map((note) => (
          <span
            key={note.name}
            aria-hidden
            style={{ left: (note.after + 1) * (WHITE_WIDTH + GAP) - BLACK_WIDTH / 2 }}
            className={`absolute top-0 z-10 h-[22px] w-3 border transition-colors duration-75 ${
              active === note.name
                ? "border-violet-soft bg-violet-soft"
                : "border-on-surface/20 bg-surface hover:border-violet-soft hover:bg-on-surface/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
