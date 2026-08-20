import Link from "next/link";
import { BRAND } from "@/lib/brand";

export function QuiSommesNousContent() {
  return (
    <div className="mx-auto max-w-container-max px-margin-mobile py-10 md:px-margin-desktop md:py-16">
      <nav className="mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
        <Link href="/" className="hover:text-primary">
          Accueil
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-primary">Qui sommes-nous</span>
      </nav>

      <header className="max-w-3xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
          {BRAND.name}
        </p>
        <h1 className="mt-3 text-[2.25rem] font-semibold tracking-tight text-primary md:text-[3.25rem]">
          Qui sommes-nous
        </h1>
        <p className="mt-5 text-[18px] leading-relaxed text-on-surface-variant">
          {BRAND.intro} Chez {BRAND.legalName}, la vue est une affaire de
          précision, de style et de confiance.
        </p>
      </header>

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-8 lg:col-span-7">
          <section>
            <h2 className="text-[1.5rem] font-semibold text-primary">
              Notre mission
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-on-surface-variant">
              Proposer des montures soigneusement sélectionnées et un
              accompagnement opticien clair — en ligne comme en magasin. Essayez
              virtuellement, choisissez votre style, puis finalisez avec un
              conseil professionnel.
            </p>
          </section>

          <section>
            <h2 className="text-[1.5rem] font-semibold text-primary">
              Ce qui nous guide
            </h2>
            <ul className="mt-4 space-y-4">
              {[
                {
                  icon: "visibility",
                  title: "La vue d’abord",
                  text: "Correction, confort et qualité optique avant tout.",
                },
                {
                  icon: "style",
                  title: "Le style juste",
                  text: "Des formes et matières pour chaque visage et chaque jour.",
                },
                {
                  icon: "handshake",
                  title: "Un vrai conseil",
                  text: "Opticiens à l’écoute, en boutique et à distance.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-surface-variant/50 bg-white p-5"
                >
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <span className="material-symbols-outlined text-[22px]">
                      {item.icon}
                    </span>
                  </span>
                  <div>
                    <h3 className="text-[17px] font-semibold text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[15px] text-on-surface-variant">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="rounded-3xl bg-primary p-8 text-white md:p-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/50">
              En résumé
            </p>
            <p className="mt-4 text-[1.35rem] font-semibold leading-snug">
              {BRAND.name} — optique contemporaine, parcours simple, conseil
              humain.
            </p>
            <div className="mt-8 space-y-3 border-t border-white/15 pt-6 text-[15px] text-white/75">
              <p>Collection vue, soleil &amp; progressifs</p>
              <p>Essayage virtuel depuis chez vous</p>
              <p>Rendez-vous en magasin</p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/catalogue"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary"
              >
                Voir la collection
              </Link>
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/35 px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-white"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
