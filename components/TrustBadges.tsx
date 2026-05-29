import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCertificate, faLock, faShieldHalved, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const badges = [
  { icon: faCertificate, label: "Licensed & regulated" },
  { icon: faShieldHalved, label: "Trustpilot-informed" },
  { icon: faLock, label: "SSL-secured comparison" },
  { icon: faTriangleExclamation, label: "18+ responsible gambling" }
];

export function TrustBadges() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {badges.map((badge) => (
        <div key={badge.label} className="flex items-center gap-3 rounded-card border border-line bg-white p-4 shadow-sm">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-card bg-emerald-50 text-accent-dark">
            <FontAwesomeIcon icon={badge.icon} className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-black text-navy">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
