import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { PaiementClient } from "@/components/checkout/PaiementClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Paiement",
  path: "/paiement",
  description: "Paiement sécurisé de votre commande LeClaire.",
  noIndex: true,
});

export default function PaiementPage() {
  return (
    <PageShell>
      <PaiementClient />
    </PageShell>
  );
}
