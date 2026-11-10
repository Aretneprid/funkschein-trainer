# Funkschein-Trainer

Lern-App für das **UKW-Sprechfunkzeugnis Binnen (UBI)** und das **Short Range Certificate (SRC)** – als installierbare Web-App, die auch offline funktioniert.

**App öffnen:** https://aretneprid.github.io/funkschein-trainer/

## Inhalt
- **Erklären:** aufbauender Kurs mit Lektionen, Grafiken, Beispielen und Mini-Checks
- **Prüfungsfragen:** alle amtlichen Katalogfragen üben, mit Fortschritt
- **Prüfung:** die 12 amtlichen Bögen je Zeugnis mit Zeit und Auswertung
- **Funkgerät:** Icom IC-M423 interaktiv (nach Bedienungsanleitung), Bedienabläufe üben, Menüstruktur
- **Nachschlagen & Werkzeuge:** Buchstabier-Trainer, Buchstabiertafel, Kanäle, MMSI/ATIS, Quellen und Videos
- **Buchstabier-Trainer:** internationale Buchstabiertafel in 10er-Runden (Buchstabe/Codewort, Rufzeichen, Hören, Sprechen), mit Fehlerstatistik; direkt von der Startseite erreichbar
- **Funk-Simulator:** Funksprüche (Mayday, Pan-Pan, Sécurité, Routine …) per Mikrofon oder Bausteinen sprechen, mit Prüfung und Antwort der Gegenstelle

Der Fortschritt wird nur lokal im Browser gespeichert.

## Installieren
**Android (Chrome):** Link öffnen → Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.

**iPhone/iPad (Safari):** Link in Safari öffnen → Teilen-Symbol → „Zum Home-Bildschirm“ → „Hinzufügen“.

**Computer (Chrome/Edge):** Installieren-Symbol rechts in der Adresszeile anklicken.

Nach dem ersten Öffnen läuft die App auch ohne Internet. Mikrofon und Sprachausgabe hängen vom Browser ab (am besten Chrome).

## Entwicklung
```bash
npm ci
npm run dev     # lokal starten
npm run build   # Build nach dist/
```
Jeder Push auf `main` baut und veröffentlicht die App automatisch über GitHub Actions.

Hinweis: Fragen aus den amtlichen Katalogen (ELWIS / ABVT); Gerätebedienung nach Icom-Bedienungsanleitung IC-M423 (A7197D-1EX-8). Kein offizielles Angebot von Icom oder der WSV.

Fotos in der App stammen von Wikimedia Commons (CC BY / CC BY-SA / CC0) und sind mit Quellenangabe versehen; der genaue Bildnachweis steht unter Nachschlagen › Quellen.
