import { readFile } from "fs/promises";
import path from "path";
import meta from "@/content/mains/meta.json";

export type HtmlPageId = keyof typeof meta;

export async function getMainHtml(id: HtmlPageId) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "mains",
    `${id}.html`
  );
  const html = await readFile(filePath, "utf8");
  return {
    html,
    className: meta[id].className as string,
  };
}
