import { ArrowUpRightIcon } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { TiltCard } from "@/components/motion/tilt-card";
import { Badge } from "@/components/ui/badge";
import { BrandIcon, findBrandIcon } from "@/components/ui/brand-icon";
import { localize } from "@/lib/i18n/localize";
import { Link } from "@/lib/i18n/navigation";

import type { ProjectWithRelations } from "../queries";
import { ProjectThumbnail } from "./project-thumbnail";

/** Project card: thumbnail, title, summary, tech icons, category, and status. */
export async function ProjectCard({ project }: { project: ProjectWithRelations }) {
  const locale = await getLocale();
  const t = await getTranslations("projects");
  const title = localize(project.title, locale);

  return (
    <TiltCard className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ProjectThumbnail title={title} path={project.thumbnailPath} />
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-medium">{title}</h3>
            <ArrowUpRightIcon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
            />
          </div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {localize(project.summary, locale)}
          </p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
            <ul aria-label={t("techStack")} className="flex items-center gap-1.5">
              {project.techStack.map((skill) => {
                const icon = findBrandIcon(skill.iconSlug);
                return icon ? (
                  <li key={skill.id} title={skill.name}>
                    <BrandIcon icon={icon} colored className="size-4" />
                    <span className="sr-only">{skill.name}</span>
                  </li>
                ) : null;
              })}
            </ul>
            <div className="flex gap-1.5">
              {project.type ? (
                <Badge variant="outline">{localize(project.type.name, locale)}</Badge>
              ) : null}
              <Badge variant="secondary">{t(`status.${project.projectStatus}`)}</Badge>
            </div>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
