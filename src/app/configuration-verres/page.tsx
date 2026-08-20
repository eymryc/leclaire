import { redirect } from "next/navigation";

/** Ancienne page retirée — redirection permanente. */
export default function ConfigurationVerresRemoved() {
  redirect("/magasins");
}
