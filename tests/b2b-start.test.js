// Seam: Aufbau der B2B-Startseite und das Pilot-Popup, deutsch und englisch.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const lies = (rel) => fs.readFileSync(path.join(__dirname, "..", rel), "utf8");
const SEITEN = ["b2b/index.html", "en/b2b/index.html"];
const ROLLEN = ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"];
const ALLE_B2B = [...SEITEN, ...ROLLEN.flatMap((r) => ["b2b/" + r + ".html", "en/b2b/" + r + ".html"])];

test("die große Überschrift ist der neue englische Slogan, Unterüberschrift und Preiszeile im Kopf entfallen", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    assert.match(h, /<h1 id="hero-titel" lang="en">Keep walkin’ strong, the whole day long<\/h1>/, f);
    assert.match(h, /<p class="hero__slogan" lang="en">Nothing fancy\. Just a great way to get through your day\.<\/p>/, f);
    assert.doesNotMatch(h, /hero__antwort|hero__preis/, f);
  }
});

test("jeder Knopf Kontakt aufnehmen öffnet das Popup, es gibt genau ein Popup je Seite mit allen Pflichtfeldern", () => {
  for (const f of ALLE_B2B) {
    const h = lies(f);
    const links = [...h.matchAll(/<a [^>]*href="(?:\.\/)?#pilot"[^>]*>/g)].map((m) => m[0]);
    assert.ok(links.length >= 2, f + ": Pilot-Verweise");
    for (const l of links) assert.match(l, /data-pilot-oeffnen/, f + ": " + l);
    assert.equal((h.match(/<dialog /g) || []).length, 1, f);
    for (const feld of ["unternehmen", "rolle", "mitarbeitende", "kontakt", "quelle", "freitext", "anliegen", "einwilligung"]) {
      assert.match(h, new RegExp('data-feld="' + feld + '"'), f + " " + feld);
    }
    for (const feld of ["unternehmen", "rolle", "mitarbeitende", "kontakt", "quelle", "freitext", "anliegen"]) {
      assert.match(h, new RegExp('name="' + feld + '"[^>]* required|required[^>]*name="' + feld + '"'), f + " Pflicht " + feld);
    }
    const dialog = h.match(/<dialog[\s\S]*?<\/dialog>/)[0];
    const de = !f.startsWith("en/");
    assert.match(dialog, de ? /<h2 id="pilot-titel">Kontaktanfrage stellen<\/h2>/ : /<h2 id="pilot-titel">Send a contact request<\/h2>/, f + ": Titel");
    assert.match(dialog, de ? /Wir melden uns innerhalb von 5 Werktagen zurück, versprochen! Roderich ist Ihr Ansprechpartner\./ : /We will get back to you within 5 working days, promise! Roderich is your contact\./, f + ": Einleitung");
    assert.match(dialog, de ? /placeholder="Ich möchte mehr Infos erhalten für einen ersten möglichen Pilottest für 10 Mitarbeitende\."/ : /placeholder="I would like more information about a possible first pilot test for 10 employees\."/, f + ": Platzhalter im Anliegen");
    assert.doesNotMatch(h, /Pilot buchen|Book a pilot|Datenschutzhinweis zum Formular|privacy notice for the form/, f + ": nichts mit Pilot buchen, kein Platzhalter");
    assert.match(h, /pilot\.js/, f + ": Skript");
    assert.match(h, /formular\.js/, f + ": Skript");
  }
});

test("die Auswahl 'aufmerksam geworden' hat in beiden Sprachen dieselben acht Kennungen in derselben Reihenfolge, Anderer Weg zuletzt", () => {
  const ids = (h) => [...h.match(/<select id="f-quelle"[\s\S]*?<\/select>/)[0].matchAll(/<option value="([^"]*)"/g)].map((m) => m[1]);
  const soll = ["", "ki", "suchmaschine", "soziale-netzwerke", "empfehlung-unternehmen", "empfehlung-mitarbeitende", "kontakt-durch-vianu", "presse-veranstaltung", "anderer"];
  for (const f of ALLE_B2B) assert.deepEqual(ids(lies(f)), soll, f);
});

test("die Startseite zeigt keine Kurzliste mehr und keine Geschichte-Unterseite, dafür Geschichte, zwei Stimmen und die neue Reihenfolge", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    assert.doesNotMatch(h, /class="kurz"/, f);
    const reihe = ["geschichte", "messwerte", "preis", "wer-entscheidet-mit", "programm", "zweites-paar", "faq", "pilot"];
    const pos = reihe.map((id) => h.indexOf('<section class="' ) >= 0 ? h.search(new RegExp('<section[^>]*id="' + id + '"')) : -1);
    assert.ok(pos.every((p) => p > 0), f + " " + pos);
    assert.deepEqual([...pos].sort((a, b) => a - b), pos, f + ": Reihenfolge");
    assert.equal((h.match(/<figure class="stimme" data-platzhalter/g) || []).length, 2, f + ": Stimmen");
    const geschichte = h.match(/<section class="geschichte" id="geschichte"[\s\S]*?<\/section>/)[0];
    const kapitel = [...geschichte.matchAll(/<div class="geschichte__kapitel([^"]*)"([^>]*)>/g)].map((m) => (m[2].match(/id="([^"]+)"|data-(boden)/) || [])[1] || (m[2].match(/data-(boden)/) || [])[1] || m[1].trim() || "start");
    assert.deepEqual(kapitel, ["geschichte__kapitel--weg", "ablauf", "stimme-frueh", "boden"], f + ": Kapitel Weg, Ablauf, Stimme, Boden, kein Kapitel Ihr Start");
    assert.doesNotMatch(h, /Fangen Sie klein an|Start small|Ihr Start|Your start|Starten Sie mit einem Piloten: 10 Mitarbeitende|Start with a pilot: 10 employees/, f + ": Kapitel Ihr Start entfällt");
    assert.doesNotMatch(h, /geschichte__kapitel--signal|<p class="etikett kapitel__marke">(Die Sohle|The insole)<\/p>/, f + ": Kapitel Die Sohle entfällt");
    assert.doesNotMatch(h, /<section class="abschnitt ablauf"/, f + ": Ablauf ist kein eigener Abschnitt mehr");
  }
});

test("Was Sie bekommen ist ein Reiter-Baustein mit drei Feldern, Symbolen im Bericht und einem Knopf", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    assert.equal((h.match(/data-reiter="\d"/g) || []).length, 3, f);
    assert.equal((h.match(/data-feld-nr="\d"/g) || []).length, 3, f);
    assert.doesNotMatch(h, /role="tab(list|panel)?"/, f + ": Rollen setzt erst das Skript");
    assert.doesNotMatch(h, /chips--gross/, f + ": die vier Kacheln unter den Inhalten entfallen");
    assert.doesNotMatch(h, /Kein Messtag|No measurement day/, f);
    assert.equal((h.match(/<ul class="messwerte messwerte--klein">(<li class="messwert messwert--klein"><svg class="ico messwert__bild"[\s\S]*?<strong>[^<]+<\/strong><\/li>){4}<\/ul>/g) || []).length, 1, f + ": Symbole im Ergebnisbericht");
    assert.match(h, /<div class="reise__cta"><a class="knopf" href="#pilot" data-pilot-oeffnen>(Kontakt aufnehmen|Get in touch)/, f + ": Knopf unter den Inhalten");
  }
});

test("der Rechner nennt den Zeitraum der Schichten: in einem Jahr", () => {
  for (const [f, label] of [["b2b/index.html", /Wie viele Schichten hat ein Mitarbeiter im Jahr\?/], ["en/b2b/index.html", /How many shifts does an employee work per year\?/]]) {
    const h = lies(f);
    assert.match(h, label, f);
    assert.match(h, /data-rechner-text>[^<]*(pro Person und Jahr|per person and year)/, f);
    assert.match(h, /(je Schicht pro Person|per shift per person)<\/p>/, f);
  }
});

test("Messwert-Symbole sind die neuen mehrfarbigen und stehen auch auf den Rollenseiten", () => {
  for (const f of [...SEITEN, ...ROLLEN.map((r) => "b2b/" + r + ".html")]) {
    const h = lies(f);
    assert.equal((h.match(/class="ico messwert__bild"/g) || []).length, f.endsWith("b2b/index.html") ? 8 : 4, f);
    assert.doesNotMatch(h, /<svg class="messwert__bild"/, f);
  }
});

test("die Fußform der Sorgen ist ein Umriss mit Zehen über den Kacheln", () => {
  for (const f of SEITEN) assert.match(lies(f), /<svg class="sorgen__umriss"[^>]*><polygon points="[^"]{200,}"/, f);
});

test("der Ablauf ist der Handy-Ablauf mit vier Schritten, Bahn-Etikett je Schritt und Knopf im Bild, ohne Bahnen-Raster", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    const ab = h.match(/<div class="geschichte__kapitel ablauf" id="ablauf"[\s\S]*?<p class="geschichte__fazit">[^<]+<\/p>/)[0];
    assert.match(ab, /(Wir verkaufen individuell angefertigte Einlegesohlen für Teams|We sell custom-made insoles for teams)/, f + ": sagt, was verkauft wird");
    assert.doesNotMatch(ab, /10 Mitarbeitenden|10 employees/, f + ": nicht auf den Piloten verengt");
    assert.equal((ab.match(/<button class="ablauf__schritt"/g) || []).length, 4, f);
    assert.equal((ab.match(/class="etikett ablauf__bahn"/g) || []).length, 4, f);
    assert.match(ab, /<svg class="handy"/, f);
    assert.match(ab, /<button class="knopf handy__cta" type="button" data-cta-schritt="1" data-pilot-oeffnen>/, f);
    assert.equal((ab.match(/data-screen="\d"/g) || []).length, 4, f);
    assert.doesNotMatch(h, /bahnen/, f);
    assert.match(h, /<symbol id="sohle-form"/, f);
  }
});

test("der Preis: kleines Preisschild mit Klartext, 3-Jahres-Aussage klein darunter ohne Siegel, rechts der Pilot mit Knopf", () => {
  for (const [f, zahl, bund, halt, kopf] of [["b2b/index.html", /120 &euro;/, /Ein Pilot mit bspw\. 10 Mitarbeitenden kostet: 10 Paare = 1\.200 Euro zzgl\. Umsatzsteuer\./, /mindestens 3 Jahre einwandfrei/, /Eine individuell angefertigte Einlegesohle/], ["en/b2b/index.html", /&euro;120/, /A pilot with, for example, 10 employees costs: 10 pairs = EUR 1,200 plus VAT\./, /at least 3 years/, /One custom-made insole/]]) {
    const h = lies(f);
    assert.match(h, /<p class="preisschild" aria-label="[^"]*120[^"]*">/, f);
    assert.match(h, zahl, f);
    assert.match(h, kopf, f + ": sagt, wofür der Preis gilt");
    assert.equal((h.match(/class="buendel__sohle"/g) || []).length, 10, f);
    assert.match(h, bund, f);
    assert.doesNotMatch(h, /class="siegel/, f + ": kein eigener Streifen");
    const links = h.match(/<div class="preis__links">[\s\S]*?<div class="preis__pilot">/)[0];
    assert.match(links, halt, f + ": 3-Jahres-Aussage unter dem Preis");
    const rechts = h.match(/<div class="preis__pilot">[\s\S]*?<\/div>\s*<\/div>/)[0];
    assert.match(rechts, /(Der Pilot|The pilot)<\/p>/, f);
    assert.match(rechts, /<a class="knopf" href="#pilot" data-pilot-oeffnen>/, f + ": Knopf zum Pilot buchen");
  }
});

test("Zweites Paar zeigt zwei Sohlen und bleibt als Platzhalter markiert", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    const z = h.match(/<section class="abschnitt" id="zweites-paar"[\s\S]*?<\/section>/)[0];
    assert.match(z, /class="zweites__bild"/, f);
    assert.equal((z.match(/class="zweites__sohle/g) || []).length, 2, f);
    assert.match(z, /data-platzhalter/, f);
  }
});

test("die FAQ hat zwei Gruppenköpfe und jede Frage ist ein details mit summary", () => {
  for (const f of ALLE_B2B) {
    const h = lies(f);
    assert.ok((h.match(/<h3 class="etikett fragen__titel"/g) || []).length >= 1, f);
    const n = (h.match(/<details class="frage">/g) || []).length;
    assert.equal((h.match(/<details class="frage">\s*<summary>/g) || []).length, n, f);
    assert.ok(n >= 8, f + ": " + n);
  }
});

test("Roderichs Weg: fünf Stationen von 20 Jahre Gastro bis Darum VIANU, Jahre unter den Schuhen, je ein Bildplatzhalter, Pilot-Knopf in der Steuerung der letzten Station", () => {
  for (const [f, folgt] of [["b2b/index.html", /Mehr als 20 Jahre Gastronomie[\s\S]*Eigene Café-Kette aufgebaut und skaliert[\s\S]*Bei Yum! die Gastro lieben gelernt[\s\S]*Der Weg war schon früh gezeichnet[\s\S]*Darum VIANU/], ["en/b2b/index.html", /More than 20 years in food service[\s\S]*Built and scaled my own café chain[\s\S]*Learned to love food service at Yum![\s\S]*The path was marked out early[\s\S]*That is why VIANU/]]) {
    const h = lies(f);
    assert.equal((h.match(/data-station="\d"/g) || []).length, 5, f);
    assert.equal((h.match(/data-station-nr="\d"/g) || []).length, 5, f);
    assert.equal((h.match(/class="platzhalter weg__foto"/g) || []).length, 5, f + ": ein Bildplatzhalter je Station");
    assert.match(h, folgt, f + ": Reihenfolge");
    const leiste = h.match(/<div class="weg__leiste"[\s\S]*?<\/div>\s*<div class="weg__buehne"/)[0];
    assert.deepEqual([...leiste.matchAll(/<span class="weg__jahr">(\d{4})<\/span>/g)].map((m) => m[1]), ["2020", "2012", "2010"], f + ": Jahre unter den Schuhen, 20 Jahre und VIANU ohne Jahr");
    for (const jahr of ["2020", "2012", "2010", "2026"]) assert.match(h, new RegExp('<p class="etikett weg__zeit">' + jahr + "</p>"), f + ": Jahr im Feld " + jahr);
    assert.doesNotMatch(h, /Eigene Angabe von Roderich|own statement/, f + ": Hinweis unter WOYTON entfällt");
    assert.doesNotMatch(h, /weg__hinweis/, f);
    assert.doesNotMatch(h, /Danach habe ich bei Yum|After that I worked/, f + ": kein Danach bei Yum!");
    assert.match(h, /Pizza Hut/, f);
    assert.match(h, /Handyscan|phone scan/, f);
    assert.match(h, /data-weg-zurueck/, f);
    assert.match(h, /data-weg-weiter/, f);
    const steuerung = h.match(/<div class="weg__steuerung">[\s\S]*?<\/div>\s*<\/div>/)[0];
    assert.match(steuerung, /data-weg-weiter[\s\S]*data-weg-pilot[^>]*data-pilot-oeffnen|data-weg-pilot[^>]*data-pilot-oeffnen[\s\S]*data-weg-weiter/, f + ": Pilot-Knopf neben Weiter in der Steuerung");
    assert.doesNotMatch(h.match(/<div class="weg__buehne"[\s\S]*?<div class="weg__steuerung">/)[0], /data-pilot-oeffnen/, f + ": nicht mehr im Feld");
    assert.match(h, /Mein Weg|My path/, f);
    assert.match(h, /Danach taten die Füße weh|Afterwards my feet hurt/, f);
  }
});

test("Kopf der Geschichte: Zitat in Anführungszeichen, Name direkt darunter, dann der Folgesatz ausgeschrieben", () => {
  for (const [f, zitat, folge] of [["b2b/index.html", /<h2 class="geschichte__satz" id="geschichte-titel">„Ich möchte, dass nach der Schicht für jeden noch Kraft und Vorfreude auf Familie, Sport und Freunde da sind\.“<\/h2>/, /Darauf arbeite ich hin\. Lassen Sie mich erklären…/], ["en/b2b/index.html", /<h2 class="geschichte__satz" id="geschichte-titel">“I want everyone to have energy and something to look forward to after the shift, for family, sport and friends\.”<\/h2>/, /That is what I work towards\. Let me explain…/]]) {
    const h = lies(f);
    assert.match(h, zitat, f);
    assert.match(h, /geschichte-titel">[^<]+<\/h2>\s*<div class="geschichte__sprecher">[\s\S]*?<p class="etikett band__name">Roderich, (Gründer von VIANU|founder of VIANU)<\/p>[\s\S]*?geschichte__satz2/, f + ": Name unter dem Zitat");
    assert.match(h, folge, f);
  }
});

test("Der Weg-CSS kappt die Bühne nicht: keine Höhenbegrenzung auf dem Weg-Block", () => {
  const css = lies("assets/css/components.css");
  assert.doesNotMatch(css, /(^|\n)\.weg \{[^}]*max-height/, "max-height nur für das SVG im Arbeitsschutz");
  assert.doesNotMatch(css, /\.weg__buehne \{[^}]*min-height/);
});

test("Ihre Schicht: Regler von 0 bis 12 Stunden mit Vorgabe 1, die alten Hinweise sind weg, Kacheln und Anfrage sind zunächst verborgen", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    assert.match(h, /<div class="geschichte__kapitel" data-boden>/, f);
    assert.match(h, /<input class="rechner__eingabe" id="boden-stunden" type="range" min="0" max="12" step="1" value="1" data-boden-regler>/, f);
    assert.match(h, /<output class="rechner__zahl" for="boden-stunden" data-boden-zahl>1<\/output>/, f);
    assert.match(h, /<figure class="schicht__bild" data-druckkarte data-druck-regler>/, f);
    assert.doesNotMatch(h, /Die Karte füllt sich mit|The map fills along|Größere Punkte|Larger dots|Dafür gibt es die Sohle|This is what the insole is for|So lange wie bei Roderich|As long as Roderich did|boden__vergleich|boden__gleich/, f);
    assert.match(h, /<p class="boden__roderich" data-boden-roderich hidden>(Roderich stand selbst 10 bis 12 Stunden am Tag auf hartem Boden\.|Roderich himself stood on hard floors for 10 to 12 hours a day\.)<\/p>/, f);
    assert.match(h, /<div class="boden__kacheln" data-boden-kacheln hidden>[\s\S]*?(Wählen Sie die Art der Tätigkeit aus|Choose the type of work)/, f);
    assert.match(h, /<div class="boden__anfrage" data-boden-anfrage hidden>[\s\S]*?(Genau für Ihre Mitarbeitenden gibt es unsere Sohle|Our insole is made for exactly your employees)/, f);
    assert.match(h, /schematisch|Schematische|[Ss]chematic/, f + ": Karte bleibt als Zeichnung gekennzeichnet");
  }
});

test("Tätigkeitskacheln: mindestens zehn Buttons mit eindeutiger Kennung, Einfachauswahl, Auffangkachel zuletzt, in beiden Sprachen gleich viele", () => {
  const kennungen = [];
  for (const f of SEITEN) {
    const h = lies(f);
    const block = h.match(/<div class="boden__kacheln"[\s\S]*?<\/ul>/)[0];
    const ids = [...block.matchAll(/<button class="kachel" type="button" aria-pressed="false" data-taetigkeit="([a-z-]+)">/g)].map((m) => m[1]);
    assert.ok(ids.length >= 10 && ids.length <= 14, f + ": " + ids.length);
    assert.equal(new Set(ids).size, ids.length, f + ": eindeutig");
    assert.equal(ids[ids.length - 1], "andere-taetigkeit", f + ": Auffangkachel zuletzt");
    assert.match(block, /role="group"/, f);
    kennungen.push(ids.join(","));
  }
  assert.equal(new Set(kennungen).size, 1, "DE und EN haben dieselben Kennungen in derselben Reihenfolge");
});

test("Anfrage-Strecke: fünf Schritte mit Pflichtfeldern, nur der erste ist sichtbar, Weiter-Knöpfe gesperrt, Einwilligung und Absenden erst am Ende", () => {
  for (const f of SEITEN) {
    const h = lies(f);
    const form = h.match(/<form class="strecke"[\s\S]*?<\/form>/)[0];
    assert.match(form, /novalidate data-strecke aria-label="[^"]+">/, f);
    assert.doesNotMatch(form, /data-formular(\s|>)/, f + ": nicht das Popup-Formular");
    const schritte = [...form.matchAll(/<div class="strecke__schritt" data-frage="(\d)"( hidden)?>/g)];
    assert.deepEqual(schritte.map((m) => m[1]), ["1", "2", "3", "4", "5"], f);
    assert.deepEqual(schritte.map((m) => !!m[2]), [false, true, true, true, true], f + ": ab Schritt 2 verborgen");
    assert.equal((form.match(/data-weiter disabled/g) || []).length, 4, f + ": Weiter in Schritt 1 bis 4, gesperrt");
    assert.match(form, /name="mitarbeitende" type="text" inputmode="numeric"[^>]* required/, f);
    assert.match(form, /name="rolle" required/, f);
    assert.match(form, /name="unternehmen" type="text"[^>]* required/, f);
    assert.match(form, /name="kontakt" type="email"[^>]* required/, f);
    assert.match(form, /name="quelle" required/, f);
    assert.match(form, /name="freitext"[^>]* required/, f);
    assert.equal((form.match(/<option value="[a-z-]+">/g) || []).length, 6 + 8, f + ": 6 Rollen und 8 Wege aus dem Kontaktformular");
    const ende = form.slice(form.indexOf('<div class="strecke__ende"'), form.indexOf("data-strecke-ansage"));
    assert.match(ende, /hidden/, f);
    assert.match(ende, /type="checkbox"[^>]*data-feld="einwilligung"/, f);
    assert.match(ende, /datenschutz\.html/, f);
    assert.match(ende, /type="submit"[^>]* disabled/, f);
    assert.match(form.replace(/<[^>]+>/g, ""), /(Ich stimme den Datenschutzrichtlinien zu, dass meine Angaben zur Bearbeitung dieser Anfrage verarbeitet werden|I agree to the privacy policy that my details are processed to handle this request)\./, f);
    assert.match(form, /(Anfrage absenden|Send request)/, f);
    assert.doesNotMatch(form, /data-pilot-oeffnen/, f + ": kein Pilot-Knopf in der Strecke");
  }
  const de = lies("b2b/index.html").match(/<form class="strecke"[\s\S]*?<\/form>/)[0];
  for (const frage of ["Anzahl der Mitarbeitenden", "Ihre Rolle im Unternehmen", "Wie heißt Ihr Unternehmen?", "Wie können wir Sie per Mail erreichen?", "Wie sind Sie auf uns aufmerksam geworden?"]) assert.match(de, new RegExp(frage.replace("?", "\\?")));
  assert.ok(de.indexOf("Anzahl der Mitarbeitenden") < de.indexOf("Ihre Rolle im Unternehmen") && de.indexOf("Ihre Rolle im Unternehmen") < de.indexOf("Wie heißt Ihr Unternehmen?") && de.indexOf("Wie heißt Ihr Unternehmen?") < de.indexOf("per Mail erreichen") && de.indexOf("per Mail erreichen") < de.indexOf("aufmerksam geworden"), "Reihenfolge der Fragen");
});

test("Die Anfrage-Strecke geht ab 10 Mitarbeitenden weiter", () => {
  const js = lies("assets/js/b2b.js");
  assert.match(js, /mitarbeitendeGueltig\(felder\.mitarbeitende\.value, 10\)/);
});

test("Die deutschen B2B-Seiten sprechen durchgehend Sie, keine Du-Formen im sichtbaren Text", () => {
  const du = /\b(du|dein|deine|deinen|deinem|deiner|deines|dir|dich|wähle|wähl|lass|schau|kannst|musst|bist|hast|willst|kopiere)\b/i;
  for (const f of fs.readdirSync(path.join(__dirname, "..", "b2b")).filter((n) => n.endsWith(".html")).map((n) => "b2b/" + n)) {
    const t = lies(f).replace(/<(script|style)[\s\S]*?<\/\1>/g, "").replace(/<[^>]+>/g, " ").replace(/„[^“]*“/g, "");
    assert.doesNotMatch(t, du, f);
  }
});

test("Weitere Teams und Weitere Standorte sind Knöpfe, die das Formular öffnen, mit dem Rollout-Satz", () => {
  for (const [f, satz] of [["b2b/index.html", /Nach erfolgreicher Einführung steht Ihnen der Rollout zur Verfügung/], ["en/b2b/index.html", /After a successful introduction, the rollout is available to you/]]) {
    const h = lies(f);
    assert.equal((h.match(/<button class="klein__knopf" type="button" data-pilot-oeffnen>/g) || []).length, 3, f);
    assert.match(h, satz, f);
    assert.doesNotMatch(h.match(/<ol class="klein__stufen">[\s\S]*?<\/ol>/)[0], /Auf einen Rollout legen Sie sich|do not commit to a rollout/, f);
  }
});

test("Was wir am Ende messen: vier umdrehbare Kacheln, keine Platzhalter und keine Abgrenzungssätze", () => {
  for (const [f, satz] of [["b2b/index.html", /Am Ende des Piloten sehen Sie durch vier einfache Fragen, ob es für Ihre Mitarbeitenden einen Effekt hatte\./], ["en/b2b/index.html", /four simple questions show you whether it had an effect/]]) {
    const h = lies(f);
    const blk = h.match(/<section class="abschnitt" id="messwerte"[\s\S]*?<\/section>/)[0];
    assert.equal((blk.match(/<li class="messwert messwert--dreh" tabindex="0">/g) || []).length, 4, f);
    assert.equal((blk.match(/class="messwert__vorn"/g) || []).length, 4, f);
    assert.equal((blk.match(/class="messwert__hinten"/g) || []).length, 4, f);
    assert.match(blk, satz, f);
    assert.doesNotMatch(blk, /Noch keine Daten|No data yet|zeitstrahl|messwerte__grenze|Krankheitstage|sick days|selbst berichtet|self-reported/, f);
  }
});

test("Betriebsrat trägt nirgends eine Entwurfsmarke", () => {
  for (const f of ["b2b/index.html", "en/b2b/index.html", "b2b/betriebsrat.html", "en/b2b/betriebsrat.html"]) {
    const h = lies(f);
    assert.doesNotMatch(h, /Betriebsrat \(Entwurf\)|Works council \(draft\)|rollen__entwurf|description" content="[^"]*(Entwurf|Draft)\.">/, f);
  }
});

test("alle Formulare: Branche und Stunden pro Tag sind Pflichtfelder, kein Entwurf, nur die Meldung unter dem Knopf", () => {
  const texte = fs.readFileSync(path.join(__dirname, "..", "assets/js/texte.js"), "utf8");
  assert.match(texte, /"formular\.versand": "Tool zur Erfassung fehlt noch\."/);
  assert.match(texte, /"formular\.versand": "The tool to capture requests is not available yet\."/);
  for (const f of ALLE_B2B) {
    const h = lies(f);
    const form = h.match(/<form class="formular" id="pilot-formular"[\s\S]*?<\/form>/)[0];
    assert.match(form, /name="stunden"[^>]* required/, f);
    assert.match(form, /name="branche" required/, f);
    assert.equal((form.match(/<select id="f-branche"[\s\S]*?<\/select>/)[0].match(/<option value="[a-z-]+">/g) || []).length, 14, f);
    assert.doesNotMatch(form, /data-formular-ergebnis|data-formular-text|data-formular-kopieren|Entwurf|Draft|Text kopieren|Copy text/, f);
    assert.match(form, /<p class="formular__status" role="status" data-formular-status><\/p>/, f);
  }
  for (const f of SEITEN) {
    const strecke = lies(f).match(/<form class="strecke"[\s\S]*?<\/form>/)[0];
    assert.doesNotMatch(strecke, /data-strecke-ergebnis|data-strecke-text|data-strecke-kopieren|Entwurf|Draft/, f);
    assert.match(strecke, /<p class="formular__status" role="status" data-strecke-status><\/p>/, f);
    const ids = [...lies(f).match(/<div class="boden__kacheln"[\s\S]*?<\/ul>/)[0].matchAll(/data-taetigkeit="([a-z-]+)"/g)].map((m) => m[1]);
    const { BRANCHEN } = require("../assets/js/formular.js");
    assert.deepEqual(ids, BRANCHEN.map((b) => b.id), f + ": Kacheln und Branchen sind dieselbe Liste");
  }
});

test("Der Pilotpreis steht im Preisbereich in einem Satz, der alte Satz ist weg", () => {
  for (const f of SEITEN) assert.doesNotMatch(lies(f), /Der Pilot kostet den regulären Preis|The pilot costs the regular price/, f);
});

test("Die Sohle im Kapitel klebt unter der Menüleiste und passt in das Fenster", () => {
  const css = lies("assets/css/components.css");
  assert.match(css, /\.geschichte__kapitel\[data-boden\] \.schicht__bild \{[^}]*position: sticky; top: calc\(var\(--menue-hoehe\) \+ var\(--abstand-4\)\)/);
  assert.match(css, /\.geschichte__kapitel\[data-boden\] \.druck \{ max-height: min\(calc\(100vh - var\(--menue-hoehe\) - var\(--abstand-6\)\), 34rem\); \}/);
});
