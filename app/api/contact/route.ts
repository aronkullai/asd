import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.name || !body?.email || !body?.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Production integration point:
  // Send via transactional email provider or store in PostgreSQL.
  console.log("[contact]", {
    name: body.name,
    email: body.email,
    message: body.message,
    receivedAt: new Date().toISOString()
  });

  return NextResponse.json({ ok: true });
}
