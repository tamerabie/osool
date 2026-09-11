import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getSessionUser } from "@/lib/supabase/server";
import TransactionForm from "@/app/me/TransactionForm";
import { signOut } from "@/lib/actions";
import {
  TRANSACTION_TYPES,
  GOVERNORATES,
  STATUS_LABELS,
} from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function MePage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  const sp = await searchParams;

  const supabase = await createClient();
  const { data: txs } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-border sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/osool-logo.jpg" alt="أصول" className="h-10 w-auto rounded-lg" />
            <span className="font-extrabold text-brand">أصول</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted hidden sm:inline">{session.fullName || session.user.email}</span>
            {session.role === "admin" && (
              <Link href="/admin" className="rounded-lg bg-brand-dark text-white px-3 py-1.5 font-semibold">
                لوحة الإدارة
              </Link>
            )}
            <form action={signOut}>
              <button className="rounded-lg border border-border px-3 py-1.5 font-semibold hover:bg-surface">
                خروج
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 grid md:grid-cols-2 gap-8">
        <section className="rounded-2xl bg-white border border-border p-6">
          <h2 className="text-lg font-bold">معاملة جديدة</h2>
          {sp.created && (
            <p className="mt-3 rounded-lg bg-green-50 text-green-700 px-3 py-2 text-sm">
              تم إرسال معاملتك بنجاح، وهي بانتظار المراجعة.
            </p>
          )}
          {sp.error && (
            <p className="mt-3 rounded-lg bg-red-50 text-red-700 px-3 py-2 text-sm">{sp.error}</p>
          )}
          <TransactionForm types={[...TRANSACTION_TYPES]} governorates={[...GOVERNORATES]} />
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4">معاملاتي</h2>
          <div className="space-y-3">
            {!txs || txs.length === 0 ? (
              <p className="rounded-2xl bg-white border border-border p-6 text-center text-muted">
                لا توجد معاملات بعد.
              </p>
            ) : (
              txs.map((t: any) => {
                const st = STATUS_LABELS[t.status] ?? { ar: t.status, color: "bg-slate-100 text-slate-600" };
                return (
                  <div key={t.id} className="rounded-2xl bg-white border border-border p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-foreground">{t.transaction_type}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${st.color}`}>
                        {st.ar}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted">
                      <span>{t.governorate}</span>
                      {t.transaction_id && <span> · {t.transaction_id}</span>}
                    </div>
                    {t.description && (
                      <p className="mt-2 text-sm text-foreground/80 line-clamp-2">{t.description}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Field({ label, name, required }: { label: string; name: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <input
        name={name}
        required={required}
        className="w-full rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}</label>
      <select
        name={name}
        required
        className="w-full rounded-xl border border-border px-4 py-2.5 bg-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      >
        <option value="" disabled>
          اختر...
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
