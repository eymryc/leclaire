import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ContactClient } from "@/components/pages/ContactClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Contactez-nous",
  path: "/contact",
  description: `Contactez ${BRAND.name} : ${BRAND.phoneDisplay} · ${BRAND.email}. Questions montures, rendez-vous ou commande.`,
});

export default function ContactPage() {
  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Contactez-nous", path: "/contact" },
        ])}
      />
      <ContactClient />
    </PageShell>
  );
}
