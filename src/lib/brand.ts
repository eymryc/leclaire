export const BRAND = {
  name: "LeClaire",
  legalName: "LeClaire Optique",
  intro: "Souriez ! La vue c’est la vie….",
  tagline: "Souriez ! La vue c’est la vie…. 😊",
  phone: "0715152525",
  phoneDisplay: "07 15 15 25 25",
  phoneHref: "tel:+33715152525",
  phoneE164: "+33715152525",
  email: "leclaire.optic@gmail.com",
  emailHref: "mailto:leclaire.optic@gmail.com",
  locale: "fr_FR",
  language: "fr",
  themeColor: "#1a1a1a",
  logoPath: "/logo/LeClaire-logo.jpg",
  ogImagePath: "/icon-512.png",
} as const;

/** Absolute site origin (no trailing slash). */
export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) return `https://${vercelProd.replace(/\/$/, "")}`;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
