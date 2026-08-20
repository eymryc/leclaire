"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/catalog/products";
import { useOrders } from "@/lib/store/AppDataContext";

export function PaiementClient() {
  const { items, total, clear, count } = useCart();
  const { addOrder } = useOrders();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [mutuelle, setMutuelle] = useState(false);
  const [error, setError] = useState("");

  if (count === 0) {
    return (
      <div className="mx-auto max-w-container-max px-margin-mobile py-12 md:px-margin-desktop md:py-20 text-center">
        <h1 className="text-2xl font-semibold text-primary">Aucun article à payer</h1>
        <button type="button" onClick={() => router.push("/catalogue")} className="mt-4 text-secondary underline">
          Retour collection
        </button>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || card.replace(/\s/g, "").length < 12) {
      setError("Vérifiez votre nom, e-mail et numéro de carte (12 chiffres min.).");
      return;
    }
    addOrder({ email, total, items });
    clear();
    router.push("/confirmation");
  };

  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-8 md:px-margin-desktop md:py-10">
      <h1 className="text-3xl font-semibold text-primary">Paiement</h1>
      <p className="mt-2 text-on-surface-variant">Sécurisé · Total {formatPrice(total)}</p>

      <form onSubmit={submit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-2xl border border-surface-variant/40 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Coordonnées</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-[12px] font-semibold uppercase text-on-surface-variant">Nom complet</span>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-surface-variant px-3 py-3 outline-none focus:border-secondary" />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-[12px] font-semibold uppercase text-on-surface-variant">E-mail</span>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-surface-variant px-3 py-3 outline-none focus:border-secondary" />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-surface-variant/40 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Carte bancaire</h2>
            <label className="mt-4 block">
              <span className="text-[12px] font-semibold uppercase text-on-surface-variant">Numéro de carte</span>
              <input
                required
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={card}
                onChange={(e) => setCard(e.target.value)}
                className="mt-1 w-full rounded-lg border border-surface-variant px-3 py-3 outline-none focus:border-secondary"
              />
            </label>
            <label className="mt-4 flex items-center gap-2 text-[14px]">
              <input type="checkbox" checked={mutuelle} onChange={(e) => setMutuelle(e.target.checked)} className="accent-[var(--color-secondary)]" />
              J’active le tiers payant / mutuelle
            </label>
          </section>

          {error && <p className="text-sm text-error">{error}</p>}

          <button type="submit" className="w-full rounded-full bg-secondary py-4 text-[13px] font-semibold uppercase tracking-wider text-white hover:bg-primary sm:w-auto sm:px-10">
            Confirmer le paiement
          </button>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-2xl bg-primary p-6 text-white shadow-xl">
            <h3 className="text-lg font-semibold">Votre commande</h3>
            <ul className="mt-4 space-y-3 text-[14px]">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3 border-b border-white/10 pb-2">
                  <span className="text-white/80">{i.quantity}× {i.name}</span>
                  <span>{formatPrice((i.framePrice + i.lensesPrice + (i.coatingPrice ?? 0) + (i.indexPrice ?? 0)) * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between text-xl font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
