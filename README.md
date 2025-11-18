# 🧹 Social AI & Bullshit Filter (Chrome Extension)

Dein Feed ist voll mit "Game Changern", "Deep Dives" und emotionalen Heldengeschichten aus der ChatGPT-Fabrik? 
Dieses Plugin macht Schluss damit. Es scannt deinen Feed in Echtzeit und markiert Inhalte, die wahrscheinlich von einer KI generiert wurden oder aggressives "Influencer-Engagement-Baiting" betreiben.

**Aktuelle Version:** 9.0 (Storyteller Edition)

## 🎯 Was das Ding tut

Es löscht keine Posts (das zerschießt oft das Layout), sondern markiert sie visuell, damit du sie geistig überspringen kannst.

* **🤖 KI-Erkennung:** Findet typisches LLM-Vokabular ("delve into", "tapestry", "in der heutigen Welt") und monotone Satzstrukturen.
* **📝 Broetry-Filter:** Erkennt den typischen "LinkedIn-Influencer-Stil" (Jeder Satz ein Absatz. Dramatische Pausen. Eine Frage am Ende?).
* **🎣 Engagement-Bait-Check:** Markiert Posts, die nur darauf aus sind, Kommentare zu fischen.
* **📖 Storytelling-Radar:** Schlägt Alarm bei überdramatisierten "Heldengeschichten" (Insolvenz, Mindset, Grind).

## 🌍 Wo es funktioniert

* **LinkedIn** (Der Endgegner)
* **Threads** (.net & .com)
* **Twitter / X**
* **Facebook**

## 🎨 Der Farb-Code

* 🟥 **ROTER RAHMEN:** Hohe Wahrscheinlichkeit für KI oder extremen Bullshit.
* 🟧 **ORANGER RAHMEN:** Verdachtsmomente (Buzzwords oder seltsame Formatierung).

## 🚀 Installation (Manuell / Sideload)

Da dieses Plugin (noch) nicht im Chrome Web Store ist, musst du es manuell installieren. Keine Sorge, dauert 30 Sekunden.

1.  **Download:** Lade diesen Ordner herunter (oder klone das Repo).
2.  **Chrome öffnen:** Geh in die Adresszeile und tippe `chrome://extensions` ein.
3.  **Entwicklermodus:** Schalte oben rechts den Schalter **"Entwicklermodus"** ein.
4.  **Laden:** Klicke oben links auf den Button **"Entpackte Erweiterung laden"**.
5.  **Auswählen:** Wähle den Ordner dieses Projekts aus.
6.  **Fertig:** Geh auf LinkedIn oder Threads und drücke F5.

## 🔒 Datenschutz

* **100% Lokal:** Die Analyse passiert komplett in deinem Browser (JavaScript).
* **Kein Tracking:** Es werden keine Daten an OpenAI, an mich oder sonst wen gesendet.
* **Kostenlos:** Kostet nix, außer den Speicherplatz für ein paar Zeilen Code.

## 🛠 Tech Stack

* Manifest V3
* Vanilla JS (Keine Frameworks, pure Performance)
* Heuristische Analyse (Pattern Recognition, Statistical Variance, Keyword-Scoring)

---

*"The grind is real." - Aber dein Feed muss es nicht sein.*
