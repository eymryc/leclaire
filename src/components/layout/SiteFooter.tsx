import Link from "next/link";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { BRAND } from "@/lib/brand";

const LOGO = "/logo/LeClaire-logo.jpg";

const assurance = [
  { href: "#", label: "Charte qualité vision" },
  { href: "#", label: "Guide d'ordonnance" },
  { href: "#", label: "Santé lumière bleue" },
  { href: "/magasins", label: "Opticiens partenaires" },
];

const service = [
  { href: "/magasins", label: "Nos magasins" },
  { href: "/qui-sommes-nous", label: "Qui sommes-nous" },
  { href: "/contact", label: "Contactez-nous" },
  { href: "/mon-espace", label: "Suivi de commande" },
  { href: "/magasins", label: "Prendre rendez-vous" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary text-white">
      <div className="mx-auto max-w-container-max px-margin-mobile pt-12 pb-10 md:px-margin-desktop md:pt-16 md:pb-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center" aria-label={`${BRAND.name} — Accueil`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={BRAND.name}
                className="h-14 w-auto rounded-2xl object-contain ring-1 ring-white/10"
                src={LOGO}
              />
            </Link>
            <p className="max-w-sm text-[17px] font-medium leading-relaxed text-white">
              {BRAND.intro}{" "}
              <span aria-hidden>😊</span>
            </p>
            <div className="flex flex-col gap-2.5">
              <a
                href={BRAND.phoneHref}
                className="inline-flex items-center gap-2.5 text-[15px] text-white/80 transition-colors hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  call
                </span>
                {BRAND.phoneDisplay}
              </a>
              <a
                href={BRAND.emailHref}
                className="inline-flex items-center gap-2.5 text-[15px] text-white/80 transition-colors hover:text-white"
              >
                <span className="material-symbols-outlined text-[20px]" aria-hidden>
                  mail
                </span>
                {BRAND.email}
              </a>
            </div>
          </div>

          {/* Assurance */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary-fixed-dim">
              Santé &amp; confiance
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Santé">
              {assurance.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[15px] text-white/75 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Service */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary-fixed-dim">
              Service client
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Service">
              {service.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[15px] text-white/75 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary-fixed-dim">
              Newsletter
            </h4>
            <p className="text-[15px] leading-relaxed text-white/70">
              Collections, conseils vision et nouveautés — une fois par mois.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/45 text-balance">
            © {year} {BRAND.name}
            <span className="hidden md:inline"> — {BRAND.intro}</span>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-medium uppercase tracking-[0.08em] text-white/45">
            <Link className="transition-colors hover:text-white" href="/contact">
              Contact
            </Link>
            <Link className="transition-colors hover:text-white" href="/qui-sommes-nous">
              Qui sommes-nous
            </Link>
            <a className="transition-colors hover:text-white" href="#">
              Confidentialité
            </a>
            <a className="transition-colors hover:text-white" href="#">
              Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
