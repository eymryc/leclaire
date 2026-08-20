import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { EssayageHubClient } from "@/components/product/EssayageHubClient";
import { BRAND } from "@/lib/brand";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Essayage virtuel",
  path: "/produit",
  description: `Essayez les montures ${BRAND.name} en virtuel. Choisissez un modèle puis lancez l’essayage caméra.`,
});

export default function ProduitIndexPage() {
  return (
    <PageShell active="virtual-try-on">
      <EssayageHubClient />
    </PageShell>
  );
}
