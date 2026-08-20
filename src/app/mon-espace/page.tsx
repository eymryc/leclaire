import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { MonEspaceClient } from "@/components/account/MonEspaceClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Mon espace",
  path: "/mon-espace",
  description: "Espace client LeClaire — commandes, rendez-vous et favoris.",
  noIndex: true,
});

export default function MonEspacePage() {
  return (
    <PageShell>
      <MonEspaceClient />
    </PageShell>
  );
}
