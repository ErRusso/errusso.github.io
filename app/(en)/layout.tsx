import type { Metadata } from "next";
import { CustomCursor } from "@/components/CustomCursor";
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
  title: { default: copy.en.meta.title, template: `%s · ${site.name}` },
  description: copy.en.meta.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "full-stack developer",
    "application security",
    "TypeScript",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "freelance developer",
    "CTF",
    "PipeDuck",
  ],
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: copy.en.meta.title,
    description: copy.en.meta.description,
    locale: "en_US",
    alternateLocale: ["it_IT"],
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Simone Russo — Built to work. Tested to break.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: copy.en.meta.title,
    description: copy.en.meta.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script dangerouslySetInnerHTML={{ __html: langInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema("en")) }}
        />
        <ScrollMemory />
        <LanguageTransition />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
