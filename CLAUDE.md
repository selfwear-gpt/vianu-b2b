# VIANU Website

Statische Website mit zwei Bereichen: Mitarbeitende ("Du") und Entscheider im B2B-Bereich ("Sie"). Ziel des B2B-Bereichs ist die Buchung eines Piloten mit 10 Mitarbeitenden. Deutsch ist die Hauptsprache, Englisch ist über einen Umschalter erreichbar.

Diese Datei enthält nur Wegweiser. Die Regeln stehen in den verlinkten Dateien.

## Vor jeder Arbeit lesen

- `GLOSSARY.md`: Begriffe. Diese Wörter verwenden wir im Text, in Klassennamen und im Gespräch.
- `VOICE.md`: Ton, Anrede, Satzregeln, Wortliste.
- `FACTS.md`: Was auf der Seite stehen darf. Keine Zahl und keine Behauptung ohne Eintrag dort.
- `DESIGN.md`: Farben, Schrift, Abstände, Bewegung, Verbotsliste.
- `COMPONENTS.md`: Katalog der Bausteine. Bestehende Bausteine nutzen, bevor ein neuer entsteht.

## Aufbau des Repos

- `index.html`: Bereich für Mitarbeitende. `b2b/`: B2B-Bereich mit Persona-Unterseiten.
- `assets/css/`: `tokens.css` (nur Variablen), `base.css`, `components.css`. Kein CSS in HTML-Dateien.
- `assets/js/`: kleine Module, jedes mit einer einfachen Schnittstelle (Menü, Sprache, Formular).
- `assets/fonts/`: Schriften liegen hier. Keine Einbindung von Google Fonts oder anderen Fremdservern.
- `content/de.json`, `content/en.json`: Texte. Deutsch steht zusätzlich fest im HTML.

## Arbeitsregeln

- Ohne Build-Schritt: Dateien werden direkt ausgeliefert. Alle Pfade relativ.
- Eine Änderung pro Branch und Pull Request. Nichts geht ohne Freigabe nach `main`.
- Die laufende Seite vianu247.com und das Repo `vianu-website` bleiben unverändert.
- Keine Zugangsdaten, Schlüssel oder interne Unterlagen im Repo. Das Repo kann öffentlich sein.
- Bei jeder neuen Aufgabe zuerst `docs/agents/skill-auswahl.md` lesen, den passenden Skill selbst wählen und anwenden, ohne dass der Nutzer ihn nennt.
- Texte nie erfinden. Fehlt ein Beleg, steht ein markierter Platzhalter.
- Größere Entscheidungen kurz erklären (Was, Warum), damit sie nachvollziehbar bleiben.

## Qualitätsschranken vor jedem Merge

- HTML gültig, keine kaputten Links.
- Lighthouse: Leistung, Barrierefreiheit und SEO im grünen Bereich. Core Web Vitals: LCP unter 2,5 s, INP unter 200 ms, CLS unter 0,1.
- WCAG 2.2 Stufe AA: Kontraste, Tastaturbedienung, sichtbarer Fokus, Alternativtexte, `prefers-reduced-motion`.
- Screenshots in Handy- und Desktopbreite geprüft.
- Alle Texte in HTML ausgeliefert (auch Kachelrückseiten und Akkordeons), ein `h1` pro Seite.
- Kein Tracking vor Einwilligung. Keine Fremdserver beim Laden der Seite.

## Vorschau

Lokal: im Hauptordner `python3 -m http.server 8000`, dann `http://localhost:8000`.
