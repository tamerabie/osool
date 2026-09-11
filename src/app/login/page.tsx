"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/lib/actions";

function LoginForm() {
  const params = useSearchParams();
  const error = params.get("error");
  const registered = params.get("registered");

  return (
    <div className="w-full max-w-md rounded-2xl bg-white border border-border p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <img src="/osool-logo.jpg" alt="أصول" className="h-12 w-auto rounded-lg ring-1 ring-border" />
        <span className="font-extrabold text-brand text-xl">أصول</span>
      </div>
      <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
      <p className="text-sm text-muted mt-1">ادخل إلى حسابك لمتابعة معاملاتك</p>

      {registered && (
        <p className="mt-4 rounded-lg bg-green-50 text-green-700 px-4 py-2 text-sm">
          تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 text-red-700 px-4 py-2 text-sm">{error}</p>
      )}

      <form action={signIn} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1.5">البريد الإلكتروني</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">كلمة المرور</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <button className="w-full h-12 rounded-xl bg-brand font-semibold text-white hover:bg-brand-dark transition-colors">
          دخول
        </button>
      </form>

      <p className="mt-5 text-sm text-muted text-center">
        ليس لديك حساب؟{" "}
        <Link href="/register" className="text-brand font-semibold">
          إنشاء حساب
        </Link>
      </p>
      <p className="mt-2 text-center">
        <Link href="/" className="text-xs text-muted hover:text-brand">
          → العودة للموقع
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-surface p-4">
      <Suspense fallback={<div className="h-96 w-full max-w-md" />}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
