/*
  Studien zum Herunterladen. Schnittstelle: Knöpfe mit [data-studie-datei] und [data-studie-name] öffnen das <dialog data-studie-dialog>.
  Das Popup fragt eine E-Mail-Adresse ab, prüft sie und startet danach den Download der PDF unter ihrem Studiennamen.
  Die Adresse wird nur geprüft, nicht gesendet und nicht gespeichert (es gibt noch keinen Dienst zur Erfassung, siehe FACTS.md).
  emailGueltig(wert): reine Funktion, auch für Tests.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuStudien = factory();
})(this, function () {
  function emailGueltig(wert) {
    var t = String(wert == null ? "" : wert).trim();
    return t.length <= 254 && /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/.test(t);
  }

  function start() {
    if (typeof document === "undefined") return;
    Array.prototype.forEach.call(document.querySelectorAll("[data-studie-dialog]"), init);
  }

  function init(dialog) {
    var seite = dialog.closest("[data-seite]") || document;
    var knoepfe = seite.querySelectorAll("[data-studie-datei]");
    var titel = dialog.querySelector("[data-studie-titel]");
    var feld = dialog.querySelector("[data-studie-email]");
    var fehler = dialog.querySelector("[data-studie-fehler]");
    var form = dialog.querySelector("form");
    var gewaehlt = null, ausloeser = null;
    var T = window.VianuTexte;
    function text(k) { return T ? T.text(k, null, dialog) : k; }

    function melde(k) { if (fehler) { fehler.textContent = k ? text(k) : ""; fehler.hidden = !k; } if (feld) feld.setAttribute("aria-invalid", k ? "true" : "false"); }
    function oeffne(knopf) {
      ausloeser = knopf;
      gewaehlt = { datei: knopf.getAttribute("data-studie-datei"), name: knopf.getAttribute("data-studie-name"), titel: knopf.getAttribute("data-studie-titel") };
      if (titel) titel.textContent = gewaehlt.titel || "";
      melde(null);
      if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
      if (feld) feld.focus();
    }
    function schliesse() { if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open"); }
    function lade() {
      var a = document.createElement("a");
      a.href = gewaehlt.datei;
      a.download = gewaehlt.name;
      a.rel = "noopener";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
    function senden() {
      if (!gewaehlt) return;
      if (!emailGueltig(feld.value)) { melde("studie.fehler"); feld.focus(); return; }
      melde(null);
      lade();
      schliesse();
    }

    Array.prototype.forEach.call(knoepfe, function (k) { k.addEventListener("click", function () { oeffne(k); }); });
    Array.prototype.forEach.call(dialog.querySelectorAll("[data-studie-schliessen]"), function (b) { b.addEventListener("click", schliesse); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) schliesse(); });
    dialog.addEventListener("close", function () { if (ausloeser && document.contains(ausloeser)) ausloeser.focus(); });
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); senden(); });
    if (feld) feld.addEventListener("input", function () { melde(null); });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  }
  return { emailGueltig: emailGueltig };
});
