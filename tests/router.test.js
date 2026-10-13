// Seam: Router der Gesamtvorschau (scripts/vorschau-router.js). Welche Seite zeigt welcher Link.
const test = require("node:test");
const assert = require("node:assert/strict");
const { seiteFuerHash, verweisFuerVorschau } = require("../scripts/vorschau-router.js");

test("die Kennung im Adressteil wählt die Seite, Anker innerhalb einer Seite wählen keine", () => {
  assert.equal(seiteFuerHash(""), "start");
  assert.equal(seiteFuerHash("#"), "start");
  assert.equal(seiteFuerHash("#b2b"), "b2b");
  assert.equal(seiteFuerHash("#programm"), null);
});

test("Verweise zwischen den Bereichen werden zu Kennungen, alles andere bleibt unberührt", () => {
  assert.equal(verweisFuerVorschau("b2b/", "start"), "#b2b");
  assert.equal(verweisFuerVorschau("b2b/index.html", "start"), "#b2b");
  assert.equal(verweisFuerVorschau("../", "b2b"), "#");
  assert.equal(verweisFuerVorschau("../index.html", "b2b"), "#");
  assert.equal(verweisFuerVorschau("./", "b2b"), "#b2b");
  assert.equal(verweisFuerVorschau("./", "start"), "#");
  // bleibt unberührt: Anker, externe Adressen, E-Mail, noch nicht vorhandene Seiten
  assert.equal(verweisFuerVorschau("#programm", "start"), null);
  assert.equal(verweisFuerVorschau("https://example.org/", "start"), null);
  assert.equal(verweisFuerVorschau("mailto:a@b.de", "start"), null);
  assert.equal(verweisFuerVorschau("b2b/unbekannt.html", "start"), null);
  assert.equal(verweisFuerVorschau("../assets/downloads/rolle-personal.pdf", "b2b-personal"), null);
});

const ROLLEN = ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"];

test("jede Rollenseite hat eine eigene Kennung im Adressteil", () => {
  for (const r of ROLLEN) assert.equal(seiteFuerHash("#b2b-" + r), "b2b-" + r);
  assert.equal(seiteFuerHash("#b2b-chef"), null);
});

test("Verweise auf Rollenseiten werden zu Kennungen, auch mit Query und Anker", () => {
  for (const r of ROLLEN) {
    assert.equal(verweisFuerVorschau(r + ".html", "b2b"), "#b2b-" + r);
    assert.equal(verweisFuerVorschau("b2b/" + r + ".html?quelle=mitarbeitende", "start"), "#b2b-" + r);
  }
  assert.equal(verweisFuerVorschau("betriebsrat.html#datenfluss", "b2b"), "#b2b-betriebsrat");
});

test("von einer Rollenseite aus führen die Verweise zurück zur B2B-Startseite und zum Mitarbeitenden-Bereich", () => {
  for (const r of ROLLEN) {
    assert.equal(verweisFuerVorschau("./", "b2b-" + r), "#b2b");
    assert.equal(verweisFuerVorschau("../", "b2b-" + r), "#");
    assert.equal(verweisFuerVorschau("einkauf.html", "b2b-" + r), "#b2b-einkauf");
  }
});

test("Rechtsseiten und Roderichs Geschichte haben eine eigene Kennung", () => {
  assert.equal(seiteFuerHash("#impressum"), "impressum");
  assert.equal(seiteFuerHash("#datenschutz"), "datenschutz");
  assert.equal(seiteFuerHash("#b2b-roderich"), "b2b-roderich");
});

test("Verweise auf Rechtsseiten und die Geschichte werden zu Kennungen", () => {
  assert.equal(verweisFuerVorschau("impressum.html", "start"), "#impressum");
  assert.equal(verweisFuerVorschau("../datenschutz.html", "b2b"), "#datenschutz");
  assert.equal(verweisFuerVorschau("../impressum.html", "b2b-personal"), "#impressum");
  assert.equal(verweisFuerVorschau("roderich.html", "b2b"), "#b2b-roderich");
  assert.equal(verweisFuerVorschau("roderich.html", "b2b-einkauf"), "#b2b-roderich");
  assert.equal(verweisFuerVorschau("datenschutz.html", "impressum"), "#datenschutz");
  assert.equal(verweisFuerVorschau("./", "impressum"), "#");
  assert.equal(verweisFuerVorschau("b2b/", "datenschutz"), "#b2b");
});

const SEITEN_PAARE = [
  ["start", "en", "index.html", "en/index.html"],
  ["b2b", "en-b2b", "b2b/index.html", "en/b2b/index.html"],
  ["impressum", "en-impressum", "impressum.html", "en/impressum.html"],
  ["datenschutz", "en-datenschutz", "datenschutz.html", "en/datenschutz.html"],
  ["b2b-roderich", "en-b2b-roderich", "b2b/roderich.html", "en/b2b/roderich.html"],
  ...ROLLEN.map((r) => ["b2b-" + r, "en-b2b-" + r, "b2b/" + r + ".html", "en/b2b/" + r + ".html"])
];

test("jede englische Seite hat eine eigene Kennung", () => {
  for (const [, en] of SEITEN_PAARE) assert.equal(seiteFuerHash("#" + en), en, en);
  assert.equal(seiteFuerHash("#en-chef"), null);
});

test("der Umschalter führt von jeder deutschen Seite auf ihre englische und zurück", () => {
  const nachEn = { start: "en/", b2b: "../en/b2b/", impressum: "en/impressum.html", datenschutz: "en/datenschutz.html", "b2b-roderich": "../en/b2b/roderich.html" };
  for (const r of ROLLEN) nachEn["b2b-" + r] = "../en/b2b/" + r + ".html";
  for (const [de, en] of SEITEN_PAARE) assert.equal(verweisFuerVorschau(nachEn[de], de), "#" + en, de);
  const nachDe = { en: "../", "en-b2b": "../../b2b/", "en-impressum": "../impressum.html", "en-datenschutz": "../datenschutz.html", "en-b2b-roderich": "../../b2b/roderich.html" };
  for (const r of ROLLEN) nachDe["en-b2b-" + r] = "../../b2b/" + r + ".html";
  for (const [de, en] of SEITEN_PAARE) {
    const ziel = nachDe[en];
    // Die englischen Dateien stehen in en/ und en/b2b/, der Weg zurück ist relativ dazu.
    assert.equal(verweisFuerVorschau(ziel, en), "#" + (de === "start" ? "" : de), en);
  }
});

test("Verweise innerhalb der englischen Fassung bleiben dort", () => {
  assert.equal(verweisFuerVorschau("b2b/", "en"), "#en-b2b");
  assert.equal(verweisFuerVorschau("../", "en-b2b"), "#en");
  assert.equal(verweisFuerVorschau("./", "en-b2b-personal"), "#en-b2b");
  assert.equal(verweisFuerVorschau("einkauf.html", "en-b2b-personal"), "#en-b2b-einkauf");
  assert.equal(verweisFuerVorschau("impressum.html", "en"), "#en-impressum");
  assert.equal(verweisFuerVorschau("../impressum.html", "en-b2b"), "#en-impressum");
  assert.equal(verweisFuerVorschau("../../assets/downloads/role-personal.pdf", "en-b2b-personal"), null);
});
