import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import type { TrustpilotMeta } from "@/lib/types";
import type { TrustpilotSummary } from "@/lib/types";
import { isPlaceholder } from "@/lib/format";

type TrustpilotBadgeProps = {
  casinoName: string;
  trustpilot?: TrustpilotMeta;
  summary?: TrustpilotSummary | null;
};

export function TrustpilotBadge({ casinoName, trustpilot, summary }: TrustpilotBadgeProps) {
  const fallbackUrl = trustpilot?.profileUrl && !isPlaceholder(trustpilot.profileUrl) ? trustpilot.profileUrl : null;
  const profileUrl = summary?.profileUrl || fallbackUrl;

  if (!summary && !profileUrl) return null;

  const copy = summary
    ? `TrustScore ${summary.trustScore.toFixed(1)} / 5 from ${summary.reviewCount.toLocaleString()} reviews`
    : `Trustpilot profile available for ${casinoName}. API summary is not configured yet.`;

  return (
    <div className="rounded-card border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-black text-emerald-900">
          <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-accent" aria-hidden="true" />
          Trustpilot
        </span>
        <Link
          href={profileUrl || "#"}
          target={profileUrl ? "_blank" : undefined}
          rel={profileUrl ? "noopener sponsored" : undefined}
          className="text-sm font-extrabold text-blue-800"
        >
          Read reviews on Trustpilot
        </Link>
      </div>
      <p className="mt-2 text-sm text-emerald-950">{copy}</p>
    </div>
  );
}
