import data from "@/content/now.json";
import type { Lang } from "@/lib/i18n";

type Bilingual = Record<Lang, string>;

export type NowRepo = {
  id: string;
  name: string;
  /** owner/name on GitHub. */
  repo: string;
  language: string;
  /** Last push, used as the "last activity" date. */
  date: string;
  body: Bilingual;
  href: string;
};

export type NowIssue = {
  id: string;
  /** Repository name without the owner, used as the issue context. */
  repo: string;
  number: number;
  title: string;
  /** Closed date for done issues, opened date for upcoming ones. */
  date: string;
  href: string;
};

export type NowRelease = {
  tag: string;
  /** Tag without the leading v, e.g. "1.2.0". */
  version: string;
  name: string;
  date: string;
  href: string;
};

export type NowAudit = {
  packages: number;
  vulnerabilities: number;
};

export type NowProjectStats = {
  additions: number;
  deletions: number;
  changedFiles: number;
  contributions: number;
  firstMergedOn: string;
};

export type NowPipeduckStats = {
  testFunctions: number;
  assertions: number;
  trackedFiles: number;
  cppKb: number;
  /** Instances of the gcc/clang × GUI build matrix in the latest CI run. */
  buildJobs?: number;
};

export type NowSiteMetrics = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  transferredKb: number;
  lcpSeconds: number;
  cls: number;
};

export type NowSite = {
  lighthouseVersion: string;
  date: string;
  mobile: NowSiteMetrics;
  desktop: NowSiteMetrics;
};

export type NowData = {
  updated: string;
  release: NowRelease;
  audit: NowAudit;
  repos: NowRepo[];
  issues: { done: NowIssue[]; next: NowIssue[] };
  projectStats: {
    marmotta?: NowProjectStats;
    pipeduck?: NowPipeduckStats;
  };
  /** Written by scripts/lighthouse-sync.mjs after the first build. */
  site?: NowSite;
};

/** Single source for the Now / Building blocks on the home and profile pages. */
export const now = data as NowData;
