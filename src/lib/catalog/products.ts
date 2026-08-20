import seed from "@/data/products.json";

export type FaceShape = "rond" | "ovale" | "carre" | "triangle";
export type Material = "acetate" | "titane" | "acier" | "bio";
export type Category = "vue" | "soleil" | "progressif";
export type Genre = "femme" | "homme" | "enfant" | "unisexe";

export type ProductColor = {
  id: string;
  label: string;
  hex: string;
};

export type Product = {
  slug: string;
  name: string;
  materialLabel: string;
  material: Material;
  price: number;
  image: string;
  /** Chemin GLB monture — ex. /models/aura-eclipse.glb */
  modelGlb?: string;
  /** Chemin GLB occluder tête (optionnel, un seul global possible) */
  occluderGlb?: string;
  colors: ProductColor[];
  faceShapes: FaceShape[];
  category: Category;
  genres: Genre[];
  badge?: "nouveaute" | "bestseller" | "limite";
  weight?: string;
  caliber?: string;
  bridge?: string;
  description: string;
};

/** Snapshot build-time / client — préférer `readProducts()` côté serveur. */
export const products = seed as Product[];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value)} F CFA`;
}

export const FACE_SHAPES: FaceShape[] = ["rond", "ovale", "carre", "triangle"];
export const MATERIALS: Material[] = ["acetate", "titane", "acier", "bio"];
export const CATEGORIES: Category[] = ["vue", "soleil", "progressif"];
export const GENRES: Genre[] = ["femme", "homme", "enfant", "unisexe"];
export const BADGES = ["nouveaute", "bestseller", "limite"] as const;
