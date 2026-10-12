# Schriften liegen auf dem eigenen Server

Die Schriften (Barlow Condensed, Barlow, Space Mono) werden aus `assets/fonts/` geladen und nicht von Google, damit beim Seitenbesuch keine Daten an Dritte gehen und die Seite ohne Fremdserver funktioniert. Die Familien sind nur in `assets/css/tokens.css` benannt und lassen sich wie die Farben austauschen. `scripts/check-extern.py` meldet Verweise auf Schriftdienste.
