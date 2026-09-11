import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Library() {
  const supabase = await createClient();
  const { data: entries } = await supabase
    .from("library_entries")
    .select("*")
    .order("created_at", { ascending: false });
  const rows = entries ?? [];

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">مكتبة أصول</h1>
      {rows.length === 0 ? (
        <p className="rounded-2xl bg-white border border-border p-6 text-center text-muted">
          لا توجد مدخلات بعد. الإضافة عبر واجهة الإدارة في المرحلة التالية.
        </p>
      ) : (
        <div className="space-y-3">
          {rows.map((e: any) => (
            <div key={e.id} className="rounded-2xl bg-white border border-border p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold">{e.title}</h3>
                {e.category && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-brand/10 text-brand font-semibold">
                    {e.category}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted line-clamp-3">{e.content}</p>
              {e.tags?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {e.tags.map((t: string) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded bg-surface text-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
