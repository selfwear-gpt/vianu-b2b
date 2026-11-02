/*
  Alles in einer Sohle. Schnittstelle: Elemente mit [data-werte] arbeiten für sich.
  Die Überschriften (Karten mit [data-wert]) stehen immer da. Die Beschreibung klappt das CSS auf, wenn eine Karte, ihre Linie oder ihr Punkt
  überfahren oder die Karte per Tastatur fokussiert wird. Das Skript fügt nur das Antippen auf Touchgeräten hinzu: Ein Tippen klappt die Karte auf,
  eine andere Karte oder ein zweites Tippen klappt sie wieder zu. Es ist immer nur eine Karte offen. Ohne Skript bleibt alles lesbar,
  die Karten öffnen dann per Hover und Fokus.
*/
(function () {
  function init(huelle) {
    var karten = Array.prototype.slice.call(huelle.querySelectorAll("[data-wert]"));
    karten.forEach(function (k) {
      k.addEventListener("click", function () {
        // Mit Maus öffnet das Überfahren, nur auf Touchgeräten zählt das Tippen
        if (!window.matchMedia("(hover: none)").matches) return;
        var an = k.getAttribute("data-fix") !== "true";
        karten.forEach(function (andere) { andere.removeAttribute("data-fix"); });
        if (an) k.setAttribute("data-fix", "true");
      });
    });
  }
  function start() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-werte]"), function (h) {
      try { init(h); } catch (fehler) { if (window.console) window.console.error(fehler); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
