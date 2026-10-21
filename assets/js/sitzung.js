/*
  Sitzungsspeicher. Schnittstelle: window.VianuSitzung.setze(name, wert), hole(name), fuelle(wurzel).
  Eingaben in Elementen mit [data-feld] sowie Stunden-Regler [data-boden-regler] und Branchenkachel [data-taetigkeit]
  bleiben im sessionStorage des Browsers, nur für diesen Tab und nur bis er geschlossen wird. Nichts wird gesendet.
  fuelle(wurzel) trägt gemerkte Werte in die Felder von wurzel ein (nie das Einwilligungskästchen).
  Jeder Zugriff auf den Speicher steht in try/catch: Ohne Speicher arbeiten die Formulare wie bisher.
*/
(function () {
  var PRAEFIX = "vianu.";
  var NIE = { einwilligung: true };

  function speicher() {
    try { return window.sessionStorage; } catch (e) { return null; }
  }
  function setze(name, wert) {
    var s = speicher();
    if (!s || NIE[name]) return;
    try {
      if (wert === "" || wert === null || wert === undefined) s.removeItem(PRAEFIX + name);
      else s.setItem(PRAEFIX + name, String(wert));
    } catch (e) { /* voll oder gesperrt: ohne Speicher weiter */ }
  }
  function hole(name) {
    var s = speicher();
    if (!s) return "";
    try { return s.getItem(PRAEFIX + name) || ""; } catch (e) { return ""; }
  }

  function trage(feld, wert) {
    if (!wert || feld.type === "checkbox" || feld.value === wert) return false;
    if (feld.tagName === "SELECT") {
      var passt = Array.prototype.some.call(feld.options, function (o) { return o.value === wert; });
      if (!passt) return false;
    }
    feld.value = wert;
    feld.dispatchEvent(new Event("input", { bubbles: true }));
    feld.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }

  // Füllt leere Felder. Was die Person schon in ein Feld getippt hat, bleibt stehen.
  function fuelle(wurzel) {
    Array.prototype.forEach.call((wurzel || document).querySelectorAll("[data-feld]"), function (f) {
      var name = f.getAttribute("data-feld");
      if (NIE[name] || f.value) return;
      trage(f, hole(name));
    });
  }

  function merke(e) {
    var f = e.target;
    if (!f || !f.getAttribute) return;
    var name = f.getAttribute("data-feld");
    if (name && !NIE[name] && f.type !== "checkbox") { setze(name, f.value.replace(/\s+/g, " ").trim()); return; }
    if (f.hasAttribute("data-boden-regler")) setze("stunden", f.value);
  }

  function start() {
    document.addEventListener("input", merke, true);
    document.addEventListener("change", merke, true);
    // Branchenkachel: die gewählte Tätigkeit merken (aria-pressed wird erst nach dem Klick gesetzt)
    document.addEventListener("click", function (e) {
      var k = e.target.closest ? e.target.closest("[data-taetigkeit]") : null;
      if (k) setze("branche", k.getAttribute("data-taetigkeit"));
    }, true);
    fuelle(document);
  }

  window.VianuSitzung = { setze: setze, hole: hole, fuelle: fuelle };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
