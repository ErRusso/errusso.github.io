import type { Metadata } from "next";
import { Professional } from "@/components/Professional";
import { professional } from "@/content/professional";

export const metadata: Metadata = {
  title: professional.it.meta.title,
  description: professional.it.meta.description,
  alternates: {
    canonical: "/it/professional/",
    languages: {
      en: "/professional/",
      it: "/it/professional/",
      "x-default": "/professional/",
    },
  },
  openGraph: {
    type: "profile",
    url: "/it/professional/",
    title: professional.it.meta.title,
    description: professional.it.meta.description,
    locale: "it_IT",
    alternateLocale: ["en_US"],
    images: [{ url: "/og-it.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: professional.it.meta.title,
    description: professional.it.meta.description,
    images: ["/og-it.png"],
  },
};

export default function Page() {
  return <Professional lang="it" />;
}
