/*
  Scrollposition beim Neuladen. Schnittstelle: wiederherstellen(navigationstyp), begrenze(y, maximum), mitPosition(zustand, y), position(zustand).
  Die Seite merkt sich ihre Position im Verlaufseintrag des Browsers (history.state) und stellt sie beim Neuladen und beim
  Zurückgehen wieder her. Es wird nichts im Speicher des Browsers abgelegt, auch kein Cookie.
  Neue Aufrufe und Anker verhalten sich wie bisher.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuPosition = factory();
})(this, function () {
  var FELD = "vianuY";
  function wiederherstellen(typ) { return typ === "reload" || typ === "back_forward"; }
  function begrenze(y, maximum) {
    var wert = Number(y);
    if (y === null || !isFinite(wert) || wert < 0) return 0;
    return Math.min(wert, Math.max(0, Number(maximum) || 0));
  }
  // Neuer Zustand mit der Position, vorhandene Felder des Zustands bleiben erhalten
  function mitPosition(zustand, y) {
    var neu = {};
    if (zustand && typeof zustand === "object") for (var k in zustand) if (Object.prototype.hasOwnProperty.call(zustand, k)) neu[k] = zustand[k];
    neu[FELD] = Math.round(Number(y) || 0);
    return neu;
  }
  function position(zustand) {
    if (!zustand || typeof zustand !== "object" || zustand[FELD] === undefined || zustand[FELD] === null) return null;
    var y = Number(zustand[FELD]);
    return isFinite(y) && y >= 0 ? y : null;
  }
  return { wiederherstellen: wiederherstellen, begrenze: begrenze, mitPosition: mitPosition, position: position };
});

(function () {
  if (typeof window === "undefined" || !window.VianuPosition || !window.history) return;
  // In der Gesamtvorschau liegen mehrere Seiten in einem Dokument, dort gilt die Seitenführung der Vorschau
  if (document.querySelector("[data-seite]")) return;
  var P = window.VianuPosition;
  var darfSchreiben = false;

  function schreibe() {
    if (!darfSchreiben) return;
    try { window.history.replaceState(P.mitPosition(window.history.state, window.scrollY), ""); } catch (e) { /* der Browser begrenzt die Aufrufe, die nächste Position gilt */ }
  }

  if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
  var nav = window.performance && window.performance.getEntriesByType ? window.performance.getEntriesByType("navigation")[0] : null;
  var gespeichert = P.wiederherstellen(nav ? nav.type : "navigate") ? P.position(window.history.state) : null;

  var wartet = false;
  window.addEventListener("scroll", function () {
    if (wartet) return;
    wartet = true;
    window.setTimeout(function () { wartet = false; schreibe(); }, 500);
  }, { passive: true });
  window.addEventListener("pagehide", schreibe);

  if (gespeichert === null) {
    darfSchreiben = true;
    return;
  }

  // Die Seite wächst beim Laden noch (Schriften, Skripte). Deshalb mehrmals setzen, bis der Besucher selbst scrollt.
  var benutzt = false;
  function setze() {
    if (benutzt) return;
    var maximum = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: P.begrenze(gespeichert, maximum), left: 0, behavior: "instant" });
  }
  ["wheel", "touchstart", "keydown", "mousedown"].forEach(function (name) {
    window.addEventListener(name, function () { benutzt = true; darfSchreiben = true; }, { once: true, passive: true });
  });
  function starte() {
    setze();
    window.setTimeout(setze, 150);
    window.setTimeout(setze, 500);
    window.setTimeout(function () { setze(); darfSchreiben = true; }, 1000);
  }
  if (document.readyState === "complete") starte();
  else window.addEventListener("load", starte);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setze);
})();
