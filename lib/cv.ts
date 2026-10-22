import type { Lang } from "./i18n";

/**
 * Two CV tracks, same portfolio. The full-stack CV leads with product work and
 * backend proof; the application-security CV leads with review, labs and
 * remediation. Keep the filenames stable: they are linked from the site.
 */
export type CvTrack = "fullstack" | "appsec";

export function cvFile(track: CvTrack, lang: Lang): string {
  return `simone-russo-cv-${track}-${lang}.pdf`;
}

export function cvHref(track: CvTrack, lang: Lang): string {
  return `/cv/${cvFile(track, lang)}`;
}

export function cvPrintPath(track: CvTrack, lang: Lang): string {
  const base = lang === "it" ? "/it/cv/" : "/cv/";
  return track === "fullstack" ? base : `${base}appsec/`;
}
