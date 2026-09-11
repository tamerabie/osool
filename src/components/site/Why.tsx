"use client";

import { useLang } from "@/lib/i18n";

export default function Why() {
  const { tr } = useLang();
  const items = [
    { icon: "🏛️", t: "why.1.title", d: "why.1.desc" },
    { icon: "📡", t: "why.2.title", d: "why.2.desc" },
    { icon: "💰", t: "why.3.title", d: "why.3.desc" },
    { icon: "🔒", t: "why.4.title", d: "why.4.desc" },
  ];

  return (
    <section id="why" className="py-20 bg-brand relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0 2px, transparent 2px 18px)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white text-center">
          {tr("why.title")}
        </h2>
        <div className="gold-rule mt-4 w-32 mx-auto" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/[0.06] p-6 border border-accent/30 backdrop-blur hover:bg-white/[0.1] hover:border-accent transition-all"
            >
              <div className="w-12 h-12 grid place-items-center rounded-xl bg-accent text-2xl shadow-md shadow-black/30">
                {it.icon}
              </div>
              <h3 className="mt-4 font-bold text-accent-light">{tr(it.t)}</h3>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">{tr(it.d)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
