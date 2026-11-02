// Seam: 6 Fotos je Fußerfassung, Partner SELFWEAR AI, neue FAQ-Fragen, kein TPU auf den Seiten.
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const lies = (f) => fs.readFileSync(path.join(__dirname, "..", f), "utf8");
const ALLE = ["index.html", "b2b/index.html", "b2b/personal.html", "b2b/arbeitsschutz.html", "b2b/einkauf.html", "b2b/geschaeftsfuehrung.html", "b2b/betriebsrat.html"];
const PAARE = ALLE.flatMap((f) => [f, "en/" + f]);

test("Auf allen Seiten, die den Ablauf erklären, stehen 6 Fotos je Fußerfassung (DE und EN). Arbeitsschutz erklärt ihn nicht.", () => {
  for (const f of PAARE.filter((x) => !/arbeitsschutz/.test(x))) assert.match(lies(f), /6 (Fotos|photos)/, f);
});

test("Der Partnersatz zu SELFWEAR AI steht im Ablauf der B2C- und der B2B-Startseite", () => {
  assert.ok(lies("index.html").includes("Mit unserem Partner SELFWEAR AI werden die Füße millimetergenau vermessen und als deine persönliche Einlegesohle modelliert."));
  assert.ok(lies("en/index.html").includes("With our partner SELFWEAR AI, your feet are measured to the millimeter and modeled into your personal insole."));
  assert.ok(lies("b2b/index.html").includes("Mit unserem Partner SELFWEAR AI werden die Füße der Mitarbeitenden millimetergenau vermessen und als persönliche Einlegesohle modelliert."));
  assert.ok(lies("en/b2b/index.html").includes("With our partner SELFWEAR AI, the employees' feet are measured to the millimeter"));
});

test("Passgenauigkeit: Frage auf fünf Seiten, in sichtbarem Text und in den FAQPage-Daten", () => {
  for (const f of ["index.html", "b2b/index.html", "b2b/personal.html", "b2b/arbeitsschutz.html", "b2b/einkauf.html"]) {
    for (const datei of [f, "en/" + f]) {
      const h = lies(datei);
      assert.match(h, /<summary>(Wie wird die Passgenauigkeit|How is the fit of)/, datei);
      assert.match(h, /"name": "(Wie wird die Passgenauigkeit|How is the fit of)/, datei);
      assert.match(h, /SELFWEAR AI/, datei);
    }
  }
});

test("Material: Platzhalter-Frage auf B2C, B2B-Start und Einkauf, nicht in den FAQPage-Daten", () => {
  for (const f of ["index.html", "b2b/index.html", "b2b/einkauf.html"]) {
    for (const datei of [f, "en/" + f]) {
      const h = lies(datei);
      assert.match(h, /<summary>(Aus welchem Material ist die Einlegesohle\?|What material is the insole made of\?)<\/summary>/, datei);
      assert.match(h, /data-platzhalter>(Platzhalter: Das Material muss noch bestätigt werden\.|Placeholder: The material still has to be confirmed\.)/, datei);
      assert.doesNotMatch(h, /"name": "(Aus welchem Material|What material)/, datei);
    }
  }
});

test("Das Material TPU steht nirgends auf den Seiten, bis es bestätigt ist", () => {
  for (const f of PAARE.concat(["datenschutz.html", "en/datenschutz.html"])) assert.doesNotMatch(lies(f), /\bTPU\b/, f);
});
