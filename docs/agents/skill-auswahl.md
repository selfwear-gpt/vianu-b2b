# Skill-Auswahl

Bei jeder neuen Aufgabe wählt Claude den passenden Skill selbst und wendet ihn an. Der Nutzer muss ihn nicht nennen. Zu Beginn der Antwort steht eine Zeile mit dem gewählten Skill und dem Grund. Passt kein Skill, steht dort "kein Skill nötig".

Skills, die Claude nicht selbst aufrufen kann (Kennzeichen `disable-model-invocation: true` im Kopf der Datei), öffnet Claude als Datei unter `.claude/skills/<name>/SKILL.md` und befolgt sie Schritt für Schritt. Ein Skill mit Abhängigkeiten nutzt die Dateien unter `docs/agents/`.

Skills, die zu dieser Seite nicht passen, liegen in `.claude/skills-archiv/` und werden nicht geladen. Zurückholen mit `git mv .claude/skills-archiv/<name> .claude/skills/<name>`.

## Zuordnung

| Aufgabe | Skill |
|---|---|
| Neue Seite, neuer Abschnitt, neue Funktion, unklare Entscheidung | `grilling` (Kurzform `grill-me`), dazu `domain-modeling` (zusammen: `grill-with-docs`). Bis keine offene Entscheidung bleibt, wird nicht gebaut |
| Begriffe klären, `GLOSSARY.md` pflegen, Entscheidung festhalten | `domain-modeling` |
| Recherche mit Quellen | `research` |
| Idee ausprobieren (Aussehen, Ablauf, Gefühl), bevor sie gebaut wird | `prototype` |
| Logik mit Verhalten: Formular, Teilen, Sprachwechsel, Name auf der Sohle | `tdd` |
| Etwas ist kaputt, falsch oder langsam | `diagnosing-bugs` |
| Aufbau von Modulen und Schnittstellen entscheiden | `codebase-design` |
| Plan in Spezifikation und Aufgaben zerlegen | `to-spec`, `to-tickets` |
| Aufgaben umsetzen | `implement`, bei mehreren Aufgaben `implement-spec` |
| Sehr großes Vorhaben in Entscheidungen zerlegen | `wayfinder` |
| Umgesetzte Änderungen prüfen | `code-review` |
| Beschreibung eines Pull Requests | `pr` |
| Skills, `CLAUDE.md` oder andere Agent-Dokumente schreiben | `writing-for-agents` |
| Schritt, den nur ein Mensch tun kann (Secrets, Serverskript, Konsole) | `wizard` |
| Der Nutzer braucht Wissen von einer anderen Person | `to-questionnaire` |
| Der Nutzer sagt, eine Antwort sei unklar | `wait-what` |
| Rückblick auf eine Sitzung | `retro` |
| Arbeit an eine neue Sitzung übergeben | `handoff` |

## Aufgabenablage

Pläne, Spezifikationen und Aufgaben liegen als Markdown-Dateien unter `.scratch/<thema>/`. GitHub-Issues bleiben außen vor, weil das Repo öffentlich ist. Einrichtung erledigt am 12.10.2026, Regeln in `docs/agents/issue-tracker.md`.

## Immer zusätzlich

- Texte für die Seite: erst `VOICE.md`, `GLOSSARY.md` und `FACTS.md` lesen.
- Seiten mit FAQ: dazu `VOICE.md`, Abschnitt "FAQ" (Fragen wie Fremde suchen, VIANU erst am Ende der allgemeinen Antworten), danach `python3 scripts/check-faq.py`.
- Gestaltung und Bausteine: erst `DESIGN.md` und `COMPONENTS.md` lesen.
- Jede Regeländerung kommt in die zuständige Datei, nicht in `CLAUDE.md`.
