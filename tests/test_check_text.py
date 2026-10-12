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

    def test_meldung_nennt_die_zeile(self):
        treffer = check_text.pruefe_text("Alles gut.\nDamit du schmerzfrei bist.")
        self.assertEqual(treffer[0][0], 2)


if __name__ == "__main__":
    unittest.main()
