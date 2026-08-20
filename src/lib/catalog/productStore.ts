import "server-only";

import { promises as fs } from "fs";
import path from "path";
import type { Product } from "@/lib/catalog/products";
import {
  BADGES,
  CATEGORIES,
  FACE_SHAPES,
  GENRES,
  MATERIALS,
} from "@/lib/catalog/products";

const DATA_PATH = path.join(process.cwd(), "src/data/products.json");

export async function readProducts(): Promise<Product[]> {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  return JSON.parse(raw) as Product[];
}

export async function writeProducts(list: Product[]): Promise<void> {
  const payload = `${JSON.stringify(list, null, 2)}\n`;
  await fs.writeFile(DATA_PATH, payload, "utf8");
}

export async function getProductBySlug(slug: string) {
  const list = await readProducts();
  return list.find((p) => p.slug === slug) ?? null;
}

export async function upsertProduct(product: Product, previousSlug?: string) {
  const list = await readProducts();
  const removeSlug = previousSlug && previousSlug !== product.slug ? previousSlug : null;
  const next = list.filter(
    (p) => p.slug !== product.slug && p.slug !== removeSlug
  );
  const idx = list.findIndex(
    (p) => p.slug === (previousSlug ?? product.slug)
  );
  if (idx >= 0) {
    next.splice(Math.min(idx, next.length), 0, product);
  } else {
    next.push(product);
  }
  await writeProducts(next);
  return next;
}

export async function deleteProduct(slug: string) {
  const list = await readProducts();
  const next = list.filter((p) => p.slug !== slug);
  if (next.length === list.length) {
    return { ok: false as const, list };
  }
  await writeProducts(next);
  return { ok: true as const, list: next };
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function parseProductInput(
  body: unknown,
  opts?: { requireSlug?: boolean }
): { ok: true; product: Product } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Corps de requête invalide." };
  }
  const b = body as Record<string, unknown>;

  const name = isNonEmptyString(b.name) ? b.name.trim() : "";
  if (!name) return { ok: false, error: "Le nom est requis." };

  let slug = isNonEmptyString(b.slug) ? slugify(b.slug) : slugify(name);
  if (!slug) return { ok: false, error: "Slug invalide." };
  if (opts?.requireSlug && !isNonEmptyString(b.slug)) {
    return { ok: false, error: "Le slug est requis." };
  }

  const material = b.material;
  if (!MATERIALS.includes(material as never)) {
    return { ok: false, error: "Matière invalide." };
  }

  const category = b.category;
  if (!CATEGORIES.includes(category as never)) {
    return { ok: false, error: "Catégorie invalide." };
  }

  const price =
    typeof b.price === "number"
      ? b.price
      : typeof b.price === "string"
        ? Number(b.price.replace(/\s/g, ""))
        : NaN;
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: "Prix invalide." };
  }

  if (!isNonEmptyString(b.materialLabel)) {
    return { ok: false, error: "Libellé matière requis." };
  }
  if (!isNonEmptyString(b.image)) {
    return { ok: false, error: "Image requise." };
  }
  if (!isNonEmptyString(b.description)) {
    return { ok: false, error: "Description requise." };
  }

  if (!Array.isArray(b.colors) || b.colors.length === 0) {
    return { ok: false, error: "Au moins une couleur est requise." };
  }
  const colors = [];
  for (const c of b.colors) {
    if (!c || typeof c !== "object") {
      return { ok: false, error: "Couleur invalide." };
    }
    const color = c as Record<string, unknown>;
    if (
      !isNonEmptyString(color.id) ||
      !isNonEmptyString(color.label) ||
      !isNonEmptyString(color.hex)
    ) {
      return { ok: false, error: "Chaque couleur doit avoir id, label et hex." };
    }
    colors.push({
      id: slugify(color.id) || color.id.trim(),
      label: color.label.trim(),
      hex: color.hex.trim(),
    });
  }

  if (!Array.isArray(b.faceShapes) || b.faceShapes.length === 0) {
    return { ok: false, error: "Au moins une forme de visage est requise." };
  }
  const faceShapes = [];
  for (const f of b.faceShapes) {
    if (!FACE_SHAPES.includes(f as never)) {
      return { ok: false, error: `Forme invalide: ${String(f)}` };
    }
    faceShapes.push(f as (typeof FACE_SHAPES)[number]);
  }

  if (!Array.isArray(b.genres) || b.genres.length === 0) {
    return { ok: false, error: "Au moins un genre est requis." };
  }
  const genres = [];
  for (const g of b.genres) {
    if (!GENRES.includes(g as never)) {
      return { ok: false, error: `Genre invalide: ${String(g)}` };
    }
    genres.push(g as (typeof GENRES)[number]);
  }

  let badge: Product["badge"];
  if (b.badge === "" || b.badge == null) {
    badge = undefined;
  } else if (BADGES.includes(b.badge as never)) {
    badge = b.badge as Product["badge"];
  } else {
    return { ok: false, error: "Badge invalide." };
  }

  const optionalPath = (v: unknown) =>
    isNonEmptyString(v) ? v.trim() : undefined;

  const product: Product = {
    slug,
    name,
    materialLabel: b.materialLabel.trim(),
    material: material as Product["material"],
    price: Math.round(price),
    image: b.image.trim(),
    modelGlb: optionalPath(b.modelGlb),
    occluderGlb: optionalPath(b.occluderGlb),
    colors,
    faceShapes,
    category: category as Product["category"],
    genres,
    badge,
    weight: optionalPath(b.weight),
    caliber: optionalPath(b.caliber),
    bridge: optionalPath(b.bridge),
    description: b.description.trim(),
  };

  return { ok: true, product };
}
