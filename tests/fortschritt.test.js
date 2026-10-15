// Seam: Scroll-Fortschritt (assets/js/fortschritt.js). Gemeinsam für Druckkarte, Klein starten und Sorgenfuß.
const test = require("node:test");
const assert = require("node:assert/strict");
const { fortschrittImBild, aktiverSchritt, sichtbareAnzahl, zeigerWinkel, anteilZwischen, kreisInnen } = require("../assets/js/fortschritt.js");

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

// Uhr des Schichttags: Zeiger von 8 Uhr (unten links) bis 17 Uhr

test("zeigerWinkel: 8 Uhr liegt bei 240 Grad, 17 Uhr bei 510 Grad", () => {
  assert.equal(zeigerWinkel(0, 8, 17), 240);
  assert.equal(zeigerWinkel(1, 8, 17), 510);
});

test("zeigerWinkel: 30 Grad je Stunde, 12 Uhr nach vier Neunteln des Weges", () => {
  assert.equal(zeigerWinkel(4 / 9, 8, 17), 360);
  assert.equal(zeigerWinkel(1 / 9, 8, 17), 270);
  assert.equal(zeigerWinkel(0.5, 8, 17), 375);
});

test("zeigerWinkel: der Anteil wird auf 0 bis 1 begrenzt, ungültig ergibt den Start", () => {
  assert.equal(zeigerWinkel(-2, 8, 17), 240);
  assert.equal(zeigerWinkel(5, 8, 17), 510);
  assert.equal(zeigerWinkel(NaN, 8, 17), 240);
});

test("zeigerWinkel: Startstunden ab 12 zählen auf der Uhr von vorn", () => {
  assert.equal(zeigerWinkel(0, 12, 17), 0);
  assert.equal(zeigerWinkel(0, 14, 17), 60);
});

test("anteilZwischen: 0 vor dem Beginn, 1 nach dem Ende, dazwischen linear", () => {
  assert.equal(anteilZwischen(100, 200, 600), 0);
  assert.equal(anteilZwischen(700, 200, 600), 1);
  assert.equal(anteilZwischen(400, 200, 600), 0.5);
});

test("anteilZwischen: gleicher Anfang und Ende ergibt 0, Zahlen können fallen", () => {
  assert.equal(anteilZwischen(5, 5, 5), 0);
  assert.equal(anteilZwischen(300, 600, 200), 0.75);
});

test("kreisInnen: ein Punkt liegt nur dann im Umriss, wenn der ganze Kreis samt Abstand drin liegt", () => {
  const scheibe = (x, y) => x * x + y * y <= 100; // Umriss: Kreis mit Radius 10 um 0,0
  assert.equal(kreisInnen(scheibe, 0, 0, 2, 1), true);
  assert.equal(kreisInnen(scheibe, 5, 0, 2, 1), true, "5 + 3 = 8 liegt innen");
  assert.equal(kreisInnen(scheibe, 7, 0, 2, 1), true, "7 + 3 = 10 liegt gerade noch auf dem Rand");
  assert.equal(kreisInnen(scheibe, 7.5, 0, 2, 1), false, "7,5 + 3 reicht über den Rand");
  assert.equal(kreisInnen(scheibe, 9, 0, 0.5, 1), false, "kleiner Punkt am Rand, der Abstand reicht hinaus");
  assert.equal(kreisInnen(scheibe, 0, 12, 1, 1), false, "Mittelpunkt außerhalb");
});
