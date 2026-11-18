import type { Metadata } from "next";

import { CategoryManager } from "@/components/admin/category-manager";
import { ContentList } from "@/components/admin/content-list";
import {
  archiveAchievement,
  deleteAchievementCategory,
  reorderAchievementCategories,
  reorderAchievements,
  resetAchievementOrder,
  saveAchievementCategory,
  setAchievementStatus,
} from "@/features/achievements/actions";
import { getAchievementsForAdmin } from "@/features/achievements/admin-queries";
import { getCategories } from "@/lib/actions/category-rows";

export const metadata: Metadata = { title: "Achievements" };

export default async function AdminAchievementsPage() {
  const [{ items, hasManualOrder }, categories] = await Promise.all([
    getAchievementsForAdmin(),
    getCategories("achievement_categories"),
  ]);

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Achievements</h1>
          <p className="text-muted-foreground">
            Certificates and awards. Newest first by default; drag to set your own order.
          </p>
        </div>
        <ContentList
          label="Achievements"
          items={items}
          basePath="/admin/achievements"
          addLabel="Add achievement"
          hasManualOrder={hasManualOrder}
          actions={{
            setStatus: setAchievementStatus,
            archive: archiveAchievement,
            reorder: reorderAchievements,
            resetOrder: resetAchievementOrder,
          }}
        />
      </div>

      <div className="border-t pt-6">
        <CategoryManager
          title="Categories"
          description="Used by the filter on the Achievements page. Drag to reorder."
          singular="category"
          categories={categories}
          actions={{
            save: saveAchievementCategory,
            remove: deleteAchievementCategory,
            reorder: reorderAchievementCategories,
          }}
        />
      </div>
    </div>
  );
}
