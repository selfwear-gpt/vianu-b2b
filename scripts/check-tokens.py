#!/usr/bin/env python3
"""Prüft die Farbregeln des Projekts.

1. Farbwerte (#hex, rgb(), hsl()) stehen nur in assets/css/tokens.css.
2. Die Rollen in tokens.css bestehen die Kontrastpaare nach WCAG 2.2.

Aufruf im Repo-Hauptordner: python3 scripts/check-tokens.py
Rückgabewert 0 bei Erfolg, 1 bei Verstößen.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOKENS = ROOT / "assets" / "css" / "tokens.css"
SCAN_SUFFIXES = {".css", ".html", ".js", ".svg"}
SKIP_DIRS = {".git", ".claude", "node_modules", "docs", "scripts", "tests"}

HEX = re.compile(r"(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])")
FUNC = re.compile(r"\b(?:rgba?|hsla?)\(", re.IGNORECASE)

# Paare, die bestehen müssen: (Vordergrund, Hintergrund, Mindestwert, Beschreibung)
REQUIRED = [
    ("--farbe-tinte", "--farbe-papier", 4.5, "Fließtext auf Papier"),
    ("--farbe-gedaempft", "--farbe-papier", 4.5, "Nebentext auf Papier"),
    ("--farbe-auf-signal", "--farbe-signal", 4.5, "Text auf Signal-Flächen"),
    ("--farbe-auf-signal", "--farbe-naehe", 4.5, "Text auf Nähe-Flächen"),
    ("--farbe-signal", "--farbe-tinte", 4.5, "Signal auf Tinte (Text, Icons, Linien)"),
    ("--farbe-naehe", "--farbe-tinte", 3.0, "Nähe auf Tinte (große Schrift, Grafik)"),
    ("--farbe-papier", "--farbe-tinte", 4.5, "Papier auf Tinte (Text im Menü)"),
]
# Nur zur Information: Signal darf auf Hell nie Textfarbe sein.
INFO = [("--farbe-signal", "--farbe-papier", "Signal auf Papier")]


def read_tokens():
    text = re.sub(r"/\*.*?\*/", "", TOKENS.read_text(encoding="utf-8"), flags=re.S)
    raw = dict(re.findall(r"(--farbe-[\w-]+)\s*:\s*([^;]+);", text))
    values = {}

    def resolve(name, depth=0):
        if depth > 5 or name not in raw:
            raise ValueError(f"Rolle {name} fehlt oder ist zirkulär")
        v = raw[name].strip()
        m = re.fullmatch(r"var\((--[\w-]+)\)", v)
        return resolve(m.group(1), depth + 1) if m else v

    for name in raw:
        values[name] = resolve(name)
    return values


def luminance(hex_value):
    h = hex_value.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def contrast(a, b):
    la, lb = luminance(a), luminance(b)
    if la < lb:
        la, lb = lb, la
    return (la + 0.05) / (lb + 0.05)


def check_literals():
    problems = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix not in SCAN_SUFFIXES or path == TOKENS:
            continue
        if SKIP_DIRS & set(path.relative_to(ROOT).parts):
            continue
        # Das Favicon kann keine CSS-Variablen nutzen. Seine Farben müssen den Tokens gleichen (tests/seo.test.js prüft das).
        if path.relative_to(ROOT).as_posix() == "assets/img/favicon.svg":
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        for n, line in enumerate(text.splitlines(), 1):
            for m in HEX.finditer(line):
                before = line[: m.start()]
                if re.search(r"(href|src|action)\s*=\s*[\"']$", before) or before.endswith("url("):
                    continue
                problems.append(f"{path.relative_to(ROOT)}:{n}: Farbwert {m.group(0)}")
            if FUNC.search(line):
                problems.append(f"{path.relative_to(ROOT)}:{n}: Farbfunktion {FUNC.search(line).group(0)}")
    return problems


def main():
    failed = False
    literals = check_literals()
    if literals:
        failed = True
        print("Farbwerte außerhalb von tokens.css:")
        for p in literals:
            print("  " + p)
    else:
        print("Keine Farbwerte außerhalb von tokens.css.")

    try:
        values = read_tokens()
    except (ValueError, FileNotFoundError) as e:
        print(f"Fehler beim Lesen von tokens.css: {e}")
        return 1

    print("\nKontraste (WCAG 2.2):")
    for fg, bg, minimum, label in REQUIRED:
        if fg not in values or bg not in values:
            print(f"  FEHLT  {label}: Rolle {fg} oder {bg} nicht definiert")
            failed = True
            continue
        ratio = contrast(values[fg], values[bg])
        ok = ratio >= minimum
        failed = failed or not ok
        print(f"  {'ok    ' if ok else 'FEHLER'} {ratio:5.2f} zu 1 (min. {minimum})  {label}")
    for fg, bg, label in INFO:
        if fg in values and bg in values:
            print(f"  info   {contrast(values[fg], values[bg]):5.2f} zu 1             {label} (nie als Textfarbe)")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
