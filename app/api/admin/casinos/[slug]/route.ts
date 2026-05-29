import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/request-security";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function PUT(request: Request, { params }: RouteProps) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  const { slug } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });

  const casino = await prisma.casino.update({
    where: { slug },
    data: {
      regulator: String(body.regulator || "").trim(),
      licenseInfo: String(body.licenseInfo || "").trim(),
      areaRegulations: String(body.areaRegulations || "").trim(),
      payoutSummary: String(body.payoutSummary || "").trim(),
      supportQuality: String(body.supportQuality || "").trim(),
      supportChannels: String(body.supportChannels || "").trim(),
      safetyFeatures: String(body.safetyFeatures || "").trim(),
      trustpilotProfileUrl: String(body.trustpilotProfileUrl || "").trim(),
      promoFetchSourceUrl: String(body.promoFetchSourceUrl || "").trim()
    }
  });

  return NextResponse.json({ ok: true, casino });
}
