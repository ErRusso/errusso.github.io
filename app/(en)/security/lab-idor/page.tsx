import type { Metadata } from "next";
import { SecurityLab } from "@/components/SecurityLab";
import { lab } from "@/content/lab";

export const metadata: Metadata = {
  title: lab.en.meta.title,
  description: lab.en.meta.description,
  alternates: {
    canonical: "/security/lab-idor/",
    languages: {
      en: "/security/lab-idor/",
      it: "/it/security/lab-idor/",
      "x-default": "/security/lab-idor/",
    },
  },
  openGraph: {
    title: lab.en.meta.title,
    description: lab.en.meta.description,
    url: "/security/lab-idor/",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <SecurityLab lang="en" />;
}
