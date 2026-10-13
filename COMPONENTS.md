# Bausteine

Katalog aller Bausteine der Seite. Jede Seite wird aus diesen Bausteinen zusammengesetzt. Ein neuer Baustein kommt erst hierher, dann in den Code. Status: **geplant**, **gebaut**.

Alle Bausteine nutzen nur Tokens aus `DESIGN.md` und die Begriffe aus `GLOSSARY.md`. Pfeile (↗ →) fehlen in den Schriften und werden als SVG-Symbol gesetzt, auch dort, wo dieser Katalog das Zeichen zur Beschreibung nennt.

## Navigation

### Menü B2B-Bereich
Status: geplant
- Zweck: Orientierung und Hauptaktion in einem festen Balken.
- Aufbau von links nach rechts: Logo, Programm, Ablauf, Preis, "Wer entscheidet mit?" (Auswahl mit fünf Persona-Seiten), FAQ, "Pilot buchen" (hervorgehoben), "Für Mitarbeitende ↗".
- Regeln: bleibt fest, wird nie überdeckt, "Pilot buchen" bleibt auch auf dem Handy sichtbar. Jeder Eintrag der Persona-Auswahl zeigt die Frage der Rolle als Unterzeile.

### Menü Mitarbeitenden-Bereich
Status: geplant
- Aufbau: Logo, "Perspektivwechsel" (dunkel, abgesetzt, Unterzeile "Für die Entscheider-Etage"), Die Sohle, So läuft es ab, Fragen, "Teilen".
- Regeln: "Teilen" bleibt sichtbar.

### Sprachumschalter
Status: geplant
- Zweck: Wechsel zwischen Deutsch und Englisch, oben rechts.
- Englische Fassung: Slogans bleiben Englisch und unverändert. Menüs und Überschriften werden übersetzt, zum Beispiel "Perspektivwechsel" zu "Change of perspective" mit der Unterzeile "For the decision-makers". Deutsch ist die Hauptsprache und steht fest im HTML.
- Offen: Im Konzept liegen "Teilen" und "Für Mitarbeitende ↗" ebenfalls am rechten Rand. Vorschlag: Der Umschalter sitzt ganz rechts, die beiden anderen Einträge direkt daneben. Zu bestätigen.

### Footer
Status: geplant
- Impressum, Datenschutz, Link in den anderen Bereich.

## Einstieg

### Hero B2B
Status: geplant
- Links die Überschrift in Schichtsprache und der Button "Pilot buchen". Rechts ein Video-Platzhalter mit dem Gründer (Vorschaubild, Start auf Klick, mit Ton).
- Der Slogan steht unter der Überschrift. Die endgültige Überschrift ist offen.
- Regel: kein zentrierter Hero mit zwei Buttons.

### Hero Mitarbeitende
Status: gebaut
- Links oben der Slogan in großer Schrift mit Unterzeile, rechts oben der Video-Platzhalter.

### Gründerband
Status: geplant
- Schmales Band unter dem Hero: ein Satz in der Ich-Form, eine Zeile mit Eckdaten, kleines Porträt. Eckdaten brauchen eine Quelle in `FACTS.md`.

## Inhalt B2B

### Programmblock
Status: geplant
- Drei Teile: Freigabepaket, Durchführung, Ergebnisbericht. Dazu die Schritte vom Start bis zur Übergabe und die vier Merkmale (kein Messtag, eigenes Handy, vorhandene Schuhe, übergeben statt verteilt).

### Messwert-Kacheln
Status: geplant
- Vier Kacheln: Tragequote, Spürbare Verbesserung, Weiterempfehlung, Wertschätzung. Jede mit einer Frage an die Teilnehmenden und einer kleinen Grafik. Darunter ein Zeitstrahl bis zum Auswertungstermin. Der Zeitraum steht als Platzhalter, bis er entschieden ist.
- Regeln: keine Beispielzahlen, bis es echte Daten gibt. Leerer Zustand zeigt die Frage. Immer "selbst berichtet". Auf Persona-Seiten sind die für die Rolle wichtigen Kacheln größer.

### Preisblock
Status: geplant
- 120 EUR je Paar offen gezeigt, dazu Kosten je Schicht und Monat (als "gerechnet" gekennzeichnet) und eine Skala vom Piloten zum Rollout ohne Größenauswahl. Daneben Platz für eine Stimme aus dem Piloten (Platzhalter).
- Regel: Der Preis steht als "120 Euro je Paar, zuzüglich Umsatzsteuer". Mengenpreise bleiben verborgen.

### Fußabdruck "Sorgen und Bedenken im Entscheidungsteam"
Status: geplant
- Ein großer Fußabdruck als Vektorzeichnung mit sechs Feldern, jedes eine Kachel mit Symbol und ein bis drei Wörtern. Bei Hover oder Fokus färbt sich die Kachel und dreht sich um. Die Rückseite zeigt die ganze Frage und einen Button zur passenden Persona-Seite.
- Handy: Der Fuß bleibt im Bild, beim Scrollen leuchten die Felder nacheinander auf, die aktive Kachel erscheint als Karte darunter, sechs Punkte zeigen den Fortschritt.
- Regeln: Vorder- und Rückseite sind echter Text im HTML, jede Kachel ist ein Link. Bei reduzierter Bewegung blendet die Kachel um, statt sich zu drehen. Die Sorgen stehen zusätzlich als einfache Liste im HTML.

### Druckkarte (Bewegung)
Status: geplant
- Neben dem Schmerztext baut sich beim Scrollen eine Druckkarte des Fußes aus einzelnen Messpunkten auf. Das Signal (`--farbe-signal`) erscheint zuletzt, an der Spitze der Belastung. Vollständig umkehrbar, ohne Zahlen und ohne Vorher-Nachher.

### Matte-und-Weg (Grafik)
Status: geplant
- Grundriss einer Küche mit einer Matte am Herd. Eine gepunktete Linie zeigt den Weg einer Schicht, beim Scrollen wird sie Station für Station gezeichnet. Ein Satz daneben: "Die Sohle ergänzt die Matte und ersetzt sie nicht." Im Ruhezustand ist die Zeichnung fertig.
- Nur auf der Arbeitsschutz-Seite.

### Persona-Seite
Status: geplant
- Aufbau: Was die Person im Termin vertreten können muss, Brief des Gründers an die Rolle, passende Belege, Messwert-Kacheln mit Erfolgskriterium der Rolle, die wichtigsten drei bis vier Fragen zuerst, Weiterleiten, Link zum Pilotformular.
- Fünf Seiten: Personal, Geschäftsführung und Betrieb, Arbeitsschutz, Einkauf, Betriebsrat.

### FAQ-Akkordeon
Status: geplant
- Frage als Überschrift, Antwort in ganzen Sätzen, der erste Satz beantwortet die Frage. Alle Antworten stehen im HTML. Aufbau, Fragearten und Gruppen wie im Baustein "Fragen-Akkordeon (Mitarbeitende)", Regeln in `VOICE.md`, Abschnitt "FAQ".

### Pilotformular
Status: geplant
- Felder: Unternehmen, Rolle, Zahl der Mitarbeitenden. Der Gründer ist als Kontakt genannt. Einwilligung und Hinweis zum Datenschutz am Formular.
- Regeln: Spamschutz ohne Fremdserver, Bestätigung mit klarer Antwortzeit (noch festzulegen).

### Weiterleiten
Status: geplant
- Link plus einseitige PDF je Rolle, damit die nächste Person im Entscheidungsteam ihre eigene Seite bekommt.

## Inhalt Mitarbeitende

### Teilen
Status: gebaut
- Kleines Menü im Kopf, dazu Knöpfe an anderen Stellen (`data-teilen-oeffnen`): an den Arbeitgeber (erst Abteilung wählen, dann wird der Link der Persona-Seite kopiert) oder an Kolleginnen und Kollegen (Link dieser Seite). Bestätigung "Link kopiert". Wenn der Browser das Kopieren ablehnt, wird der Link zum Kopieren von Hand angezeigt. Die Links auf die Persona-Seiten führen erst ins Leere, bis die Seiten gebaut sind.
- Logik: `assets/js/teilen.js`, Test in `tests/teilen.test.js`.

### Name auf der Sohle
Status: gebaut
- Besucher tippen einen Namen (höchstens 14 Zeichen, nur Buchstaben, Leerzeichen, Apostroph und Bindestrich) und sehen ihn sofort auf der Sohle. Nichts wird gespeichert, ein Hinweis sagt das. Die Buchstaben drücken sich beim Tippen leicht ein. Der Hinweis sagt auch, dass noch nicht feststeht, ob der Name auf die echte Sohle kommt.
- Logik: `assets/js/name.js` (`bereinigeName`), Test in `tests/name.test.js`.

### Werteband
Status: gebaut
- Sechs Werte als ungleich große Kacheln (zwei groß, vier klein) mit je einer kurzen Zeile und einem gezeichneten Symbol: Leicht durch die Schicht, Abende, die dir gehören, Passt in die Schuhe, die du hast, Hält, Bleibt frisch, Dein Name drauf.

### Schichttag
Status: gebaut
- Scrollgeschichte vom Beginn der Schicht bis zum Abend danach, in der Sprache der Bewertungen. Links eine mitlaufende Uhr (bleibt beim Scrollen stehen), rechts fünf Momente. Bei reduzierter Bewegung steht der Zeiger still und die Momente stehen als Liste.

### Handy-Ablauf
Status: gebaut
- Vier Schritte als Knöpfe (aria-pressed) neben einem gezeichneten Handy. Der gewählte Schritt zeigt seinen Bildschirm (Ankündigung, Sucherrahmen mit Fuß, Sohle, Übergabe). Die Zeile unter dem Handy nennt den Schritt als Text.
- Kennzeichnung "Entwurf", solange der Ablauf nicht festgelegt ist. Keine Zeitangaben.

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
