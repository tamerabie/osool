import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ data: txs }, { data: payments }] = await Promise.all([
    supabase.from("transactions").select("*").order("created_at", { ascending: false }),
    supabase.from("payments").select("amount"),
  ]);

  const all = txs ?? [];
  const pending = all.filter((t: any) => t.status === "pending_review").length;
  const running = all.filter((t: any) => t.status === "in_progress").length;
  const revenue = (payments ?? []).reduce((s: number, p: any) => s + (Number(p.amount) || 0), 0);

  const stats = [
    { label: "إجمالي المعاملات", value: all.length, icon: "📊" },
    { label: "بانتظار المراجعة", value: pending, icon: "⏳" },
    { label: "قيد التنفيذ", value: running, icon: "🚀" },
    { label: "الإيرادات المحصّلة", value: `${revenue.toLocaleString("ar-EG")} ج.م`, icon: "💰" },
  ];

  const recent = all.slice(0, 8);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl bg-white border border-border p-5">
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-3 text-2xl font-extrabold text-foreground">{s.value}</div>
            <div className="text-sm text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border font-bold">أحدث المعاملات</div>
        <table className="w-full text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="text-start px-5 py-3 font-semibold">العميل</th>
              <th className="text-start px-5 py-3 font-semibold">النوع</th>
              <th className="text-start px-5 py-3 font-semibold">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-muted">
                  لا توجد معاملات بعد.
                </td>
              </tr>
            ) : (
              recent.map((t: any) => {
                const st = STATUS_LABELS[t.status] ?? { ar: t.status, color: "bg-slate-100 text-slate-600" };
                return (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-5 py-3 font-medium">{t.client_name}</td>
                    <td className="px-5 py-3 text-muted">{t.transaction_type}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${st.color}`}>
                        {st.ar}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
