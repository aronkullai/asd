import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getAffiliateConfigBySlug } from "@/config/affiliateConfig";
import { getCurrentUser } from "@/lib/auth";
import { casinos } from "@/lib/casino-data";
import { normalizePromoCode, validatePromoCodeInput } from "@/lib/promo-code-validation";
import { prisma } from "@/lib/prisma";
import { isSameOriginRequest } from "@/lib/request-security";

function parseCsv(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"" && quoted && next === "\"") {
      cell += "\"";
      index += 1;
    } else if (char === "\"") {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  return rows;
}

function hasUsableDatabaseUrl() {
  const url = process.env.DATABASE_URL || "";
  return Boolean(url && !url.includes("USER:PASSWORD") && !url.includes("HOST:5432"));
}

async function ensureCasino(slug: string) {
  const casino = casinos.find((item) => item.slug === slug);
  if (!casino) return null;
  const affiliateConfig = getAffiliateConfigBySlug(slug);

  await prisma.casino.upsert({
    where: { slug },
    update: { name: casino.name, affiliateLink: affiliateConfig?.affiliateLink || "" },
    create: {
      id: casino.id,
      slug,
      name: casino.name,
      affiliateLink: affiliateConfig?.affiliateLink || "",
      trustpilotProfileUrl: casino.trustpilot.profileUrl,
      promoFetchSourceType: casino.fetchMetadata.sourceType,
      promoFetchSourceUrl: casino.fetchMetadata.sourceUrl
    }
  });
  return casino;
}

export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }
  if (!hasUsableDatabaseUrl()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const text = file && typeof file !== "string"
    ? await file.text()
    : String(formData.get("csv") || "");

  if (!text.trim()) return NextResponse.json({ ok: false, error: "CSV file or csv field is required." }, { status: 400 });

  const [headers = [], ...rows] = parseCsv(text);
  const normalizedHeaders = headers.map((header) => header.trim());
  const imported = [];
  const errors: string[] = [];

  for (let index = 0; index < rows.length; index += 1) {
    const values = Object.fromEntries(normalizedHeaders.map((header, column) => [header, rows[index][column]?.trim() || ""]));
    const validation = validatePromoCodeInput({
      casinoSlug: values.casinoSlug,
      code: values.code,
      label: values.label,
      benefit: values.benefit,
      description: values.description,
      conditions: values.conditions,
      source: values.source || "Manual",
      sourceId: values.sourceId || values.source || "Manual",
      isAffiliateOwned: values.isAffiliateOwned === "true",
      isVerified: values.isVerified === "true",
      isActive: values.isActive !== "false",
      priority: Number(values.priority || 0),
      estimatedValue: values.estimatedValue ? Number(values.estimatedValue) : null,
      requirements: values.requirements,
      validFrom: values.validFrom || null,
      validUntil: values.validUntil || null,
      maxUses: values.maxUses ? Number(values.maxUses) : null,
      usesSoFar: Number(values.usesSoFar || 0),
      region: values.region || null
    });

    if (!validation.ok) {
      errors.push(`Row ${index + 2}: ${Object.values(validation.fieldErrors).join(" ")}`);
      continue;
    }

    const casino = await ensureCasino(validation.normalized.casinoSlug);
    if (!casino) {
      errors.push(`Row ${index + 2}: Unknown casino.`);
      continue;
    }

    const now = new Date();
    const promo = await prisma.promoCode.upsert({
      where: {
        casinoSlug_code_sourceId: {
          casinoSlug: validation.normalized.casinoSlug,
          code: normalizePromoCode(validation.normalized.code),
          sourceId: validation.normalized.sourceId
        }
      },
      update: { ...validation.normalized, casinoId: casino.id, lastUpdatedAt: now },
      create: {
        id: randomUUID(),
        casinoId: casino.id,
        ...validation.normalized,
        discoveredAt: now,
        lastCheckedAt: now,
        lastUpdatedAt: now
      }
    });

    imported.push(promo);
  }

  return NextResponse.json({ ok: errors.length === 0, imported: imported.length, errors });
}
