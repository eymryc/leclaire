import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "leclaire_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h

function getSecret() {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (!password) return null;
  return password;
}

function sign(payload: string) {
  const secret = getSecret();
  if (!secret) return null;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function isAdminConfigured() {
  return Boolean(getSecret());
}

export function createAdminSessionToken() {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + SESSION_TTL_MS;
  const payload = `ok.${exp}`;
  const sig = sign(payload);
  if (!sig) return null;
  return `${payload}.${sig}`;
}

export function verifyAdminSessionToken(token: string | undefined | null) {
  if (!token || !getSecret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [flag, expStr, sig] = parts;
  if (flag !== "ok") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const payload = `${flag}.${expStr}`;
  const expected = sign(payload);
  if (!expected || expected.length !== sig.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string) {
  const expected = getSecret();
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function requireAdmin() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}
