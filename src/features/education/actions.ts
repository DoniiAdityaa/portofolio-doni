"use server";

import { updateTag } from "next/cache";
import { z } from "zod";

import { runAdminAction } from "@/lib/actions/admin-action";
import {
  archiveRow,
  clearOrder,
  reorderSchema,
  rowIdSchema,
  rowStatusSchema,
  saveOrder,
  setRowStatus,
} from "@/lib/actions/content-rows";
import { type ActionResult, ok } from "@/lib/actions/result";
import { removeMediaFiles } from "@/lib/actions/storage";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { educationFormSchema } from "./schema";

function expireEducation() {
  updateTag(CACHE_TAGS.education);
}

export async function saveEducation(input: unknown): Promise<ActionResult<{ id: string }>> {
  return runAdminAction(educationFormSchema, input, async (values) => {
    const supabase = await createSupabaseServerClient();
    const row = {
      institution: values.institution,
      logo_path: values.logoPath,
      degree: values.degree,
      start_date: values.startDate,
      end_date: values.endDate || null,
      notes: values.notes,
      status: values.status,
    };

    if (values.id) {
      const { data: current, error: readError } = await supabase
        .from("educations")
        .select("logo_path")
        .eq("id", values.id)
        .single();
      if (readError) throw readError;

      const { error } = await supabase.from("educations").update(row).eq("id", values.id);
      if (error) throw error;
      if (current.logo_path !== values.logoPath) await removeMediaFiles([current.logo_path]);

      expireEducation();
      return ok({ id: values.id });
    }

    const { data, error } = await supabase.from("educations").insert(row).select("id").single();
    if (error) throw error;

    expireEducation();
    return ok({ id: data.id });
  });
}

export async function setEducationStatus(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowStatusSchema, input, async ({ id, status }) => {
    await setRowStatus("educations", id, status);
    expireEducation();
    return ok();
  });
}

export async function archiveEducation(input: unknown): Promise<ActionResult> {
  return runAdminAction(rowIdSchema, input, async ({ id }) => {
    await archiveRow("educations", id);
    expireEducation();
    return ok();
  });
}

export async function reorderEducations(input: unknown): Promise<ActionResult> {
  return runAdminAction(reorderSchema, input, async ({ ids }) => {
    await saveOrder("educations", ids);
    expireEducation();
    return ok();
  });
}

export async function resetEducationOrder(): Promise<ActionResult> {
  return runAdminAction(z.undefined(), undefined, async () => {
    await clearOrder("educations");
    expireEducation();
    return ok();
  });
}
