"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      const key = "leclaire-newsletter-v1";
      const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
      if (!prev.includes(email)) {
        localStorage.setItem(key, JSON.stringify([...prev, email]));
      }
    } catch {
      /* ignore */
    }
    setDone(true);
    setEmail("");
  };

  if (done) {
    return (
      <p className="rounded-full border border-secondary-container/40 bg-secondary/20 px-5 py-3 text-[14px] text-white">
        Merci — inscription enregistrée.
      </p>
    );
  }

  return (
    <form
      className="flex items-stretch overflow-hidden rounded-full border border-white/20 bg-white/5 focus-within:border-secondary-container"
      onSubmit={submit}
    >
      <label className="sr-only" htmlFor="footer-email">
        Adresse e-mail
      </label>
      <input
        id="footer-email"
        className="min-h-11 min-w-0 flex-1 bg-transparent px-5 py-3 text-[14px] text-white outline-none placeholder:text-white/40"
        placeholder="votre@email.com"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        type="submit"
        className="inline-flex min-h-11 items-center gap-1 bg-white px-5 text-[12px] font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-secondary-fixed"
        aria-label="S'inscrire à la newsletter"
      >
        OK
        <span className="material-symbols-outlined text-[18px]" aria-hidden>
          arrow_forward
        </span>
      </button>
    </form>
  );
}
