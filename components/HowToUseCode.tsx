import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import type { CodeUseGuide } from "@/config/howToUseCodes";

export function HowToUseCode({ guide }: { guide: CodeUseGuide }) {
  return (
    <div className="rounded-card border border-line bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-2 text-xs font-black uppercase tracking-wide text-accent-dark dark:text-emerald-300">How to use a code</p>
      <p className="text-sm text-muted dark:text-slate-300">{guide.intro}</p>
      <ol className="mt-4 grid gap-3">
        {guide.steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-sm text-muted dark:text-slate-300">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-xs font-black text-accent-dark dark:bg-emerald-400/10 dark:text-emerald-200">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex gap-2 rounded-card bg-soft p-3 text-xs font-bold text-muted dark:bg-slate-950 dark:text-slate-300">
        <FontAwesomeIcon icon={faCircleCheck} className="mt-0.5 h-4 w-4 text-accent" aria-hidden="true" />
        PromoGuard copies the code, then sends you to the casino. Always confirm the live terms before depositing.
      </div>
    </div>
  );
}
