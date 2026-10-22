import type { Metadata } from "next";
import { CvDocument } from "@/components/CvDocument";

export const metadata: Metadata = {
  title: "CV application security — Italiano",
  description: "CV application security di una pagina di Simone Russo: review OWASP, lab riproducibile, remediation e test di regressione.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CvDocument lang="it" track="appsec" />;
}
