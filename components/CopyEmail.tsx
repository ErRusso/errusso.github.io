"use client";

import { useState } from "react";

export function CopyEmail({ email, label, copied }: { email: string; label: string; copied: string }) {
  const [state, setState] = useState<"idle" | "done">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
      setState("done");
      window.setTimeout(() => setState("idle"), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="label flex items-center gap-2 border border-ink px-3 py-2 transition-colors duration-100 hover:bg-ink hover:text-paper"
    >
      <span aria-hidden>⧉</span>
      <span aria-live="polite">{state === "done" ? copied : label}</span>
    </button>
  );
}
