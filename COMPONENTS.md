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
  - **Freigabepaket** ("Die Unterlagen, mit denen Sie intern freigeben"): drei Unterlagen mit Nutzen, Stand "Entwurf" und Download als Textdatei (`assets/downloads/`: Vorlage Betriebsvereinbarung, Datenschutzkonzept, Auftragsverarbeitungsvertrag). Kein Einleitungs- oder Prüfhinweis über der Liste (Entscheidung des Nutzers am 15.10.2026). Der Stand "Entwurf" an jeder Unterlage bleibt.
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

### Zufriedenheitsgarantie
Status: Inhalt vom Nutzer vorgegeben (19.10.2026)
- `#garantie` auf der B2B-Startseite (Sie, mit Sohlenfoto-Platzhalter), auf der Seite für Mitarbeitende (Du, ohne Foto), auf Geschäftsführung (kurz) und als sechste Zahlenkachel auf Einkauf. Drei Schritte (`garantie__schritt`): persönliches Online-Gespräch, nachbessern oder neu fertigen kostenlos, vollständige Erstattung des Kaufpreises.
- Mit Foto-Platzhalter (B2B-Startseite): drei Zeilen mit Hover wie die Tabellenzeilen. Ohne Foto (B2C, Geschäftsführung): Zufriedenheitskurve `garantie__kurve` (`data-garantie-kurve`) mit Tief (1 Gespräch), Hoch (2 Nachbessern oder neu fertigen) und Plateau (3 Kaufpreis zurück), die Linie zeichnet sich beim Scrollen. Abschluss: "Für uns zählt, dass die Sohle für jede Person im Team (B2C: für dich) etwas bringt."
- Offen und nicht auf der Seite: Frist, wer das Gespräch vereinbart, wie "nicht zufriedenstellend" festgestellt wird.

### Sohlenfoto-Platzhalter, Kontaktwahl, Sitzungsspeicher
- `platzhalter--sohle` (4:3): Platzhalter für ein Produktfoto der Sohle. Neben den Abschnitten "Termin" der fünf Rollenseiten (Hülle `seitenfoto`, rechts, auf dem Handy darunter, im Druck ausgeblendet), bei Betriebsrat auch neben "Was Sie von uns erhalten", auf der B2C-Seite unter "Das alles in einer Sohle". Beim Preisregler der B2B-Startseite (`preisrechner__foto`) wächst er mit dem Regler von 5 auf 18 rem und wird nie wieder kleiner (`--sohle-anteil`, gesetzt in `initRechner`).
- `data-kontaktwahl` (pilot.js): Jeder Kontakt-Knopf (`data-pilot-oeffnen`, auch im Menü) öffnet zuerst die Wahl "Per Formular" oder "Per Telefon". Telefon: auf dem Handy (`pointer: coarse` und höchstens 56 rem) startet `tel:+4915678548855` die Telefon-App, sonst stehen Nummer und "Nummer kopieren" da. Der Hörer im Chatkopf (`data-telefon-oeffnen`) zeigt nur den Telefonweg. `data-direkt-formular` am Auslöser überspringt die Wahl. Das Chat-Anliegen öffnet das Formular über das Ereignis `pilot:formular`.
- `sitzung.js` (`VianuSitzung`): Eingaben in `[data-feld]`, Stundenregler und Branchenkachel bleiben im `sessionStorage` (nur dieser Tab, nie das Einwilligungskästchen) und füllen Formular und Anfrage-Strecke vor. Alle Formulare tragen das Kästchen mit Link zur Datenschutzseite.

### Rollen-Rohbau
Status: gebaut
- Fünf Seiten `b2b/<rolle>.html` mit Menü, einem `h1`, der Frage der Rolle und einem Platzhalter, `noindex`. Sie werden mit dem Baustein "Persona-Seite" gefüllt.

### Persona-Seite
Status: gebaut
- Aufbau: Jede Seite hat eine eigene Reihenfolge und ein eigenes Leitelement, kein Abschnitt besteht nur aus Fließtext. Gemeinsam sind Kopf mit Motiv (Einseiter) vorn, der Chat-Brief sowie FAQ in zwei Gruppen und Weiterleiten mit Einseiter-PDF am Ende. Reihenfolgen: Personal: Aufgaben (Weg), Messwerte (Umfrage), Termin (Rubriken), Brief (Chat), Belege (Ergebnisbilder). Geschäftsführung: Kosten, Termin (Rubriken), Messwerte, Belege, Brief. Arbeitsschutz: Weg (Grundriss), Belege, Termin (Prüfliste), Messwerte, Brief. Einkauf: Beschaffung, Termin (Fragenkarten), Brief, ohne Messwerte und Belege. Betriebsrat: Datenfluss mit Kasten "Steht fest, noch offen", Termin (Fragenkarten als Reihe), Unterlagen (Dokumentkacheln), Brief, ohne Messwerte und Belege. Test: `tests/rollen.test.js`, Textanteil: `scripts/check-textanteil.py`.
- **Kopf mit Motiv** (`rolle__raster`, `rolle__motiv`, `motiv`): Text links, rechts eine Zeichnung je Rolle, die beim Laden etwa 3 bis 4 Sekunden läuft und dann im fertigen Bild ruht (`m-zeichnen`, `m-pop`, `m-auf`, `m-blatt`, Verzögerung `m-d0` bis `m-d13`). Bei reduzierter Bewegung steht sie sofort fertig da, im Druck ist sie ausgeblendet. Personal: Fußspuren eines Schichttags von 8 bis 17 Uhr. Geschäftsführung: zehn Sohlen, große 10, Kalenderblatt. Arbeitsschutz: Küchengrundriss mit Matte und Schichtweg. Einkauf: Preisschild, Sohlenbündel, Lieferleiste. Betriebsrat: Smartphone, Sohle, Bericht mit durchgezogenem und gestricheltem Pfeil.
- **Preisstreifen** (`preisstreifen`) unter dem Kopf von Personal, Geschäftsführung, Arbeitsschutz und Einkauf: "10 Paare, 1.200 Euro zzgl. Umsatzsteuer", "Mitarbeitende zahlen nichts", "Lieferung spätestens 7 Tage nach der Fußerfassung". Der Betriebsrat trägt keinen.
- Inhalte aus dem Persona-Papier (15.10.2026) fließen in vorhandene Elemente ein, es gibt keinen Abschnitt je Feld: Kontext, Antrieb und Ziel in Kopf und Rubriken, Erfolgsdruck, Einwand und nächster Schritt im Chat, nächster Schritt außerdem in der Druckzeile des Einseiters. Der Betriebsrat hat im Papier keine Persona. Wortlaut: `tests/fixtures/rollen-wortlaut.json`.
- Fünf Seiten: Personal, Geschäftsführung und Betrieb, Arbeitsschutz, Einkauf, Betriebsrat. Jede hat einen eigenen Titel, eine eigene Beschreibung und FAQPage-Daten. Seitentest: `tests/seiten.test.js`.
- Alle Rollenseiten tragen die gemeinsame Sohlenzeichnung (`#sohle-form`), die Fußspuren, Weg, Bündel und Motive verwenden.

### Im Termin
Status: gebaut
- Der Abschnitt heißt je Seite anders und konkret (Personal "Was Sie Ihrer Geschäftsführung vorlegen", Geschäftsführung "Was Sie für Ihre Entscheidung brauchen", Arbeitsschutz "Was Sie bei der Begehung vorlegen", Einkauf "Zahlen, die Sie im Einkaufsgespräch brauchen", Betriebsrat "Was Sie in der Betriebsratssitzung klären können"). Jede Seite hat eigene Rubriken mit höchstens zwei Sätzen. Offene Punkte tragen das Etikett "Offen". Der Abschnitt bleibt `einseiter` und liefert die Einseiter-PDF mit der Druckzeile "Nächster Schritt ... Ansprechpartner: Roderich".
- Formen: Rubriken-Liste (`rubriken`, großes Stichwort links, Satz rechts, Personal und Geschäftsführung; `rubriken--icons` auf beiden: kleines Symbol links, Zeile hebt sich beim Darüberfahren ab, nicht klickbar), umdrehbare Fragenkarten (`fragenkarten--fuenf` auf Einkauf, `fragenkarten--reihe` auf Betriebsrat), Prüfliste (`pruefliste`, Arbeitsschutz: fünf Schalter zum Abhaken, nur Ansicht, nichts wird gespeichert). Logik: `initPruefliste` in `bausteine.js`.

### Brief
Status: gebaut
- **Chat-Brief** (`chat`, `data-chat`): Der Brief ist ein Chat im Handy-Rahmen (große Rundung, dicke Kante, Kopf "Der Vianu Gründer Roderich Körner-Rehn", Hörer-Symbol öffnet das Kontaktformular, Drei-Punkte-Menü mit "Chat von vorne starten", Eingabefeld mit Platzhalter und blinkendem Cursor, runder Knopf mit Mikro, der bei Text zum Papierflieger wird und das Formular mit der Nachricht im Feld "Ihr Anliegen" öffnet; Logik `initChatLeiste`). Keine Dauerknöpfe: die nächste Nachricht kommt nur durch Scrollen (in Rahmen ohne Scrollen per Mausrad, Wisch oder Tippen über dem Chat, kein Selbstlauf). Die letzte Nachricht ist ein Satz mit unterstrichenem Textlink (`chat__blase--link`, `chat__link`) zum Kontaktformular. Roderichs Nachrichten tragen sein Foto (`assets/img/roderich.jpg`, rund). Am Ende wird aus den drei Punkten ein Kreispfeil, der den Chat neu startet. Der Hinweis erscheint erst nach 3 Sekunden Ruhe. Nach dem Ende schrumpft die Scroll-Strecke (`chat--kurz`), sobald der Besucher darunter weiterscrollt. Hinweis `chat__hinweis` bis zum Ende. Läuft auch in der Gesamtvorschau: versteckte Seiten starten erst, wenn sie sichtbar werden. Der Chat steht an dritter Stelle jeder Rollenseite. Er ist ein Chat in VIANU-Farben (kein WhatsApp-Grün, kein Logo). Links schreibt immer die Rolle (rundes Rollen-Icon, Haken "gelesen"), rechts antwortet Roderich (runder Foto-Platzhalter an jeder Nachricht, markiert, bis das Foto da ist). 6 bis 10 Nachrichten, je höchstens 18 Wörter. Der Chat klebt beim Scrollen fest, mit jedem Scrollschritt oder Klick auf "Weiter" erscheinen erst Tippen-Punkte, dann springt die nächste Nachricht auf. Unten ein Antwortfeld mit dem Knopf "Kontakt aufnehmen", darunter Unterschrift und Link zu Roderichs Geschichte. Alle Nachrichten stehen im HTML. Bei reduzierter Bewegung und ohne Skript stehen sie sofort da, im Druck entfällt der Chat. Läuft die Seite in einem Rahmen ohne eigenes Scrollen (zum Beispiel in der Artifact-Vorschau, die sich auf die volle Höhe streckt), starten die Nachrichten automatisch nacheinander, sobald der Chat im Bild ist (Klasse `chat--ohnescroll`, IntersectionObserver). Ein Tipp auf das Fenster zeigt die nächste Nachricht ebenfalls. Logik: `initChat` in `bausteine.js`. Nur Aussagen aus `FACTS.md`. Wortlaut von Roderich zu bestätigen.

### Beleg-Block
Status: gebaut
- **Studienkarten zum Herunterladen** (`dreh studienkarte`, `data-ergebnis`, Skript `studien.js`): Vorderseite nur Überschrift, Bild und Download-Zeichen, Rückseite (Hover oder Fokus) nur die Aussage (zentriert, ohne Vorderseite verständlich), klein Autoren und Jahr und der Knopf "Studie herunterladen". Das Bild baut sich beim ersten Darüberfahren auf, die Karte dreht erst danach um (`data-warte`), der das Popup `data-studie-dialog` öffnet (E-Mail-Adresse, nur geprüft). Der Download trägt den Studiennamen. Vorläufer: Ergebnisbilder (`ergebnisse`, `ergebnis`) statt Studienkarten, nur auf Personal (Abdelsalam als Balken 46,1 Prozent, Tarrade als zwei Säulen ohne Zahlen) und Arbeitsschutz (Tarrade als zwei Säulen, Kang als 26 Kästchen). Jedes Bild trägt Alternativtext, eine feste Fußleiste mit Gruppe, "Selbstauskunft" bzw. Förderhinweis und die Fundstelle mit Link auf die DOI. Der Balken baut sich beim Sichtbarwerden auf (`initErgebnis`). Unter den Bildern steht kein Hinweis und die Belege haben keine Unterüberschrift (Entscheidung vom 16.10.2026). Einkauf und Betriebsrat haben keine Belege.

### Messwerte-Umfrage (Rollenseiten)
Status: gebaut
- Die vier Fragen am Ende des Piloten als Umfrage in einem Smartphone (`umfrage`, `data-umfrage`), Kennzeichnung "Frage an die Teilnehmenden", Antworten Ja und Nein nur zur Ansicht antippbar, nichts wird gespeichert, keine Zahlen. Daneben die Liste der vier Messwerte, die für die Rolle wichtigen hervorgehoben. Personal: nur das Telefon mit vier Fragen (`umfrage--allein`), ab drei beantworteten Fragen erscheint der Knopf "Pilot anfragen" (`data-umfrage-pilot`, öffnet das Formular). Geschäftsführung und Arbeitsschutz: zwei Fragen mit Liste. Einkauf und Betriebsrat zeigen keine Messwerte. Logik: `initUmfrage`.

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
- Rezensionskarte unter der Überschrift "Aber hör nicht auf mich, hör auf andere in deiner Situation": großes Anführungszeichen in Signalfarbe, Zitat, rundes Porträtfeld, Vorname, Jobtitel, Signal-Versatz. Heute trägt sie den Platzhaltertext und ist mit `data-platzhalter` markiert. Keine Sterne und keine Bewertungszahl, weil beides Daten wären, die es nicht gibt.
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

### Break-even-Rechner (Geschäftsführung)
Status: gebaut
- `breakeven`, `data-breakeven` im Seitenkopf der Geschäftsführung (statt Motiv). Zwei Regler (Kosten je Fehltag, Fehltage je Teilnehmendem), Ergebnis: Pilotpreis in Fehltagen, Fehlzeitkosten der 10 Teilnehmenden, Anteil des Pilotpreises. Reine Rechnung mit Besucherzahlen (`kosten.js`: `fehltageFuerPreis`, `fehlzeitKosten`, `anteilPreis`, `euro`), Hinweis "VIANU sagt nicht, dass Fehltage sinken". Logik: `initBreakEven` in `b2b.js`. Im Druck ausgeblendet.
- Preiskacheln unter dem Kopf (`preisstreifen`) gibt es nicht mehr.

### Einkauf: Punkte mit Symbol und Sprungleiste
Status: gebaut
- `sprung` (Chips mit Ankerlinks) und `punkte`/`punkt` (Karten mit Symbol `punkt__icon`, Überschrift, Satz `punkt__satz`, optional Status `punkt__status`) ersetzen die Statusliste mit Filter. Sprungziele: `e-preis`, `e-lieferung`, `e-menge`, `e-bestellung`, `e-nachfertigung`, `e-marke`, `e-datenblatt`. Die Karten heben sich beim Darüberfahren ab und sind nicht klickbar. Der Termin-Abschnitt trägt Symbole (`fragenkarte__icon`) statt Zahlen. Im Betriebsrat-Datenfluss tragen die Stationen Symbole (`fluss__icon`), es gibt keine offenen Stationen mehr.

### Arbeitsschutz: Matte gegen Sohle, Hero und Prüfliste (17.10.2026)

- Hero-Schaubild: Sohle mit drei Druckpunkten, Linien zu Schichtbeginn, Mittag und Feierabend (`motiv__sohle`).
- `weg` (Abschnitt "Arbeitsplatzmatte und Sohle: Wo hilft was?"): Küchengrundriss mit Matte, Fußspuren links und rechts. Die Namen der Stationen (`weg__etikett` in `data-weg-etiketten`) poppen an der Station auf, solange die Fußspuren dort sind, und verschwinden beim Weiterscrollen (`rollen.js`). Rechts drei nummerierte Schritte (`weg__schritte`: Die Matte, Der Weg, Die Sohle), darunter ein Absatz `weg__fazit`.
- `pruefliste` mit Knopf `pruefliste__pilot` (`data-pruefliste-pilot`, "Kontakt anfragen"), erscheint ab drei Haken. Der Haken sitzt mittig im Kästchen.
- Beleg-Balken Beginn und nach 3 Wochen haben links eine Achse mit Beschriftung (`ergebnis__achsentext`, kleine Schrift).

### Einkauf: Bestellstrecke und Zahlenkacheln

- `bestellstrecke` (`data-bestellstrecke`): fünf Stationen mit Symbol (Anfrage, Angebot, Bestellung, Marke, Nachfertigung), die Linie füllt sich beim Scrollen, rückwärts beim Zurückscrollen. Ersetzt Sprungleiste und `punkte`. Ohne Skript stehen alle Stationen aktiv da.
- `zahlenkacheln`/`zahlenkachel`: große Zahl (1.200 €, 0, 14 Tage, 7 Tage, Logo), Etikett, Satz. Kacheln heben sich beim Darüberfahren. Darunter Knopf "Weitere Fragen klären" zum Kontaktformular. Ersetzt die Drehkarten.
- Hero: Gegenüberstellung "Ihr Aufwand" und "Unser Aufwand", Preis nur als Zeile "Test mit 10 Mitarbeitenden".

### Betriebsrat: Datenreise mit Karte und Tagesordnung

- `fluss--karte` (`data-fluss-hover`): Umriss von Deutschland (aus den Ländergrenzen von Natural Earth, 1:50 Mio., gemeinfrei, auf etwa 130 Punkte vereinfacht, ohne EU-Umrandung; `karte__de` und die Legendenzeilen leuchten bei Verarbeitung und Druck auf) neben fünf Zeilen. Mit der Maus öffnet schon das Darüberfahren die Zeile, sonst Klick oder Tippen. Die Statusübersicht `stand-kasten` am Seitenanfang entfällt.
- `tagesordnung`/`top`: nummerierte, aufklappbare Zeilen mit Symbol statt Drehkarten (`data-tagesordnung`), nur feststehende Aussagen. Ohne Skript und im Druck steht jeder Text da.

### Downloads mit E-Mail-Adresse
- Jeder Download (Verweise mit `data-studie-datei`, `data-studie-name`, `data-studie-titel`) öffnet das Popup `data-studie-dialog` (studien.js), prüft die E-Mail-Adresse und startet danach den Download. Ohne Skript führt der `href` direkt zur Datei. Die Adresse wird nicht gesendet und nicht gespeichert.
### Arbeitsschutz: Matte und Sohle
- Der Grundriss beginnt erst, wenn er ganz im Bild ist, und endet, solange er noch ganz im Bild ist. Die Punkte 1 bis 3 daneben erscheinen mit den Stationen (1 am Anfang, 2 bei Service, 3 beim Lager). Keine Stationskreise, Matte oberhalb des Herds, Etikett "Flur".
### Betriebsrat: Datenkarte
- Jeder der fünf Punkte zeigt eine Szene in der Karte (`karte__szene`): Smartphone mit Fußfoto, Schloss "EU" mit "danach gelöscht", Pin "Druck: 48 h", Pfeile zu drei Betrieben, Liste und anonyme Punktewolke. Kein Wort "Deutschland" in der Karte. "Was Sie von uns erhalten" ist der Einseiter-Abschnitt (`#termin`) der Seite.

### Vertrauensleiste, Matte-Sohle hält
- Vertrauensleiste (B2B-Startseite, unter dem Seitenkopf, `kurz kurz--vier`, vier Spalten: Fertigung, 7 Tage, Pilot mit 10, Patente; wie die Kurz-Leiste auf der B2C-Seite): je Spalte ein Satz mit ein bis zwei hervorgehobenen Wörtern (`kurz__wort`): In Deutschland gefertigt (lokal 3D-gedruckt, 48 Stunden), 7 Tage bis vor Ort, Patente mit Nummern (hervorgehoben: Vermessen, Optimierung).
- Arbeitsschutz `#weg`: Überschrift und Grundriss stehen in `weg__stage` und bleiben beim Scrollen stehen (sticky in der Hülle `weg__haelt`, 260 vh). Nur Füße, Etiketten und die Punkte 1 bis 3 bewegen sich. Passt die Bühne nicht ins Fenster oder gilt reduzierte Bewegung, läuft es ohne Halten.

### Fachstimme, Sprunglink, Favicon
- `stimmenpaar` (B2C, B2B-Startseite, Arbeitsschutz, Einkauf, Geschäftsführung, Betriebsrat): Kundenstimme links, Fachstimme rechts (`stimme--fach`, gestrichelter Rand, Etikett "Aus der Orthopädietechnik"), gleich groß, auf dem Handy untereinander. Beides Platzhalter, Person offen. Der alte Platzhalter "Aussage eines Orthopäden" auf Arbeitsschutz entfällt.
- `sprung`: Sprunglink "Zum Inhalt" als erstes fokussierbares Element, nur bei Fokus sichtbar, Ziel `main#inhalt`.
- Favicon `assets/img/favicon.svg` (Sohle in Signalfarbe auf Tinte). Die Farben stehen als Literal in der Datei, weil Favicons keine Variablen nutzen. `tests/seo.test.js` prüft sie gegen `tokens.css`, `check-tokens.py` überspringt die Datei. Der Link kommt aus `scripts/seo.py`.

### Roddys Weg (B2C, `#erlebt`)
Status: gebaut
- Abschnitt zwischen "Das alles in einer Sohle" und `#stimmen`. Leitsatz "Gemacht von jemand, der das Problem selbst erlebt hat" als `p.leitsatz` (keine Überschrift, mittig, `white-space: nowrap`, Größe per `clamp`, auf dem Handy rund 17 px, damit er in einer Zeile bleibt). Darunter `roddy__name` "Roddy the Barista, Gründer von VIANU".
- Bühne `[data-roddy]` (`assets/js/roddy.js`, braucht `fortschritt.js`): fünf Szenen (2010 Ausbildung, 2012 Yum!, 2020 WOYTON, 20 Jahre harter Boden, Heute VIANU) mit Foto-Platzhalter (`roddy__bild`) und Sprechblase (`roddy__blase`). Rechts ein Fußabdruck, der sich stetig von der Ferse bis zur Zehe pink füllt (Füllstand folgt dem Scrollstand und läuft ihm weich hinterher), am Ende steht der ganze Fuß mit "VIANU" da. Die Bühne klebt (sticky, Hülle 380vh) und läuft beim Zurückscrollen rückwärts.
- Ohne Skript, bei reduzierter Bewegung und wenn die Bühne nicht ins Fenster passt: alle Szenen untereinander, Fuß ganz gefüllt (Zustand `data-bereit` fehlt).
- Die Sätze gelten seit dem 21.10.2026 als geprüft, keine Entwurfsmarkierung. Die Fotos bleiben Platzhalter.
