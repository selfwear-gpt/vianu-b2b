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
  assert.equal(verweisFuerVorschau("b2b/einkauf.html", "start"), null);
});
