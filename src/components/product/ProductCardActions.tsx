import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  className?: string;
};

/** Actions communes : fiche produit + essayage virtuel */
export function ProductCardActions({ slug, name, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link
        href={`/produit/${slug}`}
        className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full border border-primary/15 bg-surface px-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-primary transition hover:bg-surface-container-low"
        aria-label={`Voir le détail de ${name}`}
      >
        <span className="material-symbols-outlined text-[18px]">info</span>
        <span className="hidden sm:inline">Détail</span>
      </Link>
      <Link
        href={`/produit/${slug}?vto=1`}
        className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-primary px-3 text-[12px] font-semibold uppercase tracking-[0.06em] text-white transition hover:bg-secondary"
        aria-label={`Essayage virtuel ${name}`}
      >
        <span className="material-symbols-outlined text-[18px]">view_in_ar</span>
        <span className="hidden sm:inline">Essayer</span>
      </Link>
    </div>
  );
}
