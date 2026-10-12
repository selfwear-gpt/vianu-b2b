#!/usr/bin/env python3
"""Baut aus den Repo-Dateien eine einzelne HTML-Datei für die Vorschau (Artifact).

Die Vorschau nutzt denselben Code wie die Seite. Dieses Skript ist die einzige Stelle, die Stile,
Schriften und Skript einbettet, weil die Vorschau keine Nachbardateien laden darf.

- Stile: tokens.css, base.css, components.css (in dieser Reihenfolge, wie in der Seite)
- Schriften: nur die Teilmenge Latin aus fonts.css, als Data-URI eingebettet (Latin Extended entfällt)
- Skript: assets/js/site.js
- Inhalt: der Inhalt von <body> der angegebenen Seite

Aufruf im Repo-Hauptordner:
    python3 scripts/build-vorschau.py b2b/index.html /pfad/zur/ausgabe.html "VIANU B2B Startseite"
"""
import base64
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def lesen(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def schriften_einbetten(fonts_css):
    """Gibt @font-face-Blöcke zurück, nur Latin, mit Data-URI statt Dateipfad."""
    bloecke = []
    for block in re.findall(r"@font-face\s*\{.*?\}", fonts_css, flags=re.S):
        m = re.search(r'url\("\.\./fonts/([^"]+)"\)', block)
        if not m or not m.group(1).endswith("-latin.woff2"):
            continue
        daten = base64.b64encode((ROOT / "assets" / "fonts" / m.group(1)).read_bytes()).decode()
        block = block.replace(m.group(0), f"url(data:font/woff2;base64,{daten})")
        block = re.sub(r"\s*unicode-range:[^;]+;", "", block)
        bloecke.append(" ".join(block.split()))
    return "\n".join(bloecke)


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 2
    seite, ausgabe = sys.argv[1], Path(sys.argv[2])
    titel = sys.argv[3] if len(sys.argv) > 3 else "VIANU Vorschau"

    html = lesen(seite)
    body = re.search(r"<body[^>]*>(.*)</body>", html, flags=re.S).group(1)
    body = re.sub(r"<script\b[^>]*\bsrc=[^>]*></script>", "", body)

    teile = [
        f"<title>{titel}</title>",
        "<style>",
        lesen("assets/css/tokens.css"),
        schriften_einbetten(lesen("assets/css/fonts.css")),
        ":root{color-scheme:light}",
        lesen("assets/css/base.css"),
        lesen("assets/css/components.css"),
        "</style>",
        body,
        "<script>",
        lesen("assets/js/site.js"),
        "</script>",
    ]
    ausgabe.write_text("\n".join(teile) + "\n", encoding="utf-8")
    print(f"{ausgabe} ({ausgabe.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
