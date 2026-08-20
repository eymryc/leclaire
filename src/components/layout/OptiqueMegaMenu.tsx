"use client";

import Link from "next/link";
import {
  optiqueAussi,
  optiqueFormes,
  optiqueGenres,
  optiqueMatieres,
  optiquePromo,
} from "@/lib/nav/optique-menu";

type Props = {
  onNavigate?: () => void;
};

export function OptiqueMegaMenu({ onNavigate }: Props) {
  return (
    <div className="border-t border-surface-variant/30 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      <div className="mx-auto grid max-w-container-max gap-8 px-margin-desktop py-8 lg:grid-cols-[1fr_1fr_1fr_1.1fr_0.9fr]">
        {/* Genres */}
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Genres
          </p>
          <ul className="space-y-3">
            {optiqueGenres.map((g) => (
              <li key={g.label}>
                <Link
                  href={g.href}
                  onClick={onNavigate}
                  className="group flex items-center gap-3"
                >
                  <span
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-container bg-cover bg-center ring-1 ring-black/5 transition group-hover:ring-primary/30"
                    style={{ backgroundImage: `url(${g.image})` }}
                    aria-hidden
                  />
                  <span className="text-[15px] font-medium text-primary transition group-hover:underline">
                    {g.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/catalogue"
            onClick={onNavigate}
            className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
          >
            Voir tous les genres
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Formes */}
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Formes de monture
          </p>
          <ul className="space-y-2.5">
            {optiqueFormes.map((f) => (
              <li key={f.label}>
                <Link
                  href={f.href}
                  onClick={onNavigate}
                  className="group flex items-center gap-3 text-[15px] text-primary hover:underline"
                >
                  <span
                    className="material-symbols-outlined text-[22px] text-on-surface-variant transition group-hover:text-primary"
                    aria-hidden
                  >
                    {f.icon}
                  </span>
                  {f.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Matières */}
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Matières
          </p>
          <ul className="space-y-2.5">
            {optiqueMatieres.map((m) => (
              <li key={m.label}>
                <Link
                  href={m.href}
                  onClick={onNavigate}
                  className="text-[15px] text-primary hover:underline"
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/catalogue"
            onClick={onNavigate}
            className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
          >
            Voir toute la collection
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>

        {/* Et aussi */}
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Et aussi
          </p>
          <ul className="space-y-2.5">
            {optiqueAussi.map((a) => (
              <li key={a.label}>
                <Link
                  href={a.href}
                  onClick={onNavigate}
                  className="text-[15px] text-primary hover:underline"
                >
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Promo */}
        <Link
          href={optiquePromo.href}
          onClick={onNavigate}
          className="group relative hidden min-h-[280px] overflow-hidden rounded-2xl bg-surface-container lg:block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={optiquePromo.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <p className="absolute inset-x-0 bottom-0 p-4 text-[14px] font-semibold leading-snug text-white">
            {optiquePromo.caption}
          </p>
        </Link>
      </div>
    </div>
  );
}
