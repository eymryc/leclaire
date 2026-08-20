import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HomePage as HomeContent } from "@/components/home/HomePage";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND } from "@/lib/brand";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/",
  description: `${BRAND.tagline} Découvrez les montures LeClaire, essayez en virtuel, configurez vos verres et prenez rendez-vous en magasin. ${BRAND.phoneDisplay} · ${BRAND.email}`,
});

export default function Page() {
  return (
    <PageShell mainClassName="w-full bg-background flex-1 pt-16 lg:pt-28">
      <JsonLd data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }])} />
      <HomeContent />
    </PageShell>
  );
}
