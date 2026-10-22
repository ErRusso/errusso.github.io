import type { Metadata } from "next";
import { CvDocument } from "@/components/CvDocument";

export const metadata: Metadata = {
  title: "CV application security — English",
  description: "One-page application security CV of Simone Russo: OWASP review, reproducible lab, remediation and regression tests.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CvDocument lang="en" track="appsec" />;
}
