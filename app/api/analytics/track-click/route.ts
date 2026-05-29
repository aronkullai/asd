import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  console.log("[affiliate-click]", {
    casinoName: body?.casinoName,
    casinoSlug: body?.casinoSlug,
    promoCode: body?.promoCode,
    href: body?.href,
    source: body?.source,
    timestamp: body?.timestamp || new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
