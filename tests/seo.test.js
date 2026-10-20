// Seam: Suchmaschinen-Daten (scripts/seo.py). Jede Seite trägt canonical, Open Graph, Twitter-Karte und hreflang, robots.txt und sitemap.xml stehen.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const SEITEN = ["index.html", "b2b/index.html", "b2b/personal.html", "b2b/geschaeftsfuehrung.html", "b2b/arbeitsschutz.html", "b2b/einkauf.html", "b2b/betriebsrat.html", "impressum.html", "datenschutz.html"];
const lies = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

test("jede Seite hat canonical, Open Graph, Twitter-Karte und hreflang, Beschreibung und og:description gleich", () => {
  for (const f of SEITEN.flatMap((s) => [s, "en/" + s])) {
    const h = lies(f);
    assert.match(h, /<link rel="canonical" href="https:\/\/[^"]+">/, f + ": canonical");
    for (const k of ["og:title", "og:description", "og:url", "og:locale", "og:type"]) assert.match(h, new RegExp('<meta property="' + k + '"'), f + ": " + k);
    assert.match(h, /<meta name="twitter:card"/, f);
    assert.match(h, /hreflang="x-default"/, f);
    const d = h.match(/<meta name="description" content="([^"]*)">/)[1];
    assert.equal(h.match(/<meta property="og:description" content="([^"]*)">/)[1], d, f + ": Beschreibung gleich");
    assert.ok(d.length >= 60 && d.length <= 190, f + ": Länge " + d.length);
  }
});

test("robots.txt verweist auf die Sitemap, die Sitemap führt alle Inhaltsseiten in beiden Sprachen und nicht die Rechtsseiten", () => {
  assert.match(lies("robots.txt"), /Sitemap: https:\/\/[^\s]+sitemap\.xml/);
  const x = lies("sitemap.xml");
  assert.equal((x.match(/<url>/g) || []).length, 14);
  assert.doesNotMatch(x, /impressum|datenschutz/);
  assert.match(x, /hreflang="en"/);
});

test("Organisationsdaten stehen auf den Startseiten, Produktdaten auf der B2B-Startseite", () => {
  for (const f of ["index.html", "en/index.html", "b2b/index.html", "en/b2b/index.html"]) assert.match(lies(f), /"@type":\s*"Organization"/, f);
  for (const f of ["b2b/index.html", "en/b2b/index.html"]) assert.match(lies(f), /"@type":\s*"Product"/, f);
});

test("jede Seite hat einen Sprunglink zum Inhalt und ein Favicon, dessen Farben den Tokens gleichen", () => {
  for (const f of SEITEN.flatMap((s) => [s, "en/" + s])) {
    const h = lies(f);
    assert.match(h, /<a class="sprung" href="#inhalt">(Zum Inhalt|Skip to content)<\/a>/, f);
    assert.match(h, /<main id="inhalt" tabindex="-1">/, f);
    assert.match(h, /<link rel="icon" href="[^"]*assets\/img\/favicon\.svg" type="image\/svg\+xml">/, f);
  }
  const tokens = lies("assets/css/tokens.css");
  const farbe = (name) => tokens.match(new RegExp("--" + name + ":\\s*(#[0-9A-Fa-f]{6})"))[1].toUpperCase();
  const icon = lies("assets/img/favicon.svg").toUpperCase();
  assert.ok(icon.includes(farbe("farbe-tinte")) && icon.includes(farbe("farbe-signal")), "Favicon-Farben weichen von den Tokens ab");
});

test("Fachstimme als Platzhalter neben der Kundenstimme auf B2C, B2B-Start, Arbeitsschutz, Einkauf, Geschäftsführung und Betriebsrat", () => {
  for (const f of ["index.html", "b2b/index.html", "b2b/arbeitsschutz.html", "b2b/einkauf.html", "b2b/geschaeftsfuehrung.html", "b2b/betriebsrat.html"]) {
    for (const seite of [f, "en/" + f]) {
      const h = lies(seite);
      assert.match(h, /<div class="stimmenpaar">\s*<figure class="stimme" data-platzhalter[\s\S]*?<figure class="stimme stimme--fach" data-platzhalter/, seite);
    }
  }
  for (const f of ["b2b/arbeitsschutz.html", "en/b2b/arbeitsschutz.html"]) assert.doesNotMatch(lies(f), /Aussage eines Orthopäden|statement of an orthop/i, f + ": alter Orthopäden-Platzhalter entfernt");
});
