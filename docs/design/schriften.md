# Schriften

Quelle, Lizenz und Anleitung zum Wechseln. Die Entscheidung steht in `docs/adr/0002-schriften-selbst-hosten.md`. Die Einbindung steht in `assets/css/fonts.css`, die Familiennamen in `assets/css/tokens.css`.

Vorschau mit allen Schnitten (privater Link, nur mit dem Konto des Eigentümers): https://claude.ai/artifact/AL9G7iEjbVkbtzdn4KB4J6

Die Wahl beruht auf dem Vorschlag aus der Sitzung vom 12.10.2026. Die Identität ist noch nicht final, die Schriften dürfen sich daher noch ändern.

## Aktiv

| Rolle | Token | Familie | Schnitte | Einsatz |
|---|---|---|---|---|
| Überschriften | `--schrift-kopf` | Barlow Condensed | 700, 800 | Überschriften, Slogans, große Schrift |
| Text | `--schrift-text` | Barlow | 400, 500, 600 | Fließtext, Menü, Bedienelemente |
| Etiketten | `--schrift-mono` | Space Mono | 400, 700 | Kleine Beschriftungen, Angaben, Menüpunkte in Versalien |

Eingebunden sind die Teilmengen Latin und Latin Extended. Sie decken Deutsch ab, mit ä, ö, ü, ß, deutschen Anführungszeichen („ “), dem Euro-Zeichen und dem Halbgeviertstrich. Die Dateien sind einzeln eingebunden, der Browser lädt nur die, deren Zeichen die Seite braucht.

## Nicht abgedeckt

Die Pfeile ↗ (U+2197) und → (U+2192) fehlen in allen drei Schriften. Der Browser würde sie in einer Ersatzschrift zeichnen und sie sähen je nach Gerät anders aus. Deshalb stehen Pfeile als kleines SVG-Symbol, nicht als Zeichen im Text. Das betrifft zum Beispiel "Für Mitarbeitende ↗" im Menü des B2B-Bereichs. Weitere Sonderzeichen vor der Verwendung gegen `unicode-range` in `assets/css/fonts.css` prüfen.

## Quelle und Dateien

Abruf am 12.10.2026 über die CSS-Schnittstelle von Google Fonts (`fonts.googleapis.com/css2`), die Dateien stammen von `fonts.gstatic.com`. Der Download war einmalig, die Seite lädt später nichts mehr von dort.

| Familie | Version in der Datei-URL | Lizenzdatei |
|---|---|---|
| Barlow | v13 | `assets/fonts/LICENSE-barlow.txt` |
| Barlow Condensed | v13 | `assets/fonts/LICENSE-barlow-condensed.txt` |
| Space Mono | v17 | `assets/fonts/LICENSE-space-mono.txt` |

14 woff2-Dateien, zusammen etwa 250 KB. Pro Seite lädt der Browser nur einen Teil davon.

## Lizenz

Alle drei Familien stehen unter der SIL Open Font License 1.1. Die Lizenzdateien stammen aus dem Repo `google/fonts` (Abruf 12.10.2026) und liegen unverändert neben den Schriften. Die Lizenz erlaubt nach ihrem Wortlaut, die Schriften zu nutzen, einzubetten und weiterzugeben, wenn bei jeder Kopie der Urheberhinweis und der Lizenztext mitgeliefert werden. Die Schriften dürfen nicht für sich allein verkauft werden. Das ist eine Lesart des Lizenztextes und keine Rechtsberatung.

## Schrift wechseln

1. Neue woff2-Dateien und deren Lizenz nach `assets/fonts/` legen, alte Dateien entfernen.
2. `assets/css/fonts.css` anpassen (ein `@font-face` je Schnitt und Teilmenge, relative Pfade, `font-display: swap`).
3. Die Familiennamen in `assets/css/tokens.css` bei `--schrift-kopf`, `--schrift-text` und `--schrift-mono` ersetzen.
4. `python3 scripts/check-extern.py` ausführen. Das Skript meldet Verweise auf Google Fonts und andere Schriftdienste.
5. Die Zeichen aus `COMPONENTS.md` prüfen (Umlaute, ß, Euro, Anführungszeichen, Pfeile) und eine Vorschau in Handy- und Desktopbreite ansehen.
6. Diese Datei und den Abschnitt "Schrift" in `DESIGN.md` nachziehen.
