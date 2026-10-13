// Seam: Kostenrechner (assets/js/kosten.js). Preis je Paar geteilt durch die Schichten, die Besucher einstellen.
const test = require("node:test");
const assert = require("node:assert/strict");
const { kostenJeSchicht, begrenzeSchichten, SCHICHTEN } = require("../assets/js/kosten.js");

test("rechnet 120 Euro durch die Schichtzahl und schreibt deutsch mit Komma und zwei Stellen", () => {
  assert.equal(kostenJeSchicht(120, 220).text, "0,55 Euro");
  assert.equal(kostenJeSchicht(120, 240).text, "0,50 Euro");
  assert.equal(kostenJeSchicht(120, 8).text, "15,00 Euro");
  assert.equal(kostenJeSchicht(120, 1).text, "120,00 Euro");
});

test("rundet auf ganze Cent kaufmännisch", () => {
  assert.equal(kostenJeSchicht(120, 220).cent, 55);
  assert.equal(kostenJeSchicht(120, 7).cent, 1714);
  assert.equal(kostenJeSchicht(100, 3).cent, 3333);
  assert.equal(kostenJeSchicht(1, 200).cent, 1);
});

test("ungültige Eingaben ergeben null", () => {
  assert.equal(kostenJeSchicht(120, 0), null);
  assert.equal(kostenJeSchicht(120, -5), null);
  assert.equal(kostenJeSchicht(120, NaN), null);
  assert.equal(kostenJeSchicht(120, "abc"), null);
  assert.equal(kostenJeSchicht(NaN, 220), null);
});

test("nimmt Zahlen auch als Text, wie sie aus dem Regler kommen", () => {
  assert.equal(kostenJeSchicht(120, "220").text, "0,55 Euro");
});

test("begrenzeSchichten hält die Eingabe im Bereich des Reglers und ganzzahlig", () => {
  assert.equal(begrenzeSchichten(5), SCHICHTEN.min);
  assert.equal(begrenzeSchichten(99999), SCHICHTEN.max);
  assert.equal(begrenzeSchichten(220.6), 221);
  assert.equal(begrenzeSchichten("abc"), SCHICHTEN.start);
  assert.ok(SCHICHTEN.min < SCHICHTEN.start && SCHICHTEN.start < SCHICHTEN.max);
  assert.equal(SCHICHTEN.start, 220);
});

test("englisch: Punkt als Dezimalzeichen, EUR vorn", () => {
  assert.equal(kostenJeSchicht(120, 220, "en").text, "EUR 0.55");
  assert.equal(kostenJeSchicht(120, 240, "en").text, "EUR 0.50");
  assert.equal(kostenJeSchicht(120, 8, "en").text, "EUR 15.00");
  assert.equal(kostenJeSchicht(120, 220).text, "0,55 Euro");
});
