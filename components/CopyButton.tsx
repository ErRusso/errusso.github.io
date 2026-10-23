"use client";

import { useState } from "react";

export function CopyButton({ value, label, copied }: { value: string; label: string; copied: string }) {
  const [done, setDone] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      window.setTimeout(() => setDone(false), 1600);
    } catch {
      // Clipboard API is unavailable (older browser or insecure context):
      // fall back to a temporary, off-screen textarea.
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
      setDone(true);
      window.setTimeout(() => setDone(false), 1600);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`label inline-flex items-center gap-1.5 border px-2 py-1 transition-colors duration-100 ${
        done
          ? "border-violet bg-violet text-on-surface"
          : "border-on-surface/25 text-on-surface/55 hover:border-violet hover:text-violet-soft"
      }`}
    >
      <span aria-hidden>{done ? "✓" : "⧉"}</span>
      <span aria-live="polite">{done ? copied : label}</span>
    </button>
  );
}
