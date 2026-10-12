/*
  Menü des B2B-Bereichs. Schnittstelle: initMenue() wird beim Laden aufgerufen.
  Ohne Skript bleibt alles lesbar: Menü und Auswahl sind dann geöffnet.
*/
(function () {
  document.documentElement.classList.add("js");

  function initMenue() {
    var knopf = document.querySelector("[data-menue-knopf]");
    var nav = document.getElementById("menue-nav");
    var auswahlKnopf = document.querySelector("[data-auswahl-knopf]");
    var panel = document.getElementById("persona-liste");
    if (!knopf || !nav || !auswahlKnopf || !panel) return;

    function setzeAuswahl(offen) {
      auswahlKnopf.setAttribute("aria-expanded", offen ? "true" : "false");
      panel.hidden = !offen;
    }
    function setzeMenue(offen) {
      knopf.setAttribute("aria-expanded", offen ? "true" : "false");
      nav.setAttribute("data-offen", offen ? "true" : "false");
      if (!offen) setzeAuswahl(false);
    }

    setzeAuswahl(false);
    setzeMenue(false);

    knopf.addEventListener("click", function () {
      setzeMenue(knopf.getAttribute("aria-expanded") !== "true");
    });
    auswahlKnopf.addEventListener("click", function () {
      setzeAuswahl(auswahlKnopf.getAttribute("aria-expanded") !== "true");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (auswahlKnopf.getAttribute("aria-expanded") === "true") {
        setzeAuswahl(false);
        auswahlKnopf.focus();
      } else if (knopf.getAttribute("aria-expanded") === "true") {
        setzeMenue(false);
        knopf.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !auswahlKnopf.contains(e.target)) {
        setzeAuswahl(false);
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setzeMenue(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMenue);
  } else {
    initMenue();
  }
})();
