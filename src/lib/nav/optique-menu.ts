export type MegaLink = {
  label: string;
  href: string;
  icon?: string;
  image?: string;
};

export const optiqueGenres: MegaLink[] = [
  {
    label: "Femme",
    href: "/catalogue?genre=femme",
    image: "/images/mega/genre-femme.jpg",
  },
  {
    label: "Homme",
    href: "/catalogue?genre=homme",
    image: "/images/mega/genre-homme.jpg",
  },
  {
    label: "Enfant",
    href: "/catalogue?genre=enfant",
    image: "/images/mega/genre-enfant.jpg",
  },
];

export const optiqueFormes: MegaLink[] = [
  { label: "Carrée", href: "/catalogue?face=carre", icon: "square" },
  { label: "Ovale", href: "/catalogue?face=ovale", icon: "circle" },
  { label: "Ronde", href: "/catalogue?face=rond", icon: "radio_button_unchecked" },
  { label: "Rectangle", href: "/catalogue?face=carre", icon: "crop_16_9" },
  { label: "Pantos", href: "/catalogue?face=ovale", icon: "eyeglasses" },
  { label: "Papillon", href: "/catalogue?face=triangle", icon: "filter_vintage" },
  { label: "Pilote", href: "/catalogue?face=triangle", icon: "flight" },
  { label: "Octogonale", href: "/catalogue?face=carre", icon: "hexagon" },
];

export const optiqueMatieres: MegaLink[] = [
  { label: "Acétate", href: "/catalogue?material=acetate" },
  { label: "Titane", href: "/catalogue?material=titane" },
  { label: "Acier", href: "/catalogue?material=acier" },
  { label: "Bio-acétate", href: "/catalogue?material=bio" },
  { label: "Toutes les matières", href: "/catalogue" },
];

export const optiqueAussi: MegaLink[] = [
  { label: "Nouveautés", href: "/catalogue?sort=nouveautes" },
  { label: "Best-sellers", href: "/catalogue" },
  { label: "Lunettes de soleil", href: "/catalogue?category=soleil" },
  { label: "Lunettes de vue", href: "/catalogue?category=vue" },
  { label: "Verres progressifs", href: "/catalogue?category=progressif" },
  { label: "Guide des formes", href: "/catalogue" },
];

export const optiquePromo = {
  href: "/catalogue?category=soleil",
  image: "/images/mega/promo-solaire.jpg",
  caption: "Découvrez les tendances solaires — collection LeClaire",
};

export const primaireNav = [
  {
    id: "soleil",
    label: "Lunettes de soleil",
    href: "/catalogue?category=soleil",
    mega: "optique" as const,
  },
  {
    id: "vue",
    label: "Lunettes de vue",
    href: "/catalogue?category=vue",
    mega: "optique" as const,
  },
  {
    id: "magasins",
    label: "Magasins",
    href: "/magasins",
    mega: null,
  },
  {
    id: "qui-sommes-nous",
    label: "Qui sommes-nous",
    href: "/qui-sommes-nous",
    mega: null,
  },
  {
    id: "contact",
    label: "Contactez-nous",
    href: "/contact",
    mega: null,
  },
] as const;
