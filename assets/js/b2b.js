/*
  Interaktionen der B2B-Startseite. Jedes Modul arbeitet über Datenattribute und nur innerhalb seines Bereichs:
  initDruckkarte, initKlein, initSorgen, initRechner, initFormular, initWeiterleiten.
  Benötigt fortschritt.js, kosten.js und formular.js. Ohne Skript bleibt der Inhalt lesbar (Ruhezustände).
  Bewegungen hängen am Scrollen, laufen beim Zurückscrollen rückwärts und stehen bei reduzierter Bewegung
  im Endzustand.
*/
(function () {
  var reduziert = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NS = "http://www.w3.org/2000/svg";

  function jeder(selektor, wurzel, fn) {
    Array.prototype.forEach.call((wurzel || document).querySelectorAll(selektor), fn);
  }

  // Ruft fn bei Scroll und Größenänderung höchstens einmal je Bild auf
  function beiScroll(fn) {
    var geplant = false;
    function lauf() {
      geplant = false;
      fn();
    }
    function planen() {
      if (!geplant) {
        geplant = true;
        window.requestAnimationFrame(lauf);
      }
    }
    window.addEventListener("scroll", planen, { passive: true });
    window.addEventListener("resize", planen);
    fn();
  }

  function punkt(cx, cy, r, klasse) {
    var c = document.createElementNS(NS, "circle");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    c.setAttribute("r", r);
    c.setAttribute("class", klasse);
    return c;
  }

  // Kleine, feste Zufallsfolge, damit die Karte bei jedem Laden gleich aussieht
  function zufall(start) {
    var s = start;
    return function () {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
  }

  /* ---------- Druckkarte ---------- */
  function initDruckkarte(wurzel) {
    var svg = wurzel.querySelector("svg");
    var umriss = wurzel.querySelector("[data-druck-umriss]");
    var gruppe = wurzel.querySelector("[data-druck-punkte]");
    if (!svg || !umriss || !gruppe || !window.VianuFortschritt || !umriss.isPointInFill) return;

    function last(x, y) {
      function glocke(mx, my, sx, sy, a) {
        var dx = (x - mx) / sx;
        var dy = (y - my) / sy;
        return a * Math.exp(-(dx * dx + dy * dy) / 2);
      }
      return 0.1 + glocke(50, 212, 26, 30, 1) + glocke(38, 84, 24, 26, 0.8) + glocke(40, 28, 14, 14, 0.45);
    }

    var zufallswert = zufall(7);
    var liste = [];
    for (var y = 8; y < 256; y += 7) {
      for (var x = 8; x < 96; x += 7) {
        var px = x + (Math.floor((y - 8) / 7) % 2 ? 3.5 : 0);
        if (!umriss.isPointInFill(new DOMPoint(px, y))) continue;
        var w = Math.min(1, last(px, y) / 1.15);
        liste.push({ x: px, y: y, w: w, schluessel: w + zufallswert() * 0.45 });
      }
    }
    // Niedrige Last zuerst, die Spitze der Belastung zuletzt
    liste.sort(function (a, b) { return a.schluessel - b.schluessel; });
    var kreise = liste.map(function (p) {
      var c = punkt(p.x.toFixed(1), p.y, (0.9 + 2.3 * p.w).toFixed(2), "druck__punkt" + (p.w > 0.82 ? " druck__punkt--spitze" : ""));
      gruppe.appendChild(c);
      return c;
    });

    var sichtbar = -1;
    function zeige(anzahl) {
      if (anzahl === sichtbar) return;
      for (var i = 0; i < kreise.length; i++) {
        if (i < anzahl) kreise[i].removeAttribute("data-aus");
        else kreise[i].setAttribute("data-aus", "");
      }
      sichtbar = anzahl;
    }

    if (reduziert) {
      zeige(kreise.length);
      return;
    }
    beiScroll(function () {
      var r = wurzel.getBoundingClientRect();
      var f = window.VianuFortschritt.fortschrittImBild(r.top, r.height, window.innerHeight);
      zeige(window.VianuFortschritt.sichtbareAnzahl(Math.min(1, f / 0.65), kreise.length));
    });
  }

  /* ---------- Klein starten ---------- */
  function initKlein(wurzel) {
    var svg = wurzel.querySelector("[data-klein-bild]");
    var stufen = wurzel.querySelectorAll("[data-klein-stufe]");
    if (!svg || !stufen.length || !window.VianuFortschritt) return;

    // Stufe 0: zehn Punkte. Stufe 1 und 2: Gruppen aus Punkten, die anwachsen (Schema, keine Planung)
    var gruppen = [
      { stufe: 0, x0: 35, y0: 38, spalten: 5, zeilen: 2, abstand: 13 },
      { stufe: 1, x0: 154, y0: 24, spalten: 5, zeilen: 4, abstand: 13 },
      { stufe: 1, x0: 154, y0: 84, spalten: 5, zeilen: 2, abstand: 13 },
      { stufe: 2, x0: 258, y0: 12, spalten: 4, zeilen: 3, abstand: 13 },
      { stufe: 2, x0: 312, y0: 12, spalten: 4, zeilen: 3, abstand: 13 },
      { stufe: 2, x0: 258, y0: 66, spalten: 4, zeilen: 3, abstand: 13 },
      { stufe: 2, x0: 312, y0: 66, spalten: 4, zeilen: 3, abstand: 13 }
    ];
    gruppen.forEach(function (g) {
      for (var z = 0; z < g.zeilen; z++) {
        for (var s = 0; s < g.spalten; s++) {
          svg.appendChild(punkt(g.x0 + s * g.abstand, g.y0 + z * g.abstand, 4.2, "klein__punkt klein__punkt--s" + g.stufe));
        }
      }
    });

    function setze(stufe) {
      wurzel.setAttribute("data-stufe", String(stufe));
      Array.prototype.forEach.call(stufen, function (el, i) {
        el.setAttribute("data-aktiv", i <= stufe ? "true" : "false");
      });
    }
    if (reduziert) {
      setze(stufen.length - 1);
      return;
    }
    beiScroll(function () {
      var r = wurzel.getBoundingClientRect();
      var f = window.VianuFortschritt.fortschrittImBild(r.top, r.height, window.innerHeight);
      setze(window.VianuFortschritt.aktiverSchritt(Math.min(1, f / 0.7), stufen.length));
    });
  }

  /* ---------- Sorgen und Bedenken ---------- */
  function initSorgen(wurzel) {
    var kacheln = wurzel.querySelectorAll("[data-sorge]");
    var zonen = wurzel.querySelectorAll("[data-zone]");
    var punkte = wurzel.querySelectorAll("[data-sorgen-punkt]");
    var liste = wurzel.querySelector("[data-sorgen-liste]");
    if (!kacheln.length || !liste || !window.VianuFortschritt) return;
    var handy = window.matchMedia("(max-width: 56rem)");

    function setzeAktiv(i) {
      Array.prototype.forEach.call(kacheln, function (k, n) { k.setAttribute("data-aktiv", n === i ? "true" : "false"); });
      Array.prototype.forEach.call(zonen, function (z, n) { z.setAttribute("data-aktiv", n === i ? "true" : "false"); });
      Array.prototype.forEach.call(punkte, function (p, n) {
        if (n === i) p.setAttribute("aria-current", "true");
        else p.removeAttribute("aria-current");
      });
    }
    function springe(i) {
      kacheln[i].scrollIntoView({ block: "center", behavior: reduziert ? "auto" : "smooth" });
    }

    // Mit Maus oder Tastatur (Computer): Hover und Fokus drehen die Kachel
    Array.prototype.forEach.call(kacheln, function (k, i) {
      k.addEventListener("mouseenter", function () { if (!handy.matches) setzeAktiv(i); });
      k.addEventListener("mouseleave", function () { if (!handy.matches) setzeAktiv(-1); });
      k.addEventListener("focus", function () { setzeAktiv(i); });
      k.addEventListener("blur", function () { if (!handy.matches) setzeAktiv(-1); });
    });
    Array.prototype.forEach.call(zonen, function (z, i) { z.addEventListener("click", function () { springe(i); }); });
    Array.prototype.forEach.call(punkte, function (p, i) { p.addEventListener("click", function () { springe(i); }); });

    // Auf dem Handy: Beim Scrollen leuchten die Zonen nacheinander auf
    function beimScrollen() {
      if (!handy.matches) return;
      var r = liste.getBoundingClientRect();
      var f = (window.innerHeight * 0.55 - r.top) / r.height;
      setzeAktiv(window.VianuFortschritt.aktiverSchritt(f, kacheln.length));
    }
    beiScroll(beimScrollen);
    handy.addEventListener("change", function () { setzeAktiv(handy.matches ? 0 : -1); beimScrollen(); });
    if (!handy.matches) setzeAktiv(-1);
  }

  /* ---------- Kostenrechner ---------- */
  function initRechner(wurzel) {
    var regler = wurzel.querySelector("[data-rechner-regler]");
    var zahl = wurzel.querySelector("[data-rechner-zahl]");
    var ergebnis = wurzel.querySelector("[data-rechner-ergebnis]");
    var text = wurzel.querySelector("[data-rechner-text]");
    if (!regler || !zahl || !ergebnis || !text || !window.VianuKosten) return;
    var PREIS = 120;

    function rechne() {
      var n = window.VianuKosten.begrenzeSchichten(regler.value);
      var k = window.VianuKosten.kostenJeSchicht(PREIS, n);
      if (!k) return;
      zahl.textContent = String(n);
      ergebnis.textContent = k.text;
      text.textContent = PREIS + " Euro je Paar geteilt durch " + n + " Schichten";
    }
    regler.addEventListener("input", rechne);
    rechne();
  }

  /* ---------- Pilotformular ---------- */
  function kopierenMit(text, status, ok, fehler) {
    function nicht() { status.textContent = fehler; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { status.textContent = ok; }, nicht);
    } else {
      nicht();
    }
  }

  function initFormular(wurzel) {
    if (!window.VianuFormular) return;
    var ergebnis = wurzel.querySelector("[data-formular-ergebnis]");
    var textfeld = wurzel.querySelector("[data-formular-text]");
    var kopieren = wurzel.querySelector("[data-formular-kopieren]");
    var status = wurzel.querySelector("[data-formular-status]");
    var felder = {};
    var fehler = {};
    jeder("[data-feld]", wurzel, function (f) { felder[f.getAttribute("data-feld")] = f; });
    jeder("[data-fehler]", wurzel, function (f) { fehler[f.getAttribute("data-fehler")] = f; });

    function daten() {
      return {
        unternehmen: felder.unternehmen.value,
        rolle: felder.rolle.value,
        mitarbeitende: felder.mitarbeitende.value,
        einwilligung: felder.einwilligung.checked
      };
    }
    function zeigeFehler(r) {
      var erstes = null;
      Object.keys(felder).forEach(function (name) {
        var meldung = r.fehler[name];
        fehler[name].hidden = !meldung;
        fehler[name].textContent = meldung || "";
        if (meldung) {
          felder[name].setAttribute("aria-invalid", "true");
          if (!erstes) erstes = felder[name];
        } else {
          felder[name].removeAttribute("aria-invalid");
        }
      });
      return erstes;
    }

    wurzel.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = daten();
      var r = window.VianuFormular.pruefeAnfrage(d);
      var erstes = zeigeFehler(r);
      if (!r.ok) {
        ergebnis.hidden = true;
        if (erstes) erstes.focus();
        return;
      }
      textfeld.textContent = window.VianuFormular.anfrageAlsText(d);
      status.textContent = "";
      ergebnis.hidden = false;
      ergebnis.focus();
    });
    Object.keys(felder).forEach(function (name) {
      felder[name].addEventListener("input", function () {
        if (fehler[name] && !fehler[name].hidden) {
          fehler[name].hidden = true;
          felder[name].removeAttribute("aria-invalid");
        }
      });
    });
    if (kopieren) {
      kopieren.addEventListener("click", function () {
        kopierenMit(textfeld.textContent, status, "Text kopiert.", "Kopieren hat nicht geklappt. Markieren Sie den Text und kopieren Sie ihn von Hand.");
      });
    }
  }

  /* ---------- Weiterleiten ---------- */
  function initWeiterleiten(wurzel) {
    var knopf = wurzel.querySelector("[data-weiterleiten-kopieren]");
    var status = wurzel.querySelector("[data-weiterleiten-status]");
    var feld = wurzel.querySelector("[data-weiterleiten-link]");
    if (!knopf || !status) return;
    knopf.addEventListener("click", function () {
      var link = new URL(".", document.baseURI).href;
      function nicht() {
        if (feld) {
          feld.hidden = false;
          feld.value = link;
          feld.focus();
          feld.select();
        }
        status.textContent = "Kopieren hat nicht geklappt. Der Link steht unten, kopieren Sie ihn von Hand.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(function () {
          status.textContent = "Link kopiert.";
          if (feld) feld.hidden = true;
        }, nicht);
      } else {
        nicht();
      }
    });
  }

  function start() {
    jeder("[data-druckkarte]", document, initDruckkarte);
    jeder("[data-klein]", document, initKlein);
    jeder("[data-sorgen]", document, initSorgen);
    jeder("[data-rechner]", document, initRechner);
    jeder("[data-formular]", document, initFormular);
    jeder("[data-weiterleiten]", document, initWeiterleiten);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
