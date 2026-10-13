#!/usr/bin/env python3
"""Baut aus den Repo-Dateien eine einzelne HTML-Datei für die Vorschau (Artifact).

Die Vorschau nutzt denselben Code wie die Seite. Dieses Skript ist die einzige Stelle, die Stile,
Schriften und Skript einbettet, weil die Vorschau keine Nachbardateien laden darf.

- Stile: tokens.css, base.css, components.css (in dieser Reihenfolge, wie in der Seite)
- Schriften: nur die Teilmenge Latin aus fonts.css, als Data-URI eingebettet (Latin Extended entfällt)
- Skripte: die Skripte der Seiten (Reihenfolge wie in den Seiten), dazu Router und Anbindung der Vorschau
- Inhalt: der Inhalt von <body> aller Seiten in SEITEN, je in einem Container [data-seite]

Eine Datei zeigt alle Seiten. Die Adresse nach dem # wählt die Seite (siehe scripts/vorschau-router.js).
Damit gleiche ids auf zwei Seiten sich nicht stören, bekommt jede Seite ein Präfix vor ihren ids und den
Verweisen darauf (id, for, aria-*, use href). Die Seiten im Repo bleiben unverändert.

Aufruf im Repo-Hauptordner:
    python3 scripts/build-vorschau.py /pfad/zur/ausgabe.html "VIANU Vorschau"
"""
import base64
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Kennung, Datei, Präfix für ids. Neue Seiten hier eintragen.
SEITEN = [
    ("start", "index.html", "s-"),
    ("b2b", "b2b/index.html", "b-"),
    ("b2b-personal", "b2b/personal.html", "p-"),
    ("b2b-geschaeftsfuehrung", "b2b/geschaeftsfuehrung.html", "g-"),
    ("b2b-arbeitsschutz", "b2b/arbeitsschutz.html", "a-"),
    ("b2b-einkauf", "b2b/einkauf.html", "e-"),
    ("b2b-betriebsrat", "b2b/betriebsrat.html", "r-"),
    ("b2b-roderich", "b2b/roderich.html", "h-"),
    ("impressum", "impressum.html", "i-"),
    ("datenschutz", "datenschutz.html", "d-"),
]
# Englische Fassung: zu jeder Seite das Gegenstück unter en/ (Kennung "en" bzw. "en-<Kennung>", Präfix "en-<Präfix>")
SEITEN += [("en" if k == "start" else "en-" + k, "en/" + rel, "en-" + pr) for k, rel, pr in list(SEITEN)]


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


ID_ATTRIBUTE = ("aria-controls", "aria-labelledby", "aria-describedby", "aria-owns")


def praefix_ids(body, praefix):
    """Setzt ein Präfix vor alle ids der Seite und vor jeden Verweis darauf."""
    ids = set(re.findall(r'(?<![\w-])id="([^"]+)"', body))

    def tag(m):
        text = m.group(0)
        text = re.sub(r'(?<![\w-])(id|for)="([^"]+)"',
                      lambda a: f'{a.group(1)}="{praefix}{a.group(2)}"' if a.group(2) in ids or a.group(1) == "id" else a.group(0), text)
        for name in ID_ATTRIBUTE:
            text = re.sub(rf'(?<![\w-]){name}="([^"]+)"',
                          lambda a, n=name: f'{n}="' + " ".join(praefix + i if i in ids else i for i in a.group(1).split()) + '"', text)
        text = re.sub(r"url\(#([^)]+)\)", lambda a: f"url(#{praefix}{a.group(1)})" if a.group(1) in ids else a.group(0), text)
        if text.startswith("<use"):
            text = re.sub(r'href="#([^"]+)"', lambda a: f'href="#{praefix}{a.group(1)}"' if a.group(1) in ids else a.group(0), text)
        return text

    return re.sub(r"<[a-zA-Z][^>]*>", tag, body)


def downloads_einbetten(body, seite_rel):
    """Textdateien aus assets/downloads werden als Data-URI eingebettet, weil die Vorschau keine Nachbardateien hat. PDFs bleiben Verweise, die Anbindung der Vorschau meldet sie als nicht ladbar."""
    def ersetze(m):
        ziel = (ROOT / seite_rel).parent / m.group(1)
        if ROOT / "assets" / "downloads" not in ziel.resolve().parents or not ziel.is_file():
            return m.group(0)
        daten = base64.b64encode(ziel.read_bytes()).decode()
        return f'href="data:text/plain;base64,{daten}"'
    return re.sub(r'href="((?:\.\./)*assets/downloads/[^"?#]+\.txt)"', ersetze, body)


def seite_als_container(kennung, rel, praefix, sichtbar):
    html = lesen(rel)
    body = re.search(r"<body[^>]*>(.*)</body>", html, flags=re.S).group(1)
    body = re.sub(r"<script\b[^>]*\bsrc=[^>]*></script>", "", body)
    body = downloads_einbetten(praefix_ids(body, praefix), rel)
    versteckt = "" if sichtbar else " hidden"
    sprache = re.search(r'<html[^>]*\blang="([^"]+)"', html).group(1)
    return f'<div data-seite="{kennung}" data-praefix="{praefix}" lang="{sprache}"{versteckt}>\n{body}\n</div>'


def skripte_der_seiten():
    """Alle Skripte, die die Seiten einbinden, einmal, in der Reihenfolge des ersten Auftretens."""
    gefunden = []
    for _, rel, _ in SEITEN:
        html = lesen(rel)
        for src in re.findall(r'<script[^>]*\bsrc="([^"]+)"', html):
            pfad = ((ROOT / rel).parent / src).resolve().relative_to(ROOT).as_posix()
            if pfad not in gefunden:
                gefunden.append(pfad)
    return gefunden


VORSCHAU_STIL = """
.vorschau-hinweis{position:fixed;left:50%;bottom:var(--abstand-5,24px);transform:translateX(-50%);z-index:50;
max-width:calc(100vw - 32px);padding:var(--abstand-3,12px) var(--abstand-5,24px);background:var(--farbe-tinte);
color:var(--farbe-papier);border:2px solid var(--farbe-signal);font-family:var(--schrift-text);font-size:var(--schrift-groesse-klein)}
.vorschau-hinweis[hidden]{display:none}
"""


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    ausgabe = Path(sys.argv[1])
    titel = sys.argv[2] if len(sys.argv) > 2 else "VIANU Vorschau"

    teile = [
        f"<title>{titel}</title>",
        "<style>",
        lesen("assets/css/tokens.css"),
        schriften_einbetten(lesen("assets/css/fonts.css")),
        ":root{color-scheme:light}",
        lesen("assets/css/base.css"),
        lesen("assets/css/components.css"),
        VORSCHAU_STIL,
        "</style>",
    ]
    for i, (kennung, rel, praefix) in enumerate(SEITEN):
        teile.append(seite_als_container(kennung, rel, praefix, sichtbar=(i == 0)))
    for pfad in skripte_der_seiten() + ["scripts/vorschau-router.js", "scripts/vorschau-glue.js"]:
        teile += ["<script>", lesen(pfad), "</script>"]
    ausgabe.write_text("\n".join(teile) + "\n", encoding="utf-8")
    print(f"{ausgabe} ({ausgabe.stat().st_size // 1024} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
