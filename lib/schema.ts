import type { Lang } from "./i18n";
import { site } from "./site";

export function personSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${site.url}/#person`,
    name: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    image: `${site.url}${lang === "it" ? "/og-it.png" : "/og.png"}`,
    jobTitle:
      lang === "it"
        ? "Sviluppatore full-stack e application security"
        : "Full-stack developer and application security",
    description:
      lang === "it"
        ? "Sviluppatore full-stack (TypeScript, Node, PostgreSQL) e application security. Costruiti per funzionare, testati per rompersi."
        : "Full-stack developer (TypeScript, Node, PostgreSQL) and application security. Built to work, tested to break.",
    sameAs: [site.github, site.instagram],
    knowsAbout: [
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Next.js",
      "Application security",
      "OWASP Top 10",
      "C++",
      "Linux",
    ],
    address: { "@type": "PostalAddress", addressCountry: "IT" },
    inLanguage: lang === "it" ? "it-IT" : "en-US",
  };
}
