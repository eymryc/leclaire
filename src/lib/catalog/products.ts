export type FaceShape = "rond" | "ovale" | "carre" | "triangle";
export type Material = "acetate" | "titane" | "acier" | "bio";
export type Category = "vue" | "soleil" | "progressif";
export type Genre = "femme" | "homme" | "enfant" | "unisexe";

export type ProductColor = {
  id: string;
  label: string;
  hex: string;
};

export type Product = {
  slug: string;
  name: string;
  materialLabel: string;
  material: Material;
  price: number;
  image: string;
  /** Chemin GLB monture — ex. /models/aura-eclipse.glb */
  modelGlb?: string;
  /** Chemin GLB occluder tête (optionnel, un seul global possible) */
  occluderGlb?: string;
  colors: ProductColor[];
  faceShapes: FaceShape[];
  category: Category;
  genres: Genre[];
  badge?: "nouveaute" | "bestseller" | "limite";
  weight?: string;
  caliber?: string;
  bridge?: string;
  description: string;
};

export const products: Product[] = [
  // —— VUE ——
  {
    slug: "aura-eclipse",
    name: "Aura Eclipse",
    materialLabel: "Acétate écaille",
    material: "acetate",
    price: 187000,
    image: "/images/catalogue/cat-aura.jpg",
    modelGlb: "/models/aura-eclipse.glb",
    occluderGlb: "/models/face-occluder.glb",
    colors: [
      { id: "ecaille", label: "Écaille", hex: "#8B4513" },
      { id: "noir", label: "Noir", hex: "#1A1A1A" },
      { id: "cristal", label: "Cristal", hex: "#E5E4E2" },
    ],
    faceShapes: ["ovale", "rond"],
    category: "vue",
    genres: ["femme", "unisexe"],
    badge: "nouveaute",
    weight: "18 g",
    caliber: "52 mm",
    bridge: "18 mm",
    description:
      "Monture en acétate italien, profil doux, idéale pour un port quotidien élégant.",
  },
  {
    slug: "titanium-x1",
    name: "Titanium X1",
    materialLabel: "Titane brossé",
    material: "titane",
    price: 223000,
    image: "/images/catalogue/cat-titanium.jpg",
    colors: [
      { id: "argent", label: "Argent", hex: "#A9A9A9" },
      { id: "gunmetal", label: "Gunmetal", hex: "#36454F" },
    ],
    faceShapes: ["ovale", "carre"],
    category: "vue",
    genres: ["homme", "unisexe"],
    weight: "12 g",
    caliber: "49 mm",
    bridge: "21 mm",
    description:
      "Architecture titane ultra-légère, précision millimétrique pour un confort toute la journée.",
  },
  {
    slug: "nordic-line-42",
    name: "Nordic Line 42",
    materialLabel: "Acétate noir mat",
    material: "acetate",
    price: 124000,
    image: "/images/catalogue/cat-noir.jpg",
    colors: [
      { id: "noir", label: "Noir mat", hex: "#1A1A1A" },
      { id: "bleu", label: "Bleu nuit", hex: "#1e3a5f" },
    ],
    faceShapes: ["ovale", "carre", "triangle"],
    category: "vue",
    genres: ["homme", "femme", "unisexe"],
    badge: "bestseller",
    weight: "22 g",
    caliber: "54 mm",
    bridge: "17 mm",
    description:
      "Ligne rectangulaire affirmée, finition mate, best-seller de la collection vue.",
  },
  {
    slug: "atelier-curve",
    name: "Atelier Curve",
    materialLabel: "Acétate cristal",
    material: "acetate",
    price: 150000,
    image: "/images/catalogue/cat-cristal.jpg",
    colors: [
      { id: "cristal", label: "Cristal", hex: "#E5E4E2" },
      { id: "havane", label: "Havane", hex: "#8B4513" },
    ],
    faceShapes: ["ovale", "rond", "triangle"],
    category: "vue",
    genres: ["femme"],
    weight: "19 g",
    caliber: "51 mm",
    bridge: "18 mm",
    description:
      "Silhouette cat-eye douce, transparence cristalline pour un look contemporain.",
  },
  {
    slug: "horizon-or",
    name: "Horizon Or",
    materialLabel: "Métal or pâle",
    material: "acier",
    price: 170000,
    image: "/images/catalogue/cat-or.jpg",
    colors: [
      { id: "or", label: "Or pâle", hex: "#D4AF37" },
      { id: "argent", label: "Argent", hex: "#C0C0C0" },
    ],
    faceShapes: ["ovale", "carre"],
    category: "vue",
    genres: ["femme", "unisexe"],
    weight: "14 g",
    caliber: "53 mm",
    bridge: "19 mm",
    description:
      "Monture fine en métal doré, inspiration aviator revisitée pour la correction.",
  },
  {
    slug: "glacier-round",
    name: "Glacier Round",
    materialLabel: "Acétate bleu glacier",
    material: "bio",
    price: 141000,
    image: "/images/catalogue/cat-bleu.jpg",
    colors: [
      { id: "bleu", label: "Bleu glacier", hex: "#1e3a5f" },
      { id: "noir", label: "Noir", hex: "#1A1A1A" },
    ],
    faceShapes: ["rond", "ovale"],
    category: "vue",
    genres: ["femme", "homme", "unisexe"],
    badge: "limite",
    weight: "20 g",
    caliber: "48 mm",
    bridge: "20 mm",
    description:
      "Ronde bio-acétate, édition limitée, teinte bleue profonde et branches flexibles.",
  },
  {
    slug: "rect-focus",
    name: "Rect Focus",
    materialLabel: "Acétate graphite",
    material: "acetate",
    price: 135000,
    image: "/images/catalogue/cat-vue-rect.jpg",
    colors: [
      { id: "graphite", label: "Graphite", hex: "#2F2F2F" },
      { id: "ecaille", label: "Écaille", hex: "#8B4513" },
    ],
    faceShapes: ["carre", "ovale"],
    category: "vue",
    genres: ["homme", "unisexe"],
    weight: "21 g",
    caliber: "55 mm",
    bridge: "17 mm",
    description:
      "Rectangle affirmé pour visage carré ou ovale — clarté et présence.",
  },
  {
    slug: "pantos-atelier",
    name: "Pantos Atelier",
    materialLabel: "Acétate miel",
    material: "acetate",
    price: 158000,
    image: "/images/catalogue/cat-vue-pantos.jpg",
    colors: [
      { id: "miel", label: "Miel", hex: "#C4A35A" },
      { id: "noir", label: "Noir", hex: "#1A1A1A" },
    ],
    faceShapes: ["ovale", "rond", "triangle"],
    category: "vue",
    genres: ["femme", "unisexe"],
    badge: "nouveaute",
    weight: "19 g",
    caliber: "50 mm",
    bridge: "20 mm",
    description:
      "Pantos rétro en acétate miel, polyvalent et très confortable.",
  },
  {
    slug: "fil-acier",
    name: "Fil Acier",
    materialLabel: "Acier inoxydable",
    material: "acier",
    price: 119000,
    image: "/images/catalogue/cat-acier-fin.jpg",
    colors: [
      { id: "argent", label: "Argent", hex: "#C0C0C0" },
      { id: "noir", label: "Noir", hex: "#1A1A1A" },
    ],
    faceShapes: ["ovale", "carre", "triangle"],
    category: "vue",
    genres: ["homme", "femme", "unisexe"],
    weight: "13 g",
    caliber: "52 mm",
    bridge: "18 mm",
    description:
      "Filaire acier, ultra-légère, idéale pour un port discret toute la journée.",
  },
  {
    slug: "titane-slim",
    name: "Titane Slim",
    materialLabel: "Titane satiné",
    material: "titane",
    price: 245000,
    image: "/images/catalogue/cat-titane-fin.jpg",
    colors: [
      { id: "gunmetal", label: "Gunmetal", hex: "#36454F" },
      { id: "or", label: "Or rose", hex: "#B76E79" },
    ],
    faceShapes: ["ovale", "carre"],
    category: "vue",
    genres: ["femme", "homme", "unisexe"],
    badge: "bestseller",
    weight: "11 g",
    caliber: "50 mm",
    bridge: "20 mm",
    description:
      "Profil titane satiné, branches flexibles mémoire de forme.",
  },
  {
    slug: "bio-vert",
    name: "Bio Vert",
    materialLabel: "Bio-acétate vert",
    material: "bio",
    price: 132000,
    image: "/images/catalogue/cat-bio-vert.jpg",
    colors: [
      { id: "vert", label: "Vert sauge", hex: "#7A8F6A" },
      { id: "cristal", label: "Cristal", hex: "#E5E4E2" },
    ],
    faceShapes: ["rond", "ovale"],
    category: "vue",
    genres: ["femme", "unisexe"],
    weight: "18 g",
    caliber: "49 mm",
    bridge: "19 mm",
    description:
      "Bio-acétate responsable, teinte sauge douce pour un look nature.",
  },
  {
    slug: "junior-smile",
    name: "Junior Smile",
    materialLabel: "Acétate souple",
    material: "acetate",
    price: 89000,
    image: "/images/catalogue/cat-vue-extra.jpg",
    colors: [
      { id: "bleu", label: "Bleu ciel", hex: "#6BA3D6" },
      { id: "rose", label: "Rose", hex: "#E8A0BF" },
      { id: "noir", label: "Noir", hex: "#1A1A1A" },
    ],
    faceShapes: ["rond", "ovale"],
    category: "vue",
    genres: ["enfant"],
    badge: "nouveaute",
    weight: "16 g",
    caliber: "44 mm",
    bridge: "16 mm",
    description:
      "Monture enfant ultra-légère, branches flexibles et couleurs joyeuses.",
  },
  {
    slug: "metal-vue",
    name: "Métal Vue",
    materialLabel: "Métal brossé",
    material: "acier",
    price: 145000,
    image: "/images/catalogue/cat-vue-metal.jpg",
    colors: [
      { id: "argent", label: "Argent", hex: "#A9A9A9" },
      { id: "or", label: "Or pâle", hex: "#D4AF37" },
    ],
    faceShapes: ["carre", "triangle", "ovale"],
    category: "vue",
    genres: ["homme", "unisexe"],
    weight: "15 g",
    caliber: "53 mm",
    bridge: "18 mm",
    description:
      "Carré métallique contemporain, pont ajustable et plaquettes silicone.",
  },

  // —— SOLEIL ——
  {
    slug: "soleil-aviator",
    name: "Soleil Aviator",
    materialLabel: "Métal polarisé",
    material: "acier",
    price: 165000,
    image: "/images/catalogue/cat-soleil-aviator.jpg",
    colors: [
      { id: "or", label: "Or", hex: "#D4AF37" },
      { id: "argent", label: "Argent", hex: "#C0C0C0" },
    ],
    faceShapes: ["ovale", "carre", "triangle"],
    category: "soleil",
    genres: ["homme", "femme", "unisexe"],
    badge: "bestseller",
    weight: "16 g",
    caliber: "58 mm",
    bridge: "14 mm",
    description:
      "Aviator polarisé UV400, icône solaire pour visage ovale à triangulaire.",
  },
  {
    slug: "soleil-wayfarer",
    name: "Soleil Wayfarer",
    materialLabel: "Acétate noir",
    material: "acetate",
    price: 148000,
    image: "/images/catalogue/cat-soleil-wayfarer.jpg",
    colors: [
      { id: "noir", label: "Noir", hex: "#1A1A1A" },
      { id: "ecaille", label: "Écaille", hex: "#8B4513" },
    ],
    faceShapes: ["carre", "ovale", "triangle"],
    category: "soleil",
    genres: ["homme", "femme", "unisexe"],
    badge: "nouveaute",
    weight: "24 g",
    caliber: "54 mm",
    bridge: "18 mm",
    description:
      "Wayfarer acétate, verres miroir optionnels, protection solaire maximale.",
  },
  {
    slug: "soleil-rond",
    name: "Soleil Rond",
    materialLabel: "Acétate ambre",
    material: "acetate",
    price: 139000,
    image: "/images/catalogue/cat-soleil-rond.jpg",
    colors: [
      { id: "ambre", label: "Ambre", hex: "#C87941" },
      { id: "noir", label: "Noir", hex: "#1A1A1A" },
    ],
    faceShapes: ["rond", "ovale"],
    category: "soleil",
    genres: ["femme", "unisexe"],
    weight: "22 g",
    caliber: "50 mm",
    bridge: "20 mm",
    description:
      "Rondes solaires vintage, teinte ambre chaude et branches larges.",
  },
  {
    slug: "soleil-papillon",
    name: "Soleil Papillon",
    materialLabel: "Acétate cristal",
    material: "acetate",
    price: 156000,
    image: "/images/catalogue/cat-soleil-cat.jpg",
    colors: [
      { id: "cristal", label: "Cristal", hex: "#E5E4E2" },
      { id: "rose", label: "Rose fumé", hex: "#D4A5A5" },
    ],
    faceShapes: ["triangle", "ovale"],
    category: "soleil",
    genres: ["femme"],
    badge: "limite",
    weight: "20 g",
    caliber: "52 mm",
    bridge: "17 mm",
    description:
      "Papillon / cat-eye solaire, édition limitée — élégance affirmative.",
  },
  {
    slug: "soleil-sport",
    name: "Soleil Sport",
    materialLabel: "Titane wrap",
    material: "titane",
    price: 198000,
    image: "/images/catalogue/cat-soleil-sport.jpg",
    colors: [
      { id: "noir", label: "Noir mat", hex: "#1A1A1A" },
      { id: "bleu", label: "Bleu sport", hex: "#1e3a5f" },
    ],
    faceShapes: ["carre", "ovale", "triangle"],
    category: "soleil",
    genres: ["homme", "unisexe"],
    weight: "18 g",
    caliber: "60 mm",
    bridge: "15 mm",
    description:
      "Enveloppe sportive en titane, verres polarisés anti-reflet pour l’actif.",
  },
  {
    slug: "soleil-junior",
    name: "Soleil Junior",
    materialLabel: "Acétate souple UV",
    material: "bio",
    price: 78000,
    image: "/images/catalogue/cat-soleil-extra.jpg",
    colors: [
      { id: "bleu", label: "Bleu", hex: "#6BA3D6" },
      { id: "vert", label: "Vert", hex: "#7A8F6A" },
    ],
    faceShapes: ["rond", "ovale"],
    category: "soleil",
    genres: ["enfant"],
    weight: "15 g",
    caliber: "46 mm",
    bridge: "16 mm",
    description:
      "Solaires enfant bio-acétate, protection UV400 et branches flexibles.",
  },

  // —— PROGRESSIFS ——
  {
    slug: "progressif-clarity",
    name: "Progressif Clarity",
    materialLabel: "Acétate premium",
    material: "acetate",
    price: 210000,
    image: "/images/catalogue/cat-progressif.jpg",
    colors: [
      { id: "noir", label: "Noir", hex: "#1A1A1A" },
      { id: "ecaille", label: "Écaille", hex: "#8B4513" },
    ],
    faceShapes: ["ovale", "carre", "rond"],
    category: "progressif",
    genres: ["femme", "homme", "unisexe"],
    badge: "bestseller",
    weight: "20 g",
    caliber: "53 mm",
    bridge: "18 mm",
    description:
      "Monture optimisée pour verres progressifs — corridors larges et stabilité.",
  },
  {
    slug: "progressif-lite",
    name: "Progressif Lite",
    materialLabel: "Titane léger",
    material: "titane",
    price: 268000,
    image: "/images/catalogue/cat-progressif-2.jpg",
    colors: [
      { id: "argent", label: "Argent", hex: "#A9A9A9" },
      { id: "gunmetal", label: "Gunmetal", hex: "#36454F" },
    ],
    faceShapes: ["ovale", "carre"],
    category: "progressif",
    genres: ["homme", "femme", "unisexe"],
    badge: "nouveaute",
    weight: "12 g",
    caliber: "51 mm",
    bridge: "19 mm",
    description:
      "Titane conçu pour progressifs haut de gamme, poids plume et précision.",
  },
  {
    slug: "progressif-bio",
    name: "Progressif Bio",
    materialLabel: "Bio-acétate",
    material: "bio",
    price: 192000,
    image: "/images/catalogue/cat-progressif-extra.jpg",
    colors: [
      { id: "havane", label: "Havane", hex: "#8B4513" },
      { id: "vert", label: "Vert", hex: "#7A8F6A" },
    ],
    faceShapes: ["ovale", "rond", "triangle"],
    category: "progressif",
    genres: ["femme", "unisexe"],
    weight: "19 g",
    caliber: "52 mm",
    bridge: "18 mm",
    description:
      "Progressifs sur bio-acétate — confort, éthique et style intemporel.",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(value)} F CFA`;
}
