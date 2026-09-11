import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Settings() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });
  const rows = users ?? [];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">المستخدمون والإعدادات</h1>
      <p className="text-sm text-muted">
        لترقية مستخدم إلى مدير: من Supabase → Table Editor → profiles، غيّر <code>role</code> إلى
        <code> admin</code>.
      </p>
      <div className="rounded-2xl bg-white border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="text-start px-5 py-3 font-semibold">الاسم</th>
              <th className="text-start px-5 py-3 font-semibold">الدور</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u: any) => (
              <tr key={u.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium">{u.full_name || u.id}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      u.role === "admin"
                        ? "bg-brand/10 text-brand"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {u.role === "admin" ? "مدير" : "عميل"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
