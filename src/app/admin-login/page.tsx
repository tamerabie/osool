"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { adminSignIn } from "@/lib/actions";

function AdminLoginForm() {
  const params = useSearchParams();
  const error = params.get("error");
  return <div className="w-full max-w-md rounded-2xl bg-white border border-border p-8 shadow-sm" dir="rtl"><div className="flex items-center gap-3 mb-6"><img src="/osool-logo.jpg" alt="أصول" className="h-12 w-auto rounded-lg ring-1 ring-border" /><div><div className="font-extrabold text-brand text-xl">أصول</div><div className="text-xs text-muted">الدخول إلى لوحة الإدارة</div></div></div><h1 className="text-2xl font-bold">دخول المدير</h1><p className="text-sm text-muted mt-1">هذه الصفحة مخصصة للمستخدم الإداري فقط.</p>{error && <p className="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</p>}<form action={adminSignIn} className="mt-6 space-y-4"><div><label className="block text-sm font-semibold mb-1.5">اسم المستخدم</label><input name="username" defaultValue="Admin" autoComplete="username" required className="input" /></div><div><label className="block text-sm font-semibold mb-1.5">كلمة المرور</label><input name="password" type="password" autoComplete="current-password" required className="input" /></div><button className="w-full h-12 rounded-xl bg-brand font-semibold text-white hover:bg-brand-dark transition-colors">دخول لوحة الإدارة</button></form><p className="mt-5 text-center"><Link href="/" className="text-xs text-muted hover:text-brand">العودة للموقع</Link></p></div>;
}
export default function AdminLoginPage() { return <main className="min-h-screen grid place-items-center bg-surface p-4"><Suspense fallback={<div className="h-96 w-full max-w-md" />}><AdminLoginForm /></Suspense></main>; }
