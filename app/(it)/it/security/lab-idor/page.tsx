import type { Metadata } from "next";
import { SecurityLab } from "@/components/SecurityLab";
import { lab } from "@/content/lab";

export const metadata: Metadata = {
  title: lab.it.meta.title,
  description: lab.it.meta.description,
  alternates: {
    canonical: "/it/security/lab-idor/",
    languages: {
      en: "/security/lab-idor/",
      it: "/it/security/lab-idor/",
      "x-default": "/security/lab-idor/",
    },
  },
  openGraph: {
    title: lab.it.meta.title,
    description: lab.it.meta.description,
    url: "/it/security/lab-idor/",
    locale: "it_IT",
    images: [{ url: "/og-it.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <SecurityLab lang="it" />;
}
