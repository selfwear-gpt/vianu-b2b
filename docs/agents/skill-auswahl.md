# Skill-Auswahl

Bei jeder neuen Aufgabe wählt Claude den passenden Skill selbst und wendet ihn an. Der Nutzer muss ihn nicht nennen. Zu Beginn der Antwort steht eine Zeile mit dem gewählten Skill und dem Grund. Passt kein Skill, steht dort "kein Skill nötig".

Skills, die Claude nicht selbst aufrufen kann (im Katalog als "nur durch den Nutzer" markiert), öffnet Claude als Datei unter `.claude/skills/<name>/SKILL.md` und befolgt sie Schritt für Schritt.

## Zuordnung

| Aufgabe | Skill |
|---|---|
| Neue Seite, neuer Abschnitt, neue Funktion, unklare Entscheidung | `grilling`, dazu `domain-modeling` (zusammen: `grill-with-docs`). Bis keine offene Entscheidung bleibt, wird nicht gebaut |
| Begriffe klären, `GLOSSARY.md` pflegen, Entscheidung festhalten | `domain-modeling` |
| Recherche mit Quellen | `research` |
| Idee ausprobieren (Aussehen, Ablauf, Gefühl), bevor sie gebaut wird | `prototype` |
| Logik mit Verhalten: Formular, Teilen, Sprachwechsel, Name auf der Sohle | `tdd` |
| Etwas ist kaputt, falsch oder langsam | `diagnosing-bugs` |
| Aufbau von Modulen und Schnittstellen entscheiden | `codebase-design`, bei Umbau `improve-codebase-architecture` |
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
| Fragen zu Skills oder Vorgehen | `ask-matt` |

## Aufgabenablage

Pläne, Spezifikationen und Aufgaben liegen als Markdown-Dateien im Repo. GitHub-Issues bleiben außen vor, weil das Repo öffentlich ist. Die Einrichtung läuft über `setup-matt-pocock-skills` und ist noch zu erledigen.

## Immer zusätzlich

- Texte für die Seite: erst `VOICE.md`, `GLOSSARY.md` und `FACTS.md` lesen.
- Gestaltung und Bausteine: erst `DESIGN.md` und `COMPONENTS.md` lesen.
- Jede Regeländerung kommt in die zuständige Datei, nicht in `CLAUDE.md`.
