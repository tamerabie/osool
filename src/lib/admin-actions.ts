"use server";

import { revalidatePath } from "next/cache";
import { createClient, getSessionUser } from "@/lib/supabase/server";

async function requireAdmin() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") throw new Error("غير مصرّح");
  return session;
}

export async function setTransactionStatus(
  id: string,
  status: string,
  reason?: string
) {
  await requireAdmin();
  const supabase = await createClient();
  const patch: Record<string, unknown> = { status };
  if (status === "rejected" && reason) patch.rejection_reason = reason;
  const { error } = await supabase.from("transactions").update(patch).eq("id", id);
  if (error) throw error.message;
  revalidatePath("/admin/transactions");
  revalidatePath("/admin");
}

export async function rejectTransaction(id: string) {
  await setTransactionStatus(id, "rejected");
}

export async function acceptWithId(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: all } = await supabase.from("transactions").select("transaction_id");
  const year = new Date().getFullYear();
  const prefix = `oso${year}`;
  const count = (all ?? []).filter((t: any) =>
    (t.transaction_id || "").startsWith(prefix)
  ).length;
  const transaction_id = `${prefix}${String(count + 1).padStart(3, "0")}`;
  const today = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from("transactions")
    .update({ transaction_id, status: "in_progress", start_date: today })
    .eq("id", id);
  if (error) throw error.message;
  revalidatePath("/admin/transactions");
}
