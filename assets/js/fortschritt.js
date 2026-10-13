/*
  Scroll-Fortschritt für Bewegungen, die am Scrollen hängen. Schnittstelle:
  fortschrittImBild(oben, hoehe, fenster), aktiverSchritt(fortschritt, anzahl), sichtbareAnzahl(fortschritt, anzahl),
  anteilZwischen(wert, von, bis), zeigerWinkel(anteil, startStunde, endStunde).
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

  // Wo liegt wert zwischen von und bis: 0 davor, 1 danach, dazwischen linear. Gleicher Anfang und Ende ergibt 0.
  function anteilZwischen(wert, von, bis) {
    if (bis === von) return 0;
    return begrenze((wert - von) / (bis - von));
  }

  // Winkel des Stundenzeigers in Grad, 12 Uhr oben, im Uhrzeigersinn. Der Zeiger läuft von startStunde bis endStunde,
  // 30 Grad je Stunde. Die Werte laufen über 360 Grad hinaus, CSS rechnet das wie eine Drehung weiter.
  function zeigerWinkel(anteil, startStunde, endStunde) {
    var a = isNaN(anteil) ? 0 : begrenze(anteil);
    return (startStunde % 12) * 30 + a * (endStunde - startStunde) * 30;
  }

  return {
    fortschrittImBild: fortschrittImBild,
    aktiverSchritt: aktiverSchritt,
    sichtbareAnzahl: sichtbareAnzahl,
    anteilZwischen: anteilZwischen,
    zeigerWinkel: zeigerWinkel
  };
});
