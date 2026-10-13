/*
  Schritt-für-Schritt-Ablauf. Schnittstelle: Elemente mit [data-ablauf] arbeiten für sich.
  Darin: Tasten [data-schritt="n"] (aria-pressed), Flächen [data-screen="n"], optional [data-ablauf-beschreibung]
  und .handy__ecken (Animation beim zweiten Schritt neu starten). Das Skript blendet alle Flächen außer der des
  gewählten Schritts aus. Flächen im HTML tragen deshalb kein hidden, ohne Skript steht alles lesbar da.
*/
(function () {
  var reduziert = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initAblauf(wurzel) {
    var knoepfe = wurzel.querySelectorAll("[data-schritt]");
    var screens = wurzel.querySelectorAll("[data-screen]");
    var beschreibung = wurzel.querySelector("[data-ablauf-beschreibung]");
    var ecken = wurzel.querySelector(".handy__ecken");
    if (!knoepfe.length) return;

    function waehle(nummer) {
      Array.prototype.forEach.call(knoepfe, function (k) {
        k.setAttribute("aria-pressed", k.getAttribute("data-schritt") === nummer ? "true" : "false");
      });
      Array.prototype.forEach.call(screens, function (s) {
        if (s.getAttribute("data-screen") === nummer) s.removeAttribute("hidden");
        else s.setAttribute("hidden", "");
      });
      var aktiv = wurzel.querySelector('[data-schritt="' + nummer + '"] strong');
      if (beschreibung && aktiv) beschreibung.textContent = window.VianuTexte.text("ablauf.schritt", { nummer: nummer, text: aktiv.textContent }, wurzel);
      if (ecken && nummer === "2" && !reduziert) {
        ecken.style.animation = "none";
        void ecken.getBoundingClientRect();
        ecken.style.animation = "";
      }
    }
    Array.prototype.forEach.call(knoepfe, function (k) {
      k.addEventListener("click", function () { waehle(k.getAttribute("data-schritt")); });
    });
    waehle("1");
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-ablauf]"), initAblauf);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
