"use client";

import { useLang, COMPANY } from "@/lib/i18n";

export default function Header() {
  const { lang, toggle, tr } = useLang();
  const sub = lang === "ar" ? COMPANY.nameAr : COMPANY.nameEn;

  const links = [
    { href: "#home", key: "nav.home" },
    { href: "#services", key: "nav.services" },
    { href: "#why", key: "nav.why" },
    { href: "#about", key: "nav.about" },
    { href: "#contact", key: "nav.contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b-2 border-accent/60 shadow-[0_2px_12px_rgba(11,42,74,0.08)]">
      <div className="mx-auto max-w-6xl px-4 h-[72px] flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <img
            src="/osool-logo.jpg"
            alt={lang === "ar" ? "شعار أصول" : "Osool logo"}
            className="h-12 w-auto rounded-lg"
          />
          <span className="leading-tight hidden sm:block">
            <span className="block font-extrabold text-brand text-lg">
              {lang === "ar" ? COMPANY.shortAr : COMPANY.shortEn}
            </span>
            <span className="block text-[11px] text-muted max-w-[220px] truncate">{sub}</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              className="text-sm font-semibold text-brand/80 hover:text-accent-dark transition-colors"
            >
              {tr(l.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="h-9 px-3 rounded-lg border border-border text-sm font-semibold text-brand hover:bg-surface transition-colors"
            aria-label="Switch language"
          >
            {lang === "ar" ? "EN" : "عربي"}
          </button>
          <a
            href="/login"
            className="hidden sm:inline-flex h-9 items-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark transition-colors shadow-sm"
          >
            {tr("nav.login")}
          </a>
        </div>
      </div>
    </header>
  );
}
