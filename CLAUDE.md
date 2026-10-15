# VIANU Website

Statische Website mit zwei Bereichen: Mitarbeitende ("Du") und Entscheider im B2B-Bereich ("Sie"). Ziel des B2B-Bereichs ist die Buchung eines Piloten mit 10 Mitarbeitenden. Deutsch ist die Hauptsprache, Englisch (unter `en/`) ist über einen Umschalter erreichbar.

Diese Datei enthält nur Wegweiser. Die Regeln stehen in den verlinkten Dateien.

## Vor jeder Arbeit lesen

- `GLOSSARY.md`: Begriffe. Diese Wörter verwenden wir im Text, in Klassennamen und im Gespräch.
- `VOICE.md`: Ton, Anrede, Satzregeln, Wortliste.
- `FACTS.md`: Was auf der Seite stehen darf. Keine Zahl und keine Behauptung ohne Eintrag dort.
- `DESIGN.md`: Farben, Schrift, Abstände, Bewegung, Verbotsliste.
- `COMPONENTS.md`: Katalog der Bausteine. Bestehende Bausteine nutzen, bevor ein neuer entsteht.

## Aufbau des Repos

- `index.html`: Bereich für Mitarbeitende (Startseite unter der Adresse ohne Zusatz). `b2b/`: B2B-Bereich mit Persona-Unterseiten.
- `assets/css/`: `tokens.css` (nur Variablen), `fonts.css` (Schrifteinbindung), `base.css`, `components.css`. Kein CSS in HTML-Dateien.
- `assets/js/`: kleine Module, jedes mit einer einfachen Schnittstelle (Menü, Sprache, Formular).
- `assets/fonts/`: Schriften liegen hier. Keine Einbindung von Google Fonts oder anderen Fremdservern.
- `en/`: englische Fassung, zu jeder deutschen Seite eine Seite mit demselben Dateinamen (Seitenpaar), alles im HTML. `content/de.json` und `content/en.json` bleiben leer und werden nicht verwendet.

## Arbeitsregeln

- Ohne Build-Schritt: Dateien werden direkt ausgeliefert. Alle Pfade relativ.
- Eine Änderung pro Branch und Pull Request. Nichts geht ohne Freigabe nach `main`.
- Die laufende Seite vianu247.com und das Repo `vianu-website` bleiben unverändert.
- Keine Zugangsdaten, Schlüssel oder interne Unterlagen im Repo. Das Repo kann öffentlich sein.
- Bei jeder neuen Aufgabe zuerst `docs/agents/skill-auswahl.md` lesen, den passenden Skill selbst wählen und anwenden, ohne dass der Nutzer ihn nennt.
- Jede inhaltliche Änderung gilt sinngemäß auch für die englische Fassung unter `en/`. Beide Fassungen ändern wir immer zusammen, ohne dass der Nutzer es erneut sagt.
- Texte nie erfinden. Fehlt ein Beleg, steht ein markierter Platzhalter.
- Größere Entscheidungen kurz erklären (Was, Warum), damit sie nachvollziehbar bleiben.
- Die Einseiter-PDFs unter `assets/downloads/rolle-*.pdf` und `role-*.pdf` (englisch) entstehen aus den Rollenseiten: nach jeder Änderung an einer Rollenseite `NODE_PATH=$(npm root -g) CHROMIUM_PFAD=<Chromium> node scripts/erzeuge-pdf.js` ausführen und die PDFs mit committen.

## Qualitätsschranken vor jedem Merge

- HTML gültig, keine kaputten Links.
- Lighthouse: Leistung, Barrierefreiheit und SEO im grünen Bereich. Core Web Vitals: LCP unter 2,5 s, INP unter 200 ms, CLS unter 0,1.
- WCAG 2.2 Stufe AA: Kontraste, Tastaturbedienung, sichtbarer Fokus, Alternativtexte, `prefers-reduced-motion`.
- `python3 scripts/check-tokens.py` ohne Fehler: keine Farbwerte außerhalb von `assets/css/tokens.css`, Kontraste der Rollen bestehen.
- `python3 scripts/check-extern.py` ohne Fehler: keine Schriften oder Bibliotheken von Fremdservern.
- `python3 scripts/check-struktur.py` ohne Fehler: keine Inline-Stile, keine Inline-Skripte, keine absoluten Pfade, keine Verweise auf fehlende Dateien.
- `python3 scripts/check-text.py` ohne Fehler: keine verbotenen Wörter, keine Geviertstriche, keine Kontrastformeln, kein Gendern mit Sonderzeichen. Dreierlisten und Frage-Antwort-Muster prüft die Durchsicht.
- `python3 scripts/check-textanteil.py` ohne Fehler: auf den Entscheider-Seiten höchstens zwei Absätze mit 12 oder mehr Wörtern je Abschnitt und höchstens 18 Wörter je Chat-Nachricht (Näherung der Regel "höchstens 20 Prozent eines Bildschirms ist Fließtext" aus `VOICE.md`).
- `python3 scripts/check-faq.py` ohne Fehler: FAQPage-Daten gleichen dem sichtbaren Text, keine Platzhalter in den Daten, höchstens die Hälfte Markenfragen. Ob eine Antwort für sich steht, prüft die Durchsicht (`VOICE.md`, Abschnitt "FAQ").
- `node --test tests/*.test.js`, `python3 tests/test_check_text.py` und `python3 tests/test_check_faq.py` ohne Fehler.
- `node scripts/browsertest.js <Adresse> <Ordner>` ohne Fehler (Überlauf, Fremdanfragen, Schriften, ein `h1`, Konsole), Bilder in Handy- und Desktopbreite angesehen.
- Jede Seite hat ein Gegenstück in der anderen Sprache (`tests/sprachen.test.js`). Wer eine Seite ändert, ändert ihr Seitenpaar mit.
- Alle Texte in HTML ausgeliefert (auch Kachelrückseiten und Akkordeons), ein `h1` pro Seite.
- Kein Tracking vor Einwilligung. Keine Fremdserver beim Laden der Seite.

## Agent skills

### Issue tracker

Aufgaben und Spezifikationen liegen als Markdown-Dateien unter `.scratch/`, nicht in GitHub-Issues. Siehe `docs/agents/issue-tracker.md`.

### Triage labels

Nur der Status `ready-for-agent` und seine Nachbarn sind in Gebrauch. Siehe `docs/agents/triage-labels.md`.

### Domain docs

Ein Kontext: `GLOSSARY.md` und `docs/adr/` im Hauptordner. Siehe `docs/agents/domain.md`.

## Vorschau

Lokal: im Hauptordner `python3 -m http.server 8000`, dann `http://localhost:8000/b2b/index.html`.

Vorschau-Link für den Nutzer: `python3 scripts/build-vorschau.py <Ausgabe.html> "<Titel>"` baut alle Seiten in eine Datei (Navigation über `#`, `#b2b`), danach als Artifact veröffentlichen. Neue Seiten in `SEITEN` im Skript eintragen. Anforderungen an den Server und Prüfung nach dem Deploy: `docs/deploy.md`.
