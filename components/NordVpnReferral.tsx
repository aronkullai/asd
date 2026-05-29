import Link from "next/link";
import Image from "next/image";
import { nordVpnConfig } from "@/config/nordvpnConfig";

export function NordVpnReferral({ compact = false }: { compact?: boolean }) {
  const hasAffiliateUrl = Boolean(nordVpnConfig.affiliateUrl);
  const ctaClassName = "inline-flex min-h-11 items-center justify-center rounded-card bg-accent px-4 py-3 text-sm font-extrabold text-white hover:no-underline";

  return (
    <section className={`rounded-card border border-line bg-white ${compact ? "p-4" : "p-5"} shadow-sm`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card border border-line bg-white">
            <Image src="/icons/social/nordvpn.png" alt="" width={36} height={36} className="object-contain" />
          </span>
          <div>
            <h2 className={`${compact ? "text-base" : "text-xl"} font-black text-navy`}>Private browsing partner</h2>
            <p className="m-0 max-w-3xl text-sm text-muted">
              NordVPN can help protect everyday browsing on public networks. Add your affiliate URL to activate the offer button. Do not use a VPN to bypass casino location rules, KYC, or local gambling laws.
            </p>
          </div>
        </div>
        {hasAffiliateUrl ? (
          <Link
            href={nordVpnConfig.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className={ctaClassName}
          >
            Get NordVPN
          </Link>
        ) : (
          <span className={`${ctaClassName} cursor-not-allowed opacity-70`} aria-label="NordVPN affiliate URL is not configured yet">
            Add NordVPN link
          </span>
        )}
      </div>
    </section>
  );
}
