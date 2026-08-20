"use client";

import Link from "next/link";
import { cartLineTotal, useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/catalog/products";

export function CartClient() {
  const { items, total, updateQty, removeItem, count } = useCart();

  if (count === 0) {
    return (
      <div className="mx-auto max-w-container-max px-margin-desktop py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-secondary">shopping_bag</span>
        <h1 className="mt-4 text-3xl font-semibold text-primary">Votre panier est vide</h1>
        <p className="mt-2 text-on-surface-variant">Parcourez la collection pour trouver votre monture.</p>
        <Link href="/catalogue" className="mt-6 inline-flex rounded-full bg-secondary px-6 py-3 text-[12px] font-semibold uppercase tracking-wider text-white">
          Voir la collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container-max px-margin-desktop py-10">
      <h1 className="text-3xl font-semibold text-primary md:text-4xl">Panier</h1>
      <p className="mt-2 text-on-surface-variant">{count} article{count > 1 ? "s" : ""}</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-surface-variant/40 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <div
                className="h-28 w-full rounded-xl bg-surface-container-low bg-cover bg-center sm:h-24 sm:w-32 shrink-0"
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
                  <div className="inline-flex items-center gap-2 rounded-full border border-surface-variant px-2 py-1">
                    <button type="button" aria-label="Diminuer" onClick={() => updateQty(item.id, item.quantity - 1)} className="material-symbols-outlined text-[18px]">remove</button>
                    <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button type="button" aria-label="Augmenter" onClick={() => updateQty(item.id, item.quantity + 1)} className="material-symbols-outlined text-[18px]">add</button>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)} className="text-[13px] font-medium text-error hover:underline">
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
          <div className="sticky top-32 rounded-2xl border border-surface-variant/40 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-primary">Total</h3>
            <div className="mt-4 flex justify-between text-[15px]">
              <span className="text-on-surface-variant">Sous-total</span>
              <span className="font-semibold text-primary">{formatPrice(total)}</span>
            </div>
            <p className="mt-2 text-[12px] text-on-surface-variant">Livraison calculée à l’étape suivante · Éligible tiers payant</p>
            <Link
              href="/paiement"
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-primary py-4 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-secondary transition-colors"
            >
              Procéder au paiement
            </Link>
            <Link href="/catalogue" className="mt-3 block text-center text-[13px] font-medium text-secondary hover:underline">
              Continuer mes achats
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
