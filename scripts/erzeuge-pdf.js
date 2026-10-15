#!/usr/bin/env node
/*
  Erzeugt den Einseiter jeder Rollenseite als PDF: assets/downloads/rolle-<id>.pdf (Deutsch) und role-<id>.pdf (Englisch).
  Der Druckstil in assets/css/components.css lässt nur Kopf und "Im Termin" stehen.
  Das Skript gehört nicht zur ausgelieferten Seite. Die PDFs liegen im Repo, damit der Link auf der Seite trägt.

  Aufruf im Repo-Hauptordner:
    NODE_PATH=$(npm root -g) CHROMIUM_PFAD=/opt/pw-browsers/chromium node scripts/erzeuge-pdf.js
  Rückgabewert 0 bei Erfolg, 1 wenn eine PDF nicht genau eine Seite hat.
*/
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const ROLLEN = ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"];

function seitenZahl(puffer) {
  const text = puffer.toString("latin1");
  const treffer = text.match(/\/Type\s*\/Page(?![s\w])/g);
  return treffer ? treffer.length : 0;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PFAD || undefined });
  fs.mkdirSync(path.join(ROOT, "assets", "downloads"), { recursive: true });
  let fehler = 0;
  const FASSUNGEN = [
    { ordner: "b2b", praefix: "rolle-" },
    { ordner: path.join("en", "b2b"), praefix: "role-" }
  ];
  for (const f of FASSUNGEN) for (const rolle of ROLLEN) {
    const seite = await browser.newPage();
    await seite.goto("file://" + path.join(ROOT, f.ordner, rolle + ".html"));
    await seite.evaluate(() => document.fonts.ready);
    const pdf = await seite.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    const ziel = path.join(ROOT, "assets", "downloads", f.praefix + rolle + ".pdf");
    fs.writeFileSync(ziel, pdf);
    const n = seitenZahl(pdf);
    console.log((n === 1 ? "ok     " : "FEHLER ") + f.praefix + rolle + ".pdf: " + n + " Seite(n), " + Math.round(pdf.length / 1024) + " KB");
    if (n !== 1) fehler++;
    await seite.close();
  }
  await browser.close();
  process.exit(fehler ? 1 : 0);
})();
