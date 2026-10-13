#!/usr/bin/env python3
"""Prüft die FAQ jeder HTML-Seite gegen die Regeln aus VOICE.md, Abschnitt "FAQ".

Gemeldet werden:
- Fragen in den FAQPage-Daten (application/ld+json), die nicht sichtbar auf der Seite stehen, und umgekehrt
- Antworttexte in den Daten, die vom sichtbaren Text abweichen (Leerraum zählt nicht)
- Platzhalter (data-platzhalter) in den FAQPage-Daten
- mehr als die Hälfte der Fragen einer Seite nennt VIANU (Markenfragen)

Sichtbare Fragen sind <details class="frage"> mit <summary> und <div class="frage__antwort">.
Nicht prüfbar: ob eine Antwort für sich steht und VIANU erst am Ende nennt. Das bleibt die Durchsicht.

Aufruf im Repo-Hauptordner: python3 scripts/check-faq.py
Rückgabewert 0 bei Erfolg, 1 bei Verstößen.
"""
import json
import re
import sys
from html import unescape
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", ".claude", "node_modules", "docs", "scripts", "tests", ".scratch"}


def norm(text):
    return " ".join(unescape(text).split())


class Leser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.daten = []  # (Frage, Antwort) aus JSON-LD
        self.sichtbar = []  # dict(frage, antwort, platzhalter)
        self._ld = None
        self._frage = None
        self._ziel = None  # "frage" oder "antwort"
        self._tiefe_antwort = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "script" and (a.get("type") or "").lower() == "application/ld+json":
            self._ld = []
        elif tag == "details" and "frage" in (a.get("class") or "").split():
            self._frage = {"frage": [], "antwort": [], "platzhalter": False}
        elif self._frage is not None:
            if tag == "summary":
                self._ziel = "frage"
            elif tag == "div" and "frage__antwort" in (a.get("class") or "").split():
                self._ziel, self._tiefe_antwort = "antwort", 1
            elif self._ziel == "antwort":
                if tag == "div":
                    self._tiefe_antwort += 1
                if "data-platzhalter" in a:
                    self._frage["platzhalter"] = True

    def handle_endtag(self, tag):
        if tag == "script" and self._ld is not None:
            self._lies_ld("".join(self._ld))
            self._ld = None
        elif self._frage is not None:
            if tag == "summary":
                self._ziel = None
            elif tag == "div" and self._ziel == "antwort":
                self._tiefe_antwort -= 1
                if self._tiefe_antwort == 0:
                    self._ziel = None
            elif tag == "details":
                f = self._frage
                self.sichtbar.append({"frage": norm("".join(f["frage"])), "antwort": norm("".join(f["antwort"])), "platzhalter": f["platzhalter"]})
                self._frage = None

    def handle_data(self, data):
        if self._ld is not None:
            self._ld.append(data)
        elif self._frage is not None and self._ziel:
            self._frage[self._ziel].append(data)

    def _lies_ld(self, text):
        try:
            obj = json.loads(text)
        except ValueError:
            return
        for o in obj if isinstance(obj, list) else [obj]:
            if isinstance(o, dict) and o.get("@type") == "FAQPage":
                for q in o.get("mainEntity", []):
                    self.daten.append((norm(q.get("name", "")), norm((q.get("acceptedAnswer") or {}).get("text", ""))))


def pruefe_faq(html):
    """Gibt eine Liste von Meldungen zurück. Leer heißt in Ordnung."""
    leser = Leser()
    leser.feed(html)
    meldungen = []
    sichtbar = {s["frage"]: s for s in leser.sichtbar}
    daten = dict(leser.daten)

    for frage, antwort in leser.daten:
        s = sichtbar.get(frage)
        if s is None:
            meldungen.append(f'Frage nur in den FAQPage-Daten, nicht sichtbar: "{frage}"')
        elif s["platzhalter"]:
            meldungen.append(f'Platzhalter-Frage in den FAQPage-Daten: "{frage}"')
        elif s["antwort"] != antwort:
            meldungen.append(f'Antwort in den Daten weicht vom sichtbaren Text ab: "{frage}"')
    for s in leser.sichtbar:
        if not s["platzhalter"] and s["frage"] not in daten:
            meldungen.append(f'Beantwortete Frage fehlt in den FAQPage-Daten: "{s["frage"]}"')

    fragen = [s["frage"] for s in leser.sichtbar]
    marke = [f for f in fragen if re.search(r"vianu", f, re.IGNORECASE)]
    if fragen and len(marke) * 2 > len(fragen):
        meldungen.append(f"Zu viele Markenfragen: {len(marke)} von {len(fragen)} nennen VIANU (höchstens die Hälfte)")
    return meldungen


def main():
    probleme, geprueft = [], 0
    for p in sorted(ROOT.rglob("*.html")):
        if SKIP_DIRS & set(p.relative_to(ROOT).parts):
            continue
        geprueft += 1
        for m in pruefe_faq(p.read_text(encoding="utf-8", errors="replace")):
            probleme.append(f"{p.relative_to(ROOT)}: {m}")
    if probleme:
        print(f"FAQ-Regeln verletzt in {geprueft} Datei(en):")
        for m in probleme:
            print("  " + m)
        return 1
    print(f"FAQ in Ordnung ({geprueft} HTML-Datei(en) geprüft).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
