import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: { en: "/", it: "/it/", "x-default": "/" },
  },
};

export default function Page() {
  return <HomePage lang="en" />;
}
