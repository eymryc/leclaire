"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/catalog/products";
import { useWishlist } from "@/lib/store/AppDataContext";
import { useOrders } from "@/lib/store/AppDataContext";
import { getProduct } from "@/lib/catalog/products";

const statusLabel = {
  en_preparation: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
} as const;

export function MonEspaceClient() {
  const { orders, appointments } = useOrders();
  const { ids, toggle } = useWishlist();

  return (
    <div className="mx-auto max-w-container-max px-margin-desktop py-10">
      <h1 className="text-3xl font-semibold text-primary md:text-4xl">Mon espace</h1>
      <p className="mt-2 text-on-surface-variant">Commandes, rendez-vous et favoris — enregistrés sur cet appareil.</p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-surface-variant/40 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-primary">Commandes</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-[14px] text-on-surface-variant">
              Aucune commande pour l’instant.{" "}
              <Link href="/catalogue" className="text-secondary underline">Commencer</Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {orders.map((o) => (
                <li key={o.id} className="rounded-xl border border-surface-variant/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-primary">{o.id}</p>
                    <span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[11px] font-semibold uppercase text-secondary">
                      {statusLabel[o.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-on-surface-variant">
                    {new Date(o.createdAt).toLocaleDateString("fr-FR")} · {formatPrice(o.total)}
                  </p>
                  <p className="mt-2 text-[13px] text-on-surface">
                    {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-surface-variant/40 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-primary">Rendez-vous</h2>
          {appointments.length === 0 ? (
            <p className="mt-4 text-[14px] text-on-surface-variant">
              Aucun RDV.{" "}
              <Link href="/magasins" className="text-secondary underline">Réserver</Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {appointments.map((a) => (
                <li key={a.id} className="rounded-xl border border-surface-variant/50 p-4">
                  <p className="font-semibold text-primary">{a.storeName}</p>
                  <p className="mt-1 text-[13px] text-on-surface-variant">
                    {a.date} à {a.time} · {a.service}
                  </p>
                  <p className="mt-1 text-[12px] text-outline">{a.id}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-surface-variant/40 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-primary">Favoris</h2>
          {ids.length === 0 ? (
            <p className="mt-4 text-[14px] text-on-surface-variant">Aucun favori pour le moment.</p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ids.map((slug) => {
                const p = getProduct(slug);
                if (!p) return null;
                return (
                  <div key={slug} className="flex gap-3 rounded-xl border border-surface-variant/40 p-3">
                    <div className="h-16 w-20 shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/produit/${p.slug}`} className="font-semibold text-primary hover:text-secondary">
                        {p.name}
                      </Link>
                      <p className="text-[13px] text-on-surface-variant">{formatPrice(p.price)}</p>
                      <button type="button" onClick={() => toggle(slug)} className="mt-1 text-[12px] text-error">
                        Retirer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
