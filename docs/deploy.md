# Anforderungen an den Server

Diese Datei beschreibt, was der Server können muss, damit die Live-Seite so aussieht wie die Vorschau und der lokale Stand. Ein Deploy für `vianu-b2b` gibt es noch nicht. Einrichten kann ihn nur, wer Zugriff auf den Server hat. Eine Einrichtung der Zugangsdaten und eines Serverskripts geht mit dem Skill `wizard`.

## Warum Vorschau und Live-Seite gleich aussehen

Die Vorschau wird mit `scripts/build-vorschau.py` aus denselben Dateien gebaut wie die Seite. Am 12.10.2026 haben die lokale Seite und die gebaute Vorschau in Desktop- und Handybreite Byte für Byte identische Bilder ergeben. Die Live-Seite sieht gleich aus, wenn der Server dieselben Dateien in derselben Anordnung ausliefert.

## Ordnerstruktur

- Die Seiten laden ihr Aussehen über relative Pfade, zum Beispiel `../assets/css/tokens.css` aus `b2b/index.html`. `b2b/` und `assets/` müssen daher nebeneinander im selben Ordner liegen.
- Das Deploy kopiert den gesamten Repo-Inhalt mit Ausnahme von `.git/`, `.claude/`, `docs/`, `scripts/` und `.scratch/`. Wird nur ein Teilordner kopiert, lädt die Seite ohne Gestaltung.
- Der Ordner `b2b/` darf beim Deploy keine anderen Ordner auf dem Server löschen und umgekehrt. Wichtig, falls `vianu247.com` auf demselben Server liegt. Dort darf nichts überschrieben werden.

## Dateitypen

- `.woff2` wird als `font/woff2` ausgeliefert.
- `.css` als `text/css`, `.js` als `text/javascript`, `.html` als `text/html; charset=utf-8`.
- Komprimierung (gzip oder Brotli) für `.html`, `.css`, `.js`. Die Schriften sind bereits komprimiert.
- Langes Caching für `assets/fonts/` (Dateinamen ändern sich nicht, deshalb nur mit Bedacht), kurzes Caching für HTML und CSS.

## Sicherheits-Header

Die Seiten brauchen keine Inline-Stile und keine Inline-Skripte, `scripts/check-struktur.py` prüft das. Eine strenge Regel ist deshalb möglich:

```text
Content-Security-Policy: default-src 'self'; img-src 'self' data:; font-src 'self'; style-src 'self'; script-src 'self'; frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000
```

Sobald ein Baustein etwas von einem Fremdserver braucht (Formular, Analyse), wird die Regel bewusst erweitert und der Grund in `docs/adr/` festgehalten.

## Prüfung nach dem Deploy

1. Browsertest gegen die Live-Adresse:
   `node scripts/browsertest.js https://<live-adresse>/b2b/ /tmp/live`
2. Derselbe Test lokal (`python3 -m http.server 8000`, dann `node scripts/browsertest.js http://localhost:8000/b2b/index.html /tmp/lokal`).
3. Bilder vergleichen: `cmp /tmp/lokal/desktop.png /tmp/live/desktop.png` (ebenso `tablet.png` und `phone.png`). Keine Ausgabe heißt: identisch.
4. Bei einem Unterschied zuerst die Antwortköpfe prüfen (Dateityp der Schriften, Komprimierung, Weiterleitungen), dann die Ordnerstruktur.

Der Test meldet außerdem Überlauf, Anfragen an fremde Server, nicht geladene Schriften, die Zahl der `h1` und Konsolenfehler.

## Rückweg

Jede Änderung ist ein Commit auf `main`. Ein Zurückrollen heißt: den Commit rückgängig machen (`git revert`) und neu deployen. Das Deploy-Skript sollte die zuletzt ausgelieferte Version aufbewahren, damit der Server selbst zurückspringen kann.
