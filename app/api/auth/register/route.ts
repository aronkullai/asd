import { NextResponse } from "next/server";
import { createSession, getPasswordErrors, hashPassword, validateEmail } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";
import { isSameOriginRequest } from "@/lib/request-security";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(`register:${ip}`, 5, 15 * 60_000);
  if (!rate.ok) {
    return NextResponse.json({ error: "Too many registration attempts. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  const confirmPassword = String(body?.confirmPassword || "");
  const acceptedTerms = Boolean(body?.acceptedTerms);

  const fieldErrors: Record<string, string> = {};
  if (!validateEmail(email)) fieldErrors.email = "Enter a valid email.";
  const passwordErrors = getPasswordErrors(password);
  if (passwordErrors.length) fieldErrors.password = passwordErrors[0];
  if (password !== confirmPassword) fieldErrors.confirmPassword = "Passwords do not match.";
  if (!acceptedTerms) fieldErrors.acceptedTerms = "Confirm you are 18+ and accept the terms.";

  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", fieldErrors }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } }).catch(() => null);
  if (existing) return NextResponse.json({ error: "An account already exists for this email." }, { status: 409 });

  const user = await prisma.user.create({
    data: { email, passwordHash: hashPassword(password) }
  });

  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
