"use client";

import { useLang, COMPANY } from "@/lib/i18n";

export default function Footer() {
  const { lang, tr } = useLang();
  const year = new Date().getFullYear();
  const name = lang === "ar" ? COMPANY.nameAr : COMPANY.nameEn;

  return (
    <footer className="bg-brand-dark text-white border-t-4 border-accent">
      <div className="mx-auto max-w-6xl px-4 py-12 grid md:grid-cols-3 gap-10">
        <div>
          <div className="inline-block rounded-2xl bg-white p-2.5 shadow-lg ring-1 ring-accent/60">
            <img src="/osool-logo.jpg" alt="Osool" className="h-14 w-auto" />
          </div>
          <p className="mt-4 font-extrabold text-lg text-accent-light">
            {lang === "ar" ? COMPANY.shortAr : COMPANY.shortEn}
          </p>
          <p className="text-sm text-white/65">{tr("footer.tagline")}</p>
        </div>
        <div>
          <h4 className="font-bold mb-1 text-accent-light">{tr("nav.services")}</h4>
          <div className="gold-rule w-16 mb-3 opacity-70" />
          <ul className="text-sm text-white/70 space-y-1.5">
            <li>{lang === "ar" ? "استخراج المستندات" : "Documents"}</li>
            <li>{lang === "ar" ? "البطاقات والجوازات" : "IDs & Passports"}</li>
            <li>{lang === "ar" ? "تجديد النقابات" : "Syndicate renewals"}</li>
            <li>CGFNS</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-1 text-accent-light">{tr("nav.contact")}</h4>
          <div className="gold-rule w-16 mb-3 opacity-70" />
          <ul className="text-sm text-white/70 space-y-1.5">
            <li dir="ltr" className="text-start">📞 {COMPANY.phone}</li>
            <li>📍 {lang === "ar" ? COMPANY.addressAr : COMPANY.addressEn}</li>
            <li>
              <a
                href={COMPANY.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-1 items-center rounded-lg bg-accent px-3 py-1.5 font-bold text-brand-dark hover:bg-accent-light transition-colors"
              >
                💬 {tr("contact.whatsapp")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-white/55">
          © {year} {name} — {tr("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
