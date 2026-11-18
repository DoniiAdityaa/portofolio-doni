import type { Metadata } from "next";

import { getSiteSettingsForAdmin } from "@/features/settings/admin-queries";
import { SettingsForm } from "@/features/settings/components/settings-form";

export const metadata: Metadata = { title: "Site settings" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Site settings</h1>
        <p className="text-muted-foreground">Your profile, links, and search engine details.</p>
      </div>
      <SettingsForm defaultValues={settings} />
    </div>
  );
}
