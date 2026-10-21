/*
  Roddys Weg. Schnittstelle: Elemente mit [data-roddy] arbeiten für sich. Benötigt fortschritt.js.
  Fünf Szenen stehen im Wechsel auf einer Bühne, die beim Scrollen stehen bleibt (sticky). Der Fußabdruck füllt sich dabei stetig von der Ferse bis zur Zehe,
  am Ende steht der ganze Fuß da. Die Bewegung hängt am Scrollen und läuft rückwärts mit. Ohne Skript, bei reduzierter Bewegung
  und wenn die Bühne nicht ins Fenster passt, stehen alle Szenen untereinander und der Fuß ist ganz gefüllt.
*/
(function () {
  var reduziert = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var KOPF = 80;

  function init(huelle) {
    var F = window.VianuFortschritt;
    var buehne = huelle.querySelector(".roddy__stage");
    var szenen = huelle.querySelectorAll("[data-roddy-szene]");
    var fuss = huelle.querySelector(".roddy__fuss");
    if (!F || !buehne || !szenen.length || reduziert) return;

    var aktiv = -1;
    var fuell = huelle.querySelector("[data-roddy-fuell]");
    var ziel = 0;
    var jetzt = 0;
    var laeuft = false;
    function setzeFuellung(f) {
      if (fuell) {
        fuell.setAttribute("y", (260 * (1 - f)).toFixed(1));
        fuell.setAttribute("height", (260 * f).toFixed(1));
      }
      if (fuss) {
        if (f > 0.97) fuss.setAttribute("data-fertig", "");
        else fuss.removeAttribute("data-fertig");
      }
    }
    // Der Fuß füllt sich stetig von der Ferse nach oben und läuft dem Scrollstand weich hinterher
    function schritt() {
      jetzt += (ziel - jetzt) * 0.1;
      if (Math.abs(ziel - jetzt) < 0.002) jetzt = ziel;
      setzeFuellung(jetzt);
      if (jetzt !== ziel) window.requestAnimationFrame(schritt);
      else laeuft = false;
    }
    function fuelleBis(f) {
      ziel = f;
      if (!laeuft) { laeuft = true; window.requestAnimationFrame(schritt); }
    }
    function zeige(nr) {
      if (nr === aktiv) return;
      aktiv = nr;
      Array.prototype.forEach.call(szenen, function (s, i) {
        if (i === nr) s.setAttribute("data-aktiv", "");
        else s.removeAttribute("data-aktiv");
      });
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
        ziel = jetzt = 0;
        setzeFuellung(1);
        return;
      }
      huelle.setAttribute("data-haelt", "");
      // Die Bühne bleibt senkrecht mittig im Raum unter der Menüleiste stehen
      var oben = Math.max(KOPF, Math.round((window.innerHeight + KOPF - buehne.offsetHeight) / 2));
      huelle.style.setProperty("--roddy-oben", oben + "px");
      var h = huelle.getBoundingClientRect();
      var strecke = h.height - buehne.offsetHeight;
      var anteil = strecke > 0 ? (oben - h.top) / strecke : 1;
      var a = Math.max(0, Math.min(1, anteil));
      zeige(F.aktiverSchritt(a, szenen.length));
      fuelleBis(Math.min(1, a / 0.9));
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
