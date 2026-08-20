"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getProduct, formatPrice, products } from "@/lib/catalog/products";
import { useCart } from "@/lib/cart/CartContext";

type Usage = "daily" | "digital" | "sport";
type LensType = "single" | "progressive";
type IndexOpt = "1.67" | "1.74";

const USAGES = [
  {
    id: "daily" as const,
    title: "Quotidien",
    icon: "visibility",
    desc: "Confort toute la journée, clarté pour les activités courantes.",
  },
  {
    id: "digital" as const,
    title: "Écrans",
    icon: "desktop_mac",
    desc: "Distances intermédiaires et exposition prolongée aux écrans.",
  },
  {
    id: "sport" as const,
    title: "Actif / sport",
    icon: "directions_run",
    desc: "Résistance aux chocs et champ de vision dynamique.",
  },
];

export function ConfiguratorClient() {
  const params = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();

  const slug = params.get("slug") ?? products[0].slug;
  const colorParam = params.get("color");
  const product = getProduct(slug) ?? products[0];
  const color =
    product.colors.find((c) => c.id === colorParam) ?? product.colors[0];

  const [usage, setUsage] = useState<Usage>("daily");
  const [lensType, setLensType] = useState<LensType>("single");
  const [indexOpt, setIndexOpt] = useState<IndexOpt>("1.74");
  const [coating, setCoating] = useState(true);
  const [od, setOd] = useState("-2.00");
  const [os, setOs] = useState("-2.25");
  const [fileName, setFileName] = useState<string | null>(null);

  const lensPrice = lensType === "progressive" ? 98000 : 0;
  const indexPrice = indexOpt === "1.74" ? 52000 : 30000;
  const coatingPrice = coating ? 30000 : 0;
  const total = product.price + lensPrice + indexPrice + coatingPrice;

  const lensWidth = useMemo(() => (indexOpt === "1.74" ? 32 : 48), [indexOpt]);
  const hasPrescription = Boolean(fileName || (od && os));
  const stepsDone = 1 + (hasPrescription ? 1 : 0) + 1;

  const onAdd = () => {
    addItem({
      id: `${product.slug}-${color.id}-${lensType}-${indexOpt}`,
      slug: product.slug,
      name: product.name,
      image: product.image,
      framePrice: product.price,
      lensesLabel:
        lensType === "progressive" ? "Verres progressifs" : "Verres unifocaux",
      lensesPrice: lensPrice,
      coatingLabel: coating ? "Traitement antireflet" : undefined,
      coatingPrice: coating ? coatingPrice : undefined,
      indexLabel: `Indice ${indexOpt}`,
      indexPrice,
      color: color.label,
    });
    router.push("/panier");
  };

  return (
    <div className="relative min-h-screen pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[15%] top-[8%] h-[42vw] w-[42vw] rounded-full bg-secondary-fixed/35 opacity-50 blur-[120px]" />
        <div className="absolute right-[8%] bottom-[15%] h-[28vw] w-[28vw] rounded-full bg-primary-fixed/40 opacity-50 blur-[100px]" />
      </div>

      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-10 px-margin-mobile pt-8 md:gap-12 md:px-margin-desktop md:pt-12 lg:grid-cols-12 lg:gap-gutter">
        <div className="flex flex-col gap-10 md:gap-14 lg:col-span-8">
          {/* Hero */}
          <header className="relative">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary">
                Configuration des verres
              </span>
              <span className="text-[12px] font-medium text-on-surface-variant">
                Étape {stepsDone} / 3
              </span>
            </div>
            <h1 className="max-w-xl text-[2.5rem] font-semibold leading-[1.1] tracking-tight text-primary md:text-[3.25rem]">
              Vos verres sur-mesure
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-on-surface-variant">
              Monture{" "}
              <strong className="font-semibold text-primary">{product.name}</strong>{" "}
              — {color.label}. Guidage étape par étape pour un résultat fiable.
            </p>

            {/* Progress */}
            <div className="mt-8 flex max-w-md gap-2" aria-hidden>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    n <= stepsDone ? "bg-secondary" : "bg-surface-variant"
                  }`}
                />
              ))}
            </div>

            {/* Frame chip */}
            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-surface-variant/40 bg-white/70 p-3 shadow-sm backdrop-blur-md sm:max-w-md">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-container">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-1.5"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-primary">
                  {product.name}
                </p>
                <p className="mt-0.5 flex items-center gap-2 text-[13px] text-on-surface-variant">
                  <span
                    className="inline-block h-3 w-3 rounded-full ring-1 ring-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.label} · {formatPrice(product.price)}
                </p>
              </div>
            </div>
          </header>

          {/* Step 1 */}
          <section className="group relative overflow-hidden rounded-2xl border border-surface-variant/25 bg-white/85 p-6 shadow-[0_8px_40px_rgba(0,15,34,0.06)] backdrop-blur-xl md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative mb-6 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-3 text-[22px] font-semibold text-primary md:text-[24px]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-[13px] font-semibold text-white shadow-[0_0_0_4px_rgba(26,26,26,0.12)]">
                  1
                </span>
                Usage principal
              </h2>
              <span className="material-symbols-outlined text-secondary">
                check_circle
              </span>
            </div>
            <div className="relative grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
              {USAGES.map(({ id, title, icon, desc }) => {
                const selected = usage === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setUsage(id)}
                    className={`relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                      selected
                        ? "border-secondary bg-secondary-fixed/15 shadow-[0_0_0_1px_rgba(26,26,26,0.08)]"
                        : "border-transparent bg-surface-container-low hover:border-outline-variant/60 hover:bg-surface-container"
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[2rem] transition-colors ${
                        selected ? "text-secondary" : "text-primary"
                      }`}
                    >
                      {icon}
                    </span>
                    <h3 className="mt-3 text-[18px] font-semibold text-primary">
                      {title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-on-surface-variant">
                      {desc}
                    </p>
                    {selected && (
                      <span className="absolute top-3 right-3 material-symbols-outlined text-[18px] text-secondary">
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Step 2 */}
          <section className="rounded-2xl border border-surface-variant/25 bg-white/85 p-6 shadow-[0_8px_40px_rgba(0,15,34,0.06)] backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-3 text-[22px] font-semibold text-primary md:text-[24px]">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold ${
                    hasPrescription
                      ? "bg-secondary text-white shadow-[0_0_0_4px_rgba(26,26,26,0.12)]"
                      : "bg-surface-variant text-on-surface-variant"
                  }`}
                >
                  2
                </span>
                Ordonnance
              </h2>
              {hasPrescription && (
                <span className="material-symbols-outlined text-secondary">
                  check_circle
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <label className="group/upload flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-lowest px-6 py-10 transition-colors hover:border-secondary/40 hover:bg-surface-container-low">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary-fixed/40 transition-transform duration-300 group-hover/upload:scale-110">
                  <span className="material-symbols-outlined text-[28px] text-secondary">
                    document_scanner
                  </span>
                </div>
                <span className="text-center text-[17px] font-semibold text-primary">
                  {fileName ? "Ordonnance importée" : "Importer mon ordonnance"}
                </span>
                <span className="max-w-[14rem] text-center text-[13px] leading-relaxed text-on-surface-variant">
                  {fileName ?? "PDF ou photo (JPG / PNG) — extraction assistée"}
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white transition group-hover/upload:shadow-[0_0_16px_rgba(0,0,0,0.2)]">
                  {fileName ? "Remplacer" : "Choisir un fichier"}
                  <span className="material-symbols-outlined text-[16px]">
                    upload
                  </span>
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="sr-only"
                  onChange={(e) =>
                    setFileName(e.target.files?.[0]?.name ?? null)
                  }
                />
              </label>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">
                    edit_square
                  </span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em]">
                    Saisie manuelle
                  </span>
                </div>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                    OD (œil droit) SPH
                  </span>
                  <input
                    value={od}
                    onChange={(e) => setOd(e.target.value)}
                    className="mt-2 w-full border-b-2 border-surface-variant bg-transparent pb-2.5 text-[20px] font-medium tracking-wide text-primary outline-none transition-colors focus:border-secondary"
                    placeholder="-2.00"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                    OG (œil gauche) SPH
                  </span>
                  <input
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    className="mt-2 w-full border-b-2 border-surface-variant bg-transparent pb-2.5 text-[20px] font-medium tracking-wide text-primary outline-none transition-colors focus:border-secondary"
                    placeholder="-2.25"
                  />
                </label>
                <p className="text-[12px] leading-relaxed text-on-surface-variant">
                  Saisie indicative — un opticien validera avant fabrication.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section className="rounded-2xl border border-surface-variant/25 bg-white/85 p-6 shadow-[0_8px_40px_rgba(0,15,34,0.06)] backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-3 text-[22px] font-semibold text-primary md:text-[24px]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-[13px] font-semibold text-white shadow-[0_0_0_4px_rgba(26,26,26,0.12)]">
                  3
                </span>
                Type de verres &amp; indice
              </h2>
              <span className="material-symbols-outlined text-secondary">
                check_circle
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
              <button
                type="button"
                onClick={() => setLensType("single")}
                className={`rounded-2xl border-2 p-5 text-left transition-all ${
                  lensType === "single"
                    ? "border-secondary bg-secondary-fixed/15"
                    : "border-transparent bg-surface-container-low hover:border-outline-variant/60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      lensType === "single"
                        ? "bg-secondary text-white"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    <span className="h-5 w-5 rounded-full border-2 border-current" />
                  </span>
                  <div>
                    <h3 className="text-[18px] font-semibold text-primary">
                      Unifocaux
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-on-surface-variant">
                      Une correction sur toute la surface — idéal pour myopie ou
                      hypermétropie.
                    </p>
                    <span className="mt-3 inline-block rounded-full bg-surface-variant px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
                      Inclus
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLensType("progressive")}
                className={`relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all ${
                  lensType === "progressive"
                    ? "border-secondary bg-secondary-fixed/15"
                    : "border-transparent bg-surface-container-low hover:border-outline-variant/60"
                }`}
              >
                <div className="pointer-events-none absolute -right-8 -bottom-8 h-28 w-28 rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-xl" />
                <div className="relative flex items-start gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                      lensType === "progressive"
                        ? "bg-secondary text-white"
                        : "bg-surface-variant text-on-surface-variant"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      layers
                    </span>
                  </span>
                  <div>
                    <h3 className="text-[18px] font-semibold text-primary">
                      Progressifs
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-on-surface-variant">
                      Vision de près, intermédiaire et de loin en une seule
                      géométrie.
                    </p>
                    <span className="mt-3 inline-block rounded-full bg-secondary-fixed px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-on-secondary-fixed">
                      + {formatPrice(98000)}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                Indice &amp; traitements
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIndexOpt("1.67")}
                  className={`rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition ${
                    indexOpt === "1.67"
                      ? "bg-secondary text-white shadow-md"
                      : "border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  Indice 1.67 · +{formatPrice(30000)}
                </button>
                <button
                  type="button"
                  onClick={() => setIndexOpt("1.74")}
                  className={`rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition ${
                    indexOpt === "1.74"
                      ? "bg-secondary text-white shadow-md"
                      : "border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  Ultra-mince 1.74 · +{formatPrice(52000)}
                </button>
                <button
                  type="button"
                  onClick={() => setCoating((v) => !v)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.06em] transition ${
                    coating
                      ? "bg-primary text-white"
                      : "border border-outline-variant bg-white text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {coating ? "check" : "add"}
                  </span>
                  Antireflet · +{formatPrice(30000)}
                </button>
              </div>
            </div>
          </section>

          {/* Thickness sim */}
          <section className="relative overflow-hidden rounded-2xl border border-surface-variant/25 bg-surface-container-lowest p-6 shadow-sm md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(224,227,229,0.45),transparent_70%)]" />
            <div className="relative">
              <h3 className="mb-5 flex items-center gap-2 text-[18px] font-semibold text-primary">
                <span className="material-symbols-outlined text-secondary">
                  3d_rotation
                </span>
                Simulation d&apos;épaisseur
                <span className="ml-auto text-[12px] font-medium text-on-surface-variant">
                  Indice {indexOpt}
                </span>
              </h3>
              <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-surface-container shadow-inner md:h-48">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-px w-full bg-surface-variant/50" />
                  <div className="absolute h-full w-px bg-surface-variant/50" />
                </div>
                <div
                  className="absolute left-[22%] h-[85%] rounded-[100%_40%_40%_100%] border-l-4 border-white/80 bg-white/55 shadow-[0_0_30px_rgba(255,255,255,0.8)_inset] backdrop-blur-md transition-all duration-500 ease-out"
                  style={{
                    width: lensWidth,
                    transform: "perspective(500px) rotateY(15deg)",
                  }}
                />
                <div
                  className="absolute right-[22%] h-[85%] rounded-[40%_100%_100%_40%] border-r-4 border-white/80 bg-white/55 shadow-[0_0_30px_rgba(255,255,255,0.8)_inset] backdrop-blur-md transition-all duration-500 ease-out"
                  style={{
                    width: lensWidth,
                    transform: "perspective(500px) rotateY(-15deg)",
                  }}
                />
              </div>
              <p className="mt-4 text-center text-[13px] text-on-surface-variant">
                {indexOpt === "1.74"
                  ? "Verres ultra-minces — profil affiné pour les fortes corrections."
                  : "Indice 1.67 — bon équilibre minceur / prix."}
              </p>
            </div>
          </section>
        </div>

        {/* Recap */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 overflow-hidden rounded-2xl border border-primary/25 bg-primary-container text-on-primary-container shadow-[0_20px_60px_rgba(0,15,34,0.35)]">
            <div className="relative border-b border-primary-fixed/15 bg-gradient-to-br from-primary to-primary-container p-5">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-white/10">
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary-fixed-dim">
                    Récapitulatif
                  </p>
                  <p className="mt-1 truncate text-[17px] font-semibold text-white">
                    {product.name}
                  </p>
                  <p className="text-[13px] text-on-primary-container">
                    {color.label}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 p-6 text-[15px]">
              <div className="flex justify-between gap-4">
                <span className="opacity-75">Monture</span>
                <span className="font-medium text-white">
                  {formatPrice(product.price)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="opacity-75">
                  {lensType === "progressive" ? "Progressifs" : "Unifocaux"}
                </span>
                <span className="font-medium text-white">
                  {formatPrice(lensPrice)}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-secondary-fixed">
                <span>Indice {indexOpt}</span>
                <span className="font-medium">+ {formatPrice(indexPrice)}</span>
              </div>
              {coating && (
                <div className="flex justify-between gap-4 text-secondary-fixed">
                  <span>Antireflet</span>
                  <span className="font-medium">
                    + {formatPrice(coatingPrice)}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-4 text-[13px] opacity-65">
                <span>OD / OG · {USAGES.find((u) => u.id === usage)?.title}</span>
                <span>
                  {od} / {os}
                </span>
              </div>

              <div className="mt-2 flex items-end justify-between border-t border-primary-fixed/20 pt-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] opacity-80">
                  Total estimé
                </span>
                <span className="text-[2rem] font-semibold leading-none text-white">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                type="button"
                onClick={onAdd}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-4 text-[17px] font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition hover:bg-primary hover:shadow-[0_10px_28px_rgba(0,0,0,0.3)] active:scale-[0.99]"
              >
                Ajouter au panier
                <span className="material-symbols-outlined">shopping_bag</span>
              </button>

              <div className="mt-4 flex items-center justify-center gap-6 opacity-55">
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[22px]">
                    verified
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    CE
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[22px]">
                    shield
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    ISO 9001
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined text-[22px]">
                    local_shipping
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    Retour
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
