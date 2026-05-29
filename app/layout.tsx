import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  applicationName: siteConfig.name,
  title: {
    default: "PromoGuard | Trust-first casino ratings",
    template: "%s | PromoGuard"
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon",
    apple: "/apple-icon"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
