import type { Metadata } from "next";
import { SecurityNotes } from "@/components/SecurityNotes";
import { security } from "@/content/security";

export const metadata: Metadata = {
  title: security.en.meta.title,
  description: security.en.meta.description,
  alternates: {
    canonical: "/security/",
    languages: { en: "/security/", it: "/it/security/", "x-default": "/security/" },
  },
  openGraph: {
    title: security.en.meta.title,
    description: security.en.meta.description,
    url: "/security/",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <SecurityNotes lang="en" />;
}
