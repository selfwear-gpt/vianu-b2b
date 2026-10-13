/*
  Interaktionen der Mitarbeitenden-Seite. Jedes Modul arbeitet über Datenattribute und nur innerhalb
  seines Bereichs: initTeilen, initWerte, initName, initTag, initMail. Der Ablauf liegt in ablauf.js.
  Benötigt name.js (VianuName) und teilen.js (VianuTeilen). Ohne Skript bleibt der Inhalt lesbar.
*/
(function () {
  var reduziert = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function jeder(selektor, wurzel, fn) {
    Array.prototype.forEach.call((wurzel || document).querySelectorAll(selektor), fn);
  }

  /* ---------- Teilen ---------- */
  function kopiere(text, status, linkFeld, meldung) {
    function geklappt() {
      status.textContent = meldung;
      if (linkFeld) linkFeld.hidden = true;
    }
    function nichtGeklappt() {
      if (linkFeld) {
        linkFeld.hidden = false;
        linkFeld.value = text;
        linkFeld.focus();
        linkFeld.select();
      }
      status.textContent = "Kopieren hat nicht geklappt. Der Link steht unten, kopiere ihn von Hand.";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(geklappt, nichtGeklappt);
    } else {
      nichtGeklappt();
    }
  }

  function initTeilen(wurzel) {
    var knopf = wurzel.querySelector("[data-teilen-knopf]");
    var panel = document.getElementById(knopf.getAttribute("aria-controls"));
    var liste = wurzel.querySelector("[data-teilen-rollen]");
    var kollegen = wurzel.querySelector("[data-teilen-kollegen]");
    var status = wurzel.querySelector("[data-teilen-status]");
    var linkFeld = wurzel.querySelector("[data-teilen-link]");
    if (!knopf || !panel || !liste || !kollegen || !status || !window.VianuTeilen) return;

    window.VianuTeilen.ROLLEN.forEach(function (rolle) {
      var li = document.createElement("li");
      var b = document.createElement("button");
      b.type = "button";
      b.className = "teilen__aktion";
      b.textContent = rolle.name;
      b.addEventListener("click", function () {
        var link = window.VianuTeilen.linkFuerRolle(document.baseURI, rolle.id);
        kopiere(link, status, linkFeld, "Link für " + rolle.name + " kopiert.");
      });
      li.appendChild(b);
      liste.appendChild(li);
    });

    kollegen.addEventListener("click", function () {
      kopiere(window.VianuTeilen.linkFuerKollegen(document.baseURI), status, linkFeld, "Link kopiert.");
    });

    function setze(offen) {
      knopf.setAttribute("aria-expanded", offen ? "true" : "false");
      panel.hidden = !offen;
      if (!offen) {
        status.textContent = "";
        if (linkFeld) linkFeld.hidden = true;
      }
    }
    setze(false);

    knopf.addEventListener("click", function () {
      var offen = knopf.getAttribute("aria-expanded") !== "true";
      setze(offen);
      if (offen) panel.querySelector("button").focus();
    });
    wurzel.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) {
        setze(false);
        knopf.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (panel.hidden || wurzel.contains(e.target) || e.target.closest("[data-teilen-oeffnen]")) return;
      setze(false);
    });

    // Knöpfe an anderen Stellen der Seite öffnen das Teilen-Menü
    var seite = wurzel.closest("[data-seite]") || document;
    jeder("[data-teilen-oeffnen]", seite, function (b) {
      b.addEventListener("click", function () {
        setze(true);
        panel.querySelector("button").focus();
      });
    });
  }

  /* ---------- Namenssohle ---------- */
  function initName(wurzel) {
    var feld = wurzel.querySelector("[data-name-feld]");
    var texte = wurzel.querySelectorAll("[data-name-text]");
    var ansage = wurzel.querySelector("[data-name-ansage]");
    if (!feld || !texte.length || !window.VianuName) return;

    var BASIS = 40;
    var MAX_BREITE = 190;
    var timer = null;

    function zeige(name) {
      var leer = name === "";
      Array.prototype.forEach.call(texte, function (t) {
        t.textContent = leer ? "Anna" : name;
        t.setAttribute("data-leer", leer ? "true" : "false");
        t.style.fontSize = BASIS + "px";
      });
      var breite = texte[0].getComputedTextLength ? texte[0].getComputedTextLength() : 0;
      if (breite > MAX_BREITE) {
        var klein = (BASIS * MAX_BREITE) / breite;
        Array.prototype.forEach.call(texte, function (t) { t.style.fontSize = klein + "px"; });
      }
      if (!reduziert && !leer) {
        Array.prototype.forEach.call(texte, function (t) {
          t.classList.remove("sohle__name--druck");
          void t.getBoundingClientRect();
          t.classList.add("sohle__name--druck");
        });
      }
      if (ansage) {
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          ansage.textContent = leer ? "" : "Deine Sohle zeigt: " + name;
        }, 500);
      }
    }

    feld.addEventListener("input", function () {
      var sauber = window.VianuName.bereinigeName(feld.value);
      if (sauber !== feld.value) feld.value = sauber;
      zeige(sauber);
    });
    zeige(window.VianuName.bereinigeName(feld.value));
  }

  /* ---------- Ein Tag im Schichtbetrieb ---------- */
  function initTag(wurzel) {
    var momente = wurzel.querySelectorAll("[data-moment]");
    var zeiger = wurzel.querySelector("[data-uhr-zeiger]");
    var stand = wurzel.querySelector("[data-tag-stand]");
    if (!momente.length) return;

    // Die Momente mit Uhrzeit (data-stunde) legen den Weg des Zeigers fest: erster Moment bis letzter Moment
    var mitZeit = Array.prototype.filter.call(momente, function (m) { return m.hasAttribute("data-stunde"); });
    var von = mitZeit[0];
    var bis = mitZeit[mitZeit.length - 1];
    var fortschritt = window.VianuFortschritt;
    var geplant = false;

    function mitteVon(el) {
      var r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    }
    function aktualisiere() {
      geplant = false;
      var mitte = window.innerHeight / 2;
      var naechster = momente[0];
      var abstand = Infinity;
      Array.prototype.forEach.call(momente, function (m) {
        var d = Math.abs(mitteVon(m) - mitte);
        if (d < abstand) {
          abstand = d;
          naechster = m;
        }
      });
      Array.prototype.forEach.call(momente, function (m) {
        m.setAttribute("data-aktiv", m === naechster ? "true" : "false");
      });
      if (stand) {
        var zeit = naechster.getAttribute("data-zeit");
        stand.textContent = (naechster.getAttribute("data-titel") || "") + (zeit ? " · " + zeit : "");
      }
      if (zeiger && !reduziert && fortschritt && von && bis) {
        var anteil = fortschritt.anteilZwischen(mitte, mitteVon(von), mitteVon(bis));
        var winkel = fortschritt.zeigerWinkel(anteil, Number(von.getAttribute("data-stunde")), Number(bis.getAttribute("data-stunde")));
        zeiger.style.setProperty("--winkel", winkel + "deg");
      }
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

  /* ---------- Werte: Kacheln drehen sich ---------- */
  function initWerte(wurzel) {
    var kacheln = wurzel.querySelectorAll("[data-wert]");
    var breit = window.matchMedia("(min-width: 56.01rem)");

    // Fokus und damit die Drehung gibt es nur dort, wo sich die Kachel dreht. Auf dem Handy stehen beide Seiten untereinander.
    function setzeFokus() {
      Array.prototype.forEach.call(kacheln, function (k) {
        if (breit.matches) k.setAttribute("tabindex", "0");
        else k.removeAttribute("tabindex");
      });
    }
    setzeFokus();
    breit.addEventListener("change", setzeFokus);

    // Hover und Fokus drehen per CSS. Ein Tippen dreht die Kachel um und wieder zurück. "false" hebt auch ein
    // hängendes :hover auf Touchgeräten auf. Ob ein Gerät Hover kennt, wird bei jedem Tippen neu gelesen.
    Array.prototype.forEach.call(kacheln, function (k) {
      k.addEventListener("click", function (e) {
        var touch = window.matchMedia("(hover: none)").matches || e.pointerType === "touch";
        if (!touch) return;
        var an = k.getAttribute("data-gedreht") !== "true";
        Array.prototype.forEach.call(kacheln, function (andere) { andere.setAttribute("data-gedreht", "false"); });
        k.setAttribute("data-gedreht", an ? "true" : "false");
      });
    });
  }

  /* ---------- Mailvorlage ---------- */
  function initMail(wurzel) {
    var knopf = wurzel.querySelector("[data-mail-kopieren]");
    var box = wurzel.querySelector("[data-mail-text]");
    var status = wurzel.querySelector("[data-mail-status]");
    if (!knopf || !box || !status || !window.VianuTeilen) return;

    knopf.addEventListener("click", function () {
      var b2b = new URL("b2b/", window.VianuTeilen.linkFuerKollegen(document.baseURI)).href;
      var text = box.textContent.replace("[Link zur Seite]", b2b);
      function geklappt() { status.textContent = "Text kopiert."; }
      function nichtGeklappt() {
        var bereich = document.createRange();
        bereich.selectNodeContents(box);
        var auswahl = window.getSelection();
        auswahl.removeAllRanges();
        auswahl.addRange(bereich);
        status.textContent = "Kopieren hat nicht geklappt. Der Text ist markiert, kopiere ihn von Hand.";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(geklappt, nichtGeklappt);
      else nichtGeklappt();
    });
  }

  function start() {
    jeder("[data-teilen]", document, initTeilen);
    jeder(".werte", document, initWerte);
    jeder("[data-name]", document, initName);
    jeder("[data-tag]", document, initTag);
    jeder("[data-mail]", document, initMail);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
