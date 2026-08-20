import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { MagasinsClient } from "@/components/account/MagasinsClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Nos magasins",
  path: "/magasins",
  description: `Trouvez un magasin ${BRAND.name} et réservez un examen de vue ou un rendez-vous opticien. ${BRAND.phoneDisplay} · ${BRAND.email}`,
});

export default function MagasinsPage() {
  return (
    <PageShell active="magasins">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Magasins", path: "/magasins" },
        ])}
      />
      <MagasinsClient />
    </PageShell>
  );
}
