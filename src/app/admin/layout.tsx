import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/me");

  const links = [
    { href: "/admin", label: "لوحة التحكم" },
    { href: "/admin/transactions", label: "المعاملات" },
    { href: "/admin/financials", label: "الإيرادات والمصروفات" },
    { href: "/admin/library", label: "مكتبة أصول" },
    { href: "/admin/appointments", label: "تقويم المراجعات" },
    { href: "/admin/assistant", label: "المساعد OAA" },
    { href: "/admin/settings", label: "الإعدادات" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface">
      <aside className="md:w-64 bg-brand-dark text-white md:min-h-screen">
        <div className="p-5">
          <div className="inline-block rounded-xl bg-white p-2 ring-1 ring-accent/60">
            <img src="/osool-logo.jpg" alt="أصول" className="h-11 w-auto" />
          </div>
          <div className="mt-2 text-[11px] text-accent-light/80 font-semibold">لوحة الإدارة</div>
        </div>
        <nav className="px-3 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <header className="bg-white border-b border-border h-16 flex items-center justify-between px-6">
          <span className="font-semibold text-muted">{session.fullName || session.user.email}</span>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/me" className="hover:text-brand">حسابي</Link>
            <form action={signOut}>
              <button className="rounded-lg border border-border px-3 py-1.5 font-semibold hover:bg-surface">
                خروج
              </button>
            </form>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
