"""Seam: pruefe_text() in scripts/check-text.py. Welche Textstellen die Regeln aus VOICE.md verletzen."""
import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("check_text", Path(__file__).resolve().parent.parent / "scripts" / "check-text.py")
check_text = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_text)


def regeln(text):
    return {p[1] for p in check_text.pruefe_text(text)}


class TextCheck(unittest.TestCase):
    def test_wirkversprechen_und_verbotene_begriffe(self):
        self.assertIn("schmerzfrei", regeln("Damit du schmerzfrei durch die Schicht kommst."))
        self.assertIn("patentiert", regeln("Unsere patentierte Erfassung."))
        self.assertIn("Einlage", regeln("Die Einlagen passen."))
        self.assertIn("Gendern mit Sonderzeichen", regeln("Liebe Kolleg:innen"))
        self.assertIn("Gendern mit Sonderzeichen", regeln("Mitarbeiter*innen"))

    def test_erlaubte_wörter_werden_nicht_gemeldet(self):
        self.assertEqual(regeln("Die Einlegesohle kommt in deine Schuhe. Arbeitsschutz und Datenschutz bleiben Thema."), set())
        self.assertEqual(regeln("Kolleginnen und Kollegen im Team."), set())

    def test_geviertstriche_und_satzmuster(self):
        self.assertIn("Geviertstrich", regeln("Das ist es — ganz einfach."))
        self.assertIn("Kontrastformel", regeln("Das ist nicht laut, sondern leise."))
        self.assertIn("Kontrastformel", regeln("Nicht nur Komfort, auch Haltung."))
        self.assertIn("Kontrastformel", regeln("Kein Messtag. Kein Termin. Nur dein Handy."))

    def test_floskeln(self):
        self.assertIn("Floskel", regeln("Eine nahtlose Lösung."))
        self.assertIn("Floskel", regeln("Wirklich einfach."))

    def test_englische_wirkversprechen(self):
        self.assertIn("schmerzfrei", regeln("Walk pain-free all day."))
        self.assertIn("Wirkversprechen", regeln("An insole that heals your feet."))
        self.assertIn("Wirkversprechen", regeln("A patented method and an orthotic insert."))
        self.assertEqual(regeln("A healthy team. Healthcare is not our topic. A cure for boredom is not claimed."), {"Wirkversprechen"})

    def test_englische_kontrastformeln(self):
        self.assertIn("Kontrastformel", regeln("It's not a gadget, it's a habit."))
        self.assertIn("Kontrastformel", regeln("This is not just comfort, but respect."))
        self.assertIn("Kontrastformel", regeln("Not only a pair of insoles but a signal."))
        self.assertIn("Kontrastformel", regeln("No test day. No appointment. Just your phone."))

    def test_englische_floskeln(self):
        for satz in ["A seamless fit.", "A robust plan.", "We truly care.", "We leverage data.", "Let's dive in.", "It is worth noting that this works."]:
            self.assertIn("Floskel", regeln(satz), satz)

    def test_englische_erlaubte_saetze(self):
        self.assertEqual(regeln("The insole goes into your own shoes. Taking part is voluntary. EUR 120 per pair, plus VAT."), set())
        self.assertEqual(regeln("Ask your works council about the program."), set())

    def test_meldung_nennt_die_zeile(self):
        treffer = check_text.pruefe_text("Alles gut.\nDamit du schmerzfrei bist.")
        self.assertEqual(treffer[0][0], 2)


if __name__ == "__main__":
    unittest.main()
