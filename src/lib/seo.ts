import type { Metadata } from "next";
import { absoluteUrl, BRAND, getSiteUrl } from "@/lib/brand";
import type { Product } from "@/lib/catalog/products";
import { formatPrice } from "@/lib/catalog/products";

const DEFAULT_DESCRIPTION =
  `${BRAND.intro} Opticien en ligne : lunettes de vue, essayage virtuel, configuration de verres et magasins. Contact : ${BRAND.phoneDisplay} · ${BRAND.email}`;

const KEYWORDS = [
  "LeClaire",
  "opticien",
  "lunettes",
  "lunettes de vue",
  "montures",
  "verres progressifs",
  "essayage virtuel",
  "optique",
  "ordonnance",
  "magasin optique",
];

type PageSeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = BRAND.ogImagePath,
  noIndex = false,
  keywords = KEYWORDS,
}: PageSeoInput = {}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  const fullTitle = title
    ? undefined
    : `${BRAND.name} — ${BRAND.intro}`;

  return {
    title: title ?? fullTitle,
    description,
    keywords,
    authors: [{ name: BRAND.name, url: getSiteUrl() }],
    creator: BRAND.name,
    publisher: BRAND.name,
    applicationName: BRAND.name,
    category: "shopping",
    alternates: {
      canonical: url,
      languages: { fr: url },
    },
    openGraph: {
      type: "website",
      locale: BRAND.locale,
      url,
      siteName: BRAND.name,
      title: title ? `${title} | ${BRAND.name}` : `${BRAND.name} — ${BRAND.intro}`,
      description,
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
          alt: `${BRAND.name} — logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title ? `${title} | ${BRAND.name}` : `${BRAND.name} — ${BRAND.intro}`,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function createProductMetadata(product: Product): Metadata {
  const path = `/produit/${product.slug}`;
  const description = `${product.name} — ${product.materialLabel}. ${product.description} Prix : ${formatPrice(product.price)}. Essayage virtuel chez ${BRAND.name}.`;

  return {
    ...createPageMetadata({
      title: product.name,
      description,
      path,
      image: product.image,
      keywords: [
        ...KEYWORDS,
        product.name,
        product.materialLabel,
        product.category,
        "monture",
      ],
    }),
    openGraph: {
      type: "website",
      locale: BRAND.locale,
      url: absoluteUrl(path),
      siteName: BRAND.name,
      title: `${product.name} | ${BRAND.name}`,
      description,
      images: [
        {
          url: absoluteUrl(product.image),
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
  };
}

export function organizationJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Optician", "Store"],
    "@id": `${site}/#organization`,
    name: BRAND.name,
    legalName: BRAND.legalName,
    description: BRAND.tagline,
    url: site,
    logo: absoluteUrl(BRAND.logoPath),
    image: absoluteUrl(BRAND.ogImagePath),
    email: BRAND.email,
    telephone: BRAND.phoneE164,
    slogan: BRAND.intro,
    sameAs: [],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: BRAND.phoneE164,
        email: BRAND.email,
        contactType: "customer service",
        availableLanguage: ["French"],
      },
    ],
  };
}

export function websiteJsonLd() {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site}/#website`,
    name: BRAND.name,
    url: site,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "fr-FR",
    publisher: { "@id": `${site}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site}/catalogue?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [absoluteUrl(product.image)],
    sku: product.slug,
    brand: {
      "@type": "Brand",
      name: BRAND.name,
    },
    material: product.materialLabel,
    category: "Eyewear",
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/produit/${product.slug}`),
      priceCurrency: "XOF",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: BRAND.name,
      },
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
