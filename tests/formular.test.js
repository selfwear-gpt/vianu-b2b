// Seam: Prüfung der Pilotanfrage (assets/js/formular.js). Eingabe aus dem Formular, Ausgabe: Fehler je Feld.
const test = require("node:test");
const assert = require("node:assert/strict");
const { pruefeAnfrage, anfrageAlsText, ROLLEN, QUELLEN, emailGueltig, mitarbeitendeGueltig, unternehmenGueltig, BRANCHEN, stundenGueltig } = require("../assets/js/formular.js");

const gut = { unternehmen: "Hotel Sonnenhof", rolle: "personal", mitarbeitende: "120", kontakt: "anna@sonnenhof.de", quelle: "ki", freitext: "Ich habe nach Einlegesohlen für Hotelpersonal gesucht.", einwilligung: true, branche: "hotel-gastronomie", stunden: "8", anliegen: "Ich möchte mehr Infos zu einem Pilot." };

test("eine vollständige Anfrage ist in Ordnung", () => {
  const r = pruefeAnfrage(gut);
  assert.equal(r.ok, true);
  assert.deepEqual(r.fehler, {});
});

test("meldet fehlendes Unternehmen, auch bei nur Leerzeichen", () => {
  assert.ok(pruefeAnfrage({ ...gut, unternehmen: "   " }).fehler.unternehmen);
  assert.ok(pruefeAnfrage({ ...gut, unternehmen: "" }).fehler.unternehmen);
});

test("meldet zu langen Firmennamen", () => {
  assert.ok(pruefeAnfrage({ ...gut, unternehmen: "x".repeat(121) }).fehler.unternehmen);
  assert.equal(pruefeAnfrage({ ...gut, unternehmen: "x".repeat(120) }).ok, true);
});

test("Rolle muss eine der bekannten sein", () => {
  assert.ok(pruefeAnfrage({ ...gut, rolle: "" }).fehler.rolle);
  assert.ok(pruefeAnfrage({ ...gut, rolle: "chef" }).fehler.rolle);
  for (const r of ROLLEN) assert.equal(pruefeAnfrage({ ...gut, rolle: r.id }).ok, true, r.id);
});

test("Zahl der Mitarbeitenden: ganze Zahl von 1 bis 100000", () => {
  for (const v of ["", "0", "-3", "1,5", "abc", "100001", "12e2"]) {
    assert.ok(pruefeAnfrage({ ...gut, mitarbeitende: v }).fehler.mitarbeitende, v);
  }
  for (const v of ["1", "10", "100000", " 40 "]) assert.equal(pruefeAnfrage({ ...gut, mitarbeitende: v }).ok, true, v);
});

test("ohne Einwilligung keine Anfrage", () => {
  assert.ok(pruefeAnfrage({ ...gut, einwilligung: false }).fehler.einwilligung);
});

test("mehrere Fehler werden zusammen gemeldet", () => {
  const r = pruefeAnfrage({ unternehmen: "", rolle: "", mitarbeitende: "", kontakt: "", quelle: "", freitext: "", anliegen: "", einwilligung: false, branche: "", stunden: "" });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.fehler).sort(), ["anliegen", "branche", "einwilligung", "freitext", "kontakt", "mitarbeitende", "quelle", "rolle", "stunden", "unternehmen"]);
});

test("anfrageAlsText nennt Unternehmen, Rolle (mit Namen) und Zahl", () => {
  const t = anfrageAlsText(gut);
  assert.match(t, /Hotel Sonnenhof/);
  assert.match(t, /Personal/);
  assert.match(t, /120/);
});

test("englische Meldungen und englischer Anfragetext", () => {
  const r = pruefeAnfrage({ ...gut, unternehmen: "", rolle: "", mitarbeitende: "0", kontakt: "x", quelle: "", freitext: "", anliegen: "", einwilligung: false, branche: "", stunden: "0" }, "en");
  for (const k of ["unternehmen", "rolle", "mitarbeitende", "kontakt", "quelle", "freitext", "anliegen", "einwilligung", "branche", "stunden"]) assert.match(r.fehler[k], /^(Please|The)\b/, k);
  const t = anfrageAlsText(gut, "en");
  assert.match(t, /Request for the pilot with 10 employees/);
  assert.match(t, /Role: HR/);
  assert.doesNotMatch(t, /Anfrage|Rolle|Unternehmen/);
});

test("Kontakt: E-Mail oder Telefonnummer, nichts anderes", () => {
  for (const v of ["", "   ", "anna", "anna@", "@sonnenhof.de", "anna@sonnenhof", "12345", "abc 123"]) {
    assert.ok(pruefeAnfrage({ ...gut, kontakt: v }).fehler.kontakt, v);
  }
  for (const v of ["anna@sonnenhof.de", " anna.lena+pilot@sonnen-hof.co.uk ", "+49 171 1234567", "0171 / 1234567", "(089) 123 45 67", "030-123456"]) {
    assert.equal(pruefeAnfrage({ ...gut, kontakt: v }).ok, true, v);
  }
});

test("Herkunft: genau eine der vorgegebenen Antworten", () => {
  for (const v of ["", "irgendwas", "KI", undefined]) assert.ok(pruefeAnfrage({ ...gut, quelle: v }).fehler.quelle, String(v));
  for (const q of QUELLEN) assert.equal(pruefeAnfrage({ ...gut, quelle: q.id }).ok, true, q.id);
});

test("die Herkunftsliste ist überschneidungsfrei: jede Kennung einmal, jeder Name einmal, 'Anderer Weg' steht zuletzt", () => {
  const ids = QUELLEN.map((q) => q.id), namen = QUELLEN.map((q) => q.name.toLowerCase());
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(new Set(namen).size, namen.length);
  assert.equal(ids[ids.length - 1], "anderer");
  assert.deepEqual(ids, ["ki", "suchmaschine", "soziale-netzwerke", "empfehlung-unternehmen", "empfehlung-mitarbeitende", "kontakt-durch-vianu", "presse-veranstaltung", "anderer"]);
});

test("Freitext: Pflicht, 1 bis 500 Zeichen, nur Leerzeichen zählt nicht", () => {
  for (const v of ["", "   ", "x".repeat(501)]) assert.ok(pruefeAnfrage({ ...gut, freitext: v }).fehler.freitext, v.slice(0, 5));
  for (const v of ["x", "x".repeat(500)]) assert.equal(pruefeAnfrage({ ...gut, freitext: v }).ok, true);
});

test("anfrageAlsText nennt Kontakt, Herkunft (mit Namen) und Freitext, auch englisch", () => {
  const de = anfrageAlsText(gut);
  assert.match(de, /Kontakt: anna@sonnenhof\.de/);
  assert.match(de, /Aufmerksam geworden über: Suche mit einer KI/);
  assert.match(de, /Dazu: Ich habe nach Einlegesohlen/);
  const en = anfrageAlsText(gut, "en");
  assert.match(en, /Contact: anna@sonnenhof\.de/);
  assert.match(en, /Found us through: Search with an AI/);
  assert.match(en, /More detail: /);
});

test("emailGueltig nimmt nur E-Mail-Adressen an, keine Telefonnummern", () => {
  assert.equal(emailGueltig("anna@sonnenhof.de"), true);
  assert.equal(emailGueltig("  anna@sonnenhof.de "), true);
  for (const schlecht of ["", "anna", "anna@", "anna@sonnenhof", "anna@sonnenhof.d", "an na@sonnenhof.de", "+49 170 1234567", null, undefined]) assert.equal(emailGueltig(schlecht), false, String(schlecht));
});

test("mitarbeitendeGueltig verlangt eine ganze Zahl ab dem Minimum und höchstens die Obergrenze", () => {
  assert.equal(mitarbeitendeGueltig("10", 10), true);
  assert.equal(mitarbeitendeGueltig("9", 10), false);
  assert.equal(mitarbeitendeGueltig("120", 10), true);
  assert.equal(mitarbeitendeGueltig("100000", 10), true);
  assert.equal(mitarbeitendeGueltig("100001", 10), false);
  for (const schlecht of ["", "zehn", "10,5", "-12", "1e3", null, undefined]) assert.equal(mitarbeitendeGueltig(schlecht, 10), false, String(schlecht));
  assert.equal(mitarbeitendeGueltig("1"), true, "ohne Minimum gilt ab 1");
  assert.equal(mitarbeitendeGueltig("0"), false);
});

test("unternehmenGueltig: nicht leer, höchstens 120 Zeichen", () => {
  assert.equal(unternehmenGueltig("Hotel Sonnenhof"), true);
  assert.equal(unternehmenGueltig("   "), false);
  assert.equal(unternehmenGueltig(""), false);
  assert.equal(unternehmenGueltig("x".repeat(121)), false);
  assert.equal(unternehmenGueltig("x".repeat(120)), true);
});

test("Branche: eine der 14 Tätigkeitskacheln, Auffangkachel zuletzt", () => {
  assert.equal(BRANCHEN.length, 14);
  assert.equal(BRANCHEN[BRANCHEN.length - 1].id, "andere-taetigkeit");
  assert.equal(new Set(BRANCHEN.map((b) => b.id)).size, 14);
  for (const b of BRANCHEN) assert.equal(pruefeAnfrage({ ...gut, branche: b.id }).ok, true, b.id);
  for (const v of ["", "irgendwas", null, undefined]) assert.ok(pruefeAnfrage({ ...gut, branche: v }).fehler.branche, String(v));
});

test("Stunden pro Tag: ganze Zahl von 1 bis 12", () => {
  for (const v of ["1", "8", "12", " 10 "]) assert.equal(stundenGueltig(v), true, v);
  for (const v of ["", "0", "13", "-1", "1,5", "acht", null, undefined]) assert.equal(stundenGueltig(v), false, String(v));
  assert.ok(pruefeAnfrage({ ...gut, stunden: "13" }).fehler.stunden);
  assert.ok(pruefeAnfrage({ ...gut, stunden: "" }).fehler.stunden);
});

test("anfrageAlsText nennt Branche (mit Namen) und Stunden, auch englisch", () => {
  assert.match(anfrageAlsText(gut), /Branche: Hotel und Gastronomie/);
  assert.match(anfrageAlsText(gut), /Stunden pro Tag auf den Beinen: 8/);
  assert.match(anfrageAlsText(gut, "en"), /Industry: Hotels and restaurants/);
  assert.match(anfrageAlsText(gut, "en"), /Hours per day on their feet: 8/);
});

test("Anliegen: Pflicht, 1 bis 500 Zeichen, nur Leerzeichen zählt nicht, steht im Entwurf", () => {
  for (const v of ["", "   ", "x".repeat(501)]) assert.ok(pruefeAnfrage({ ...gut, anliegen: v }).fehler.anliegen, v.slice(0, 5));
  for (const v of ["x", "x".repeat(500)]) assert.equal(pruefeAnfrage({ ...gut, anliegen: v }).ok, true);
  assert.match(anfrageAlsText(gut), /Anliegen: Ich möchte mehr Infos zu einem Pilot\./);
  assert.match(anfrageAlsText(gut, "en"), /Request: Ich möchte/);
});
