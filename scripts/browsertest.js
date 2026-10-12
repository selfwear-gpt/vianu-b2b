#!/usr/bin/env node
/*
  Browsertest einer Seite in Desktop-, Tablet- und Handybreite.
  Prüft: kein horizontaler Überlauf, keine Anfragen an fremde Server, Schriften geladen,
  genau ein h1, keine Konsolenfehler. Speichert Bildschirmfotos zum Vergleich.

  Voraussetzung: Node und das Paket "playwright" (npm i -g playwright). Läuft ein Chromium woanders,
  den Pfad in CHROMIUM_PFAD setzen.

  Aufruf:
    node scripts/browsertest.js <Adresse der Seite> <Ordner für Bilder>
  Beispiele:
    python3 -m http.server 8000   (in einem zweiten Fenster)
    node scripts/browsertest.js http://localhost:8000/b2b/index.html /tmp/lokal
    node scripts/browsertest.js https://<live-adresse>/b2b/ /tmp/live
  Vergleich der Bilder (gleiches Aussehen heißt: keine Ausgabe von cmp):
    cmp /tmp/lokal/desktop.png /tmp/live/desktop.png
*/
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const [adresse, ordner] = process.argv.slice(2);
if (!adresse || !ordner) {
  console.error("Aufruf: node scripts/browsertest.js <Adresse> <Ordner für Bilder>");
  process.exit(2);
}

const BREITEN = [["desktop", 1280], ["tablet", 820], ["phone", 390]];

(async () => {
  fs.mkdirSync(ordner, { recursive: true });
  const browser = await chromium.launch(process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : {});
  const eigeneQuelle = new URL(adresse).origin;
  let fehler = 0;

  for (const [name, breite] of BREITEN) {
    const seite = await browser.newPage({ viewport: { width: breite, height: 900 } });
    const anfragen = [];
    const meldungen = [];
    seite.on("request", (r) => anfragen.push(r.url()));
    seite.on("pageerror", (e) => meldungen.push(String(e)));
    seite.on("console", (m) => {
      // Das fehlende Favicon gehört zur Identität und wird nicht gemeldet. Alles andere schon.
      const quelle = (m.location() && m.location().url) || "";
      if (m.type() === "error" && !quelle.includes("favicon")) meldungen.push(m.text() + (quelle ? ` (${quelle})` : ""));
    });

    await seite.goto(adresse, { waitUntil: "networkidle" });
    await seite.evaluate(() => document.fonts.ready);

    const ueberlauf = await seite.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const fremd = anfragen.filter((u) => !u.startsWith(eigeneQuelle) && !u.startsWith("data:") && !u.startsWith("about:"));
    const geladen = await seite.evaluate(() => document.fonts.size > 0 && [...document.fonts].some((f) => f.status === "loaded"));
    const h1 = await seite.evaluate(() => document.querySelectorAll("h1").length);

    const ergebnis = [
      ["Überlauf", ueberlauf === 0, `${ueberlauf}px`],
      ["Fremdanfragen", fremd.length === 0, fremd.length ? fremd.join(", ") : "keine"],
      ["Schriften geladen", geladen, geladen ? "ja" : "nein"],
      ["Anzahl h1", h1 === 1, String(h1)],
      ["Konsolenfehler", meldungen.length === 0, meldungen.length ? meldungen.join("; ") : "keine"],
    ];
    console.log(`${name} (${breite}px):`);
    for (const [titel, ok, wert] of ergebnis) {
      if (!ok) fehler++;
      console.log(`  ${ok ? "ok    " : "FEHLER"} ${titel}: ${wert}`);
    }
    await seite.screenshot({ path: path.join(ordner, `${name}.png`), fullPage: true });
    await seite.close();
  }
  await browser.close();
  process.exit(fehler ? 1 : 0);
})();
