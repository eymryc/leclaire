import type { HtmlPageId } from "@/lib/get-main-html";
import { getMainHtml } from "@/lib/get-main-html";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

type NavActive = "collection" | "virtual-try-on" | "expertise" | "magasins";

type Props = {
  id: HtmlPageId;
  active?: NavActive;
  /** Hide footer on immersive full-height pages if needed later */
  showFooter?: boolean;
};

export async function HtmlPage({ id, active, showFooter = true }: Props) {
  const { html, className } = await getMainHtml(id);

  return (
    <>
      <SiteHeader active={active} />
      <main
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {showFooter ? <SiteFooter /> : null}
    </>
  );
}
