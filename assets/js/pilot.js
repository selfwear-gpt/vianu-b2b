/*
  Pilot-Popup. Schnittstelle: Elemente mit [data-pilot-oeffnen] öffnen das <dialog data-pilot-dialog>.
  Das Popup öffnet auch bei #pilot oder ?pilot in der Adresse. Schließen mit Knopf, Esc oder Klick auf den Hintergrund,
  der Fokus kehrt zum Auslöser zurück. Ohne Skript bleiben die Verweise #pilot Sprünge zum Abschnitt am Seitenende.
*/
(function () {
  function init(dialog) {
    var ausloeser = null;
    // In der Gesamtvorschau liegen mehrere Seiten in einem Dokument: Auslöser gehören zur Seite des Popups
    var seite = dialog.closest("[data-seite]") || document;
    var oeffnen = seite.querySelectorAll("[data-pilot-oeffnen]");

    function zeige() {
      if (dialog.open) return;
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      var erstes = dialog.querySelector("input, select, textarea");
      if (erstes) erstes.focus();
    }
    function schliesse() {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }

    Array.prototype.forEach.call(oeffnen, function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        ausloeser = a;
        zeige();
      });
    });
    Array.prototype.forEach.call(dialog.querySelectorAll("[data-pilot-schliessen]"), function (b) {
      b.addEventListener("click", schliesse);
    });
    // Klick auf den abgedunkelten Hintergrund (außerhalb des Inhalts) schließt
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) schliesse();
    });
    dialog.addEventListener("close", function () {
      if (ausloeser && document.contains(ausloeser)) ausloeser.focus();
      if (/#pilot$/.test(window.location.hash) && window.history && window.history.replaceState) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    });

    if (!dialog.closest("[data-seite]")) {
      if (/(^|[?&])pilot($|[&=])/.test(window.location.search) || window.location.hash === "#pilot") zeige();
      window.addEventListener("hashchange", function () { if (window.location.hash === "#pilot") zeige(); });
    }
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-pilot-dialog]"), init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
