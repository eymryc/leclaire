"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

/** Conserve la catégorie courante (ex. soleil) sur les filtres genre/forme/matière. */
function withCategory(href: string, category: string | null) {
  if (!category) return href;
  if (category !== "vue" && category !== "soleil" && category !== "progressif") {
    return href;
  }
  try {
    const url = new URL(href, "http://local");
    // Ne pas écraser une catégorie déjà présente dans le lien
    if (!url.searchParams.has("category")) {
      url.searchParams.set("category", category);
    }
    return `${url.pathname}?${url.searchParams.toString()}`;
  } catch {
    return href;
  }
}

export function OptiqueMegaMenu({ onNavigate }: Props) {
  const params = useSearchParams();
  const category = params.get("category");

  return (
    <div className="border-t border-surface-variant/30 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
      {/* Mobile / tablet — accordéons compacts */}
      <div className="space-y-1 px-margin-mobile py-3 lg:hidden">
        <details className="group rounded-xl border border-surface-variant/50 bg-surface-container-low/40 open:bg-white">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-[14px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
            Genres
            <span className="material-symbols-outlined text-[20px] transition group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <ul className="space-y-1 border-t border-surface-variant/40 px-2 py-2">
            {optiqueGenres.map((g) => (
              <li key={g.label}>
                <Link
                  href={withCategory(g.href, category)}
                  onClick={onNavigate}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-[15px] font-medium text-primary hover:bg-surface-container"
                >
                  <span
                    className="h-9 w-9 shrink-0 rounded-full bg-cover bg-center ring-1 ring-black/5"
                    style={{ backgroundImage: `url(${g.image})` }}
                    aria-hidden
                  />
                  {g.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>

        <details className="group rounded-xl border border-surface-variant/50 bg-surface-container-low/40 open:bg-white">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-[14px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
            Formes de monture
            <span className="material-symbols-outlined text-[20px] transition group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <ul className="space-y-0.5 border-t border-surface-variant/40 px-2 py-2">
            {optiqueFormes.map((f) => (
              <li key={f.label}>
                <Link
                  href={withCategory(f.href, category)}
                  onClick={onNavigate}
                  className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-[15px] text-primary hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant">
                    {f.icon}
                  </span>
                  {f.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>

        <details className="group rounded-xl border border-surface-variant/50 bg-surface-container-low/40 open:bg-white">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-[14px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
            Matières
            <span className="material-symbols-outlined text-[20px] transition group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <ul className="space-y-0.5 border-t border-surface-variant/40 px-2 py-2">
            {optiqueMatieres.map((m) => (
              <li key={m.label}>
                <Link
                  href={withCategory(m.href, category)}
                  onClick={onNavigate}
                  className="flex min-h-11 items-center rounded-lg px-3 text-[15px] text-primary hover:bg-surface-container"
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>

        <details className="group rounded-xl border border-surface-variant/50 bg-surface-container-low/40 open:bg-white">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-[14px] font-semibold text-primary [&::-webkit-details-marker]:hidden">
            Et aussi
            <span className="material-symbols-outlined text-[20px] transition group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <ul className="space-y-0.5 border-t border-surface-variant/40 px-2 py-2">
            {optiqueAussi.map((a) => (
              <li key={a.label}>
                <Link
                  href={a.href}
                  onClick={onNavigate}
                  className="flex min-h-11 items-center rounded-lg px-3 text-[15px] text-primary hover:bg-surface-container"
                >
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>
        </details>

        <Link
          href={optiquePromo.href}
          onClick={onNavigate}
          className="mt-2 flex min-h-12 items-center justify-between rounded-xl bg-primary px-4 text-[14px] font-semibold text-white"
        >
          {optiquePromo.caption}
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Desktop mega */}
      <div className="mx-auto hidden max-w-container-max gap-8 px-margin-desktop py-8 lg:grid lg:grid-cols-[1fr_1fr_1fr_1.1fr_0.9fr]">
        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Genres
          </p>
          <ul className="space-y-3">
            {optiqueGenres.map((g) => (
              <li key={g.label}>
                <Link
                  href={withCategory(g.href, category)}
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
            href={withCategory("/catalogue", category)}
            onClick={onNavigate}
            className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
          >
            Voir tous les genres
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>

        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Formes de monture
          </p>
          <ul className="space-y-2.5">
            {optiqueFormes.map((f) => (
              <li key={f.label}>
                <Link
                  href={withCategory(f.href, category)}
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

        <div>
          <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Matières
          </p>
          <ul className="space-y-2.5">
            {optiqueMatieres.map((m) => (
              <li key={m.label}>
                <Link
                  href={withCategory(m.href, category)}
                  onClick={onNavigate}
                  className="text-[15px] text-primary hover:underline"
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={withCategory("/catalogue", category)}
            onClick={onNavigate}
            className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-primary hover:underline"
          >
            Voir toute la collection
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        </div>

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

        <Link
          href={optiquePromo.href}
          onClick={onNavigate}
          className="group relative min-h-[280px] overflow-hidden rounded-2xl bg-surface-container"
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
