import { createClient } from "@/lib/supabase/server";
import { createExpense, createPayment } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function Financials() {
  const supabase = await createClient();
  const [{ data: payments }, { data: expenses }] = await Promise.all([
    supabase.from("payments").select("*").order("payment_date", { ascending: false }).limit(10),
    supabase.from("expenses").select("*").order("expense_date", { ascending: false }).limit(10),
  ]);
  const pSum = (payments ?? []).reduce((s, p: any) => s + Number(p.amount || 0), 0);
  const eSum = (expenses ?? []).reduce((s, e: any) => s + Number(e.amount || 0), 0);
  return <div className="space-y-6">
    <h1 className="text-2xl font-bold">الإيرادات والمصروفات</h1>
    <div className="grid sm:grid-cols-3 gap-4"><Card title="إجمالي الإيرادات" value={`${pSum.toLocaleString("ar-EG")} ج.م`} tone="text-emerald-600" /><Card title="إجمالي المصروفات" value={`${eSum.toLocaleString("ar-EG")} ج.م`} tone="text-rose-600" /><Card title="صافي الربح" value={`${(pSum - eSum).toLocaleString("ar-EG")} ج.م`} tone="text-brand" /></div>
    <div className="grid lg:grid-cols-2 gap-5"><EntryForm title="تسجيل دفعة / إيراد" action={createPayment} fields={["transaction_id", "amount", "payment_date", "description"]} kind="payment" /><EntryForm title="تسجيل مصروف" action={createExpense} fields={["transaction_id", "amount", "expense_date", "delegate_name", "payment_entity", "description"]} kind="expense" /></div>
    <div className="grid lg:grid-cols-2 gap-5"><Log title="أحدث الإيرادات" rows={payments ?? []} date="payment_date" /><Log title="أحدث المصروفات" rows={expenses ?? []} date="expense_date" /></div>
  </div>;
}

function EntryForm({ title, action, fields, kind }: { title: string; action: (data: FormData) => Promise<void>; fields: string[]; kind: "payment" | "expense" }) {
  const labels: Record<string, string> = { transaction_id: "رقم المعاملة", amount: "المبلغ", payment_date: "تاريخ الدفع", expense_date: "تاريخ المصروف", delegate_name: "اسم المندوب", payment_entity: "جهة الدفع", description: "الوصف" };
  return <form action={action} className="rounded-2xl bg-white border border-border p-5 space-y-3"><h2 className="font-bold">{title}</h2>{fields.map((field) => <div key={field}><label className="block text-sm font-semibold mb-1">{labels[field]}</label>{field === "description" ? <textarea name={field} rows={2} className="input" /> : <input name={field} type={field.includes("date") ? "date" : field === "amount" ? "number" : "text"} step={field === "amount" ? "0.01" : undefined} required={field === "amount"} className="input" />}</div>)}{kind === "payment" && <div><label className="block text-sm font-semibold mb-1">طريقة الدفع</label><select name="payment_method" className="input"><option value="cash">نقدي</option><option value="card">بطاقة</option></select></div>}<button className="w-full rounded-xl bg-brand text-white py-2.5 font-semibold hover:bg-brand-dark">حفظ وتحديث الأرصدة</button></form>;
}
function Log({ title, rows, date }: { title: string; rows: any[]; date: string }) { return <section className="rounded-2xl bg-white border border-border p-5"><h2 className="font-bold mb-3">{title}</h2>{rows.length === 0 ? <p className="text-sm text-muted">لا توجد عمليات بعد.</p> : <div className="space-y-2">{rows.map((row) => <div key={row.id} className="flex items-center justify-between border-b border-border pb-2 text-sm"><span>{row.transaction_id || row.description || "عملية عامة"}<small className="block text-muted">{row[date]}</small></span><strong>{Number(row.amount).toLocaleString("ar-EG")} ج.م</strong></div>)}</div>}</section>; }
function Card({ title, value, tone }: { title: string; value: string; tone: string }) { return <div className="rounded-2xl bg-white border border-border p-5"><div className="text-sm text-muted">{title}</div><div className={`mt-2 text-xl font-extrabold ${tone}`}>{value}</div></div>; }
