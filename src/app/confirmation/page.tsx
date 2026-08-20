import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ConfirmationClient } from "@/components/checkout/ConfirmationClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Confirmation de commande",
  path: "/confirmation",
  description: "Confirmation de votre commande LeClaire.",
  noIndex: true,
});

export default function ConfirmationPage() {
  return (
    <PageShell>
      <ConfirmationClient />
    </PageShell>
  );
}
