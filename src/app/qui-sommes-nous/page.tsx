import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { QuiSommesNousContent } from "@/components/pages/QuiSommesNousContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Qui sommes-nous",
  path: "/qui-sommes-nous",
  description: `Découvrez ${BRAND.legalName} : notre mission, nos valeurs et notre approche optique. ${BRAND.intro}`,
});

export default function QuiSommesNousPage() {
  return (
    <PageShell>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Qui sommes-nous", path: "/qui-sommes-nous" },
        ])}
      />
      <QuiSommesNousContent />
    </PageShell>
  );
}
