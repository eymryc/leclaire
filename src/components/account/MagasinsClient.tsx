"use client";

import Link from "next/link";
import { useState } from "react";
import { useOrders } from "@/lib/store/AppDataContext";

const stores = [
  {
    id: "paris-opera",
    name: "LeClaire Opéra",
    address: "12 rue de la Paix, 75002 Paris",
    hours: "Lun–Sam 10h–19h",
    services: ["Examen de vue", "Atelier"],
  },
  {
    id: "lyon-presquile",
    name: "LeClaire Presqu’île",
    address: "8 rue Édouard Herriot, 69002 Lyon",
    hours: "Mar–Sam 10h–19h",
    services: ["Examen de vue", "Basse vision"],
  },
  {
    id: "bordeaux-triangle",
    name: "LeClaire Triangle",
    address: "5 cours de l’Intendance, 33000 Bordeaux",
    hours: "Lun–Sam 10h–19h",
    services: ["Examen de vue", "Atelier création"],
  },
];

export function MagasinsClient() {
  const { addAppointment, appointments } = useOrders();
  const [selected, setSelected] = useState(stores[0].id);
  const [service, setService] = useState("Examen de vue");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState<string | null>(null);

  const store = stores.find((s) => s.id === selected)!;

  const book = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !name || !email.includes("@")) return;
    const apt = addAppointment({
      storeId: store.id,
      storeName: store.name,
      date,
      time,
      service,
      name,
      email,
    });
    setOk(apt.id);
  };

  return (
    <div className="mx-auto max-w-container-max px-margin-desktop py-10">
      <h1 className="text-3xl font-semibold text-primary md:text-4xl">Nos magasins</h1>
      <p className="mt-2 max-w-2xl text-on-surface-variant">
        Prenez rendez-vous pour un examen, un ajustement ou un retrait de commande.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          {stores.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelected(s.id)}
              className={`w-full rounded-2xl border p-5 text-left transition ${selected === s.id ? "border-secondary bg-secondary/5 shadow-sm" : "border-surface-variant/50 bg-white hover:border-secondary/30"}`}
            >
              <h2 className="text-lg font-semibold text-primary">{s.name}</h2>
              <p className="mt-1 text-[14px] text-on-surface-variant">{s.address}</p>
              <p className="mt-2 text-[12px] font-semibold uppercase tracking-wide text-secondary">{s.hours}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.services.map((svc) => (
                  <span key={svc} className="rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] font-medium text-on-surface">
                    {svc}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={book} className="rounded-2xl border border-surface-variant/40 bg-white p-6 shadow-sm lg:col-span-7">
          <h3 className="text-xl font-semibold text-primary">Réserver — {store.name}</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[12px] font-semibold uppercase text-on-surface-variant">Service</span>
              <select value={service} onChange={(e) => setService(e.target.value)} className="mt-1 w-full rounded-lg border border-surface-variant px-3 py-3 outline-none focus:border-secondary">
                {store.services.map((s) => (
                  <option key={s}>{s}</option>
                ))}
                <option>Retrait commande</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase text-on-surface-variant">Date</span>
              <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-lg border border-surface-variant px-3 py-3 outline-none focus:border-secondary" />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase text-on-surface-variant">Heure</span>
              <select value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded-lg border border-surface-variant px-3 py-3 outline-none focus:border-secondary">
                {["10:00", "11:00", "14:00", "15:30", "17:00"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase text-on-surface-variant">Nom</span>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-surface-variant px-3 py-3 outline-none focus:border-secondary" />
            </label>
            <label className="block">
              <span className="text-[12px] font-semibold uppercase text-on-surface-variant">E-mail</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-surface-variant px-3 py-3 outline-none focus:border-secondary" />
            </label>
          </div>
          <button type="submit" className="mt-6 w-full rounded-full bg-secondary py-3.5 text-[12px] font-semibold uppercase tracking-wider text-white hover:bg-primary sm:w-auto sm:px-8">
            Confirmer le rendez-vous
          </button>
          {ok && (
            <p className="mt-4 rounded-xl bg-secondary/10 p-4 text-[14px] text-primary">
              Rendez-vous enregistré ({ok}). Retrouvez-le dans{" "}
              <Link href="/mon-espace" className="font-semibold text-secondary underline">
                Mon espace
              </Link>
              .
            </p>
          )}
          {appointments.length > 0 && !ok && (
            <p className="mt-4 text-[13px] text-on-surface-variant">
              {appointments.length} rendez-vous déjà planifié{appointments.length > 1 ? "s" : ""} dans votre espace.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
