/*
  Bausteine der Rollenseiten. Schnittstelle: Elemente mit [data-pruefliste], [data-fluss] und [data-filter] arbeiten für sich.
  Prüfliste: Schalter zum Abhaken, nur Ansicht, nichts wird gespeichert. Datenfluss: ein Feld pro Knoten, der gewählte Knoten zeigt seinen Text.
  Filter: blendet Zeilen der Statusliste nach Status ein und aus. Ohne Skript stehen alle Inhalte lesbar da.
*/
(function () {
  function jeder(selektor, fn) { Array.prototype.forEach.call(document.querySelectorAll(selektor), fn); }

  function initPruefliste(wurzel) {
    var zeilen = wurzel.querySelectorAll(".pruefliste__zeile");
    var zahl = wurzel.querySelector("[data-pruefliste-zahl]");
    function zaehle() {
      var n = 0;
      Array.prototype.forEach.call(zeilen, function (z) { if (z.getAttribute("aria-pressed") === "true") n++; });
      if (zahl) zahl.textContent = String(n);
    }
    Array.prototype.forEach.call(zeilen, function (z) {
      z.addEventListener("click", function () {
        z.setAttribute("aria-pressed", z.getAttribute("aria-pressed") === "true" ? "false" : "true");
        zaehle();
      });
    });
    zaehle();
  }

  function initFluss(wurzel) {
    var knoten = wurzel.querySelectorAll("[data-fluss-knoten]");
    var felder = wurzel.querySelectorAll("[data-fluss-feld]");
    if (!knoten.length || knoten.length !== felder.length) return;
    function waehle(nr, fokus) {
      Array.prototype.forEach.call(knoten, function (k) {
        var an = k.getAttribute("data-fluss-knoten") === nr;
        k.setAttribute("aria-pressed", an ? "true" : "false");
        if (an && fokus) k.focus();
      });
      Array.prototype.forEach.call(felder, function (f) { f.hidden = f.getAttribute("data-fluss-feld") !== nr; });
    }
    Array.prototype.forEach.call(knoten, function (k, i) {
      k.addEventListener("click", function () { waehle(k.getAttribute("data-fluss-knoten")); });
      k.addEventListener("keydown", function (e) {
        var ziel = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") ziel = (i + 1) % knoten.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") ziel = (i - 1 + knoten.length) % knoten.length;
        if (ziel === null) return;
        e.preventDefault();
        waehle(knoten[ziel].getAttribute("data-fluss-knoten"), true);
      });
    });
    waehle("1");
  }

  function initFilter(wurzel) {
    var knoepfe = wurzel.querySelectorAll("[data-filter-wert]");
    var zeilen = wurzel.querySelectorAll("[data-status]");
    Array.prototype.forEach.call(knoepfe, function (k) {
      k.addEventListener("click", function () {
        var wert = k.getAttribute("data-filter-wert");
        Array.prototype.forEach.call(knoepfe, function (n) { n.setAttribute("aria-pressed", n === k ? "true" : "false"); });
        Array.prototype.forEach.call(zeilen, function (z) { z.hidden = wert !== "" && z.getAttribute("data-status") !== wert; });
      });
    });
  }

  function start() {
    jeder("[data-pruefliste]", initPruefliste);
    jeder("[data-fluss]", initFluss);
    jeder("[data-filter]", initFilter);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
