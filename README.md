# Filmsuche

Eine persönliche Suchmaschine, die mehrere Quellen gleichzeitig fragt, ob ein Film gerade irgendwo ansehbar oder ausleihbar ist: Streamingdienste, Mediatheken, YouTube, archive.org, UbuWeb, rarefilmm und Bibliothekskataloge. Die Ergebnisse stehen in einer Tabelle, die du sortieren, filtern, anpassen und exportieren kannst.

## Dateien im Repository

| Datei | Pflicht? | Zweck |
|---|---|---|
| `index.html` | ja | Die ganze Seite. |
| `README.md` | nein | Diese Anleitung. |
| `worker.js` | nein | Code für den Boten. Er wird bei Cloudflare eingefügt, nicht auf GitHub gebraucht. |
| `secrets.enc.json` | nein | Verschlüsselter TMDB-Key und Proxy, damit ein Passwort auf jedem Gerät reicht. |
| `index-ubuweb.json` | nein | Fertige Datenbank für UbuWeb, damit nicht jedes Gerät neu einlesen muss. |

## Einrichtung
### 1. TMDB-Key holen (empfohlen)
1. Kostenloses Konto auf themoviedb.org anlegen, dann unter **Einstellungen, API** einen Key beantragen (privater Gebrauch).
2. Den kurzen **API-Schlüssel** kopieren, nicht den langen „Read Access Token".
3. In der Filmsuche auf das Zahnrad klicken und ihn bei „TMDB-API-Key" einfügen. Er bleibt in deinem Browser gespeichert.

Ohne Key funktioniert die Suche weiter, aber Netflix, Mubi, Kanopy und BBC fehlen, und die Filmerkennung (Original- und deutscher Titel) ist schwächer.

### 2. Boten einrichten (Cloudflare Worker), damit YouTube, rarefilmm, UbuWeb und Co. funktionieren
Die Menünamen bei Cloudflare ändern sich gelegentlich. Der Weg bleibt aber gleich.
1. Kostenloses Konto auf cloudflare.com anlegen.
2. **Workers & Pages, Create, Create Worker.** Name z. B. `filmsuche-proxy`, dann **Deploy**.
3. Die Adresse des Workers (endet auf `.workers.dev`) in der Filmsuche unter Zahnrad, „Proxy-URL" eintragen.

### 3. Zugangsdaten per Passwort auf allen Geräten (optional)

### 5. UbuWeb-Index aufbauen (optional)
 Datei `index-ubuweb.json` im Repository, dann finden sie alle Geräte automatisch.


## Bedienung

**Suchen.** Einfach den Titel eingeben. Akzente sind egal („Abramovic" findet „Abramović", „Actualite" findet „Actualité"), ebenso Leerzeichen („war machine" findet „Warmachine"). Mit `/` springst du in die Suchleiste.

**Suchbefehle** in der Suchleiste oder unter „Erweiterte Suche": `regie:godard jahr:1960 land:frankreich laenge:>80 sprache:de`. Eine Jahreszahl am Ende zählt nur als Hinweis.

**„Meintest du".** Mit TMDB-Key erscheinen Vorschläge. Ein Klick darauf legt fest, welcher Film gemeint ist.

**Quellen.** Die Marken zeigen pro Dienst die Trefferzahl: grüner Punkt = Treffer, grau = keine, rot = Fehler (der Grund steht daneben), blinkend = läuft noch. Ein Klick öffnet die Suche direkt beim Dienst.

**Tabelle.**
- **Relevanz:** 0 bis 100. Das „?" neben der Überschrift erklärt die Rechnung, im Tooltip siehst du sie pro Treffer.
- **Sortieren:** Klick auf eine Überschrift. Das Dreieck zeigt Richtung und Spalte.
- **Spalten:** Überschriften ziehen, um sie zu verschieben, oder über „Spalten ▾" ein- und ausblenden.
- **Filter:** Unter jeder Überschrift. Text, `!Wort` zum Ausschließen, Zahlen als `>90`, `<120`, `60-120`.
- **Titel, Jahr und Regisseur** werden auch aus dem Titel gelesen (z. B. „Titel (Regisseur, 1952)") und in die Spalten gesetzt, der Titel wird aufgeräumt.
- **Trailer** sind ausgeblendet und lassen sich über „Trailer anzeigen" einblenden.
- **Export:** Häkchen setzen und „CSV" oder „JSON" wählen. Ohne Auswahl werden alle sichtbaren Treffer exportiert, in der Spaltenreihenfolge, die du eingestellt hast.

**Dienste verwalten.** „+ Dienst hinzufügen", ✎ zum Bearbeiten, × zum Entfernen. Typen:

| Typ | Wofür |
|---|---|
| Streaminganbieter (TMDB) | Netflix, Mubi, Kanopy, BBC u. ä. |
| Mediathek-Sender | ARD, ZDF, Arte |
| YouTube / archive.org | Direkte Suche |
| Website per Domain | Suche über DuckDuckGo auf einer Seite (Proxy nötig) |
| Eigene Such-URL | Seiten mit eigener Suche, `{q}` steht für den Suchbegriff |
| Katalog-Link | Bibliothek: öffnet die Katalogsuche, den Bestand prüfst du dort |
| Seitenindex | Seiten ohne Suche, z. B. UbuWeb |

## Wenn etwas nicht klappt

| Meldung oder Verhalten | Ursache und Lösung |
|---|---|
| „Vom Browser blockiert (CORS), Proxy nötig" | Für diesen Dienst brauchst du den Boten (Schritt 3). Bis dahin hilft ein Klick auf die Dienst-Marke. |
| „Proxy nötig (Einstellungen)" | Proxy-URL fehlt im Zahnrad. |
| „TMDB-Key fehlt" | Key im Zahnrad eintragen (Schritt 2). |
| „HTTP 401" bei TMDB | Der Key ist falsch. Kopiere den kurzen API-Schlüssel. |
| „Index fehlt" bei UbuWeb | Links auf ⟳ klicken (Schritt 5). |
| YouTube oder DuckDuckGo liefern nichts | Diese Seiten blockieren manchmal Server. Nutze die Dienst-Marke zum direkten Öffnen. |
| Nichts passiert nach einem Update | Strg+F5 drücken. |

## Grenzen und Hinweise
- **Mubi und Kanopy:** Die Daten kommen über TMDB von JustWatch und können hinterherhinken. Bei Kanopy zeigt TMDB nicht, ob deine Bibliothek den Film freigeschaltet hat. Die Dienst-Marke öffnet die Suche direkt dort.
- **Jahr, Regisseur, Länge** stehen nur, wo die Quelle oder der Titel sie hergibt. Sonst steht „–".
- **Datenschutz:** Key, Proxy, Dienste und Spalten liegen nur in deinem Browser. Die Seite hat keinen eigenen Server.
- **Fairness:** Nutze die Seite für den persönlichen Gebrauch und lass Seiten wie UbuWeb nicht mit Anfragen überrollen.
- Diese Seite nutzt die TMDB-API, wird aber von TMDB weder unterstützt noch zertifiziert. Verfügbarkeitsdaten stammen über TMDB von JustWatch.
