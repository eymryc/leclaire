import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Page introuvable",
  path: "/",
  description: "La page demandée n’existe pas ou a été déplacée.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto flex max-w-container-max flex-col items-start gap-6 px-margin-mobile py-16 md:px-margin-desktop md:py-24">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
          Erreur 404
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-primary md:text-5xl">
          Page introuvable
        </h1>
        <p className="max-w-lg text-[16px] text-on-surface-variant">
          Le lien est peut-être incorrect. Retrouvez nos montures dans la
          collection ou contactez-nous.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-full bg-primary px-6 py-3 text-[13px] font-semibold uppercase tracking-wider text-white"
          >
            Accueil
          </Link>
          <Link
            href="/catalogue"
            className="rounded-full border border-outline-variant px-6 py-3 text-[13px] font-semibold uppercase tracking-wider text-primary"
          >
            Collection
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
