// Seam: Kostenrechner (assets/js/kosten.js). Preis je Paar geteilt durch die Schichten, die Besucher einstellen.
const test = require("node:test");
const assert = require("node:assert/strict");
const { kostenJeSchicht, begrenzeSchichten, SCHICHTEN } = require("../assets/js/kosten.js");

test("rechnet 120 Euro durch die Schichtzahl und schreibt deutsch mit Komma und zwei Stellen", () => {
  assert.equal(kostenJeSchicht(120, 210).text, "0,57 Euro");
  assert.equal(kostenJeSchicht(120, 240).text, "0,50 Euro");
  assert.equal(kostenJeSchicht(120, 8).text, "15,00 Euro");
  assert.equal(kostenJeSchicht(120, 1).text, "120,00 Euro");
});

test("rundet auf ganze Cent kaufmännisch", () => {
  assert.equal(kostenJeSchicht(120, 210).cent, 57);
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
  assert.equal(kostenJeSchicht(120, "210").text, "0,57 Euro");
});

test("begrenzeSchichten hält die Eingabe im Bereich des Reglers und ganzzahlig", () => {
  assert.equal(begrenzeSchichten(5), SCHICHTEN.min);
  assert.equal(begrenzeSchichten(99999), SCHICHTEN.max);
  assert.equal(begrenzeSchichten(220.6), 221);
  assert.equal(begrenzeSchichten("abc"), SCHICHTEN.start);
  assert.ok(SCHICHTEN.min < SCHICHTEN.start && SCHICHTEN.start < SCHICHTEN.max);
  assert.equal(SCHICHTEN.start, 210);
});

test("englisch: Punkt als Dezimalzeichen, EUR vorn", () => {
  assert.equal(kostenJeSchicht(120, 210, "en").text, "EUR 0.57");
  assert.equal(kostenJeSchicht(120, 240, "en").text, "EUR 0.50");
  assert.equal(kostenJeSchicht(120, 8, "en").text, "EUR 15.00");
  assert.equal(kostenJeSchicht(120, 210).text, "0,57 Euro");
});

const { fehltageFuerPreis, fehlzeitKosten, anteilPreis, euro } = require("../assets/js/kosten.js");

test("Break-even: Pilotpreis in Fehltagen, aufgerundet", () => {
  assert.equal(fehltageFuerPreis(1200, 200), 6);
  assert.equal(fehltageFuerPreis(1200, 250), 5);
  assert.equal(fehltageFuerPreis(1200, 1000), 2);
  assert.equal(fehltageFuerPreis(1200, 0), null);
  assert.equal(fehltageFuerPreis("x", 200), null);
});

test("Break-even: Fehlzeitkosten und Anteil des Pilotpreises", () => {
  assert.equal(fehlzeitKosten(10, 10, 200), 20000);
  assert.equal(fehlzeitKosten(10, 0, 200), 0);
  assert.equal(anteilPreis(1200, 20000), 6);
  assert.equal(anteilPreis(1200, 0), null);
  assert.equal(fehlzeitKosten(-1, 3, 3), null);
});

test("Euro-Schreibweise deutsch mit Punkt, englisch mit Komma", () => {
  assert.equal(euro(1200, "de"), "1.200 Euro");
  assert.equal(euro(20000), "20.000 Euro");
  assert.equal(euro(1200, "en"), "EUR 1,200");
  assert.equal(euro(50, "de"), "50 Euro");
});
