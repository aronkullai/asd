import { NextResponse } from "next/server";
import { createSession, validateEmail, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(`login:${ip}`, 10, 15 * 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!validateEmail(email) || !password) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } }).catch(() => null);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
