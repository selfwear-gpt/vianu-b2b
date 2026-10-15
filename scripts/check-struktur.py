#!/usr/bin/env python3
"""Prüft die Struktur der HTML-Dateien, damit Repo, Vorschau und Live-Seite gleich aussehen.

Gemeldet werden in allen HTML-Dateien:
1. Inline-Stile (style-Attribute und style-Blöcke). Aussehen gehört in assets/css/.
2. Inline-Skripte ohne src. Daten für Suchmaschinen (application/ld+json) sind erlaubt.
3. Pfade mit führendem Schrägstrich. Sie brechen, sobald die Seite in einem Unterordner liegt.
4. Verweise (href, src) auf Dateien, die im Repo nicht existieren.

Aufruf im Repo-Hauptordner: python3 scripts/check-struktur.py
Rückgabewert 0 bei Erfolg, 1 bei Verstößen.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", ".claude", "node_modules", "docs", "scripts", "tests"}
TAG = re.compile(r"<([a-zA-Z][\w-]*)\b([^>]*)>", re.DOTALL)
ATTR = re.compile(r"""\b([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')""", re.DOTALL)
EXTERN = ("http:", "https:", "//", "mailto:", "tel:", "data:", "javascript:", "sms:")


def line_of(text, pos):
    return text.count("\n", 0, pos) + 1


def check_file(path):
    problems = []
    rel = path.relative_to(ROOT)
    text = path.read_text(encoding="utf-8", errors="replace")

    for m in re.finditer(r"<style\b", text, flags=re.IGNORECASE):
        problems.append(f"{rel}:{line_of(text, m.start())}: style-Block (Aussehen gehört nach assets/css/)")

    for m in TAG.finditer(text):
        name, attrs = m.group(1).lower(), m.group(2)
        n = line_of(text, m.start())
        found = {a.group(1).lower(): (a.group(3) if a.group(3) is not None else a.group(4)) for a in ATTR.finditer(attrs)}

        if "style" in found:
            problems.append(f"{rel}:{n}: Inline-Stil im Tag <{name}> (Klasse in assets/css/ anlegen)")

        if name == "script" and "src" not in found and found.get("type", "").lower() != "application/ld+json":
            problems.append(f"{rel}:{n}: Inline-Skript (Code gehört nach assets/js/)")

        for key in ("href", "src"):
            value = found.get(key)
            if value is None:
                continue
            value = value.strip()
            if not value or value.startswith("#") or value.lower().startswith(EXTERN):
                continue
            if value.startswith("/"):
                problems.append(f"{rel}:{n}: {key}=\"{value}\" beginnt mit Schrägstrich (relativen Pfad verwenden)")
                continue
            target = (path.parent / re.split(r"[?#]", value)[0]).resolve()
            if target.is_dir():
                target = target / "index.html"
            if not target.exists():
                problems.append(f"{rel}:{n}: {key}=\"{value}\" verweist auf eine Datei, die nicht existiert")
    return problems


def main():
    problems = []
    files = [p for p in ROOT.rglob("*.html") if not (SKIP_DIRS & set(p.relative_to(ROOT).parts))]
    for path in sorted(files):
        problems += check_file(path)
    if problems:
        print(f"Strukturprobleme in {len(files)} HTML-Datei(en):")
        for p in problems:
            print("  " + p)
        return 1
    print(f"Struktur in Ordnung ({len(files)} HTML-Datei(en)).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
