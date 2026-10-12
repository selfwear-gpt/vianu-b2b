/*
  Router nur für die Gesamtvorschau (nicht Teil der ausgelieferten Seite).
  Schnittstelle: seiteFuerHash(hash), verweisFuerVorschau(href, vonSeite).
  Reine Funktionen ohne Browserbezug.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuVorschauRouter = factory();
})(this, function () {
  function seiteFuerHash(hash) {
    if (hash === "" || hash === "#") return "start";
    if (hash === "#b2b") return "b2b";
    return null;
  }
  // Wo die Seiten im Repo liegen. Daraus ergibt sich, welcher Verweis auf welche Seite zeigt.
  var SEITEN = { start: "index.html", b2b: "b2b/index.html" };
  var KENNUNG = { "/": "#", "/index.html": "#", "/b2b/": "#b2b", "/b2b/index.html": "#b2b" };
  var BASIS = "http://vorschau.invalid/";

  function verweisFuerVorschau(href, vonSeite) {
    if (!SEITEN[vonSeite] || /^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return null;
    var ziel = new URL(href, new URL(SEITEN[vonSeite], BASIS));
    return Object.prototype.hasOwnProperty.call(KENNUNG, ziel.pathname) ? KENNUNG[ziel.pathname] : null;
  }

  return { seiteFuerHash: seiteFuerHash, verweisFuerVorschau: verweisFuerVorschau };
});
