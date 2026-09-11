"use server";

import { revalidatePath } from "next/cache";
import { createClient, getSessionUser } from "@/lib/supabase/server";

async function requireAdmin() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") throw new Error("غير مصرّح");
  return session;
}

export async function setTransactionStatus(id: string, status: string, reason?: string) {
  await requireAdmin();
  const supabase = await createClient();
  const patch: Record<string, unknown> = { status };
  if (status === "rejected" && reason) patch.rejection_reason = reason;
  const { error } = await supabase.from("transactions").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/transactions");
  revalidatePath("/admin");
}

export async function rejectTransaction(id: string) { await setTransactionStatus(id, "rejected"); }

export async function acceptWithId(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data: all } = await supabase.from("transactions").select("transaction_id");
  const year = new Date().getFullYear();
  const prefix = `oso${year}`;
  const count = (all ?? []).filter((t: { transaction_id: string | null }) => (t.transaction_id || "").startsWith(prefix)).length;
  const transaction_id = `${prefix}${String(count + 1).padStart(3, "0")}`;
  const { error } = await supabase.from("transactions").update({ transaction_id, status: "in_progress", start_date: new Date().toISOString().slice(0, 10) }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/transactions");
}

export async function createPayment(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("payments").insert({
    transaction_id: String(formData.get("transaction_id") || "").trim() || null,
    amount: Number(formData.get("amount")),
    payment_date: String(formData.get("payment_date") || new Date().toISOString().slice(0, 10)),
    payment_method: String(formData.get("payment_method") || "cash"),
    card_number: String(formData.get("card_number") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/financials");
  revalidatePath("/admin");
}

export async function createExpense(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").insert({
    transaction_id: String(formData.get("transaction_id") || "").trim() || null,
    amount: Number(formData.get("amount")),
    expense_date: String(formData.get("expense_date") || new Date().toISOString().slice(0, 10)),
    delegate_name: String(formData.get("delegate_name") || "").trim() || null,
    payment_entity: String(formData.get("payment_entity") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/financials");
}

export async function createLibraryEntry(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const tags = String(formData.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean);
  const { error } = await supabase.from("library_entries").insert({
    title: String(formData.get("title") || "").trim(),
    content: String(formData.get("content") || "").trim(),
    category: String(formData.get("category") || "other"),
    organization: String(formData.get("organization") || "").trim() || null,
    tags,
    reference_number: String(formData.get("reference_number") || "").trim() || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/library");
}

export async function createAppointment(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("appointments").insert({
    title: String(formData.get("title") || "").trim(),
    transaction_id: String(formData.get("transaction_id") || "").trim() || null,
    appointment_date: String(formData.get("appointment_date")),
    appointment_time: String(formData.get("appointment_time") || "").trim() || null,
    official_entity: String(formData.get("official_entity") || "").trim() || null,
    governorate: String(formData.get("governorate") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}

export async function updateAppointmentStatus(id: string, status: "attended" | "cancelled") {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/appointments");
}
