"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product, ProductColor } from "@/lib/catalog/products";
import { formatPrice, products } from "@/lib/catalog/products";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/store/AppDataContext";
import { VirtualTryOnModal } from "@/components/product/VirtualTryOnModal";

/** Approximate frame recolor from a single base photo (JPEG with white bg) */
function finishStyle(color: ProductColor | undefined) {
  if (!color) {
    return { filter: "none" };
  }
  const id = color.id.toLowerCase();
  if (id.includes("noir") || id.includes("black") || color.hex.toLowerCase() === "#1a1a1a") {
    return { filter: "grayscale(1) contrast(1.2) brightness(0.92)" };
  }
  if (
    id.includes("cristal") ||
    id.includes("transparent") ||
    id.includes("argent") ||
    color.hex.toLowerCase() === "#e5e4e2"
  ) {
    return { filter: "grayscale(0.65) brightness(1.2) contrast(0.95) opacity(0.92)" };
  }
  if (id.includes("or") || color.hex.toLowerCase() === "#d4af37") {
    return { filter: "sepia(0.65) saturate(1.35) brightness(1.05)" };
  }
  if (id.includes("bleu") || id.includes("gunmetal")) {
    return { filter: "grayscale(0.4) sepia(0.3) hue-rotate(175deg) saturate(1.15) brightness(0.9)" };
  }
  return { filter: "saturate(1.08) contrast(1.03)" };
}

const PRODUCT_VIEWS = [
  { id: "face", label: "Face", transform: "none" },
  {
    id: "trois-quarts",
    label: "3/4",
    transform: "perspective(900px) rotateY(-22deg) scale(0.96)",
  },
  {
    id: "profil",
    label: "Profil",
    transform: "perspective(900px) rotateY(-48deg) scale(0.9)",
  },
] as const;

export function ProductClient({ product }: { product: Product }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const wished = has(product.slug);
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [viewIndex, setViewIndex] = useState(0);
  const [vtoOpen, setVtoOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState(false);

  const color = useMemo(
    () => product.colors.find((c) => c.id === colorId) ?? product.colors[0],
    [colorId, product.colors]
  );

  const related = useMemo(
    () =>
      products
        .filter(
          (p) =>
            p.slug !== product.slug &&
            (p.category === product.category || p.material === product.material)
        )
        .slice(0, 4),
    [product]
  );

  const look = useMemo(() => finishStyle(color), [color]);
  const view = PRODUCT_VIEWS[viewIndex] ?? PRODUCT_VIEWS[0];

  useEffect(() => {
    setColorId(product.colors[0]?.id ?? "");
    setViewIndex(0);
  }, [product.slug, product.colors]);

  useEffect(() => {
    if (searchParams.get("vto") === "1") {
      setVtoOpen(true);
    }
  }, [searchParams, product.slug]);

  const selectColor = (id: string) => {
    setColorId(id);
    setViewIndex(0);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 700);
  };

  const openVto = () => setVtoOpen(true);
  const closeVto = () => {
    setVtoOpen(false);
    if (searchParams.get("vto") === "1") {
      router.replace(`/produit/${product.slug}`, { scroll: false });
    }
  };

  const addToCart = () => {
    addItem({
      id: `${product.slug}-${color.id}`,
      slug: product.slug,
      name: product.name,
      image: product.image,
      framePrice: product.price,
      lensesLabel: "Verres à définir en magasin",
      lensesPrice: 0,
      color: color?.label ?? "Standard",
    });
    router.push("/panier");
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* ignore cancel */
    }
  };

  return (
    <div className="relative flex min-h-[calc(100svh-4rem)] w-full flex-col overflow-x-hidden bg-surface lg:h-[calc(100svh-7rem)] lg:flex-row lg:overflow-hidden">
      <div className="relative h-[40vh] w-full shrink-0 overflow-hidden sm:h-[48vh] lg:h-full lg:flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-container-low to-primary-fixed/30" />
        <div
          className="pointer-events-none absolute top-1/4 left-[15%] h-80 w-80 rounded-full blur-[100px] transition-colors duration-500"
          style={{ backgroundColor: `${color?.hex ?? "#1a1a1a"}44` }}
        />
        <div className="pointer-events-none absolute right-[10%] bottom-[20%] h-64 w-64 rounded-full bg-secondary-fixed/25 blur-[90px]" />

        <div className="absolute inset-0 z-10 flex items-center justify-center p-8 sm:p-12 lg:p-16">
          <div
            className={`relative max-h-full max-w-full transition-transform duration-300 ${flash ? "scale-[1.02]" : "scale-100"}`}
            style={{ transform: view.transform }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={`${product.name} — ${color?.label ?? ""} — vue ${view.label}`}
              className="max-h-[min(70vh,560px)] max-w-full object-contain drop-shadow-[0_28px_48px_rgba(0,15,34,0.2)] transition-[filter] duration-500"
              style={{ filter: look.filter }}
            />
          </div>
        </div>

        <div
          className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-md lg:top-6 lg:right-6"
          aria-live="polite"
        >
          <span
            className="h-3 w-3 rounded-full ring-1 ring-black/10"
            style={{ backgroundColor: color?.hex }}
          />
          <span className="text-[11px] font-semibold text-primary">{color?.label}</span>
        </div>

        <div className="absolute top-1/2 left-4 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex lg:left-8">
          {PRODUCT_VIEWS.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setViewIndex(i)}
              aria-label={`Vue ${v.label}`}
              aria-pressed={viewIndex === i}
              className={`relative h-14 w-14 overflow-hidden rounded-xl border bg-white/70 backdrop-blur-md transition-all lg:h-16 lg:w-16 ${
                viewIndex === i
                  ? "border-primary/40 shadow-md ring-2 ring-primary/25"
                  : "border-white/60 hover:border-primary/25"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt=""
                className="h-full w-full object-contain p-1.5"
                style={{
                  filter: look.filter,
                  transform: v.transform,
                  transformOrigin: "center",
                }}
              />
            </button>
          ))}
        </div>

        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/50 bg-white/70 px-3 py-2 shadow-lg backdrop-blur-xl sm:gap-3 sm:px-5 sm:py-2.5">
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-primary transition hover:bg-primary hover:text-white"
            aria-label="Vue suivante"
            onClick={() => setViewIndex((v) => (v + 1) % PRODUCT_VIEWS.length)}
          >
            <span className="material-symbols-outlined text-[20px]">rotate_90_degrees_ccw</span>
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface-container text-primary transition hover:bg-primary hover:text-white"
            aria-label="Vue face"
            onClick={() => setViewIndex(0)}
          >
            <span className="material-symbols-outlined text-[20px]">zoom_in</span>
          </button>
          <span className="mx-1 hidden h-5 w-px bg-outline-variant/50 sm:block" />
          <div className="flex items-center gap-2 px-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface sm:text-[11px]">
              Vue {view.label}
            </span>
          </div>
        </div>

        <Link
          href="/produit"
          className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/60 bg-white/80 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md transition hover:bg-white lg:top-6 lg:left-8"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Autres montures
        </Link>
      </div>

      <aside className="relative z-30 flex w-full min-w-0 flex-col border-t border-surface-variant/30 bg-white/95 shadow-[-16px_0_40px_rgba(0,15,34,0.05)] backdrop-blur-2xl lg:h-full lg:w-[34%] lg:min-w-[320px] lg:max-w-[420px] lg:overflow-y-auto lg:border-t-0">
        <div className="px-5 pt-5 pb-1 md:px-6 md:pt-6">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary">
              Collection précision
            </span>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => toggle(product.slug)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-outline transition hover:bg-surface-container-low hover:text-error"
                aria-label={wished ? "Retirer des favoris" : "Ajouter aux favoris"}
                aria-pressed={wished}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${wished ? "text-error" : ""}`}
                  style={wished ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  aria-hidden
                >
                  favorite
                </span>
              </button>
              <button
                type="button"
                onClick={share}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-outline transition hover:bg-surface-container-low hover:text-primary"
                aria-label={copied ? "Lien copié" : "Partager"}
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  {copied ? "check" : "share"}
                </span>
              </button>
            </div>
          </div>

          <h1 className="font-headline-md text-[1.5rem] leading-tight tracking-tight text-primary md:text-[1.75rem]">
            {product.name}
          </h1>
          <p className="mt-1 text-[13px] text-on-surface-variant">{product.materialLabel}</p>
          <p className="mt-3 text-[1.25rem] font-semibold tracking-tight text-primary">
            {formatPrice(product.price)}
          </p>
          <p className="mt-2 text-[13px] leading-snug text-on-surface-variant line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-5 px-5 py-4 md:px-6">
          <button
            type="button"
            onClick={openVto}
            className="group flex w-full items-center gap-3 rounded-xl border border-primary/10 bg-primary px-3.5 py-3 text-left transition hover:bg-primary-container"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-fixed/15 text-secondary-fixed">
              <span className="material-symbols-outlined text-[20px]">view_in_ar</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold text-white">Essayage virtuel</span>
              <span className="block text-[11px] text-white/55">Caméra locale</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary-fixed">
              Ouvrir
            </span>
          </button>

          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                Finitions ({product.colors.length})
              </span>
              <span className="text-[12px] font-medium text-primary" aria-live="polite">
                {color?.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Couleur de monture">
              {product.colors.map((c) => {
                const selected = colorId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`Choisir ${c.label}`}
                    onClick={() => selectColor(c.id)}
                    className={`relative h-10 w-10 rounded-full p-[3px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
                      selected
                        ? "scale-105 border-2 border-primary shadow-md"
                        : "border-2 border-transparent hover:border-outline-variant"
                    }`}
                  >
                    <span
                      className="block h-full w-full rounded-full ring-1 ring-black/10"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-on-surface-variant">
              Cliquez une teinte : la photo se met à jour. Elle est reprise au configurateur.
            </p>
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
              Spécifications
            </p>
            <dl className="divide-y divide-surface-variant/50 rounded-lg border border-surface-variant/40 bg-surface-container-low/40 px-3">
              {[
                ["Matière", product.materialLabel],
                ["Poids", product.weight ?? "—"],
                ["Calibre", product.caliber ?? "—"],
                ["Nez", product.bridge ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-3 py-2">
                  <dt className="text-[11px] uppercase tracking-wide text-outline">{k}</dt>
                  <dd className="text-right text-[12px] font-medium text-on-surface">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
              Autres montures
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/produit/${p.slug}`}
                  className="overflow-hidden rounded-lg border border-surface-variant/50 bg-surface-container-low transition hover:border-primary/30"
                  title={p.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="aspect-square w-full object-contain p-1"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 mt-auto border-t border-surface-variant/30 bg-white/95 px-5 py-3.5 backdrop-blur-xl md:px-6">
          <button
            type="button"
            onClick={addToCart}
            className="flex min-h-12 w-full flex-col items-center justify-center gap-0.5 rounded-lg bg-secondary px-3 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-primary sm:flex-row sm:gap-2"
          >
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                shopping_bag
              </span>
              Ajouter au panier
            </span>
            <span className="font-medium normal-case tracking-normal text-white/80">
              {color?.label}
            </span>
          </button>
          <p className="mt-2 flex items-center justify-center gap-1 text-[11px] text-outline">
            <span className="material-symbols-outlined text-[13px]">local_shipping</span>
            Expédition sous 48 h · Verres en magasin
          </p>
        </div>
      </aside>

      {vtoOpen ? (
        <VirtualTryOnModal
          product={product}
          color={color}
          imageFilter={finishStyle(color).filter}
          onClose={closeVto}
        />
      ) : null}
    </div>
  );
}
