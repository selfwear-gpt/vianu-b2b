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

const { bereinigeFirma } = require("../assets/js/name.js");

test("Firma: erlaubt Buchstaben, Ziffern, Leerzeichen und & . - ' und entfernt den Rest", () => {
  assert.equal(bereinigeFirma("Hotel Sonnenhof"), "Hotel Sonnenhof");
  assert.equal(bereinigeFirma("Müller & Söhne"), "Müller & Söhne");
  assert.equal(bereinigeFirma("Café 24-7 e.K."), "Café 24-7 e.K.");
  assert.equal(bereinigeFirma("Gasthof <b>Adler</b>"), "Gasthof bAdlerb");
  assert.equal(bereinigeFirma("Hotel’s *Best*"), "Hotel's Best");
});

test("Firma: entfernt führende und doppelte Leerzeichen, kürzt auf 18 Zeichen", () => {
  assert.equal(bereinigeFirma("   Hotel    Adler"), "Hotel Adler");
  assert.equal([...bereinigeFirma("Gasthaus Zum Goldenen Hirschen")].length, 18);
  assert.equal(bereinigeFirma("Gasthaus Zum Goldenen Hirschen"), "Gasthaus Zum Golde");
  assert.equal(bereinigeFirma(""), "");
  assert.equal(bereinigeFirma(null), "");
});
