import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/CaseStudy";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: `${project.name.en} — ${project.kicker.en}`,
    description: project.copy.en.summary,
    alternates: {
      canonical: `/work/${project.slug}/`,
      languages: {
        en: `/work/${project.slug}/`,
        it: `/it/work/${project.slug}/`,
        "x-default": `/work/${project.slug}/`,
      },
    },
    openGraph: {
      title: `${project.name.en} — ${project.kicker.en}`,
      description: project.copy.en.summary,
      url: `/work/${project.slug}/`,
      locale: "en_US",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <CaseStudy lang="en" project={project} />;
}
