/*
  Alles in einer Sohle. Schnittstelle: Elemente mit [data-werte] arbeiten für sich. Benötigt fortschritt.js.
  Die Überschriften (Karten mit [data-wert]) stehen immer da. Die Beschreibung klappt das CSS auf, wenn eine Karte überfahren,
  fokussiert oder angetippt wird. Das Skript fügt die Bühne hinzu: Der Abschnitt bleibt beim Scrollen stehen, und mit dem Scrollen
  wird eine Karte nach der anderen aktiv (data-aktiv). Der Fortschritt ist umkehrbar. Ohne Skript, bei reduzierter Bewegung, auf dem
  Handy und wenn die Bühne nicht ins Fenster passt, bleibt es bei Überschriften mit Aufklappen per Hover, Fokus und Tippen.
*/
(function () {
  var KOPF = 80;

  function init(huelle) {
    var F = window.VianuFortschritt;
    var buehne = huelle.querySelector(".werte__stage");
    var karten = Array.prototype.slice.call(huelle.querySelectorAll("[data-wert]"));
    if (!buehne || !karten.length) return;

    // Ein Tippen oder Klick hält eine Karte offen, bis eine andere gewählt wird oder das Scrollen eine neue aktiv setzt
    karten.forEach(function (k) {
      k.addEventListener("click", function () {
        var an = k.getAttribute("data-fix") !== "true";
        karten.forEach(function (andere) { andere.removeAttribute("data-fix"); });
        if (an) k.setAttribute("data-fix", "true");
      });
    });

    var ruhig = window.matchMedia("(prefers-reduced-motion: reduce)");
    var breit = window.matchMedia("(min-width: 56.01rem)");
    if (!F) return;

    var aktiv = -1;
    function setzeAktiv(nr) {
      if (nr === aktiv) return;
      aktiv = nr;
      karten.forEach(function (k, i) {
        if (i === nr) k.setAttribute("data-aktiv", "true");
        else k.removeAttribute("data-aktiv");
        k.removeAttribute("data-fix");
      });
    }
    function passt() {
      // Ein eingebettetes Fenster in voller Inhaltshöhe (innerHeight im Tausenderbereich) scrollt nicht selbst, dort gibt es keine Bühne
      return window.innerHeight <= 2000 && window.innerHeight - KOPF >= buehne.offsetHeight + 16;
    }
    // Die Karten stehen in zwei Spalten, im Scrollablauf von oben links nach unten und dann rechts oben nach unten
    function aus() {
      huelle.removeAttribute("data-haelt");
      setzeAktiv(-1);
    }
    var geplant = false;
    function aktualisiere() {
      geplant = false;
      if (ruhig.matches || !breit.matches || !passt()) { aus(); return; }
      huelle.setAttribute("data-haelt", "");
      // Die Bühne bleibt senkrecht mittig im Raum unter der Menüleiste stehen
      var oben = Math.max(KOPF, Math.round((window.innerHeight + KOPF - buehne.offsetHeight) / 2));
      huelle.style.setProperty("--werte-oben", oben + "px");
      var h = huelle.getBoundingClientRect();
      var strecke = h.height - buehne.offsetHeight;
      var anteil = strecke > 0 ? (oben - h.top) / strecke : 1;
      var a = Math.max(0, Math.min(1, anteil));
      setzeAktiv(F.aktiverSchritt(a, karten.length));
    }
    function planen() {
      if (!geplant) {
        geplant = true;
        window.requestAnimationFrame(aktualisiere);
      }
    }
    window.addEventListener("scroll", planen, { passive: true });
    window.addEventListener("resize", planen);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(planen);
    aktualisiere();
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-werte]"), function (h) {
      try { init(h); } catch (fehler) { if (window.console) window.console.error(fehler); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
