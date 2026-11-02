// Seam: Roddys Weg auf der B2C-Seite (#erlebt). Reihenfolge, Leitsatz, Entwurfsmarkierung, Skript.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const lies = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const SEITEN = { "index.html": "Gemacht von jemand, der das Problem selbst erlebt hat", "en/index.html": "Made by someone who lived the problem themselves" };

for (const [datei, leitsatz] of Object.entries(SEITEN)) {
  test(datei + ": Roddys Weg steht zwischen 'Alles in einer Sohle' und den Stimmen", () => {
    const h = lies(datei);
    const a = h.indexOf('id="sohle-titel"');
    const e = h.indexOf('id="erlebt"');
    const s = h.indexOf('id="stimmen"');
    assert.ok(a > 0 && e > a && s > e, "Reihenfolge sohle, erlebt, stimmen");
  });
  test(datei + ": Leitsatz ist ein Absatz und keine Überschrift", () => {
    const h = lies(datei);
    assert.match(h, new RegExp('<p class="leitsatz" id="erlebt-titel">' + leitsatz + "</p>"));
  });
  test(datei + ": fünf Szenen, eine stetige Füllung im Fuß, kein Entwurfsetikett, kein 'Jagd'", () => {
    const h = lies(datei);
    const bereich = h.slice(h.indexOf('id="erlebt"'), h.indexOf('id="stimmen"'));
    assert.equal((bereich.match(/data-roddy-szene="/g) || []).length, 5);
    assert.doesNotMatch(bereich, /roddy__entwurf|Entwurf|Draft/);
    assert.equal((bereich.match(/data-roddy-fuell/g) || []).length, 1);
    assert.doesNotMatch(bereich, /Jagd|hunt for/i);
  });
  test(datei + ": das Skript roddy.js ist eingebunden", () => {
    assert.match(lies(datei), /<script src="(\.\.\/)?assets\/js\/roddy\.js" defer><\/script>/);
  });
}

const SOHLE = { "index.html": ["Alles in einer Sohle", "Das ist das, was du von uns erwarten kannst."], "en/index.html": ["Everything in one insole", "This is what you can expect from us."] };
for (const [datei, [titel, unter]] of Object.entries(SOHLE)) {
  test(datei + ": Abschnitt Sohle mit Überschrift und Unterzeile, ohne Hinweis im Platzhalter", () => {
    const h = lies(datei);
    assert.match(h, new RegExp('<h2 id="sohle-titel">' + titel + "</h2>"));
    assert.ok(h.includes("<p>" + unter + "</p>"));
    assert.doesNotMatch(h, /id="alles-titel"/);
    const mitte = h.slice(h.indexOf("werte__mitte"), h.indexOf("werte__spalte--rechts"));
    assert.doesNotMatch(mitte, /<p>|platzhalter__etikett/);
  });
}
