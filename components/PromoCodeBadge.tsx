type PromoCodeBadgeProps = {
  code: string;
  compact?: boolean;
};

export function PromoCodeBadge({ code, compact = false }: PromoCodeBadgeProps) {
  return (
    <div className="rounded-card border border-dashed border-amber-500 bg-white px-3 py-2 text-center font-black text-amber-950">
      <span className={compact ? "text-base" : "text-xl"}>{code}</span>
    </div>
  );
}
