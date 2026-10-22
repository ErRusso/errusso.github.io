import type { Metadata } from "next";
import { SecurityNotes } from "@/components/SecurityNotes";
import { security } from "@/content/security";

export const metadata: Metadata = {
  title: security.it.meta.title,
  description: security.it.meta.description,
  alternates: {
    canonical: "/it/security/",
    languages: { en: "/security/", it: "/it/security/", "x-default": "/security/" },
  },
  openGraph: {
    title: security.it.meta.title,
    description: security.it.meta.description,
    url: "/it/security/",
    locale: "it_IT",
    images: [{ url: "/og-it.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <SecurityNotes lang="it" />;
}
