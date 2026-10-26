import type { Metadata } from "next";
import { BackToTop } from "@/components/BackToTop";
import { LanguageTransition } from "@/components/LanguageTransition";
import { ScrollMemory } from "@/components/ScrollMemory";
import { copy } from "@/content/copy";
import { fontVariables } from "@/lib/fonts";
import { personSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import langInit from "@/lib/lang";
import themeInit from "@/lib/theme";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: copy.it.meta.title, template: `%s · ${site.name}` },
  description: copy.it.meta.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "sviluppatore full-stack",
    "application security",
    "TypeScript",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "freelance",
    "CTF",
    "PipeDuck",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: `${site.url}/it/`,
    siteName: site.name,
    title: copy.it.meta.title,
    description: copy.it.meta.description,
    locale: "it_IT",
    alternateLocale: ["en_US"],
    images: [
      {
        url: "/og-it.png",
        width: 1200,
        height: 630,
        alt: "Simone Russo — Costruito per funzionare. Testato per rompersi.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.it.meta.title,
    description: copy.it.meta.description,
    images: ["/og-it.png"],
  },
  robots: { index: true, follow: true },
};

export default function ItalianLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={fontVariables} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script dangerouslySetInnerHTML={{ __html: langInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema("it")) }}
        />
        <ScrollMemory />
        <LanguageTransition />
        {children}
        <BackToTop label={copy.it.footer.top} />
      </body>
    </html>
  );
}
