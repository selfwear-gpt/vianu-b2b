/*
  Namensbereinigung für die Namenssohle. Schnittstelle: bereinigeName(eingabe).
  Reine Funktion ohne Browserbezug, damit sie sich mit "node --test" prüfen lässt.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuName = factory();
})(this, function () {
  var MAX_ZEICHEN = 14;

  function bereinigeName(eingabe) {
    var bereinigt = String(eingabe)
      .replace(/[\u2019]/g, "'")
      .replace(/[^\p{L}\p{M} '\-]/gu, "")
      .replace(/ {2,}/g, " ")
      .replace(/^ /, "");
    return Array.from(bereinigt).slice(0, MAX_ZEICHEN).join("");
  }
  return { bereinigeName: bereinigeName };
});
