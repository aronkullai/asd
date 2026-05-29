import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "promoguard_session";
const SESSION_DAYS = 30;
const BCRYPT_ROUNDS = Number(process.env.AUTH_BCRYPT_ROUNDS || 12);

function passwordWithPepper(password: string) {
  return `${password}${process.env.AUTH_PASSWORD_PEPPER || ""}`;
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(passwordWithPepper(password), BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, storedHash: string) {
  if (storedHash.startsWith("$2")) {
    return bcrypt.compareSync(passwordWithPepper(password), storedHash);
  }

  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  return original.length === candidate.length && timingSafeEqual(original, candidate);
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password: string) {
  return getPasswordErrors(password).length === 0;
}

export function getPasswordErrors(password: string) {
  const errors: string[] = [];
  if (password.length < 10) errors.push("Password must be at least 10 characters.");
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~;]/.test(password)) errors.push("Password must include at least one special symbol.");
  if (!/[0-9]/.test(password)) errors.push("Password must include at least one number.");
  if (!/[A-Z]/.test(password)) errors.push("Password must include at least one uppercase letter.");
  if (!/[a-z]/.test(password)) errors.push("Password must include at least one lowercase letter.");
  return errors;
}

export async function createSession(userId: string) {
  const id = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  await prisma.session.create({ data: { id, userId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  const session = await prisma.session.findFirst({
    where: { id: sessionId, expiresAt: { gt: new Date() } },
    include: { user: true }
  }).catch(() => null);

  return session?.user || null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } }).catch(() => undefined);
  }
  cookieStore.delete(SESSION_COOKIE);
}
