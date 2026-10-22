import data from "@/content/now.json";
import type { Lang } from "@/lib/i18n";

type Bilingual = Record<Lang, string>;

export type NowBuilding = {
  id: string;
  title: string;
  meta: string;
  body: Bilingual;
  href?: string | Bilingual;
  cta?: Bilingual;
};

export type NowRelease = {
  name: string;
  date: string;
  meta: Bilingual;
  body: Bilingual;
  href: string;
};

export type NowProject = {
  id: string;
  label: string;
  date: string;
  body: Bilingual;
  href: string;
};

export type NowProjectStats = {
  additions: number;
  deletions: number;
  changedFiles: number;
  contributions: number;
  firstMergedOn: string;
};

export type NowGoal = {
  id: string;
  status: "done" | "active" | "next";
  date?: string;
  body: Bilingual;
};

export type NowStudy = {
  id: string;
  title: string;
  body: Bilingual;
};

export type NowData = {
  updated: string;
  building: NowBuilding[];
  release: NowRelease;
  projects: NowProject[];
  projectStats: { marmotta: NowProjectStats };
  goals: NowGoal[];
  studying: NowStudy[];
};

/** Single source for the Now / Building blocks on the home and profile pages. */
export const now = data as NowData;
