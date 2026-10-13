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

test("Der Zeiger läuft über Feierabend hinaus: Der Moment Abend trägt eine eigene Stunde", () => {
  for (const f of ["index.html", "en/index.html"]) {
    const h = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    const stunden = [...h.matchAll(/<article class="tag__moment" data-moment[^>]*data-stunde="(\d+)"/g)].map((m) => Number(m[1]));
    assert.deepEqual(stunden, [8, 17, 20], f);
    assert.doesNotMatch(h, /Vom Schichtbeginn bis zum Abend|From the start of the shift to the evening/, f);
  }
});

test("Die Kachel Dein Name drauf führt von der Rückseite zum Namensabschnitt, der Abschnitt hat Namens- und Firmenfeld", () => {
  for (const f of ["index.html", "en/index.html"]) {
    const h = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    assert.match(h, /<a class="wert__hinten" href="#name">/, f);
    assert.match(h, /id="name-feld"[^>]*data-name-feld/, f);
    assert.match(h, /id="firma-feld"[^>]*maxlength="18"[^>]*data-firma-feld/, f);
    assert.equal((h.match(/data-firma-text/g) || []).length, 2, f);
  }
});

test("Der Ablauf hat einen Knopf im Handybild, der das Teilen-Feld öffnet, und keine sichtbare Zeile darunter", () => {
  for (const f of ["index.html", "en/index.html"]) {
    const h = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    assert.match(h, /<button class="knopf handy__cta" type="button" data-cta-schritt="1" data-teilen-oeffnen>(Arbeitgeber anfragen|Ask your employer)<\/button>/, f);
    assert.doesNotMatch(h, /ablauf__beschreibung/, f);
    assert.doesNotMatch(h, /Entwurf, der Ablauf|Draft, the process/, f);
  }
});
