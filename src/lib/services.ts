export type Service = {
  icon: string;
  ar: { title: string; desc: string };
  en: { title: string; desc: string };
};

export const SERVICES: Service[] = [
  {
    icon: "📄",
    ar: {
      title: "استخراج المستندات الحكومية",
      desc: "إنهاء واستخراج جميع المستندات والوثائق الرسمية من الجهات الحكومية.",
    },
    en: {
      title: "Government Documents",
      desc: "Retrieving and finalizing all official documents from government entities.",
    },
  },
  {
    icon: "🏛️",
    ar: {
      title: "الاستشارات الحكومية",
      desc: "استشارات متخصصة حول الإجراءات والمتطلبات القانونية لكل معاملة.",
    },
    en: {
      title: "Government Consulting",
      desc: "Expert advice on procedures and legal requirements for each transaction.",
    },
  },
  {
    icon: "🪪",
    ar: {
      title: "البطاقات الشخصية",
      desc: "إصدار وتجديد بطاقة الرقم القومي للمواطنين.",
    },
    en: {
      title: "National ID Cards",
      desc: "Issuing and renewing national ID cards for citizens.",
    },
  },
  {
    icon: "🛂",
    ar: {
      title: "الجوازات",
      desc: "إصدار وتجديد جوازات السفر ومتابعة الإجراءات.",
    },
    en: {
      title: "Passports",
      desc: "Issuing and renewing passports and following up on procedures.",
    },
  },
  {
    icon: "💍",
    ar: {
      title: "وثائق الزواج والطلاق",
      desc: "توثيق واستخراج عقود الزواج ووثائق الطلاق.",
    },
    en: {
      title: "Marriage & Divorce",
      desc: "Documenting and retrieving marriage contracts and divorce records.",
    },
  },
  {
    icon: "👶",
    ar: {
      title: "شهادات الميلاد ومواليد الخارج",
      desc: "استخراج شهادات الميلاد وتسجيل مواليد المصريين في الخارج.",
    },
    en: {
      title: "Birth Certificates",
      desc: "Birth certificates and registration of Egyptians born abroad.",
    },
  },
  {
    icon: "🎓",
    ar: {
      title: "تجديد اشتراكات النقابات",
      desc: "تجديد اشتراكات نقابات الأطباء والمهندسين والتجاريين.",
    },
    en: {
      title: "Syndicate Renewals",
      desc: "Renewing memberships for doctors, engineers and commercial syndicates.",
    },
  },
  {
    icon: "🗂️",
    ar: {
      title: "ملفات اعتماد الشهادات CGFNS",
      desc: "تجهيز ملفات اعتماد الشهادات المهنية (CGFNS) للأطقم الطبية.",
    },
    en: {
      title: "CGFNS Credential Files",
      desc: "Preparing CGFNS credential evaluation files for medical professionals.",
    },
  },
];
