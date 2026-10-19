#!/usr/bin/env python3
"""Schreibt die Suchmaschinen-Daten in alle Seiten und erzeugt robots.txt und sitemap.xml.

Einzige Quelle für meta description, canonical, Open Graph, Twitter-Karte und die Organisationsdaten.
Aufruf im Repo-Hauptordner: python3 scripts/seo.py
Der Aufruf ist wiederholbar: Der Block zwischen <!-- seo --> und <!-- /seo --> wird ersetzt.
BASIS ist die Adresse der veröffentlichten Seite. Sie ist eine Annahme, solange es keinen Deploy gibt (docs/deploy.md).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BASIS = "https://vianu247.com/"
NAME = "VIANU"
TELEFON = "+4915678548855"

# Seite -> (Beschreibung Deutsch, Beschreibung Englisch)
BESCHREIBUNG = {
    "index.html": (
        "Eine Sohle, die für deinen Fuß gefertigt wird: Fotos mit dem Smartphone, Lieferung in 7 Tagen und Zufriedenheitsgarantie. So läuft es ab.",
        "An insole made for your foot: photos with your smartphone, delivery in 7 days and a satisfaction guarantee. Here is how it works.",
    ),
    "b2b/index.html": (
        "Einlegesohlen für Mitarbeitende, die den ganzen Tag stehen: Fußerfassung per Smartphone, Fertigung in Deutschland, Pilot mit 10 Mitarbeitenden, produziert in 48 Stunden.",
        "Insoles for employees who stand all day: foot scan by smartphone, made in Germany, pilot with 10 employees, produced in 48 hours.",
    ),
    "b2b/personal.html": (
        "Wie Personal einen Pilot mit 10 Mitarbeitenden einführt: Aufgaben, Studien, Ergebnisbericht und häufige Fragen. Die Teilnahme ist freiwillig.",
        "How HR runs a pilot with 10 employees: tasks, studies, results report and common questions. Taking part is voluntary.",
    ),
    "b2b/geschaeftsfuehrung.html": (
        "Was ein Pilot mit 10 Mitarbeitenden kostet, was Sie dafür brauchen und wie Sie danach über mehr entscheiden. Mit Kostenrechner und Zufriedenheitsgarantie.",
        "What a pilot with 10 employees costs, what you need for it and how you decide on more afterwards. With cost calculator and satisfaction guarantee.",
    ),
    "b2b/arbeitsschutz.html": (
        "Die Einlegesohle ergänzt die Arbeitsplatzmatte und hilft an jedem Ort der Schicht. Was VIANU für Ihre Prüfung liefert, Studien und häufige Fragen.",
        "The insole adds to the anti-fatigue mat and helps in every place of the shift. What VIANU provides for your review, studies and common questions.",
    ),
    "b2b/einkauf.html": (
        "120 Euro je Paar zzgl. Umsatzsteuer, Pilot mit 10 Paaren für 1.200 Euro. Bestellweg, Zahlung auf Rechnung in 14 Tagen und Lieferung in 7 Tagen.",
        "EUR 120 per pair plus VAT, pilot with 10 pairs for EUR 1,200. Order route, payment by invoice in 14 days and delivery in 7 days.",
    ),
    "b2b/betriebsrat.html": (
        "Die Teilnahme ist freiwillig. So laufen die Daten von der Fußerfassung bis zum Bericht, was der Betrieb sieht und welche Unterlagen Sie erhalten.",
        "Taking part is voluntary. How the data runs from the foot scan to the report, what the company sees and which documents you receive.",
    ),
}
SEITEN = ["index.html", "b2b/index.html", "b2b/personal.html", "b2b/geschaeftsfuehrung.html",
          "b2b/arbeitsschutz.html", "b2b/einkauf.html", "b2b/betriebsrat.html", "impressum.html", "datenschutz.html"]
OHNE_SITEMAP = {"impressum.html", "datenschutz.html"}


def url(pfad, en):
    if en:
        pfad = "en/" + pfad
    if pfad.endswith("index.html"):
        pfad = pfad[: -len("index.html")]
    return BASIS + pfad


def esc(t):
    return t.replace("&", "&amp;").replace('"', "&quot;")


def organisation(en):
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": NAME,
        "url": BASIS,
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "sales" if en else "Vertrieb",
            "name": "Roderich Körner-Rehn",
            "telephone": TELEFON,
            "availableLanguage": ["de", "en"],
        },
    }


def produkt(en):
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "VIANU insole" if en else "VIANU Einlegesohle",
        "description": ("Individually made insole, printed in Germany from photos of the feet." if en
                        else "Individuell angefertigte Einlegesohle, gedruckt in Deutschland nach Fotos der Füße."),
        "brand": {"@type": "Brand", "name": NAME},
        "offers": {
            "@type": "Offer",
            "price": "120.00",
            "priceCurrency": "EUR",
            "priceSpecification": {"@type": "UnitPriceSpecification", "price": "120.00", "priceCurrency": "EUR",
                                    "valueAddedTaxIncluded": False, "unitText": "pair"},
            "url": url("b2b/index.html", en),
        },
    }


def block(pfad, en, titel, beschr):
    sprache, andere = ("en_US", "de_DE") if en else ("de_DE", "en_US")
    z = [
        "<!-- seo -->",
        '<link rel="canonical" href="%s">' % url(pfad, en),
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="%s">' % NAME,
        '<meta property="og:title" content="%s">' % esc(titel),
        '<meta property="og:description" content="%s">' % esc(beschr),
        '<meta property="og:url" content="%s">' % url(pfad, en),
        '<meta property="og:locale" content="%s">' % sprache,
        '<meta property="og:locale:alternate" content="%s">' % andere,
        '<meta name="twitter:card" content="summary">',
        '<meta name="twitter:title" content="%s">' % esc(titel),
        '<meta name="twitter:description" content="%s">' % esc(beschr),
    ]
    if pfad in ("index.html", "b2b/index.html"):
        daten = [organisation(en)] + ([produkt(en)] if pfad == "b2b/index.html" else [])
        for d in daten:
            z.append('<script type="application/ld+json">%s</script>' % json.dumps(d, ensure_ascii=False))
    z.append("<!-- /seo -->")
    return "\n".join(z) + "\n"


def bearbeite(pfad, en):
    datei = ROOT / (("en/" + pfad) if en else pfad)
    s = datei.read_text(encoding="utf-8")
    titel = re.search(r"<title>(.*?)</title>", s, re.S).group(1).strip()
    if pfad in BESCHREIBUNG:
        beschr = BESCHREIBUNG[pfad][1 if en else 0]
        s = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % esc(beschr), s, count=1)
    else:
        beschr = re.search(r'<meta name="description" content="([^"]*)">', s).group(1)
    s = re.sub(r"<!-- seo -->.*?<!-- /seo -->\n", "", s, flags=re.S)
    m = re.search(r'<link rel="alternate" hreflang="x-default"[^>]*>\n', s)
    s = s[: m.end()] + block(pfad, en, titel, beschr) + s[m.end():]
    datei.write_text(s, encoding="utf-8")


def sitemap():
    zeilen = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for pfad in SEITEN:
        if pfad in OHNE_SITEMAP:
            continue
        for en in (False, True):
            zeilen.append("  <url>")
            zeilen.append("    <loc>%s</loc>" % url(pfad, en))
            zeilen.append('    <xhtml:link rel="alternate" hreflang="de" href="%s"/>' % url(pfad, False))
            zeilen.append('    <xhtml:link rel="alternate" hreflang="en" href="%s"/>' % url(pfad, True))
            zeilen.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s"/>' % url(pfad, False))
            zeilen.append("  </url>")
    zeilen.append("</urlset>")
    (ROOT / "sitemap.xml").write_text("\n".join(zeilen) + "\n", encoding="utf-8")
    (ROOT / "robots.txt").write_text("User-agent: *\nAllow: /\n\nSitemap: %ssitemap.xml\n" % BASIS, encoding="utf-8")


def main():
    for pfad in SEITEN:
        for en in (False, True):
            bearbeite(pfad, en)
    sitemap()
    print("SEO-Daten für %d Seiten geschrieben, robots.txt und sitemap.xml erzeugt (Basis %s)." % (len(SEITEN) * 2, BASIS))
    return 0


if __name__ == "__main__":
    sys.exit(main())
