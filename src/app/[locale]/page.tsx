import { Separator } from "@/components/ui/separator";
import { Hero } from "@/features/home/components/hero";
import { FeaturedProjects } from "@/features/projects/components/featured-projects";
import { getSiteSettings } from "@/features/settings/queries";
import { SkillsSection } from "@/features/skills/components/skills-section";

/** Home (Case 01 §5.1): hero → skills grouped by category → up to 3 featured projects. */
export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-12">
      <Hero settings={settings} />
      <Separator />
      <SkillsSection />
      <Separator />
      <FeaturedProjects />
    </div>
  );
}
