// Seam: Werteabschnitt "Alles in einer Sohle" (assets/js/werte.js). Das Zuklappen der Beschreibungen entscheidet allein das CSS,
// das Skript fügt nur die Scrollbühne und den aktiven Punkt hinzu und hängt an keinem anderen Skript.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const lies = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");

test("werte.js ist ein eigenes Modul, in beiden Startseiten eingebunden, und mitarbeitende.js enthält initWerte nicht mehr", () => {
  assert.match(lies("index.html"), /<script src="assets\/js\/werte\.js" defer><\/script>/);
  assert.match(lies("en/index.html"), /<script src="\.\.\/assets\/js\/werte\.js" defer><\/script>/);
  assert.doesNotMatch(lies("assets/js/mitarbeitende.js"), /initWerte|data-wert/);
});

test("werte.js nutzt Scrollstand, aktiverSchritt und die Bühne, keinen IntersectionObserver", () => {
  const js = lies("assets/js/werte.js");
  assert.match(js, /aktiverSchritt/);
  assert.match(js, /data-haelt/);
  assert.match(js, /data-aktiv/);
  assert.doesNotMatch(js, /IntersectionObserver/);
});

test("Die Beschreibungen sind im CSS standardmäßig zugeklappt und öffnen bei Hover, Fokus, Aktiv und Fix", () => {
  const css = lies("assets/css/components.css");
  assert.match(css, /\.wert__text \{ display: grid; grid-template-rows: 0fr;/);
  const regel = css.split("\n").find((z) => z.includes("{ grid-template-rows: 1fr; }") && z.includes(".wert:hover .wert__text"));
  assert.ok(regel, "Regel zum Aufklappen fehlt");
  for (const z of [".wert:focus-within .wert__text", '.wert[data-aktiv="true"] .wert__text', '.wert[data-fix="true"] .wert__text']) assert.ok(regel.includes(z), z);
  assert.doesNotMatch(css, /\.werte\[data-bereit\]/);
});

for (const datei of ["index.html", "en/index.html"]) {
  test(datei + ": sechs fokussierbare Karten, je drei links und rechts, Wrapper mit data-werte", () => {
    const h = lies(datei);
    assert.match(h, /<div class="werte" data-werte>/);
    assert.equal((h.match(/<article class="wert" data-wert tabindex="0">/g) || []).length, 6);
    assert.equal((h.match(/werte__spalte--links/g) || []).length, 1);
    assert.equal((h.match(/werte__spalte--rechts/g) || []).length, 1);
    assert.match(h, /<svg class="werte__bild"/);
  });
}
