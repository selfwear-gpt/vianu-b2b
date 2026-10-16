/*
  Kostenrechner: Preis je Paar geteilt durch die Schichten, die Besucher einstellen.
  Schnittstelle: kostenJeSchicht(preis, schichten, sprache) -> { cent, text } oder null, begrenzeSchichten(wert), SCHICHTEN,
  fehltageFuerPreis(preis, kostenJeTag), fehlzeitKosten(personen, tage, kostenJeTag), anteilPreis(preis, gesamt), euro(betrag, sprache).
  Reine Funktionen ohne Browserbezug. Die Seite nennt das Ergebnis "gerechnet" und macht keine Aussage zur Haltbarkeit.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuKosten = factory();
})(this, function () {
  var SCHICHTEN = { min: 20, max: 600, start: 210 };

  function begrenzeSchichten(wert) {
    var n = Number(wert);
    if (!isFinite(n) || String(wert).trim() === "") return SCHICHTEN.start;
    n = Math.round(n);
    return n < SCHICHTEN.min ? SCHICHTEN.min : n > SCHICHTEN.max ? SCHICHTEN.max : n;
  }

  function kostenJeSchicht(preis, schichten, sprache) {
    var p = Number(preis);
    var s = Number(schichten);
    if (!isFinite(p) || !isFinite(s) || s < 1 || String(schichten).trim() === "") return null;
    var cent = Math.round((p * 100) / s + 1e-9);
    var euro = Math.floor(cent / 100);
    var rest = cent % 100;
    var centStellen = (rest < 10 ? "0" : "") + rest;
    if (sprache === "en") return { cent: cent, text: "EUR " + euro + "." + centStellen };
    return { cent: cent, text: euro + "," + centStellen + " Euro" };
  }

  // Break-even: wie viele Fehltage entsprechen dem Pilotpreis, wenn ein Fehltag so viel kostet, wie der Besucher einträgt.
  // Reine Rechnung mit Besucherzahlen. VIANU nennt keine Fehltagequote und keine Wirkung.
  function fehltageFuerPreis(preis, kostenJeTag) {
    var p = Number(preis), k = Number(kostenJeTag);
    if (!isFinite(p) || !isFinite(k) || k <= 0 || p < 0) return null;
    return Math.ceil(p / k - 1e-9);
  }
  function fehlzeitKosten(personen, tage, kostenJeTag) {
    var n = Number(personen), t = Number(tage), k = Number(kostenJeTag);
    if (!isFinite(n) || !isFinite(t) || !isFinite(k) || n < 0 || t < 0 || k < 0) return null;
    return Math.round(n * t * k);
  }
  function anteilPreis(preis, gesamt) {
    var p = Number(preis), g = Number(gesamt);
    if (!isFinite(p) || !isFinite(g) || g <= 0) return null;
    return Math.round((p / g) * 100);
  }
  function euro(betrag, sprache) {
    var n = Math.round(Number(betrag));
    if (!isFinite(n)) return null;
    var teile = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sprache === "en" ? "," : ".");
    var vorzeichen = n < 0 ? "-" : "";
    return sprache === "en" ? vorzeichen + "EUR " + teile : vorzeichen + teile + " Euro";
  }

  return { kostenJeSchicht: kostenJeSchicht, begrenzeSchichten: begrenzeSchichten, SCHICHTEN: SCHICHTEN, fehltageFuerPreis: fehltageFuerPreis, fehlzeitKosten: fehlzeitKosten, anteilPreis: anteilPreis, euro: euro };
});
