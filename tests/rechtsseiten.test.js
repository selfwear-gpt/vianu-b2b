// Seam: Impressum, Datenschutz und Roderichs Geschichte. Jede Aussage der Seiten muss zur Seite selbst passen.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const lies = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const sichtbar = (h) => h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const ALLE = ["index.html", "impressum.html", "datenschutz.html", "b2b/index.html",
  "b2b/personal.html", "b2b/geschaeftsfuehrung.html", "b2b/arbeitsschutz.html", "b2b/einkauf.html", "b2b/betriebsrat.html"];

test("Impressum und Datenschutz haben ein h1, eigenen Titel und bleiben bis zu echten Angaben noindex", () => {
  const titel = [];
  for (const f of ["impressum.html", "datenschutz.html"]) {
    const h = lies(f);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, f);
    assert.match(h, /<meta name="robots" content="noindex">/, f);
    titel.push((h.match(/<title>([^<]*)<\/title>/) || [])[1]);
  }
  assert.notEqual(titel[0], titel[1]);
});

test("Das Impressum trägt jede Pflichtangabe als markierten Platzhalter", () => {
  const h = lies("impressum.html");
  for (const feld of ["Firma und Rechtsform", "Anschrift", "Vertretung", "E-Mail", "Registergericht und Registernummer", "Umsatzsteuer-Identifikationsnummer", "Verantwortlich für die Inhalte"]) {
    const m = new RegExp('data-platzhalter[^>]*>[\\s\\S]{0,400}?' + feld).test(h) || new RegExp(feld + '[\\s\\S]{0,400}?data-platzhalter').test(h);
    assert.ok(m, "Platzhalter für " + feld + " fehlt");
  }
});

test("Der Datenschutz nennt jede Firmenangabe als Platzhalter und erfindet keine Rechtsbelehrung", () => {
  const h = lies("datenschutz.html");
  for (const feld of ["Verantwortlicher", "Hosting", "Speicherdauer", "Rechte der betroffenen Personen", "Datenschutzbeauftragte"]) {
    assert.match(h, new RegExp(feld), feld + " fehlt");
  }
  assert.ok((h.match(/data-platzhalter/g) || []).length >= 5, "zu wenige Platzhalter");
  assert.doesNotMatch(sichtbar(h), /Art\. ?\d+ ?(DSGVO|Abs)|Rechtsgrundlage ist/i, "Gesetzestext ohne Rechtsprüfung");
});

test("Was der Datenschutz über die Seite sagt, stimmt mit dem Code überein", () => {
  const text = sichtbar(lies("datenschutz.html"));
  const js = fs.readdirSync(path.join(ROOT, "assets", "js")).map((f) => lies("assets/js/" + f)).join("\n");
  // Gespeichert wird nur im sessionStorage und nur in sitzung.js, die Seite sagt es in "Was diese Seite tut und nicht tut"
  const ohneSitzung = fs.readdirSync(path.join(ROOT, "assets", "js")).filter((f) => f !== "sitzung.js").map((f) => lies("assets/js/" + f)).join("\n");
  if (/keine Cookies/.test(text)) {
    assert.doesNotMatch(js, /document\.cookie|localStorage|indexedDB/, "Skript speichert etwas");
    assert.doesNotMatch(ohneSitzung, /sessionStorage/, "nur sitzung.js darf den Sitzungsspeicher nutzen");
    assert.match(text, /Speicher Ihres Browsers, nur für diesen Tab/, "Sitzungsspeicher fehlt in der Datenschutzseite");
  }
  if (/Namen[^.]*Browser/.test(text) || /keine Verbindung zu Fremdservern/.test(text)) assert.doesNotMatch(js, /fetch\(|XMLHttpRequest|sendBeacon|WebSocket/, "Skript baut eine Verbindung auf");
  if (/Schriften[^.]*eigenen Server/.test(text)) {
    for (const f of ALLE) assert.doesNotMatch(lies(f).replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "").replace(/<!-- seo -->[\s\S]*?<!-- \/seo -->/g, ""), /(src|href)="https?:\/\/(?!doi\.org)/, f + " lädt etwas von außen");
    assert.doesNotMatch(lies("assets/css/fonts.css"), /url\(["']?https?:/);
  }
  assert.match(text, /keine Cookies/);
  assert.match(text, /Pilotformular[^.]*(sendet|verschickt)[^.]*nicht/);
});

test("jede Seite verlinkt Impressum und Datenschutz im Fuß mit dem richtigen relativen Pfad", () => {
  for (const f of ALLE) {
    const h = lies(f);
    const fuss = h.slice(h.indexOf("<footer"));
    const vorn = f.startsWith("b2b/") ? "../" : "";
    assert.match(fuss, new RegExp('href="' + vorn + 'impressum\\.html"'), f + ": Impressum");
    assert.match(fuss, new RegExp('href="' + vorn + 'datenschutz\\.html"'), f + ": Datenschutz");
    assert.doesNotMatch(fuss, /folgen/, f + ": Fuß sagt noch folgen");
  }
});

test("Roderichs Geschichte steht auf der B2B-Startseite und nennt die Eckdaten des Konzepts, auch englisch", () => {
  for (const [datei, woerter, satz] of [
    ["b2b/index.html", ["Systemgastronomie", "Yum!", "WOYTON", "2012", "2020", "20+", "Pizza Hut", "Café-Kette"], /Ich habe es selbst erlebt: 10 bis 12 Stunden am Tag auf hartem Boden/],
    ["en/b2b/index.html", ["system gastronomy", "Yum!", "WOYTON", "2012", "2020", "20+", "Pizza Hut", "café chain"], /I felt it myself: 10 to 12 hours a day on hard floors/]
  ]) {
    const h = lies(datei);
    const t = sichtbar(h);
    assert.match(h, /<section class="geschichte" id="geschichte"/, datei);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, datei);
    for (const wort of woerter) assert.match(t, new RegExp(wort.replace("!", "\\!"), "i"), datei + " " + wort);
    assert.match(t, satz, datei);
    assert.doesNotMatch(t, /Einlegesohlen?[^.]{0,80}(wirkt|hilft|lindert)|insoles? (works|helps|relieves)\b/i, datei);
    assert.doesNotMatch(t, /heilt|schmerzfrei|verhindert|Krankheitstage (sinken|gehen)|heals|pain-free|prevents/i, datei);
    assert.match(h, /<a class="knopf" href="#pilot" data-pilot-oeffnen>/, datei + ": Knopf öffnet das Popup");
  }
});

test("die Unterseite zur Geschichte gibt es nicht mehr, alle Verweise führen zum Abschnitt auf der Startseite", () => {
  for (const f of ["b2b/roderich.html", "en/b2b/roderich.html"]) assert.equal(fs.existsSync(path.join(ROOT, f)), false, f);
  for (const r of ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"]) {
    for (const pre of ["b2b/", "en/b2b/"]) {
      const h = lies(pre + r + ".html");
      assert.doesNotMatch(h, /roderich\.html/, pre + r);
      assert.match(h, /href="\.\/#geschichte"/, pre + r);
    }
  }
});
