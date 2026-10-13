/*
  Prüfung der Pilotanfrage. Schnittstelle: pruefeAnfrage(daten) -> { ok, fehler }, anfrageAlsText(daten), ROLLEN.
  Reine Funktionen ohne Browserbezug. Versand gibt es noch nicht: Die Seite zeigt die Anfrage als Text.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuFormular = factory();
})(this, function () {
  var ROLLEN = [
    { id: "personal", name: "Personal" },
    { id: "geschaeftsfuehrung", name: "Geschäftsführung und Betrieb" },
    { id: "arbeitsschutz", name: "Arbeitsschutz" },
    { id: "einkauf", name: "Einkauf" },
    { id: "betriebsrat", name: "Betriebsrat" },
    { id: "andere", name: "Andere Rolle" }
  ];
  var MAX_NAME = 120;
  var MAX_ZAHL = 100000;

  function rolleName(id) {
    for (var i = 0; i < ROLLEN.length; i++) if (ROLLEN[i].id === id) return ROLLEN[i].name;
    return null;
  }

  function pruefeAnfrage(daten) {
    var fehler = {};
    var name = String(daten.unternehmen == null ? "" : daten.unternehmen).trim();
    if (!name) fehler.unternehmen = "Bitte tragen Sie den Namen Ihres Unternehmens ein.";
    else if (name.length > MAX_NAME) fehler.unternehmen = "Der Name ist zu lang (höchstens " + MAX_NAME + " Zeichen).";

    if (!rolleName(daten.rolle)) fehler.rolle = "Bitte wählen Sie Ihre Rolle.";

    var zahl = String(daten.mitarbeitende == null ? "" : daten.mitarbeitende).trim();
    if (!/^\d+$/.test(zahl) || Number(zahl) < 1 || Number(zahl) > MAX_ZAHL) {
      fehler.mitarbeitende = "Bitte geben Sie die Zahl der Mitarbeitenden als ganze Zahl von 1 bis " + MAX_ZAHL + " an.";
    }

    if (daten.einwilligung !== true) fehler.einwilligung = "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.";

    return { ok: Object.keys(fehler).length === 0, fehler: fehler };
  }

  function anfrageAlsText(daten) {
    return [
      "Anfrage für den Piloten mit 10 Mitarbeitenden",
      "Unternehmen: " + String(daten.unternehmen).trim(),
      "Rolle: " + (rolleName(daten.rolle) || ""),
      "Mitarbeitende im Unternehmen: " + String(daten.mitarbeitende).trim()
    ].join("\n");
  }

  return { pruefeAnfrage: pruefeAnfrage, anfrageAlsText: anfrageAlsText, ROLLEN: ROLLEN };
});
