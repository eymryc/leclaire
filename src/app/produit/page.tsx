import { redirect } from "next/navigation";
import { products } from "@/lib/catalog/products";

export default function ProduitIndexPage() {
  redirect(`/produit/${products[0].slug}`);
}
