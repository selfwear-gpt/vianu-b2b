/*
  Kostenrechner: Preis je Paar geteilt durch die Schichten, die Besucher einstellen.
  Schnittstelle: kostenJeSchicht(preis, schichten) -> { cent, text } oder null, begrenzeSchichten(wert), SCHICHTEN.
  Reine Funktionen ohne Browserbezug. Die Seite nennt das Ergebnis "gerechnet" und macht keine Aussage zur Haltbarkeit.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuKosten = factory();
})(this, function () {
  var SCHICHTEN = { min: 20, max: 600, start: 220 };

  function begrenzeSchichten(wert) {
    var n = Number(wert);
    if (!isFinite(n) || String(wert).trim() === "") return SCHICHTEN.start;
    n = Math.round(n);
    return n < SCHICHTEN.min ? SCHICHTEN.min : n > SCHICHTEN.max ? SCHICHTEN.max : n;
  }

  function kostenJeSchicht(preis, schichten) {
    var p = Number(preis);
    var s = Number(schichten);
    if (!isFinite(p) || !isFinite(s) || s < 1 || String(schichten).trim() === "") return null;
    var cent = Math.round((p * 100) / s + 1e-9);
    var euro = Math.floor(cent / 100);
    var rest = cent % 100;
    return { cent: cent, text: euro + "," + (rest < 10 ? "0" : "") + rest + " Euro" };
  }

  return { kostenJeSchicht: kostenJeSchicht, begrenzeSchichten: begrenzeSchichten, SCHICHTEN: SCHICHTEN };
});
