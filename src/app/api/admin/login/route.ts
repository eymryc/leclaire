import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSessionToken,
  isAdminConfigured,
  requireAdmin,
  verifyAdminPassword,
} from "@/lib/admin/auth";

export async function GET() {
  const ok = await requireAdmin();
  return NextResponse.json({
    authenticated: ok,
    configured: isAdminConfigured(),
  });
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD manquant. Ajoutez-le dans .env.local puis redémarrez.",
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as {
    password?: string;
  } | null;
  const password = body?.password ?? "";
  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }

  const token = createAdminSessionToken();
  if (!token) {
    return NextResponse.json({ error: "Session impossible." }, { status: 500 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
