"use client";

import { useLang, COMPANY } from "@/lib/i18n";

export default function Hero() {
  const { lang, tr } = useLang();

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 500px at 85% -10%, rgba(201,162,39,0.16), transparent 60%), radial-gradient(900px 420px at 10% 110%, rgba(11,42,74,0.10), transparent 60%), var(--color-surface)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-start order-2 md:order-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-accent-light ring-1 ring-accent/50">
            <span className="w-2 h-2 rounded-full bg-accent" />
            {tr("hero.badge")}
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-extrabold leading-[1.25] text-brand">
            {tr("hero.title")}
          </h1>
          <div className="gold-rule mt-5 w-40 mx-auto md:mx-0" />
          <p className="mt-5 text-lg text-muted leading-relaxed">
            {tr("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center rounded-xl bg-brand px-7 font-semibold text-white hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30 ring-1 ring-accent/40"
            >
              {tr("hero.cta")}
            </a>
            <a
              href="#services"
              className="inline-flex h-12 items-center rounded-xl border-2 border-accent/60 bg-white px-7 font-semibold text-brand hover:bg-surface transition-colors"
            >
              {tr("hero.cta2")}
            </a>
          </div>
        </div>

        <div className="relative order-1 md:order-2">
          <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-accent/40 via-transparent to-brand/20 blur-xl" />
          <figure className="relative rounded-[1.75rem] overflow-hidden ring-4 ring-accent/70 shadow-2xl shadow-brand/30 bg-white">
            <img
              src="/osool-crest.jpg"
              alt={lang === "ar" ? "شعار أصول الرسمي" : "Official Osool crest"}
              className="w-full h-auto object-cover"
            />
          </figure>
          <div className="absolute -bottom-5 start-6 end-6 sm:end-auto rounded-2xl bg-brand text-white px-5 py-3.5 shadow-xl ring-1 ring-accent/60 flex items-center gap-4">
            {[
              { n: "8+", ar: "خدمات", en: "Services" },
              { n: "🇪🇬", ar: "كل المحافظات", en: "All Egypt" },
              { n: "24/7", ar: "دعم", en: "Support" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-extrabold text-accent-light">{s.n}</div>
                <div className="text-[11px] text-white/80">{lang === "ar" ? s.ar : s.en}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
