import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import type { PartnerRegistrationBonus } from "@/config/partnerRegistrationBonuses";

export function PartnerBonusNote({ bonus }: { bonus: PartnerRegistrationBonus | null }) {
  if (!bonus) return null;

  return (
    <div className="rounded-card border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-100">
      <div className="flex gap-3">
        <FontAwesomeIcon icon={faGift} className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
        <div>
          <strong className="block">{bonus.title}</strong>
          <span>{bonus.description}</span>
        </div>
      </div>
    </div>
  );
}
