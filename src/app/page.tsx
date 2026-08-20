import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { getMainHtml } from "@/lib/get-main-html";
import { BRAND } from "@/lib/brand";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  path: "/",
  description: `${BRAND.tagline} Découvrez les montures LeClaire, essayez en virtuel, configurez vos verres et prenez rendez-vous en magasin. ${BRAND.phoneDisplay} · ${BRAND.email}`,
});

export default async function HomePage() {
  const { html, className } = await getMainHtml("accueil");

  return (
    <PageShell mainClassName={className}>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Accueil", path: "/" }])}
      />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </PageShell>
  );
}
