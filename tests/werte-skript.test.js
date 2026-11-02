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

test("Die ganze Sohle ist Trefferfläche: werte.js wertet pointermove der Mittelspalte aus, nur mit Maus, und setzt data-nah", () => {
  const js = lies("assets/js/werte.js");
  assert.match(js, /pointermove/);
  assert.match(js, /pointerType !== "mouse"/);
  assert.match(js, /data-nah/);
  assert.match(js, /sohle-koerper/);
  const css = lies("assets/css/components.css");
  assert.match(css, /\.wert\[data-nah="true"\] \.wert__text \{ grid-template-rows: 1fr; \}|\.wert\[data-nah="true"\] \.wert__text, /);
  assert.match(css, /\.wert\[data-nah="punkt"\]::before \{ transform: scale\(1\.3\); \}/);
  assert.match(css, /\.sohle-wand \{[^}]*pointer-events: none;/);
  for (const f of ["index.html", "en/index.html"]) assert.match(lies(f), /<g class="sohle-koerper" transform=/);
});

test("Es gibt keinen Scrolleffekt: werte.js hört weder auf scroll noch auf resize und kennt keine Bühne", () => {
  const js = lies("assets/js/werte.js");
  assert.doesNotMatch(js, /scroll|resize|aktiverSchritt|data-haelt|IntersectionObserver/);
  const css = lies("assets/css/components.css");
  assert.doesNotMatch(css, /\.werte\[data-haelt\]|\.wert\[data-aktiv/);
});

test("Nur eine Karte ist offen, und Karte, Linie und Punkt öffnen sie, das leere Fach nicht", () => {
  const css = lies("assets/css/components.css");
  assert.match(css, /\.werte:has\(\.wert:hover\) \.wert:not\(:hover\) \.wert__text \{ grid-template-rows: 0fr; \}/);
  assert.match(css, /\.wert \{[^}]*pointer-events: none;/);
  assert.match(css, /\.wert__karte \{[^}]*pointer-events: auto;/);
  assert.match(css, /\.wert::before, \.wert::after \{[^}]*pointer-events: auto;/);
});

test("Die Beschreibungen sind im CSS standardmäßig zugeklappt und öffnen bei Hover, Tastaturfokus und Fix", () => {
  const css = lies("assets/css/components.css");
  assert.match(css, /\.wert__text \{ display: grid; grid-template-rows: 0fr;/);
  const regel = css.split("\n").find((z) => z.includes("{ grid-template-rows: 1fr; }") && z.includes(".wert:hover .wert__text"));
  assert.ok(regel, "Regel zum Aufklappen fehlt");
  for (const z of [".wert:focus-visible .wert__text", '.wert[data-fix="true"] .wert__text']) assert.ok(regel.includes(z), z);
});

test("Linien und Punkte liegen über der Sohle: Karte hat einen höheren z-index als die Mitte, und alle sechs Karten haben eine eigene Höhe", () => {
  const css = lies("assets/css/components.css");
  const mitte = Number((css.match(/\.werte \.werte__mitte \{[^}]*z-index: (\d+)/) || [])[1]);
  const wert = Number((css.match(/\.wert \{[^}]*z-index: (\d+)/) || [])[1]);
  assert.ok(wert > mitte, "z-index der Karte muss über der Sohle liegen");
  const hoehen = [...css.matchAll(/\.werte__spalte--(links|rechts) \.wert:nth-child\((\d)\) \{ --y: ([\d.]+)rem; --px: ([\d.]+); \}/g)].map((m) => ({ seite: m[1], nr: m[2], y: Number(m[3]), px: Number(m[4]) }));
  assert.equal(hoehen.length, 6);
  const y = hoehen.map((h) => h.y);
  assert.equal(new Set(y).size, 6, "keine zwei Karten auf gleicher Höhe");
  for (const seite of ["links", "rechts"]) {
    const ys = hoehen.filter((h) => h.seite === seite).map((h) => h.y).sort((a, b) => a - b);
    for (let i = 1; i < ys.length; i++) assert.ok((ys[i] - ys[i - 1]) * 16 >= 110, "Abstand der Karten einer Seite zu klein");
  }
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

for (const [datei, pfad] of [["index.html", "assets/img/sohle-oberflaeche.webp"], ["en/index.html", "../assets/img/sohle-oberflaeche.webp"]]) {
  test(datei + ": Die Sohle trägt die echte Oberfläche als Bild und die Datei liegt vor", () => {
    const h = lies(datei);
    assert.ok(h.includes('<image href="' + pfad + '"'));
    assert.ok(fs.existsSync(path.join(__dirname, "..", "assets/img/sohle-oberflaeche.webp")));
  });
}
