"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/me");
}

export async function adminSignIn(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const expectedUsername = process.env.ADMIN_USERNAME || "Admin";
  const adminEmail = process.env.ADMIN_EMAIL;
  if (username !== expectedUsername || !adminEmail) {
    redirect(`/admin-login?error=${encodeURIComponent("بيانات الدخول غير صحيحة أو لم يتم إعداد ADMIN_EMAIL")}`);
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: adminEmail, password });
  if (error) redirect(`/admin-login?error=${encodeURIComponent("بيانات الدخول غير صحيحة")}`);
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", (await supabase.auth.getUser()).data.user?.id || "").single();
  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    redirect(`/admin-login?error=${encodeURIComponent("الحساب ليس مديراً")}`);
  }
  redirect("/admin");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("fullName") || "");
  const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
  if (error) redirect(`/register?error=${encodeURIComponent(error.message)}`);
  redirect("/login?registered=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const record = { user_id: user.id, created_by: user.id, client_name: formData.get("client_name") as string, transaction_type: formData.get("transaction_type") as string, governorate: formData.get("governorate") as string, description: formData.get("description") as string, status: "pending_review", files: JSON.parse(String(formData.get("files") || "[]")) };
  const { error } = await supabase.from("transactions").insert(record);
  if (error) redirect(`/me?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/me");
  redirect("/me?created=1");
}
