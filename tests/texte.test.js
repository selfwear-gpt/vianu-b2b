// Seam: Meldungen, die Skripte in die Seite schreiben (assets/js/texte.js). Deutsch ist der Vorgabewert.
const test = require("node:test");
const assert = require("node:assert/strict");
const { text, SCHLUESSEL } = require("../assets/js/texte.js");

test("Deutsch ist der Vorgabewert und Platzhalter werden ersetzt", () => {
  assert.equal(text("kopiert.link"), "Link kopiert.");
  assert.equal(text("kopiert.rolle", { rolle: "Personal" }), "Link für Personal kopiert.");
  assert.equal(text("name.ansage", { name: "Mia" }), "Deine Sohle zeigt: Mia");
});

test("Englisch liefert dieselben Schlüssel mit englischem Text", () => {
  assert.equal(text("kopiert.link", null, "en"), "Link copied.");
  assert.equal(text("kopiert.rolle", { rolle: "HR" }, "en"), "Link for HR copied.");
  assert.equal(text("name.ansage", { name: "Mia" }, "en"), "Your insole shows: Mia");
});

test("beide Sprachen haben genau dieselben Schlüssel und Platzhalter", () => {
  const de = Object.keys(SCHLUESSEL.de).sort();
  const en = Object.keys(SCHLUESSEL.en).sort();
  assert.deepEqual(en, de);
  const stellen = (s) => (s.match(/\{\w+\}/g) || []).sort().join();
  for (const k of de) assert.equal(stellen(SCHLUESSEL.en[k]), stellen(SCHLUESSEL.de[k]), k);
});

test("englische Meldungen enthalten keine deutschen Wörter", () => {
  for (const [k, v] of Object.entries(SCHLUESSEL.en)) assert.doesNotMatch(v, /\b(und|der|die|das|nicht|bitte|Sie|Euro|Schicht\w*|Link für)\b/, k);
});

test("unbekannte Sprache fällt auf Deutsch, unbekannter Schlüssel wirft", () => {
  assert.equal(text("kopiert.link", null, "fr"), "Link kopiert.");
  assert.throws(() => text("gibt.es.nicht"));
});
