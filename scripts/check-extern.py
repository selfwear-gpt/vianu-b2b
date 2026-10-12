#!/usr/bin/env python3
"""Prüft, dass keine Schriften oder Skripte von Fremdservern geladen werden.

Gemeldet werden Verweise auf Google Fonts und andere bekannte Schriftdienste in HTML, CSS, JS und SVG.
Aufruf im Repo-Hauptordner: python3 scripts/check-extern.py
Rückgabewert 0 bei Erfolg, 1 bei Verstößen.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCAN_SUFFIXES = {".css", ".html", ".js", ".svg"}
SKIP_DIRS = {".git", ".claude", "node_modules", "docs", "scripts", "tests"}
FORBIDDEN = re.compile(
    r"(fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit\.net|fonts\.adobe\.com|"
    r"use\.fontawesome\.com|kit\.fontawesome\.com|cdnjs\.cloudflare\.com/ajax/libs/font-awesome)",
    re.IGNORECASE,
)


def main():
    problems = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in SCAN_SUFFIXES:
            continue
        if SKIP_DIRS & set(path.relative_to(ROOT).parts):
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for n, line in enumerate(text.splitlines(), 1):
            m = FORBIDDEN.search(line)
            if m:
                problems.append(f"{path.relative_to(ROOT)}:{n}: Fremdserver {m.group(0)}")
    if problems:
        print("Schriften oder Bibliotheken von Fremdservern:")
        for p in problems:
            print("  " + p)
        return 1
    print("Keine Schriften von Fremdservern.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
