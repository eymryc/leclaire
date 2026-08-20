"use client";

import Link from "next/link";
import { formatPrice, products } from "@/lib/catalog/products";
import { ProductCardActions } from "@/components/product/ProductCardActions";

export function EssayageHubClient() {
  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-10 md:px-margin-desktop md:py-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
          Essayage virtuel
        </p>
        <h1 className="mt-3 text-[2.25rem] font-semibold tracking-tight text-primary md:text-[3rem]">
          Choisissez une monture à essayer
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-on-surface-variant">
          Consultez la fiche ou lancez directement l’essayage virtuel.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <li key={p.slug}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-variant/40 bg-white transition hover:border-primary/20 hover:shadow-lg">
              <div className="relative flex aspect-[4/3] items-center justify-center bg-surface-container-low p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                  {p.category === "soleil"
                    ? "Soleil"
                    : p.category === "progressif"
                      ? "Progressif"
                      : "Vue"}
                  {" · "}
                  {p.materialLabel}
                </p>
                <h2 className="text-[17px] font-semibold text-primary">
                  {p.name}
                </h2>
                <p className="pt-1 text-[15px] font-semibold text-primary">
                  {formatPrice(p.price)}
                </p>
                <ProductCardActions
                  slug={p.slug}
                  name={p.name}
                  className="mt-4"
                />
              </div>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-primary hover:underline"
        >
          Voir toute la collection
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
