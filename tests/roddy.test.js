// Seam: Roddys Weg auf der B2C-Seite (#erlebt). Reihenfolge, Leitsatz, Entwurfsmarkierung, Skript.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const lies = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const SEITEN = { "index.html": "Gemacht von jemand, der das Problem selbst erlebt hat", "en/index.html": "Made by someone who lived the problem themselves" };

for (const [datei, leitsatz] of Object.entries(SEITEN)) {
  test(datei + ": Roddys Weg steht zwischen 'Das alles in einer Sohle' und den Stimmen", () => {
    const h = lies(datei);
    const a = h.indexOf('id="alles-titel"');
    const e = h.indexOf('id="erlebt"');
    const s = h.indexOf('id="stimmen"');
    assert.ok(a > 0 && e > a && s > e, "Reihenfolge alles, erlebt, stimmen");
  });
  test(datei + ": Leitsatz ist ein Absatz und keine Überschrift", () => {
    const h = lies(datei);
    assert.match(h, new RegExp('<p class="leitsatz" id="erlebt-titel">' + leitsatz + "</p>"));
  });
  test(datei + ": fünf Szenen, jede mit Entwurfsetikett, vier Zonen im Fuß, kein 'Jagd'", () => {
    const h = lies(datei);
    const bereich = h.slice(h.indexOf('id="erlebt"'), h.indexOf('id="stimmen"'));
    assert.equal((bereich.match(/data-roddy-szene="/g) || []).length, 5);
    assert.equal((bereich.match(/class="etikett roddy__entwurf"/g) || []).length, 5);
    assert.equal((bereich.match(/data-roddy-zone="/g) || []).length, 4);
    assert.doesNotMatch(bereich, /Jagd|hunt for/i);
  });
  test(datei + ": das Skript roddy.js ist eingebunden", () => {
    assert.match(lies(datei), /<script src="(\.\.\/)?assets\/js\/roddy\.js" defer><\/script>/);
  });
}
