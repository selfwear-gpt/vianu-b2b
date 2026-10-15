# Bausteine

Katalog aller Bausteine der Seite. Jede Seite wird aus diesen Bausteinen zusammengesetzt. Ein neuer Baustein kommt erst hierher, dann in den Code. Status: **geplant**, **gebaut**.

Alle Bausteine nutzen nur Tokens aus `DESIGN.md` und die Begriffe aus `GLOSSARY.md`. Pfeile (↗ →) fehlen in den Schriften und werden als SVG-Symbol gesetzt, auch dort, wo dieser Katalog das Zeichen zur Beschreibung nennt.

## Navigation

### Menü B2B-Bereich
Status: gebaut
- Zweck: Orientierung und Hauptaktion in einem festen Balken.
- Aufbau von links nach rechts: Logo, Programm, Ablauf, Preis, "Wer entscheidet mit?" (Auswahl mit fünf Persona-Seiten), FAQ, "Kontakt aufnehmen" (hervorgehoben), "Für Mitarbeitende ↗".
- Regeln: bleibt fest, wird nie überdeckt, "Kontakt aufnehmen" bleibt auch auf dem Handy sichtbar. Jeder Eintrag der Persona-Auswahl zeigt die Frage der Rolle als Unterzeile.

### Menü Mitarbeitenden-Bereich
Status: geplant
- Aufbau: Logo, "Perspektivwechsel" (dunkel, abgesetzt, Unterzeile "Für die Entscheider-Etage"), Die Sohle, So läuft es ab, Fragen, "Teilen".
- Regeln: "Teilen" bleibt sichtbar.

### Sprachumschalter
Status: gebaut
- Zweck: Wechsel zwischen Deutsch und Englisch, oben rechts (`.sprache`). Der aktive Eintrag ist ein `span` mit `aria-current="true"`, der andere ein Link auf das Seitenpaar (`hreflang`, `lang`, `aria-label` in der Zielsprache).
- Englische Fassung: eigene Seiten unter `en/` mit denselben Dateinamen (Seitenpaar), alles im HTML. Kein Erkennen der Browsersprache, keine Weiterleitung. Jede Seite trägt `hreflang` für `de`, `en` und `x-default` (relativ, bis die Domain feststeht). Slogans bleiben Englisch und unverändert. Menüs und Überschriften werden übersetzt, zum Beispiel "Perspektivwechsel" zu "Change of perspective" mit der Unterzeile "For the decision-makers".
- Meldungen der Skripte (Kopieren, Rechner, Formular, Ablauf, Namenssohle) stehen in `assets/js/texte.js` und folgen dem `lang`-Attribut der Seite.
- Offen: Im Konzept liegen "Teilen" und "Für Mitarbeitende ↗" ebenfalls am rechten Rand. Vorschlag: Der Umschalter sitzt ganz rechts, die beiden anderen Einträge direkt daneben. Zu bestätigen.

### Footer
Status: gebaut
- Logo, Links auf Impressum und Datenschutz (`fuss__recht`), Link in den anderen Bereich. Auf jeder Seite, mit relativem Pfad (`../` in `b2b/`).

## Einstieg

### Hero B2B
Status: gebaut
- Links die Überschrift in Schichtsprache und der Button "Kontakt aufnehmen". Rechts ein Video-Platzhalter mit dem Gründer (Vorschaubild, Start auf Klick, mit Ton).
- Der Slogan steht unter der Überschrift. Die endgültige Überschrift ist offen.
- Regel: kein zentrierter Hero mit zwei Buttons.

### Hero Mitarbeitende
Status: gebaut
- Links oben der Slogan in großer Schrift mit Unterzeile, rechts oben der Video-Platzhalter.

## Inhalt B2B

### Programmblock (Reiter)
Status: gebaut
- Heißt "Was Sie bekommen", Einleitung nennt die Reihenfolge (Freigabe im Haus, Pilot mit 10 Mitarbeitenden, Bericht am Ende). Drei große Reiter (Vor dem Start, Im Piloten, Danach) mit Nummer, Symbol und Titel, darunter eine dunkle Bühne mit dem Inhalt des gewählten Reiters:
  - **Freigabepaket** ("Die Unterlagen, mit denen Sie intern freigeben"): drei Unterlagen mit Nutzen, Stand "Entwurf" und Download als Textdatei (`assets/downloads/`: Vorlage Betriebsvereinbarung, Datenschutzkonzept, Auftragsverarbeitungsvertrag). Hinweis, dass sie nicht rechtlich geprüft sind.
  - **Durchführung** ("Was im Betrieb passiert"): drei Bahnen (Ihr Betrieb, Ihr Team, VIANU), Platzhalter für Aufwand und Zeitraum, Download "Ablauf und Aufgaben".
  - **Ergebnisbericht** ("Am Ende sehen Sie vier Antworten Ihres Teams"): die vier umdrehbaren Messwert-Kacheln, Hinweis auf Anonymisierung und Selbstauskunft, Download "Muster des Berichts" (ohne Werte).
  - Unter der Bühne stehen Preis und Antwortfrist (1.200 Euro zuzüglich Umsatzsteuer, Antwort innerhalb von 5 Werktagen) und der Knopf "Kontakt aufnehmen". Die vier Merkmal-Chips entfallen.
- Alle Downloads sind Textdateien (bearbeitbar, ohne Build-Schritt), jeweils mit englischer Fassung. Jede trägt den Vermerk "Stand: Entwurf", Rechtsunterlagen zusätzlich "Keine Rechtsberatung". Nicht belegte Aussagen stehen als `[Platzhalter: ...]`. Haltbarkeit und Beispielzahlen kommen in keiner Datei vor.
- Bedienung: Klick, Tastatur (Pfeile, Pos1, Ende), beim Darüberfahren mit der Maus. Ohne Skript stehen alle drei Felder untereinander. Logik: `initReise` in `assets/js/b2b.js`.

### Messwert-Kacheln
Status: gebaut
- Vier Kacheln: Tragequote, Spürbare Verbesserung, Weiterempfehlung, Wertschätzung. Jede ist beim Darüberfahren oder Fokussieren umdrehbar: Vorderseite Symbol und Titel, Rückseite die Frage an die Teilnehmenden (`messwerte--flip`, `messwert--dreh`). Bei reduzierter Bewegung und ohne Hover (Touch) steht beides ohne Drehen da. Ein Einleitungssatz nennt die vier Fragen. Es gibt keinen Zeitstrahl, keinen Platzhalter "Noch keine Daten" und keinen Abgrenzungssatz auf der Startseite. Die Rollenseiten haben noch die alte Form.
- Regeln: keine Beispielzahlen, bis es echte Daten gibt. Auf Persona-Seiten sind die für die Rolle wichtigen Kacheln größer.

### Preisblock
Status: gebaut
- Reihenfolge von oben nach unten: erst der Kostenrechner ohne Rahmen ("Wie viele Schichten hat ein Mitarbeiter im Jahr?", Ergebnis je Schicht pro Person, dahinter ein kleines i), direkt darunter die 3-Jahres-Aussage. Das i zeigt beim Darüberfahren und bei Tastaturfokus den Rechenweg ("Gerechnet: 120 Euro je Paar geteilt durch 210 Schichten pro Person und Jahr, zuzüglich Umsatzsteuer", folgt dem Regler, `info`, `info__knopf`, `info__text`). Darunter links das Preisschild "120 €" mit der Zeile "je individuell gefertigtes Paar (zzgl. Umsatzsteuer)", rechts der Pilot-Satz ("Ein Pilot mit bspw. 10 Mitarbeitenden kostet: 10 Paare = 1.200 Euro zzgl. Umsatzsteuer.") und der Knopf "Pilot buchen", der das Kontaktformular öffnet. Es gibt keine Zeile über dem Preisschild, keinen Satz zu weiteren Teams und zum Rollout, keinen Kasten und kein Sohlenbündel. Die Punktgrafik "Klein starten" gibt es nur noch auf der Rollenseite der Geschäftsführung. Kosten je Monat gibt es nicht, weil sie eine Tragedauer voraussetzen.
- Regel: Der Preis steht als "120 Euro je Paar, zuzüglich Umsatzsteuer". Mengenpreise bleiben verborgen.

### Fußabdruck "Sorgen und Bedenken im Entscheidungsteam"
Status: gebaut
- Sechs Kacheln, als Fuß angeordnet (Zehen links, Ferse rechts, Außenecken abgerundet), jede mit Symbol, Rolle und ein bis drei Wörtern. Bei Hover oder Fokus dreht sich die Kachel um. Die Rückseite zeigt die ganze Frage und den Weg zur passenden Persona-Seite. Die Kachel ist ein Link. Der Fußumriss hat keine Zehenstriche nach innen, die Fersen-Kachel schließt unten bündig mit dem Umriss ab, die Texte halten Abstand zum Rand. Reihenfolge nach dem Entscheidungsweg: Zehen (Personal), Ballen innen (Mitarbeitende), Ballen außen (Betriebsrat), Gewölbe (Arbeitsschutz), Ferse oben (Geschäftsführung), Ferse unten (Einkauf). Der Abschnitt trägt die Kennung `wer-entscheidet-mit`.
- Handy: Eine kleine Fußzeichnung bleibt unter dem Menü stehen, beim Scrollen leuchten die Zonen nacheinander auf (die Karte mit der aktiven Zone bekommt eine Signalfläche), sechs Punkte zeigen den Fortschritt, ein Tipp auf Zone oder Punkt springt zur Karte. Die Karten stehen untereinander, Vorder- und Rückseite zusammen.
- Regeln: Vorder- und Rückseite sind echter Text im HTML, jede Kachel ist ein Link. Bei reduzierter Bewegung blendet die Kachel um, statt sich zu drehen. Die Sorgen stehen zusätzlich als einfache Liste im HTML.

### Druckkarte (Bewegung)
Status: gebaut
- Neben dem Schmerztext baut sich beim Scrollen eine Druckkarte des Fußes aus Punkten auf (etwa 290 Punkte in einem Sohlen-Umriss). Niedrige Last erscheint zuerst, das Signal (`--farbe-signal`) zuletzt an der Spitze der Belastung. Vollständig umkehrbar, ohne Zahlen und ohne Vorher-Nachher. Bei reduzierter Bewegung steht die fertige Karte. Die Zeichnung ist schematisch und wird als "keine Messung" gekennzeichnet. Logik: `assets/js/fortschritt.js`.

### Matte-und-Weg (Grafik)
Status: geplant
- Grundriss einer Küche mit einer Arbeitsplatzmatte am Herd. Eine gepunktete Linie zeigt den Weg einer Schicht, beim Scrollen wird sie Station für Station gezeichnet. Ein Satz daneben: "Die Sohle ergänzt die Arbeitsplatzmatte." Im Ruhezustand ist die Zeichnung fertig.
- Nur auf der Arbeitsschutz-Seite.

### Kostenrechner
Status: gebaut
- Ein Regler stellt die Schichtzahl ein (20 bis 600, Schritt 10, Start 210). Die Seite rechnet 120 Euro geteilt durch diese Zahl und zeigt das Ergebnis in Euro und Cent, gekennzeichnet "gerechnet", zuzüglich Umsatzsteuer.
- Regel: Der Rechner nennt den Zeitraum ("Schichten in einem Jahr") und rechnet 120 Euro geteilt durch die Schichten. Er macht keine eigene Aussage zur Haltbarkeit und nennt keine Schichtzahl je Paar als Tatsache. Logik: `assets/js/kosten.js`.

### Klein starten
Status: gebaut
- Zehn Punkte für den Piloten, daneben wachsende Gruppen für weitere Teams und weitere Standorte, in drei Stufen beim Scrollen. Schema ohne Zahlen. Darunter die drei Stufen als Text. Bei reduzierter Bewegung sind alle Stufen sichtbar.

### Handy-Ablauf (B2B)
Status: gebaut
- Derselbe Baustein wie auf der Mitarbeitenden-Seite (`.ablauf__*`, `.handy`, `assets/js/ablauf.js`): vier Schritte links, jeder mit Nummer, Bahn-Etikett (Ihr Betrieb, Ihr Team, VIANU, Ihr Betrieb), Überschrift und Satz, rechts ein gezeichnetes Handy. Die Schritte öffnen per Klick, Tastatur und beim Darüberfahren mit der Maus. Bei Schritt 1 sitzt im Handybild der Knopf "Kontakt aufnehmen" und öffnet das Popup. Schritt 3 zeigt die Sohle mit dem Beispielnamen "Anna" (hochkant im Vorderfuß) und "XY GmbH" (waagerecht, klein, in der Ferse mit Abstand zum Rand). Schritt 4 zeigt ein Paket mit zwei Sohlen und Haken. Statt einer Zeitangabe sitzt dort der Knopf "Jetzt bestellen" (`handy__cta--unten`, `data-cta-schritt="4"`), der das Kontaktformular öffnet. Die Ansage des Schritts steht nur für Screenreader. Keine Bahnen-Raster mehr.

### Preisschild, Bündel und Siegel
Status: gebaut
- Der Preis ist ein pinkes Preisschild (120 Euro), daneben "je Paar, zuzüglich Umsatzsteuer" und ein Bündel aus zehn Sohlen mit "10 Paare, 1.200 Euro zuzüglich Umsatzsteuer". Darunter ein Siegel "3 Jahre" mit dem Satz zur Haltbarkeit (Angabe des Nutzers, siehe `FACTS.md`). Rechner und "Klein starten" bleiben darunter.

### FAQ-Köpfe
Status: gebaut
- Die Gruppen ("Einlegesohlen für Teams", "Zu VIANU") sind farbige Köpfe (Tinte, Pink), auf breiten Schirmen links und klebend. Die Fragen sind nummerierte Karten mit rundem Plus. Gilt für alle Seiten mit FAQ.

### Zweites Paar
Status: Platzhalter mit Bild
- Zwei Sohlen (eine ausgefüllt, eine gestrichelt) mit Fragezeichen neben dem markierten Platzhalter. Der Inhalt fehlt, bis es ein Konzept gibt.
### Rollen-Rohbau
Status: gebaut
- Fünf Seiten `b2b/<rolle>.html` mit Menü, einem `h1`, der Frage der Rolle und einem Platzhalter, `noindex`. Sie werden mit dem Baustein "Persona-Seite" gefüllt.

### Persona-Seite
Status: gebaut
- Aufbau: Jede Seite hat eine eigene Reihenfolge und ein eigenes Leitelement, kein Abschnitt besteht nur aus Fließtext. Gemeinsam sind nur Kopf (Einseiter) vorn sowie FAQ in zwei Gruppen und Weiterleiten mit Einseiter-PDF am Ende. Reihenfolgen: Personal: Aufgaben (Weg), Messwerte, Termin (Reiter), Brief, Belege. Geschäftsführung: Kosten, Termin (Reiter), Messwerte, Belege (Akkordeon), Brief. Arbeitsschutz: Weg (Grundriss), Belege (Studienkarten), Termin (Prüfliste), Messwerte, Brief. Einkauf: Beschaffung, Termin (Fragenkarten als Raster), Messwerte, Belege, Brief. Betriebsrat: Datenfluss, Termin (Fragenkarten als Reihe), Messwerte, Belege, Brief. Test: `tests/rollen.test.js`.
- Fünf Seiten: Personal, Geschäftsführung und Betrieb, Arbeitsschutz, Einkauf, Betriebsrat. Jede hat einen eigenen Titel, eine eigene Beschreibung und FAQPage-Daten. Seitentest: `tests/seiten.test.js`.
- Rollenspezifisch: Personal "Ihre Aufgaben im Piloten" (Stationenweg mit vier Stationen, `weg--vier`), Geschäftsführung Kostenrechner und "Klein starten", Arbeitsschutz "Wo die Arbeitsplatzmatte endet" (Grundriss), Einkauf "Preis und Beschaffung" (Rechnung, Lieferzeit, Statusliste mit Filter), Betriebsrat "Daten und Datenschutz" (klickbarer Datenfluss). Alle Rollenseiten tragen die gemeinsame Sohlenzeichnung (`#sohle-form`), die Fußspuren, Weg und Bündel verwenden.

### Im Termin
Status: gebaut
- Fünf Inhalte: "Die Frage der Rolle", Kernbotschaft, "So sieht die Seite es", "Der Pilot gilt als Erfolg, wenn", "Das braucht es vor der Freigabe". Der Abschnitt bleibt `einseiter` und liefert die Einseiter-PDF. Alle fünf Inhalte stehen im HTML, im Druck stehen sie offen untereinander. Die Form wechselt je Seite: Reiter (`reise--termin`, Personal und Geschäftsführung), umdrehbare Fragenkarten (`fragenkarten--raster` auf Einkauf, `fragenkarten--reihe` auf Betriebsrat, Vorderseite Nummer und Etikett, Rückseite der Text) und Prüfliste (`pruefliste`, Arbeitsschutz: fünf Schalter zum Abhaken mit Zähler, nur Ansicht, nichts wird gespeichert). Logik: `initReise` in `b2b.js`, `initPruefliste` in `bausteine.js`.

### Brief
Status: gebaut
- Zitatkarte (`zitatkarte`): dunkle Fläche mit Etikett "Roderich an <Rolle>", Porträt-Platzhalter, jeder der zwei Absätze in einer eigenen nummerierten Karte (Hover hebt sie hervor), Unterschrift in Signalfarbe und Link zu Roderichs Geschichte. Der Brief greift den Einwand der Rolle auf und nennt nur Aussagen aus `FACTS.md`. Wortlaut von Roderich zu bestätigen.

### Beleg-Block
Status: gebaut
- Je nach Seite Studienkarten (`dreh studienkarte`, Vorderseite Quelle und Titel, Rückseite Aussage und Fundstelle mit Link auf die DOI, Personal und Arbeitsschutz), Akkordeon (`details.beleg`, Geschäftsführung) oder eine umdrehbare Platzhalterkarte (Einkauf, Betriebsrat mit den drei Unterlagen "In Arbeit"). Daneben der markierte Platzhalter für den Pilotkunden. Unter den Studien steht der Hinweis, dass keine Studie Hotellerie oder Gastronomie untersucht. Studien stehen nur auf den Seiten, deren Rolle sie braucht. Mit Tastatur erreichbar, die Karte dreht bei Fokus.

### Umdrehbare Karte (`dreh`)
Status: gebaut
- Eine Zelle mit zwei Seiten (Raster mit gleicher Zelle, deshalb gleich hoch): Vorderseite Papier, Rückseite Signal. Dreht bei Hover und Fokus (`:focus-within`), bei reduzierter Bewegung wird überblendet, ohne Hover (Touch) stehen beide Seiten untereinander, im Druck nebeneinander. Verwandt: `messwert--dreh` (Messwerte) und `.sorge` (Fußform).

### Matte und Weg
Status: gebaut
- Grundriss einer Küche als Vektorzeichnung, Arbeitsplatzmatte am Herd, gepunktete Linie und Fußspuren entlang des Weges einer Schicht. Beim Scrollen wird der Weg Station für Station gezeichnet, beim Zurückscrollen läuft er rückwärts. Die Stationen stehen als nummerierte Liste (die Reihenfolge ist der Weg), kein Text in der Zeichnung. Bei reduzierter Bewegung ist die Zeichnung fertig. Logik: `assets/js/rollen.js`.

### Datenfluss
Status: gebaut
- Fünf Knoten als Schalter mit Pfeilen: Mitarbeitende, offen (Verarbeitung der Fotos), VIANU, Ihr Betrieb, offen (Einsicht in die Teilnahme). Der gewählte Knoten zeigt seinen Text im dunklen Feld darunter, Pfeiltasten wechseln den Knoten. Bekannte Knoten sind durchgezogen, offene gestrichelt, ihr Text hat einen gestrichelten Rand. Ohne Skript stehen alle Texte untereinander. Auf schmalen Bildschirmen stehen die Knoten untereinander. Keine Datenflüsse, die nicht in `FACTS.md` stehen. Logik: `initFluss` in `assets/js/bausteine.js`.

### Preis und Beschaffung (Einkauf)
Status: gebaut
- Rechnung "120 € mal 10 Paare (Bündel) gleich 1.200 €" mit Zusatz zuzüglich Umsatzsteuer, Zeitstrahl "Fußerfassung, VIANU fertigt, Sohlen erreichen den Betrieb" (spätestens 7 Tage), Statusliste mit Filterknöpfen Alle, Steht fest, Offen (`data-filter`, `initFilter` in `bausteine.js`). Die Zeile "Ersatz und zweites Paar" steht dort als Offen.

### Einseiter
Status: gebaut
- Druckstil jeder Rollenseite: Es bleiben Name, Frage, Kernbotschaft, "Im Termin" und die Kontaktzeile stehen, alles andere entfällt. `scripts/erzeuge-pdf.js` erzeugt daraus `assets/downloads/rolle-<id>.pdf` und prüft, dass jede Datei eine Seite hat.

### FAQ-Akkordeon
Status: gebaut
- Frage als Überschrift, Antwort in ganzen Sätzen, der erste Satz beantwortet die Frage. Alle Antworten stehen im HTML. Aufbau, Fragearten und Gruppen wie im Baustein "Fragen-Akkordeon (Mitarbeitende)", Regeln in `VOICE.md`, Abschnitt "FAQ".

### Pilotformular (Popup)
Status: gebaut
- Jeder Knopf "Kontakt aufnehmen" öffnet ein Popup (`<dialog data-pilot-dialog>`, `assets/js/pilot.js`) statt zum Formular zu springen. Auch `#pilot` oder `?pilot` in der Adresse öffnen es. Esc, Schließen-Knopf oder Klick auf den Hintergrund schließen, der Fokus kehrt zum Auslöser zurück. Das Popup steht auf der B2B-Startseite und auf jeder Rollenseite.
- Pflichtfelder: Unternehmen, Rolle, Zahl der Mitarbeitenden, Stunden pro Tag auf den Beinen (1 bis 12), Branche (14 Einträge, `BRANCHEN` in `formular.js`, dieselbe Liste wie die Tätigkeitskacheln), E-Mail oder Telefon, "Wie sind Sie auf uns aufmerksam geworden?" (acht Antworten, überschneidungsfrei, "Anderer Weg" zuletzt: Suche mit einer KI, Suche bei Google oder einer anderen Suchmaschine, soziale Netzwerke, Empfehlung eines anderen Unternehmens, Empfehlung einer Mitarbeiterin oder eines Mitarbeiters, Kontaktaufnahme durch VIANU, Presse, Fachmedium oder Veranstaltung, Anderer Weg), Freitext dazu (höchstens 500 Zeichen), Einwilligung. Prüfung im Browser mit Fehlermeldung je Feld (`assets/js/formular.js`). Versand ist noch nicht angebunden: Nach gültiger Eingabe steht unter dem Knopf nur "Tool zur Erfassung fehlt noch.", die Angaben werden nicht angezeigt.
- Titel "Kontaktanfrage stellen", Einleitung "Wir melden uns innerhalb von 5 Werktagen zurück, versprochen! Roderich ist Ihr Ansprechpartner." Zusätzlich Pflichtfeld "Ihr Anliegen" (Textfeld mit Beispieltext als Platzhalter, höchstens 500 Zeichen, auch im letzten Schritt der Anfrage-Strecke). Der Schluss-Abschnitt trägt keinen Platzhalter zu Datenschutzhinweis und Antwortzeit mehr.
- Regeln: Spamschutz ohne Fremdserver.

### Weiterleiten
Status: gebaut
- Links zu den fünf Rollenseiten und eine Taste, die den Link zur B2B-Seite kopiert (Rückfall: Link zum Kopieren von Hand). Die einseitige PDF je Rolle folgt mit den Persona-Seiten.

## Inhalt Mitarbeitende

### Teilen
Status: gebaut
- Kleines Menü im Kopf, dazu Knöpfe an anderen Stellen (`data-teilen-oeffnen`): an den Arbeitgeber (erst Abteilung wählen, dann wird der Link der Persona-Seite kopiert) oder an Kolleginnen und Kollegen (Link dieser Seite). Bestätigung "Link kopiert". Wenn der Browser das Kopieren ablehnt, wird der Link zum Kopieren von Hand angezeigt. Die Links auf die Persona-Seiten führen erst ins Leere, bis die Seiten gebaut sind.
- Logik: `assets/js/teilen.js`, Test in `tests/teilen.test.js`.

### Name auf der Sohle
Status: gebaut
- Besucher tippen einen Namen (höchstens 14 Zeichen, nur Buchstaben, Leerzeichen, Apostroph und Bindestrich) und sehen ihn sofort auf der Sohle. Nichts wird gespeichert, der Name bleibt im Browser. Die Buchstaben drücken sich beim Tippen leicht ein. Ein Hinweis zur Vorschau steht auf Wunsch des Nutzers (13.10.2026) nicht mehr in der Sektion. Ob der Name auf die echte Sohle kommt, ist weiter offen (`FACTS.md`). Der Ablauf-Schritt "Deine Sohle entsteht" trägt den Vorbehalt.
- Zweites Feld "Dein Unternehmen" (höchstens 18 Zeichen, Buchstaben, Ziffern, Leerzeichen und `& . - '`). Der Firmenname steht klein und hochkant ganz links im breiten Zehenbereich der Sohle (54 Einheiten lang, mit Abstand zum Umriss), in derselben Gravur-Optik, und schrumpft bei langen Namen, ohne den Rand zu überschreiten. Das Feld trägt kein "optional", der Abschnitt hat keinen Einleitungstext. Die Ansage für Screenreader nennt beides.
- Logik: `assets/js/name.js` (`bereinigeName`, `bereinigeFirma`), Test in `tests/name.test.js`.

### Werteband
Status: gebaut
- Sechs Werte als ungleich große Kacheln (Spannen 7/5, 5/7, 4/8 von 12 Spalten) mit Symbol und Überschrift vorn: Leicht durch die Schicht, Abende, die dir gehören, Passt in die Schuhe, die du hast, Hält so lange wie deine Schuhe, Bleibt frisch, Dein Name drauf. Bei allen Kacheln steht das Symbol oben links und die Überschrift unten. Die Rückseiten sind mittig zentriert. Die Rückseite von "Dein Name drauf" ist ein Link auf den Namensabschnitt (`#name`).
- Beim Hovern, bei Tastaturfokus (`tabindex="0"`) und auf Geräten ohne Hover beim Tippen dreht sich die Kachel um. Die Rückseite zeigt die Antwort auf die Überschrift, in umgekehrten Farben (Signal wird Tinte, Tinte und Papier werden Signal). Beide Seiten stehen im HTML. Bei reduzierter Bewegung blendet die Rückseite über. Auf dem Handy (bis 56 rem) stehen Vorder- und Rückseite untereinander. Logik: `initWerte` in `assets/js/mitarbeitende.js`.
- Regel: Antworten nennen nur, was `FACTS.md` trägt. Haltbarkeit (3 Jahre) und Frische sind Angaben des Nutzers vom 13.10.2026, der Beleg fehlt noch im Repo.

### Stimme
Status: gebaut (Vorlage)
- Rezensionskarte unter der Überschrift "Hör nicht auf uns, hör auf andere in deiner Situation": großes Anführungszeichen in Signalfarbe, Zitat, rundes Porträtfeld, Vorname, Jobtitel, Signal-Versatz. Heute trägt sie den Platzhaltertext und ist mit `data-platzhalter` markiert. Keine Sterne und keine Bewertungszahl, weil beides Daten wären, die es nicht gibt.
- Wird eine echte Stimme freigegeben, ersetzen Zitat, Porträt, Vorname und Jobtitel den Platzhalter, die Karte bleibt gleich. Das Bild nur mit Einwilligung der Person.

### Schichttag
Status: gebaut
- Überschrift "Ein Tag im Schichtbetrieb". Scrollgeschichte vom Beginn der Schicht bis zum Abend danach, in der Sprache der Bewertungen. Links eine mitlaufende Uhr (bleibt beim Scrollen stehen), rechts fünf Momente.
- Der Zeiger startet beim Schichtbeginn auf 8 Uhr (unten links) und steht beim Feierabend auf 17 Uhr, 30 Grad je Stunde. Der Moment "Abend" trägt `data-stunde="20"` ohne sichtbare Uhrzeit, der Zeiger läuft beim Weiterscrollen bis dorthin (600 Grad) und steht beim Abend anders als beim Feierabend. Die Momente "Schichtbeginn" und "Feierabend" tragen ihre Uhrzeit im Text, für die übrigen steht keine Uhrzeit. Bei reduzierter Bewegung bleibt der Zeiger auf 8 Uhr und die Momente stehen als Liste. Logik: `zeigerWinkel` und `anteilZwischen` in `assets/js/fortschritt.js`.

### Handy-Ablauf
Status: gebaut
- Vier Schritte als Knöpfe (aria-pressed) neben einem gezeichneten Handy. Der gewählte Schritt zeigt seinen Bildschirm (Ankündigung, Sucherrahmen mit Fuß, Sohle, Übergabe). Die Schritte öffnen schon beim Darüberfahren mit der Maus (`pointerenter`), beim Tippen, Klicken und per Tastatur. Die Ansage des Schritts steht nur noch für Screenreader (`sr-nur`), unter dem Handy steht keine Zeile.
- Bei Schritt 1 sitzt im Handybild unter den beiden Karten ein Knopf "Arbeitgeber anfragen" (`data-cta-schritt="1"`, `data-teilen-oeffnen`), der das Teilen-Feld öffnet. Der Ablauf steht als fertig, nur Schritt 4 nennt eine Zeitangabe (spätestens 7 Tage nach dem Fußscan, Angabe des Nutzers). Schritt 3 und 4 haben dieselben Bilder wie auf der B2B-Seite (Sohle mit "Anna" und "XY GmbH", Paket mit zwei Sohlen). Auf B2C steht "Spätestens 7 Tage" im Bild, auf B2B an der Stelle der Knopf "Jetzt bestellen".

### Fragen-Akkordeon (Mitarbeitende)
Status: gebaut
- `details` und `summary`, Fragen als ganze Sätze. Ab sieben Fragen in zwei Gruppen mit `h3` (Klassen `etikett fragen__titel`): zuerst allgemeine Fragen, dann Markenfragen. Fragen und Antworten folgen `VOICE.md`, Abschnitt "FAQ". Antworten ohne Beleg in `FACTS.md` stehen als Platzhalter. Strukturierte Daten (FAQPage) enthalten nur beantwortete Fragen und gleichen wörtlich dem sichtbaren Text.

### Betriebsratsband
Status: gebaut
- Farbiges Band mit einer Aussage und einem Verweis auf die B2B-Seite für den Betriebsrat.

### Hinweis an den Arbeitgeber
Status: gebaut
- Vorlage für eine Mail an den Arbeitgeber (förmlich, "Sie") als Text zum Kopieren und als Datei in `assets/downloads/`. "[Link zur Seite]" wird beim Kopieren durch den Link auf den B2B-Bereich ersetzt.

## Übergreifend

### Geschichte-Abschnitt
Status: gebaut
- Abschnitt `#geschichte` der B2B-Startseite (die Unterseite `b2b/roderich.html` gibt es nicht mehr). Kurze Sätze in Roderichs Ich-Form, jeder Abschnitt mit etwas zum Anfassen (Achtung: `.weg` ohne `svg` ist dieser Weg, `svg.weg` der Grundriss auf der Arbeitsschutz-Seite):
  - Kopf (dunkel): Porträt-Platzhalter und sein Satz zu Kraft und Vorfreude nach der Schicht, dazu "Lassen Sie mich erklären".
  - **Kopf**: Roderichs Satz als `h2` in Anführungszeichen über die volle Breite, darunter in einer Zeile ein kleines Porträt-Platzhalterbild (`geschichte__sprecher`), "Roderich, Gründer von VIANU" und der Folgesatz. Niedrige grüne Fläche, damit "Mein Weg" im ersten Bild sichtbar bleibt.
  - **Mein Weg** (`data-stationenweg`): fünf Stationen als Fußspuren auf einer gestrichelten Linie, links nach rechts: 20 Jahre, WOYTON, Yum!, Ausbildung, VIANU. Unter dem Etikett jedes Schuhs steht die Jahreszahl (`weg__jahr`, bei "20 Jahre" keine), im Feld steht sie über der Überschrift. Klick, Darüberfahren mit der Maus und Zurück/Weiter wählen eine Station, die Fußspuren bis dorthin werden pink. Die Bühne zeigt links Überschrift und Satz, rechts einen Bildplatzhalter (`weg__foto`, 4:3, auf dem Handy darunter). Auf der letzten Station (Darum VIANU) steht in der Steuerung statt "Weiter" der Knopf "Pilot buchen" (`data-weg-pilot`). Die Bühne hat keine feste Höhe. Ohne Skript stehen alle Stationen untereinander. Logik: `initWeg` in `assets/js/b2b.js`.
  - **So sehen unsere Kunden uns** (`#stimme-frueh`, Kapitel vor "Ihre Schicht"): die Stimme eines Pilotkunden als Platzhalter (Zitat nur mit schriftlicher Erlaubnis, mit Namen und Funktion).
  - **Ihre Schicht** (`data-boden`): "Wie lange stehen Ihre Leute?" Ein Regler (0 bis 12 Stunden, Vorgabe 1) füllt die Druckkarte: bei 0 keine Punkte, bei 1 wenige vereinzelte. Ab 4 Stunden erscheinen die Tätigkeitskacheln (`data-boden-kacheln`, `.kachel` als Buttons mit `aria-pressed`, Einfachauswahl, Gliederung und Quellen in `docs/research/taetigkeiten.md`). Nach einer Auswahl erscheinen der Hinweis "Genau für Ihre Mitarbeitenden gibt es unsere Sohle." und die Anfrage-Strecke. Ab 10 Stunden erscheint Roderichs Satz auf pinkem Grund (`boden__roderich`). Fällt der Regler unter 4, ist alles dahinter wieder verborgen und zurückgesetzt. Die Karte bleibt schematisch (Bildbeschreibung und Bildunterschrift für Screenreader). Der Regler wirkt auch bei reduzierter Bewegung. Die Punkte entstehen erst, wenn die Karte sichtbar ist (`initDruckkarte` in `assets/js/b2b.js`), sonst bliebe sie in versteckten Bereichen leer. Jeder Punkt liegt vollständig im Umriss (Abstand zum Strich, `kreisInnen`). Die Sohle klebt unter der Menüleiste und ist so hoch begrenzt, dass sie ganz sichtbar bleibt; unter dem Text bleibt dafür Platz.
  - **Anfrage-Strecke** (`data-strecke`, `initAnfrageStrecke`): fünf Pflichtfragen nacheinander (Anzahl der Mitarbeitenden ab 10, Rolle, Unternehmen, E-Mail, Weg der Aufmerksamkeit mit Freitext). Jeder Schritt erscheint erst nach gültiger Antwort und Klick auf "Weiter" (Enter geht auch). Wird eine Antwort ungültig, verschwindet alles dahinter. Am Ende erscheinen Einwilligung und "Anfrage absenden", der Knopf ist gesperrt, bis alles gültig ist. Versand gibt es noch nicht, unter dem Knopf steht nur "Tool zur Erfassung fehlt noch.". Stunden und Branche kommen aus Regler und Kachel. Prüfregeln in `assets/js/formular.js` (`emailGueltig`, `mitarbeitendeGueltig`, `unternehmenGueltig`).
  - **Die Sohle** (Signalfläche): drei Schritte mit Symbolen (Fußerfassung, Anfertigung, Im Schuh) und der Satz "Wir verkaufen individuell angefertigte Einlegesohlen für Teams, die viele Stunden am Tag auf den Beinen sind."
- Der rote Faden: Jede Station ist eine Spur auf dem Weg, am Ende steht die Sohle. Keine neuen Fakten, keine Wirkaussage. Roderich bestätigt den Wortlaut vor dem Live-Gang. Die Briefe der Rollenseiten verlinken auf `./#geschichte`.

### Stimme (B2B-Verwendung)
Status: gebaut (Vorlage)
- Dieselbe Karte wie auf der Mitarbeitenden-Seite, mit Platzhaltertext zu Preis und Aufwand, Vorname und Funktion. Steht früh nach der Geschichte und noch einmal im Schlussabschnitt.

### Fußform (Sorgen und Bedenken)
Status: gebaut
- Die sechs Sorgen-Kacheln sind auf den Umriss eines rechten Fußes von unten zugeschnitten (Ferse links, fünf Zehen rechts, Gewölbe eingezogen). Der Umriss liegt als Linie darüber (`.sorgen__umriss`). Auf dem Handy bleibt die Mini-Fußform mit den sechs Zonen. Form als Polygon in Prozent, ohne Verweise auf ids.

### Rechtsseite
Status: gebaut
- `impressum.html` und `datenschutz.html` im Hauptordner, für beide Bereiche. Gliederung mit Pflichtabschnitten als Definitionsliste, jede Firmenangabe ein markierter Platzhalter (`data-platzhalter`), `noindex` bis zu den echten Angaben. Die Datenschutzerklärung enthält zusätzlich die Liste "Was diese Seite tut und nicht tut" mit Aussagen, die der Code belegt. Test: `tests/rechtsseiten.test.js`.

### Platzhalter
Status: geplant
- Zweck: Alles, was noch fehlt, bleibt sichtbar markiert, auch auf der Live-Seite. Das gilt für Bilder, Videos, Aussagen und Stimmen.
- Aufbau: Fläche in der vorgesehenen Größe und im vorgesehenen Seitenverhältnis, gestrichelter Rahmen in `--farbe-gedaempft`, Etikett "Platzhalter" in Space Mono (Versalien), darunter ein bis zwei kurze Sätze, was hier hinkommt.
- Bei Bildern: Motiv, Ausschnitt und Aussage in einem Satz, dazu das Seitenverhältnis. Beispiel: "Bild: Küchenpass zur Stoßzeit, Hände beim Anrichten, Boden im Blick. Querformat 16:10."
- Bei Video: Wer spricht, worum geht es, ungefähre Länge. Beispiel: "Video: Roderich über seine Zeit auf hartem Boden, etwa eine Minute."
- Bei Aussagen: Von wem sie sein soll und was sie belegt. Beispiel: "Aussage einer Orthopädin zur Abgrenzung der Einlegesohle. Nur mit Freigabe."
- Barrierefreiheit: Der Platzhalter ist als Text lesbar ("Platzhalter: ..."), nicht als Bild mit erfundenem Alternativtext.
- Auszeichnung im HTML: Das Attribut `data-platzhalter` am Element, damit sich alle offenen Platzhalter finden lassen.
- Regel: Ein Platzhalter erscheint nie als echter Inhalt. Stockfotos sind kein Ersatz.

### Scrollposition beim Neuladen
Status: gebaut
- Jede Seite merkt sich ihre Scrollposition je Pfad (`sessionStorage`) und stellt sie beim Neuladen und beim Zurückgehen wieder her, ohne weiches Scrollen. Neue Aufrufe und Anker verhalten sich wie bisher. Die Seite wächst beim Laden noch, deshalb setzt das Skript die Position mehrmals, bis der Besucher selbst scrollt. Logik: `assets/js/position.js`, Test `tests/position.test.js`.
