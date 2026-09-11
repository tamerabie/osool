"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ar" | "en";

export const COMPANY = {
  nameAr: "أصول للخدمات الحكومية والاستشارات",
  nameEn: "Osool Government Consultant & Services",
  shortAr: "أصول",
  shortEn: "Osool",
  phone: "01116922660",
  phoneIntl: "+201116922660",
  whatsapp: "https://wa.me/201116922660",
  addressAr: "شارع الخمسين، زهراء المعادي، القاهرة، مصر",
  addressEn: "El-Khamsin St., Zahraa Maadi, Cairo, Egypt",
} as const;

type Dict = Record<string, { ar: string; en: string }>;

export const t: Dict = {
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.services": { ar: "خدماتنا", en: "Services" },
  "nav.why": { ar: "لماذا أصول", en: "Why Osool" },
  "nav.about": { ar: "من نحن", en: "About" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact" },
  "nav.login": { ar: "دخول العملاء", en: "Client Login" },

  "hero.badge": { ar: "خدمات حكومية موثوقة في مصر", en: "Trusted government services in Egypt" },
  "hero.title": {
    ar: "نُنجز معاملاتك الحكومية نيابةً عنك",
    en: "We handle your government paperwork for you",
  },
  "hero.subtitle": {
    ar: "أصول شريكك المتخصص في استخراج المستندات، الاستشارات الحكومية، تجديد اشتراكات النقابات، وملفات اعتماد الشهادات — بدقة وسرعة ومتابعة حتى التسليم.",
    en: "Osool is your specialist partner for document retrieval, government consulting, syndicate renewals and credential attestation files — with accuracy, speed and follow-up until delivery.",
  },
  "hero.cta": { ar: "اطلب خدمتك الآن", en: "Request a service" },
  "hero.cta2": { ar: "تعرّف على خدماتنا", en: "Explore services" },

  "services.title": { ar: "خدماتنا", en: "Our Services" },
  "services.subtitle": {
    ar: "مجموعة متكاملة من الخدمات الحكومية والاستشارية",
    en: "A complete range of government and consulting services",
  },

  "why.title": { ar: "لماذا تختار أصول؟", en: "Why choose Osool?" },
  "why.1.title": { ar: "خبرة حكومية", en: "Government expertise" },
  "why.1.desc": {
    ar: "فريق يعرف مسارات الجهات الرسمية ومتطلباتها بدقة.",
    en: "A team that knows official channels and their requirements.",
  },
  "why.2.title": { ar: "متابعة لحظية", en: "Live tracking" },
  "why.2.desc": {
    ar: "تابع حالة معاملتك خطوة بخطوة عبر لوحة العميل.",
    en: "Follow your transaction step by step from your dashboard.",
  },
  "why.3.title": { ar: "أسعار واضحة", en: "Transparent fees" },
  "why.3.desc": {
    ar: "أتعاب ورسوم محددة مسبقاً بدون مفاجآت.",
    en: "Pre-agreed fees and charges with no surprises.",
  },
  "why.4.title": { ar: "خصوصية وأمان", en: "Privacy & security" },
  "why.4.desc": {
    ar: "بياناتك ومستنداتك في أمان تام وصلاحيات مضبوطة.",
    en: "Your data and documents are fully protected with strict access control.",
  },

  "about.title": { ar: "من نحن", en: "About us" },
  "about.body": {
    ar: "«أصول للخدمات الحكومية والاستشارات» مكتب متخصص في تيسير المعاملات الحكومية للعملاء الأفراد والشركات، بخبرة عملية في التعامل مع الجهات الرسمية في مصر، والتزام بالمواعيد والسرية التامة.",
    en: "Osool Government Consultant & Services is an office specialized in facilitating government transactions for individuals and companies, with hands-on experience dealing with official entities in Egypt, and a commitment to deadlines and full confidentiality.",
  },

  "contact.title": { ar: "تواصل معنا", en: "Contact us" },
  "contact.subtitle": {
    ar: "نسعد بخدمتك — اتصل بنا أو راسلنا عبر واتساب",
    en: "We are happy to serve you — call us or message on WhatsApp",
  },
  "contact.phone": { ar: "الهاتف", en: "Phone" },
  "contact.address": { ar: "العنوان", en: "Address" },
  "contact.whatsapp": { ar: "واتساب", en: "WhatsApp" },
  "contact.name": { ar: "الاسم", en: "Name" },
  "contact.msg": { ar: "رسالتك", en: "Your message" },
  "contact.send": { ar: "إرسال عبر واتساب", en: "Send via WhatsApp" },

  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  "footer.tagline": { ar: "للخدمات الحكومية والاستشارات", en: "Government Consultant & Services" },
};

type Ctx = {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  toggle: () => void;
  tr: (key: keyof typeof t | string) => string;
};

const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("osool-lang");
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    localStorage.setItem("osool-lang", lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => setLangState(l), []);
  const toggle = useCallback(
    () => setLangState((p) => (p === "ar" ? "en" : "ar")),
    []
  );
  const tr = useCallback(
    (key: string) => t[key]?.[lang] ?? key,
    [lang]
  );

  const value = useMemo<Ctx>(
    () => ({ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, toggle, tr }),
    [lang, setLang, toggle, tr]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
