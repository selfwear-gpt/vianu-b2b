# Gestaltung

Die Identität (Logo, Farben, Schrift, Bildwelt) ist in Entwicklung. Bis sie steht, gelten die Vorschläge unten. Sie sind als `tokens.css` angelegt und lassen sich an einer Stelle austauschen. Einträge mit "zu bestätigen" sind Vorschläge.

## Grundhaltung

Ruhig, hell und handfest. Die Seite zeigt Menschen in ihrer Schicht und ein Produkt, das man anfassen kann. Technik bleibt im Hintergrund. Modern, ohne übertrieben zu wirken.

## Verboten (KI-Muster)

- Farbverläufe als Fläche, Glaseffekte, Blob-Formen
- Reihen aus drei gleichen Icon-Karten
- Zentrierter Hero mit zwei Buttons
- Stockfotos von lachenden Teams
- Logowände ohne echte Kunden
- Zähler, die erfundene Zahlen hochzählen
- Emojis als Icons oder Gliederung
- Überall dieselben Rundungen und Schatten
- Nummerierte Abschnitte ohne echte Reihenfolge

## Stattdessen

- Echte Fotos aus dem Alltag in Hotellerie und Gastronomie
- Große Typografie und asymmetrische Layouts
- Bewegung, die zum Gehen passt (siehe unten)
- Ein markantes interaktives Element pro Bereich: der Fußabdruck im B2B-Bereich, der Name auf der Sohle im Mitarbeitenden-Bereich

## Farben und Tokens

Alle Werte stehen nur in `assets/css/tokens.css`. Komponenten, Seiten und Skripte verwenden ausschließlich die Rollennamen. Die Farbwelt kann später komplett wechseln, ohne dass eine andere Datei angefasst wird (Entscheidung in `docs/adr/0001-farbwelt-rollen-statt-farben.md`). Anleitung zum Wechseln und die Alternativen stehen in `docs/design/farbwelten.md`.

Aktuelle Belegung: Farbwelt 3, Rosa und Tannengrün.

| Rolle | Token | Wert | Zweck |
|---|---|---|---|
| Tinte | `--farbe-tinte` | `#0C3B31` | Text, dunkle Flächen, Menü im Mitarbeitenden-Bereich |
| Papier | `--farbe-papier` | `#F3F3EE` | Hintergrund, vor allem im B2B-Bereich |
| Signal | `--farbe-signal` | `#FF88BC` | Aktionen, Markierungen, große Flächen |
| Nähe | `--farbe-naehe` | `#FF88BC` | Menschen-Momente im Mitarbeitenden-Bereich, sparsam |
| Gedämpft | `--farbe-gedaempft` | `#55605B` | Nebentext, Beschriftungen |
| Linie | `--farbe-linie` | `#D8D8D2` | Trennlinien ohne Bedienfunktion |
| Text auf Signal | `--farbe-auf-signal` | wie Tinte | Textfarbe auf Signal- und Nähe-Flächen |

Weitere Tokens: Schriften (`--schrift-kopf`, `--schrift-text`, `--schrift-mono`) und die Abstandsskala (`--abstand-1` bis `--abstand-8`: 4, 8, 12, 16, 24, 32, 48, 80 px). Schriftdateien liegen in `assets/fonts/` und werden über `assets/css/fonts.css` von dort geladen.

## Farbregeln

Diese Regeln gelten für jede Farbwelt:

- **Signal ist eine Fläche.** Als Textfarbe oder Rahmen auf hellem Grund ist es nicht lesbar (etwa 2,0 zu 1) und wird dort nicht verwendet. Text auf Signal-Flächen nutzt `--farbe-auf-signal`.
- **Dunkler Grund trägt Signal.** Auf Tinte darf Signal als Text, Icon und Linie stehen.
- **Kontrastwerte** (nach WCAG 2.2 gerechnet, Farbwelt 3): Tinte auf Papier 11,19 zu 1. Gedämpft auf Papier 5,88 zu 1. Tinte auf Signal 5,64 zu 1. Signal auf Tinte 5,64 zu 1. Text braucht mindestens 4,5 zu 1, große Schrift und Bedienelemente 3 zu 1.
- **Das Signal erscheint sparsam**, am stärksten an einer Stelle pro Bildschirm.
- **Keine Farbwerte außerhalb von `tokens.css`.** Weder `#hex` noch `rgb()` noch `hsl()`, auch nicht in HTML, Skripten oder SVG.

Prüfung: `python3 scripts/check-tokens.py` meldet Farbwerte außerhalb von `tokens.css` und rechnet die Kontraste der Rollen. Sie läuft vor jedem Merge.

## Schrift

Aktuelle Belegung, gewählt am 12.10.2026. Die Identität ist noch nicht final, die Schriften dürfen sich ändern. Quelle, Lizenz und Anleitung zum Wechseln: `docs/design/schriften.md`. Entscheidung: `docs/adr/0002-schriften-selbst-hosten.md`.

| Rolle | Familie | Schnitte | Einsatz |
|---|---|---|---|
| Überschriften | Barlow Condensed | 700, 800 | Überschriften, Slogans, große Schrift, in Versalien |
| Text | Barlow | 400, 500, 600 | Fließtext, Menü, Bedienelemente |
| Etiketten | Space Mono | 400, 700 | kleine Beschriftungen und Angaben, in Versalien mit Abstand zwischen den Buchstaben |

Regeln:

- Schriften kommen nur vom eigenen Server (`assets/fonts/`). Verweise auf Google Fonts oder andere Dienste sind verboten. `python3 scripts/check-extern.py` prüft das.
- Fließtext ist höchstens etwa 65 Zeichen breit. Überschriften nutzen `text-wrap: balance`.
- Pfeile (↗ →) fehlen in den Schriften und werden als SVG-Symbol gesetzt, nicht als Zeichen.
- Neue Sonderzeichen vorab gegen `unicode-range` in `assets/css/fonts.css` prüfen.
- Größenstufen sind Tokens in `tokens.css`: `--schrift-groesse-display` (Hero-Überschrift, 3 bis 6,75 rem), `--schrift-groesse-h2`, `--schrift-groesse-h3`, `--schrift-groesse-text` (17 px), `--schrift-groesse-klein`, `--schrift-groesse-etikett`. Sie wurden mit der ersten Seite festgelegt und sind noch Vorschläge, bis die Identität steht.

## Raster und Layout

- Höchstens 20 % eines Bildschirms sind reiner Fließtext. Inhalte werden zu Kacheln, Diagrammen, Tabellen und kurzen Stichpunkten.
- Text, der sich nicht zeigen lässt, steht in kompakten Modulen (Kachelrückseiten, Akkordeons, Bildunterschriften) und bleibt im HTML.
- Das Menü bleibt in beiden Bereichen fest am oberen Rand und wird nie überdeckt. Ankerlinks lassen Platz für die Menühöhe.
- Auf dem Handy wird das Menü schmal, der Hauptbutton bleibt sichtbar.
- Seitenränder mindestens 16 px, kein horizontales Scrollen.

## Bewegung

- Höchstens eine Bewegung pro Bildschirm. Keine in Textteilen, FAQ, Formularen und rechtlichen Seiten.
- Jede Bewegung hat einen Ruhezustand, der die Aussage allein trägt. Er gilt bei reduzierter Bewegung, im Druck, im PDF und für Suchmaschinen.
- Nichts startet von selbst. Scrollen, Hover oder Tippen löst aus. Bewegung am Scrollen läuft beim Zurückscrollen rückwärts.
- Kein Text im animierten Bild. Die Wörter stehen im HTML.
- Leicht gebaut: Vektor, CSS oder Canvas, keine Videodateien für Effekte.
- Nicht verwendet: Scan- oder KI-Animationen, 3D-Rotation von Schuhen, Zähler, Parallaxe in Ebenen, Hintergrundvideo in Schleife.

## Bilder und Video

- Bilder in WebP oder AVIF, passende Größen, `loading="lazy"` außer im ersten Bildschirm, immer mit Alternativtext.
- Video startet erst auf Klick, mit Ton, mit Vorschaubild und Transkript. Selbst gehostet, kein Einbetten von Fremddiensten.
- Der Fußabdruck ist eine Vektorzeichnung mit Punktraster und weichen Druckzonen, kein Foto.
- Fehlende Bilder und Videos stehen als sichtbar markierter Platzhalter in der vorgesehenen Größe, mit einer kurzen Beschreibung des gebrauchten Bildes (Baustein "Platzhalter" in `COMPONENTS.md`). Keine Stockfotos als Ersatz.

## Technische Hygiene

- Alle Schriften, Skripte und Bilder vom eigenen Server.
- Sicherheits-Header am Server: Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, HSTS.
- `sitemap.xml`, `robots.txt`, Titel und Beschreibung je Seite, strukturierte Daten für Organisation, Angebot und FAQ.
- Impressum und Datenschutzerklärung sind echte Seiten und von jeder Seite verlinkt.
