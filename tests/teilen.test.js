// Seam: Teilen-Links (assets/js/teilen.js). Welcher Link wird kopiert, wenn jemand teilt.
const test = require("node:test");
const assert = require("node:assert/strict");
const { linkFuerKollegen, linkFuerRolle, ROLLEN } = require("../assets/js/teilen.js");

test("Link für Kolleginnen und Kollegen ist die Startseite, ohne Anker und Suchteil", () => {
  assert.equal(linkFuerKollegen("https://example.org/index.html#fragen?x=1"), "https://example.org/");
  assert.equal(linkFuerKollegen("https://example.org/"), "https://example.org/");
});

test("Link für eine Rolle führt auf deren Seite im B2B-Bereich und trägt die Quelle", () => {
  assert.equal(
    linkFuerRolle("https://example.org/index.html", "einkauf"),
    "https://example.org/b2b/einkauf.html?quelle=mitarbeitende"
  );
  assert.equal(
    linkFuerRolle("https://example.org/", "geschaeftsfuehrung"),
    "https://example.org/b2b/geschaeftsfuehrung.html?quelle=mitarbeitende"
  );
});

test("unbekannte oder manipulierte Rollen erzeugen keinen Link", () => {
  assert.equal(linkFuerRolle("https://example.org/", "../geheim"), null);
  assert.equal(linkFuerRolle("https://example.org/", "einkauf.html?x=1"), null);
  assert.equal(linkFuerRolle("https://example.org/", ""), null);
  assert.equal(linkFuerRolle("https://example.org/", undefined), null);
});

test("die Auswahl bietet die fünf Rollen in der Reihenfolge des Entscheidungsteams", () => {
  assert.deepEqual(
    ROLLEN.map((r) => r.id),
    ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"]
  );
  assert.deepEqual(
    ROLLEN.map((r) => r.name),
    ["Personal", "Geschäftsführung und Betrieb", "Arbeitsschutz", "Einkauf", "Betriebsrat"]
  );
});
