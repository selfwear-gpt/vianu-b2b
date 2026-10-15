"""Seam: pruefe_faq() in scripts/check-faq.py. Ob FAQPage-Daten, sichtbarer Text und Fragearten zusammenpassen."""
import importlib.util
import json
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("check_faq", Path(__file__).resolve().parent.parent / "scripts" / "check-faq.py")
check_faq = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_faq)


def seite(fragen, daten=None):
    """fragen: Liste von (Frage, Antwort oder None für Platzhalter). daten: Liste von (Frage, Antwort) für JSON-LD,
    Standard: alle beantworteten Fragen."""
    if daten is None:
        daten = [(f, a) for f, a in fragen if a is not None]
    ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": f, "acceptedAnswer": {"@type": "Answer", "text": a}} for f, a in daten]}
    html = '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + "</script><body>"
    for f, a in fragen:
        if a is None:
            antwort = '<div class="platzhalter" data-platzhalter><p>Antwort folgt.</p></div>'
        else:
            antwort = f"<p>{a}</p>"
        html += f'<details class="frage"><summary>{f}</summary><div class="frage__antwort">{antwort}</div></details>'
    return html + "</body>"


def meldungen(html):
    return [m.lower() for m in check_faq.pruefe_faq(html)]


def enthaelt(html, stichwort):
    return any(stichwort in m for m in meldungen(html))


ALLGEMEIN = [("Was ist eine Einlegesohle?", "Eine Sohle im Schuh."), ("Wie läuft ein Fußscan ab?", "Mit Fotos.")]


class FaqCheck(unittest.TestCase):
    def test_passende_seite_ist_in_ordnung(self):
        self.assertEqual(meldungen(seite(ALLGEMEIN + [("Was ist VIANU?", "Ein Programm.")])), [])

    def test_seite_ohne_faq_wird_nicht_gemeldet(self):
        self.assertEqual(meldungen("<body><h1>Hallo</h1></body>"), [])

    def test_frage_nur_im_json(self):
        html = seite(ALLGEMEIN, daten=ALLGEMEIN + [("Versteckte Frage?", "Antwort.")])
        self.assertTrue(enthaelt(html, "versteckte frage"))

    def test_beantwortete_frage_fehlt_im_json(self):
        html = seite(ALLGEMEIN, daten=ALLGEMEIN[:1])
        self.assertTrue(enthaelt(html, "wie läuft ein fußscan ab"))

    def test_antworttext_weicht_ab(self):
        html = seite(ALLGEMEIN, daten=[ALLGEMEIN[0], (ALLGEMEIN[1][0], "Ganz anders.")])
        self.assertTrue(enthaelt(html, "weicht"))

    def test_platzhalter_im_json(self):
        fragen = ALLGEMEIN + [("Wer sieht meine Fotos?", None)]
        html = seite(fragen, daten=ALLGEMEIN + [("Wer sieht meine Fotos?", "Antwort folgt.")])
        self.assertTrue(enthaelt(html, "platzhalter"))

    def test_platzhalter_nur_sichtbar_ist_erlaubt(self):
        self.assertEqual(meldungen(seite(ALLGEMEIN + [("Wer sieht meine Fotos?", None)])), [])

    def test_mehr_als_die_halfte_markenfragen(self):
        fragen = [("Was ist VIANU?", "Ein Programm."), ("Wer zahlt bei VIANU?", "Der Arbeitgeber."), ("Wie ist der Alltag?", "Normal.")]
        self.assertTrue(enthaelt(seite(fragen), "marke"))

    def test_genau_die_halfte_markenfragen_ist_erlaubt(self):
        fragen = [("Was ist VIANU?", "Ein Programm."), ("Wie ist der Alltag?", "Normal.")]
        self.assertEqual(meldungen(seite(fragen)), [])

    def test_schreibweise_und_leerraum_zaehlen_nicht(self):
        html = seite(ALLGEMEIN, daten=[(f, a) for f, a in ALLGEMEIN])
        html = html.replace("<p>Eine Sohle im Schuh.</p>", "<p>Eine   Sohle\n  im Schuh.</p>")
        self.assertEqual(meldungen(html), [])


if __name__ == "__main__":
    unittest.main()
