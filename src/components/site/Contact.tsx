"use client";

import { useState } from "react";
import { useLang, COMPANY } from "@/lib/i18n";

export default function Contact() {
  const { lang, tr } = useLang();
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const waHref = `${COMPANY.whatsapp}?text=${encodeURIComponent(
    `${lang === "ar" ? "الاسم" : "Name"}: ${name}\n${msg}`
  )}`;

  return (
    <section id="contact" className="py-20 bg-surface">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand">
            {tr("contact.title")}
          </h2>
          <div className="gold-rule mt-4 w-32 mx-auto" />
          <p className="mt-3 text-muted text-lg">{tr("contact.subtitle")}</p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <InfoRow icon="📞" label={tr("contact.phone")} value={COMPANY.phone} ltr />
            <InfoRow
              icon="📍"
              label={tr("contact.address")}
              value={lang === "ar" ? COMPANY.addressAr : COMPANY.addressEn}
            />
            <a
              href={COMPANY.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-white border border-border p-5 hover:border-brand transition-colors"
            >
              <span className="text-2xl">💬</span>
              <span>
                <span className="block text-sm text-muted">{tr("contact.whatsapp")}</span>
                <span className="block font-bold text-foreground" dir="ltr">
                  {COMPANY.phoneIntl}
                </span>
              </span>
            </a>
          </div>

          <form
            className="rounded-2xl bg-white border border-border p-6 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block text-sm font-semibold mb-1.5">{tr("contact.name")}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">{tr("contact.msg")}</label>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-border px-4 py-2.5 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full h-12 items-center justify-center rounded-xl bg-brand font-semibold text-white hover:bg-brand-dark transition-colors"
            >
              {tr("contact.send")}
            </a>
          </form>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon,
  label,
  value,
  ltr,
}: {
  icon: string;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white border border-border p-5">
      <span className="text-2xl">{icon}</span>
      <span>
        <span className="block text-sm text-muted">{label}</span>
        <span className="block font-bold text-foreground" dir={ltr ? "ltr" : undefined}>
          {value}
        </span>
      </span>
    </div>
  );
}
