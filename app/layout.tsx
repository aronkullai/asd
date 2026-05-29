import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://promoguard.bet"),
  applicationName: siteConfig.name,
  title: {
    default: "PromoGuard | Trust-first casino ratings",
    template: "%s | PromoGuard"
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "PromoGuard | Trust-first casino ratings",
    description: siteConfig.description,
    url: "https://promoguard.bet"
  },
  twitter: {
    card: "summary_large_image",
    title: "PromoGuard | Trust-first casino ratings",
    description: siteConfig.description
  },
  icons: {
    icon: "/icon",
    apple: "/apple-icon"
  }
};

const themeScript = `
(() => {
  try {
    const saved = localStorage.getItem("promoguard-theme");
    const theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  } catch {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <AuthProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
