// Seam: Aufbau der B2B-Startseite und das Pilot-Popup, deutsch und englisch.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const lies = (rel) => fs.readFileSync(path.join(__dirname, "..", rel), "utf8");
const SEITEN = ["b2b/index.html", "en/b2b/index.html"];
const ROLLEN = ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"];
const ALLE_B2B = [...SEITEN, ...ROLLEN.flatMap((r) => ["b2b/" + r + ".html", "en/b2b/" + r + ".html"])];

test("die große Überschrift ist der neue englische Slogan, Unterüberschrift und Preiszeile im Kopf entfallen", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    assert.match(h, /<h1 id="hero-titel" lang="en">Keep walkin’ strong, the whole day long<\/h1>/, f);
    assert.match(h, /<p class="hero__slogan" lang="en">Nothing fancy\. Just a great way to get through your day\.<\/p>/, f);
    assert.doesNotMatch(h, /hero__antwort|hero__preis/, f);
  }
});

test("jeder Knopf Pilot buchen öffnet das Popup, es gibt genau ein Popup je Seite mit allen Pflichtfeldern", () => {
  for (const f of ALLE_B2B) {
    const h = lies(f);
    const links = [...h.matchAll(/<a [^>]*href="(?:\.\/)?#pilot"[^>]*>/g)].map((m) => m[0]);
    assert.ok(links.length >= 2, f + ": Pilot-Verweise");
    for (const l of links) assert.match(l, /data-pilot-oeffnen/, f + ": " + l);
    assert.equal((h.match(/<dialog /g) || []).length, 1, f);
    for (const feld of ["unternehmen", "rolle", "mitarbeitende", "kontakt", "quelle", "freitext", "einwilligung"]) {
      assert.match(h, new RegExp('data-feld="' + feld + '"'), f + " " + feld);
    }
    for (const feld of ["unternehmen", "rolle", "mitarbeitende", "kontakt", "quelle", "freitext"]) {
      assert.match(h, new RegExp('name="' + feld + '"[^>]* required|required[^>]*name="' + feld + '"'), f + " Pflicht " + feld);
    }
    assert.match(h, /pilot\.js/, f + ": Skript");
    assert.match(h, /formular\.js/, f + ": Skript");
  }
});

test("die Auswahl 'aufmerksam geworden' hat in beiden Sprachen dieselben acht Kennungen in derselben Reihenfolge, Anderer Weg zuletzt", () => {
  const ids = (h) => [...h.match(/<select id="f-quelle"[\s\S]*?<\/select>/)[0].matchAll(/<option value="([^"]*)"/g)].map((m) => m[1]);
  const soll = ["", "ki", "suchmaschine", "soziale-netzwerke", "empfehlung-unternehmen", "empfehlung-mitarbeitende", "kontakt-durch-vianu", "presse-veranstaltung", "anderer"];
  for (const f of ALLE_B2B) assert.deepEqual(ids(lies(f)), soll, f);
});

test("die Startseite zeigt keine Kurzliste mehr und keine Geschichte-Unterseite, dafür Geschichte, zwei Stimmen und die neue Reihenfolge", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    assert.doesNotMatch(h, /class="kurz"/, f);
    const reihe = ["geschichte", "stimme-frueh", "ablauf", "messwerte", "preis", "wer-entscheidet-mit", "programm", "zweites-paar", "faq", "pilot"];
    const pos = reihe.map((id) => h.indexOf('<section class="' ) >= 0 ? h.search(new RegExp('<section[^>]*id="' + id + '"')) : -1);
    assert.ok(pos.every((p) => p > 0), f + " " + pos);
    assert.deepEqual([...pos].sort((a, b) => a - b), pos, f + ": Reihenfolge");
    assert.equal((h.match(/<figure class="stimme" data-platzhalter/g) || []).length, 2, f + ": Stimmen");
  }
});

test("Was Sie bekommen ist ein Reiter-Baustein mit drei Feldern und vier Chips", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    assert.equal((h.match(/data-reiter="\d"/g) || []).length, 3, f);
    assert.equal((h.match(/data-feld-nr="\d"/g) || []).length, 3, f);
    assert.doesNotMatch(h, /role="tab(list|panel)?"/, f + ": Rollen setzt erst das Skript");
    assert.equal((h.match(/<ul class="chips chips--gross">(<li>[^<]+<\/li>){4}<\/ul>/g) || []).length, 1, f);
  }
});

test("der Rechner nennt den Zeitraum der Schichten: in einem Jahr", () => {
  for (const [f, label] of [["b2b/index.html", /Schichten in einem Jahr/], ["en/b2b/index.html", /Shifts in one year/]]) {
    const h = lies(f);
    assert.match(h, label, f);
    assert.match(h, /data-rechner-text>[^<]*(in einem Jahr|in one year)/, f);
  }
});

test("Messwert-Symbole sind die neuen mehrfarbigen und stehen auch auf den Rollenseiten", () => {
  for (const f of [...SEITEN, ...ROLLEN.map((r) => "b2b/" + r + ".html")]) {
    const h = lies(f);
    assert.equal((h.match(/class="ico messwert__bild"/g) || []).length, 4, f);
    assert.doesNotMatch(h, /<svg class="messwert__bild"/, f);
  }
});

test("die Fußform der Sorgen ist ein Umriss mit Zehen über den Kacheln", () => {
  for (const f of SEITEN) assert.match(lies(f), /<svg class="sorgen__umriss"[^>]*><polygon points="[^"]{200,}"/, f);
});

test("der Ablauf ist der Handy-Ablauf mit vier Schritten, Bahn-Etikett je Schritt und Knopf im Bild, ohne Bahnen-Raster", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    const ab = h.match(/<section class="abschnitt ablauf" id="ablauf"[\s\S]*?<\/section>/)[0];
    assert.equal((ab.match(/<button class="ablauf__schritt"/g) || []).length, 4, f);
    assert.equal((ab.match(/class="etikett ablauf__bahn"/g) || []).length, 4, f);
    assert.match(ab, /<svg class="handy"/, f);
    assert.match(ab, /<button class="knopf handy__cta" type="button" data-cta-schritt="1" data-pilot-oeffnen>/, f);
    assert.equal((ab.match(/data-screen="\d"/g) || []).length, 4, f);
    assert.doesNotMatch(h, /bahnen/, f);
    assert.match(h, /<symbol id="sohle-form"/, f);
  }
});

test("der Preis ist ein Preisschild mit Bündel aus zehn Sohlen und einem Siegel für die Haltbarkeit", () => {
  for (const [f, zahl, bund, siegel] of [["b2b/index.html", /120 &euro;/, /10 Paare, 1\.200 Euro/, /mindestens 3 Jahre einwandfrei/], ["en/b2b/index.html", /&euro;120/, /10 pairs, EUR 1,200/, /at least 3 years/]]) {
    const h = lies(f);
    assert.match(h, /<p class="preisschild" aria-label="[^"]*120[^"]*">/, f);
    assert.match(h, zahl, f);
    assert.equal((h.match(/class="buendel__sohle"/g) || []).length, 10, f);
    assert.match(h, bund, f);
    assert.match(h, /<div class="siegel"><span class="siegel__rund" aria-hidden="true"><strong>3<\/strong>/, f);
    assert.match(h, siegel, f);
  }
});

test("Zweites Paar zeigt zwei Sohlen und bleibt als Platzhalter markiert", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    const z = h.match(/<section class="abschnitt" id="zweites-paar"[\s\S]*?<\/section>/)[0];
    assert.match(z, /class="zweites__bild"/, f);
    assert.equal((z.match(/class="zweites__sohle/g) || []).length, 2, f);
    assert.match(z, /data-platzhalter/, f);
  }
});

test("die FAQ hat zwei Gruppenköpfe und jede Frage ist ein details mit summary", () => {
  for (const f of ALLE_B2B) {
    const h = lies(f);
    assert.ok((h.match(/<h3 class="etikett fragen__titel"/g) || []).length >= 1, f);
    const n = (h.match(/<details class="frage">/g) || []).length;
    assert.equal((h.match(/<summary>/g) || []).length, n, f);
    assert.ok(n >= 8, f + ": " + n);
  }
});
