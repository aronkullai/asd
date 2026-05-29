"use client";

import Image from "next/image";
import { socialLinks } from "@/config/socialLinks";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { label: "Discord", href: socialLinks.discordUrl, file: "discord" },
  { label: "Telegram", href: socialLinks.telegramUrl, file: "telegram" },
  { label: "X", href: socialLinks.xUrl, file: "x" }
];

type SocialLinksProps = {
  className?: string;
  compact?: boolean;
  showLabels?: boolean;
  showPlaceholders?: boolean;
};

export function SocialLinks({ className = "", compact = false, showLabels = false, showPlaceholders = true }: SocialLinksProps) {
  const { theme } = useTheme();
  const prefix = theme === "dark" ? "d" : "l";
  const visibleLinks = showPlaceholders ? links : links.filter((link) => link.href);

  if (!visibleLinks.length) return null;

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`} aria-label="PromoGuard community links">
      {visibleLinks.map((link) => {
        const body = (
          <>
            <Image src={`/icons/social/${prefix}_${link.file}.png`} alt="" width={compact ? 18 : 22} height={compact ? 18 : 22} className="object-contain" />
            {showLabels ? <span>{link.label}</span> : null}
          </>
        );
        const className = `inline-flex min-h-10 items-center justify-center gap-2 rounded-card border border-line bg-white px-3 py-2 text-sm font-extrabold text-navy shadow-sm transition hover:-translate-y-0.5 hover:bg-soft dark:bg-slate-900 dark:text-slate-100 ${showLabels ? "" : compact ? "w-10" : "w-11"}`;

        if (!link.href) {
          return (
            <span
              key={link.label}
              className={`${className} opacity-70`}
              title={`Set NEXT_PUBLIC_${link.label === "X" ? "X" : link.label.toUpperCase()}_URL to activate`}
              aria-label={`${link.label} link not configured yet`}
            >
              {body}
            </span>
          );
        }

        return (
          <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          aria-label={link.label}
        >
          {body}
        </a>
        );
      })}
    </div>
  );
}
