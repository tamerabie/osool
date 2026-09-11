import { createClient } from "@/lib/supabase/server";
import { STATUS_LABELS } from "@/lib/constants";
import { acceptWithId, rejectTransaction } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminTransactions({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("*")
    .order("created_at", { ascending: false });
  if (sp.status) query = query.eq("status", sp.status);
  const { data: txs } = await query;
  const rows = txs ?? [];

  const filters = ["", "pending_review", "in_progress", "completed", "rejected"];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">المعاملات</h1>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <a
            key={f || "all"}
            href={f ? `/admin/transactions?status=${f}` : "/admin/transactions"}
            className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              (sp.status || "") === f
                ? "bg-brand text-white border-brand"
                : "bg-white border-border text-muted hover:border-brand"
            }`}
          >
            {f ? STATUS_LABELS[f]?.ar : "الكل"}
          </a>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="text-start px-5 py-3 font-semibold">العميل</th>
              <th className="text-start px-5 py-3 font-semibold">النوع</th>
              <th className="text-start px-5 py-3 font-semibold">المحافظة</th>
              <th className="text-start px-5 py-3 font-semibold">الحالة</th>
              <th className="text-start px-5 py-3 font-semibold">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted">
                  لا توجد معاملات.
                </td>
              </tr>
            ) : (
              rows.map((t: any) => {
                const st = STATUS_LABELS[t.status] ?? { ar: t.status, color: "bg-slate-100 text-slate-600" };
                const reviewable = t.status === "pending_review";
                return (
                  <tr key={t.id} className="border-t border-border align-top">
                    <td className="px-5 py-3 font-medium">
                      {t.client_name}
                      {t.description && (
                        <div className="text-xs text-muted font-normal mt-1 line-clamp-2">
                          {t.description}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted">{t.transaction_type}</td>
                    <td className="px-5 py-3 text-muted">{t.governorate}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${st.color}`}>
                        {st.ar}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {reviewable ? (
                        <div className="flex gap-2">
                          <form action={acceptWithId.bind(null, t.id)}>
                            <button className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
                              قبول وترقيم
                            </button>
                          </form>
                          <form action={rejectTransaction.bind(null, t.id)}>
                            <button className="text-xs px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700">
                              رفض
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">{t.transaction_id || "—"}</span>
                      )}
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
