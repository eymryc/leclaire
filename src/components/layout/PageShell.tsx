import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type NavActive = "collection" | "virtual-try-on" | "magasins";

export function PageShell({
  children,
  active,
  mainClassName = "w-full pt-16 bg-background flex-1 lg:pt-28",
  showFooter = true,
}: {
  children: React.ReactNode;
  active?: NavActive;
  mainClassName?: string;
  showFooter?: boolean;
}) {
  return (
    <>
      <Suspense
        fallback={
          <header className="fixed top-0 z-50 h-16 w-full border-b border-surface-variant/20 bg-white lg:h-28" />
        }
      >
        <SiteHeader active={active} />
      </Suspense>
      <main id="contenu-principal" className={mainClassName}>
        {children}
      </main>
      {showFooter ? <SiteFooter /> : null}
    </>
  );
}
