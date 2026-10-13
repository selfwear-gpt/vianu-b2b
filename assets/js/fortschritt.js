/*
  Scroll-Fortschritt für Bewegungen, die am Scrollen hängen. Schnittstelle:
  fortschrittImBild(oben, hoehe, fenster), aktiverSchritt(fortschritt, anzahl), sichtbareAnzahl(fortschritt, anzahl).
  Reine Funktionen ohne Browserbezug. Der Fortschritt ist immer umkehrbar: gleicher Stand, gleiches Bild.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuFortschritt = factory();
})(this, function () {
  function begrenze(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }

  // 0, wenn der Bereich unten ins Fenster tritt (oben = fenster), 1, wenn er oben herausgeht (unten = 0)
  function fortschrittImBild(oben, hoehe, fenster) {
    var strecke = fenster + hoehe;
    if (!(strecke > 0)) return 0;
    return begrenze((fenster - oben) / strecke);
  }

  // Welcher von anzahl Schritten ist aktiv: 0 bis anzahl - 1
  function aktiverSchritt(fortschritt, anzahl) {
    if (!(anzahl >= 1) || isNaN(fortschritt)) return 0;
    var i = Math.floor(begrenze(fortschritt) * anzahl);
    return i > anzahl - 1 ? anzahl - 1 : i;
  }

  // Wie viele von anzahl Teilen sind sichtbar: 0 bis anzahl
  function sichtbareAnzahl(fortschritt, anzahl) {
    if (!(anzahl >= 1) || isNaN(fortschritt)) return 0;
    return Math.floor(begrenze(fortschritt) * anzahl + 1e-9);
  }

  return { fortschrittImBild: fortschrittImBild, aktiverSchritt: aktiverSchritt, sichtbareAnzahl: sichtbareAnzahl };
});
