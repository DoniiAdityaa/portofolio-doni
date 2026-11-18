import { ArrowLeftIcon, BookOpenIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SkillIcon } from "@/components/ui/skill-icon";
import { ProjectThumbnail } from "@/features/projects/components/project-thumbnail";
import { getProjectBySlug, getPublishedProjectSlugs } from "@/features/projects/queries";
import { localize } from "@/lib/i18n/localize";
import { Link } from "@/lib/i18n/navigation";

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [project, locale] = await Promise.all([getProjectBySlug(slug), getLocale()]);
  return project ? { title: localize(project.title, locale) } : {};
}

/**
 * Project detail. M2 later expands this into the full case study
 * (overview, problem, solution, features, challenges, gallery, links).
 */
export default async function ProjectDetailPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { slug } = await params;
  const [project, locale, t] = await Promise.all([
    getProjectBySlug(slug),
    getLocale(),
    getTranslations("projects"),
  ]);
  if (!project) notFound();

  const title = localize(project.title, locale);

  return (
    <article className="space-y-8">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon
          aria-hidden="true"
          className="size-4 transition-transform group-hover:-translate-x-1"
        />
        {t("backToProjects")}
      </Link>

      <PageHeader title={title} description={localize(project.summary, locale)} />

      <Reveal className="flex flex-wrap gap-2">
        {project.category ? (
          <Badge variant="outline">{localize(project.category.name, locale)}</Badge>
        ) : null}
        <Badge variant="secondary">{t(`status.${project.projectStatus}`)}</Badge>
      </Reveal>

      <Reveal delay={0.1}>
        <ProjectThumbnail title={title} className="rounded-xl border" />
      </Reveal>

      <Reveal delay={0.15} className="space-y-3">
        <h2 className="text-lg font-semibold">{t("techStack")}</h2>
        <ul className="flex flex-wrap gap-2.5">
          {project.techStack.map((skill) => (
            <li key={skill.id}>
              <SkillIcon slug={skill.iconSlug} name={skill.name} />
            </li>
          ))}
        </ul>
      </Reveal>

      <EmptyState icon={BookOpenIcon} title={t("caseStudyComingSoon")} />
    </article>
  );
}
