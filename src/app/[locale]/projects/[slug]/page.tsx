import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  GlobeIcon,
  ImagesIcon,
  LayersIcon,
  LightbulbIcon,
  type LucideIcon,
  PuzzleIcon,
  ScanSearchIcon,
  SparklesIcon,
  WrenchIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { BrandIcon, findBrandIcon } from "@/components/ui/brand-icon";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/ui/markdown";
import { Skeleton } from "@/components/ui/skeleton";
import { SkillIcon } from "@/components/ui/skill-icon";
import { ProjectGallery } from "@/features/projects/components/project-gallery";
import { ProjectThumbnail } from "@/features/projects/components/project-thumbnail";
import { getProjectBySlug, getPublishedProjectSlugs } from "@/features/projects/queries";
import { formatPeriod } from "@/lib/i18n/dates";
import { localize } from "@/lib/i18n/localize";
import { Link } from "@/lib/i18n/navigation";

/**
 * With Cache Components this must return at least one slug, or the build fails. Before any
 * project is published (e.g. a fresh production database) a placeholder is returned: it has
 * no project, so it renders the 404 page. Real slugs added later are still served on request.
 */
const NO_PROJECTS_PLACEHOLDER_SLUG = "no-projects-yet";

export async function generateStaticParams() {
  const slugs = await getPublishedProjectSlugs();
  return (slugs.length > 0 ? slugs : [NO_PROJECTS_PLACEHOLDER_SLUG]).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [project, locale] = await Promise.all([getProjectBySlug(slug), getLocale()]);
  if (!project) return {};
  return {
    title: localize(project.title, locale),
    description: localize(project.summary, locale),
  };
}

/** Project detail route. The slug is read inside Suspense so navigation stays instant. */
export default function ProjectDetailPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}

/**
 * Project case study (Case 01 §5.4): overview, problem, solution, key features,
 * tech stack, challenges and learnings, gallery, and links. Empty sections are hidden.
 */
async function ProjectDetail({ params }: Pick<PageProps<"/[locale]/projects/[slug]">, "params">) {
  const { slug } = await params;
  const [project, locale, t, tCommon] = await Promise.all([
    getProjectBySlug(slug),
    getLocale(),
    getTranslations("projects"),
    getTranslations("common"),
  ]);
  if (!project) notFound();

  const title = localize(project.title, locale);
  const sections: { key: string; icon: LucideIcon; title: string; body: string }[] = [
    {
      key: "overview",
      icon: ScanSearchIcon,
      title: t("sections.overview"),
      body: localize(project.overview, locale),
    },
    {
      key: "problem",
      icon: PuzzleIcon,
      title: t("sections.problem"),
      body: localize(project.problem, locale),
    },
    {
      key: "solution",
      icon: LightbulbIcon,
      title: t("sections.solution"),
      body: localize(project.solution, locale),
    },
    {
      key: "features",
      icon: SparklesIcon,
      title: t("sections.features"),
      body: localize(project.features, locale),
    },
  ];
  const challenges = localize(project.challenges, locale);

  const links = [
    { href: project.repoUrl, label: t("links.repo"), icon: findBrandIcon("github") },
    { href: project.demoUrl, label: t("links.demo"), icon: undefined },
    { href: project.playStoreUrl, label: t("links.playStore"), icon: findBrandIcon("googleplay") },
    { href: project.appStoreUrl, label: t("links.appStore"), icon: findBrandIcon("appstore") },
  ].filter((link): link is typeof link & { href: string } => Boolean(link.href));

  const gallery = [...project.images]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => ({
      id: image.id,
      alt: localize(image.alt, locale),
      orientation: image.orientation,
      path: image.path,
    }));

  return (
    <article className="space-y-10">
      <Link
        href="/projects"
        className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon
          aria-hidden="true"
          className="size-4 transition-transform group-hover:-translate-x-1"
        />
        {t("backToProjects")}
      </Link>

      <header className="space-y-4">
        <Reveal>
          <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {localize(project.summary, locale)}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-wrap items-center gap-2 text-sm">
          {project.type ? (
            <Badge variant="outline">{localize(project.type.name, locale)}</Badge>
          ) : null}
          {project.category ? (
            <Badge variant="outline">{localize(project.category.name, locale)}</Badge>
          ) : null}
          <Badge variant="secondary">{t(`status.${project.projectStatus}`)}</Badge>
          <span className="font-mono text-xs text-muted-foreground">
            {formatPeriod(project.startedAt, project.endedAt, locale, tCommon("present"))}
          </span>
        </Reveal>
        {links.length > 0 ? (
          <Reveal delay={0.15} className="flex flex-wrap gap-2 pt-1">
            {links.map((link, index) => (
              <Button
                key={link.label}
                asChild
                variant={index === 0 ? "default" : "outline"}
                className="group"
              >
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.icon ? (
                    <BrandIcon icon={link.icon} className="size-4" />
                  ) : (
                    <GlobeIcon aria-hidden="true" />
                  )}
                  {link.label}
                  <ExternalLinkIcon
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </Button>
            ))}
          </Reveal>
        ) : null}
      </header>

      <Reveal delay={0.1}>
        <ProjectThumbnail
          title={title}
          path={project.thumbnailPath}
          priority
          className="rounded-xl border"
        />
      </Reveal>

      {sections
        .filter((section) => section.body)
        .map((section) => (
          <CaseStudySection key={section.key} icon={section.icon} title={section.title}>
            <Markdown>{section.body}</Markdown>
          </CaseStudySection>
        ))}

      {project.techStack.length > 0 ? (
        <CaseStudySection icon={LayersIcon} title={t("techStack")}>
          <ul className="flex flex-wrap gap-2.5">
            {project.techStack.map((skill) => (
              <li key={skill.id}>
                <SkillIcon slug={skill.iconSlug} name={skill.name} />
              </li>
            ))}
          </ul>
        </CaseStudySection>
      ) : null}

      {challenges ? (
        <CaseStudySection icon={WrenchIcon} title={t("sections.challenges")}>
          <Markdown>{challenges}</Markdown>
        </CaseStudySection>
      ) : null}

      {gallery.length > 0 ? (
        <CaseStudySection icon={ImagesIcon} title={t("sections.gallery")}>
          <ProjectGallery title={title} images={gallery} />
        </CaseStudySection>
      ) : null}
    </article>
  );
}

function CaseStudySection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section className="group/section space-y-3 border-t pt-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Icon
            aria-hidden="true"
            className="size-5 text-primary transition-transform duration-300 group-hover/section:scale-110 group-hover/section:-rotate-6"
          />
          {title}
        </h2>
        {children}
      </section>
    </Reveal>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-full max-w-xl" />
      <Skeleton className="aspect-video w-full rounded-xl" />
    </div>
  );
}
