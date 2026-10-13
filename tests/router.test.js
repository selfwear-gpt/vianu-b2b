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
