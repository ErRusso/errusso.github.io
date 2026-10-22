export type Lang = "en" | "it";

export const langs: readonly Lang[] = ["en", "it"] as const;

export const langLabels: Record<Lang, string> = {
  en: "EN",
  it: "IT",
};

/** English lives at the root, Italian under /it. */
export function href(lang: Lang, path = ""): string {
  const base = lang === "it" ? "/it" : "";
  if (!path) return base || "/";
  return `${base}${path}`;
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "it" : "en";
}
