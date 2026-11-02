// Seam: Werteabschnitt "Alles in einer Sohle". Das CSS entscheidet über Verstecken, das Skript hängt nur am IntersectionObserver.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const lies = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");

test("initWerte prüft keine Medienabfragen und keine Fensterhöhe, sondern nutzt den IntersectionObserver", () => {
  const js = lies("assets/js/mitarbeitende.js");
  const a = js.indexOf("function initWerte");
  const e = js.indexOf("/* ---------- Mailvorlage");
  const rumpf = js.slice(a, e);
  assert.doesNotMatch(rumpf, /matchMedia|innerHeight|VianuFortschritt/);
  assert.match(rumpf, /new IntersectionObserver/);
  assert.match(rumpf, /setAttribute\("data-bereit"/);
});

test("Die Regeln, die Linien und Texte verstecken, stehen nur in der Medienabfrage für breite Bildschirme ohne reduzierte Bewegung", () => {
  const css = lies("assets/css/components.css");
  const kopf = "@media (min-width: 56.01rem) and (prefers-reduced-motion: no-preference) {";
  const a = css.indexOf(kopf);
  assert.ok(a > 0, "Medienabfrage fehlt");
  const ende = css.indexOf("\n}\n", a);
  const ausserhalb = css.slice(0, a) + css.slice(ende);
  assert.doesNotMatch(ausserhalb, /\.werte\[data-bereit\] \.wert__text \{ opacity: 0/);
  assert.match(css.slice(a, ende), /\.werte\[data-bereit\] \.wert__text \{ opacity: 0; \}/);
  assert.match(css.slice(a, ende), /\.wert:hover/);
});
