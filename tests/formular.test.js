// Seam: Prüfung der Pilotanfrage (assets/js/formular.js). Eingabe aus dem Formular, Ausgabe: Fehler je Feld.
const test = require("node:test");
const assert = require("node:assert/strict");
const { pruefeAnfrage, anfrageAlsText, ROLLEN } = require("../assets/js/formular.js");

const gut = { unternehmen: "Hotel Sonnenhof", rolle: "personal", mitarbeitende: "120", einwilligung: true };

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
  const r = pruefeAnfrage({ unternehmen: "", rolle: "", mitarbeitende: "", einwilligung: false });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.fehler).sort(), ["einwilligung", "mitarbeitende", "rolle", "unternehmen"]);
});

test("anfrageAlsText nennt Unternehmen, Rolle (mit Namen) und Zahl", () => {
  const t = anfrageAlsText(gut);
  assert.match(t, /Hotel Sonnenhof/);
  assert.match(t, /Personal/);
  assert.match(t, /120/);
});

test("englische Meldungen und englischer Anfragetext", () => {
  const r = pruefeAnfrage({ ...gut, unternehmen: "", rolle: "", mitarbeitende: "0", einwilligung: false }, "en");
  for (const k of ["unternehmen", "rolle", "mitarbeitende", "einwilligung"]) assert.match(r.fehler[k], /^(Please|The)\b/, k);
  const t = anfrageAlsText(gut, "en");
  assert.match(t, /Request for the pilot with 10 employees/);
  assert.match(t, /Role: HR/);
  assert.doesNotMatch(t, /Anfrage|Rolle|Unternehmen/);
});
