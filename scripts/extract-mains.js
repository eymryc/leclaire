#!/usr/bin/env node
/**
 * Extract <main> inner HTML from Lumina mockups into src/content/mains/
 * for faithful display in Next.js (no design changes).
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const htmlDir = path.join(root, "html");
const outDir = path.join(root, "src", "content", "mains");

const pages = [
  { file: "acceuil.html", out: "accueil.html" },
  { file: "catalogue.html", out: "catalogue.html" },
  { file: "fiche-produit.html", out: "produit.html" },
  { file: "configuration-verres.html", out: "configuration-verres.html" },
  { file: "panier-configuration.html", out: "panier.html" },
  { file: "paiement-santé.html", out: "paiement.html" },
  { file: "confirmation-commande", out: "confirmation.html" },
  { file: "nos-magazin.html", out: "magasins.html" },
  { file: "mon-espace.html", out: "mon-espace.html" },
];

fs.mkdirSync(outDir, { recursive: true });

const meta = {};

for (const { file, out } of pages) {
  const raw = fs.readFileSync(path.join(htmlDir, file), "utf8");
  const match = raw.match(/<main([^>]*)>([\s\S]*?)<\/main>/i);
  if (!match) {
    console.error("No <main> in", file);
    process.exit(1);
  }
  const attrs = match[1];
  const classMatch = attrs.match(/class="([^"]*)"/);
  const className = classMatch ? classMatch[1] : "w-full pt-20 bg-background";
  let inner = match[2];

  // Drop inline <script> and page-local <style> for SSR safety (UI only for now)
  inner = inner.replace(/<script[\s\S]*?<\/script>/gi, "");
  // Keep <style> for fiche-produit animations — convert later if needed
  // Strip onclick handlers (will re-add as React later)
  inner = inner.replace(/\s+onclick="[^"]*"/gi, "");

  fs.writeFileSync(path.join(outDir, out), inner.trim() + "\n");
  meta[out.replace(/\.html$/, "")] = { className, source: file };
  console.log("OK", file, "→", out);
}

fs.writeFileSync(
  path.join(outDir, "meta.json"),
  JSON.stringify(meta, null, 2) + "\n"
);
console.log("Wrote meta.json");
