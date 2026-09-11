import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { COMPANY } from "@/lib/i18n";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${COMPANY.nameAr} | ${COMPANY.nameEn}`,
  description:
    "أصول للخدمات الحكومية والاستشارات — استخراج المستندات، الاستشارات الحكومية، تجديد اشتراكات النقابات، وملفات اعتماد الشهادات CGFNS.",
  keywords: [
    "أصول",
    "خدمات حكومية",
    "استخراج مستندات",
    "CGFNS",
    "تجديد نقابات",
    "Osool",
    "government services Egypt",
  ],
  openGraph: {
    title: `${COMPANY.nameAr} | ${COMPANY.nameEn}`,
    description: "شريكك الموثوق لإنجاز المعاملات الحكومية في مصر.",
    type: "website",
    locale: "ar_EG",
    images: [{ url: "/osool-logo.jpg", width: 1200, height: 630 }],
  },
  icons: {
    icon: "/osool-logo.jpg",
    apple: "/osool-logo.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B2A4A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-cairo)]">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
