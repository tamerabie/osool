import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendMail } from "@/lib/graph";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const [{ data: txs }, { data: payments }, { data: expenses }] =
    await Promise.all([
      supabase.from("transactions").select("*"),
      supabase.from("payments").select("*"),
      supabase.from("expenses").select("*"),
    ]);

  const totalAgreed = (txs ?? []).reduce(
    (s, t) => s + (Number(t.agreed_fees) || 0),
    0
  );
  const pendingAgreed = (txs ?? [])
    .filter(
      (t) => t.status === "pending_review" || t.status === "accepted_agreement"
    )
    .reduce((s, t) => s + (Number(t.agreed_fees) || 0), 0);
  const cash = (payments ?? [])
    .filter((p) => p.payment_method === "cash")
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const card = (payments ?? [])
    .filter((p) => p.payment_method === "card")
    .reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const expTotal = (expenses ?? []).reduce(
    (s, e) => s + (Number(e.amount) || 0),
    0
  );

  const lines = [
    "التقرير اليومي - أصول للخدمات الحكومية والاستشارات",
    `التاريخ: ${new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" })}`,
    "-----------------------------------",
    `إجمالي الأتعاب المحصلة: ${totalAgreed} ج.م`,
    `إجمالي الأتعاب المعلقة: ${pendingAgreed} ج.م`,
    `مبالغ الكاش: ${cash} ج.م`,
    `مبالغ البطاقات البنكية: ${card} ج.م`,
    `إجمالي المصروفات (الرسوم/المندوبين): ${expTotal} ج.م`,
    `عدد المعاملات: ${(txs ?? []).length}`,
    "-----------------------------------",
    ...(txs ?? []).map(
      (t) =>
        `- ${t.transaction_id || "بدون رقم"} | ${t.transaction_type} | ${t.status} | متبقي: ${t.remaining || 0} ج.م`
    ),
  ];

  try {
    await sendMail(
      process.env.ADMIN_EMAIL || "",
      "التقرير اليومي - أصول",
      lines.join("\n")
    );
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
