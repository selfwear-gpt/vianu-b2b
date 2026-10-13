// Seam: Aufbau der Mitarbeitenden-Seite (index.html). Reihenfolge, Wortlaut und entfernte Texte.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const body = html.slice(html.indexOf("<body"));

test("Reihenfolge: Das hast du davon, Stimmen, Ein Tag im Schichtbetrieb, Name, Ablauf, Fragen", () => {
  const ids = [...body.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
  const reihe = ["sohle", "stimmen", "tag", "name", "ablauf", "fragen"];
  const pos = reihe.map((id) => ids.indexOf(id));
  assert.ok(pos.every((p) => p >= 0), "Abschnitt fehlt: " + ids.join(","));
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, "falsche Reihenfolge: " + ids.join(","));
  assert.equal(pos[1], pos[0] + 1, "Stimmen stehen nicht direkt hinter Das hast du davon");
});

test("Überschrift des Schichttags und Wortlaut der Stoßzeit", () => {
  assert.match(body, /<h2 id="tag-titel">Ein Tag im Schichtbetrieb<\/h2>/);
  assert.match(body, /<p>Jetzt zählt jeder Schritt\. Für genau diese Minuten bauen wir die Sohle\.<\/p>/);
});

test("Der Hinweis in der Namens-Sektion ist entfernt", () => {
  assert.doesNotMatch(body, /name__hinweis/);
  assert.doesNotMatch(body, /Nur eine Vorschau/);
  assert.doesNotMatch(body, /wird nicht gespeichert/);
});

test("Die Uhr läuft von 8 Uhr bis 17 Uhr: zwei Momente tragen Stunde und Uhrzeit", () => {
  assert.match(body, /data-titel="Schichtbeginn" data-zeit="8 Uhr" data-stunde="8"/);
  assert.match(body, /data-titel="Feierabend" data-zeit="17 Uhr" data-stunde="17"/);
});

test("Sechs Kacheln, jede mit Vorder- und Rückseite im HTML", () => {
  assert.equal((body.match(/class="wert__vorn"/g) || []).length, 6);
  assert.equal((body.match(/class="wert__hinten"/g) || []).length, 6);
});
