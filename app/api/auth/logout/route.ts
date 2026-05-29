import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { isSameOriginRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  await clearSession();
  return NextResponse.json({ ok: true });
}
