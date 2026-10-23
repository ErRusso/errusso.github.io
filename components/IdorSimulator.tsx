"use client";

import { useEffect, useRef, useState } from "react";
import type { SimulatorCopy } from "@/content/lab";

type Identity = "alice" | "bob" | "anon";
type Mode = "vulnerable" | "fixed";
type Config = { identity: Identity; invoiceId: number; mode: Mode };

type NodeTone = "idle" | "done" | "missing" | "blocked" | "unreached";

const USERS = {
  alice: { id: 1, name: "Alice", sid: "a41f…9c" },
  bob: { id: 2, name: "Bob", sid: "7e02…3b" },
} as const;

const INVOICES = [
  { id: 1, ownerId: 1, customer: "Alice Co", amount: 1200, currency: "EUR" },
  { id: 2, ownerId: 2, customer: "Bob Srl", amount: 5400, currency: "EUR" },
  { id: 3, ownerId: 1, customer: "Alice Labs", amount: 800, currency: "EUR" },
] as const;

const STAGE_LABELS = ["01", "02", "03", "04"] as const;

function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}

export function IdorSimulator({ t }: { t: SimulatorCopy }) {
  const [controls, setControls] = useState<Config>({
    identity: "alice",
    invoiceId: 2,
    mode: "vulnerable",
  });
  const [active, setActive] = useState<Config | null>(null);
  const [stage, setStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const hasRun = useRef(false);

  const cfg = active ?? controls;
  const user = cfg.identity === "anon" ? null : USERS[cfg.identity];
  const invoice = INVOICES.find((item) => item.id === cfg.invoiceId) ?? INVOICES[0];
  const status: 200 | 401 | 404 =
    cfg.identity === "anon" ? 401 : cfg.mode === "fixed" && invoice.ownerId !== user!.id ? 404 : 200;
  const leak = status === 200 && user !== null && invoice.ownerId !== user.id;

  const stageNames = [t.stages.auth, t.stages.route, t.stages.lookup, t.stages.owner];

  function clearTimers() {
    for (const timer of timers.current) window.clearTimeout(timer);
    timers.current = [];
  }

  function run(next: Config = controls) {
    clearTimers();
    hasRun.current = true;
    setStarted(true);
    setControls(next);
    setActive(next);
    setStage(0);
    setRunning(true);

    const timeline = next.identity === "anon" ? [1, 5] : [1, 2, 3, 4, 5];
    timeline.forEach((step, index) => {
      timers.current.push(
        window.setTimeout(() => {
          setStage(step);
          if (step === 5) setRunning(false);
        }, 380 + index * 640),
      );
    });
  }

  function update(patch: Partial<Config>) {
    const next = { ...controls, ...patch };
    if (hasRun.current) {
      run(next);
    } else {
      setControls(next);
    }
  }

  const runRef = useRef(run);
  runRef.current = run;

  useEffect(() => {
    const element = trackRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Play the canonical attack once, the first time the stage track is seen.
    // Observing the track (not the whole panel) matters on phones: the controls
    // push the trace below the fold, so a panel-level trigger would finish the
    // animation before the user could see it.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          if (hasRun.current) return;
          runRef.current({ identity: "alice", invoiceId: 2, mode: "vulnerable" });
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => clearTimers, []);

  function nodeTone(index: number): NodeTone {
    const number = index + 1;

    if (cfg.identity === "anon" && number > 1) {
      return stage > 1 ? "unreached" : "idle";
    }

    if (number === 1) {
      if (stage < 1) return "idle";
      return cfg.identity === "anon" ? "blocked" : "done";
    }

    if (number === 4) {
      if (cfg.mode === "vulnerable") return "missing";
      if (user && invoice.ownerId !== user.id) {
        return stage >= 4 ? "blocked" : "idle";
      }
      return stage >= 4 ? "done" : "idle";
    }

    return stage >= number ? "done" : "idle";
  }

  const toneClasses: Record<NodeTone, string> = {
    idle: "border-on-surface/35 text-on-surface/60",
    done: "border-violet bg-violet text-on-surface",
    missing: "border-dashed border-red text-red",
    blocked: "border-red bg-red text-on-surface",
    unreached: "border-on-surface/15 text-on-surface/20",
  };

  const progress =
    stage === 0 || cfg.identity === "anon" ? 0 : ((Math.min(stage, 4) - 1) / 3) * 100;

  const trace: { at: number; tone: "dim" | "ok" | "bad"; text: string }[] = [
    {
      at: 0,
      tone: "dim",
      text: `GET /api/invoices/${cfg.invoiceId}`,
    },
  ];

  if (cfg.identity === "anon") {
    trace.push({ at: 1, tone: "bad", text: t.traceLines.authFail });
    trace.push({ at: 5, tone: "bad", text: t.traceLines.anon });
  } else {
    trace.push({
      at: 1,
      tone: "ok",
      text: fill(t.traceLines.authOk, {
        sid: user!.sid,
        userId: user!.id,
        name: user!.name,
      }),
    });
    trace.push({
      at: 2,
      tone: "dim",
      text: fill(t.traceLines.route, { invoice: cfg.invoiceId }),
    });
    trace.push({
      at: 3,
      tone: "dim",
      text: fill(t.traceLines.lookup, {
        invoice: invoice.id,
        ownerId: invoice.ownerId,
      }),
    });

    if (cfg.mode === "vulnerable") {
      trace.push({ at: 4, tone: "bad", text: t.traceLines.ownerMissing });
    } else if (invoice.ownerId !== user!.id) {
      trace.push({
        at: 4,
        tone: "bad",
        text: fill(t.traceLines.ownerDenied, {
          ownerId: invoice.ownerId,
          userId: user!.id,
        }),
      });
    } else {
      trace.push({
        at: 4,
        tone: "ok",
        text: fill(t.traceLines.ownerPass, {
          ownerId: invoice.ownerId,
          userId: user!.id,
        }),
      });
    }

    trace.push({
      at: 5,
      tone: status === 200 && !leak ? "ok" : "bad",
      text:
        status === 404
          ? t.traceLines.denied
          : fill(leak ? t.traceLines.leak : t.traceLines.own, {
              invoice: invoice.id,
              userId: user!.id,
            }),
    });
  }

  const captions = t.captions;
  let caption = captions.idle;
  if (stage === 1) caption = cfg.identity === "anon" ? captions.anon : captions.auth;
  if (stage === 2) caption = captions.route;
  if (stage === 3) caption = captions.lookup;
  if (stage === 4) {
    if (cfg.mode === "vulnerable") caption = captions.ownerMissing;
    else caption = user && invoice.ownerId === user.id ? captions.ownerPass : captions.ownerDenied;
  }
  if (stage >= 5) {
    if (cfg.identity === "anon") caption = captions.anon;
    else if (status === 404) caption = captions.denied;
    else caption = leak ? captions.leak : captions.own;
  }

  const badge =
    stage < 5
      ? null
      : cfg.identity === "anon"
        ? t.badges.anon
        : status === 404
          ? t.badges.denied
          : leak
            ? t.badges.leak
            : t.badges.own;

  const responseBody =
    stage < 5
      ? null
      : status === 200
        ? JSON.stringify(
            {
              id: invoice.id,
              ownerId: invoice.ownerId,
              customer: invoice.customer,
              amount: invoice.amount,
              currency: invoice.currency,
            },
            null,
            2,
          )
        : JSON.stringify({ error: status === 401 ? "authentication required" : "not found" }, null, 2);

  const tone =
    stage < 5
      ? "text-on-surface/50"
      : status === 404
        ? "text-violet-soft"
        : leak
          ? "text-red"
          : "text-violet-soft";

  const identities: { key: Identity; label: string }[] = [
    { key: "alice", label: "Alice" },
    { key: "bob", label: "Bob" },
    { key: "anon", label: t.anonymous },
  ];

  return (
    <div className="border border-ink bg-surface text-on-surface">
      <div className="grid lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* Controls */}
        <div className="border-b border-on-surface/15 p-5 lg:border-b-0 lg:border-r md:p-6">
          <fieldset>
            <legend className="label text-violet-soft">{t.identity}</legend>
            <div className="mt-2 grid grid-cols-3 gap-px border border-on-surface/20 bg-on-surface/20">
              {identities.map((identity) => {
                const selected = controls.identity === identity.key;
                return (
                  <button
                    key={identity.key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ identity: identity.key })}
                    className={`px-1 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-100 ${
                      selected
                        ? "bg-violet text-on-surface"
                        : "bg-surface text-on-surface/60 hover:text-on-surface"
                    }`}
                  >
                    {identity.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="label text-violet-soft">{t.invoice}</legend>
            <div className="mt-2 grid gap-px border border-on-surface/20 bg-on-surface/20">
              {INVOICES.map((item) => {
                const selected = controls.invoiceId === item.id;
                const yours = user !== null && item.ownerId === user.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ invoiceId: item.id })}
                    className={`flex items-center justify-between gap-2 px-3 py-2 text-left transition-colors duration-100 ${
                      selected ? "bg-violet text-on-surface" : "bg-surface hover:bg-on-surface/5"
                    }`}
                  >
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="font-mono text-[11px] opacity-60">#{item.id}</span>
                      <span className="truncate font-mono text-[11px]">{item.customer}</span>
                    </span>
                    <span
                      className={`label shrink-0 ${selected ? "text-on-surface/70" : yourLabelClass(yours)}`}
                    >
                      {yours ? t.yours : USERS[item.ownerId === 1 ? "alice" : "bob"].name}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="label text-violet-soft">{t.mode}</legend>
            <div className="mt-2 grid grid-cols-2 gap-px border border-on-surface/20 bg-on-surface/20">
              {(["vulnerable", "fixed"] as const).map((mode) => {
                const selected = controls.mode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => update({ mode })}
                    className={`flex items-center justify-center gap-2 px-2 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-100 ${
                      selected
                        ? "bg-violet text-on-surface"
                        : "bg-surface text-on-surface/60 hover:text-on-surface"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 ${
                        selected ? "bg-on-surface" : mode === "vulnerable" ? "bg-red" : "bg-violet-soft"
                      }`}
                    />
                    {t.modes[mode]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={() => run()}
            className="mt-6 flex w-full items-center justify-between gap-3 border border-on-surface bg-on-surface px-4 py-3 font-mono text-[11px] uppercase tracking-[0.14em] text-surface transition-colors duration-100 hover:border-violet hover:bg-violet hover:text-on-surface"
          >
            <span>{started ? t.replay : t.send}</span>
            <span aria-hidden>→</span>
          </button>

          <button
            type="button"
            onClick={() => run({ identity: "alice", invoiceId: 2, mode: "vulnerable" })}
            className="mt-2 block w-full border border-on-surface/25 px-4 py-2.5 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-on-surface/60 transition-colors duration-100 hover:border-red hover:text-red"
          >
            {t.attack}
          </button>

          <p className="mt-5 border-t border-on-surface/15 pt-4 font-mono text-[10px] leading-relaxed text-on-surface/55">
            {t.rerunNote}
          </p>
        </div>

        {/* Visualization */}
        <div className="min-w-0 p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="label text-on-surface/55">{t.trace}</p>
            <p className="label flex items-center gap-2 text-on-surface/55">
              <span
                aria-hidden
                className={`h-1.5 w-1.5 ${running ? "bg-violet-soft" : "bg-on-surface/30"}`}
              />
              {running ? t.state.live : stage >= 5 ? t.state.done : t.state.idle}
            </p>
          </div>

          <div ref={trackRef} className="relative mt-6">
            <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-5 h-px bg-on-surface/20" />
            <div
              aria-hidden
              className="absolute left-[12.5%] top-5 h-px bg-violet transition-[width] duration-500 ease-out"
              style={{ width: `calc((100% - 25%) * ${progress / 100})` }}
            />
            {stage > 0 ? (
              <span
                aria-hidden
                className={`absolute top-5 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 border border-on-surface transition-[left] duration-500 ease-out ${
                  leak && stage >= 5 ? "bg-red" : "bg-violet"
                }`}
                style={{ left: `${12.5 + ((Math.min(stage, 4) - 1) / 3) * 75}%` }}
              />
            ) : null}
            <ol className="relative grid grid-cols-4 gap-1.5 sm:gap-4">
              {stageNames.map((name, index) => {
                const tone = nodeTone(index);
                const isActive = stage === index + 1;
                return (
                  <li key={name} className="flex flex-col items-center gap-2 text-center">
                    <span
                      aria-current={isActive ? "step" : undefined}
                      className={`flex h-10 w-10 items-center justify-center border font-mono text-[10px] transition-colors duration-200 ${
                        toneClasses[tone]
                      } ${isActive ? "ring-2 ring-violet ring-offset-2 ring-offset-surface" : ""}`}
                    >
                      {STAGE_LABELS[index]}
                    </span>
                    <span className="label text-[9px] leading-tight text-on-surface/55 sm:text-[10px]">
                      {name}
                    </span>
                    {index === 3 && cfg.mode === "vulnerable" ? (
                      <span className="label -mt-1 text-[8px] text-red sm:text-[9px]">
                        {t.skipped}
                      </span>
                    ) : null}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mt-6 border border-on-surface/20 bg-black/20">
            <div className="flex items-center justify-between gap-2 border-b border-on-surface/15 px-3 py-1.5">
              <span className="label text-on-surface/55">{t.request}</span>
              <code className="truncate font-mono text-[10px] text-violet-soft">
                GET /api/invoices/{cfg.invoiceId}
              </code>
            </div>
            <div className="min-h-[132px] space-y-1 px-3 py-3 font-mono text-[11px] leading-relaxed sm:text-[12px]">
              {stage === 0 ? (
                <>
                  <p className="text-on-surface/70">
                    $ GET /api/invoices/{cfg.invoiceId}
                    <span aria-hidden className="cursor-block ml-1 text-violet-soft">
                      ▮
                    </span>
                  </p>
                  <p className="mt-1 text-on-surface/50">{t.captions.idle}</p>
                </>
              ) : (
                trace
                  .filter((line) => stage >= line.at)
                  .map((line, index) => (
                    <p
                      key={`${line.at}-${index}`}
                      className={`trace-line ${
                        line.tone === "ok"
                          ? "text-on-surface/85"
                          : line.tone === "bad"
                            ? "text-red"
                            : "text-on-surface/60"
                      }`}
                    >
                      <span aria-hidden className="mr-2 text-on-surface/40">
                        {line.tone === "bad" ? "!" : "›"}
                      </span>
                      {line.text}
                    </p>
                  ))
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <div className="border border-on-surface/20">
              <div className="flex items-center justify-between gap-2 border-b border-on-surface/15 px-3 py-1.5">
                <span className="label text-on-surface/55">{t.response}</span>
                {badge ? (
                  <span
                    className={`label border px-2 py-0.5 ${
                      leak
                        ? "border-red text-red"
                        : status === 404
                          ? "border-violet-soft text-violet-soft"
                          : "border-on-surface/30 text-on-surface/70"
                    }`}
                  >
                    {badge}
                  </span>
                ) : null}
              </div>
              <p className={`px-3 py-3 font-display text-4xl font-black leading-none ${tone}`}>
                {stage >= 5 ? status : "—"}
              </p>
            </div>

            <div className="border border-on-surface/20">
              <div className="border-b border-on-surface/15 px-3 py-1.5">
                <span className="label text-on-surface/55">application/json</span>
              </div>
              <pre className="overflow-x-auto px-3 py-3 font-mono text-[11px] leading-relaxed text-on-surface/80">
                <code>{responseBody ?? "…"}</code>
              </pre>
            </div>
          </div>

          <p
            className={`mt-4 border-l-2 pl-3 text-sm leading-relaxed ${
              stage >= 5 && (leak || status === 404)
                ? "border-red text-on-surface/80"
                : "border-violet text-on-surface/80"
            }`}
          >
            {caption}
          </p>
          <p className="sr-only" aria-live="polite">
            {stage >= 5 ? `${status} — ${caption}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

function yourLabelClass(yours: boolean): string {
  return yours ? "text-violet-soft" : "text-on-surface/50";
}
