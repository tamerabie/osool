import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Financials() {
  const supabase = await createClient();
  const [{ data: payments }, { data: expenses }] = await Promise.all([
    supabase.from("payments").select("*").order("payment_date", { ascending: false }),
    supabase.from("expenses").select("*").order("expense_date", { ascending: false }),
  ]);
  const pSum = (payments ?? []).reduce((s, p: any) => s + (Number(p.amount) || 0), 0);
  const eSum = (expenses ?? []).reduce((s, e: any) => s + (Number(e.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">الإيرادات والمصروفات</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card title="إجمالي الإيرادات" value={`${pSum.toLocaleString("ar-EG")} ج.م`} tone="text-emerald-600" />
        <Card title="إجمالي المصروفات" value={`${eSum.toLocaleString("ar-EG")} ج.م`} tone="text-rose-600" />
        <Card title="صافي الربح" value={`${(pSum - eSum).toLocaleString("ar-EG")} ج.م`} tone="text-brand" />
      </div>
      <p className="text-sm text-muted">
        إضافة المدفوعات والمصروفات متاحة في مرحلة لاحقة من لوحة الإدارة.
      </p>
    </div>
  );
}

function Card({ title, value, tone }: { title: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl bg-white border border-border p-5">
      <div className="text-sm text-muted">{title}</div>
      <div className={`mt-2 text-xl font-extrabold ${tone}`}>{value}</div>
    </div>
  );
}
