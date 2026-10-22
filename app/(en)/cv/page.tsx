import type { Metadata } from "next";
import { CvDocument } from "@/components/CvDocument";

export const metadata: Metadata = {
  title: "CV full-stack — English",
  description: "One-page full-stack CV of Simone Russo: product work, APIs, database, auth, tests and CI.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CvDocument lang="en" track="fullstack" />;
}
