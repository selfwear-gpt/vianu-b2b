/*
  Prüfung der Pilotanfrage. Schnittstelle: pruefeAnfrage(daten, sprache) -> { ok, fehler }, anfrageAlsText(daten, sprache), ROLLEN.
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
  var MAX_NAME = 120;
  var MAX_ZAHL = 100000;

  function rolleName(id, sprache) {
    for (var i = 0; i < ROLLEN.length; i++) if (ROLLEN[i].id === id) return sprache ? texte.text("rolle." + id, null, sprache) : ROLLEN[i].name;
    return null;
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
      t("anfrage.mitarbeitende") + ": " + String(daten.mitarbeitende).trim()
    ].join("\n");
  }

  return { pruefeAnfrage: pruefeAnfrage, anfrageAlsText: anfrageAlsText, ROLLEN: ROLLEN };
});
