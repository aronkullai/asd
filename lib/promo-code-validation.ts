import { casinos } from "@/lib/casino-data";

const BLOCKED_CODE_PATTERNS = [
  /\bTEST\b/i,
  /\bFAKE\b/i,
  /\bMOCK\b/i,
  /\bDEMO\b/i,
  /\bPLACEHOLDER\b/i,
  /\bSAMPLE\b/i,
  /\bDUMMY\b/i
];

export type PromoCodeInput = {
  id?: string;
  casinoSlug: string;
  code: string;
  label: string;
  benefitTitle?: string;
  benefitDescription?: string;
  bonusType?: string;
  minDeposit?: number | null;
  wageringRequirements?: string | null;
  benefit?: string;
  description?: string;
  conditions?: string;
  source?: string;
  sourceId?: string;
  sourceSiteId?: string;
  isAffiliateOwned?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  priority?: number;
  estimatedValue?: number | null;
  requirements?: string;
  validFrom?: string | null;
  validUntil?: string | null;
  maxUses?: number | null;
  usesSoFar?: number;
  region?: string | null;
};

export function normalizePromoCode(code: string) {
  return code.trim().replace(/\s+/g, "").toUpperCase();
}

export function hasBogusPromoToken(code: string) {
  return BLOCKED_CODE_PATTERNS.some((pattern) => pattern.test(code));
}

export function validatePromoCodeInput(input: PromoCodeInput) {
  const fieldErrors: Record<string, string> = {};
  const casino = casinos.find((item) => item.slug === input.casinoSlug);
  const code = normalizePromoCode(input.code || "");
  const source = String(input.source || input.sourceId || "Manual").trim();
  const label = String(input.label || "").trim();
  const validFrom = input.validFrom ? new Date(input.validFrom) : null;
  const validUntil = input.validUntil ? new Date(input.validUntil) : null;

  if (!casino) fieldErrors.casinoSlug = "Choose a known casino.";
  if (!code) fieldErrors.code = "Code is required.";
  if (code && (code.length < 3 || code.length > 64)) fieldErrors.code = "Code must be 3-64 characters.";
  if (code && hasBogusPromoToken(code)) fieldErrors.code = "Demo, test, mock, fake, or placeholder codes are not allowed.";
  if (!label) fieldErrors.label = "Label is required.";
  if (!source) fieldErrors.source = "Source is required.";
  if (validFrom && Number.isNaN(validFrom.getTime())) fieldErrors.validFrom = "Valid-from date is invalid.";
  if (validUntil && Number.isNaN(validUntil.getTime())) fieldErrors.validUntil = "Valid-until date is invalid.";
  if (validFrom && validUntil && validFrom.getTime() > validUntil.getTime()) {
    fieldErrors.validUntil = "Valid-until must be after valid-from.";
  }
  if (input.maxUses !== null && input.maxUses !== undefined && (!Number.isInteger(Number(input.maxUses)) || Number(input.maxUses) < 0)) {
    fieldErrors.maxUses = "Max uses must be a positive whole number.";
  }
  if (input.usesSoFar !== undefined && (!Number.isInteger(Number(input.usesSoFar)) || Number(input.usesSoFar) < 0)) {
    fieldErrors.usesSoFar = "Uses so far must be a positive whole number.";
  }

  return {
    ok: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    normalized: {
      casinoSlug: input.casinoSlug,
      code,
      label,
      benefit: String(input.benefit || input.benefitTitle || input.description || label).trim(),
      benefitTitle: String(input.benefitTitle || input.label || "").trim(),
      benefitDescription: input.benefitDescription || input.description ? String(input.benefitDescription || input.description).trim() : null,
      bonusType: input.bonusType ? String(input.bonusType).trim() : null,
      minDeposit: input.minDeposit === null || input.minDeposit === undefined ? null : Number(input.minDeposit),
      wageringRequirements: input.wageringRequirements || input.conditions ? String(input.wageringRequirements || input.conditions).trim() : null,
      description: input.description ? String(input.description).trim() : null,
      conditions: input.conditions ? String(input.conditions).trim() : null,
      source,
      sourceId: String(input.sourceId || source).trim(),
      sourceSiteId: String(input.sourceSiteId || input.sourceId || source).trim(),
      isAffiliateOwned: Boolean(input.isAffiliateOwned),
      isVerified: Boolean(input.isVerified),
      isActive: input.isActive !== false,
      priority: Number(input.priority || 0),
      estimatedValue: input.estimatedValue === null || input.estimatedValue === undefined ? null : Number(input.estimatedValue),
      requirements: String(input.requirements || input.conditions || "Check current casino terms before using this code.").trim(),
      validFrom,
      validUntil,
      maxUses: input.maxUses === null || input.maxUses === undefined ? null : Number(input.maxUses),
      usesSoFar: Number(input.usesSoFar || 0),
      region: input.region ? String(input.region).trim().toUpperCase() : null
    }
  };
}
