import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ConfiguratorClient } from "@/components/checkout/ConfiguratorClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Configuration des verres",
  path: "/configuration-verres",
  description: `Configurez vos verres sur-mesure chez ${BRAND.name} : usage, ordonnance, unifocaux ou progressifs, indice et antireflet.`,
});

export default function ConfigurationPage() {
  return (
    <PageShell active="expertise">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Accueil", path: "/" },
          { name: "Configuration des verres", path: "/configuration-verres" },
        ])}
      />
      <Suspense
        fallback={
          <div className="px-margin-desktop py-20">
            Chargement du configurateur…
          </div>
        }
      >
        <ConfiguratorClient />
      </Suspense>
    </PageShell>
  );
}
