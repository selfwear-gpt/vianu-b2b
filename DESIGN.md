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

## Tokens (Vorschlag, zu bestätigen)

Alle Werte stehen nur in `assets/css/tokens.css`. Komponenten verwenden ausschließlich Tokens.

| Token | Zweck | Vorschlag |
|---|---|---|
| `--farbe-tinte` | Text und dunkle Flächen | `#0E0E0C` |
| `--farbe-papier` | Hintergrund | `#F2F2EE` |
| `--farbe-akzent` | Hover, Spitzenbelastung, Hauptbutton-Fläche | `#C5FA1F` (Chartreuse) |
| `--farbe-gedaempft` | Nebentext | `#5C5C57` |
| `--farbe-linie` | Trennlinien | `#D8D8D2` |
| `--schrift-kopf` | Überschriften | Barlow Condensed |
| `--schrift-text` | Fließtext | Barlow |
| `--schrift-mono` | Etiketten, Angaben | Space Mono |
| `--abstand-1` bis `--abstand-8` | Abstandsskala | 4, 8, 12, 16, 24, 32, 48, 80 px |

Schriften liegen in `assets/fonts/` und werden von dort geladen. Eine Entscheidung für die endgültigen Schriften fällt mit der Identität.

## Farbe und Kontrast

- Akzentgelb dient als Fläche und für Hover. Als Textfarbe auf hellem Grund ist es nicht lesbar und wird dort nicht verwendet. Auf Schwarz ist es erlaubt.
- Text erreicht mindestens Kontrast 4,5 zu 1, große Schrift 3 zu 1 (WCAG 2.2 AA).
- Der Akzent erscheint sparsam, am stärksten an einer Stelle pro Bildschirm.

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

## Technische Hygiene

- Alle Schriften, Skripte und Bilder vom eigenen Server.
- Sicherheits-Header am Server: Content-Security-Policy, `X-Content-Type-Options`, `Referrer-Policy`, HSTS.
- `sitemap.xml`, `robots.txt`, Titel und Beschreibung je Seite, strukturierte Daten für Organisation, Angebot und FAQ.
- Impressum und Datenschutzerklärung sind echte Seiten und von jeder Seite verlinkt.
