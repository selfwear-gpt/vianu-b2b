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

test("die Sprache eines Elements ist das nächste lang-Attribut darüber", () => {
  const { text: t, sprache } = require("../assets/js/texte.js");
  const mit = (lang) => ({ closest: () => (lang ? { getAttribute: () => lang } : null) });
  assert.equal(sprache(mit("en")), "en");
  assert.equal(sprache(mit(null)), "de");
  assert.equal(sprache(undefined), "de");
  assert.equal(t("kopiert.link", null, mit("en")), "Link copied.");
});

test("die Ansage der Sohle nennt auch die Firma, wenn eine da ist", () => {
  assert.equal(text("name.ansage.firma", { name: "Mia", firma: "Hotel Adler" }), "Deine Sohle zeigt: Mia, Hotel Adler");
  assert.equal(text("name.ansage.firma", { name: "Mia", firma: "Hotel Adler" }, "en"), "Your insole shows: Mia, Hotel Adler");
  assert.equal(text("name.ansage.nurfirma", { firma: "Hotel Adler" }), "Deine Sohle zeigt: Hotel Adler");
});

test("Deutsch und Englisch haben dieselben Schlüssel, bis auf die Anredevarianten der Mitarbeitenden-Seite", () => {
  const src = require("node:fs").readFileSync(require("node:path").join(__dirname, "..", "assets/js/texte.js"), "utf8");
  const schluessel = (block) => [...block.matchAll(/^\s*"([a-z0-9.-]+)":/gm)].map((m) => m[1]);
  const de = src.slice(src.indexOf("de: {"), src.indexOf("en: {"));
  const en = src.slice(src.indexOf("en: {"));
  const a = schluessel(de), b = schluessel(en);
  assert.deepEqual(a.filter((k) => !b.includes(k)), [], "Englisch fehlt");
  assert.deepEqual(b.filter((k) => !a.includes(k)), [], "Deutsch fehlt");
});
