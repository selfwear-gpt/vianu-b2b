# Bausteine

Katalog aller Bausteine der Seite. Jede Seite wird aus diesen Bausteinen zusammengesetzt. Ein neuer Baustein kommt erst hierher, dann in den Code. Status: **geplant**, **gebaut**.

Alle Bausteine nutzen nur Tokens aus `DESIGN.md` und die Begriffe aus `GLOSSARY.md`. Pfeile (↗ →) fehlen in den Schriften und werden als SVG-Symbol gesetzt, auch dort, wo dieser Katalog das Zeichen zur Beschreibung nennt.

## Navigation

### Menü B2B-Bereich
Status: gebaut
- Zweck: Orientierung und Hauptaktion in einem festen Balken.
- Aufbau von links nach rechts: Logo, Programm, Ablauf, Preis, "Wer entscheidet mit?" (Auswahl mit fünf Persona-Seiten), FAQ, "Pilot buchen" (hervorgehoben), "Für Mitarbeitende ↗".
- Regeln: bleibt fest, wird nie überdeckt, "Pilot buchen" bleibt auch auf dem Handy sichtbar. Jeder Eintrag der Persona-Auswahl zeigt die Frage der Rolle als Unterzeile.

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
- Links die Überschrift in Schichtsprache und der Button "Pilot buchen". Rechts ein Video-Platzhalter mit dem Gründer (Vorschaubild, Start auf Klick, mit Ton).
- Der Slogan steht unter der Überschrift. Die endgültige Überschrift ist offen.
- Regel: kein zentrierter Hero mit zwei Buttons.

### Hero Mitarbeitende
Status: gebaut
- Links oben der Slogan in großer Schrift mit Unterzeile, rechts oben der Video-Platzhalter.

## Inhalt B2B

### Programmblock (Reiter)
Status: gebaut
- Heißt "Was Sie bekommen" und steht weit unten auf der B2B-Startseite, nach den Sorgen. Drei große Reiter (Vor dem Start, Im Piloten, Danach) mit Nummer, Symbol und Titel, darunter eine dunkle Bühne mit dem Inhalt des gewählten Reiters: Freigabepaket (drei Unterlagen als "In Arbeit"), Durchführung (Fußerfassung, Lieferung spätestens 7 Tage danach, Aufwand als Platzhalter), Ergebnisbericht (Tragequote, Wahrnehmung, Rückmeldungen). Darunter die vier Merkmale als Chips (kein Messtag, eigenes Handy, vorhandene Schuhe, freiwillig).
- Bedienung: Klick, Tastatur (Pfeile, Pos1, Ende), beim Darüberfahren mit der Maus. Ohne Skript stehen alle drei Felder untereinander. Logik: `initReise` in `assets/js/b2b.js`.

### Messwert-Kacheln
Status: gebaut
- Vier Kacheln: Tragequote, Spürbare Verbesserung, Weiterempfehlung, Wertschätzung. Jede mit einer Frage an die Teilnehmenden und einer kleinen Grafik. Darunter ein Zeitstrahl bis zum Auswertungstermin. Der Zeitraum steht als Platzhalter, bis er entschieden ist.
- Regeln: keine Beispielzahlen, bis es echte Daten gibt. Leerer Zustand zeigt die Frage. Immer "selbst berichtet". Auf Persona-Seiten sind die für die Rolle wichtigen Kacheln größer.

### Preisblock
Status: gebaut
- 120 EUR je Paar offen gezeigt, dazu der Kostenrechner (unten) und "Klein starten" (unten). Darunter Platz für eine Stimme aus dem Piloten (Platzhalter). Kosten je Monat gibt es nicht, weil sie eine Tragedauer voraussetzen.
- Regel: Der Preis steht als "120 Euro je Paar, zuzüglich Umsatzsteuer". Mengenpreise bleiben verborgen.

### Fußabdruck "Sorgen und Bedenken im Entscheidungsteam"
Status: gebaut
- Sechs Kacheln, als Fuß angeordnet (Zehen links, Ferse rechts, Außenecken abgerundet), jede mit Symbol, Rolle und ein bis drei Wörtern. Bei Hover oder Fokus dreht sich die Kachel um. Die Rückseite zeigt die ganze Frage und den Weg zur passenden Persona-Seite. Die Kachel ist ein Link. Reihenfolge nach dem Entscheidungsweg: Zehen (Personal), Ballen innen (Mitarbeitende), Ballen außen (Betriebsrat), Gewölbe (Arbeitsschutz), Ferse oben (Geschäftsführung), Ferse unten (Einkauf). Der Abschnitt trägt die Kennung `wer-entscheidet-mit`.
- Handy: Eine kleine Fußzeichnung bleibt unter dem Menü stehen, beim Scrollen leuchten die Zonen nacheinander auf (die Karte mit der aktiven Zone bekommt eine Signalfläche), sechs Punkte zeigen den Fortschritt, ein Tipp auf Zone oder Punkt springt zur Karte. Die Karten stehen untereinander, Vorder- und Rückseite zusammen.
- Regeln: Vorder- und Rückseite sind echter Text im HTML, jede Kachel ist ein Link. Bei reduzierter Bewegung blendet die Kachel um, statt sich zu drehen. Die Sorgen stehen zusätzlich als einfache Liste im HTML.

### Druckkarte (Bewegung)
Status: gebaut
- Neben dem Schmerztext baut sich beim Scrollen eine Druckkarte des Fußes aus Punkten auf (etwa 290 Punkte in einem Sohlen-Umriss). Niedrige Last erscheint zuerst, das Signal (`--farbe-signal`) zuletzt an der Spitze der Belastung. Vollständig umkehrbar, ohne Zahlen und ohne Vorher-Nachher. Bei reduzierter Bewegung steht die fertige Karte. Die Zeichnung ist schematisch und wird als "keine Messung" gekennzeichnet. Logik: `assets/js/fortschritt.js`.

### Matte-und-Weg (Grafik)
Status: geplant
- Grundriss einer Küche mit einer Matte am Herd. Eine gepunktete Linie zeigt den Weg einer Schicht, beim Scrollen wird sie Station für Station gezeichnet. Ein Satz daneben: "Die Sohle ergänzt die Matte und ersetzt sie nicht." Im Ruhezustand ist die Zeichnung fertig.
- Nur auf der Arbeitsschutz-Seite.

### Kostenrechner
Status: gebaut
- Ein Regler stellt die Schichtzahl ein (20 bis 600, Schritt 10, Start 220). Die Seite rechnet 120 Euro geteilt durch diese Zahl und zeigt das Ergebnis in Euro und Cent, gekennzeichnet "gerechnet", zuzüglich Umsatzsteuer.
- Regel: Der Rechner nennt den Zeitraum ("Schichten in einem Jahr") und rechnet 120 Euro geteilt durch die Schichten. Er macht keine eigene Aussage zur Haltbarkeit und nennt keine Schichtzahl je Paar als Tatsache. Logik: `assets/js/kosten.js`.

### Klein starten
Status: gebaut
- Zehn Punkte für den Piloten, daneben wachsende Gruppen für weitere Teams und weitere Standorte, in drei Stufen beim Scrollen. Schema ohne Zahlen. Darunter die drei Stufen als Text. Bei reduzierter Bewegung sind alle Stufen sichtbar.

### Bahnen-Ablauf
Status: gebaut
- Vier Schritte in drei Bahnen (Ihr Betrieb, Ihr Team, VIANU) als antippbare Tasten (`aria-pressed`), darunter der Text zum gewählten Schritt. Auf dem Handy stehen die Schritte untereinander, die Bahn steht in der Taste. Kennzeichnung "Entwurf". Logik: `assets/js/ablauf.js`, gemeinsam mit dem Handy-Ablauf.

### Rollen-Rohbau
Status: gebaut
- Fünf Seiten `b2b/<rolle>.html` mit Menü, einem `h1`, der Frage der Rolle und einem Platzhalter, `noindex`. Sie werden mit dem Baustein "Persona-Seite" gefüllt.

### Persona-Seite
Status: gebaut
- Aufbau: Kopf (Rolle, Kernbotschaft, Antwortsatz), "Im Termin", Brief von Roderich, Belege, Messwert-Kacheln (wichtige Werte vorn und größer), rollenspezifischer Baustein, FAQ in zwei Gruppen (die vier wichtigsten zuerst), Weiterleiten mit Einseiter-PDF und Link zum Pilotformular.
- Fünf Seiten: Personal, Geschäftsführung und Betrieb, Arbeitsschutz, Einkauf, Betriebsrat. Jede hat einen eigenen Titel, eine eigene Beschreibung und FAQPage-Daten. Seitentest: `tests/seiten.test.js`.
- Rollenspezifisch: Personal "Ihre Aufgaben im Piloten", Geschäftsführung Kostenrechner und "Klein starten", Arbeitsschutz "Matte und Weg", Einkauf "Preis und Beschaffung" (steht fest und offen), Betriebsrat "Daten und Datenschutz" (Datenfluss).

### Im Termin
Status: gebaut
- Definitionsliste mit fünf Zeilen: "Die Frage der Rolle", Kernbotschaft (steht groß), "So sieht die Seite es", "Der Pilot gilt als Erfolg, wenn", "Das braucht es vor der Freigabe". Die Frage steht hier und nicht im Kopf, damit sie nicht direkt vor der Kernbotschaft steht (Regel "keine Frage mit direkt folgender Antwort"). Der Block ist der Inhalt des Einseiters.

### Brief
Status: gebaut
- Dunkle Fläche mit dem Brief von Roderich an die Rolle: Etikett, zwei Absätze, Unterschrift in Signalfarbe. Der Brief greift den Einwand der Rolle auf und nennt nur Aussagen aus `FACTS.md`. Wortlaut von Roderich zu bestätigen.

### Beleg-Block
Status: gebaut
- Karten mit Quelle, Titel, Aussage und Zitat mit Link auf die DOI, daneben markierte Platzhalter (Pilotkunde, Orthopäde, Patent, Betriebsvereinbarung). Darunter der Hinweis, dass keine Studie Hotellerie oder Gastronomie untersucht. Studien stehen nur auf der Seite der Rolle, deren Frage sie beantworten.

### Matte und Weg
Status: gebaut
- Grundriss einer Küche als Vektorzeichnung, Matte am Herd, gepunktete Linie und Fußspuren entlang des Weges einer Schicht. Beim Scrollen wird der Weg Station für Station gezeichnet, beim Zurückscrollen läuft er rückwärts. Die Stationen stehen als nummerierte Liste (die Reihenfolge ist der Weg), kein Text in der Zeichnung. Bei reduzierter Bewegung ist die Zeichnung fertig. Logik: `assets/js/rollen.js`.

### Datenfluss
Status: gebaut
- Fünf Knoten mit Pfeilen: Mitarbeitende, offen (Verarbeitung der Fotos), VIANU, Ihr Betrieb, offen (Einsicht in die Teilnahme). Bekannte Knoten sind durchgezogen, offene gestrichelt und gedämpft. Auf schmalen Bildschirmen stehen sie untereinander. Keine Datenschutzzusage.

### Einseiter
Status: gebaut
- Druckstil jeder Rollenseite: Es bleiben Name, Frage, Kernbotschaft, "Im Termin" und die Kontaktzeile stehen, alles andere entfällt. `scripts/erzeuge-pdf.js` erzeugt daraus `assets/downloads/rolle-<id>.pdf` und prüft, dass jede Datei eine Seite hat.

### FAQ-Akkordeon
Status: gebaut
- Frage als Überschrift, Antwort in ganzen Sätzen, der erste Satz beantwortet die Frage. Alle Antworten stehen im HTML. Aufbau, Fragearten und Gruppen wie im Baustein "Fragen-Akkordeon (Mitarbeitende)", Regeln in `VOICE.md`, Abschnitt "FAQ".

### Pilotformular (Popup)
Status: gebaut
- Jeder Knopf "Pilot buchen" öffnet ein Popup (`<dialog data-pilot-dialog>`, `assets/js/pilot.js`) statt zum Formular zu springen. Auch `#pilot` oder `?pilot` in der Adresse öffnen es. Esc, Schließen-Knopf oder Klick auf den Hintergrund schließen, der Fokus kehrt zum Auslöser zurück. Das Popup steht auf der B2B-Startseite und auf jeder Rollenseite.
- Pflichtfelder: Unternehmen, Rolle, Zahl der Mitarbeitenden, E-Mail oder Telefon, "Wie sind Sie auf uns aufmerksam geworden?" (acht Antworten, überschneidungsfrei, "Anderer Weg" zuletzt: Suche mit einer KI, Suche bei Google oder einer anderen Suchmaschine, soziale Netzwerke, Empfehlung eines anderen Unternehmens, Empfehlung einer Mitarbeiterin oder eines Mitarbeiters, Kontaktaufnahme durch VIANU, Presse, Fachmedium oder Veranstaltung, Anderer Weg), Freitext dazu (höchstens 500 Zeichen), Einwilligung. Prüfung im Browser mit Fehlermeldung je Feld (`assets/js/formular.js`). Versand ist noch nicht angebunden: Das Popup zeigt die Anfrage als Entwurf zum Kopieren.
- Regeln: Spamschutz ohne Fremdserver, Bestätigung mit klarer Antwortzeit (noch festzulegen).

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
- Zweites Feld "Dein Unternehmen" (höchstens 18 Zeichen, Buchstaben, Ziffern, Leerzeichen und `& . - '`). Der Firmenname steht klein und hochkant am Fersenende der Sohle, in derselben Gravur-Optik, und schrumpft bei langen Namen. Die Ansage für Screenreader nennt beides.
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
- Bei Schritt 1 sitzt im Handybild unter den beiden Karten ein Knopf "Arbeitgeber anfragen" (`data-cta-schritt="1"`, `data-teilen-oeffnen`), der das Teilen-Feld öffnet. Der Ablauf steht als fertig, nur Schritt 4 nennt eine Zeitangabe (spätestens 7 Tage nach dem Fußscan, Angabe des Nutzers).

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
- Abschnitt `#geschichte` der B2B-Startseite (die Unterseite `b2b/roderich.html` gibt es nicht mehr). Er erzählt in Kapiteln und lässt aus der Geschichte folgen, was VIANU verkauft:
  - Kopf (dunkel): Porträt-Platzhalter, Roderichs Satz zu 10 bis 12 Stunden auf hartem Boden, drei Kennzahlen (20+ Jahre Gastronomie, 4 Mio. Euro mit dem Hinweis "Eigene Angabe von Roderich", 2020 WOYTON im eigenen Exit verkauft), vier Stationen in einer Leiste, Platzhalter für Firmenlogos.
  - Kapitel 1 "Der Boden": Text und Druckkarte (`data-druckkarte`) mit Legende "schematisch, keine Messung".
  - Kapitel 2 "Die Sohle" (Signalfläche): was entsteht, drei Schritte mit Symbolen (Fußerfassung, Anfertigung, Im Schuh) und der Satz "Das verkaufen wir: individuell angefertigte Einlegesohlen für Teams, die viele Stunden am Tag auf den Beinen sind."
  - Kapitel 3 "Ihr Unternehmen": Roderichs Satz und der Weg über den Piloten, mit Knopf "Pilot buchen".
- Keine Wirkaussage. Roderich bestätigt den Wortlaut vor dem Live-Gang. Die Briefe der Rollenseiten verlinken auf `./#geschichte`.

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
