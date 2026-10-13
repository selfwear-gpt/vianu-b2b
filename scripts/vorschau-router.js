/*
  Router nur für die Gesamtvorschau (nicht Teil der ausgelieferten Seite).
  Schnittstelle: seiteFuerHash(hash), verweisFuerVorschau(href, vonSeite).
  Reine Funktionen ohne Browserbezug.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuVorschauRouter = factory();
})(this, function () {
  // Wo die Seiten im Repo liegen. Daraus ergibt sich, welcher Verweis auf welche Seite zeigt.
  var ROLLEN = ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"];
  var SEITEN = { start: "index.html", b2b: "b2b/index.html" };
  var KENNUNG = { "/": "#", "/index.html": "#", "/b2b/": "#b2b", "/b2b/index.html": "#b2b" };
  ROLLEN.forEach(function (r) {
    SEITEN["b2b-" + r] = "b2b/" + r + ".html";
    KENNUNG["/b2b/" + r + ".html"] = "#b2b-" + r;
  });
  var BASIS = "http://vorschau.invalid/";

  function seiteFuerHash(hash) {
    if (hash === "" || hash === "#") return "start";
    var name = hash.charAt(0) === "#" ? hash.slice(1) : hash;
    return Object.prototype.hasOwnProperty.call(SEITEN, name) && name !== "start" ? name : null;
  }

  // Query und Anker am Ziel zählen nicht: Die Vorschau zeigt die ganze Seite.
  function verweisFuerVorschau(href, vonSeite) {
    if (!SEITEN[vonSeite] || /^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return null;
    var ziel = new URL(href, new URL(SEITEN[vonSeite], BASIS));
    return Object.prototype.hasOwnProperty.call(KENNUNG, ziel.pathname) ? KENNUNG[ziel.pathname] : null;
  }

  return { seiteFuerHash: seiteFuerHash, verweisFuerVorschau: verweisFuerVorschau };
});
