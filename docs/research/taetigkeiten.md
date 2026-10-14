# Arbeitsbereiche für die Kachelauswahl "Art der Tätigkeit"

Stand: 14.10.2026. Zweck: Gliederung für den B2B-Regler "Stunden pro Schicht" mit anschließender Kachelauswahl. Die Kacheln nennen nur Orte und Tätigkeiten, keine Zahlen und keine Wirkaussagen.

## 1. Quellen

| Quelle | URL | Abruf | Hinweis |
|---|---|---|---|
| Statistisches Bundesamt, Klassifikation der Wirtschaftszweige, Ausgabe 2008 (WZ 2008), Methodenseite | https://www.destatis.de/DE/Methoden/Klassifikationen/Gueter-Wirtschaftsklassifikationen/klassifikation-wz-2008.html | 14.10.2026 | Gelesen, verweist auf die PDF-Gliederung. |
| Statistisches Bundesamt, Gliederung der WZ 2008 (Arbeitsunterlage, August 2007) | https://www.destatis.de/DE/Methoden/Klassifikationen/Gueter-Wirtschaftsklassifikationen/Downloads/gliederung-klassifikation-wz-3100130089004.pdf | 14.10.2026 | Der Abruf lieferte nur eine HTML-Seite, nicht das PDF. Die Abschnitte und Abteilungen wurden stattdessen aus einer Kopie desselben Dokuments gelesen (nächste Zeile). |
| Kopie der Destatis-Gliederung WZ 2008 (46 Seiten, Kopfzeile "Statistisches Bundesamt, August 2007") | https://gewan-client.bayern.de/mam/gewerbewesen/wz08.pdf | 14.10.2026 | Sekundärer Fundort eines Primärdokuments. Aufbau laut Dokument: 21 Abschnitte (A bis U), 88 Abteilungen (01 bis 99). Abgleich mit dem Destatis-Original steht aus. |
| ILO, ISCO-08 (International Standard Classification of Occupations) | https://www.ilo.org/publications/international-standard-classification-occupations-2008-isco-08-structure | 14.10.2026 | Nur Suchtreffer ausgewertet, Seite nicht gelesen. 10 Hauptgruppen (u. a. 5 Dienstleistungs- und Verkaufsberufe, 7 Handwerksberufe, 8 Anlagen- und Maschinenbedienung, 9 Hilfsarbeitskräfte). Dient nur als Gegenprobe. |
| DGUV Rundschreiben 0321/2013, Anlage 2: ASR A1.2 Raumabmessungen und Bewegungsflächen (Fassung 09/2013) | https://www.dguv.de/rundschreiben/dokcenterimport/2013/0321_2013_anlage_2_asr_a1.2_raumabmessungen_09_2013.pdf | 14.10.2026 | Gelesen. Abschnitt 5.1.2 "Sitzende und stehende Tätigkeiten" und Unterscheidung "überwiegend sitzend" und "überwiegend nichtsitzend" bei den Raumvolumen. Ob dies die aktuelle Fassung der ASR ist, wurde nicht geprüft. |

Nicht erreichbar (HTTP 403): baua.de (Seite zu Stehen und ASR A1.2). Eine Zahl zu stehender Arbeit aus einer Suchzusammenfassung (BAuA-Befragung) ist nicht am Original geprüft und steht deshalb nicht in den Kacheln.

## 2. Gliederungsgrundlage und MECE

Grundlage ist die WZ 2008 auf Ebene der Abschnitte (A bis U) und, wo ein Abschnitt zu groß oder zu gemischt ist, der Abteilungen (zweistellig). Die WZ ist als Klassifikation überschneidungsfrei und vollständig: Jede wirtschaftliche Tätigkeit gehört zu genau einer Abteilung. Die Kacheln bündeln Abteilungen zu Arbeitsbereichen. Jede Abteilung wird genau einer Kachel zugeordnet oder bewusst "Andere Tätigkeit" überlassen.

Warum nach Wirtschaftszweig und nicht nach Beruf (ISCO-08): Auf der B2B-Seite wählt eine Person aus dem Betrieb, in dem das Team arbeitet. Der Betrieb ist ihr geläufiger als eine Berufsgruppe. ISCO-08 dient als Gegenprobe, ob typische Steh- und Gehberufe (Verkauf, Pflege, Bau, Maschinenbedienung, Reinigung) in einer Kachel vorkommen.

Zuordnung der WZ-Abschnitte und -Abteilungen zu den Kacheln:

| id | WZ 2008 |
|---|---|
| hotel-gastronomie | Abschnitt I (Abt. 55, 56) |
| einzelhandel | Abt. 47 (Abt. 45 Kfz-Handel und Werkstattverkauf als Randfall) |
| lager-logistik | Abt. 46 (Lager), 52.1, 53 |
| produktion-industrie | Abschnitt C (Abt. 10 bis 32), Abschnitt D |
| pflege-gesundheit | Abt. 86, 87, 88.1 |
| handwerk-bau | Abschnitt F, Abt. 33, 95 |
| reinigung-facility | Abt. 81.1, 81.2, Abschnitt E |
| sicherheit-empfang | Abt. 80, 82 (Empfang, Service vor Ort) |
| bildung-betreuung | Abschnitt P, Abt. 88.9 (u. a. Kindertagesbetreuung) |
| koerpernahe-dienste | Abt. 96 (96.01 bis 96.04), 93.13 |
| verkehr-flughafen | Abt. 49, 50, 51, 52.2 |
| landwirtschaft-gartenbau | Abschnitt A, Abt. 81.3 |
| veranstaltung-messe | Abschnitt R (Abt. 90 bis 93 ohne 93.13), Abt. 82.3 |
| andere-taetigkeit | alles Übrige (u. a. Abschnitte B, J bis M, O, T, U) |

Abschnitt G ist geteilt: Einzelhandel (47) und Großhandel (46) liegen in der WZ getrennt. Das Lager des Großhandels gehört zu "lager-logistik", der Verkauf an Kundschaft zu "einzelhandel".

Prüfung der Orientierungsliste gegen die Quelle:

- Zusammengelegt: "Hotel" und "Gastronomie" zu einer Kachel. Beide bilden den WZ-Abschnitt I (Gastgewerbe). So bleibt die Liste bei 14 Kacheln, und die Kachel entspricht genau einem Abschnitt.
- Gestrichen: "öffentliche Verwaltung vor Ort" (Abschnitt O). Sie ist als eigene Kachel nicht nötig, weil die Tätigkeiten vor Ort in anderen Kacheln liegen (Pförtnerdienst unter sicherheit-empfang, Hausmeister unter reinigung-facility, Bauhof unter handwerk-bau oder landwirtschaft-gartenbau). Der Rest läuft über "Andere Tätigkeit". Begründung ist eine Einordnung, kein Beleg zur Verteilung von Steharbeit.
- Beibehalten: alle übrigen Bereiche der Orientierungsliste.
- Bewusst nicht ergänzt: Bergbau (Abschnitt B) und Energieversorgung (D). Sie sind klein und sprechen für "produktion-industrie" oder "Andere Tätigkeit". Abschnitte J bis M (Information, Finanzen, Immobilien, freiberufliche Dienste) sind überwiegend Büroarbeit und kommen in "Andere Tätigkeit".

## 3. Kacheln

Beispielzeilen: höchstens 60 Zeichen, kommagetrennt, ohne Geviertstrich.

| id | Name DE | Beispielzeile DE | Name EN | Beispielzeile EN |
|---|---|---|---|---|
| hotel-gastronomie | Hotel und Gastronomie | Küche, Service, Bar, Housekeeping, Frühstücksbuffet | Hotels and restaurants | Kitchen, service, bar, housekeeping, breakfast buffet |
| einzelhandel | Einzelhandel | Verkaufsfläche, Kasse, Regalpflege, Frischetheke | Retail | Sales floor, checkout, shelf stocking, deli counter |
| lager-logistik | Lager und Logistik | Kommissionierung, Verladerampe, Packstation, Hallengänge | Warehouse and logistics | Order picking, loading dock, packing station, aisles |
| produktion-industrie | Produktion und Industrie | Fertigungslinie, Montageplatz, Maschinenhalle, Prüfplatz | Production and industry | Assembly line, workstation, machine hall, quality check |
| pflege-gesundheit | Pflege und Gesundheit | Station, Praxis, Wohnbereich, Labor, Rettungsdienst | Care and health | Ward, practice, care home, lab, ambulance service |
| handwerk-bau | Handwerk und Bau | Baustelle, Werkstatt, Montage beim Kunden, Rohbau | Trades and construction | Building site, workshop, on-site installation, shell work |
| reinigung-facility | Reinigung und Facility | Gebäudereinigung, Hausmeisterrunde, Entsorgung, Waschraum | Cleaning and facility | Building cleaning, caretaker rounds, waste disposal |
| sicherheit-empfang | Sicherheit und Empfang | Pforte, Streife, Eingangskontrolle, Empfangstresen | Security and reception | Gatehouse, patrol, entrance check, reception desk |
| bildung-betreuung | Bildung und Betreuung | Klassenzimmer, Kita-Gruppe, Pausenhof, Werkstattunterricht | Education and childcare | Classroom, daycare group, schoolyard, workshop class |
| koerpernahe-dienste | Körpernahe Dienste | Friseurplatz, Kosmetikkabine, Massageraum, Fitnessfläche | Personal care services | Hair station, beauty room, massage room, gym floor |
| verkehr-flughafen | Verkehr und Flughafen | Check-in, Vorfeld, Bahnsteig, Gepäckabfertigung | Transport and airports | Check-in, apron, platform, baggage handling |
| landwirtschaft-gartenbau | Landwirtschaft und Gartenbau | Stall, Feld, Gewächshaus, Grünanlage | Agriculture and horticulture | Barn, field, greenhouse, green space |
| veranstaltung-messe | Veranstaltung und Messe | Messestand, Bühne, Einlass, Eventservice | Events and trade fairs | Exhibition stand, stage, admission, event service |
| andere-taetigkeit | Andere Tätigkeit | Auswahl, wenn keine Kachel passt | Other work | Choose this if no tile fits |

Alle Beispielzeilen wurden maschinell gezählt und liegen bei höchstens 60 Zeichen.

## 4. Offene Punkte

1. Hotelzeile enthält keine Rezeption mehr, damit sie sich nicht mit "sicherheit-empfang" überschneidet (siehe Punkt 4). Der Empfang im Hotel gehört damit zu "sicherheit-empfang"; ob das für Hotels verständlich ist, im Test prüfen.
2. Quelle: Die WZ-Gliederung wurde aus einer Kopie (Bayern) gelesen, weil der Destatis-Abruf nur HTML lieferte. Vor dem Zitieren in Texten gegen das Destatis-Original abgleichen. Außerdem klären, ob noch die WZ 2008 gilt oder eine neuere Ausgabe (die Suche konnte das nicht bestätigen).
3. BAuA und ASR A1.2 konnten nicht am Original gelesen werden (403). Die Kachelliste stützt sich daher auf die Branchengliederung, nicht auf einen Beleg, welche Bereiche am meisten stehen oder gehen. Wer das behaupten will, braucht einen Eintrag in `FACTS.md`.
4. "Empfang" ist eine Tätigkeit (ISCO), "Sicherheit" ein Wirtschaftszweig (WZ 80). Die Kachel mischt beide Sichten. Ein Hotelempfang ist nach WZ Gastgewerbe (Abschnitt I), nach Tätigkeit Empfang. Die Beispielzeilen führen Empfang nur unter "sicherheit-empfang".
5. Grenzfälle der Zuordnung: Kfz-Werkstatt (Abt. 45), Kindertagesbetreuung (88.9 gegen Pflege), Rettungsdienst (86.9), Müllabfuhr (Abt. 38), Sportstätten (93.1). Zuordnung oben ist eine Festlegung, keine Vorgabe der Quelle.
6. Öffentliche Verwaltung (Abschnitt O) und Bergbau (B) liegen in "Andere Tätigkeit". Falls Kundschaft aus Kommunen kommt, eine eigene Kachel erwägen und dafür zwei andere zusammenlegen.
7. Englische Begriffe prüfen gegen `GLOSSARY.md`, Abschnitt "Englische Fassung".
8. Mehrfachbereiche: Teams mit gemischten Tätigkeiten brauchen eine Regel (eine Kachel für den größten Teil der Schicht). Das klärt die Seitenführung, nicht diese Liste.
