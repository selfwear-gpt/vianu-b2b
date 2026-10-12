/*
  Menü beider Bereiche. Schnittstelle: initMenue(wurzel) für jedes Element mit [data-menue].
  Jedes Menü arbeitet für sich und greift nur auf eigene Kindelemente zu. Das Menü des Mitarbeitenden-Bereichs
  hat keine Rollenauswahl, das des B2B-Bereichs schon (optional).
  Ohne Skript bleibt alles lesbar: Menü und Auswahl sind dann geöffnet.
*/
(function () {
  document.documentElement.classList.add("js");

  function initMenue(wurzel) {
    var knopf = wurzel.querySelector("[data-menue-knopf]");
    var nav = wurzel.querySelector("[data-menue-nav]");
    if (!knopf || !nav) return;

    var auswahlKnopf = wurzel.querySelector("[data-auswahl-knopf]");
    var panel = auswahlKnopf ? document.getElementById(auswahlKnopf.getAttribute("aria-controls")) : null;

    function setzeAuswahl(offen) {
      if (!auswahlKnopf || !panel) return;
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
    if (auswahlKnopf && panel) {
      auswahlKnopf.addEventListener("click", function () {
        setzeAuswahl(auswahlKnopf.getAttribute("aria-expanded") !== "true");
      });
      document.addEventListener("click", function (e) {
        if (!panel.hidden && !panel.contains(e.target) && !auswahlKnopf.contains(e.target)) setzeAuswahl(false);
      });
    }

    wurzel.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (auswahlKnopf && auswahlKnopf.getAttribute("aria-expanded") === "true") {
        setzeAuswahl(false);
        auswahlKnopf.focus();
      } else if (knopf.getAttribute("aria-expanded") === "true") {
        setzeMenue(false);
        knopf.focus();
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setzeMenue(false);
    });
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-menue]"), initMenue);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
