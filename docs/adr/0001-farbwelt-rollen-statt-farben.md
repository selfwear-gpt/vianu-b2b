# Farben nur als Rollen in tokens.css

Die Farbwelt kann sich später komplett ändern, weil die Identität noch nicht final ist. Deshalb stehen Farbwerte ausschließlich in `assets/css/tokens.css`, und alle anderen Dateien verwenden Rollennamen wie `--farbe-signal`. Die erste Belegung ist Farbwelt 3 (Rosa und Tannengrün), und `scripts/check-tokens.py` prüft, dass sonst nirgends Farbwerte stehen und dass die Kontraste der Rollen bestehen.
