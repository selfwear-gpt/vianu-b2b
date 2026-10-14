// Seam: Aufbau der Rollenseiten (b2b/<rolle>.html). Jede Seite muss für sich stehen und die Bausteine der Persona-Seite tragen.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const ROLLEN = ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"];
const seite = (r) => fs.readFileSync(path.join(ROOT, "b2b", r + ".html"), "utf8");
const titel = (h) => (h.match(/<title>([^<]*)<\/title>/) || [])[1];

test("jede Rollenseite hat genau ein h1, einen eigenen Titel und eine eigene Beschreibung", () => {
  const titelListe = [];
  const beschreibungen = [];
  for (const r of ROLLEN) {
    const h = seite(r);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, r + ": h1");
    titelListe.push(titel(h));
    beschreibungen.push((h.match(/<meta name="description" content="([^"]+)"/) || [])[1]);
  }
  assert.equal(new Set(titelListe).size, ROLLEN.length, "Titel doppelt: " + titelListe.join(" | "));
  assert.ok(beschreibungen.every(Boolean), "Beschreibung fehlt");
  assert.equal(new Set(beschreibungen).size, ROLLEN.length, "Beschreibungen doppelt");
});

test("nur die Rollenseiten tragen die Klasse rollenseite, damit der Einseiter-Druckstil nicht andere Seiten leert", () => {
  for (const r of ROLLEN) assert.match(seite(r), /<body class="rollenseite">/, r);
  for (const f of ["index.html", "b2b/index.html"]) assert.doesNotMatch(fs.readFileSync(path.join(ROOT, f), "utf8"), /rollenseite/, f);
});

test("die Rollenseiten sind für Suchmaschinen offen", () => {
  for (const r of ROLLEN) assert.doesNotMatch(seite(r), /noindex/, r);
});

test("jede Rollenseite trägt Im Termin, Brief mit Unterschrift, Messwerte, FAQ und Weiterleiten", () => {
  for (const r of ROLLEN) {
    const h = seite(r);
    assert.match(h, /<section class="abschnitt einseiter" id="termin"/, r + ": Im Termin");
    assert.match(h, /class="zitatkarte"[\s\S]*?<p class="brief__unterschrift">Roderich<\/p>/, r + ": Brief");
    assert.equal((h.match(/<li class="messwert messwert--dreh/g) || []).length, 4, r + ": vier Messwert-Kacheln");
    assert.match(h, /class="fragen__gruppe"/, r + ": FAQ");
    assert.match(h, /data-weiterleiten/, r + ": Weiterleiten");
    assert.match(h, new RegExp('href="\\.\\./assets/downloads/rolle-' + r + '\\.pdf"'), r + ": PDF-Verweis");
    assert.match(h, /href="\.\/#pilot"/, r + ": Pilot buchen");
  }
});

test("die Rollenseiten tragen FAQPage-Daten mit beantworteten Fragen", () => {
  for (const r of ROLLEN) {
    const m = seite(r).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(m, r + ": JSON-LD");
    const d = JSON.parse(m[1]);
    assert.equal(d["@type"], "FAQPage");
    assert.ok(d.mainEntity.length >= 3, r + ": mindestens drei beantwortete Fragen");
  }
});

test("jede Rolle hebt ihre wichtigen Messwerte hervor (messwert--wichtig), nicht alle", () => {
  const erwartet = { personal: 3, geschaeftsfuehrung: 2, arbeitsschutz: 2, einkauf: 2, betriebsrat: 2 };
  for (const r of ROLLEN) {
    const n = (seite(r).match(/class="messwert messwert--dreh messwert--wichtig"/g) || []).length;
    assert.equal(n, erwartet[r], r + ": " + n + " große Kacheln");
  }
});

test("rollenspezifische Bausteine: Matte und Weg, Datenfluss, Rechner", () => {
  assert.match(seite("arbeitsschutz"), /data-weg/);
  assert.match(seite("arbeitsschutz"), /Die Sohle ergänzt die Arbeitsplatzmatte\./);
  assert.match(seite("betriebsrat"), /id="datenfluss"/);
  assert.match(seite("betriebsrat"), /class="fluss__knoten fluss__knoten--offen"/);
  assert.match(seite("geschaeftsfuehrung"), /data-rechner/);
});

test("die Studien stehen nur auf den Seiten der Rolle, deren Frage sie beantworten", () => {
  const erlaubt = { Reed: ["personal"], Bernardes: ["personal", "arbeitsschutz"], Smith: ["geschaeftsfuehrung"], Speed: ["arbeitsschutz"] };
  for (const [studie, seiten] of Object.entries(erlaubt)) {
    for (const r of ROLLEN) {
      const text = seite(r).replace(/<script[\s\S]*?<\/script>/g, "");
      assert.equal(text.includes(studie), seiten.includes(r), `${studie} auf ${r}`);
    }
  }
});

test("Der Link zum Datenschutz-Block der Betriebsratsseite findet sein Ziel", () => {
  const start = fs.readFileSync(path.join(ROOT, "b2b", "index.html"), "utf8");
  const m = start.match(/href="(betriebsrat\.html)#([a-z-]+)"/);
  assert.ok(m, "Link betriebsrat.html#... fehlt auf der B2B-Startseite");
  assert.match(seite("betriebsrat"), new RegExp(`id="${m[2]}"`));
});

test("das Erfolgskriterium steht im Termin und nicht mehr doppelt unter den Messwerten", () => {
  for (const r of ROLLEN) {
    assert.match(seite(r), /Der Pilot gilt als Erfolg, wenn/, r);
    assert.doesNotMatch(seite(r), /messwerte__erfolg/, r);
  }
});

test("Smith nennt die Förderung durch einen Einlegesohlen-Hersteller und die Selbstauskunft", () => {
  const h = seite("geschaeftsfuehrung");
  assert.match(h, /Einlegesohlen-Hersteller/);
  assert.match(h, /Selbstauskunft/);
});

test("keine Rollenseite nennt die 24 Prozent", () => {
  for (const r of ROLLEN) {
    const h = seite(r).replace(/<script[\s\S]*?<\/script>/g, "");
    assert.doesNotMatch(h, /24\s?%|24 Prozent/, r);
  }
});

test("B2B und B2C sagen dasselbe zu Haltbarkeit und Lieferzeit, deutsch und englisch", () => {
  for (const [datei, halt, lief] of [
    ["b2b/index.html", /mindestens 3 Jahre einwandfrei/, /spätestens 7 Tage nach der Fußerfassung/],
    ["en/b2b/index.html", /at least 3 years/, /at the latest 7 days after the foot capture/],
    ["b2b/einkauf.html", /mindestens 3 Jahre einwandfrei/, /spätestens 7 Tage nach der Fußerfassung/],
    ["en/b2b/einkauf.html", /at least 3 years/, /at the latest 7 days after the foot capture/],
    ["b2b/geschaeftsfuehrung.html", /mindestens 3 Jahre einwandfrei/, /spätestens 7 Tage nach der Fußerfassung/]
  ]) {
    const h = fs.readFileSync(path.join(__dirname, "..", datei), "utf8");
    assert.match(h, halt, datei + " Haltbarkeit");
    assert.match(h, lief, datei + " Lieferzeit");
  }
});

test("die Rollenseiten haben keinen Platzhalter mehr für die Lieferzeit", () => {
  for (const r of ROLLEN) assert.doesNotMatch(seite(r), /Antwort folgt, sobald eine Lieferzeit|Answer to follow once a delivery time/, r);
});
