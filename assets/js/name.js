/*
  Namensbereinigung für die Namenssohle. Schnittstelle: bereinigeName(eingabe), bereinigeFirma(eingabe).
  Reine Funktion ohne Browserbezug, damit sie sich mit "node --test" prüfen lässt.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuName = factory();
})(this, function () {
  var MAX_ZEICHEN = 14;
  var MAX_FIRMA = 18;

  function bereinigeName(eingabe) {
    var bereinigt = String(eingabe)
      .replace(/[\u2019]/g, "'")
      .replace(/[^\p{L}\p{M} '\-]/gu, "")
      .replace(/ {2,}/g, " ")
      .replace(/^ /, "");
    return Array.from(bereinigt).slice(0, MAX_ZEICHEN).join("");
  }
  // Firmennamen dürfen auch Ziffern und & . tragen ("Müller & Söhne", "Café 24-7 e.K.")
  function bereinigeFirma(eingabe) {
    var bereinigt = String(eingabe == null ? "" : eingabe)
      .replace(/[\u2019]/g, "'")
      .replace(/[^\p{L}\p{M}\p{N} '\-&.]/gu, "")
      .replace(/ {2,}/g, " ")
      .replace(/^ /, "");
    return Array.from(bereinigt).slice(0, MAX_FIRMA).join("");
  }

  return { bereinigeName: bereinigeName, bereinigeFirma: bereinigeFirma };
});
