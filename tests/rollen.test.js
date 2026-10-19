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

const BAUSTEIN = /class="stimme"|class="punkte"|class="bestellstrecke"|class="garantie__schritte"|class="zahlenkacheln"|data-tagesordnung|data-reise|class="dreh|messwert--dreh|data-pruefliste|data-stationenweg|data-weg|data-rechner|data-klein|<details|data-fluss|data-filter|data-chat|data-umfrage|data-ergebnis|class="rubriken|class="dokumente"|class="weg__raster"/;

test("jede Rollenseite hat ihre eigene Reihenfolge, Deutsch und Englisch gleich", () => {
  const de = ROLLEN.map((r) => folge("b2b/" + r + ".html").join(">"));
  assert.equal(new Set(de).size, ROLLEN.length, de.join("\n"));
  for (const r of ROLLEN) assert.equal(folge("en/b2b/" + r + ".html").join(">"), folge("b2b/" + r + ".html").join(">"), r);
});

test("der Chat steht auf jeder Rollenseite an dritter Stelle, nie direkt unter dem Kopf", () => {
  for (const f of SEITEN) assert.equal(folge(f).indexOf("brief"), 2, f);
  for (const f of ["b2b/personal.html", "en/b2b/personal.html"]) {
    const ids = folge(f);
    assert.deepEqual(ids.slice(-3), ["messwerte", "fragen-rolle", "weiterleiten"], f + ": Messwerte kommen direkt vor der FAQ");
    assert.equal(ids[1], "aufgaben", f);
  }
});

test("jede Rollenseite hat genau eine Kundenstimme direkt nach dem Chat, bis echte Aussagen vorliegen als markierter Platzhalter", () => {
  for (const f of SEITEN) {
    const ids = folge(f);
    assert.equal(ids[3], "stimme", f + ": Stimme an vierter Stelle");
    const st = abschnitte(lies(f)).find((x) => x.id === "stimme").html;
    assert.equal((st.match(/<figure class="stimme" data-platzhalter/g) || []).length, 1, f);
    assert.match(st, /platzhalter__etikett">(Platzhalter|Placeholder)</, f + ": als Platzhalter markiert");
  }
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

test("Messwerte als Umfrage im Smartphone nur auf Personal, Geschäftsführung und Arbeitsschutz", () => {
  const fragen = { personal: 4, geschaeftsfuehrung: 2, arbeitsschutz: 2 };
  for (const r of ROLLEN) for (const f of ["b2b/" + r + ".html", "en/b2b/" + r + ".html"]) {
    const m = abschnitte(lies(f)).find((x) => x.id === "messwerte");
    if (!fragen[r]) { assert.equal(m, undefined, f + ": keine Messwerte"); continue; }
    assert.match(m.html, /data-umfrage/, f);
    assert.equal((m.html.match(/<div class="umfrage__frage">/g) || []).length, fragen[r], f + ": Fragen im Telefon");
    if (r === "personal") {
      // Personal: nur das Telefon mit vier Fragen, kein Erklärteil, Pilot-Knopf erst ab drei Antworten
      assert.doesNotMatch(m.html, /umfrage__erklaerung|umfrage__liste/, f + ": kein Erklärteil");
      assert.match(m.html, /<a class="knopf umfrage__pilot"[^>]*data-pilot-oeffnen data-umfrage-pilot hidden>/, f + ": Pilot-Knopf, zuerst versteckt");
    } else {
      assert.equal((m.html.match(/<li( data-wichtig)?><strong>/g) || []).length, 4, f + ": vier Messwerte in der Liste");
      assert.equal((m.html.match(/<li data-wichtig>/g) || []).length, 2, f + ": wichtige Messwerte");
    }
    assert.doesNotMatch(m.html, /Noch keine Daten|No data yet|messwert__leer|Entwurf|ungeprüft|unverified/, f);
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

test("Personal: So funktioniert´s als Stationenweg mit fünf Stationen, je ein Bild, Kontaktknopf am Ende", () => {
  for (const f of ["b2b/personal.html", "en/b2b/personal.html"]) {
    const a = abschnitte(lies(f)).find((x) => x.id === "aufgaben").html;
    assert.equal((a.match(/data-station="\d"/g) || []).length, 5, f);
    assert.equal((a.match(/data-station-nr="\d"/g) || []).length, 5, f);
    assert.equal((a.match(/<svg class="weg__abb"/g) || []).length, 5, f + ": ein Bild je Schritt");
    assert.doesNotMatch(a, /\d \/ \d|weg__zeit|Vom Start bis zum Bericht|From start to report/, f + ": keine Zähler, kein Untertitel");
    assert.match(a, /data-weg-zurueck/, f);
    assert.match(a, /data-weg-pilot data-pilot-oeffnen>(Kontakt anfragen|Request contact)/, f);
    assert.match(a, /<h2 id="aufgaben-titel">(So funktioniert´s|How it works)<\/h2>/, f);
  }
});

test("Termin als Rubriken auf Personal und Geschäftsführung mit eigenem Titel", () => {
  for (const r of ["personal", "geschaeftsfuehrung"]) for (const f of ["b2b/" + r + ".html", "en/b2b/" + r + ".html"]) {
    const t = abschnitte(lies(f)).find((x) => x.id === "termin").html;
    assert.match(t, /<dl class="rubriken[ "]/, f);
    assert.equal((t.match(/<div class="rubrik">/g) || []).length, r === "personal" ? 5 : 4, f);
    assert.doesNotMatch(t, /data-reise|data-feld-nr/, f + ": keine Reiter mehr");
  }
});
test("Termin als Fragenkarten (Einkauf, Betriebsrat) und als Prüfliste (Arbeitsschutz)", () => {
  for (const r of ["einkauf", "betriebsrat"]) for (const f of ["b2b/" + r + ".html", "en/b2b/" + r + ".html"]) {
    const t = abschnitte(lies(f)).find((x) => x.id === "termin").html;
    if (r === "einkauf") {
      assert.equal((t.match(/<li class="zahlenkachel">/g) || []).length, 6, f + ": sechs Zahlenkacheln");
      assert.match(t, /<a class="knopf" href="\.\/#pilot" data-pilot-oeffnen>(Weitere Fragen klären|Clarify further questions)/, f + ": Knopf zum Kontaktformular");
    } else {
      assert.equal((t.match(/<li class="top">/g) || []).length, 5, f + ": fünf aufklappbare Zeilen");
      assert.doesNotMatch(t, /class="dreh/, f + ": keine Drehkarten");
    }
  }
  for (const f of ["b2b/arbeitsschutz.html", "en/b2b/arbeitsschutz.html"]) {
    const t = abschnitte(lies(f)).find((x) => x.id === "termin").html;
    assert.match(t, /data-pruefliste/, f);
    assert.equal((t.match(/<button class="pruefliste__zeile" type="button" aria-pressed="false">/g) || []).length, 5, f);
  }
});

test("Belege als drehbare Studienkarten mit PDF-Download: Personal zwei, Arbeitsschutz zwei, sonst keine", () => {
  const erwartet = { personal: 2, arbeitsschutz: 2 };
  for (const r of ROLLEN) for (const f of ["b2b/" + r + ".html", "en/b2b/" + r + ".html"]) {
    const b = abschnitte(lies(f)).find((x) => x.id === "belege");
    if (!erwartet[r]) { assert.equal(b, undefined, f + ": keine Belege"); continue; }
    assert.equal((b.html.match(/<article class="dreh studienkarte" data-ergebnis tabindex="0" role="group"/g) || []).length, erwartet[r], f);
    assert.equal((b.html.match(/<svg class="ergebnis__bild"[^>]*role="img" aria-label="[^"]+"/g) || []).length, erwartet[r], f + ": Alternativtext");
    assert.equal((b.html.match(/class="studie__aussage"/g) || []).length, erwartet[r], f + ": Rückseite trägt die Aussage");
    assert.equal((b.html.match(/class="studie__autoren">[A-Z][a-z]+ et al\. \d{4}</g) || []).length, erwartet[r], f + ": darunter Autoren mit Jahr");
    assert.doesNotMatch(b.html, /ergebnis__fuss|Skala ohne Zahlen|scale without numbers/, f + ": sonst nichts auf der Rückseite");
    assert.equal((b.html.match(/data-studie-datei="(\.\.\/)+assets\/downloads\/studien\/[a-z-]+-\d{4}\.pdf" data-studie-name="[^"]+\.pdf"/g) || []).length, erwartet[r], f + ": Download-Knopf mit Dateiname");
    assert.doesNotMatch(b.html, /belege__hinweis|<p>[^<]*Studien?:/, f + ": kein Hinweis und keine Unterüberschrift");
    assert.doesNotMatch(b.html, /Entwurf|ungeprüft|unverified|class="dreh studienkarte"[^>]*beleg--offen/, f);
    for (const m of b.html.matchAll(/data-studie-datei="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(ROOT, path.dirname(f), m[1])), f + ": PDF fehlt " + m[1]);
    const h = lies(f);
    assert.match(h, /<dialog class="dialog" aria-labelledby="studie-titel" data-studie-dialog>/, f + ": Popup für die E-Mail");
    assert.match(h, /studien\.js/, f + ": Skript eingebunden");
  }
});
test("Brief als Chat: Rolle links, Roderich rechts, Foto-Platzhalter, Link-Nachricht am Ende, Antwortfeld", () => {
  for (const f of SEITEN) {
    const b = abschnitte(lies(f)).find((x) => x.id === "brief").html;
    assert.match(b, /<div class="chat" data-chat>/, f);
    assert.doesNotMatch(b, /zitatkarte/, f);
    const rolle = (b.match(/chat__nachricht chat__nachricht--rolle" data-chat-nachricht/g) || []).length;
    const roderich = (b.match(/chat__nachricht chat__nachricht--roderich" data-chat-nachricht/g) || []).length;
    assert.ok(rolle >= 2 && roderich >= 3 && rolle + roderich >= 6 && rolle + roderich <= 14, f + ": " + rolle + " und " + roderich + " Nachrichten");
    // Handy-Rahmen: Name im Kopf, Hörer und Menü, Eingabe mit Begrenzung, Sprach- und Sendeknopf
    assert.match(b, /<h2 id="brief-titel" class="chat__titel">(Der Vianu Gründer Roderich Körner-Rehn|The VIANU founder Roderich Körner-Rehn)<\/h2>/, f + ": Name im Kopf");
    assert.match(b, /<a class="chat__icon" href="tel:\+4915678548855" data-telefon-oeffnen/, f + ": Hörer zeigt nur den Telefonweg");
    assert.match(b, /data-chat-menue-knopf[\s\S]*data-chat-neu>(Chat von vorne starten|Restart chat)</, f + ": Menü mit Neustart");
    assert.match(b, /<input type="text" maxlength="\d+"[^>]*placeholder="(Tippen Sie hier Ihre Nachricht ein|Type your message here)"[^>]*data-chat-eingabe>/, f + ": Eingabefeld");
    assert.match(b, /data-chat-senden>/, f + ": Knopf Sprache oder Senden");
    assert.doesNotMatch(b, /5 Werktagen|5 working days|brief__unterschrift/, f + ": kein Hinweis auf die Antwortfrist, kein rosa Name");
    assert.ok(b.indexOf("chat__nachricht--rolle") < b.indexOf("chat__nachricht--roderich"), f + ": die Rolle schreibt zuerst");
    assert.equal((b.match(/<img class="chat__avatar chat__avatar--roderich" src="(\.\.\/)+assets\/img\/roderich\.jpg" alt="Roderich Körner-Rehn"/g) || []).length, roderich + 1, f + ": Foto von Roderich an jeder Antwort und im Kopf");
    assert.doesNotMatch(b, /chat__avatar--roderich" data-platzhalter/, f + ": kein Foto-Platzhalter mehr");
    assert.doesNotMatch(b, /data-chat-weiter|chat__leiste|<a class="knopf"/, f + ": keine Dauerknöpfe im Chat");
    assert.match(b, /data-chat-hinweis>(Scrollen für die nächste Nachricht|Scroll for the next message)</, f + ": Hinweis zum Scrollen");
    const letzte = b.slice(b.lastIndexOf('data-chat-nachricht>'));
    assert.match(letzte, /chat__blase chat__blase--link">(Hier erreichen Sie mich direkt:|You can reach me directly here:) <a class="chat__link" href="\.\/#pilot" data-pilot-oeffnen>(Kontakt aufnehmen|Get in touch)<\/a><\/p>/, f + ": letzte Nachricht ist ein Textlink zum Kontaktformular");
    assert.match(b, /chat__wieder/, f + ": Kreispfeil für den Neustart am Ende");
    assert.match(b, /#geschichte/, f);
    for (const m of b.matchAll(/<p class="chat__blase">(.*?)(?:<span class="sr-nur">|<\/p>)/g)) assert.ok(m[1].split(/\s+/).length <= 18, f + ": zu lang: " + m[1]);
  }
});

test("Kopf mit Motiv (Alternativtext, Animation) und ohne Preiskacheln", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    if (f.includes("geschaeftsfuehrung")) { assert.match(h, /<div class="rolle__motiv breakeven" data-breakeven>/, f + ": Break-even-Rechner statt Motiv"); continue; }
    assert.match(h, /<figure class="rolle__motiv">\s*<svg class="motiv"[^>]*role="img" aria-label="[^"]{20,}"/, f + ": Motiv");
    assert.match(h, /class="[^"]*\bm-(zeichnen|pop|auf|blatt)\b/, f + ": Motiv ist animiert");
    assert.doesNotMatch(h, /preisstreifen/, f + ": keine Preiskacheln unter dem Kopf");
  }
  const css = fs.readFileSync(path.join(ROOT, "assets/css/components.css"), "utf8");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.m-zeichnen, \.m-auf, \.m-pop, \.m-blatt \{ animation: none/, "Bewegung ruht bei reduzierter Bewegung");
});

test("jede Seite hat einen eigenen, konkreten Titel im Termin-Abschnitt und keine gleichen Rubriken", () => {
  const titel = [];
  for (const f of SEITEN.filter((x) => x.startsWith("b2b/"))) {
    const t = abschnitte(lies(f)).find((x) => x.id === "termin").html;
    titel.push(t.match(/<h2 id="termin-titel">([^<]*)<\/h2>/)[1]);
    assert.doesNotMatch(t, /Was Sie im Termin vertreten können müssen|So sieht die Seite es|Kernbotschaft/, f);
  }
  assert.equal(new Set(titel).size, 5, titel.join(" | "));
  for (const f of SEITEN.filter((x) => x.startsWith("en/"))) {
    assert.doesNotMatch(abschnitte(lies(f)).find((x) => x.id === "termin").html, /What you need to be able to stand behind|How this page sees it/, f);
  }
});
test("Geschäftsführung: Rechner und Klein starten; Einkauf: Rechnung, Lieferzeit und ausgearbeitete Punkte mit Sprungleiste; Betriebsrat: klickbarer Datenfluss", () => {
  for (const f of ["b2b/geschaeftsfuehrung.html", "en/b2b/geschaeftsfuehrung.html"]) {
    const k = abschnitte(lies(f)).find((x) => x.id === "kosten").html;
    assert.match(k, /data-rechner/, f);
    assert.match(k, /data-klein/, f);
  }
  for (const f of ["b2b/einkauf.html", "en/b2b/einkauf.html"]) {
    const b = abschnitte(lies(f)).find((x) => x.id === "beschaffung").html;
    assert.doesNotMatch(b, /data-filter|stand__zeile|data-platzhalter|Offen<|>Open</, f + ": keine Statusliste und keine offenen Platzhalter");
    assert.match(b, /class="lieferung" id="e-lieferung"/, f);
    assert.match(b, /class="rechnung" id="e-preis"/, f);
    assert.doesNotMatch(b, /sprung__link|lieferung__satz/, f + ": keine Sprungleiste, kein Satz unter der Lieferzeit");
    assert.match(b, /<ol class="bestellstrecke" data-bestellstrecke/, f + ": Bestellstrecke");
    assert.equal((b.match(/<li class="bestellstrecke__station">/g) || []).length, 5, f + ": fünf Stationen");
    assert.equal((b.match(/<span class="bestellstrecke__marke"><svg/g) || []).length, 5, f + ": Symbol je Station");
    assert.match(b, /(48 Stunden|48 hours)/, f + ": Fertigung in 48 Stunden");
    assert.match(lies(f), /(spätestens 7 Tage|at the latest 7 days)/i, f + ": die 7 Tage bleiben");
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
