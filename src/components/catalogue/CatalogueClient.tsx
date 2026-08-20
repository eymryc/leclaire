"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  formatPrice,
  products,
  type Category,
  type FaceShape,
  type Genre,
  type Material,
  type Product,
} from "@/lib/catalog/products";
import { useWishlist } from "@/lib/store/AppDataContext";
import { ProductCardActions } from "@/components/product/ProductCardActions";

type SortKey = "pertinence" | "prix-asc" | "prix-desc" | "nouveautes";

const faceOptions: { id: FaceShape; label: string }[] = [
  { id: "rond", label: "Rond" },
  { id: "ovale", label: "Ovale" },
  { id: "carre", label: "Carré" },
  { id: "triangle", label: "Triangle" },
];

const materialOptions: { id: Material; label: string }[] = [
  { id: "acetate", label: "Acétate premium" },
  { id: "titane", label: "Titane ultra-léger" },
  { id: "acier", label: "Acier inoxydable" },
  { id: "bio", label: "Bio-acétate" },
];

const categoryOptions: { id: Category; label: string }[] = [
  { id: "vue", label: "Lunettes de vue" },
  { id: "soleil", label: "Lunettes de soleil" },
  { id: "progressif", label: "Progressifs" },
];

const budgets = [
  { id: "lt130k", label: "Moins de 130 000 F CFA", test: (p: number) => p < 130000 },
  { id: "130-160k", label: "130 000 – 160 000 F CFA", test: (p: number) => p >= 130000 && p <= 160000 },
  { id: "160-200k", label: "160 000 – 200 000 F CFA", test: (p: number) => p > 160000 && p <= 200000 },
  { id: "gt200k", label: "Plus de 200 000 F CFA", test: (p: number) => p > 200000 },
];

function badgeLabel(p: Product) {
  if (p.badge === "nouveaute") return "Nouveauté";
  if (p.badge === "bestseller") return "Best-seller";
  if (p.badge === "limite") return "Édition limitée";
  return null;
}

function parseFace(v: string | null): FaceShape | null {
  if (v === "rond" || v === "ovale" || v === "carre" || v === "triangle") return v;
  return null;
}

function parseMaterial(v: string | null): Material | null {
  if (v === "acetate" || v === "titane" || v === "acier" || v === "bio") return v;
  return null;
}

function parseCategory(v: string | null): Category | null {
  if (v === "vue" || v === "soleil" || v === "progressif") return v;
  return null;
}

function parseGenre(v: string | null): Genre | null {
  if (v === "femme" || v === "homme" || v === "enfant") return v;
  return null;
}

export function CatalogueClient() {
  const params = useSearchParams();
  const { toggle, has } = useWishlist();

  const urlFace = parseFace(params.get("face"));
  const urlMaterial = parseMaterial(params.get("material"));
  const urlCategory = parseCategory(params.get("category"));
  const urlGenre = parseGenre(params.get("genre"));
  const urlSort =
    params.get("sort") === "nouveautes" ? "nouveautes" : "pertinence";
  const urlQ = params.get("q")?.trim() ?? "";

  const [face, setFace] = useState<FaceShape | null>(urlFace);
  const [materials, setMaterials] = useState<Material[]>(
    urlMaterial ? [urlMaterial] : []
  );
  const [category, setCategory] = useState<Category | null>(urlCategory);
  const [genre, setGenre] = useState<Genre | null>(urlGenre);
  const [budget, setBudget] = useState<string | null>(null);
  const [colorHex, setColorHex] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>(urlSort as SortKey);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Resynchroniser quand l’URL change (ex. soleil → soleil + homme)
  useEffect(() => {
    setFace(urlFace);
    setMaterials(urlMaterial ? [urlMaterial] : []);
    setCategory(urlCategory);
    setGenre(urlGenre);
    setSort(urlSort as SortKey);
  }, [urlFace, urlMaterial, urlCategory, urlGenre, urlSort]);

  const title =
    category === "soleil"
      ? genre
        ? `Soleil · ${genre.charAt(0).toUpperCase()}${genre.slice(1)}`
        : "Lunettes de soleil"
      : category === "progressif"
        ? "Verres progressifs"
        : category === "vue"
          ? genre
            ? `Vue · ${genre.charAt(0).toUpperCase()}${genre.slice(1)}`
            : "Lunettes de vue"
          : genre === "femme"
            ? "Collection Femme"
            : genre === "homme"
              ? "Collection Homme"
              : genre === "enfant"
                ? "Collection Enfant"
                : "Collection";

  const filtered = useMemo(() => {
    let list = [...products];
    if (urlQ) {
      const needle = urlQ.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.materialLabel.toLowerCase().includes(needle) ||
          p.description.toLowerCase().includes(needle)
      );
    }
    if (category) list = list.filter((p) => p.category === category);
    if (genre) list = list.filter((p) => p.genres.includes(genre));
    if (face) list = list.filter((p) => p.faceShapes.includes(face));
    if (materials.length)
      list = list.filter((p) => materials.includes(p.material));
    if (budget) {
      const b = budgets.find((x) => x.id === budget);
      if (b) list = list.filter((p) => b.test(p.price));
    }
    if (colorHex)
      list = list.filter((p) =>
        p.colors.some((c) => c.hex.toLowerCase() === colorHex.toLowerCase())
      );

    if (sort === "prix-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "prix-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "nouveautes")
      list.sort((a, b) => Number(!!b.badge) - Number(!!a.badge));

    return list;
  }, [face, materials, budget, colorHex, sort, category, genre, urlQ]);

  const reset = () => {
    setFace(null);
    setMaterials([]);
    setBudget(null);
    setColorHex(null);
    setCategory(null);
    setGenre(null);
  };

  const toggleMaterial = (m: Material) => {
    setMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="w-full border-b border-surface-variant/40 bg-white/80">
        <div className="mx-auto flex max-w-container-max flex-col gap-6 px-margin-mobile py-8 md:px-margin-desktop lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <nav className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
              <Link href="/" className="hover:text-secondary">Accueil</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary">Collection</span>
            </nav>
            <h1 className="font-display-lg text-[2rem] leading-tight text-primary sm:text-[2.25rem] md:text-[3rem]">
              {title}
            </h1>
            <p className="text-[15px] text-on-surface-variant sm:text-[16px]">
              Filtrez, comparez et essayez en ligne. {filtered.length} monture
              {filtered.length > 1 ? "s" : ""} disponible
              {filtered.length > 1 ? "s" : ""}.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-surface-variant bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] shadow-sm lg:hidden"
              aria-expanded={filtersOpen}
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              Filtres
            </button>
            <label className="flex min-h-11 items-center gap-2 rounded-full border border-surface-variant bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] shadow-sm">
              <span className="text-on-surface-variant">Trier</span>
              <select
                className="bg-transparent text-primary outline-none"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
              >
                <option value="pertinence">Pertinence</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="nouveautes">Nouveautés</option>
              </select>
            </label>
            <div className="flex min-h-11 rounded-full border border-surface-variant bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase ${view === "grid" ? "bg-primary text-white" : "text-on-surface-variant"}`}
              >
                Grille
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase ${view === "list" ? "bg-primary text-white" : "text-on-surface-variant"}`}
              >
                Liste
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-8 px-margin-mobile py-8 md:px-margin-desktop lg:grid-cols-12">
        <aside
          className={`space-y-6 rounded-2xl border border-surface-variant/50 bg-white p-5 shadow-sm lg:col-span-3 lg:sticky lg:top-32 lg:self-start ${
            filtersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-primary">Filtres</h2>
            <button type="button" onClick={reset} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-secondary">
              Réinitialiser
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Catégorie</p>
            <div className="flex flex-col gap-2">
              {categoryOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory((cur) => (cur === c.id ? null : c.id))}
                  className={`rounded-xl border px-3 py-2.5 text-left text-[12px] font-semibold uppercase ${category === c.id ? "border-primary/30 bg-primary/5 text-primary" : "border-transparent bg-surface-container-low text-on-surface-variant"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Forme du visage</p>
            <div className="grid grid-cols-2 gap-2">
              {faceOptions.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFace((cur) => (cur === f.id ? null : f.id))}
                  className={`rounded-xl border p-3 text-[11px] font-semibold uppercase ${face === f.id ? "border-secondary/40 bg-secondary/5 text-secondary" : "border-transparent bg-surface-container-low text-on-surface-variant"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Matière</p>
            {materialOptions.map((m) => (
              <label key={m.id} className="flex cursor-pointer items-center gap-3 text-[14px]">
                <input
                  type="checkbox"
                  checked={materials.includes(m.id)}
                  onChange={() => toggleMaterial(m.id)}
                  className="h-4 w-4 accent-[var(--color-secondary)]"
                />
                {m.label}
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Budget</p>
            {budgets.map((b) => (
              <label key={b.id} className="flex cursor-pointer items-center gap-3 text-[14px]">
                <input
                  type="radio"
                  name="budget"
                  checked={budget === b.id}
                  onChange={() => setBudget(b.id)}
                  className="accent-[var(--color-secondary)]"
                />
                {b.label}
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">Couleur</p>
            <div className="flex flex-wrap gap-2">
              {["#1A1A1A", "#8B4513", "#D4AF37", "#C0C0C0", "#E5E4E2", "#1e3a5f"].map((hex) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={hex}
                  onClick={() => setColorHex((c) => (c === hex ? null : hex))}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-full shadow-sm ${colorHex === hex ? "ring-2 ring-secondary ring-offset-2" : ""}`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="flex min-h-11 w-full items-center justify-center rounded-full bg-primary text-[12px] font-semibold uppercase tracking-wider text-white lg:hidden"
          >
            Voir les résultats
          </button>
        </aside>

        <div className="lg:col-span-9 space-y-6">
          {(face || materials.length || budget || colorHex) && (
            <div className="flex flex-wrap items-center gap-2">
              {face && (
                <button type="button" onClick={() => setFace(null)} className="rounded-full bg-primary/5 px-3 py-1 text-[12px] font-semibold text-primary">
                  Forme : {face} ×
                </button>
              )}
              {materials.map((m) => (
                <button key={m} type="button" onClick={() => toggleMaterial(m)} className="rounded-full bg-primary/5 px-3 py-1 text-[12px] font-semibold text-primary">
                  {m} ×
                </button>
              ))}
              <button type="button" onClick={reset} className="text-[12px] font-semibold text-secondary">
                Tout effacer
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-variant bg-white p-10 text-center">
              <p className="text-lg font-semibold text-primary">Aucune monture ne correspond</p>
              <p className="mt-2 text-on-surface-variant">Élargissez vos filtres ou réinitialisez.</p>
              <button type="button" onClick={reset} className="mt-4 rounded-full bg-secondary px-5 py-2.5 text-[12px] font-semibold uppercase text-white">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-4"}>
              {filtered.map((p) => (
                <article
                  key={p.slug}
                  className={`group overflow-hidden rounded-2xl border border-surface-variant/40 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${view === "list" ? "flex flex-col sm:flex-row" : "flex flex-col"}`}
                >
                  <div className={`relative overflow-hidden bg-surface-container-low ${view === "list" ? "sm:w-56 aspect-[4/3] sm:aspect-auto sm:min-h-[160px]" : "aspect-[4/3]"}`}>
                    {badgeLabel(p) && (
                      <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase text-secondary shadow-sm">
                        {badgeLabel(p)}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggle(p.slug)}
                      className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-sm"
                      aria-label="Favoris"
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] ${has(p.slug) ? "text-error" : "text-on-surface-variant"}`}
                        style={has(p.slug) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                      >
                        favorite
                      </span>
                    </button>
                    <Link
                      href={`/produit/${p.slug}`}
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${p.image})` }}
                      aria-label={p.name}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                      <div className="min-w-0">
                        <Link href={`/produit/${p.slug}`} className="text-[17px] font-semibold text-primary hover:text-secondary sm:text-[18px]">
                          {p.name}
                        </Link>
                        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                          {p.materialLabel}
                        </p>
                      </div>
                      <p className="shrink-0 text-[16px] font-bold text-primary sm:text-right sm:text-[17px]">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                    <div className="mt-auto flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1.5">
                          {p.colors.map((c) => (
                            <span
                              key={c.id}
                              className="h-3.5 w-3.5 rounded-full border border-black/10"
                              style={{ backgroundColor: c.hex }}
                              title={c.label}
                            />
                          ))}
                        </div>
                      </div>
                      <ProductCardActions slug={p.slug} name={p.name} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
