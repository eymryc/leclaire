import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  parseProductInput,
  readProducts,
  upsertProduct,
} from "@/lib/catalog/productStore";

function revalidateCatalog() {
  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/sitemap.xml");
  revalidatePath("/produit", "layout");
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const products = await readProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = parseProductInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const existing = await readProducts();
  if (existing.some((p) => p.slug === parsed.product.slug)) {
    return NextResponse.json(
      { error: "Ce slug existe déjà. Choisissez-en un autre." },
      { status: 409 }
    );
  }

  const products = await upsertProduct(parsed.product);
  revalidateCatalog();
  return NextResponse.json({ ok: true, product: parsed.product, products });
}
