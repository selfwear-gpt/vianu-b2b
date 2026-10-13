// Seam: Seitenpaare der deutschen und englischen Fassung. Jede Seite hat ein Gegenstück, das Gleiche sagt.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const lies = (rel) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const PAARE = ["index.html", "impressum.html", "datenschutz.html", "b2b/index.html", "b2b/roderich.html",
  "b2b/personal.html", "b2b/geschaeftsfuehrung.html", "b2b/arbeitsschutz.html", "b2b/einkauf.html", "b2b/betriebsrat.html"];
const ohneSkripte = (h) => h.replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
const sichtbar = (h) => ohneSkripte(h).replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
// Text aus Attributen, die Besucher lesen oder hören
const attribute = (h) => (ohneSkripte(h).match(/\s(?:alt|title|aria-label|content|data-titel|data-zeit|data-bahn)="[^"]*"/g) || []).join(" ");
const aufloesen = (von, href) => path.normalize(path.join(path.dirname(von), href.split("#")[0].split("?")[0] || "."));
const ziel = (von, href) => {
  const p = aufloesen(von, href);
  return fs.existsSync(path.join(ROOT, p)) && fs.statSync(path.join(ROOT, p)).isDirectory() ? path.join(p, "index.html") : p;
};

test("jede deutsche Seite hat genau ein englisches Gegenstück unter en/", () => {
  for (const f of PAARE) assert.ok(fs.existsSync(path.join(ROOT, "en", f)), "en/" + f);
  const alle = [];
  (function lauf(d) {
    for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
      if (e.isDirectory() && !/^(\.|node_modules|assets|docs|scripts|tests|content)/.test(e.name)) lauf(path.join(d, e.name));
      else if (e.name.endsWith(".html") && d.startsWith("en")) alle.push(path.relative("en", path.join(d, e.name)));
    }
  })(".");
  assert.deepEqual(alle.sort(), [...PAARE].sort());
});

test("lang-Attribute stimmen und die Sprachlinks führen auf das Gegenstück und zurück", () => {
  for (const f of PAARE) {
    const de = lies(f), en = lies("en/" + f);
    assert.match(de, /<html lang="de">/, f);
    assert.match(en, /<html lang="en">/, "en/" + f);
    const zuEn = de.match(/<a href="([^"]+)" lang="en" hreflang="en"[^>]*>EN<\/a>/);
    const zuDe = en.match(/<a href="([^"]+)" lang="de" hreflang="de"[^>]*>DE<\/a>/);
    assert.ok(zuEn && zuDe, f + ": Sprachlinks");
    assert.equal(ziel(f, zuEn[1]), path.normalize("en/" + f), f + " nach Englisch");
    assert.equal(ziel("en/" + f, zuDe[1]), path.normalize(f), "en/" + f + " nach Deutsch");
    assert.match(de, /<span aria-current="true" lang="de">DE<\/span>/, f);
    assert.match(en, /<span aria-current="true" lang="en">EN<\/span>/, "en/" + f);
  }
});

test("hreflang zeigt auf existierende Gegenstücke, auf beiden Seiten gleich", () => {
  for (const [rel, h] of PAARE.flatMap((f) => [[f, lies(f)], ["en/" + f, lies("en/" + f)]])) {
    const links = [...h.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g)];
    assert.deepEqual(links.map((l) => l[1]), ["de", "en", "x-default"], rel);
    const f = rel.replace(/^en\//, "");
    assert.equal(ziel(rel, links[0][2]), path.normalize(f), rel + " de");
    assert.equal(ziel(rel, links[1][2]), path.normalize("en/" + f), rel + " en");
    assert.equal(links[2][2], links[0][2], rel + " x-default");
  }
});

test("englische Seiten haben ein h1, eigenen Titel und Beschreibung, und noindex nur auf den Rechtsseiten", () => {
  const titel = new Set();
  for (const f of PAARE) {
    const h = lies("en/" + f);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, f);
    const t = (h.match(/<title>([^<]*)<\/title>/) || [])[1];
    assert.ok(t && !titel.has(t), f + " Titel");
    titel.add(t);
    assert.notEqual(t, (lies(f).match(/<title>([^<]*)<\/title>/) || [])[1], f + " Titel gleich dem deutschen");
    assert.match(h, /<meta name="description" content="[^"]{40,}">/, f);
    assert.equal(/noindex/.test(h), /noindex/.test(lies(f)), f + " noindex");
  }
});

test("im englischen Text steht kein Deutsch", () => {
  const woerter = /\b(und|der|die|das|nicht|mit|für|ist|wir|Sie|Ihr|Ihre|auf|zu|oder|bei|nach|wird|sind|eine|einen|Euro|Schicht|Platzhalter|Mitarbeitende\w*)\b|[äöüß]/;
  for (const f of PAARE) {
    const h = lies("en/" + f);
    for (const [name, text] of [["Text", sichtbar(h)], ["Attribute", attribute(h)]]) {
      const m = text.match(woerter);
      assert.ok(!m, "en/" + f + " " + name + ": " + (m && text.slice(Math.max(0, m.index - 40), m.index + 40)));
    }
  }
});

test("Zahlen, Fragen und Bauteile stimmen in beiden Fassungen überein", () => {
  const zahlen = (h) => (sichtbar(h).replace(/(\d),(\d)/g, "$1.$2").match(/\d+(?:\.\d+)?/g) || []).filter((z) => z !== "17" && z !== "5").sort().join(",");
  const zaehle = (h, re) => (h.match(re) || []).length;
  for (const f of PAARE) {
    const de = lies(f), en = lies("en/" + f);
    assert.equal(zahlen(en), zahlen(de), f + ": Zahlen");
    assert.equal(zaehle(en, /<details[\s>]/g), zaehle(de, /<details[\s>]/g), f + ": FAQ-Einträge");
    assert.equal(zaehle(en, /"@type":\s*"Question"/g), zaehle(de, /"@type":\s*"Question"/g), f + ": FAQPage-Fragen");
    assert.equal(zaehle(en, /data-platzhalter/g), zaehle(de, /data-platzhalter/g), f + ": Platzhalter");
  }
});

test("Menüwörter sind auf den englischen Seiten desselben Bereichs gleich", () => {
  const menue = (h) => (h.match(/<header[\s\S]*?<\/header>/) || [""])[0].replace(/<[^>]+>/g, "|").replace(/\|+/g, "|").replace(/\s+/g, " ");
  const bereiche = { b2b: PAARE.filter((f) => f.startsWith("b2b/") && f !== "b2b/index.html"), start: ["index.html"], recht: ["impressum.html", "datenschutz.html"] };
  for (const [name, dateien] of Object.entries(bereiche)) {
    const erste = menue(lies("en/" + dateien[0]));
    for (const f of dateien.slice(1)) assert.equal(menue(lies("en/" + f)), erste, name + ": " + f);
  }
});

test("Downloads der englischen Seiten tragen englische Namen und existieren", () => {
  for (const f of PAARE) {
    const h = lies("en/" + f);
    for (const m of h.matchAll(/href="((?:\.\.\/)+assets\/downloads\/[^"]+)"/g)) {
      assert.match(m[1], /role-|mail-to-employer/, "en/" + f);
      assert.ok(fs.existsSync(path.join(ROOT, aufloesen("en/" + f, m[1]))), "en/" + f + " " + m[1]);
    }
  }
});

test("das Textdownload gleicht der Mailvorlage auf der Seite, in beiden Sprachen", () => {
  const vorlage = (h) => (h.match(/data-mail-text>([\s\S]*?)<\/div>/) || [])[1].replace(/&amp;/g, "&").trim();
  assert.equal(lies("assets/downloads/mail-an-arbeitgeber.txt").trim(), vorlage(lies("index.html")));
  assert.equal(lies("assets/downloads/mail-to-employer.txt").trim(), vorlage(lies("en/index.html")));
});

test("das Logo führt auf jeder Seite zur Startseite der eigenen Sprache und nach oben", () => {
  for (const rel of PAARE.flatMap((f) => [f, "en/" + f])) {
    const h = lies(rel);
    const m = h.match(/<a class="menue__logo" href="([^"]+)" aria-label="([^"]+)"/);
    assert.ok(m, rel + ": Logo");
    const start = rel.startsWith("en/") ? "en/index.html" : "index.html";
    const selbst = rel === start;
    assert.equal(selbst ? m[1] : ziel(rel, m[1]), selbst ? "#" : path.normalize(start), rel + ": Ziel des Logos");
    assert.match(m[2], rel.startsWith("en/") ? /^VIANU, to the home page$/ : /^VIANU, zur Startseite$/, rel + ": aria-label");
  }
});

test("das B2B-Menü hat einen Punkt Ablauf zum Abschnitt Ablauf und keinen Punkt Programm", () => {
  for (const f of PAARE.filter((x) => x.startsWith("b2b/"))) {
    for (const [rel, wort] of [[f, "Ablauf"], ["en/" + f, "Process"]]) {
      const h = lies(rel);
      const menue = (h.match(/<ul class="menue__liste">[\s\S]*?<\/ul>/) || [""])[0];
      const eigen = f === "b2b/index.html";
      assert.ok(menue.includes(`<li><a href="${eigen ? "" : "./"}#ablauf">${wort}</a></li>`), rel + ": Punkt " + wort);
      assert.doesNotMatch(menue, /#programm|>Programm<|>Program</, rel + ": Punkt Programm");
    }
  }
});

test("die Zielgruppe heißt überall Teams, deren Personal viele Stunden auf den Beinen ist", () => {
  const erlaubt = /Keine dieser Studien untersucht Hotellerie oder Gastronomie|Diese Studie untersucht weder Hotellerie noch Gastronomie|examines hospitality or food service|examines neither hospitality nor food service/g;
  // Roderichs Lebenslauf nennt die Gastronomie als Ort seiner Arbeit, das ist keine Zielgruppe
  for (const rel of PAARE.flatMap((f) => [f, "en/" + f]).filter((r) => !/roderich/.test(r))) {
    const h = lies(rel).replace(erlaubt, "");
    assert.doesNotMatch(h, /Hotellerie|Gastronomie|hospitality|food service/, rel);
  }
});

test("die Sohle erreicht den Betrieb, das Wort übergeben kommt nicht mehr vor", () => {
  for (const f of PAARE) {
    assert.doesNotMatch(sichtbar(lies(f)) + lies(f).match(/application\/ld\+json[\s\S]*?<\/script>/g)?.join(""), /bergeb|bergib|bergab/i, f);
    assert.doesNotMatch(sichtbar(lies("en/" + f)), /hand(s|ed|ing)? over|handover|handed out/i, "en/" + f);
  }
});
