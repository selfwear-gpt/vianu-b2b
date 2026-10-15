#!/usr/bin/env python3
"""Prüft den Textanteil der Entscheider-Seiten (b2b/<rolle>.html und en/b2b/<rolle>.html).

Regel aus VOICE.md: Höchstens 20 Prozent eines sichtbaren Bildschirms sind reiner Fließtext. Das Skript prüft eine
Näherung je Abschnitt:
- höchstens 2 Absätze mit 12 oder mehr Wörtern je Abschnitt (die FAQ und "Weiterleiten" sind ausgenommen; Bildunterzeilen,
  Quellenzeilen und Texte, die erst nach einem Klick erscheinen, zählen nicht),
- jede Chat-Nachricht hat höchstens 18 Wörter.
Aufruf im Hauptordner: python3 scripts/check-textanteil.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ROLLEN = ["personal", "geschaeftsfuehrung", "arbeitsschutz", "einkauf", "betriebsrat"]
AUSGENOMMEN = {"fragen-rolle", "weiterleiten"}
MAX_LANGE_ABSAETZE = 2
LANG = 12
MAX_CHAT = 18


def woerter(text):
    text = re.sub(r"<[^>]+>", " ", text)
    return len(re.findall(r"\S+", text))


def pruefe(pfad):
    html = pfad.read_text(encoding="utf-8")
    html = re.sub(r"<(script|style|svg)\b.*?</\1>", "", html, flags=re.S)
    fehler = []
    for m in re.finditer(r'<section class="([^"]*)"(?: id="([^"]+)")?[^>]*>(.*?)</section>', html, re.S):
        sid = m.group(2) or ("hero" if "hero" in m.group(1) else "?")
        if sid in AUSGENOMMEN:
            continue
        inhalt = m.group(3)
        lang = 0
        for p in re.finditer(r"<p\b([^>]*)>(.*?)</p>", inhalt, re.S):
            klassen = p.group(1)
            if "chat__blase" in klassen:
                n = woerter(p.group(2))
                if n > MAX_CHAT:
                    fehler.append("%s #%s: Chat-Nachricht mit %d Wörtern (höchstens %d)" % (pfad.relative_to(ROOT), sid, n, MAX_CHAT))
                continue
            if any(k in klassen for k in ("einseiter__fuss", "belege__hinweis", "beleg__zitat", "weg__satz", "ergebnis__satz", "ergebnis__fuss")):
                continue
            if "dreh__hinten" in inhalt[max(0, p.start() - 40):p.start()] or "fluss__feld" in inhalt[max(0, p.start() - 200):p.start()].split("</div>")[-1]:
                continue
            if woerter(p.group(2)) >= LANG:
                lang += 1
        if lang > MAX_LANGE_ABSAETZE:
            fehler.append("%s #%s: %d Absätze mit %d oder mehr Wörtern (höchstens %d)" % (pfad.relative_to(ROOT), sid, lang, LANG, MAX_LANGE_ABSAETZE))
    return fehler


def main():
    fehler = []
    for r in ROLLEN:
        for ordner in ("b2b", "en/b2b"):
            fehler += pruefe(ROOT / ordner / (r + ".html"))
    if fehler:
        print("Textanteil zu hoch in %d Abschnitt(en):" % len(fehler))
        for f in fehler:
            print("  " + f)
        return 1
    print("Textanteil in Ordnung (%d Seiten geprüft)." % (len(ROLLEN) * 2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
