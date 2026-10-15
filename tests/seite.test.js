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

test("Ablauf-Handy auf B2C: Schritt 3 mit Name und XY GmbH quer in der Ferse, Schritt 4 mit Paket und Frist", () => {
  for (const [f, frist] of [["index.html", "Spätestens 7 Tage"], ["en/index.html", "Within 7 days"]]) {
    const h = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    const s3 = h.match(/<g data-screen="3"[\s\S]*?<\/g>/)[0];
    const s4 = h.match(/<g data-screen="4"[\s\S]*?<\/g>/)[0];
    assert.match(s3, /<text class="handy__gravur"[^>]*rotate\(-90[^>]*>Anna<\/text>/, f);
    assert.match(s3, /<text class="handy__gravur handy__gravur--firma" x="\d+" y="\d+">XY GmbH<\/text>/, f + ": Firma waagerecht");
    assert.doesNotMatch(s3, /Muster GmbH/, f + ": im Ablauf steht XY GmbH, Muster GmbH bleibt nur in der Namenssohle");
    assert.equal((s4.match(/<use /g) || []).length, 2, f + ": zwei Sohlen im Paket");
    assert.match(s4, new RegExp('<text class="handy__frist"[^>]*>' + frist + "</text>"), f);
    assert.doesNotMatch(s4, /handy__haken"/, f + ": kein großer Haken auf der Karte");
    assert.doesNotMatch(h, /data-cta-schritt="4"/, f + ": kein Knopf in Schritt 4");
  }
});

test("Kurzsatz: nur die Wörter individuell angefertigt stehen fett", () => {
  const erwartet = {
    "index.html": ["individuell angefertigt"],
    "en/index.html": ["custom-made"]
  };
  for (const f of Object.keys(erwartet)) {
    const h = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    const punkt = h.match(/<li class="kurz__punkt">\s*<p>([\s\S]*?)<\/p>/)[1];
    const fett = [...punkt.matchAll(/<strong class="kurz__wort">([^<]+)<\/strong>/g)].map((m) => m[1]);
    assert.deepEqual(fett, erwartet[f], f);
  }
});

test("Namenssohle: keine Einleitung, Firmenfeld ohne optional, Firmenname links auf der Sohle", () => {
  for (const f of ["index.html", "en/index.html"]) {
    const h = fs.readFileSync(path.join(__dirname, "..", f), "utf8");
    const abschnitt = h.match(/<section class="abschnitt name"[\s\S]*?<\/section>/)[0];
    assert.doesNotMatch(abschnitt, /Tipp deinen Namen|Type in your name/, f);
    assert.doesNotMatch(abschnitt, /<\/h2>\s*<p>/, f + ": kein Absatz unter der Überschrift");
    assert.doesNotMatch(abschnitt, /optional/i, f);
    assert.match(abschnitt, /<label class="etikett" for="firma-feld">(Dein Unternehmen|Your company)<\/label>/, f);
    assert.match(abschnitt, /<g transform="rotate\(90 46 67\.5\)">\s*<text class="sohle__firma sohle__firma--licht" x="46\.6" y="68\.5"/, f);
    assert.match(abschnitt, /<text class="sohle__firma" x="46" y="67\.5"/, f);
    assert.doesNotMatch(abschnitt, /rotate\(90 244 62\)/, f);
  }
});
