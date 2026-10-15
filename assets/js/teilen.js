/*
  Links, die beim Teilen kopiert werden. Schnittstelle: linkFuerKollegen(basis), linkFuerRolle(basis, rolle), ROLLEN.
  Reine Funktionen ohne Browserbezug.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuTeilen = factory();
})(this, function () {
  function startseite(basis) {
    return new URL(".", new URL(basis));
  }

  function linkFuerKollegen(basis) {
    return startseite(basis).href;
  }

  var QUELLE = "mitarbeitende";

  var ROLLEN = [
    { id: "personal", name: "Personal" },
    { id: "geschaeftsfuehrung", name: "Geschäftsführung und Betrieb" },
    { id: "arbeitsschutz", name: "Arbeitsschutz" },
    { id: "einkauf", name: "Einkauf" },
    { id: "betriebsrat", name: "Betriebsrat" }
  ];

  function linkFuerRolle(basis, rolle) {
    var bekannt = ROLLEN.some(function (r) { return r.id === rolle; });
    if (!bekannt) return null;
    var url = new URL("b2b/" + rolle + ".html", startseite(basis));
    url.searchParams.set("quelle", QUELLE);
    return url.href;
  }

  return { linkFuerKollegen: linkFuerKollegen, linkFuerRolle: linkFuerRolle, ROLLEN: ROLLEN };
});
