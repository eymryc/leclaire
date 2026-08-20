"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND } from "@/lib/brand";

export function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || message.trim().length < 8) {
      setError("Merci de renseigner un nom, un e-mail valide et un message.");
      return;
    }
    setError("");
    try {
      const key = "leclaire-contact-v1";
      const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as unknown[];
      localStorage.setItem(
        key,
        JSON.stringify([
          ...prev,
          { name, email, message, at: new Date().toISOString() },
        ])
      );
    } catch {
      /* ignore */
    }
    setDone(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-10 md:px-margin-desktop md:py-16">
      <nav className="mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
        <Link href="/" className="hover:text-primary">
          Accueil
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary">Contactez-nous</span>
      </nav>

      <header className="max-w-2xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
          Contact
        </p>
        <h1 className="mt-3 text-[2.25rem] font-semibold tracking-tight text-primary md:text-[3.25rem]">
          Contactez-nous
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-on-surface-variant">
          Une question sur une monture, un rendez-vous ou votre commande ?
          Écrivez-nous — on vous répond rapidement.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-4">
          <a
            href={BRAND.phoneHref}
            className="flex items-start gap-4 rounded-2xl border border-surface-variant/50 bg-white p-5 transition hover:border-primary/20"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <span className="material-symbols-outlined text-[22px]">call</span>
            </span>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                Téléphone
              </p>
              <p className="mt-1 text-[17px] font-semibold text-primary">
                {BRAND.phoneDisplay}
              </p>
            </div>
          </a>
          <a
            href={BRAND.emailHref}
            className="flex items-start gap-4 rounded-2xl border border-surface-variant/50 bg-white p-5 transition hover:border-primary/20"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <span className="material-symbols-outlined text-[22px]">mail</span>
            </span>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                E-mail
              </p>
              <p className="mt-1 break-all text-[17px] font-semibold text-primary">
                {BRAND.email}
              </p>
            </div>
          </a>
          <Link
            href="/magasins"
            className="flex items-start gap-4 rounded-2xl border border-surface-variant/50 bg-white p-5 transition hover:border-primary/20"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
              <span className="material-symbols-outlined text-[22px]">
                storefront
              </span>
            </span>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-on-surface-variant">
                Magasins
              </p>
              <p className="mt-1 text-[17px] font-semibold text-primary">
                Prendre rendez-vous
              </p>
            </div>
          </Link>
        </div>

        <div className="lg:col-span-8">
          {done ? (
            <div className="rounded-2xl border border-surface-variant/50 bg-white p-8 text-center md:p-10">
              <span className="material-symbols-outlined text-4xl text-primary">
                check_circle
              </span>
              <h2 className="mt-4 text-[1.5rem] font-semibold text-primary">
                Message enregistré
              </h2>
              <p className="mt-2 text-[15px] text-on-surface-variant">
                Merci. Nous vous recontacterons bientôt à l’adresse indiquée.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-white"
              >
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="rounded-2xl border border-surface-variant/50 bg-white p-6 shadow-sm md:p-8"
            >
              <h2 className="text-[1.25rem] font-semibold text-primary">
                Écrire un message
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block sm:col-span-1">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                    Nom
                  </span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-surface-variant px-4 py-3 text-[15px] outline-none focus:border-primary"
                  />
                </label>
                <label className="block sm:col-span-1">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                    E-mail
                  </span>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-surface-variant px-4 py-3 text-[15px] outline-none focus:border-primary"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                    Message
                  </span>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1.5 w-full resize-y rounded-xl border border-surface-variant px-4 py-3 text-[15px] outline-none focus:border-primary"
                  />
                </label>
              </div>
              {error ? (
                <p className="mt-4 text-[14px] text-error">{error}</p>
              ) : null}
              <button
                type="submit"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-8 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-secondary sm:w-auto"
              >
                Envoyer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
