"use client";

import { useLang, COMPANY } from "@/lib/i18n";

export default function About() {
  const { lang, tr } = useLang();

  return (
    <section id="about" className="py-20 bg-surface">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-10 items-center">
        <figure className="relative">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-tr from-brand/25 via-transparent to-accent/30 blur-xl" />
          <img
            src="/osool-logo.jpg"
            alt={lang === "ar" ? "شعار أصول" : "Osool logo"}
            className="relative rounded-[1.75rem] ring-2 ring-border shadow-xl bg-white w-full h-auto"
          />
          <figcaption className="absolute -bottom-4 start-8 rounded-xl bg-accent px-4 py-2 text-sm font-bold text-brand-dark shadow-lg">
            {lang === "ar" ? "منذ اليوم الأول — ثقة والتزام" : "Trusted since day one"}
          </figcaption>
        </figure>

        <div className="rounded-3xl bg-gradient-to-br from-brand to-brand-dark text-white p-8 md:p-10 ring-1 ring-accent/50 shadow-2xl shadow-brand/30">
          <span className="inline-block rounded-full bg-accent/20 text-accent-light px-3 py-1 text-xs font-bold ring-1 ring-accent/50">
            {lang === "ar" ? "قصتنا" : "Our story"}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold">{tr("about.title")}</h2>
          <div className="gold-rule mt-4 w-28" />
          <p className="mt-4 text-lg leading-relaxed text-white/90">
            {tr("about.body")}
          </p>
          <div className="mt-8 space-y-3 text-white/90">
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-accent/25 px-4 py-3">
              <span className="text-accent-light text-xl">📍</span>
              {lang === "ar" ? COMPANY.addressAr : COMPANY.addressEn}
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-accent/25 px-4 py-3">
              <span className="text-accent-light text-xl">📞</span>
              <span dir="ltr" className="font-bold tracking-wider">{COMPANY.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
