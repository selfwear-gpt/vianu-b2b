/*
  Bausteine der Rollenseiten. Schnittstelle: Elemente mit [data-pruefliste], [data-fluss] und [data-filter] arbeiten für sich.
  Prüfliste: Schalter zum Abhaken, nur Ansicht, nichts wird gespeichert. Datenfluss: ein Feld pro Knoten, der gewählte Knoten zeigt seinen Text.
  Filter: blendet Zeilen der Statusliste nach Status ein und aus. Ohne Skript stehen alle Inhalte lesbar da.
  Chat-Brief [data-chat]: die Nachrichten stehen im HTML, das Skript blendet sie beim Scrollen oder per Knopf "Weiter" nacheinander ein, vorher erscheinen Tippen-Punkte.
  Bei reduzierter Bewegung und ohne Skript stehen alle Nachrichten sofort da. Ergebnisbild [data-ergebnis]: der Balken baut sich beim Sichtbarwerden auf.
  Umfrage [data-umfrage]: Antworten sind nur zur Ansicht antippbar, nichts wird gespeichert.
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

  function ruhig() { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }

  function initChat(wurzel) {
    var liste = wurzel.querySelector(".chat__verlauf");
    var buehne = wurzel.querySelector(".chat__buehne");
    var nachrichten = Array.prototype.slice.call(wurzel.querySelectorAll("[data-chat-nachricht]"));
    var weiter = wurzel.querySelector("[data-chat-weiter]");
    var n = nachrichten.length;
    if (!liste || !buehne || !n || ruhig()) return;
    wurzel.classList.add("chat--aktiv");
    wurzel.style.setProperty("--schritte", String(n));
    nachrichten.forEach(function (m) { m.classList.add("chat__nachricht--aus"); });
    var gezeigt = 0, ziel = 0, laeuft = false;

    function fertig() {
      if (gezeigt >= n) wurzel.classList.add("chat--fertig");
    }
    function zeigeNaechste() {
      if (gezeigt >= ziel) { laeuft = false; fertig(); return; }
      laeuft = true;
      var m = nachrichten[gezeigt];
      var tippen = document.createElement("li");
      tippen.className = "chat__tippen chat__tippen--" + (m.classList.contains("chat__nachricht--roderich") ? "roderich" : "rolle");
      tippen.setAttribute("aria-hidden", "true");
      tippen.innerHTML = "<span></span><span></span><span></span>";
      liste.appendChild(tippen);
      window.setTimeout(function () {
        if (tippen.parentNode) tippen.parentNode.removeChild(tippen);
        m.classList.remove("chat__nachricht--aus");
        m.classList.add("chat__nachricht--neu");
        gezeigt++;
        zeigeNaechste();
      }, 850);
    }
    function setzeZiel(z) {
      z = Math.min(z, n);
      if (z > ziel) { ziel = z; if (!laeuft) zeigeNaechste(); }
    }
    // Läuft die Seite in einem Rahmen ohne eigenes Scrollen (zum Beispiel einer Vorschau, die sich auf die volle Höhe streckt),
    // gibt es kein Scroll-Signal. Dann starten die Nachrichten automatisch, sobald der Chat im Bild ist.
    var ohneScroll = false, beobachter = null;
    function scrollt() {
      var d = document.documentElement;
      return d.scrollHeight > (window.innerHeight || d.clientHeight) + 40;
    }
    function beobachte() {
      if (beobachter) return;
      if (!("IntersectionObserver" in window)) { setzeZiel(1); return; }
      beobachter = new IntersectionObserver(function (eintraege) {
        eintraege.forEach(function (e) {
          if (e.isIntersecting) { setzeZiel(n); beobachter.disconnect(); }
        });
      }, { threshold: 0.6 });
      beobachter.observe(buehne);
    }
    function beiScroll() {
      if (!scrollt()) {
        if (!ohneScroll) { ohneScroll = true; wurzel.classList.add("chat--ohnescroll"); }
        beobachte();
        return;
      }
      if (ohneScroll) { ohneScroll = false; wurzel.classList.remove("chat--ohnescroll"); }
      var r = wurzel.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      if (r.top > vh * 0.55) return;
      if (r.bottom < vh) { setzeZiel(n); return; }
      var strecke = r.height - buehne.offsetHeight;
      var p = strecke > 0 ? Math.min(1, Math.max(0, -(r.top - (parseFloat(window.getComputedStyle(buehne).top) || 0)) / strecke)) : 1;
      p = Math.min(1, p / 0.85);
      setzeZiel(1 + Math.floor(p * (n - 1) + 0.001));
    }
    var wartet = false;
    function planeScroll() {
      if (wartet) return;
      wartet = true;
      window.requestAnimationFrame(function () { wartet = false; beiScroll(); });
    }
    window.addEventListener("scroll", planeScroll, { passive: true });
    window.addEventListener("resize", planeScroll);
    window.addEventListener("load", planeScroll);
    buehne.addEventListener("click", function (ev) {
      if (ev.target.closest && ev.target.closest("a, button")) return;
      setzeZiel(Math.max(ziel, 0) + 1);
    });
    if (weiter) weiter.addEventListener("click", function () { setzeZiel(Math.max(ziel, 0) + 1); });
    beiScroll();
  }

  function initErgebnis(wurzel) {
    if (ruhig() || !("IntersectionObserver" in window)) return;
    wurzel.classList.add("ergebnis--bereit");
    var o = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) {
          wurzel.classList.add("ergebnis--zeigt");
          wurzel.classList.remove("ergebnis--bereit");
          o.disconnect();
        }
      });
    }, { threshold: 0.35 });
    o.observe(wurzel);
  }

  function initUmfrage(wurzel) {
    Array.prototype.forEach.call(wurzel.querySelectorAll(".umfrage__frage"), function (frage) {
      var knoepfe = frage.querySelectorAll(".umfrage__antwort");
      Array.prototype.forEach.call(knoepfe, function (k) {
        k.addEventListener("click", function () {
          Array.prototype.forEach.call(knoepfe, function (x) { x.setAttribute("aria-pressed", x === k ? "true" : "false"); });
        });
      });
    });
  }

  function start() {
    jeder("[data-pruefliste]", initPruefliste);
    jeder("[data-fluss]", initFluss);
    jeder("[data-filter]", initFilter);
    jeder("[data-chat]", initChat);
    jeder("[data-ergebnis]", initErgebnis);
    jeder("[data-umfrage]", initUmfrage);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
