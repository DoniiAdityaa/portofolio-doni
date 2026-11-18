import type { Metadata } from "next";

import { getCvPaths } from "@/features/cv/admin-queries";
import { CvManager } from "@/features/cv/components/cv-manager";

export const metadata: Metadata = { title: "CV" };

export default async function AdminCvPage() {
  const paths = await getCvPaths();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">CV</h1>
        <p className="text-muted-foreground">
          The Download CV button serves the file in the visitor&apos;s language.
        </p>
      </div>
      <CvManager paths={paths} />
    </div>
  );
}
