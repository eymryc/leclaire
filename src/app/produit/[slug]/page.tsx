import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { ProductClient } from "@/components/product/ProductClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProduct, products } from "@/lib/catalog/products";
import {
  breadcrumbJsonLd,
  createProductMetadata,
  productJsonLd,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produit introuvable" };
  return createProductMetadata(product);
}

export default async function ProduitSlugPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <PageShell
      active="virtual-try-on"
      showFooter={false}
      mainClassName="w-full pt-16 bg-background flex-1 overflow-hidden lg:pt-28"
    >
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Accueil", path: "/" },
            { name: "Collection", path: "/catalogue" },
            { name: product.name, path: `/produit/${product.slug}` },
          ]),
          productJsonLd(product),
        ]}
      />
      <ProductClient product={product} />
    </PageShell>
  );
}
