"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { runAdminAction } from "@/lib/actions/admin-action";
import {
  archiveRow,
  clearOrder,
  reorderSchema,
  replaceSkillLinks,
  rowIdSchema,
  rowStatusSchema,
  saveOrder,
  setRowStatus,
} from "@/lib/actions/content-rows";
import { type ActionResult, ok } from "@/lib/actions/result";
import { removeMediaFiles } from "@/lib/actions/storage";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { experienceFormSchema } from "./schema";

function expireCareer() {
  updateTag(CACHE_TAGS.career);
}

/** Creates or updates an experience and its skill links; returns its id. */
export async function saveExperience(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAdminAction(experienceFormSchema, input, async (values) => {
    const supabase = await createSupabaseServerClient();
    const row = {
      company: values.company,
      logo_path: values.logoPath,
      position: values.position,
      type: values.type,
      start_date: values.startDate,
      end_date: values.endDate || null,
      responsibilities: values.responsibilities,
      learnings: values.learnings,
      impact: values.impact,
      status: values.status,
    };

    let id = values.id;
    let oldLogo: string | null = null;
    if (id) {
      const { data: current, error: readError } = await supabase
        .from("experiences")
        .select("logo_path")
        .eq("id", id)
        .single();
      if (readError) throw readError;
      oldLogo = current.logo_path;

      const { error } = await supabase.from("experiences").update(row).eq("id", id);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("experiences").insert(row).select("id").single();
      if (error) throw error;
      id = data.id;
    }

    await replaceSkillLinks("experience_skills", "experience_id", id, values.skillIds);
    if (oldLogo !== values.logoPath) await removeMediaFiles([oldLogo]);

    expireCareer();
    return ok({ id });
  });
}

export async function setExperienceStatus(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowStatusSchema, input, async ({ id, status }) => {
    await setRowStatus("experiences", id, status);
    expireCareer();
    return ok();
  });
}

export async function archiveExperience(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    await archiveRow("experiences", id);
    expireCareer();
    return ok();
  });
}

export async function reorderExperiences(input: unknown): Promise<ActionResult> {
  return runAdminAction(reorderSchema, input, async ({ ids }) => {
    await saveOrder("experiences", ids);
    expireCareer();
    return ok();
  });
}

export async function resetExperienceOrder(): Promise<ActionResult> {
  return runAdminAction(z.undefined(), undefined, async () => {
    await clearOrder("experiences");
    expireCareer();
    return ok();
  });
}
