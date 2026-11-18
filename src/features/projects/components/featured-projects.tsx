import { ArrowRightIcon, FolderGit2Icon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { SectionHeader } from "@/components/layout/section-header";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { Link } from "@/lib/i18n/navigation";

import { getFeaturedProjects } from "../queries";
import { ProjectCard } from "./project-card";

/** Home section with up to three featured projects. Hidden when none are featured. */
export async function FeaturedProjects() {
  const [projects, t] = await Promise.all([
    getFeaturedProjects(),
    getTranslations("home.featured"),
  ]);

  if (projects.length === 0) return null;

  return (
    <section aria-labelledby="featured-title" className="space-y-6">
      <Reveal>
        <SectionHeader
          id="featured-title"
          icon={FolderGit2Icon}
          title={t("title")}
          description={t("description")}
          action={
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {t("viewAll")}
              <ArrowRightIcon
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          }
        />
      </Reveal>
      <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <RevealItem key={project.id} className="h-full">
            <ProjectCard project={project} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
