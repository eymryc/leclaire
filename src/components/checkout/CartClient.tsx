"use client";

import Link from "next/link";
import { cartLineTotal, useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/catalog/products";

export function CartClient() {
  const { items, total, updateQty, removeItem, count } = useCart();

  if (count === 0) {
    return (
      <div className="mx-auto max-w-container-max px-margin-mobile py-12 text-center md:px-margin-desktop md:py-20">
        <span className="material-symbols-outlined text-5xl text-secondary">shopping_bag</span>
        <h1 className="mt-4 text-2xl font-semibold text-primary sm:text-3xl">Votre panier est vide</h1>
        <p className="mt-2 text-on-surface-variant">Parcourez la collection pour trouver votre monture.</p>
        <Link href="/catalogue" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-secondary px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-white">
          Voir la collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop md:py-10">
      <h1 className="text-2xl font-semibold text-primary sm:text-3xl md:text-4xl">Panier</h1>
      <p className="mt-2 text-on-surface-variant">{count} article{count > 1 ? "s" : ""}</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-surface-variant/40 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <div
                className="h-28 w-full shrink-0 rounded-xl bg-surface-container-low bg-cover bg-center sm:h-24 sm:w-32"
                style={{ backgroundImage: item.image ? `url(${item.image})` : undefined }}
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-primary">{item.name}</h2>
                <p className="text-[13px] text-on-surface-variant">
                  {item.color} · {item.lensesLabel}
                  {item.indexLabel ? ` · ${item.indexLabel}` : ""}
                  {item.coatingLabel ? ` · ${item.coatingLabel}` : ""}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div className="inline-flex min-h-11 items-center gap-1 rounded-full border border-surface-variant px-1">
                    <button
                      type="button"
                      aria-label="Diminuer"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary hover:bg-surface-container-low"
                    >
                      <span className="material-symbols-outlined text-[20px]">remove</span>
                    </button>
                    <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Augmenter"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-primary hover:bg-surface-container-low"
                    >
                      <span className="material-symbols-outlined text-[20px]">add</span>
                    </button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="min-h-11 text-[13px] font-medium text-error hover:underline">
                    Retirer
                  </button>
                </div>
              </div>
              <p className="text-lg font-bold text-primary sm:text-right">
                {formatPrice(cartLineTotal(item))}
              </p>
            </article>
          ))}
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-surface-variant/40 bg-white p-5 shadow-sm sm:p-6 lg:top-32">
            <h3 className="text-xl font-semibold text-primary">Total</h3>
            <div className="mt-4 flex justify-between text-[15px]">
              <span className="text-on-surface-variant">Sous-total</span>
              <span className="font-semibold text-primary">{formatPrice(total)}</span>
            </div>
            <p className="mt-2 text-[12px] text-on-surface-variant">Livraison calculée à l’étape suivante · Éligible tiers payant</p>
            <Link
              href="/paiement"
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-primary py-4 text-[12px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-secondary"
            >
              Procéder au paiement
            </Link>
            <Link href="/catalogue" className="mt-3 block py-2 text-center text-[13px] font-medium text-secondary hover:underline">
              Continuer mes achats
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
