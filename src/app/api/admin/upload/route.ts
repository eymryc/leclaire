import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireAdmin } from "@/lib/admin/auth";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/jpg"]);
const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Formats acceptés : JPG, PNG, WebP." },
      { status: 400 }
    );
  }
  if (file.size > 4 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image trop lourde (max 4 Mo)." },
      { status: 400 }
    );
  }

  const hint = String(form.get("name") ?? file.name);
  const base = slugify(hint.replace(/\.[^.]+$/, "")) || "monture";
  const ext = EXT[file.type] ?? "jpg";
  const filename = `${base}-${Date.now().toString(36)}.${ext}`;
  const dir = path.join(process.cwd(), "public/images/catalogue");
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);

  const url = `/images/catalogue/${filename}`;
  return NextResponse.json({ ok: true, url, filename });
}
