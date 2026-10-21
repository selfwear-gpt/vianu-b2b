/*
  Roddys Weg. Schnittstelle: Elemente mit [data-roddy] arbeiten für sich. Benötigt fortschritt.js.
  Fünf Szenen stehen im Wechsel auf einer Bühne, die beim Scrollen stehen bleibt (sticky). Mit jeder Szene füllt sich eine Zone des Fußabdrucks,
  bei der letzten der ganze Fuß. Die Bewegung hängt am Scrollen und läuft rückwärts mit. Ohne Skript, bei reduzierter Bewegung
  und wenn die Bühne nicht ins Fenster passt, stehen alle Szenen untereinander und der Fuß ist ganz gefüllt.
*/
(function () {
  var reduziert = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KOPF = 80;

  function init(huelle) {
    var F = window.VianuFortschritt;
    var buehne = huelle.querySelector(".roddy__stage");
    var szenen = huelle.querySelectorAll("[data-roddy-szene]");
    var zonen = huelle.querySelectorAll("[data-roddy-zone]");
    var fuss = huelle.querySelector(".roddy__fuss");
    if (!F || !buehne || !szenen.length || reduziert) return;

    var aktiv = -1;
    function zeige(nr) {
      if (nr === aktiv) return;
      aktiv = nr;
      Array.prototype.forEach.call(szenen, function (s, i) {
        if (i === nr) s.setAttribute("data-aktiv", "");
        else s.removeAttribute("data-aktiv");
      });
      var letzte = nr === szenen.length - 1;
      Array.prototype.forEach.call(zonen, function (z) {
        var zone = Number(z.getAttribute("data-roddy-zone"));
        if (letzte || zone <= nr + 1) z.setAttribute("data-an", "");
        else z.removeAttribute("data-an");
      });
      if (fuss) {
        if (letzte) fuss.setAttribute("data-fertig", "");
        else fuss.removeAttribute("data-fertig");
      }
    }
    function passt() {
      return window.innerHeight - KOPF >= buehne.offsetHeight + 16;
    }
    var geplant = false;
    function aktualisiere() {
      geplant = false;
      // Gemessen wird im Zustand "bereit": Dann liegen alle Szenen übereinander und die Bühne hat ihre kleinste Höhe
      huelle.setAttribute("data-bereit", "");
      if (!passt()) {
        huelle.removeAttribute("data-bereit");
        huelle.removeAttribute("data-haelt");
        aktiv = -1;
        return;
      }
      huelle.setAttribute("data-haelt", "");
      var h = huelle.getBoundingClientRect();
      var strecke = h.height - buehne.offsetHeight;
      var anteil = strecke > 0 ? (KOPF - h.top) / strecke : 1;
      zeige(F.aktiverSchritt(Math.max(0, Math.min(1, anteil)), szenen.length));
    }
    function planen() {
      if (!geplant) {
        geplant = true;
        window.requestAnimationFrame(aktualisiere);
      }
    }
    window.addEventListener("scroll", planen, { passive: true });
    window.addEventListener("resize", planen);
    aktualisiere();
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-roddy]"), init);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
