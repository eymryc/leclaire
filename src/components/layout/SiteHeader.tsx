"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/lib/cart/CartContext";
import { useWishlist } from "@/lib/store/AppDataContext";
import { products } from "@/lib/catalog/products";
import { primaireNav } from "@/lib/nav/optique-menu";
import { OptiqueMegaMenu } from "@/components/layout/OptiqueMegaMenu";

const LOGO = "/logo/LeClaire-logo.jpg";

type Props = {
  active?: "collection" | "virtual-try-on" | "expertise" | "magasins";
};

export function SiteHeader({ active }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { count } = useCart();
  const { ids: wishlistIds } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const [inlineQ, setInlineQ] = useState("");
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const category = searchParams.get("category");
  const optiqueActive =
    active === "collection" ||
    active === "virtual-try-on" ||
    active === "expertise" ||
    pathname.startsWith("/catalogue") ||
    pathname.startsWith("/produit") ||
    pathname.startsWith("/configuration-verres");
  const magasinsActive =
    active === "magasins" || pathname.startsWith("/magasins");

  const results = useMemo(() => {
    const needle = (searchOpen ? q : inlineQ).trim().toLowerCase();
    if (!needle) return products.slice(0, 4);
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.materialLabel.toLowerCase().includes(needle)
    );
  }, [q, inlineQ, searchOpen]);

  const openMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };

  const scheduleCloseMega = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 180);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!megaOpen && !mobileOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [megaOpen, mobileOpen]);

  const navActive = (id: string) => {
    if (id === "soleil")
      return pathname.startsWith("/catalogue") && category === "soleil";
    if (id === "vue")
      return (
        pathname.startsWith("/catalogue") &&
        category !== "soleil" &&
        category !== "progressif"
      );
    if (id === "essayage")
      return active === "virtual-try-on" || pathname.startsWith("/produit");
    if (id === "expertise")
      return (
        active === "expertise" || pathname.startsWith("/configuration-verres")
      );
    if (id === "magasins" || id === "services") return magasinsActive;
    if (id === "offres")
      return (
        pathname.startsWith("/catalogue") &&
        searchParams.get("sort") === "nouveautes"
      );
    return false;
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 z-50 w-full border-b border-surface-variant/20 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]"
      onMouseLeave={scheduleCloseMega}
    >
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-secondary focus:px-4 focus:py-2 focus:text-on-secondary"
      >
        Aller au contenu
      </a>

      {/* Top bar — recherche vraiment centrée (desktop) */}
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between gap-3 px-margin-desktop md:grid md:grid-cols-[1fr_minmax(0,28rem)_1fr] md:justify-items-stretch">
        <div className="flex min-w-0 items-center gap-2 md:justify-self-start lg:gap-3">
          <Link href="/" className="shrink-0" aria-label="LeClaire — Accueil">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="LeClaire"
              className="h-10 w-auto rounded-xl object-contain shadow-sm sm:h-11"
              src={LOGO}
            />
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-[15px] transition ${
                optiqueActive || megaOpen
                  ? "bg-surface-container font-semibold text-primary"
                  : "font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              }`}
              aria-expanded={megaOpen}
              aria-controls="optique-mega"
              aria-current={optiqueActive ? "page" : undefined}
              onMouseEnter={openMega}
              onFocus={openMega}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Optique
            </button>
            <Link
              href="/magasins"
              aria-current={magasinsActive ? "page" : undefined}
              className={`rounded-lg px-4 py-2 text-[15px] transition ${
                magasinsActive
                  ? "bg-surface-container font-semibold text-primary"
                  : "font-medium text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
              }`}
            >
              Magasins
            </Link>
          </div>
        </div>

        <form
          className="relative hidden w-full justify-self-center md:block"
          onSubmit={(e) => {
            e.preventDefault();
            setSearchOpen(true);
            setQ(inlineQ);
          }}
        >
          <span className="material-symbols-outlined pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-on-surface-variant">
            search
          </span>
          <input
            value={inlineQ}
            onChange={(e) => setInlineQ(e.target.value)}
            onFocus={() => {
              setSearchOpen(true);
              setQ(inlineQ);
            }}
            placeholder="Rechercher un modèle, une matière…"
            className="h-11 w-full rounded-full border border-surface-variant/70 bg-surface-container-low pr-4 pl-11 text-[14px] outline-none transition focus:border-primary focus:bg-white"
            aria-label="Rechercher"
          />
        </form>

        <div className="flex items-center gap-1 justify-self-end sm:gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center text-on-surface-variant md:hidden"
            aria-label="Rechercher"
            onClick={() => setSearchOpen(true)}
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          <Link
            href="/mon-espace"
            className="relative inline-flex h-10 w-10 items-center justify-center text-on-surface-variant transition hover:text-primary"
            aria-label={`Favoris${wishlistIds.length ? `, ${wishlistIds.length}` : ""}`}
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {wishlistIds.length > 0 ? (
              <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                {wishlistIds.length}
              </span>
            ) : null}
          </Link>
          <Link
            href="/mon-espace"
            className="hidden h-10 w-10 items-center justify-center text-on-surface-variant transition hover:text-primary sm:inline-flex"
            aria-label="Mon espace"
          >
            <span className="material-symbols-outlined text-[22px]">person</span>
          </Link>
          <Link
            href="/panier"
            className="relative inline-flex h-10 w-10 items-center justify-center text-on-surface-variant transition hover:text-primary"
            aria-label={`Panier${count ? `, ${count} article${count > 1 ? "s" : ""}` : ""}`}
          >
            <span className="material-symbols-outlined text-[22px]">
              shopping_bag
            </span>
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-white">
              {count}
            </span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-surface-variant/60 text-primary lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="nav-mobile"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">
              {mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            </span>
            <span className="material-symbols-outlined text-[22px]">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Secondary nav — centrée + active underline */}
      <nav
        className="hidden border-t border-surface-variant/20 lg:block"
        aria-label="Optique"
      >
        <ul className="mx-auto flex h-12 max-w-container-max items-center justify-center gap-1 overflow-x-auto px-margin-desktop">
          {primaireNav.map((item) => {
            const isActive = navActive(item.id);
            const hasMega = item.mega === "optique";
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() =>
                    hasMega ? openMega() : scheduleCloseMega()
                  }
                  className={`inline-flex h-12 items-center border-b-2 px-3 text-[13px] uppercase tracking-[0.06em] transition ${
                    isActive
                      ? "border-primary font-bold text-primary"
                      : hasMega && megaOpen
                        ? "border-primary/40 font-semibold text-primary"
                        : "border-transparent font-semibold text-on-surface-variant hover:border-outline-variant hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mega menu desktop */}
      {megaOpen ? (
        <div
          id="optique-mega"
          className="absolute inset-x-0 top-full hidden lg:block"
          onMouseEnter={openMega}
          onMouseLeave={scheduleCloseMega}
        >
          <OptiqueMegaMenu onNavigate={() => setMegaOpen(false)} />
        </div>
      ) : null}

      {/* Mobile panel */}
      {mobileOpen ? (
        <nav
          id="nav-mobile"
          className="max-h-[min(80vh,720px)] overflow-y-auto border-t border-surface-variant/30 bg-white lg:hidden"
          aria-label="Mobile"
        >
          <div className="px-margin-desktop py-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
              Optique
            </p>
            <ul className="mb-4 flex flex-col gap-0.5">
              {primaireNav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex min-h-11 items-center rounded-lg px-3 text-[15px] font-medium text-primary hover:bg-surface-container"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <OptiqueMegaMenu onNavigate={() => setMobileOpen(false)} />
        </nav>
      ) : null}

      {/* Search overlay */}
      {searchOpen ? (
        <div
          className="fixed inset-0 z-[70] bg-on-background/50 backdrop-blur-sm"
          role="dialog"
          aria-modal
          aria-label="Recherche"
        >
          <div className="mx-auto mt-16 max-w-xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-surface-variant/40 pb-3">
              <span className="material-symbols-outlined text-primary">
                search
              </span>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un modèle, une matière…"
                className="min-w-0 flex-1 bg-transparent text-[16px] outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="material-symbols-outlined text-on-surface-variant"
                aria-label="Fermer"
              >
                close
              </button>
            </div>
            <ul className="mt-3 max-h-80 overflow-auto">
              {results.length === 0 ? (
                <li className="px-2 py-4 text-[14px] text-on-surface-variant">
                  Aucun résultat
                </li>
              ) : (
                results.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/produit/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-2 py-2.5 hover:bg-surface-container-low"
                    >
                      <span
                        className="h-12 w-16 shrink-0 rounded-lg bg-cover bg-center"
                        style={{ backgroundImage: `url(${p.image})` }}
                      />
                      <span>
                        <span className="block font-semibold text-primary">
                          {p.name}
                        </span>
                        <span className="block text-[12px] text-on-surface-variant">
                          {p.materialLabel}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
            <Link
              href={
                q.trim()
                  ? `/catalogue?q=${encodeURIComponent(q.trim())}`
                  : "/catalogue"
              }
              onClick={() => setSearchOpen(false)}
              className="mt-2 block rounded-xl px-2 py-2 text-center text-[13px] font-semibold text-primary hover:bg-surface-container-low"
            >
              Voir toute la collection
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
