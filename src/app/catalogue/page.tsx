import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { CatalogueClient } from "@/components/catalogue/CatalogueClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND, absoluteUrl } from "@/lib/brand";
import { products } from "@/lib/catalog/products";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Collection",
  path: "/catalogue",
  description: `Collection de montures ${BRAND.name} : vue, soleil et progressifs. Filtrez par forme, matière et budget. Essayage virtuel disponible.`,
});

export default function CataloguePage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Collection ${BRAND.name}`,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/produit/${p.slug}`),
      name: p.name,
    })),
  };

  return (
    <PageShell active="collection">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Collection", path: "/catalogue" },
          ]),
          itemList,
        ]}
      />
      <Suspense
        fallback={
          <div className="px-margin-desktop py-20 text-on-surface-variant">
            Chargement de la collection…
          </div>
        }
      >
        <CatalogueClient />
      </Suspense>
    </PageShell>
  );
}
