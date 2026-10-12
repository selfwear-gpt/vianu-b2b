/*
  Browser-Anbindung der Gesamtvorschau (nicht Teil der ausgelieferten Seite).
  Zeigt je nach # die Seite "start" oder "b2b", schreibt Verweise zwischen den Bereichen um und
  scrollt Anker innerhalb der aktiven Seite. Nutzt VianuVorschauRouter für alle Zuordnungen.
  Die Seiten selbst bleiben unverändert: Der Build setzt nur Präfixe vor die ids.
*/
(function () {
  var Router = window.VianuVorschauRouter;
  var reduziert = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var seiten = {};
  Array.prototype.forEach.call(document.querySelectorAll("[data-seite]"), function (el) {
    seiten[el.getAttribute("data-seite")] = el;
  });
  var aktiv = "start";
  var hinweis = null;
  var hinweisTimer = null;

  function zeigeHinweis(text) {
    if (!hinweis) {
      hinweis = document.createElement("div");
      hinweis.className = "vorschau-hinweis";
      hinweis.setAttribute("role", "status");
      document.body.appendChild(hinweis);
    }
    hinweis.textContent = text;
    hinweis.hidden = false;
    window.clearTimeout(hinweisTimer);
    hinweisTimer = window.setTimeout(function () { hinweis.hidden = true; }, 4000);
  }

  function zeigeSeite() {
    var name = Router.seiteFuerHash(window.location.hash);
    if (!name || !seiten[name]) return;
    Object.keys(seiten).forEach(function (k) { seiten[k].hidden = k !== name; });
    var gewechselt = name !== aktiv;
    aktiv = name;
    if (gewechselt) window.scrollTo(0, 0);
    window.dispatchEvent(new Event("resize"));
  }

  // Verweise zwischen den Bereichen umschreiben, unbekannte Ziele markieren
  Object.keys(seiten).forEach(function (name) {
    Array.prototype.forEach.call(seiten[name].querySelectorAll("a[href]"), function (a) {
      var href = a.getAttribute("href");
      if (/^(#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return;
      var ziel = Router.verweisFuerVorschau(href, name);
      if (ziel) a.setAttribute("href", ziel);
      else a.setAttribute("data-vorschau-offen", "");
    });
  });

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href");
    if (a.hasAttribute("data-vorschau-offen")) {
      e.preventDefault();
      zeigeHinweis("Diese Seite folgt in einer späteren Etappe.");
    } else if (href.charAt(0) === "#" && Router.seiteFuerHash(href) === null) {
      e.preventDefault();
      var ziel = document.getElementById(aktiv === "start" ? "s-" + href.slice(1) : "b-" + href.slice(1));
      if (ziel) ziel.scrollIntoView({ behavior: reduziert ? "auto" : "smooth", block: "start" });
    }
  });

  window.addEventListener("hashchange", zeigeSeite);
  zeigeSeite();
})();
