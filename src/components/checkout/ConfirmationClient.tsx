"use client";

import Link from "next/link";
import { useOrders } from "@/lib/store/AppDataContext";
import { formatPrice } from "@/lib/catalog/products";

export function ConfirmationClient() {
  const { orders } = useOrders();
  const last = orders[0];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-5%] top-[-10%] h-[40vw] w-[40vw] rounded-full bg-secondary-fixed opacity-30 blur-[120px]" />
      </div>
      <div className="relative mx-auto flex max-w-container-max flex-col items-center px-margin-desktop py-20 text-center">
        <span className="material-symbols-outlined text-5xl text-secondary">check_circle</span>
        <h1 className="mt-4 text-3xl font-semibold text-primary md:text-5xl">Commande confirmée</h1>
        {last ? (
          <div className="mt-6 w-full max-w-lg rounded-2xl border border-surface-variant/40 bg-white p-6 text-left shadow-sm">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-secondary">Référence</p>
            <p className="mt-1 text-xl font-semibold text-primary">{last.id}</p>
            <p className="mt-3 text-[14px] text-on-surface-variant">
              {new Date(last.createdAt).toLocaleString("fr-FR")} · {formatPrice(last.total)}
            </p>
            <ul className="mt-4 space-y-2 text-[14px] text-on-surface">
              {last.items.map((i) => (
                <li key={i.id}>
                  {i.quantity}× {i.name} ({i.color})
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 max-w-xl text-[16px] text-on-surface-variant">
            Merci. Votre commande est en préparation. Un opticien validera les verres si une ordonnance a été fournie.
          </p>
        )}
        <p className="mt-4 max-w-xl text-[15px] text-on-surface-variant">
          Un e-mail de confirmation {last?.email ? `a été envoyé à ${last.email}` : "sera envoyé sous peu"}.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/mon-espace" className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-secondary">
            Tableau de bord
          </Link>
          <Link href="/catalogue" className="inline-flex h-14 items-center justify-center rounded-lg border border-primary/20 bg-white/60 px-8 text-[12px] font-semibold uppercase tracking-wider text-primary backdrop-blur hover:bg-white">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}
