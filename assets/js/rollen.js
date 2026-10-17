/*
  Interaktionen der Rollenseiten. Schnittstelle: Elemente mit [data-weg] arbeiten für sich (Matte und Weg).
  Benötigt fortschritt.js. Ohne Skript steht der Grundriss mit der gepunkteten Linie und allen Beschriftungen fertig da.
  Die Beschriftungen [data-weg-etiketten] poppen an ihrer Station auf, solange die Fußspuren dort sind, und verschwinden beim Weiterscrollen.
  Die Bewegung hängt am Scrollen, läuft beim Zurückscrollen rückwärts und steht bei reduzierter Bewegung fertig.
*/
(function () {
  var reduziert = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";
  var PUNKTE = 70;
  var SPUREN = 14;

  function initWeg(wurzel) {
    var pfad = wurzel.querySelector("[data-weg-pfad]");
    var gruppe = wurzel.querySelector("[data-weg-spuren]");
    var vorlage = wurzel.querySelector("[data-weg-fuss]");
    var F = window.VianuFortschritt;
    if (!pfad || !gruppe || !vorlage || !pfad.getTotalLength || !F) return;

    var laenge = pfad.getTotalLength();
    var teile = [];
    var stationen = [];
    var etiketten = wurzel.querySelectorAll("[data-weg-etiketten] > *");

    function punktAn(anteil) {
      return pfad.getPointAtLength(laenge * anteil);
    }
    // Gepunktete Linie: viele kleine Punkte entlang des Weges
    for (var i = 0; i < PUNKTE; i++) {
      var p = punktAn(i / (PUNKTE - 1));
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", p.x.toFixed(1));
      c.setAttribute("cy", p.y.toFixed(1));
      c.setAttribute("r", "2");
      c.setAttribute("class", "weg__punkt");
      gruppe.appendChild(c);
      teile.push({ el: c, ab: i / PUNKTE });
    }
    // Fußspuren: Kopien der Vorlage, ausgerichtet an der Richtung des Weges
    for (var j = 0; j < SPUREN; j++) {
      var a = (j + 0.5) / SPUREN;
      var p0 = punktAn(Math.max(0, a - 0.01));
      var p1 = punktAn(Math.min(1, a + 0.01));
      var winkel = (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI + 90;
      var versatz = j % 2 ? 7 : -7;
      var breite = Number(vorlage.getAttribute("width")) || 7;
      var hoehe = Number(vorlage.getAttribute("height")) || 18;
      var u = punktAn(a);
      var spur = vorlage.cloneNode(false);
      spur.removeAttribute("data-weg-fuss");
      spur.setAttribute("class", "weg__spur");
      spur.setAttribute("transform", "translate(" + u.x.toFixed(1) + " " + u.y.toFixed(1) + ") rotate(" + winkel.toFixed(1) + ") translate(" + (versatz - breite / 2) + " " + (-hoehe / 2) + ")" + (j % 2 ? " translate(" + breite + " 0) scale(-1 1)" : ""));
      gruppe.appendChild(spur);
      teile.push({ el: spur, ab: a });
    }
    // Stationen: Jeder Kreis erscheint, wenn der Weg ihn erreicht. Seine Stelle auf dem Weg ist der nächste Punkt der Linie.
    Array.prototype.forEach.call(wurzel.querySelectorAll("[data-weg-stationen] circle"), function (kreis, nr) {
      var kx = Number(kreis.getAttribute("cx"));
      var ky = Number(kreis.getAttribute("cy"));
      var bester = 0;
      var abstand = Infinity;
      for (var k = 0; k <= 400; k++) {
        var q = punktAn(k / 400);
        var d = (q.x - kx) * (q.x - kx) + (q.y - ky) * (q.y - ky);
        if (d < abstand) {
          abstand = d;
          bester = k / 400;
        }
      }
      teile.push({ el: kreis, ab: Math.max(0, bester - 0.02) });
      stationen.push({ ab: Math.max(0, bester - 0.02), nr: nr });
    });
    // Reihenfolge entlang des Weges: Die Anzahl der sichtbaren Teile folgt dem Scrollstand
    teile.sort(function (x, y) { return x.ab - y.ab; });

    // Beschriftung einer Station: sichtbar, solange die nächsten FENSTER Teile des Weges gerade gezeigt werden
    var FENSTER = 16;
    stationen.forEach(function (st) {
      st.von = teile.filter(function (t) { return t.ab < st.ab; }).length;
    });
    function zeigeEtiketten(n) {
      stationen.forEach(function (st, i) {
        var el = etiketten[st.nr];
        if (!el) return;
        var an = n > st.von && (i === stationen.length - 1 || n <= st.von + FENSTER);
        if (an) el.removeAttribute("data-aus");
        else el.setAttribute("data-aus", "");
      });
    }

    var sichtbar = -1;
    function zeige(anteil) {
      var n = F.sichtbareAnzahl(anteil, teile.length);
      if (n === sichtbar) return;
      sichtbar = n;
      teile.forEach(function (t, index) {
        if (index < n) t.el.removeAttribute("data-aus");
        else t.el.setAttribute("data-aus", "");
      });
      zeigeEtiketten(n);
    }

    if (reduziert) {
      zeige(1);
      Array.prototype.forEach.call(etiketten, function (el) { el.removeAttribute("data-aus"); });
      return;
    }
    var geplant = false;
    function aktualisiere() {
      geplant = false;
      var r = wurzel.getBoundingClientRect();
      var f = F.fortschrittImBild(r.top, r.height, window.innerHeight);
      zeige(Math.min(1, f / 0.7));
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
    Array.prototype.forEach.call(document.querySelectorAll("[data-weg]"), initWeg);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
