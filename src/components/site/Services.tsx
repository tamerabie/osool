"use client";

import { useLang } from "@/lib/i18n";
import { SERVICES } from "@/lib/services";

export default function Services() {
  const { lang, tr } = useLang();

  return (
    <section id="services" className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-accent/15 text-accent-dark px-4 py-1 text-sm font-bold">
            {lang === "ar" ? "ماذا نقدم" : "What we offer"}
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-brand">
            {tr("services.title")}
          </h2>
          <div className="gold-rule mt-4 w-32 mx-auto" />
          <p className="mt-3 text-muted text-lg">{tr("services.subtitle")}</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-border bg-surface p-6 pt-8 overflow-hidden hover:border-accent hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-300"
            >
              <span className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 grid place-items-center rounded-2xl bg-brand text-3xl ring-2 ring-accent/50 shadow-md shadow-brand/20">
                {s.icon}
              </div>
              <h3 className="mt-4 font-bold text-brand group-hover:text-accent-dark transition-colors">
                <span className="text-accent-dark font-extrabold me-1">{String(i + 1).padStart(2, "0")}</span>
                {lang === "ar" ? s.ar.title : s.en.title}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                {lang === "ar" ? s.ar.desc : s.en.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
