import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CartClient } from "@/components/checkout/CartClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Panier",
  path: "/panier",
  description: "Votre panier LeClaire — montures et verres sélectionnés.",
  noIndex: true,
});

export default function PanierPage() {
  return (
    <PageShell>
      <CartClient />
    </PageShell>
  );
}
