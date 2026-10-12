#!/usr/bin/env python3
"""Prüft die Texte der Seite gegen die Regeln aus VOICE.md.

Gemeldet werden in HTML-Dateien, content/*.json und assets/downloads/*.txt:
- Wirkversprechen und verbotene Begriffe (schmerzfrei, patentiert, Einlage, Orthese, Hilfsmittel)
- Gendern mit Doppelpunkt, Sternchen oder Unterstrich
- Geviertstriche
- Kontrastformeln ("nicht X, sondern Y", "nicht nur X, auch Y", "Kein X. Kein Y. Nur Z.")
- Floskeln (nahtlos, robust, revolutionär, ganzheitlich, wirklich)

Nicht prüfbar sind Dreierlisten und Fragen mit direkt folgender Antwort. Dafür bleibt die Durchsicht.
Zahlen und Aussagen gegen FACTS.md prüft ebenfalls ein Mensch.

Aufruf im Repo-Hauptordner: python3 scripts/check-text.py
Rückgabewert 0 bei Erfolg, 1 bei Verstößen.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", ".claude", "node_modules", "docs", "scripts", "tests", ".scratch"}

REGELN = [
    ("schmerzfrei", re.compile(r"schmerzfrei|pain[- ]free", re.IGNORECASE)),
    ("patentiert", re.compile(r"patentiert", re.IGNORECASE)),
    ("Einlage", re.compile(r"\bEinlage")),
    ("Orthese", re.compile(r"\bOrthese", re.IGNORECASE)),
    ("Hilfsmittel", re.compile(r"\bHilfsmittel", re.IGNORECASE)),
    ("Gendern mit Sonderzeichen", re.compile(r"[A-Za-zÄÖÜäöüß][:*_/]innen\b|\*innen")),
    ("Geviertstrich", re.compile("[—–]")),
    ("Kontrastformel", re.compile(r"\bnicht\s+(?:nur\s+)?[^.!?\n]{1,80}?,?\s*sondern\b", re.IGNORECASE)),
    ("Kontrastformel", re.compile(r"\bnicht nur\b[^.!?\n]{1,80}?\bauch\b", re.IGNORECASE)),
    ("Kontrastformel", re.compile(r"\bKein(?:e|en|em)?\b[^.!?\n]{1,40}\.\s*Kein(?:e|en|em)?\b[^.!?\n]{1,40}\.\s*Nur\b")),
    ("Floskel", re.compile(r"\b(?:nahtlos|robust|revolution|ganzheitlich|wirklich)\w*", re.IGNORECASE)),
]


def pruefe_text(text):
    """Gibt eine Liste von (Zeile, Regel, Ausschnitt) zurück."""
    treffer = []
    for name, muster in REGELN:
        for m in muster.finditer(text):
            zeile = text.count("\n", 0, m.start()) + 1
            ausschnitt = " ".join(m.group(0).split())
            treffer.append((zeile, name, ausschnitt))
    treffer.sort()
    # gleiche Zeile und Regel nur einmal melden
    eindeutig, gesehen = [], set()
    for z, n, a in treffer:
        if (z, n) not in gesehen:
            gesehen.add((z, n))
            eindeutig.append((z, n, a))
    return eindeutig


def sichtbarer_text(html):
    """Entfernt style-Blöcke und Skripte (außer JSON-LD), ersetzt sie durch Leerzeilen für stabile Zeilennummern."""
    def leer(m):
        return "\n" * m.group(0).count("\n")

    html = re.sub(r"<style\b.*?</style>", leer, html, flags=re.S | re.I)

    def skript(m):
        return m.group(0) if "application/ld+json" in m.group(1).lower() else leer(m)

    return re.sub(r"<script\b([^>]*)>.*?</script>", skript, html, flags=re.S | re.I)


def dateien():
    muster = ["**/*.html", "content/*.json", "assets/downloads/*.txt"]
    gefunden = set()
    for m in muster:
        for p in ROOT.glob(m):
            if p.is_file() and not (SKIP_DIRS & set(p.relative_to(ROOT).parts)):
                gefunden.add(p)
    return sorted(gefunden)


def main():
    probleme = []
    files = dateien()
    for p in files:
        text = p.read_text(encoding="utf-8", errors="replace")
        if p.suffix == ".html":
            text = sichtbarer_text(text)
        for zeile, regel, ausschnitt in pruefe_text(text):
            probleme.append(f"{p.relative_to(ROOT)}:{zeile}: {regel}: \"{ausschnitt}\"")
    if probleme:
        print(f"Textregeln verletzt in {len(files)} Datei(en):")
        for p in probleme:
            print("  " + p)
        return 1
    print(f"Texte in Ordnung ({len(files)} Datei(en) geprüft).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
