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
    assert.match(h, /class="termin"/, r + ": Im Termin");
    assert.match(h, /class="brief"[\s\S]*?<p class="brief__unterschrift">Roderich<\/p>/, r + ": Brief");
    assert.equal((h.match(/class="messwert\b/g) || []).length, 4, r + ": vier Messwert-Kacheln");
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

test("jede Rolle stellt ihre Messwerte nach vorn (messwert--gross), nicht alle", () => {
  const erwartet = { personal: 3, geschaeftsfuehrung: 2, arbeitsschutz: 2, einkauf: 2, betriebsrat: 2 };
  for (const r of ROLLEN) {
    const n = (seite(r).match(/class="messwert messwert--gross"/g) || []).length;
    assert.equal(n, erwartet[r], r + ": " + n + " große Kacheln");
  }
});

test("rollenspezifische Bausteine: Matte und Weg, Datenfluss, Rechner", () => {
  assert.match(seite("arbeitsschutz"), /data-weg/);
  assert.match(seite("arbeitsschutz"), /Die Sohle ergänzt die Matte und ersetzt sie nicht\./);
  assert.match(seite("betriebsrat"), /id="datenfluss"/);
  assert.match(seite("betriebsrat"), /class="fluss__knoten fluss__knoten--offen"/);
  assert.match(seite("geschaeftsfuehrung"), /data-rechner/);
});

test("die Studien stehen nur auf den Seiten der Rolle, deren Frage sie beantworten", () => {
  const hat = (r, text) => seite(r).includes(text);
  assert.ok(hat("personal", "Reed"));
  assert.ok(hat("geschaeftsfuehrung", "Smith"));
  assert.ok(hat("arbeitsschutz", "Speed"));
  for (const r of ["einkauf", "betriebsrat"]) for (const n of ["Reed", "Smith", "Speed", "Bernardes"]) assert.ok(!hat(r, n), r + " nennt " + n);
  assert.ok(!hat("geschaeftsfuehrung", "Reed") && !hat("arbeitsschutz", "Reed"));
});

test("Smith nennt die Förderung durch einen Einlegesohlen-Hersteller und die Selbstauskunft", () => {
  const h = seite("geschaeftsfuehrung");
  assert.match(h, /Einlegesohlen-Hersteller/);
  assert.match(h, /Selbstauskunft/);
});

test("keine Seite nennt die 24 Prozent oder eine Haltbarkeit", () => {
  for (const r of ROLLEN) {
    const h = seite(r).replace(/<script[\s\S]*?<\/script>/g, "");
    assert.doesNotMatch(h, /24\s?%|24 Prozent/, r);
    assert.doesNotMatch(h, /Haltbar|hält\b/i, r);
  }
});
