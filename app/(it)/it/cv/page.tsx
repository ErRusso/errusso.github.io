import type { Metadata } from "next";
import { CvDocument } from "@/components/CvDocument";

export const metadata: Metadata = {
  title: "CV full-stack — Italiano",
  description: "CV full-stack di una pagina di Simone Russo: prodotto, API, database, auth, test e CI.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CvDocument lang="it" track="fullstack" />;
}
