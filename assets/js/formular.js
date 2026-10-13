/*
  Prüfung der Pilotanfrage. Schnittstelle: pruefeAnfrage(daten, sprache) -> { ok, fehler }, anfrageAlsText(daten, sprache), ROLLEN, QUELLEN, quelleName(id, sprache).
  Reine Funktionen ohne Browserbezug. Versand gibt es noch nicht: Die Seite zeigt die Anfrage als Text.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./texte.js"));
  else root.VianuFormular = factory(root.VianuTexte);
})(this, function (texte) {
  var ROLLEN = [
    { id: "personal", name: "Personal" },
    { id: "geschaeftsfuehrung", name: "Geschäftsführung und Betrieb" },
    { id: "arbeitsschutz", name: "Arbeitsschutz" },
    { id: "einkauf", name: "Einkauf" },
    { id: "betriebsrat", name: "Betriebsrat" },
    { id: "andere", name: "Andere Rolle" }
  ];
  // Wie die Anfrager auf VIANU aufmerksam geworden sind. Die Antworten überschneiden sich nicht (nach Weg und Auslöser getrennt)
  // und decken alles ab: eigene Suche (KI, klassisch), soziale Netzwerke, Empfehlung (Unternehmen, Mitarbeitende),
  // Ansprache durch uns, Presse und Veranstaltungen, sonstiges. "Anderer Weg" steht immer zuletzt.
  var QUELLEN = [
    { id: "ki", name: "Suche mit einer KI" },
    { id: "suchmaschine", name: "Suche bei Google oder einer anderen Suchmaschine" },
    { id: "soziale-netzwerke", name: "Soziale Netzwerke" },
    { id: "empfehlung-unternehmen", name: "Empfehlung eines anderen Unternehmens" },
    { id: "empfehlung-mitarbeitende", name: "Empfehlung einer Mitarbeiterin oder eines Mitarbeiters" },
    { id: "kontakt-durch-vianu", name: "Kontaktaufnahme durch VIANU" },
    { id: "presse-veranstaltung", name: "Presse, Fachmedium oder Veranstaltung" },
    { id: "anderer", name: "Anderer Weg" }
  ];
  var MAX_NAME = 120;
  var MAX_FREITEXT = 500;
  var MAX_ZAHL = 100000;

  function rolleName(id, sprache) {
    for (var i = 0; i < ROLLEN.length; i++) if (ROLLEN[i].id === id) return sprache ? texte.text("rolle." + id, null, sprache) : ROLLEN[i].name;
    return null;
  }

  function quelleName(id, sprache) {
    for (var i = 0; i < QUELLEN.length; i++) {
      if (QUELLEN[i].id !== id) continue;
      return sprache === "en" ? texte.text("quelle." + id, null, "en").replace(/ \(.*\)$/, "") : QUELLEN[i].name;
    }
    return null;
  }

  // E-Mail: etwas@etwas.etwas ohne Leerzeichen. Telefon: nur Ziffern und + ( ) / - und Leerzeichen, mindestens 6 Ziffern.
  function kontaktGueltig(wert) {
    var k = String(wert == null ? "" : wert).trim();
    if (/^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(k)) return true;
    if (!/^\+?[\d\s()\/.-]+$/.test(k)) return false;
    return (k.match(/\d/g) || []).length >= 6;
  }

  function pruefeAnfrage(daten, sprache) {
    function t(k, w) { return texte.text(k, w, sprache || "de"); }
    var fehler = {};
    var name = String(daten.unternehmen == null ? "" : daten.unternehmen).trim();
    if (!name) fehler.unternehmen = t("formular.unternehmen.leer");
    else if (name.length > MAX_NAME) fehler.unternehmen = t("formular.unternehmen.lang", { max: MAX_NAME });

    if (!rolleName(daten.rolle)) fehler.rolle = t("formular.rolle");

    var zahl = String(daten.mitarbeitende == null ? "" : daten.mitarbeitende).trim();
    if (!/^\d+$/.test(zahl) || Number(zahl) < 1 || Number(zahl) > MAX_ZAHL) {
      fehler.mitarbeitende = t("formular.mitarbeitende", { max: MAX_ZAHL });
    }

    if (!kontaktGueltig(daten.kontakt)) fehler.kontakt = t("formular.kontakt");
    if (!quelleName(daten.quelle)) fehler.quelle = t("formular.quelle");
    var frei = String(daten.freitext == null ? "" : daten.freitext).trim();
    if (!frei || frei.length > MAX_FREITEXT) fehler.freitext = t("formular.freitext", { max: MAX_FREITEXT });

    if (daten.einwilligung !== true) fehler.einwilligung = t("formular.einwilligung");

    return { ok: Object.keys(fehler).length === 0, fehler: fehler };
  }

  function anfrageAlsText(daten, sprache) {
    var sp = sprache || "de";
    function t(k) { return texte.text(k, null, sp); }
    return [
      t("anfrage.titel"),
      t("anfrage.unternehmen") + ": " + String(daten.unternehmen).trim(),
      t("anfrage.rolle") + ": " + (rolleName(daten.rolle, sp) || ""),
      t("anfrage.mitarbeitende") + ": " + String(daten.mitarbeitende).trim(),
      t("anfrage.kontakt") + ": " + String(daten.kontakt).trim(),
      t("anfrage.quelle") + ": " + (quelleName(daten.quelle, sp) || ""),
      t("anfrage.freitext") + ": " + String(daten.freitext).trim()
    ].join("\n");
  }

  return { pruefeAnfrage: pruefeAnfrage, anfrageAlsText: anfrageAlsText, ROLLEN: ROLLEN, QUELLEN: QUELLEN, quelleName: quelleName };
});
