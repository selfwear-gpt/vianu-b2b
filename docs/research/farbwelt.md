# Farbwelt für VIANU: Recherche

Stand und Abrufdatum aller Quellen: 2026-10-12. Jede Aussage trägt die Quelle direkt dahinter. Aussagen ohne Quelle sind als "Einschätzung" markiert.

Methodik für Markenfarben: Von den Seiten wurde das ausgelieferte HTML samt verlinkten CSS-Dateien geladen und die Häufigkeit der Hex-Werte gezählt. Hohe Häufigkeit deutet auf die Hauptfarben hin, belegt aber keine offizielle Markenrichtlinie. Framework-Standardwerte (zum Beispiel Bootstrap-Rot #dc3545) wurden ignoriert. Markenrichtlinien (Brand Guidelines) wurden für keine der Seiten gefunden oder abgerufen. Die Zählskripte liegen nur im Scratchpad, nicht im Projekt.

## 1. Kurzfassung

- Chartreuse #C5FA1F hat auf Weiß 1,23:1 und auf #F2F2EE 1,10:1 und taugt dort weder für Text noch für Linien. Auf #0E0E0C erreicht es 15,70:1. Berechnung siehe Abschnitt 5.
- Im geprüften deutschsprachigen Umfeld dominieren Blau, Magenta/Pink, Orange, Rot und Petrol/Türkis. Ein Limettengrün als Leitfarbe kam bei keinem DACH-Anbieter der Stichprobe vor. Superfeet (international, Einlegesohlen) nutzt Limettentöne im CSS. Belege in Abschnitt 3.
- Die Kombination "Schwarz mit einem einzigen Neon-Akzent" steht in Anthropics eigener frontend-design-Anleitung als typisches KI-Muster. Chartreuse auf Schwarz allein ist daher ein Wiedererkennungsrisiko im falschen Sinn (Abschnitt 6).
- Für Farbpsychologie gibt es keine belastbare Evidenz, die eine bestimmte Farbe für Beschäftigte im Gastgewerbe oder für Entscheider ableitet (Abschnitt 4).

## 2. Kontrastregeln (WCAG 2.2)

- SC 1.4.3 Contrast (Minimum), Level AA: Text und Textbilder brauchen mindestens 4,5:1. Großer Text braucht mindestens 3:1. Text in Logos und Markennamen hat keine Anforderung. Quelle: https://www.w3.org/TR/WCAG22/ (Abruf 2026-10-12).
- "Großer Text" ist definiert als mindestens 18 pt oder 14 pt fett. Quelle: https://www.w3.org/TR/WCAG22/ (Glossar "large scale", Abruf 2026-10-12).
- SC 1.4.11 Non-text Contrast, Level AA: Bedienelemente (Rahmen, Zustände) und für das Verständnis nötige Grafikteile brauchen mindestens 3:1 gegen angrenzende Farben. Quelle: https://www.w3.org/TR/WCAG22/ (Abruf 2026-10-12).
- Relative Luminanz: L = 0,2126 R + 0,7152 G + 0,0722 B, wobei jeder sRGB-Kanal c = Wert/255 zu c/12,92 wird, falls c <= 0,04045, sonst ((c+0,055)/1,055)^2,4. Seit Mai 2021 steht dort 0,04045 statt 0,03928, mit laut W3C praktisch keinem Einfluss auf die Ergebnisse. Quelle: https://www.w3.org/TR/WCAG22/ (Glossar "relative luminance", Abruf 2026-10-12).
- Kontrastverhältnis = (L1 + 0,05) / (L2 + 0,05) mit L1 als hellerer Farbe. Quelle: https://www.w3.org/TR/WCAG22/ (Glossar "contrast ratio", Abruf 2026-10-12).

## 3. Wettbewerb und Referenzen: tatsächlich ausgelieferte Farben

Alle Werte aus CSS/HTML der jeweiligen Seite, Abruf 2026-10-12. "Dominant" bedeutet häufigste nicht-neutrale Werte.

### 3.1 Referenzen, die du genannt hast

| Seite | Dominante Farben im CSS | Quelle |
|---|---|---|
| urbansportsclub.com | Blau #2e70ce (als --ui-primary und --text-accent definiert), Nachtblau #00112c, Tinte #191e24, warmes Hell #f8f6f3, Warnrot #b80028 | https://urbansportsclub.com/ und https://urbansportsclub.com/build/frontend/homepage.6b8569a193b5f1e8724a.css |
| getsteps.com | Seite ist ein Tutorial-Dienst ("Space for your tutorials"), kein Einlegesohlen-Anbieter. CSS enthält Bootstrap 4.4.1 und ein Lindgrün #ccef61, #e7f3c5, #44721a | http://getsteps.com/ |

Hinweis zu getsteps.com: Die Seite ist per HTTPS nicht abrufbar (Zertifikatsfehler beim Host, nur per HTTP geladen). Ob du eine andere Domain gemeint hast, konnte ich nicht klären. Als Einlegesohlen-Referenz taugt die Seite nicht.

### 3.2 Einlegesohlen, Orthopädie, Fußgesundheit für Betriebe

| Anbieter | Dominante Farben | Quelle |
|---|---|---|
| Bauerfeind (DE) | Blau #133e8f, Cyan #20b9d6 | https://www.bauerfeind.com |
| Haberkorn (AT, Fußvermessung im Betrieb) | Blau #007abc | https://www.haberkorn.com/at/de/ |
| uvex (DE, Arbeitsschutz) | Orange #ff6600 auf Schwarz/Weiß | https://www.uvex-safety.com/de/ |
| Sidas (FR) | Gelb #f7e000 auf #222222 | https://www.sidas.com |
| Footbalance (FI, Einlagen) | Türkis #14c8aa, Koralle #ff6e50, Dunkelblau #00263e, Petrol #005e5d | https://www.footbalance.com |
| Superfeet (US) | Tinte #231f20, Limette #baff4f, #8ce500, #a5ff1a, #c1ff61 (Häufigkeit gering bis mittel) | https://www.superfeet.com |
| medi (DE) | Magenta #e20074 auf Graublau #48586a | https://www.medi.de |
| pedag (DE) | Korallrot #ff5352, Graublau #758ca3 | https://www.pedag.de |
| Currex (CH) | Schwarz/Weiß, Rot #d02e2e als Akzent | https://www.currex.com |
| RG Arbeitsschutz (Fußgesundheit für Unternehmen) | Magenta #c81553, Blau #0089f7 | https://www.rg-arbeitsschutz.de/fussgesundheit/ |
| Spoorth (BGF Fußcheck) | Magenta #ae0b6a, Dunkelblau #263c4d | https://www.spoorth.de |

Fundstellen für die Anbieter mit Betriebsangebot (Fußvermessung, Fit Day, Einlagen für Mitarbeitende): https://www.rg-arbeitsschutz.de/fussgesundheit/, https://www.haberkorn.com/at/de/services/produkt-services/moderne-fussvermessung-fuer-den-perfekt-sitzenden-arbeitsschuh, https://www.spoorth.de/betriebliche-gesundheitsfoerderung/ (Abruf 2026-10-12). Einen Anbieter für individuelle Einlegesohlen als Arbeitgeberprogramm speziell für Hotellerie und Gastronomie habe ich nicht gefunden.

### 3.3 Betriebliches Gesundheitsmanagement, Gesundheitsträger

| Anbieter | Dominante Farben | Quelle |
|---|---|---|
| machtfit | Magenta #e62e73, Grün #33b993, Blau #003388 | https://www.machtfit.de |
| Hansefit | Orange #f95f18 / #d54401, Violett #6509ba (selten), Schwarzbraun #332824 | https://www.hansefit.de |
| EGYM | Blau #003399 | https://egym.com/de |
| Wellhub | Beerenrot #d8385e / #f2496b, Creme #fbf8ec, Tinte #231b22 | https://www.wellhub.com/de-de/ |
| AOK Firmenkunden | Grün #18ab42, Dunkelgrün #005e3f / #004730, Limette #91f54a, Rot #eb0047 | https://www.aok.de/fk/ |
| Techniker Krankenkasse Firmenkunden | Cyanblau #009ee3, Gelb #e8e000, Creme #f8f5c6 | https://www.tk.de/firmenkunden |
| DGUV | Blau #00529c | https://www.dguv.de |
| BGN (Berufsgenossenschaft Nahrungsmittel und Gastgewerbe) | Blau #004994, Orange #e8630b | https://www.bgn.de |

Zu Wellpass lag zum Abrufzeitpunkt ein abgelaufenes Zertifikat vor (https://www.wellpass.com), daher keine Daten.

### 3.4 Hotellerie-Arbeitgebermarken und Berufskleidung

| Marke | Dominante Farben | Quelle |
|---|---|---|
| Motel One | Türkis #08c4cf, Dunkelpetrol #032b30 | https://www.motel-one.com/de/ |
| Ruby Hotels | Rot #cc0032 auf Schwarz/Weiß | https://www.ruby-hotels.com |
| Leonardo Hotels | Beerenrot #b5003b, Grün #00c114, Cyan #00abd6 | https://www.leonardo-hotels.com |
| Dorint | Nachtblau #001426, Cyan #00bbff | https://www.dorint.com |
| 25hours | Hellblau #98cdfb, Marineblau #003b6e, Gelb #e6db55 | https://www.25hours-hotels.com |
| hotelcareer.de | Ziegelrot #b5250b, Grün #008019 | https://www.hotelcareer.de |
| DEHOGA Bundesverband | Petrolblau #035073 (theme-color, wenige Treffer) | https://www.dehoga-bundesverband.de |
| Greiff (Gastro-Berufskleidung) | Kobaltblau #0048fe, Cyan #00bbff | https://www.greiff.de |
| Engelbert Strauss (Berufskleidung) | Rot #e30613 | https://www.engelbertstrauss.de |
| HAKRO (Berufskleidung) | Neutral, Schwarz/Grau | https://www.hakro.com |

Für Hilton, Marriott, IHG, Accor, Radisson und Steigenberger lieferte der Abruf keine verwertbaren Werte (Zeitüberschreitung, Blockade oder JavaScript-Rendering). Sie sind nicht bewertet.

### 3.5 Auswertung (Einschätzung auf Basis der Tabellen)

- Blau besetzen Bauerfeind, Haberkorn, EGYM, USC, DGUV, BGN, Greiff, Lidl-Karriere, Birkenstock (https://www.birkenstock.com/de) und weitere. Blau ist die häufigste Farbe im Umfeld.
- Magenta/Beere besetzen machtfit, medi, RG Arbeitsschutz, Spoorth, Wellhub, Leonardo.
- Orange besetzen Hansefit, uvex, BGN.
- Türkis/Petrol besetzen Footbalance, Motel One, DEHOGA.
- Grün besetzt AOK, und zwar mit Dunkelgrün plus Limette (#005e3f und #91f54a). Eine Kombination aus Tannengrün und Chartreuse läge nah an diesem Paar. Das Risiko sollte vor einer Entscheidung visuell geprüft werden.
- Limettengrün als Leitfarbe sah ich bei keinem DACH-Anbieter. Superfeet nutzt Limette in einem internationalen Kontext. Chartreuse ist damit im geprüften Umfeld unterbesetzt.
- Violett kommt kaum vor (Hansefit nur als Nebenwert), ist aber das Hauptmerkmal des KI-Looks (Abschnitt 6) und deshalb keine gute Lücke.
- Die Stichprobe umfasst 30 Seiten und ist nicht repräsentativ.

## 4. Farbtrend und Farbpsychologie

### 4.1 Trend

- Pantone hat PANTONE 11-4201 Cloud Dancer, ein Weiß, am 4. Dezember 2025 zur Farbe des Jahres 2026 erklärt. Es ist laut Pantone die erste Wahl eines Weißtons seit Beginn des Programms 1999 (die Smithsonian-Meldung nennt das ebenfalls, Pantone selbst äußert sich in der Pressemitteilung nicht zu diesem Vergleich). Quelle Pantone: https://www.pantone.com/articles/press-releases/pantone-announces-color-of-the-year-2026-cloud-dancer (Abruf 2026-10-12).
- Pantones Begründung: Symbol für "calming influence in a frenetic society", Wunsch nach "fresh start", "promise of clarity", dazu "key structural color whose versatility provides scaffolding for the color spectrum". Quelle: https://www.pantone.com/articles/press-releases/pantone-announces-color-of-the-year-2026-cloud-dancer (Abruf 2026-10-12).
- Pantone beschreibt Cloud Dancer als Farbe, die sich "stand-alone" oder "combined with other hues" einsetzen lässt. Daraus lässt sich ein ruhiger heller Grund mit kräftigen Akzenten ableiten (Einschätzung). Quelle des Zitats: https://www.pantone.com/articles/press-releases/pantone-announces-color-of-the-year-2026-cloud-dancer (Abruf 2026-10-12).
- Hex-Wert und die sieben Paletten von Cloud Dancer habe ich nicht abgerufen. Die Pantone-Seite https://www.pantone.com/color-of-the-year/2026 lädt ihren Inhalt per JavaScript.
- Pantone nennt kein Trendurteil zu Neon- oder Säuretönen. Ein Trend für 2027 ist mir nicht belegt. Keine belastbare Quelle gefunden.

### 4.2 Psychologie

- Übersichtsarbeit Elliot und Maier 2014: Farbe kann Affekt, Kognition und Verhalten beeinflussen, die Literatur befinde sich aber in einem "nascent stage", und es brauche viel Arbeit zu Randbedingungen, Moderatoren und Übertragbarkeit in die Praxis, "before strong conceptual statements and recommendations for application are warranted". Quelle: https://pubmed.ncbi.nlm.nih.gov/23808916/ (DOI 10.1146/annurev-psych-010213-115035, Abruf 2026-10-12).
- Jonauskaite u. a. 2020: 4.598 Teilnehmende aus 30 Ländern verbanden 20 Emotionen mit 12 Farbbegriffen. Die Muster waren weitgehend universell (mittlerer Ähnlichkeitskoeffizient r = ,88) mit lokalen Unterschieden, die mit Sprach- und geografischer Nähe wachsen. Es geht um Farbbegriffe und Emotionen, nicht um Markenwirkung. Quelle: https://pubmed.ncbi.nlm.nih.gov/32900287/ (DOI 10.1177/0956797620948810, Abruf 2026-10-12).
- Labrecque und Milne 2012 (Journal of the Academy of Marketing Science 40, 711-727, "Exciting red and competent blue: the importance of color in marketing", DOI 10.1007/s11747-010-0245-y) ist bibliografisch bestätigt. Der Volltext war nicht abrufbar, daher übernehme ich keinen inhaltlichen Befund. Quelle der Bibliografie: https://api.crossref.org/works/10.1007/s11747-010-0245-y (Abruf 2026-10-12).
- Für die Frage, welche Farbe Beschäftigte im Gastgewerbe oder Entscheider in Personal, Einkauf, Arbeitsschutz oder Betriebsrat anspricht: keine belastbare Evidenz gefunden.
- Für die Aussage, dass Limettengrün Energie, Frische oder Gesundheit vermittelt: keine belastbare Evidenz gefunden. Das ist Markenassoziation (Einschätzung).
- Für Aussagen wie "Menschen entscheiden in 90 Sekunden nach Farbe" oder prozentuale Kaufwirkungen von Farbe habe ich keine Primärquelle verifiziert und übernehme sie nicht.

## 5. Kontrastberechnung (WCAG 2.2)

Formel wie in Abschnitt 2 (Quelle: https://www.w3.org/TR/WCAG22/, Abruf 2026-10-12). Berechnet mit Python 3.13, Skript: /tmp/claude-0/-home-user/91f040d7-a4dd-58bc-89a5-c032ec7dd115/scratchpad/contrast.py. Kontrolle: Schwarz gegen Weiß ergibt 21,00:1.

Kandidaten außer Chartreuse (abgeleitet aus Abschnitt 3, alle Einschätzung):
- Tannengrün #0F5C4D: tiefer Anker für Text und Links auf hellem Grund. Nähe zu AOK-Grün beachten.
- Safran #FFB81C: warmer Signalton, der im DACH-Stichprobenumfeld nur als Gelb bei Sidas, TK und Lidl vorkommt.
- Kobalt #1F3FD6: Blau, das die Wettbewerbsnähe zeigt (Greiff #0048fe, EGYM #003399).
- Mint #14C8AA: Referenz aus Footbalance (#14c8aa) als Gegenprobe.

Verhältnisse (AA Text 4,5, großer Text und Bedienelemente 3,0):

| Farbe | auf #0E0E0C | auf #FFFFFF | auf #F2F2EE |
|---|---|---|---|
| Chartreuse #C5FA1F | 15,70 | 1,23 | 1,10 |
| Tannengrün #0F5C4D | 2,45 | 7,90 | 7,04 |
| Safran #FFB81C | 11,16 | 1,73 | 1,54 |
| Kobalt #1F3FD6 | 2,52 | 7,66 | 6,83 |
| Mint #14C8AA | 9,08 | 2,13 | 1,90 |

Weitere Paare: Chartreuse auf Tannengrün 6,42. Weiß auf Tannengrün 7,90. Safran auf Tannengrün 4,56. Chartreuse auf Kobalt 6,23.

Folgerungen aus den Zahlen:
- Chartreuse besteht AA nur auf dunklem Grund (Text, Linien, Icons) oder als Fläche mit dunklem Text darauf (15,70:1 mit #0E0E0C). Auf Weiß und #F2F2EE fällt es auch bei großem Text und bei Rahmen unter die 3:1.
- Weißer Text auf Chartreuse hat 1,23:1 und ist damit ausgeschlossen. Das gilt auch für Buttons.
- Auf hellem Grund braucht es für Links, Fokusrahmen und Linien einen dunklen Begleiter, etwa Tannengrün oder Tinte.
- Ein Fokusindikator in Chartreuse auf hellem Grund würde SC 1.4.11 verfehlen. Auf Tinte besteht er.

## 6. Der typische KI-Look und Alternativen

Primärquelle: Die frontend-design-Anleitung im Repository anthropics/skills nennt ausdrücklich Muster, in denen KI-Gestaltung "clustert". Dazu gehören: (1) warmer Cremegrund (nahe #F4F1EA) mit hochkontrastiger Serifenschrift und Terrakotta- oder Lehm-Akzent (nahe #D97757, laut Text der eigene Claude-Akzent von Anthropic), (2) fast schwarzer Grund mit einem einzelnen hellen Säuregrün- oder Zinnober-Akzent, (3) Zeitungslayout, (4) Karten-Baukasten mit einheitlichem Radius und Schatten sowie Verlaufsflächen als Dekor, (5) Vorlagenelemente wie getrackte Versalien-Labels. Die Anleitung sagt außerdem, dass diese Merkmale für manche Briefings berechtigt sind, aber Voreinstellungen statt Entscheidungen darstellen. Quelle: https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md (Abruf 2026-10-12).

Violett-Blau-Verlauf auf Weiß:
- Der Verlauf gilt als Standard-KI-Optik. Die frontend-design-Anleitung in Abschnitt (4) nennt "gradient washes as decoration" als Kennzeichen, die Violettnennung selbst fand ich nur in Nachdrucken der Anleitung, nicht in der aktuellen Originalfassung. Quelle der Nachdrucke: https://mcp.directory/skills/anthropic-frontend-design (Abruf 2026-10-12, Sekundärquelle).
- Eine verbreitete Erklärung führt das Violett auf Tailwinds Standardfarbe bg-indigo-500 zurück, wofür sich Adam Wathan im August 2025 auf X entschuldigt haben soll. Den Originalpost konnte ich nicht abrufen. Erklärung und Datum stammen aus Sekundärquellen und gelten daher als unbestätigt: https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website (Abruf 2026-10-12).

Creme mit Terrakotta:
- Siehe Punkt (1) in der Anleitung oben. Cremetöne kommen im Wettbewerbsumfeld bei Wellhub (#fbf8ec), TK (#f8f5c6) und Hansefit (#fef4e3) vor (Abschnitt 3).

Schwarz mit einem einzigen Neon-Akzent:
- Siehe Punkt (2). Das trifft das aktuelle Chartreuse auf #0E0E0C genau.
- Die Anleitung weist außerdem auf "tinted near-black (#0B0B0B, #111) standing in for black" hin. #0E0E0C liegt in dieser Familie (alles zitiert aus derselben Quelle).

Alternativen (Einschätzung):
- Chartreuse bleibt, wird aber als Teil eines Systems mit mindestens zwei Rollen geführt: Chartreuse als Fläche und Markierung, ein zweiter dunkler Chroma-Anker (Tannengrün oder Kobalt, Abschnitt 5) für Text, Links, Fokus und Diagramme auf hellem Grund.
- Helle Flächen in einem kühlen oder neutralen Grau-Weiß (#F2F2EE ist das bereits, im Sinn von Pantones Cloud Dancer als "Struktur") und keine Creme-Terrakotta-Welt.
- Ein Hauptton größer als Randnotiz: Chartreuse als großflächige Fläche in Kapitelwechseln statt als dünner Akzent auf Schwarz.
- Wiedererkennbarkeit über Foto-Behandlung, Schrift, Formen und die Produktfarbe (die Sohle selbst in Chartreuse) statt über Palette allein.
- Differenzierung zum Wettbewerb prüfen: Tannengrün plus Chartreuse liegt nahe an AOK. Kobalt plus Chartreuse liegt nahe an der Blau-Häufung, aber das Paar selbst kam in der Stichprobe nicht vor. Safran liegt zwischen Sidas/TK-Gelb und Chartreuse und könnte neben Chartreuse unscharf wirken.

## 7. Empfehlung für beide Bereiche (Einschätzung)

- Ein gemeinsames Farbsystem, zwei Dosierungen: Mitarbeitenden-Bereich mit mehr Chartreuse-Flächen und kräftigem Foto, B2B-Bereich mit überwiegend #F2F2EE und Tinte, Chartreuse nur für Aktionen und Markierungen. Für eine unterschiedliche Wirkung je Zielgruppe gibt es keine belastbare Evidenz (Abschnitt 4.2). Die Aufteilung ist eine Gestaltungsentscheidung.
- Regeln zur Barrierefreiheit: Chartreuse nie als Textfarbe auf Hell. Buttons in Chartreuse tragen #0E0E0C-Text. Links und Fokusrahmen auf Hell nutzen den dunklen Anker.
- Offene Prüfung vor Freigabe: Farbsimulation für Farbfehlsichtigkeit und ein visueller Vergleich mit AOK, Superfeet und Footbalance.

## 8. Lücken

- Keine Markenrichtlinien (Brand Guidelines) der Wettbewerber abgerufen, nur CSS-Häufigkeiten.
- getsteps.com ist kein Einlegesohlen-Anbieter und per HTTPS nicht erreichbar.
- Pantone: Hex-Wert und Paletten von Cloud Dancer nicht abgerufen. Kein Trend für 2027 belegt.
- Keine Evidenz zu Farbwirkung bei Beschäftigten im Gastgewerbe oder bei Einkaufs- und Personalentscheidern.
- Labrecque und Milne 2012 nur bibliografisch bestätigt.
- Hotelketten Hilton, Marriott, IHG, Accor, Radisson, Steigenberger: keine Daten.
- Originalpost von Adam Wathan nicht abgerufen.
