/*
  Meldungen, die Skripte in die Seite schreiben. Schnittstelle: text(schluessel, werte, sprache), SCHLUESSEL.
  Die Sprache kommt aus dem lang-Attribut der Seite, Deutsch ist der Vorgabewert.
  Reine Funktion ohne Browserbezug, bis auf den Vorgabewert der Sprache.
*/
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.VianuTexte = factory();
})(this, function () {
  var SCHLUESSEL = {
    de: {
      "kopiert.text": "Text kopiert.",
      "kopiert.link": "Link kopiert.",
      "kopiert.rolle": "Link für {rolle} kopiert.",
      "kopiert.fehler.link.du": "Kopieren hat nicht geklappt. Der Link steht unten, kopiere ihn von Hand.",
      "kopiert.fehler.link.sie": "Kopieren hat nicht geklappt. Der Link steht unten, kopieren Sie ihn von Hand.",
      "kopiert.fehler.text.du": "Kopieren hat nicht geklappt. Der Text ist markiert, kopiere ihn von Hand.",
      "kopiert.fehler.text.sie": "Kopieren hat nicht geklappt. Markieren Sie den Text und kopieren Sie ihn von Hand.",
      "name.ansage": "Deine Sohle zeigt: {name}",
      "ablauf.schritt": "Schritt {nummer}: {text}",
      "rechner.zeile": "{preis} Euro je Paar geteilt durch {n} Schichten",
      "platzhalter.link": "[Link zur Seite]",
      "rolle.personal": "Personal",
      "rolle.geschaeftsfuehrung": "Geschäftsführung und Betrieb",
      "rolle.arbeitsschutz": "Arbeitsschutz",
      "rolle.einkauf": "Einkauf",
      "rolle.betriebsrat": "Betriebsrat",
      "rolle.andere": "Andere Rolle",
      "formular.unternehmen.leer": "Bitte tragen Sie den Namen Ihres Unternehmens ein.",
      "formular.unternehmen.lang": "Der Name ist zu lang (höchstens {max} Zeichen).",
      "formular.rolle": "Bitte wählen Sie Ihre Rolle.",
      "formular.mitarbeitende": "Bitte geben Sie die Zahl der Mitarbeitenden als ganze Zahl von 1 bis {max} an.",
      "formular.einwilligung": "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.",
      "anfrage.titel": "Anfrage für den Piloten mit 10 Mitarbeitenden",
      "anfrage.unternehmen": "Unternehmen",
      "anfrage.rolle": "Rolle",
      "anfrage.mitarbeitende": "Mitarbeitende im Unternehmen"
    },
    en: {
      "kopiert.text": "Text copied.",
      "kopiert.link": "Link copied.",
      "kopiert.rolle": "Link for {rolle} copied.",
      "kopiert.fehler.link.du": "Copying did not work. The link is below. Copy it by hand.",
      "kopiert.fehler.link.sie": "Copying did not work. The link is below. Copy it by hand.",
      "kopiert.fehler.text.du": "Copying did not work. The text is selected. Copy it by hand.",
      "kopiert.fehler.text.sie": "Copying did not work. Select the text and copy it by hand.",
      "name.ansage": "Your insole shows: {name}",
      "ablauf.schritt": "Step {nummer}: {text}",
      "rechner.zeile": "EUR {preis} per pair divided by {n} shifts",
      "platzhalter.link": "[Link to the page]",
      "rolle.personal": "HR",
      "rolle.geschaeftsfuehrung": "Management and Operations",
      "rolle.arbeitsschutz": "Occupational Safety",
      "rolle.einkauf": "Procurement",
      "rolle.betriebsrat": "Works council",
      "rolle.andere": "Other role",
      "formular.unternehmen.leer": "Please enter the name of your company.",
      "formular.unternehmen.lang": "The name is too long (at most {max} characters).",
      "formular.rolle": "Please choose your role.",
      "formular.mitarbeitende": "Please enter the number of employees as a whole number from 1 to {max}.",
      "formular.einwilligung": "Please agree to the processing of your details.",
      "anfrage.titel": "Request for the pilot with 10 employees",
      "anfrage.unternehmen": "Company",
      "anfrage.rolle": "Role",
      "anfrage.mitarbeitende": "Employees in the company"
    }
  };

  function seitensprache() {
    if (typeof document !== "undefined" && document.documentElement) return document.documentElement.lang || "de";
    return "de";
  }

  function text(schluessel, werte, sprache) {
    var s = sprache || seitensprache();
    var tabelle = SCHLUESSEL[s] || SCHLUESSEL.de;
    if (!Object.prototype.hasOwnProperty.call(SCHLUESSEL.de, schluessel)) throw new Error("Unbekannter Schlüssel: " + schluessel);
    return tabelle[schluessel].replace(/\{(\w+)\}/g, function (_, name) {
      return werte && werte[name] != null ? String(werte[name]) : "{" + name + "}";
    });
  }

  return { text: text, SCHLUESSEL: SCHLUESSEL };
});
