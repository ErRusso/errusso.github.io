import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/lib/site";

export const dynamic = "force-static";

const languages = (en: string, it: string) => ({ en, it, "x-default": en });

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: `${site.url}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: { languages: languages(`${site.url}/`, `${site.url}/it/`) },
  };

  const italianHome = {
    url: `${site.url}/it/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
    alternates: { languages: languages(`${site.url}/`, `${site.url}/it/`) },
  };

  const caseStudies = projects.flatMap((project) => {
    const en = `${site.url}/work/${project.slug}/`;
    const it = `${site.url}/it/work/${project.slug}/`;
    return [
      {
        url: en,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.8,
        alternates: { languages: languages(en, it) },
      },
      {
        url: it,
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.7,
        alternates: { languages: languages(en, it) },
      },
    ];
  });

  const securityPages = [
    {
      url: `${site.url}/security/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: languages(`${site.url}/security/`, `${site.url}/it/security/`) },
    },
    {
      url: `${site.url}/it/security/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: languages(`${site.url}/security/`, `${site.url}/it/security/`) },
    },
    {
      url: `${site.url}/security/lab-idor/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.8,
      alternates: {
        languages: languages(`${site.url}/security/lab-idor/`, `${site.url}/it/security/lab-idor/`),
      },
    },
    {
      url: `${site.url}/it/security/lab-idor/`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.7,
      alternates: {
        languages: languages(`${site.url}/security/lab-idor/`, `${site.url}/it/security/lab-idor/`),
      },
    },
  ];

  const professionalPages = [
    {
      url: `${site.url}/professional/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
      alternates: {
        languages: languages(`${site.url}/professional/`, `${site.url}/it/professional/`),
      },
    },
    {
      url: `${site.url}/it/professional/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: languages(`${site.url}/professional/`, `${site.url}/it/professional/`),
      },
    },
  ];

  return [home, italianHome, ...caseStudies, ...securityPages, ...professionalPages];
}
