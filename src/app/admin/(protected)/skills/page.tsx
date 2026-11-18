import type { Metadata } from "next";

import { getSkillsForAdmin } from "@/features/skills/admin-queries";
import { SkillsManager } from "@/features/skills/components/skills-manager";

export const metadata: Metadata = { title: "Skills" };

export default async function AdminSkillsPage() {
  const { categories, skills } = await getSkillsForAdmin();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Skills</h1>
        <p className="text-muted-foreground">
          Tech shown on Home and linked to projects. Drag to set the order.
        </p>
      </div>
      <SkillsManager categories={categories} skills={skills} />
    </div>
  );
}
