// Seam: Scroll-Fortschritt (assets/js/fortschritt.js). Gemeinsam für Druckkarte, Klein starten und Sorgenfuß.
const test = require("node:test");
const assert = require("node:assert/strict");
const { fortschrittImBild, aktiverSchritt, sichtbareAnzahl } = require("../assets/js/fortschritt.js");

test("fortschrittImBild: 0 beim Eintritt, 1 beim Verlassen, dazwischen linear", () => {
  assert.equal(fortschrittImBild(800, 400, 800), 0);
  assert.equal(fortschrittImBild(-400, 400, 800), 1);
  assert.equal(fortschrittImBild(200, 400, 800), 0.5);
});

test("fortschrittImBild: bleibt außerhalb des Bildes bei 0 und 1 und übersteht Nullhöhe", () => {
  assert.equal(fortschrittImBild(2000, 400, 800), 0);
  assert.equal(fortschrittImBild(-2000, 400, 800), 1);
  assert.equal(fortschrittImBild(0, 0, 0), 0);
});

test("aktiverSchritt: Index von 0 bis anzahl-1, an den Rändern begrenzt", () => {
  assert.equal(aktiverSchritt(0, 6), 0);
  assert.equal(aktiverSchritt(1, 6), 5);
  assert.equal(aktiverSchritt(0.5, 6), 3);
  assert.equal(aktiverSchritt(-1, 6), 0);
  assert.equal(aktiverSchritt(2, 6), 5);
  assert.equal(aktiverSchritt(0.99, 3), 2);
});

test("aktiverSchritt: ungültige Eingaben ergeben 0", () => {
  assert.equal(aktiverSchritt(NaN, 6), 0);
  assert.equal(aktiverSchritt(0.5, 0), 0);
});

test("sichtbareAnzahl: 0 bis anzahl, bei 1 sind alle sichtbar, ist umkehrbar", () => {
  assert.equal(sichtbareAnzahl(0, 100), 0);
  assert.equal(sichtbareAnzahl(1, 100), 100);
  assert.equal(sichtbareAnzahl(0.5, 100), 50);
  assert.equal(sichtbareAnzahl(0.504, 100), 50);
  assert.equal(sichtbareAnzahl(-1, 100), 0);
  assert.equal(sichtbareAnzahl(3, 100), 100);
  assert.ok(sichtbareAnzahl(0.3, 100) < sichtbareAnzahl(0.6, 100));
});
