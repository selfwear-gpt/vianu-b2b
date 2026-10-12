# Farbwelten

Archiv der geprüften Farbwelten und Anleitung zum Wechseln. Die aktive Belegung steht in `assets/css/tokens.css`. Die Begründung steht in `docs/research/farbwelt.md`. Die Entscheidung, Farben nur als Rollen zu führen, steht in `docs/adr/0001-farbwelt-rollen-statt-farben.md`.

Vorschau aller Varianten (privater Link, nur mit dem Konto des Eigentümers): https://claude.ai/artifact/DPzdXXERfpwTypANPcWWNk

## Aktiv

**Farbwelt 3, Rosa und Tannengrün**, gewählt am 12.10.2026. Tannengrün als Tinte, Rosa als Signal und Nähe.

## Alle Varianten

Kontraste nach WCAG 2.2 gerechnet. "Tinte auf Signal" ist der Text auf einer Signal-Fläche. Signal auf Papier liegt bei allen Rosa-Varianten bei etwa 2,0 zu 1 und ist deshalb nie Textfarbe.

| Nr. | Name | Tinte | Papier | Signal | Nähe | Gedämpft | Tinte auf Papier | Tinte auf Signal |
|---|---|---|---|---|---|---|---|---|
| 1 | Rosa und Tinte | `#0E0E0C` | `#F2F2EE` | `#FF88BC` | `#FF88BC` | `#5C5C57` | 17,22 | 8,74 |
| 2 | Rosa und Nachtblau | `#0B1B3F` | `#F3F4F6` | `#FF88BC` | `#FF88BC` | `#4F5870` | 15,35 | 7,64 |
| **3** | **Rosa und Tannengrün (aktiv)** | `#0C3B31` | `#F3F3EE` | `#FF88BC` | `#FF88BC` | `#55605B` | 11,19 | 5,64 |
| 4 | Rosa und Mint | `#10231E` | `#F3F5F1` | `#9FE3C8` | `#FF88BC` | `#56615C` | 14,94 | 11,16 |
| 5 | Rosa und Safran | `#1A1410` | `#F6F2EC` | `#FFB81C` | `#FF88BC` | `#6A5F55` | 16,35 | 10,53 |
| 6 | Rosa und Kobalt | `#14186B` | `#F4F4F6` | `#FF88BC` | `#FF88BC` | `#5A5E86` | 13,93 | 6,92 |
| 7 | Rosa und Limette | `#0E0E0C` | `#F2F2EE` | `#C5FA1F` | `#FF88BC` | `#5C5C57` | 17,22 | 15,70 |

Ausgeschlossen: Rosa mit Violett oder Flieder (Nähe zum Violett-Blau-Verlauf, dem häufigsten KI-Muster) und Magenta oder Beerenrot (im Umfeld durch medi, machtfit, Wellhub und Spoorth besetzt). Quellen: `docs/research/farbwelt.md`.

Grenzen der Auswahl: Für eine Farbe, die Beschäftigte im Gastgewerbe oder Entscheider besser anspricht, gibt es keine belastbare Studie. Die Wahl beruht auf Abgrenzung zum Wettbewerb und auf Lesbarkeit.

## Farbwelt wechseln

1. Die Werte der Rollen in `assets/css/tokens.css` ersetzen. Andere Dateien bleiben unverändert.
2. `python3 scripts/check-tokens.py` ausführen. Das Skript meldet Farbwerte, die woanders stehen, und rechnet alle Kontrastpaare nach.
3. Eine Vorschau der Seite ansehen, in Handy- und Desktopbreite.
4. Die Belegung in `DESIGN.md` (Abschnitt "Farben und Tokens") und in dieser Datei ("Aktiv") nachziehen.
5. Wenn sich auch die Rollen ändern (zum Beispiel eine zweite Signalfarbe), den Eintrag in `docs/adr/` ergänzen.

Hinweis: Bei einem dunklen Signal (zum Beispiel Kobalt als Signal) ändert sich die Regel "Signal ist eine Fläche mit dunklem Text darauf". `--farbe-auf-signal` muss dann hell sein. Das Prüfskript fängt das über den Kontrast ab.
