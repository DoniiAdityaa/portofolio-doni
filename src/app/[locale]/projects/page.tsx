import { FolderGit2Icon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard } from "@/features/projects/components/project-card";
import { ProjectFilter } from "@/features/projects/components/project-filter";
import {
  getPublishedProjects,
  getUsedProjectCategories,
  getUsedProjectTypes,
} from "@/features/projects/queries";
import { localize } from "@/lib/i18n/localize";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("nav");
  return { title: t("projects") };
}

/** Projects (Case 01 §5.4): searchable, filterable grid of project cards. */
export default async function ProjectsPage() {
  const [projects, types, categories, locale, tNav, tPages] = await Promise.all([
    getPublishedProjects(),
    getUsedProjectTypes(),
    getUsedProjectCategories(),
    getLocale(),
    getTranslations("nav"),
    getTranslations("pages"),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title={tNav("projects")} description={tPages("projects.description")} />
      {projects.length === 0 ? (
        <EmptyState icon={FolderGit2Icon} title={tPages("comingSoonTitle")} />
      ) : (
        <Reveal>
          <ProjectFilter
            types={types.map((type) => ({ id: type.id, label: localize(type.name, locale) }))}
            categories={categories.map((category) => ({
              id: category.id,
              label: localize(category.name, locale),
            }))}
            items={projects.map((project) => ({
              id: project.id,
              typeId: project.typeId,
              categoryId: project.categoryId,
              searchText:
                `${localize(project.title, locale)} ${localize(project.summary, locale)}`.toLowerCase(),
              node: <ProjectCard project={project} />,
            }))}
          />
        </Reveal>
      )}
    </div>
  );
}
