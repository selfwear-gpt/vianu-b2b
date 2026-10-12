// Seam: Namensbereinigung (assets/js/name.js). Eingabe der Besucher, Ausgabe fürs Anzeigen auf der Sohle.
const test = require("node:test");
const assert = require("node:assert/strict");
const { bereinigeName } = require("../assets/js/name.js");

test("behält Buchstaben mit Umlaut und ß, entfernt Ziffern und Sonderzeichen", () => {
  assert.equal(bereinigeName("Jörg2!"), "Jörg");
  assert.equal(bereinigeName("Strauß<script>"), "Straußscript");
});

test("erlaubt Bindestrich, Apostroph und einzelne Leerzeichen, entfernt führende und doppelte", () => {
  assert.equal(bereinigeName("  Anna   Lena"), "Anna Lena");
  assert.equal(bereinigeName("Anna-Lena"), "Anna-Lena");
  assert.equal(bereinigeName("D'Angelo"), "D'Angelo");
});

test("kürzt auf höchstens 14 Zeichen und zählt Umlaute als ein Zeichen", () => {
  assert.equal(bereinigeName("Anna-Lena-Marie-Sophie"), "Anna-Lena-Mari");
  assert.equal(bereinigeName("ÄÖÜäöüßÄÖÜäöüßÄÖÜ"), "ÄÖÜäöüßÄÖÜäöüß");
  assert.equal([...bereinigeName("ÄÖÜäöüßÄÖÜäöüßÄÖÜ")].length, 14);
});
