import { NextResponse } from "next/server";
import { getCasinosWithDbOverrides } from "@/lib/casino-service";
import { getBestPromoCodesForCasinoWithDb } from "@/lib/promo-code-db";
import { getConfiguredAffiliateLink } from "@/lib/promo-code-service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const casinoSlug = url.searchParams.get("casinoSlug");
  const casinoList = await getCasinosWithDbOverrides();
  const targetCasinos = casinoSlug ? casinoList.filter((casino) => casino.slug === casinoSlug) : casinoList;

  const groups = await Promise.all(
    targetCasinos.map(async (casino) => ({
      casinoSlug: casino.slug,
      casinoName: casino.name,
      affiliateLink: getConfiguredAffiliateLink(casino.slug),
      promos: await getBestPromoCodesForCasinoWithDb(casino.slug)
    }))
  );

  return NextResponse.json({ ok: true, groups });
}
