import type { Metadata, Viewport } from "next";
import { Alexandria } from "next/font/google";
import { site } from "@/content/site-config";
import "./globals.css";

const font = Alexandria({ subsets: ["arabic", "latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
  icons: { icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }], apple: "/apple-touch-icon.png" },
  openGraph: {
    type: "website", title: site.title, description: site.description, url: site.url,
    locale: "ar_EG", siteName: site.name,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: site.ogAlt }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: [site.ogImage] },
};
export const viewport: Viewport = { themeColor: "#210B13", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={font.className}>{children}</body>
    </html>
  );
}
