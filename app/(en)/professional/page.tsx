import type { Metadata } from "next";
import { Professional } from "@/components/Professional";
import { professional } from "@/content/professional";

export const metadata: Metadata = {
  title: professional.en.meta.title,
  description: professional.en.meta.description,
  alternates: {
    canonical: "/professional/",
    languages: {
      en: "/professional/",
      it: "/it/professional/",
      "x-default": "/professional/",
    },
  },
  openGraph: {
    type: "profile",
    url: "/professional/",
    title: professional.en.meta.title,
    description: professional.en.meta.description,
    locale: "en_US",
    alternateLocale: ["it_IT"],
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: professional.en.meta.title,
    description: professional.en.meta.description,
    images: ["/og.png"],
  },
};

export default function Page() {
  return <Professional lang="en" />;
}
