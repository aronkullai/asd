import { randomUUID } from "crypto";
import { promoSources } from "@/lib/promo-sources";
import { validatePromoCodeInput } from "@/lib/promo-code-validation";
import { prisma } from "@/lib/prisma";
import type { Casino } from "@/lib/types";

export async function syncPromoSourcesForCasino(casino: Casino) {
  const results = [];
  const now = new Date();

  for (const source of promoSources) {
    let imported = 0;
    const errors: string[] = [];

    try {
      const codes = await source.fetchPromoCodesForCasino(casino);
      for (const code of codes) {
        const validation = validatePromoCodeInput({ ...code, casinoSlug: casino.slug, sourceId: code.sourceId || source.id });
        if (!validation.ok) {
          errors.push(`${code.code || "unknown"}: ${Object.values(validation.fieldErrors).join(" ")}`);
          continue;
        }

        await prisma.promoCode.upsert({
          where: {
            casinoSlug_code_sourceId: {
              casinoSlug: casino.slug,
              code: validation.normalized.code,
              sourceId: validation.normalized.sourceId
            }
          },
          update: {
            ...validation.normalized,
            casinoId: casino.id,
            lastCheckedAt: now,
            lastUpdatedAt: now
          },
          create: {
            id: randomUUID(),
            casinoId: casino.id,
            ...validation.normalized,
            discoveredAt: now,
            lastCheckedAt: now,
            lastUpdatedAt: now
          }
        });
        imported += 1;
      }
      await prisma.promoCode.updateMany({
        where: {
          casinoSlug: casino.slug,
          sourceId: source.id,
          code: { notIn: codes.map((code) => validationSafeCode(code.code)) }
        },
        data: { isActive: false, lastCheckedAt: now, lastUpdatedAt: now }
      });
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Unknown provider error");
    }

    results.push({ sourceId: source.id, imported, errors });
  }

  return results;
}

function validationSafeCode(code: string) {
  return code.trim().replace(/\s+/g, "").toUpperCase();
}
