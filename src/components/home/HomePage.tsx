import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { formatPrice, products } from "@/lib/catalog/products";
import { ProductCardActions } from "@/components/product/ProductCardActions";

const featured = products
  .filter((p) => p.badge === "nouveaute" || p.badge === "bestseller")
  .slice(0, 4);

const genres = [
  {
    href: "/catalogue?genre=femme",
    title: "Femme",
    image: "/images/mega/genre-femme.jpg",
  },
  {
    href: "/catalogue?genre=homme",
    title: "Homme",
    image: "/images/mega/genre-homme.jpg",
  },
  {
    href: "/catalogue?genre=enfant",
    title: "Enfant",
    image: "/images/mega/genre-enfant.jpg",
  },
] as const;

const materials = [
  { href: "/catalogue?material=acetate", title: "Acétate", n: "01" },
  { href: "/catalogue?material=titane", title: "Titane", n: "02" },
  { href: "/catalogue?material=acier", title: "Acier", n: "03" },
  { href: "/catalogue?material=bio", title: "Bio-acétate", n: "04" },
] as const;

const steps = [
  {
    n: "01",
    title: "Choisissez",
    desc: "Forme, matière, genre, budget — trouvez vite.",
  },
  {
    n: "02",
    title: "Essayez",
    desc: "Essayage virtuel sur votre visage, chez vous.",
  },
  {
    n: "03",
    title: "Personnalisez",
    desc: "Verres, traitements, puis commande sécurisée.",
  },
] as const;

function badgeLabel(badge?: string) {
  if (badge === "nouveaute") return "Nouveau";
  if (badge === "bestseller") return "Best-seller";
  if (badge === "limite") return "Limité";
  return null;
}

export function HomePage() {
  return (
    <div className="flex w-full flex-col overflow-x-hidden">
      {/* —— Hero —— */}
      <section className="relative flex min-h-[100svh] w-full items-end overflow-hidden -mt-16 pt-16 lg:-mt-28 lg:pt-28">
        <div
          className="home-hero-bg absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-lumina.jpg')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(26,26,26,0.92)_0%,rgba(26,26,26,0.55)_48%,rgba(26,26,26,0.2)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/40" />

        <div className="relative z-10 mx-auto w-full max-w-container-max px-margin-mobile pb-14 pt-32 md:px-margin-desktop md:pb-20 md:pt-40">
          <div className="flex max-w-3xl flex-col">
            <p className="motion-safe:animate-[fadeUp_0.7s_ease-out_both] text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">
              {BRAND.name} · Optique
            </p>
            <h1 className="mt-5 motion-safe:animate-[fadeUp_0.85s_ease-out_both] text-[clamp(2.6rem,7vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-white text-balance">
              {BRAND.intro}
            </h1>
            <div className="mt-7 h-px w-16 bg-white/35 motion-safe:animate-[fadeUp_0.95s_ease-out_both]" />
            <p className="mt-7 max-w-md motion-safe:animate-[fadeUp_1s_ease-out_both] text-[17px] font-medium leading-relaxed text-white/75 md:text-[18px]">
              Essayez. Configurez. Voyez net — un parcours fluide de la monture
              aux verres.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-[fadeUp_1.1s_ease-out_both]">
              <Link
                href="/catalogue"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-primary transition duration-300 hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Collection
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/produit"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/40 bg-transparent px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition duration-300 hover:bg-white hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Essayage virtuel
              </Link>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-3 border-t border-white/15 pt-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50 md:mt-20">
            <span>Essayage 3D</span>
            <span className="hidden text-white/25 sm:inline">·</span>
            <span>Verres sur-mesure</span>
            <span className="hidden text-white/25 sm:inline">·</span>
            <span>Conseil magasin</span>
          </div>
        </div>
      </section>

      {/* —— Marquee —— */}
      <div className="overflow-hidden border-b border-surface-variant/60 bg-white py-4">
        <div className="home-marquee flex w-max gap-12 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.2em] text-primary/55">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex gap-12 px-6">
              {[
                "Vue",
                "Soleil",
                "Progressifs",
                "Titane",
                "Acétate",
                "Essayage virtuel",
                "LeClaire",
              ].map((t) => (
                <span key={`${copy}-${t}`}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* —— Essayage —— */}
      <section className="relative w-full bg-surface py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-10">
            <Link
              href="/produit"
              className="group relative col-span-1 block min-h-[460px] cursor-pointer overflow-hidden rounded-[1.75rem] lg:col-span-7 lg:min-h-[560px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/vto-showcase.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply transition duration-500 group-hover:bg-primary/10" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(26,26,26,0.45)_100%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/50 bg-white/15 text-white backdrop-blur-xl transition duration-500 group-hover:scale-110 group-hover:bg-white/25">
                  <span className="material-symbols-outlined text-[34px]">
                    view_in_ar
                  </span>
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">
                    Analyse en cours
                  </span>
                </div>
                <p className="text-[1.35rem] font-semibold tracking-tight text-white md:text-[1.5rem]">
                  Morphologie 3D en temps réel
                </p>
              </div>
            </Link>

            <div className="col-span-1 flex flex-col justify-between lg:col-span-5 lg:pl-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                  Innovation {BRAND.name}
                </p>
                <h2 className="mt-4 text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-primary text-balance">
                  L&apos;ajustement parfait, avant l&apos;achat.
                </h2>
                <p className="mt-5 max-w-md text-[16px] leading-[1.7] text-on-surface-variant">
                  Visualisez chaque monture sur votre visage — proportions,
                  matières, reflets — sans rendez-vous.
                </p>

                <ul className="mt-10 space-y-0 divide-y divide-surface-variant/80 border-y border-surface-variant/80">
                  <li className="flex gap-4 py-5">
                    <span className="material-symbols-outlined mt-0.5 text-[22px] text-primary">
                      face_retouching_natural
                    </span>
                    <div>
                      <p className="text-[16px] font-semibold text-primary">
                        Scan facial précis
                      </p>
                      <p className="mt-1 text-[14px] leading-relaxed text-on-surface-variant">
                        Morphologie analysée pour des formes qui vous vont.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-4 py-5">
                    <span className="material-symbols-outlined mt-0.5 text-[22px] text-primary">
                      360
                    </span>
                    <div>
                      <p className="text-[16px] font-semibold text-primary">
                        Rendu réaliste
                      </p>
                      <p className="mt-1 text-[14px] leading-relaxed text-on-surface-variant">
                        Angles, lumière et matières fidèles à la réalité.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <Link
                href="/produit"
                className="mt-8 inline-flex w-fit cursor-pointer items-center gap-3 rounded-full bg-primary px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition duration-300 hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Essayer maintenant
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* —— Catégories asymétriques —— */}
      <section className="w-full bg-background py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Collections
              </p>
              <h2 className="mt-3 text-[clamp(1.85rem,3vw,2.6rem)] font-semibold tracking-[-0.02em] text-primary">
                Trouvez votre style
              </h2>
            </div>
            <Link
              href="/catalogue"
              className="cursor-pointer text-[12px] font-semibold uppercase tracking-[0.1em] text-primary underline-offset-4 transition hover:underline sm:text-[13px]"
            >
              Tout voir
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5 md:grid-rows-2">
            <Link
              href="/catalogue?category=vue"
              className="group relative min-h-[340px] cursor-pointer overflow-hidden rounded-[1.5rem] md:col-span-7 md:row-span-2 md:min-h-[520px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/catalogue/cat-aura.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  Quotidien
                </p>
                <h3 className="mt-2 text-[1.75rem] font-semibold text-white md:text-[2.1rem]">
                  Lunettes de vue
                </h3>
                <p className="mt-2 max-w-sm text-[14px] text-white/65">
                  Montures pour chaque visage, chaque journée.
                </p>
              </div>
            </Link>

            <Link
              href="/catalogue?category=soleil"
              className="group relative min-h-[240px] cursor-pointer overflow-hidden rounded-[1.5rem] md:col-span-5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/catalogue/cat-soleil-aviator.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-[1.35rem] font-semibold text-white">
                  Lunettes de soleil
                </h3>
                <p className="mt-1 text-[13px] text-white/65">UV & polarisés</p>
              </div>
            </Link>

            <Link
              href="/catalogue?category=progressif"
              className="group relative min-h-[240px] cursor-pointer overflow-hidden rounded-[1.5rem] md:col-span-5"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/catalogue/cat-progressif-extra.jpg"
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-[1.35rem] font-semibold text-white">
                  Progressifs
                </h3>
                <p className="mt-1 text-[13px] text-white/65">
                  Près · loin · intermédiaire
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* —— Produits —— */}
      <section className="w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Sélection
              </p>
              <h2 className="mt-3 text-[clamp(1.85rem,3vw,2.6rem)] font-semibold tracking-[-0.02em] text-primary">
                Coups de cœur
              </h2>
            </div>
            <Link
              href="/catalogue?sort=nouveautes"
              className="cursor-pointer text-[13px] font-semibold uppercase tracking-[0.1em] text-primary underline-offset-4 transition hover:underline"
            >
              Nouveautés
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
            {featured.map((p, i) => (
              <article
                key={p.slug}
                className="group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-container-low">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="absolute inset-0 h-full w-full object-contain p-3 transition duration-500 group-hover:scale-[1.06] sm:p-6"
                  />
                  {badgeLabel(p.badge) ? (
                    <span className="absolute top-3 left-3 rounded-full bg-primary/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                      {badgeLabel(p.badge)}
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 px-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
                    {p.materialLabel}
                  </p>
                  <h3 className="mt-1 text-[17px] font-semibold tracking-tight text-primary">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-[14px] font-medium text-on-surface-variant">
                    {formatPrice(p.price)}
                  </p>
                  <ProductCardActions
                    slug={p.slug}
                    name={p.name}
                    className="mt-3"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* —— Genres —— */}
      <section className="w-full bg-primary py-20 text-white md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mb-12 max-w-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
              Pour qui
            </p>
            <h2 className="mt-3 text-[clamp(1.85rem,3vw,2.6rem)] font-semibold tracking-[-0.02em]">
              Toute la famille, chaque style
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {genres.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[1.5rem]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-90" />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-6">
                  <h3 className="text-[1.5rem] font-semibold tracking-tight">
                    {g.title}
                  </h3>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md transition duration-300 group-hover:bg-white group-hover:text-primary">
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* —— Matières —— */}
      <section className="w-full border-b border-surface-variant/50 bg-background py-16 md:py-20">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <p className="mb-8 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            Matières
          </p>
          <div className="grid grid-cols-1 divide-y divide-surface-variant/70 border border-surface-variant/70 sm:grid-cols-2 sm:divide-x md:grid-cols-4 md:divide-y-0">
            {materials.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="group flex cursor-pointer flex-col items-start gap-3 px-5 py-7 transition hover:bg-white sm:px-6 md:px-8 md:py-8"
              >
                <span className="text-[12px] font-semibold tracking-[0.16em] text-on-surface-variant/60">
                  {m.n}
                </span>
                <span className="text-[1.35rem] font-semibold tracking-tight text-primary transition group-hover:translate-x-1">
                  {m.title}
                </span>
                <span className="material-symbols-outlined text-[18px] text-primary/40 transition group-hover:text-primary">
                  north_east
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* —— 3 étapes —— */}
      <section className="w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              Parcours
            </p>
            <h2 className="mt-3 text-[clamp(1.85rem,3vw,2.6rem)] font-semibold tracking-[-0.02em] text-primary">
              Trois gestes. Une vision nette.
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.n}
                className={`relative px-2 py-8 md:px-10 md:py-4 ${
                  i > 0 ? "border-t border-surface-variant/60 md:border-t-0 md:border-l" : ""
                }`}
              >
                <span className="block font-mono text-[4rem] font-semibold leading-none tracking-tighter text-surface-variant">
                  {s.n}
                </span>
                <h3 className="mt-4 text-[1.35rem] font-semibold text-primary">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-none text-[15px] leading-relaxed text-on-surface-variant md:max-w-[220px]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* —— Expertise + solaire split —— */}
      <section className="w-full bg-surface py-20 md:py-28">
        <div className="mx-auto grid max-w-container-max gap-5 px-margin-mobile md:grid-cols-2 md:px-margin-desktop">
          <div className="flex flex-col justify-between rounded-[1.5rem] bg-white p-8 md:p-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
                Expertise
              </p>
              <h2 className="mt-3 text-[1.85rem] font-semibold tracking-tight text-primary md:text-[2.15rem]">
                Un opticien à vos côtés
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-on-surface-variant">
                Examen de vue, verres sur-mesure, ajustement et suivi — le
                conseil pro, en magasin ou en ligne.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3">
              {[
                { icon: "visibility", label: "Examen" },
                { icon: "science", label: "Verres" },
                { icon: "handyman", label: "Ajustement" },
                { icon: "support_agent", label: "Suivi" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">
                    {item.icon}
                  </span>
                  <span className="text-[14px] font-semibold text-primary">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/magasins"
              className="mt-8 inline-flex w-fit cursor-pointer items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-primary underline-offset-4 hover:underline"
            >
              Prendre rendez-vous
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </Link>
          </div>

          <Link
            href="/catalogue?category=soleil"
            className="group relative min-h-[420px] cursor-pointer overflow-hidden rounded-[1.5rem]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/mega/promo-solaire.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Solaire
              </p>
              <h2 className="mt-3 max-w-xs text-[1.85rem] font-semibold leading-tight tracking-tight text-white md:text-[2.15rem]">
                Style & protection UV
              </h2>
              <span className="mt-6 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-white">
                Voir les solaires
                <span className="material-symbols-outlined text-[16px] transition group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* —— Magasin —— */}
      <section className="w-full bg-white py-20 md:py-28">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-primary px-5 py-12 text-white sm:px-8 md:px-14 md:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-8 top-8 h-40 w-40 rounded-full border border-white/10" />
            <div className="relative grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Magasins
                </p>
                <h2 className="mt-3 text-[clamp(1.85rem,3vw,2.75rem)] font-semibold tracking-[-0.02em]">
                  Passez nous voir
                </h2>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-white/65">
                  Essayage en boutique, examen de vue et conseils
                  personnalisés — sur rendez-vous.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/magasins"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-primary transition hover:bg-white/90"
                  >
                    Prendre rendez-vous
                  </Link>
                  <a
                    href={BRAND.phoneHref}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/10"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      call
                    </span>
                    {BRAND.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: "schedule", label: "Créneaux flexibles" },
                  { icon: "storefront", label: "Conseil en boutique" },
                  { icon: "verified", label: "Qualité sélectionnée" },
                  { icon: "local_shipping", label: "Livraison suivie" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/15 bg-white/5 px-4 py-5 backdrop-blur-sm"
                  >
                    <span className="material-symbols-outlined text-[22px] text-white/80">
                      {item.icon}
                    </span>
                    <p className="mt-3 text-[13px] font-semibold leading-snug text-white/85">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Contact —— */}
      <section className="w-full border-t border-surface-variant/50 bg-surface-container-low py-12 md:py-14">
        <div className="mx-auto flex max-w-container-max flex-col items-start justify-between gap-6 px-margin-mobile md:flex-row md:items-center md:px-margin-desktop">
          <div>
            <h2 className="text-[1.5rem] font-semibold tracking-tight text-primary md:text-[1.75rem]">
              Une question ? On vous répond.
            </h2>
            <p className="mt-1 text-[14px] text-on-surface-variant">
              {BRAND.name} — {BRAND.intro}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={BRAND.phoneHref}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-secondary"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              {BRAND.phoneDisplay}
            </a>
            <a
              href={BRAND.emailHref}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-primary/15 bg-white px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary transition hover:bg-surface"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              E-mail
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
