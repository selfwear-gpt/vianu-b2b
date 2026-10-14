// Rollenseiten: je Seite eigene Reihenfolge, keine reinen Textabschnitte, kein Wortlaut geht verloren.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const ROLLEN = ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"];
const SEITEN = ROLLEN.flatMap((r) => ["b2b/" + r + ".html", "en/b2b/" + r + ".html"]);
const lies = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const abschnitte = (h) => [...h.matchAll(/<section class="([^"]*)"(?: id="([^"]+)")?[^>]*>([\s\S]*?)<\/section>/g)].map((m) => ({ klassen: m[1], id: m[2] || (m[1].includes("hero") ? "hero" : ""), html: m[3] }));
const text = (h) => h.replace(/<(script|style)[\s\S]*?<\/\1>/g, " ").replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&euro;/g, "€").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
const folge = (f) => abschnitte(lies(f)).map((a) => a.id).filter((id) => id !== "stimme-frueh");

const BAUSTEIN = /data-reise|class="dreh|messwert--dreh|data-pruefliste|data-weg|data-rechner|data-klein|<details|data-fluss|data-filter|class="zitatkarte"|class="weg__raster"/;

test("jede Rollenseite hat ihre eigene Reihenfolge, Deutsch und Englisch gleich", () => {
  const de = ROLLEN.map((r) => folge("b2b/" + r + ".html").join(">"));
  assert.equal(new Set(de).size, ROLLEN.length, de.join("\n"));
  for (const r of ROLLEN) assert.equal(folge("en/b2b/" + r + ".html").join(">"), folge("b2b/" + r + ".html").join(">"), r);
});

test("Hero und Termin bleiben Einseiter, FAQ und Weiterleiten stehen am Ende", () => {
  for (const f of SEITEN) {
    const a = abschnitte(lies(f));
    const hero = a.find((x) => x.id === "hero");
    const termin = a.find((x) => x.id === "termin");
    assert.match(hero.klassen, /einseiter/, f);
    assert.match(termin.klassen, /einseiter/, f);
    assert.match(termin.html, /einseiter__fuss druck-nur/, f);
    const ids = a.map((x) => x.id);
    assert.deepEqual(ids.slice(-2), ["fragen-rolle", "weiterleiten"], f);
    assert.equal(ids[0], "hero", f);
  }
});

test("kein Abschnitt besteht nur aus Fließtext", () => {
  for (const f of SEITEN) {
    for (const a of abschnitte(lies(f))) {
      if (["hero", "fragen-rolle", "weiterleiten"].includes(a.id)) continue;
      assert.match(a.html, BAUSTEIN, f + " #" + a.id);
    }
  }
});

test("der Wortlaut der bisherigen Seiten bleibt erhalten (Termin, Brief, Belege, Rollenabschnitt)", () => {
  const fix = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures/rollen-wortlaut.json"), "utf8"));
  for (const f of SEITEN) {
    const t = text(lies(f));
    for (const s of fix[f]) assert.ok(t.includes(s), f + ": fehlt \"" + s + "\"");
  }
});

test("Messwerte der Rollenseiten: vier umdrehbare Kacheln, keine alten Platzhalter oder Abgrenzungssätze", () => {
  for (const f of SEITEN) {
    const m = abschnitte(lies(f)).find((x) => x.id === "messwerte").html;
    assert.equal((m.match(/<li class="messwert[^"]*messwert--dreh[^"]*" tabindex="0">/g) || []).length, 4, f);
    assert.doesNotMatch(m, /Noch keine Daten|No data yet|messwert__leer|messwerte__erfolg|messwerte__grenze|Komfort und Annahme|comfort and acceptance|selbst berichtet|self-reported/, f);
  }
  for (const f of SEITEN) assert.doesNotMatch(lies(f), /zeitstrahl|rollen__entwurf|Entwurf\)|\(draft\)/, f);
});

test("umdrehbare Karten sind mit der Tastatur erreichbar, Schalter tragen aria-pressed und sind Buttons", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    for (const m of h.matchAll(/<(li|article|div) class="([^"]*\bdreh\b[^"]*)"([^>]*)>/g)) assert.match(m[3], /tabindex="0"/, f + ": " + m[2]);
    for (const m of h.matchAll(/<(\w+)\s[^>]*aria-pressed="[^"]*"[^>]*>/g)) assert.equal(m[1], "button", f);
  }
});

test("Personal: Aufgaben als Stationenweg mit vier Stationen", () => {
  for (const f of ["b2b/personal.html", "en/b2b/personal.html"]) {
    const a = abschnitte(lies(f)).find((x) => x.id === "aufgaben").html;
    assert.equal((a.match(/data-station="\d"/g) || []).length, 4, f);
    assert.equal((a.match(/data-station-nr="\d"/g) || []).length, 4, f);
    assert.match(a, /data-weg-zurueck/, f);
  }
});

test("Termin als Reiter auf Personal und Geschäftsführung, alle fünf Felder im HTML", () => {
  for (const r of ["personal", "geschaeftsfuehrung"]) for (const f of ["b2b/" + r + ".html", "en/b2b/" + r + ".html"]) {
    const t = abschnitte(lies(f)).find((x) => x.id === "termin").html;
    assert.match(t, /class="reise reise--termin" data-reise/, f);
    assert.equal((t.match(/data-reiter="\d"/g) || []).length, 5, f);
    assert.equal((t.match(/data-feld-nr="\d"/g) || []).length, 5, f);
  }
});

test("Termin als Fragenkarten (Einkauf, Betriebsrat) und als Prüfliste (Arbeitsschutz)", () => {
  for (const r of ["einkauf", "betriebsrat"]) for (const f of ["b2b/" + r + ".html", "en/b2b/" + r + ".html"]) {
    const t = abschnitte(lies(f)).find((x) => x.id === "termin").html;
    assert.equal((t.match(/class="dreh fragenkarte"/g) || []).length, 5, f);
  }
  for (const f of ["b2b/arbeitsschutz.html", "en/b2b/arbeitsschutz.html"]) {
    const t = abschnitte(lies(f)).find((x) => x.id === "termin").html;
    assert.match(t, /data-pruefliste/, f);
    assert.equal((t.match(/<button class="pruefliste__zeile" type="button" aria-pressed="false">/g) || []).length, 5, f);
  }
});

test("Belege: Studienkarten, Akkordeon oder Platzhalterkarte, je nach Seite", () => {
  const erwartet = { personal: /class="dreh studienkarte"/, arbeitsschutz: /class="dreh studienkarte"/, geschaeftsfuehrung: /<details class="beleg"/, einkauf: /class="dreh studienkarte beleg--offen"/, betriebsrat: /class="dreh studienkarte studienkarte--breit beleg--offen"/ };
  for (const r of ROLLEN) for (const f of ["b2b/" + r + ".html", "en/b2b/" + r + ".html"]) {
    const b = abschnitte(lies(f)).find((x) => x.id === "belege").html;
    assert.match(b, erwartet[r], f);
    if (["personal", "arbeitsschutz", "geschaeftsfuehrung"].includes(r)) assert.match(b, /doi\.org/, f + ": Fundstellen bleiben");
  }
});

test("Brief als Zitatkarte mit Unterschrift und Link zu Roderichs Geschichte", () => {
  for (const f of SEITEN) {
    const b = abschnitte(lies(f)).find((x) => x.id === "brief").html;
    assert.match(b, /class="zitatkarte"/, f);
    assert.equal((b.match(/class="zitatkarte__absatz"/g) || []).length, 2, f);
    assert.match(b, /class="brief__unterschrift"/, f);
    assert.match(b, /#geschichte/, f);
  }
});

test("Geschäftsführung: Rechner und Klein starten; Einkauf: Rechnung, Lieferzeit und gefilterte Statusliste; Betriebsrat: klickbarer Datenfluss", () => {
  for (const f of ["b2b/geschaeftsfuehrung.html", "en/b2b/geschaeftsfuehrung.html"]) {
    const k = abschnitte(lies(f)).find((x) => x.id === "kosten").html;
    assert.match(k, /data-rechner/, f);
    assert.match(k, /data-klein/, f);
  }
  for (const f of ["b2b/einkauf.html", "en/b2b/einkauf.html"]) {
    const b = abschnitte(lies(f)).find((x) => x.id === "beschaffung").html;
    assert.match(b, /data-filter/, f);
    assert.equal((b.match(/<button class="filter__knopf" type="button" aria-pressed="(true|false)" data-filter-wert="[a-z]*">/g) || []).length, 3, f);
    assert.match(b, /class="lieferung"/, f);
    assert.match(b, /class="rechnung"/, f);
    assert.equal((b.match(/<li class="stand__zeile/g) || []).length, 8, f);
  }
  for (const f of ["b2b/betriebsrat.html", "en/b2b/betriebsrat.html"]) {
    const d = abschnitte(lies(f)).find((x) => x.id === "datenfluss").html;
    assert.match(d, /data-fluss/, f);
    assert.equal((d.match(/<button class="fluss__knoten[^"]*" type="button" aria-pressed="(true|false)"/g) || []).length, 5, f);
    assert.equal((d.match(/data-fluss-feld="\d"/g) || []).length, 5, f);
  }
  for (const f of ["b2b/arbeitsschutz.html", "en/b2b/arbeitsschutz.html"]) {
    assert.match(abschnitte(lies(f)).find((x) => x.id === "weg").html, /class="weg__raster" data-weg/, f);
  }
});

test("jede Rollenseite trägt die gemeinsame Sohlenzeichnung, die Fußspuren, Weg und Bündel verwenden", () => {
  for (const f of SEITEN) assert.match(lies(f), /<symbol id="sohle-form" viewBox="0 0 100 260">/, f);
});
