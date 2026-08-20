import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import {
  deleteProduct,
  parseProductInput,
  readProducts,
  upsertProduct,
} from "@/lib/catalog/productStore";

type Ctx = { params: Promise<{ slug: string }> };

function revalidateCatalog(slug?: string) {
  revalidatePath("/");
  revalidatePath("/catalogue");
  revalidatePath("/sitemap.xml");
  revalidatePath("/produit", "layout");
  if (slug) revalidatePath(`/produit/${slug}`);
}

export async function GET(_request: Request, ctx: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const products = await readProducts();
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PUT(request: Request, ctx: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const body = await request.json().catch(() => null);
  const parsed = parseProductInput(body, { requireSlug: true });
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const existing = await readProducts();
  if (!existing.some((p) => p.slug === slug)) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  if (
    parsed.product.slug !== slug &&
    existing.some((p) => p.slug === parsed.product.slug)
  ) {
    return NextResponse.json(
      { error: "Ce nouveau slug est déjà utilisé." },
      { status: 409 }
    );
  }

  const products = await upsertProduct(parsed.product, slug);
  revalidateCatalog(slug);
  if (parsed.product.slug !== slug) revalidateCatalog(parsed.product.slug);
  return NextResponse.json({ ok: true, product: parsed.product, products });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const result = await deleteProduct(slug);
  if (!result.ok) {
    return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
  }
  revalidateCatalog(slug);
  return NextResponse.json({ ok: true, products: result.list });
}
