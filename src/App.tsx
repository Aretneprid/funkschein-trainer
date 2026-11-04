import {
  Callout,
  BulletList,
  Select,
  Input,
  Toggle,
  Button,
  LinkCards,
  Status,
  Segmented,
  useState,
  useMemo,
  useEffect,
  useGrokTheme,
} from "./canvas";
import type { CSSProperties, ReactNode } from "./canvas";

type Theme = ReturnType<typeof useGrokTheme>;

/* ---------- Amtliche Fragenkataloge (Antwort an Position 1 ist laut Katalog richtig) ---------- */
type Row = [number, string, string, string, string, string];

const S: Row[] = [
[1, "„Mobiler Seefunkdienst“ ist mobiler Funkdienst …", "zwischen Küstenfunkstellen und Seefunkstellen bzw. zwischen Seefunkstellen untereinander", "zwischen tragbaren Funkstellen an Bord eines Seefahrzeuges", "ausschließlich zwischen Seefunkstellen", "zwischen Funkstellen, für die keine Zuteilung (Ship Station Licence) notwendig ist"],
[2, "Welche Funktion hat das „GMDSS“ (Global Maritime Distress and Safety System)?", "Hilfe in Seenotfällen und Sicherung der Schifffahrt durch schnelle und genaue Alarmierung im Seenotfall", "Koordinierung der Alarmierung von Seefunkstellen im Seenotfall", "Positionsbestimmung des Havaristen durch geostationäre Satelliten", "Störungsfreier Funkverkehr im Seenotfall"],
[3, "Zu welchem Zweck wurde das Weltweite Seenot- und Sicherheitsfunksystem (GMDSS) eingeführt?", "Schnelle und genaue Alarmierung in Not-, Dringlichkeits- und Sicherheitsfällen", "Schnelle Alarmierung in Notfällen", "Schnelle und genaue Alarmierung in Not- und Dringlichkeitsfällen", "Schnelle und genaue Alarmierung in Not- und Sicherheitsfällen"],
[4, "Welche Aufgaben hat die Internationale Fernmeldeunion (International Telecommunication Union [ITU])?", "Die Internationale Fernmeldeunion (ITU) legt die grundlegenden Regelungen für die internationale Telekommunikation fest", "Die Internationale Fernmeldeunion (ITU) legt für alle Nationen der UN, die weltweit Seeschifffahrt betreiben, die Mindeststandards hinsichtlich der Funkausrüstung von Seeschiffen fest", "Die Internationale Fernmeldeunion (ITU) führt als internationale Verkehrsbehörde weltweit die Überwachung des Funkverkehrs durch", "Die Internationale Fernmeldeunion (ITU) rechnet die Gebühren von weltweiten Seefunkgesprächen ab"],
[5, "Was regelt die Vollzugsordnung für den Funkdienst (VO Funk, engl. Radio Regulations [RR])?", "Die Vollzugsordnung für den Funkdienst (RR) regelt u. a. die Zuweisung von Frequenzbereichen an die Funkdienste und die Betriebsverfahren im Seefunkdienst", "Die Vollzugsordnung für den Funkdienst (RR) regelt die Ausrüstung von Seeschiffen bezüglich der Funkeinrichtung", "Die Vollzugsordnung für den Funkdienst (RR) regelt den freien Funkverkehr zwischen den Seefahrt betreibenden Nationen", "Die Vollzugsordnung für den Funkdienst (RR) regelt die Benutzung von Radaranlagen auf Seeschiffen auf See und in Häfen"],
[6, "Welche Publikationen des Bundesamtes für Seeschifffahrt und Hydrographie (BSH) enthalten speziell für die Sportschifffahrt Informationen zum Seefunk?", "Funkdienst für die Klein- und Sportschifffahrt", "Nautisches Jahrbuch", "Nachrichten für Seefahrer", "Mitteilungen für Seefunkstellen und Schiffsfunkstellen"],
[7, "Was ist eine „Küstenfunkstelle“?", "Ortsfeste Funkstelle des mobilen Seefunkdienstes", "Funkstelle an Bord eines Schiffes im Küstenbereich, über die wichtige Informationen für die Seeschifffahrt verbreitet werden", "Funkstelle des Rundfunkdienstes zur Übermittlung von Wetternachrichten für die Schifffahrt", "Funkstelle an Bord eines Schiffes für den Empfang von Funkgesprächen aus dem Mobilfunknetz"],
[8, "Was bedeutet „öffentlicher Funkverkehr“?", "Funkverkehr, der der Allgemeinheit zum Austausch von Nachrichten dient", "Funkverkehr, der im Gegensatz zum Nichtöffentlichen Funkverkehr unverschlüsselt abgewickelt wird", "Funkverkehr, der von jeder Seefunkstelle abgehört werden muss", "Funkverkehr, der nicht dem Fernmeldegeheimnis und dem Abhörverbot unterliegt"],
[9, "Für die Teilnahme am öffentlichen Funkverkehr ist – im Gegensatz zur Teilnahme am Nicht-öffentlichen Funkverkehr – zusätzlich erforderlich …", "Vertrag mit einer Abrechnungsgesellschaft", "Besitz eines Seefunkzeugnisses", "Zulassung des Funkgeräts", "Zuteilung (Ship Station Licence)"],
[10, "Wodurch erfährt eine Seefunkstelle von einer Küstenfunkstelle, dass dort Nachrichten für sie vorliegen?", "Individuelle Benachrichtigung oder Abhören von Sammelanrufen", "Individuelle Benachrichtigung durch die Abrechnungsgesellschaft", "Individuelle Benachrichtigung mittels SMS oder E-Mail", "Öffentliche Benachrichtigung mittels NAVTEX"],
[11, "Was sind die Abrechnungsgrundlagen für ein Seefunkgespräch über eine deutsche Küstenfunkstelle?", "Gesprächsdauer und Preis der Verrechnungseinheiten", "Gesprächsdauer und Entfernung zur Küstenfunkstelle", "Gesprächsdauer und Frequenznutzungsgebühren", "Gesprächsdauer und Dringlichkeit des Gesprächs"],
[12, "Was ist eine „Sea-Area“ im GMDSS?", "Festgelegtes Seegebiet", "International festgelegtes Seewarngebiet", "Im NAVTEX bestimmtes Seegebiet", "Weltweites Raster zum schnellen Auffinden von verunglückten Fahrzeugen"],
[13, "Welche Bezeichnungen tragen die Seegebiete, in denen für Schiffe eine bestimmte Funkausrüstung international vorgeschrieben ist?", "A1, A2, A3, A4", "A, B, C, D", "NAVAREAS", "Küstengewässer, küstennahe Seegewässer, Hohe See"],
[14, "Eine Yacht befindet sich in einem Seegebiet, das von der Sprechfunkreichweite einer UKW-Küstenfunkstelle abgedeckt wird, die ununterbrochen für DSC-Alarmierungen zur Verfügung steht. In welchem Seegebiet befindet sich das Fahrzeug?", "Seegebiet A1", "Seegebiet A2", "Seegebiet A3", "Seegebiet A4"],
[15, "Welches sind die satellitengestützten Alarmierungssysteme im Weltweiten Seenot- und Sicherheitsfunksystem (GMDSS)?", "COSPAS-SARSAT, Inmarsat", "Eutelsat, Globalstar", "EPIRB, AIS", "DSC, COSPAS-SARSAT"],
[16, "Was wird als „MSI“ bezeichnet?", "Nachricht, die die Sicherheit der Seeschifffahrt betrifft", "Rufnummer im Seefunkdienst (Maritime Mobile Service Identity)", "Mittlere Signalstärke des modulierten Eingangssignals", "Landeskennung einer Seefunkstelle"],
[17, "Welche Aussendung wird als „WX“ bezeichnet?", "Wetterbericht", "Nautische Warnnachricht", "Aussendung, die zurückgenommen wurde", "Funktelexaussendung im GMDSS"],
[18, "Welche Aussendung wird als „NX“ bezeichnet?", "Nautische Warnnachricht", "Wetterbericht", "Aussendung, die zurückgenommen wurde", "Funktelexaussendung im GMDSS"],
[19, "Was versteht man unter „AIS“?", "Automatisches Schiffsidentifizierungs- und Überwachungssystem, das statische und dynamische Schiffsdaten auf UKW überträgt", "Automatische Aussendung der Kennung eines Seeschiffes jede Minute bzw. beim Loslassen der Sprechtaste", "Allgemeines Informationssystem für die Seeschifffahrt", "Identifizierung eines Schiffes mit Hilfe von Radarpeilungen und deren Weitergabe an die Schifffahrt zur Kollisionsverhütung"],
[20, "Was bedeutet „ETA“?", "Voraussichtliche Ankunftszeit", "Voraussichtliche Abfahrtszeit", "Voraussichtliche Gesamtfahrtzeit", "Voraussichtliche Restfahrtzeit"],
[21, "Wonach richten sich die Zeitangaben im Seefunkdienst?", "Koordinierte Weltzeit (Universal Time Co-ordinated [UTC])", "Bordzeit, berichtigt nach Sommer- oder Winterzeit", "Greenwich-Zeit (Greenwich Mean Time [GMT])", "Ortszeit, bezogen auf den Standort des Schiffes (Local Time [LT])"],
[22, "Welche Bedeutung hat die Zeitangabe „LT“ (Local Time)?", "Ortszeit, bezogen auf den Standort des Schiffes", "Zeitzone entsprechend der geografischen Breite des Schiffsortes", "Zeit, die bei Funkaussendungen in einem bestimmten Seegebiet zu verwenden ist", "Zeit, die automatisch durch ein an die Funkanlage angeschlossenes GPS-Gerät übermittelt wird"],
[23, "Wie bezeichnet man ein funkärztliches Beratungsgespräch?", "Medico-Gespräch", "Emergency-Gespräch", "Medical-Transport-Gespräch", "Erste-Hilfe-Gespräch"],
[24, "Was ist eine „Seefunkstelle“?", "Funkstelle des mobilen Seefunkdienstes an Bord eines nicht dauernd verankerten Seefahrzeuges", "Typgeprüfte Funkstelle, die kein ATIS-Signal aussendet", "Seefunkgerät samt Antenne, das im UKW- bzw. Grenz- und Kurzwellenbereich betrieben wird", "Funkstelle, die am GMDSS teilnehmen darf"],
[25, "Welches Funkzeugnis ist auf einem mit einer Seefunkanlage ausgerüsteten Sportfahrzeug unter deutscher Flagge für den Schiffsführer vorgeschrieben?", "Ein Funkzeugnis, das zum Bedienen der eingebauten Anlage berechtigt, z. B. SRC oder LRC", "Ein SRC bis zur Grenze der Hoheitsgewässer, darüber hinaus ein LRC", "Keines, es genügt, wenn eine Person an Bord ist, die die Funkanlage bedienen darf", "Für die Bedienung einer Grenz-/Kurzwellenanlage ist das LRC vorgeschrieben, für die Bedienung einer UKW-Anlage zusätzlich das SRC"],
[26, "Welche Funkanlagen darf der Inhaber eines Beschränkt Gültigen Funkbetriebszeugnisses (Short Range Certificate [SRC]) bedienen?", "UKW-Funkanlagen im Seefunkdienst auf nicht funkausrüstungspflichtigen Fahrzeugen und auf Traditionsschiffen", "UKW-Funkanlagen für See- und Luftfunkstellen", "UKW-Funkanlagen auf Sportbooten im Seefunkdienst und Binnenschifffahrtsfunk", "UKW-Funkanlagen auf funkausrüstungspflichtigen und nicht funkausrüstungspflichtigen Seeschiffen"],
[27, "Welche Sportboote müssen mit einer UKW-Seefunkanlage ausgerüstet sein?", "Gewerbsmäßig genutzte Sportboote mit einer Länge über alles von 12 m und mehr", "Sportboote mit einer Länge über alles von 12 m und mehr", "Sportboote mit einer Antriebsmaschine von 3,68 kW und mehr", "Gewerbsmäßig genutzte Sportboote mit einer Antriebsmaschine von 3,68 kW und mehr"],
[28, "Welche rechtlichen Voraussetzungen sind für den Betrieb einer Seefunkstelle auf einem Sportfahrzeug und einem Traditionsschiff zu erfüllen?", "Zuteilung (Ship Station Licence), für den Seefunkdienst zugelassene oder in Verkehr gebrachte Funkgeräte, ausreichendes Seefunkzeugnis des Fahrzeugführers", "Zuteilung (Ship Station Licence), ausreichendes Seefunkzeugnis und Sportbootführerschein des Fahrzeugführers", "Zuteilung (Ship Station Licence), ausreichendes Seefunkzeugnis einer Person an Bord", "Zuteilung (Ship Station Licence), für den Seefunkdienst zugelassene oder in Verkehr gebrachte Funkgeräte, Sportbootführerschein"],
[29, "Welche Urkunde und welcher Befähigungsnachweis müssen bei der Überprüfung einer Seefunkstelle auf einem Sportfahrzeug dem Prüfbeamten auf Verlangen vorgelegt werden?", "Zuteilung (Ship Station Licence) und Seefunkzeugnis des Fahrzeugführers", "Zuteilung (Ship Station Licence) und Sportbootführerschein des Fahrzeugführers", "Seefunkzeugnis eines Besatzungsmitgliedes und Internationaler Bootsschein (IBS)", "Seefunkzeugnis des Fahrzeugführers und Eigentumsnachweis"],
[30, "Die Urkunde über die Zuteilung (Ship Station Licence) zum Betreiben einer Seefunkstelle wird in Deutschland ausgestellt durch …", "die Bundesnetzagentur (BNetzA), Außenstelle Hamburg", "die Bundesnetzagentur (BNetzA), Außenstelle Mülheim an der Ruhr", "das Bundesamt für Seeschifffahrt und Hydrographie (BSH), Rostock", "das Wasserstraßen- und Schifffahrtsamt, Hamburg"],
[31, "Welche Urkunde für die Seefunkstelle muss auf einem Sportfahrzeug mitgeführt werden?", "Zuteilungsurkunde (Ship Station Licence) (im Original)", "Zuteilungsurkunde (Ship Station Licence) (in Kopie)", "Gerätezulassungsurkunde (im Original)", "Gerätezulassungsurkunde (in Kopie)"],
[32, "Was und zu welchem Zweck muss ein Schiffseigner bei Änderung des Schiffsnamens in Bezug auf seine Seefunkstelle veranlassen?", "Namensänderung der Bundesnetzagentur schriftlich mitteilen zwecks Änderung seiner Zuteilungsurkunde (Ship Station Licence)", "Namensänderung dem Bundesamt für Seeschifffahrt und Hydrographie schriftlich mitteilen zwecks Änderung der Gerätezulassungsurkunde)", "Namensänderung dem Wasser- und Schifffahrtsamt, Hamburg schriftlich mitteilen zwecks Änderung des Kennzeichenausweises", "Namensänderung der Zentralen Verwaltungsstelle schriftlich mitteilen zwecks Änderung des Kennzeichenausweises"],
[34, "Was ist beim Kauf eines UKW-Sprechfunkgeräts für den Seefunkdienst oder eines UKW-GMDSS-Funkgeräts zu beachten?", "Das Funkgerät muss für den Seefunkdienst zugelassen oder in Verkehr gebracht worden sein", "Das Funkgerät muss funktionsfähig und TÜV-geprüft sein", "Das Funkgerät muss eine NAVTEX-Schnittstelle aufweisen oder Wetterberichte empfangen können", "Das Funkgerät muss von der Dienststelle Schiffssicherheit der Berufsgenossenschaft Verkehrswirtschaft Post-Logistik Telekommunikation (BG Verkehr) für Sportboote zugelassen sein"],
[35, "Wer stellt in Deutschland Funksicherheitszeugnisse für Sportboote aus, die gewerbsmäßig genutzt werden?", "Dienststelle Schiffssicherheit der Berufsgenossenschaft Verkehrswirtschaft Post-Logistik Telekommunikation (BG Verkehr)", "Bundesamt für Seeschifffahrt und Hydrographie (BSH)", "Wasserstraßen- und Schifffahrtsverwaltung (WSV)", "Bundesnetzagentur (BNetzA)"],
[36, "Ein Sportboot von 12 Meter Länge und mehr benötigt ein Funksicherheitszeugnis...", "bei gewerbsmäßiger Nutzung", "bei Regattateilnahme", "bei Auslandsfahrten und in internationalen Gewässern", "in jedem Fall"],
[37, "Welche Sendeleistungen lassen sich bei einer fest installierten UKW-Seefunkanlage schalten?", "1 Watt oder maximal 25 Watt", "25 Watt oder maximal 50 Watt", "0,1 Watt oder maximal 2,5 Watt", "1 Watt oder maximal 12 Watt"],
[38, "Welche Behörde erteilt in Deutschland sechsstellige Rufzeichen für Seefunkstellen?", "Bundesnetzagentur (BNetzA), Außenstelle Hamburg", "Bundesnetzagentur (BNetzA), Außenstelle Mülheim an der Ruhr", "Bundesamt für Seeschifffahrt und Hydrographie (BSH), Hamburg", "Wasser- und Schifffahrtsamt (WSA), Hamburg"],
[39, "Welche Behörden in Deutschland sind berechtigt, die Funktionsfähigkeit von Seefunkstellen zu überprüfen?", "Bundesnetzagentur (BNetzA) und Bundesamt für Seeschifffahrt und Hydrographie (BSH)", "Wasser- und Schifffahrtsdirektionen", "Wasserschutzpolizeibehörden der Küstenländer", "Hafenbehörden in den Seehäfen"],
[40, "Welche Behörde teilt einer in das Seeschiffsregister eingetragenen Yacht das mindestens vierstellige Unterscheidungssignal zu?", "Seeschiffsregister des zuständigen Amtsgerichts", "Wasser- und Schifffahrtsverwaltung (WSV)", "Bundesnetzagentur (BNetzA)", "Bundesamt für Seeschifffahrt und Hydrographie (BSH)"],
[41, "Welche Art von Funkstelle hat z. B. das Rufzeichen „DDTW“?", "Seefunkstelle an Bord eines deutschen Schiffes, eingetragen in einem Seeschiffsregister", "Küstenfunkstelle des Schiffsmeldedienstes (SMD)", "Funkstelle des Nichtöffentlichen Funkdienstes", "Funkstelle an Bord eines SAR-Hubschraubers"],
[42, "Das Abhörverbot und das Fernmeldegeheimnis sind geregelt...", "im Telekommunikationsgesetz (TKG)", "in der Vollzugsordnung für den Funkdienst (VO Funk)/in den Radio Regulations (RR)", "in der Schiffssicherheitsverordnung (SchSV)", "im Gesetz über Funkanlagen und Telekommunikationseinrichtungen (FTEG)"],
[43, "Wer ist beim Betrieb einer Seefunkstelle auf einem Sportboot zur Wahrung des Fernmeldegeheimnisses und des Abhörverbots verpflichtet?", "Alle Personen, die eine Seefunkstelle beaufsichtigen, bedienen oder Kenntnis über öffentlichen Nachrichtenaustausch erlangt haben", "Alle Personen, die ständig an Bord sind", "Alle Personen, die das Funkgerät bedienen können", "Alle Personen, die vom Schiffsführer ausdrücklich dazu verpflichtet worden sind"],
[44, "Welche Nachrichten dürfen uneingeschränkt aufgenommen und verbreitet werden?", "Aussendungen, die „An alle Funkstellen“ gerichtet sind", "Aussendungen, die von allgemeinem Interesse sind", "Aussendungen im öffentlichen Seefunkdienst", "Aussendungen im Seefunkdienst dürfen uneingeschränkt aufgenommen und verbreitet werden"],
[45, "Wenn ein Funkgerät ordnungsgemäß in Verkehr gebracht worden ist, trägt es...", "das CE-Zeichen", "eine Seriennummer", "das GS-Prüfzeichen", "das VDE-Prüfzeichen"],
[46, "Zur Teilnahme am Binnenschifffahrtsfunk muss eine Seefunkstelle...", "mit einer umschaltbaren „Kombi-Anlage für Seefunkdienst und Binnenschifffahrtsfunk“ oder einer zusätzlichen Sprechfunkanlage für den Binnenschifffahrtsfunk ausgerüstet werden", "mit einer weiteren Seefunkanlage ausgerüstet werden", "nicht geändert werden", "mit der MMSI auch eine ATIS-Kennung aussenden"],
[47, "Das Seefunkgerät nimmt bei Empfang einen Strom von 0,5 Ampere auf. Wie lange kann das Funkgerät im Empfangsbetrieb an einer Batterie ohne Nachladen überschlägig betrieben werden, wenn die Kapazität 60 Amperestunden beträgt?", "120 Stunden", "30 Stunden", "60 Stunden", "90 Stunden"],
[48, "Welche Auswirkung auf die Betriebsdauer einer Batterie hat der Sendebetrieb einer Seefunkanlage im Vergleich zum Empfangsbetrieb?", "Betriebsdauer wird verkürzt", "Betriebsdauer wird halbiert", "Betriebsdauer wird verlängert", "Betriebsdauer bleibt gleich"],
[49, "Wie hoch ist die mittlere Stromaufnahme einer UKW-Seefunkanlage im Empfangsbetrieb?", "Je nach Anlage zwischen 0,3 A und 1 A", "Je nach Anlage zwischen 0,1 A und 0,2 A", "Je nach Anlage zwischen 1 A und 2 A", "Je nach Anlage zwischen 2 A und 3 A"],
[50, "Wie hoch ist die mittlere Stromaufnahme einer UKW-Seefunkanlage im Sendebetrieb bei 25 Watt Sendeleistung?", "Zwischen 4 und 8 Ampere", "Zwischen 1 und 2 Ampere", "Zwischen 2 und 3 Ampere", "Zwischen 10 und 12 Ampere"],
[51, "Wozu dient am UKW-Gerät die Rauschsperre (Squelch)?", "Der Lautsprecher des Empfängers wird nur ab einem Mindest-Empfangssignalpegel aktiviert", "Das Rauschen kann stufenlos auf einen angenehmen Wert eingestellt werden", "Die Rauschsperre verbessert die Wiedergabe von schwachen Empfangssignalen", "Der Lautsprecher des Empfängers wird nur beim Empfang von Notsignalen aktiviert"],
[52, "Welche Eigenschaften des „GPS“ sind für eine GMDSS-Funkanlage von besonderer Bedeutung?", "Mit Hilfe von GPS kann die genaue Position des Fahrzeugs bestimmt und übermittelt werden. Ebenso kann die genaue Zeit bestimmt werden", "Mit Hilfe von GPS ist ein weltweiter Funkverkehr über Satellit zwischen Schiffen untereinander bzw. mit Küstenfunkstellen möglich", "Mit Hilfe von GPS besteht die Möglichkeit der Kommunikation über Inmarsat bzw. COSPAS-SARSAT", "Mit Hilfe von GPS erfolgt die Kommunikation mit der Rettungsleitstelle über Satellit"],
[53, "Was bedeutet „DSC“ im mobilen Seefunkdienst?", "Digitaler Selektivruf", "Funküberwachung auf zwei Funkkanälen (Dual Watch)", "Gegensprechen auf zwei Frequenzen im Gegensatz zu Wechselsprechen auf einer Frequenz", "Digitales System für die Telekommunikation an Bord"],
[54, "Was ist ein „Digitaler Selektivruf“?", "Digitale Aussendung, die bei der gerufenen Funkstelle ein optisches und/oder akustisches Signal auslöst", "Aussendung eines digitalen Anrufs auf Kanal 16", "Funkaussendung an eine ausgewählte Funkstelle", "Funkverkehr im GMDSS auf den dafür vorgesehenen Kanälen"],
[55, "Welches technische Verfahren im GMDSS ermöglicht einer Seefunkstelle die Verkehrsaufnahme in den Richtungen Schiff-Küstenfunkstelle und Schiff–Schiff?", "DSC", "NAVTEX", "COSPAS-SARSAT", "SMS"],
[56, "Welcher Unterschied besteht in der Reichweite bei analoger (Sprechfunk) und bei digitaler Übertragung (DSC) im UKW-Seefunkbereich?", "Bei digitaler Übertragung deutlich größere Reichweite im Vergleich zur analogen Übertragung", "Bei digitaler Übertragung besteht kein Unterschied im Vergleich zur analogen Übertragung", "Bei digitaler Übertragung vierfache Reichweite im Vergleich zur analogen Übertragung", "Bei digitaler Übertragung kürzere Reichweite im Vergleich zur analogen Übertragung"],
[57, "Welcher UKW-Kanal wird im Weltweiten Seenot- und Sicherheitsfunksystem (GMDSS) für die digitale Ankündigung einer Dringlichkeitsmeldung benutzt?", "Kanal 70", "Kanal 16", "Kanal 10", "Kanal 06"],
[58, "Auf welchem UKW-Kanal erfolgt die Alarmierung mittels DSC?", "Kanal 70", "Kanal 16", "Kanal 06", "Kanal 10"],
[59, "Wie wird eine mit DSC-Einrichtungen ausgerüstete Seefunkstelle gekennzeichnet?", "Schiffsname, Rufzeichen, Rufnummer des mobilen Seefunkdienstes (MMSI)", "Rufnummer des mobilen Seefunkdienstes (MMSI), Schiffsname", "Schiffsname, Heimathafen, Rufzeichen", "Registriernummer des Schiffszertifikates, Rufzeichen"],
[60, "Der mit einem DSC-Gerät aufgenommene Notalarm wird…", "automatisch gespeichert", "manuell gespeichert", "Gespeichert, wenn im Speicher noch genügend Platz ist", "nicht gespeichert, sondern ausgedruckt."],
[61, "Was wird als „Maritime Mobile Service Identity (MMSI)“ bezeichnet?", "Rufnummer im Seefunkdienst", "Maritimes Informationssystem", "Landeskennung einer Seefunkstelle (z.B. 211)", "Aussendung, die die Sicherheit der Schifffahrt betrifft"],
[62, "Wie lauten die Maritime Identification Digits (MID) für die Bundesrepublik Deutschland?", "211 und 218", "211 und 219", "218 und 224", "218 und 226"],
[63, "Welche Urkunde enthält die eigene Seefunkstellen-Rufnummer (MMSI)?", "Zuteilungsurkunde (Ship Station Licence)", "Gerätezulassungsurkunde", "Internationaler Bootsschein", "Schiffszertifikat"],
[64, "Wie setzt sich die Seefunkstellen-Rufnummer (MMSI) zusammen?", "Neun Ziffern, wobei die ersten drei Ziffern die Seefunkkennzahl (MID) enthalten", "Drei Buchstaben und sechs Ziffern", "Sieben Ziffern, wobei die ersten beiden Ziffern Nullen sein müssen", "Neun Ziffern, wobei die erste Ziffer eine Null ist"],
[65, "Wie setzt sich die Küstenfunkstellen-Rufnummer (MMSI) zusammen?", "Neun Ziffern, die ersten beiden Ziffern Nullen, die nächsten drei Ziffern enthalten die Seefunkkennzahl (MID)", "Neun Ziffern, die ersten drei Ziffern enthalten die Seefunkkennzahl (MID)", "Geografischer Ortsname der Küstenfunkstelle, gefolgt von drei Ziffern, die die Seefunkkennzahl (MID) bilden", "Internationale Telefon-Vorwahlnummer des Landes, in dem sich die Küstenfunkstelle befindet, gefolgt von fünf besonders festgelegten Ziffern"],
[66, "Welche Art von Funkstelle des Seefunkdienstes kennzeichnet die Ziffernfolge 002111240?", "Deutsche Küstenfunkstelle", "Deutsche Seefunkstelle", "Deutsches SAR-Fahrzeug", "Deutsche EPIRB"],
[67, "Woran ist die Nationalität der Seefunkstelle in der MMSI erkennbar?", "Seefunkkennzahl (MID)", "Länderkennung, bestehend aus drei Buchstaben", "Letzte drei Ziffern der MMSI", "Mittlere drei Ziffern der MMSI"],
[68, "Durch die Verbindung mit welchem Gerät ist gewährleistet, dass bei einem DSC-Notalarm die aktuelle Position automatisch mit ausgesendet wird?", "GPS-Empfänger", "NAVTEX-Empfänger", "Radargerät", "UKW-Wachempfänger"],
[69, "Wie wird der Frequenzbereich von 30 bis 300 MHz bezeichnet?", "Ultrakurzwelle (UKW/VHF)", "Langwelle (LW/LF)", "Mittelwelle (MW/MF)", "Kurzwelle (KW/HF)"],
[70, "Welches Funkzeugnis muss der Führer eines Sportfahrzeugs oder Traditionsschiffes, das mit einer UKW-Seefunkstelle ausgerüstet ist, mindestens besitzen, um am GMDSS teilnehmen zu dürfen?", "Beschränkt Gültiges Funkbetriebszeugnis (Short Range Certificate)", "Allgemeines Sprechfunkzeugnis für den Seefunkdienst", "UKW-Sprechfunkzeugnis für den Binnenschifffahrtsfunk", "Allgemeines Betriebszeugnis für Funker (General Operator’s Certificate)"],
[71, "An welchem Funkdienst darf der Inhaber eines Beschränkt Gültigen Funkbetriebszeugnisses (SRC) teilnehmen?", "Mobiler Seefunkdienst auf Ultrakurzwelle (UKW/VHF)", "Mobiler Seefunkdienst auf Ultrakurzwelle (UKW/VHF) einschließlich Satellitenfunk", "Mobiler Seefunkdienst auf Kurzwelle (KW/HF) und Grenzwelle (GW/MF), außer Satellitenfunk", "Mobiler Seefunkdienst auf Ultrakurzwelle (UKW/VHF) einschließlich Grenzwelle/Kurzwelle"],
[72, "Was kennzeichnet die Betriebsart „Duplex“?", "Gegensprechen auf zwei Frequenzen", "Wechselsprechen auf einer Frequenz", "Gegensprechen auf einer Frequenz", "Wechselsprechen auf zwei Frequenzen"],
[73, "Was kennzeichnet die Betriebsart „Simplex“?", "Wechselsprechen auf einer Frequenz", "Gegensprechen auf einer Frequenz", "Wechselsprechen auf zwei Frequenzen", "Gegensprechen auf zwei Frequenzen"],
[74, "Welche Betriebsart wird als „Semi-Duplex“ bezeichnet?", "Wechselsprechen auf zwei Frequenzen", "Gegensprechen auf zwei Frequenzen", "Gegensprechen auf einer Frequenz", "Wechselsprechen auf einer Frequenz"],
[75, "Welche UKW-Kanäle sind international ausschließlich für den Funkverkehr zwischen Seefunkstellen vorgesehen?", "Kanäle 06, 08, 72 und 77", "Kanäle 15 und 17", "Kanäle 16, 69, 70 und 82", "Kanäle 16 und 18, ersatzweise 70"],
[76, "Für welchen Funkverkehr dürfen die UKW-Kanäle 75 und 76 benutzt werden?", "Funkverkehr, der ausschließlich die Navigation betrifft", "Funkverkehr, der ausschließlich See-Land-Verbindungen betrifft", "Funkverkehr unter Behördenfahrzeugen", "Funkverkehr, der ausschließlich Land-See-Verbindungen betrifft"],
[77, "Atmosphärische Störungen des Funkverkehrs sind …", "im Seefunkverkehr im VHF-Bereich kein Problem", "im Seefunkverkehr im VHF-Bereich ein großes Problem", "gleichzeitig im VHF-Bereich und beim NAVTEX-Empfang vorhanden", "im VHF-Bereich nur bei Verwendung von nicht vertikal angebrachten Antennen vorhanden"],
[78, "Wie breiten sich Ultrakurzwellen (UKW/VHF) aus?", "Geradlinig und quasioptisch", "Abhängig von der Tageszeit", "Der Erdkrümmung folgend bis weit hinter den Horizont", "In der Ionosphäre reflektiert"],
[79, "Wie werden die internationalen Kanäle im UKW-Seefunkbereich bezeichnet?", "Kanal 1 bis 28 und 60 bis 88", "Kanal 1 bis 20 und 68 bis 88", "Kanal 1 bis 28 und 60 bis 87", "Kanal 1 bis 28 und 68 bis 88"],
[80, "Wovon hängt die Reichweite einer UKW-Funkanlage hauptsächlich ab?", "Antennenhöhe", "Bordnetzspannung", "Tageszeit", "Wetter"],
[81, "Wie sollen UKW-Antennen ausgerichtet werden?", "Vertikal", "Horizontal", "Radial", "Diagonal"],
[82, "Wodurch kann die Abstrahlung der Sendeenergie einer UKW-Anlage auf einem Schiff wesentlich beeinträchtigt werden?", "Metallische Gegenstände in der Nähe der Antenne", "Schräglage des Schiffs", "Metallische Gegenstände in der Nähe des Antennenkabels", "Wetter"],
[83, "Was hat keinen Einfluss auf die Reichweite eines UKW-Handsprechfunkgerätes?", "Schlechtes Wetter", "Niedrige Antennenhöhe", "Geringer Ladezustand des Akkus", "Geringe Sendeleistung"],
[84, "Ist das Senden auf UKW in ausländischen Häfen gestattet?", "Abhängig von entsprechenden Vorschriften des Landes", "Es ist immer gestattet", "Nur am Tage, in der Nacht herrscht Funkstille", "Außer in Notfällen ist es überall verboten"],
[85, "Wie ist die Rangfolge der Aussendungen im Seefunkdienst festgelegt?", "Not, Dringlichkeit, Sicherheit, Routine", "Not, Sicherheit, Dringlichkeit, Routine", "Routine, Sicherheit, Dringlichkeit, Not", "Routine, Dringlichkeit, Sicherheit, Not"],
[86, "Welche Vorkommnisse im Seefunkdienst sollen im Schiffstagebuch dokumentiert werden?", "Der Not-, Dringlichkeits- und Sicherheitsverkehr sowie wichtige Vorkommnisse, die den Seefunkdienst betreffen", "Der Not-, Dringlichkeits- und Sicherheitsverkehr sowie der Routineverkehr zwischen Seefunkstellen und Küstenfunkstellen", "Der gesamte DSC-Verkehr sowie wichtige Vorkommnisse, die den Seefunkdienst betreffen", "Der GMDSS-Verkehr zwischen Seefunkstellen sowie Fehlalarme und andere wichtige Vorkommnisse, die den Seefunkdienst betreffen"],
[87, "Welchem Funkverkehr ist der Nachrichtenaustausch zwischen Küstenfunkstellen des Revier- und Hafenfunkdienstes und Seefunkstellen zuzuordnen?", "Nichtöffentlicher Funkverkehr", "On Board Traffic", "Port Radio", "Öffentlicher Funkverkehr"],
[88, "Wozu dient der Revier- und Hafenfunkdienst?", "Übermittlung von Nachrichten, die ausschließlich das Führen, die Fahrt und die Sicherheit von Schiffen auf dem Revier, innerhalb oder in der Nähe von Häfen betreffen", "Zuweisung von Liegeplätzen innerhalb oder in der Nähe von Häfen", "Verbreitung von Wetterberichten auf dem Revier, innerhalb oder in der Nähe von Häfen", "Nachrichtenaustausch innerhalb oder in der Nähe von Häfen über das öffentliche Netz"],
[89, "Welcher Funkdienst gehört neben dem Revier- und Hafenfunkdienst ebenfalls zum Sicherheitsfunkdienst innerhalb des mobilen Seefunkdienstes?", "Schiffslenkungsfunkdienst", "Lotsenfunk", "Schleusenfunk", "Binnenschifffahrtsfunk"],
[90, "Wer bestimmt bei einer Verbindung zwischen See- und Küstenfunkstelle den für die weitere Verkehrsabwicklung zu benutzenden Arbeitskanal?", "Küstenfunkstelle", "Seefunkstelle", "On-Scene Co-ordinator (OSC)", "Rufende Funkstelle"],
[91, "Wie ist eine Küstenfunkstelle des Revier- und Hafenfunkdienstes gekennzeichnet?", "Geografischer Name des Ortes, dem die Art des Dienstes und das Wort Radio folgen", "Wort Radio, dem die Art des Dienstes und der geografische Name des Ortes folgen", "Geografischer Name des Ortes, dem das Wort Radio und die Art des Dienstes folgen", "Radio, dem der geografische Name des Ortes und die Art des Dienstes folgen"],
[92, "Welche Funkstelle wird mit dem Rufnamen „Warnemünde Traffic“ gerufen?", "Küstenfunkstelle des Revierfunkdienstes in Warnemünde", "Wasserschutzpolizei Warnemünde", "Seefunkstelle der DGzRS-Station Warnemünde", "Funkstelle des Hafenmeisters der Marina in Warnemünde"],
[93, "Was zeigt das Dringlichkeitszeichen an?", "Die rufende Funkstelle hat eine sehr dringende Meldung auszusenden, welche die Sicherheit einer mobilen Einheit oder einer Person betrifft", "Die rufende Funkstelle hat eine Meldung auszusenden, dass ein Schiff von einer ernsten und unmittelbaren Gefahr bedroht ist und sofortige Hilfe benötigt", "Die rufende Funkstelle hat eine eilige Meldung auszusenden, die eine nautische Warnnachricht zum Inhalt hat", "Die rufende Funkstelle hat eine wichtige Meldung auszusenden, welche den Empfang einer Seenotfunkbake (EPIRB) bestätigt"],
[94, "Wie lautet das Dringlichkeitszeichen im Sprechfunk?", "PAN PAN", "SECURITE", "MAYDAY", "URGENCY"],
[95, "Was wird im Sprechfunk durch das Zeichen PAN PAN angekündigt?", "Dringlichkeitsmeldung", "Notmeldung", "Sicherheitsmeldung", "Routinemeldung"],
[96, "Wie ist im GMDSS zu verfahren, wenn eine dringende Meldung im UKW-Bereich auszusenden ist, welche die Sicherheit einer Person betrifft?", "Ankündigung per Digitalen Selektivruf (DSC) auf Kanal 70 und Aussendung der Dringlichkeitsmeldung im Sprechfunk auf Kanal 16", "Ankündigung und Aussendung der Dringlichkeitsmeldung im Sprechfunk auf Kanal 16", "Ankündigung im Sprechfunk auf Kanal 16 und Aussendung der Dringlichkeitsmeldung auf einem Schiff-Schiff-Kanal", "Ankündigung per Digitalem Selektivruf (DSC) auf Kanal 70 und Aussendung der Dringlichkeitsmeldung auf einem Schiff-Schiff-Kanal"],
[97, "Was bedeutet im DSC-Controller die Anzeige „URGENCY“?", "Die nachfolgende Meldung ist dringend und betrifft die Sicherheit einer mobilen Einheit oder einer Person", "Die nachfolgende Meldung ist eine Notmeldung und die Seefunkstelle erbittet sofortige Hilfe", "Die nachfolgende Meldung ist dringend und die Seefunkstelle erbittet nautische Beratung", "Die nachfolgende Meldung ist eine Wetterwarnung und betrifft die Sicherheit der Schifffahrt"],
[98, "An wen dürfen Dringlichkeitsmeldungen im Seefunkdienst grundsätzlich gerichtet werden?", "An alle Funkstellen oder an eine bestimmte Funkstelle", "An alle Funkstellen im Seegebiet A1 oder an eine bestimmte Funkstelle im Seegebiet A1", "An alle Küstenfunkstellen oder an alle Funkstellen im Seegebiet A1", "An alle Küstenfunkstellen oder die Seenotleitung (MRCC)"],
[99, "Wie ist zu verfahren, wenn eine an alle Funkstellen ausgesendete Dringlichkeitsmeldung erledigt ist?", "Dringlichkeitsmeldung muss durch eine Meldung an alle Funkstellen aufgehoben werden", "Dringlichkeitsmeldung muss bei dem Fall „Mensch über Bord“ durch eine Meldung an alle Funkstellen aufgehoben werden", "Dringlichkeitsmeldung muss durch eine Meldung an die nächste Küstenfunkstelle aufgehoben werden", "Dringlichkeitsmeldung muss durch die Meldung SILENCE FINI aufgehoben werden"],
[100, "Wie lautet das Sicherheitszeichen im Seefunkdienst?", "SECURITE", "URGENCY", "PAN PAN", "MAYDAY"],
[101, "Welche Meldung wird mit SECURITE eingeleitet?", "Sicherheitsmeldung", "Notmeldung", "Dringlichkeitsmeldung", "Routinemeldung"],
[102, "Welchen Inhalt kann eine Sicherheitsmeldung haben?", "Wichtige nautische Warnnachricht oder eine wichtige Wetterwarnung", "Wichtige nautische Warnnachricht oder die Weiterleitung eines Notalarms", "Aufhebung eines Fehlalarms oder eine wichtige Wetterwarnung", "Aufhebung einer Dringlichkeitsmeldung oder ein Medico-Gespräch"],
[103, "Welche UKW-Kanäle benutzen Sportfahrzeuge für den Funkverkehr untereinander vorzugsweise in den deutschen Hoheitsgewässern?", "Kanäle 69 oder 72", "Kanäle 69 oder 70", "Kanäle 10 oder 13", "Kanäle 06 oder 16"],
[104, "Für welche Verkehrsabwicklungen werden UKW-Handsprechfunkgeräte vorzugsweise verwendet?", "Funkverkehr an Bord, Funkverkehr Schiff–Überlebensfahrzeug", "Funkverkehr Schiff–Schiff, Funkverkehr Schiff–SAR-Hubschrauber", "Funkverkehr an Bord, Funkverkehr Schiff–Hafen", "Funkverkehr mit Küstenfunkstellen, Funkverkehr Schiff–Überlebensfahrzeug"],
[105, "Was ist bei Testsendungen im Sprech-Seefunkdienst zu beachten?", "Die Aussendungen dürfen 10 Sekunden nicht überschreiten, müssen mit dem Wort „Test“ und mit einer Kennung des Schiffes ausgestrahlt werden", "Die Aussendungen dürfen 20 Sekunden nicht überschreiten und müssen mit einer Kennung des Schiffes ausgestrahlt werden", "Die Aussendungen dürfen nur einmal nach Einbau des Gerätes ohne Antenne erfolgen und müssen mit dem Wort „Test“ gekennzeichnet werden", "Die Aussendungen dürfen nur außerhalb der Hoheitsgewässer erfolgen"],
[106, "Betriebsart wird für den Schiff-Schiff-Verkehr auf UKW im Sprechfunkverfahren verwendet?", "Wechselsprechen auf einer Frequenz", "Gegensprechen auf einer Frequenz", "Wechselsprechen auf zwei Frequenzen", "Gegensprechen auf zwei Frequenzen"],
[107, "Der UKW-Kanal 70 dient ausschließlich dem Zweck der Aussendung ...", "des Digitalen Selektivrufs", "von Peilzeichen", "von Positionsmeldungen", "von Küstenfunkstellen"],
[108, "Welchen Zwecken dient der UKW-Kanal 16 (156,8 MHz) im Seefunkdienst?", "Notverkehr, Dringlichkeitsmeldung, Ankündigung einer Sicherheitsmeldung, Anrufkanal", "Notverkehr, Ankündigung einer Sicherheitsmeldung, Routineverkehr, Anrufkanal", "Aussendung des digitalen Selektivrufs", "Funkverkehr zwischen Fischereifahrzeugen"],
[109, "Auf welchem UKW-Kanal muss ein Sportfahrzeug empfangsbereit sein, wenn es sich auf See befindet und mit einer GMDSS-Seefunkanlage ausgerüstet ist?", "Kanal 70", "Kanal 16", "Kanal 69", "Kanal 72"],
[110, "Auf welchem UKW-Kanal sollte ein Sportfahrzeug in der Regel empfangsbereit sein, wenn es sich auf See befindet und nur mit einer UKW-Sprechfunkanlage ausgerüstet ist?", "Kanal 16", "Kanal 70", "Kanal 69", "Kanal 06"],
[111, "Welcher UKW-Kanal ist vorzugsweise für den Schiff-Schiff-Verkehr und für koordinierte Such- und Rettungseinsätze (SAR) vorgesehen?", "Kanal 06", "Kanal 10", "Kanal 16", "Kanal 72"],
[112, "Welchen Zwecken dienen der Anrufkanal und ein Arbeitskanal?", "Anrufkanal zur Verbindungsaufnahme, Arbeitskanal zur Abwicklung des Weiteren Funkverkehrs", "Anrufkanal zur Verbindungsaufnahme, Arbeitskanal nur zur Abwicklung von Notfällen", "Anrufkanal zur Verbindungsaufnahme, Arbeitskanal zur Abwicklung von Reiseplanungen", "Anrufkanal zur Verbindungsaufnahme mit Teilnehmern an Land, Arbeitskanal zur Zuweisung des Schleusenranges"],
[113, "Auf welchem Kanal ist eine Küstenfunkstelle zu rufen, die sowohl auf dem Kanal 70 als auch auf Kanal 16 sowie auf einem veröffentlichten Arbeitskanal empfangsbereit ist?", "Kanal 70 oder Arbeitskanal", "Kanal 16 oder Kanal 70", "Kanal 70 oder Kanal 72", "Kanal 16 oder Arbeitskanal"],
[114, "Auf welchem Kanal wird eine Küstenfunkstelle ohne DSC im Routineverkehr gerufen?", "Arbeitskanal", "Kanal 16", "Ankündigung auf Kanal 16, dann Wechsel zum Arbeitskanal", "Kanal 70"],
[115, "Was ist vor dem Anruf auf einem Arbeitskanal zu beachten?", "Der laufende Funkverkehr darf nicht gestört werden", "Die geringste Sendeleistung muss eingestellt werden", "Die Küstenfunkstelle muss den Arbeitskanal freigeben", "Der laufende Funkverkehr muss aufgefordert werden, den Funkverkehr zu beenden"],
[116, "Was bedeutet „NAVTEX“?", "Nautische Warnnachrichten im Funktelexverfahren", "Navigationssystem, das Vorgaben im Funktelexverfahren erhält", "MW-Empfänger an Bord eines Seeschiffes zur Aufzeichnung von Wetterberichten", "Satellitengestütztes Navigationssystem für den Seenotfall"],
[117, "Wie heißt der Dienst, in dem Nachrichten für die Sicherheit der Seeschifffahrt (MSI) über terrestrische Frequenzen verbreitet werden?", "NAVTEX", "SafetyNET", "AIS", "AMVER"],
[118, "Welchen Dienst bieten der Deutsche Wetterdienst (DWD) und das Bundesamt für Seeschifffahrt und Hydrographie (BSH) auf den Frequenzen 518 kHz und 490 kHz gemeinsam an?", "NAVTEX", "SafetyNET", "TELEX", "AMVER"],
[119, "Bis zu welcher Entfernung vom Standort des Senders können Sicherheitsmeldungen für die Seeschifffahrt im NAVTEX-Dienst empfangen werden?", "Ca. 600 sm", "Ca. 30 sm", "Ca. 1000 sm", "Ca. 1500 sm"],
[120, "Worauf muss beim Einstellen eines NAVTEX-Empfängers geachtet werden?", "Einstellen der jeweiligen NAVTEX-Sender und Auswählen der Art der benötigten Meldungen", "Auswählen der gewünschten NAVTEX-Sender und Eingeben der MMSI-Rufnummer", "Eingeben der eigenen Position und Auswählen der Art der benötigten Meldungen", "Auswählen der Sprache, in der die Nachricht empfangen werden soll, und Unterdrücken nicht benötigter Meldungen"],
[121, "Welche Informationen können bei der Programmierung eines NAVTEX-Empfängers nicht unterdrückt werden?", "Navigationswarnungen, Meteorologische Warnungen und SAR-Meldungen", "Navigationswarnungen, Wettervorhersagen und SAR-Meldungen", "Sat-Nav-Warnungen, Meteorologische Warnungen und Navigationswarnungen", "Meteorologische Warnungen, Revierinformationen und SAR-Meldungen"],
[122, "In welcher Sprache werden Nachrichten für die Sicherheit der Seeschifffahrt (MSI) im NAVTEX-Dienst auf 490 kHz verbreitet?", "Landessprache der Funkstelle", "Englisch", "Niederländisch", "Französisch"],
[123, "In welchen Zeitabständen werden die regelmäßigen NAVTEX-Informationen vom deutschen NAVTEX-Sender ausgesendet?", "4 Stunden", "1 Stunde", "12 Stunden", "24 Stunden"],
[124, "Was bezeichnet „NAVAREA“?", "International festgelegtes Vorhersage- und Seewarngebiet", "Internationales Seegebiet, das nicht befahren werden darf", "Internationales Seegebiet, das in vier Gruppen eingeteilt ist (A1 bis A4)", "Internationales Seegebiet, das von Seeschiffen befahren werden darf"],
[125, "Was bezeichnet „SAR“?", "Suche und Rettung", "Seenotfunkbake", "Sanitätsdienst", "Radartransponder"],
[126, "Welche Aufgabe hat ein „RCC“ im Seenotfall?", "Koordinierung der im Seenotfall zur Verfügung stehenden Kräfte und Abwicklung des Notverkehrs", "Stationierung von Seenotrettungskreuzern rund um die Uhr", "Alarmierung von SAR-Fahrzeugen im Seenotfall über Satellit", "Erteilung von Ratschlägen an den Havaristen"],
[127, "Welche Aufgabe hat ein „MRCC“ im Seenotfall?", "Koordinierung der im Seenotfall zur Verfügung stehenden Kräfte", "Bereithaltung von Rettungsfahrzeugen im Seenotfall", "Erarbeitung von Richtlinien für das Verhalten im Seenotfall", "Erteilung von Ratschlägen an den Havaristen"],
[128, "Was ist „On-Scene Communication“?", "Funkverkehr vor Ort im Seenotfall", "Funkverkehr in Reichweite einer Küstenfunkstelle für UKW", "Funkverkehr im Hafenfunk (Port Radio)", "Funkverkehr von Behördenfahrzeugen"],
[129, "Welche Aufgabe hat der „On-Scene Coordinator“ (OSC) im SAR-Fall?", "Leitung der Such- und Rettungsmaßnahmen vor Ort", "Kooperation mit der nächstgelegenen Küstenfunkstelle des Revierfunkdienstes", "Festlegung der DSC-Kanäle zur Verständigung der SAR-Einheiten", "Verbreitung wichtiger SAR-Meldungen rund um die Uhr"],
[130, "Was bedeutet „Funkverkehr vor Ort“?", "Funkverkehr zwischen dem Schiff in Not und den Fahrzeugen, die Hilfe leisten sowie dem Schiff in Not und dem Fahrzeug, das die Suche und Rettung koordiniert", "Funkverkehr zwischen dem Fahrzeug, das die Suche und Rettung koordiniert, und der Küstenfunkstelle", "Funkverkehr zwischen der Küstenfunkstelle und dem On-Scene Coordinator", "Funkverkehr zwischen dem Schiff in Not und in der Nähe befindlichen Luftfunkstellen"],
[131, "Wer darf das Aussenden einer Notmeldung im Seefunkdienst veranlassen?", "Fahrzeugführer", "Crewmitglied", "Rudergänger", "Rettungsleitstelle"],
[132, "Auf welchem UKW-Kanal müssen alle mit DSC ausgerüsteten seegehenden Schiffe im Weltweiten Seenot- und Sicherheitsfunksystem (GMDSS) empfangsbereit sein?", "Kanal 70", "Kanal 16", "Kanal 06", "Kanal 10"],
[133, "Wie lautet das Notzeichen im Sprechfunk?", "MAYDAY", "PAN PAN", "DISTRESS", "SOS"],
[134, "Womit wird der Notverkehr im Sprechfunk eingeleitet?", "MAYDAY", "Schiffsname", "DISTRESS", "SOS"],
[135, "Wann liegt ein Seenotfall vor, der das Aussenden des Notzeichens im Sprechfunk rechtfertigt?", "Wenn ein Schiff oder eine Person von einer ernsten und unmittelbaren Gefahr bedroht ist und sofortige Hilfe benötigt", "Wenn ein Schiff manövrierbehindert ist und Hilfe benötigt", "Wenn eine nautische Warnnachricht vorliegt, die unbedingt beachtet werden muss", "Wenn ein medizinischer Notfall vorliegt, der unmittelbare funkärztliche Beratung erfordert"],
[136, "Welche Priorität der Alarmierung ist zu wählen, wenn sich eine Person in Lebensgefahr befindet und Hilfe benötigt?", "Notfall", "Dringlichkeit", "Sicherheit", "Routine"],
[137, "Welche Frequenzen dürfen neben den Notfrequenzen für die Aussendung einer Notmeldung im Seefunkdienst benutzt werden?", "Jede andere verfügbare und geeignete Frequenz", "UKW Kanal 06 (internationaler Verkehr)", "Keine andere Frequenz", "Nur Schiff-Schiff-Frequenzen"],
[138, "Auf welchem UKW-Kanal findet der Notverkehr vorzugsweise statt?", "Kanal 16", "Kanal 70", "Kanal 69", "Kanal 06"],
[139, "Welche Meldungen dürfen im Weltweiten Seenot- und Sicherheitsfunksystem (GMDSS) auf UKW-Kanal 16 (156,8 MHz) übermittelt werden?", "Notmeldungen, Dringlichkeitsmeldungen und die Ankündigung von Sicherheitsmeldungen", "Dringlichkeitsmeldungen und Meldungen im öffentlichen Funkverkehr", "Sicherheits-, Dringlichkeitsmeldungen und Nichtöffentlicher Funkverkehr", "Notmeldungen und Routinemeldungen"],
[140, "Wann und warum wird die Einleitung eines Notverkehrs wiederholt?", "Wenn die aussendende Seefunkstelle keine Antwort auf ihren DSC-Alarm oder ihre Notmeldung erhalten hat oder wenn sie es aus anderen Gründen für notwendig hält", "Wenn der DSC-Notalarm nur von einer Küstenfunkstelle bestätigt worden ist", "Die Einleitung des Notverkehrs darf nicht wiederholt werden, um Fehlalarme zu vermeiden", "Die Einleitung des Notverkehrs wird nach 6 Minuten wiederholt, wenn keine Bestätigung erfolgt ist"],
[141, "An wen soll eine Seefunkstelle den Notalarm für ein anderes in Not befindliches Schiff richten?", "Grundsätzlich an die nächstgelegene Küstenfunkstelle oder sonst an alle Funkstellen", "Grundsätzlich an alle Seefunkstellen in der Nähe", "Grundsätzlich an das Maritime Lagezentrum beim Havariekommando", "Grundsätzlich an ein Local User Terminal oder sonst an alle Seefunkstellen"],
[142, "Welche Voraussetzung muss eine Seefunkstelle erfüllen, die den Empfang eines DSC-Notalarms auf UKW im Sprechfunkverfahren bestätigt?", "Sie muss Hilfe leisten können", "Eine sichere Funkverbindung muss möglich sein", "Sie muss die Seefunkstelle in Not spätestens nach einer Stunde erreichen können", "Notalarme werden in jedem Fall bestätigt"],
[143, "Wann darf eine Seefunkstelle, wenn sie Hilfe leisten kann, den Empfang eines DSC-Notalarms auf UKW im Sprechfunkverfahren bestätigen?", "Nach Bestätigung durch eine Küstenfunkstelle oder einer angemessenen Wartefrist", "Sofort nach Empfang des DSC-Notalarms", "Nach einer Wartefrist von 3 Minuten", "DSC-Notalarme dürfen grundsätzlich nur von Küstenfunkstellen bestätigt werden"],
[144, "Auf welchem UKW-Kanal und in welchem Verfahren bestätigt eine Seefunkstelle den auf Kanal 70 empfangenen Notalarm?", "Kanal 16, Sprechfunkverfahren", "Kanal 70, DSC", "Arbeitskanal, Sprechfunkverfahren", "Kanal 16, DSC"],
[145, "Wann wird im Seefunkdienst die Aufforderung SILENCE MAYDAY ausgesendet?", "Wenn die Funkstelle, die den Notverkehr leitet, störende Funkstellen zur Einhaltung der Funkstille auffordert", "Wenn die Situation des Schiffes in Not besonders kritisch ist", "Wenn die Funkstelle, die den Notverkehr leitet, die Beendigung des Notverkehrs ankündigen will", "Wenn eine Funkstelle sich besondere Aufmerksamkeit für die Verbreitung einer Dringlichkeits- oder Sicherheitsmeldung erbittet"],
[146, "Wer fordert in einem Seenotfall eine störende Funkstelle mit den Wörtern SILENCE MAYDAY zur Einhaltung der Funkstille auf?", "Die Funkstelle, die den Notverkehr leitet", "Die Funkstelle in Not oder eine Hilfe leistende Luftfunkstelle", "Die Funkstelle, die die störende Funkstelle als erste empfangen hat", "Die Funkstelle, die der störenden Funkstelle nächstgelegen ist"],
[147, "Welche Aufgaben übernimmt die Seenotleitung (Maritime Rescue Co-ordination Centre [MRCC]) nach Eingang eines Notalarms?", "Koordinierung und Information über die SAR-Maßnahmen", "Leitung des Notverkehrs auf Kanal 70", "Bestimmung des On-Scene Co-ordinators (OSC)", "Überwachung Kanäle 16 und 70 sowie Dokumentation der SAR-Maßnahmen"],
[148, "Auf welchen UKW-Kanälen ist Bremen Rescue Radio empfangsbereit?", "Kanal 16 (Sprechfunk), Kanal 70 (DSC)", "Kanal 10 (Sprechfunk), Kanal 70 (DSC)", "Kanal 16 (Sprechfunk), Kanal 10 (DSC)", "Kanal 06 (Sprechfunk), Kanal 70 (DSC)"],
[149, "Nach welchem Betriebsverfahren wird der Funkverkehr in Notfällen zwischen Seefunkstellen und SAR-Hubschraubern abgewickelt?", "Betriebsverfahren des mobilen Seefunkdienstes", "Betriebsverfahren des mobilen Flugfunkdienstes", "Betriebsverfahren des Navigationsfunkdienstes", "Betriebsverfahren des Revierfunkdienstes"],
[150, "Welche Veröffentlichung enthält Angaben zu Verfahren, Abkürzungen und international entwickelte Redewendungen für Notfälle?", "Handbuch „Suche und Rettung“", "Handbuch „Funkdienst für die Klein- und Sportschifffahrt“", "Nachrichten für Seefahrer", "Mitteilungen für Seefunkstellen und Schiffsfunkstellen"],
[151, "In welchem Frequenzbereich kann mit SAR-Einheiten Seefunkverkehr abgewickelt werden?", "UKW-Bereich", "UHF-Bereich", "MW-Bereich", "VLF-Bereich"],
[152, "Im Funkverkehr zwischen Seefunkstellen und SAR-Hubschraubern gilt das Betriebsverfahren...", "des Seefunkdienstes", "des Flugfunkdienstes", "der Rettungsdienste", "des Binnenschifffahrtsfunks"],
[153, "Auf welchen UKW-Kanälen dürfen zu Sicherheitszwecken Seefunkstellen mit SAR-Hubschraubern Funkverkehr vorzugsweise abwickeln?", "Kanal 16, Kanal 06", "Kanal 16, Kanal 10", "Kanal 06, Kanal 10", "Kanal 70, Kanal 16"],
[154, "Wodurch werden in der Regel bei einer Rettungsaktion mit SAR Hubschraubern die Kanäle 16 und 06 überwacht?", "Zweikanal-Überwachung (Dual Watch)", "Zwei unabhängige Seefunkgeräte", "Regelmäßiges manuelles Umschalten", "Bedarfsweises manuelles Umschalten"],
[155, "Welchen UKW-Kanal soll ein Schiff in Not bis zur Ankunft eines SAR-Hubschraubers abhören?", "Kanal 16", "Kanal 06", "Kanal 10", "Kanal 70"],
[156, "Wie ist zu verfahren, wenn während eines Notverkehrs auf Kanal 16 die Ankündigung einer Dringlichkeits- oder Sicherheitsmeldung „An alle Funkstellen“ vorgenommen werden soll?", "Ankündigung mittels Digitalen Selektivrufs (DSC) auf Kanal 70, Ankündigung während einer Pause im Notverkehr auf Kanal 16, Aussendung der Meldung auf einem Schiff-Schiff-Kanal", "Ankündigung auf Kanal 06, Information an die Küstenfunkstelle/RCC über den Inhalt der Meldung auf einem Arbeitskanal", "Ankündigung mittels Digitalen Selektivrufs (DSC) auf Kanal 70, Information „An alle Funkstellen“ über den Inhalt der Meldung auf Kanal 16", "Ankündigung auf Kanal 16 während einer Pause im Notverkehr, Aussendung auf einem Schiff-Schiff-Kanal"],
[157, "Was ist zu tun, wenn irrtümlich von einer Seefunkstelle ein Notalarm auf Kanal 70 ausgelöst worden ist?", "a. Gerät umgehend zurücksetzen b. Wenn möglich, den Fehlalarm per DSC zurücknehmen c. Mit Meldung auf Kanal 16 „An alle Funkstellen“ den Fehlalarm zurücknehmen", "a. Gerät ausschalten, um weitere Sendungen zu verhindern b. Eintragung der irrtümlichen Aussendung im Schiffstagebuch c. Zuständiges MRCC telefonisch informieren", "a. Ankündigung der Rücknahme des Notalarms mit DSC b. Mit Meldung auf Kanal 16 „An alle Funkstellen“ den Fehlalarm zurücknehmen c. Schiffsführer informieren", "a. Gerät umgehend zurücksetzen b. Ankündigung der Rücknahme des Notalarms mit DSC c. Mit Meldung auf Kanal 13 „An alle Funkstellen“ den Fehlalarm zurücknehmen"],
[158, "Womit können im Notfall nach dem Verlassen des havarierten Schiffes keine Such- und Rettungsarbeiten ausgelöst bzw. erleichtert werden?", "UKW-Empfänger", "Transponder für Suche und Rettung (SART)", "Seenotfunkbake (EPIRB)", "Handsprechfunkgeräte"],
[159, "Welche Komponenten des Weltweiten Seenot- und Sicherheitsfunksystems (GMDSS) werden für die Aussendung von Signalen zur Ortsbestimmung eingesetzt?", "SART, EPIRB", "NAVTEX, EGC", "DSC, EPIRB", "NAVTEX, SART"],
[160, "Wo soll eine Satelliten-Seenotfunkbake (EPIRB) an Bord eines Sportbootes installiert werden?", "Im äußeren Decksbereich", "In der Backskiste", "In mindestens 1 m Entfernung von Metallteilen", "Geschützt unter Deck"],
[161, "Wann darf eine Satelliten-Seenotfunkbake (EPIRB) für eine Aussendung aktiviert werden?", "Nur im Notfall", "Zu Testzwecken", "Im Notfall und zu Testzwecken", "Beim Herannahen von Rettungsfahrzeugen"],
[162, "Wie kann eine Satelliten-Seenotfunkbake (EPIRB) im Notfall aktiviert werden?", "Manuell oder automatisch", "Nur manuell", "Nur automatisch", "Durch das COSPAS-SARSAT-System"],
[163, "Wodurch wird eine EPIRB im Seenotfall automatisch aktiviert?", "Wasserdruckauslöser", "Rüttelkontakt", "GPS-Signale", "Radar-Signale"],
[164, "Welche Informationen enthält die Aussendung einer Satelliten-Seenotfunkbake (EPIRB)?", "a. Notsignal b. Identifikationsmerkmal c. Position mittels GPS, wenn vorhanden", "a. Notsignal b. Schiffstyp c. Art des Notfalls", "a. Position mittels GPS, wenn vorhanden b. Identifikationsmerkmal c. Zielhafen", "a. Art des Notfalls b. Position mittels GPS, wenn vorhanden c. Rufzeichen"],
[165, "Wie lange dauert es in den Seegebieten A1 bis A3, bis der Alarm einer COSPAS-SARSAT-Satelliten-Seenotfunkbake (EPIRB) bei der zuständigen Seenotleitung (MRCC) aufläuft?", "Wenige Minuten", "Bis zu 30 Minuten", "Bis zu 2 Stunden", "Bis zu 4 Stunden"],
[166, "Wie lange kann es unter ungünstigen Bedingungen von der Aktivierung einer COSPAS-SARSAT-Satelliten-Seenotfunkbake ohne GPS bis zum Empfang der Position im MRCC dauern?", "Bis zu 4 Stunden", "Bis zu 8 Stunden", "Bis zu 12 Stunden", "Bis zu einem Tag"],
[167, "Warum dauert es unter ungünstigen Bedingungen von der Aktivierung einer COSPAS-SARSAT-Satelliten-Seenotfunkbake ohne GPS bis zum Empfang der Position im MRCC bis zu vier Stunden?", "Es müssen Überflüge der umlaufenden COSPAS-SARSAT-Satelliten (LEOSAR) abgewartet werden", "Die niedrige Datenrate im Uplink ermöglicht keine hohe Übertragungsgeschwindigkeit", "Hoher Seegang behindert die Funkwellenausbreitung zum geostationären COSPAS-SARSAT-Satelliten (GEOSAR)", "Schlechte Wetterverhältnisse behindern die Übertragung der Daten vom COSPAS-SARSAT-Satelliten zur Bodenstation (LUT)"],
[168, "Wie groß ist die maximale Abweichung der ermittelten von der tatsächlichen Position einer COSPAS-SARSAT-Seenotfunkbake (EPIRB) ohne GPS?", "2 sm", "10 sm", "100 sm", "150 sm"],
[169, "Zu welchem Zweck benutzen Satelliten-Seenotfunkbaken (EPIRB) die Frequenzen 121,5 MHz und 406 MHz?", "121,5 MHz zur Zielfahrt (Homing), 406 MHz zur Alarmierung und Positionsbestimmung", "121,5 MHz zur Zielfahrt (Homing), 406 MHz zur Kommunikation", "121,5 MHz zur Identifikation, 406 MHz zur Zielfahrt (Homing)", "121,5 MHz zur Kommunikation, 406 MHz zur Alarmierung und Positionsbestimmung"],
[170, "Welche Informationen müssen an einer Satelliten-Seenotfunkbake (EPIRB) erkennbar sein?", "a. Schiffsname/Rufzeichen/MMSI oder anderes Identifikationsmerkmal b. Seriennummer c. Haltbarkeitsdatum der Batterie d. Haltbarkeitsdatum des Wasserdruckauslösers", "a. Herstellerfirma b. Haltbarkeitsdatum des Wasserdruckauslösers c. Zulassungsdatum der EPIRB d. Kurzanleitung", "a. Herstellerfirma b. Schiffsname/Rufzeichen/MMSI oder anderes Identifikationsmerkmal c. Prüfdatum d. Sendefrequenz", "a. Kurzanleitung b. Zulassungsdatum der EPIRB c. Schiffsname/Rufzeichen/MMSI oder anderes Identifikationsmerkmal d. Haltbarkeitsdatum der Batterie"],
[171, "Was ist zu tun, bevor die Satelliten-Seenotfunkbake (EPIRB) für Wartungszwecke aus ihrer Halterung entfernt werden soll?", "Sicherstellen, dass kein Fehlalarm ausgelöst wird", "Sicherung lösen", "MRCC informieren", "Keine besonderen Vorkehrungen treffen"],
[172, "Welche Prüfungen sind an einer Satelliten-Seenotfunkbake (EPIRB) durchzuführen?", "Haltbarkeitsdatum der Batterie, Haltbarkeitsdatum des Wasserdruckauslösers, Funktion entsprechend den Herstellerangaben", "Haltbarkeitsdatum der Batterie, Haltbarkeitsdatum des Wasserdruckauslösers, Befestigung am Schiffskörper", "Funktion entsprechend den Herstellerangaben, Haltbarkeitsdatum der Batterie, Festigkeit der Sicherheitsleine", "Haltbarkeitsdatum des Wasserdruckauslösers, Lesbarkeit der Beschriftung, Kontakte der Batterien"],
[173, "Wie erscheint die Aussendung eines Transponders für Suche und Rettung (SART) auf einem Radarbildschirm?", "Als Linie von mindestens zwölf Zeichen", "Die Aussendung eines Transponders ist auf dem Radarschirm nicht sichtbar", "Als lange aus einem Zeichen bestehende Linie", "Als Linie von mindestens drei Zeichen"],
[174, "Welches Navigationsgerät empfängt das Signal eines aktivierten Transponders für Suche und Rettung (SART)?", "Radargerät", "GPS-Empfänger", "DSC-Controller", "NAVTEX-Gerät"],
[175, "Welche Vorteile hat eine UKW-Seefunkanlage gegenüber einem Mobiltelefon in einer Notsituation?", "Allgemeine und sichere Alarmierungsmöglichkeit", "Hohe und gleichbleibende Sprachqualität", "Wahrung des Fernmeldegeheimnisses und des Abhörverbots", "Digitale und sichere Sprachübertragung"],
[176, "Welchen Vorteil hat eine UKW-Seefunkanlage gegenüber einem Mobiltelefon, wenn in einer Notsituation andere Fahrzeuge in Sicht sind und um Hilfe gebeten werden sollen?", "Erreichbarkeit aller in Funkreichweite befindlichen Seefunkstellen", "Erreichbarkeit aller Seefunkstellen im Seegebiet A1", "Erreichbarkeit aller Rettungsfahrzeuge in Küstennähe", "Erreichbarkeit aller Seefunkstellen in den Seegebieten A1 und A2"],
[177, "Warum ist ein Mobiltelefon gegenüber einer UKW-Seefunkanlage keine Alternative, wenn in einer Notsituation die Such- und Rettungsmaßnahmen anderen Fahrzeugen bekannt gemacht werden müssen?", "Telefongespräche können von weiteren Fahrzeugen nicht mitgehört werden, wichtige Informationen zur Hilfeleistung und Rettung sind nicht für alle Beteiligten verfügbar", "Telefongespräche können von weiteren Fahrzeugen nicht bestätigt werden, der Seenotleitung (MRCC) fehlen daher wichtige Informationen", "Telefongespräche können von Küstenfunkstellen nicht bestätigt werden, wichtige Informationen fehlen daher für die Koordination vor Ort", "Telefongespräche können vom On-Scene-Coordinator (OSC) nicht mitgehört werden, wichtige Informationen sind nur bei der Seenotleitung (MRCC) vorhanden"],
[178, "Mit welcher Meldung werden die Funkstellen davon unterrichtet, dass der Notverkehr beendet ist?", "Meldung, die mit SILENCE FINI abschließt", "Meldung, die mit SILENCE MAYDAY abschließt", "Meldung, die mit OVER AND OUT abschließt", "Meldung, die mit MASTER abschließt"],
[179, "Welche Funktion hat ein Transponder für Suche und Rettung (Search and Rescue Transponder [SART])?", "Aussendung von Ortungsfunksignalen, die im Seenotfall das Auffinden des verunglückten Fahrzeuges mittels Radar erleichtern sollen", "Automatische Aussendung der Notposition über UKW an Küsten- bzw. Schiffsfunkstellen", "Automatische Übermittlung der Position des in Not befindlichen Fahrzeuges über die COSPAS-SARSAT-Satelliten", "Reflexion von Radarstrahlen und Erzeugung eines deutlichen Echos auf Radarbildschirmen"],
[180, "Welche Funktion hat eine Satelliten-Seenotfunkbake (Emergency Position-Indicating Radiobeacon [EPIRB])?", "Alarmierung und Kennzeichnung der Notposition", "Kommunikation im VHF-Band zwischen Überlebensfahrzeug und SAR-Fahrzeugen bzw. dem MRCC", "Aussendung einer Notmeldung auf den Notfrequenzen der Luftfahrt (121,5 MHz bzw. 243 MHz), die von den Luftfahrzeugen bestätigt wird", "Ermöglichen der Ortung mittels Radar und Erleichterung des Auffindens des Havaristen"],
];

const U: Row[] = [
[1, "Was ist Binnenschifffahrtsfunk?", "Internationaler mobiler UKW/VHF-Sprechfunkdienst auf Binnenschifffahrtsstraßen", "Nationaler mobiler UKW/VHF-Sprechfunkdienst auf Binnenschifffahrtsstraßen", "Internationales UKW/VHF-Sprechfunkverfahren im Binnenbereich", "Nationales UKW/VHF-Sprechfunkverfahren im Binnenbereich"],
[2, "Wozu dient der Binnenschifffahrtsfunk?", "Funkverkehr für bestimmte Zwecke auf vereinbarten Kanälen (Verkehrskreise) und nach einem festgelegten Betriebsverfahren", "Funkverkehr für Schiffsfunkstellen zu bestimmten Zwecken auf vereinbarten Kanälen (Verkehrskreise) und nach einem festgelegten Betriebsverfahren", "Funkverkehr zu Landfunkstellen für bestimmte Zwecke auf vereinbarten Kanälen (Verkehrskreise) und nach einem festgelegten Betriebsverfahren", "Funkverkehr für Schiffsfunkstellen über Landfunkstellen auf vereinbarten Kanälen (Verkehrskreise) und nach einem festgelegten Betriebsverfahren"],
[3, "In welchem Regelwerk findet man gemeinsame Grundsätze und Regelungen für den Binnenschifffahrtsfunk in Europa?", "Regionale Vereinbarung über den Binnenschifffahrtsfunk (RAINWAT)", "International Convention for the Safety of Life at Sea (SOLAS)", "Verwaltungsvereinbarung über die Koordinierung von Frequenzen (HCM)", "Binnenschifffahrt-Sprechfunkverordnung (BinSchSprFunkV)"],
[4, "Wie lange dürfen Testsendungen dauern?", "Maximal 10 Sekunden", "Es gilt ein striktes Verbot zur Aussendung zu Testzwecken", "Testsendungen müssen mindestens 30 Sekunden dauern", "15–30 Sekunden"],
[5, "Was ist eine „Revierzentrale“?", "Landfunkstelle des Verkehrskreises Nautische Information", "Zentrale Schiffsfunkstelle der Wasserstraßen- und Schifffahrtsverwaltung", "Zentrale Telematikdienste zur Datenübermittlung von AIS", "Seefunkstelle zur Schiffslenkung"],
[6, "Was ist ein „Verkehrsposten“?", "Zentrale ortsfeste Funkstelle in den Niederlanden", "Zentrale mobile Funkstelle in den Niederlanden", "Zentrale ortsfeste Funkstelle in den Niederlanden und in Frankreich", "Zentrale mobile Funkstelle in den Niederlanden und in Frankreich"],
[7, "Was ist ein „Blockkanal“?", "Funkkanal für sicherheitsrelevante Meldungen der Verkehrsposten und Schiffsfunkstellen in den Niederlanden", "Funkkanal für Routinegespräche der Verkehrsposten und Schiffsfunkstellen in den Niederlanden", "Gesperrter Funkkanal der Verkehrsposten und Verkehrszentralen in den Niederlanden", "Funkkanal für öffentlichen Nachrichtenaustausch zwischen den Verkehrsposten in den Niederlanden"],
[8, "Mit der Einführung des „VHF Data Exchange System (VDES)“ ergibt sich …", "ein Verbot, die analogen Funkkanäle 24 –28 und 84 – 88 weiterhin für Sprachnachrichten zu nutzen", "für die Sportbootschifffahrt keine Änderung, da das System ausschließlich für die Berufsschifffahrt gedacht ist", "die Notwendigkeit, ausschließlich neue Funkgeräte zu betreiben (Zulassung ab Januar 2025)", "die Verpflichtung zur Nutzung des DSC-Controllers"],
[9, "Wo darf der Inhaber eines „UKW-Sprechfunkzeugnis für den Binnenschifffahrtsfunk (UBI)“ am Funkverkehr teilnehmen?", "In allen Ländern, die der Regionalen Vereinbarung über den Binnenschifffahrtsfunk (RAINWAT) beigetreten sind", "In allen Mitgliedstaaten der EU", "In allen Staaten, die die Vollzugsordnung für den Funkdienst ratifiziert haben", "In allen deutschsprachigen Ländern"],
[10, "Wo berechtigt das „UKW-Sprechfunkzeugnis für den Binnenschifffahrtsfunk“ (UBI) auch zur Teilnahme am mobilen Seefunkdienst?", "Bundeswasserstraßen der Zonen 1 bis 2", "Bundeswasserstraßen der Zonen 2 bis 4", "Bundeswasserstraßen der Zonen 1 bis 4", "Bundeswasserstraßen der Zonen 2 bis 3"],
[11, "Wer stellt – neben der zuständigen Stelle des Bundes – das „UKW-Sprechfunkzeugnis für den Binnenschifffahrtsfunk“ (UBI) aus?", "Prüfungsausschüsse des Deutschen Motoryachtverbandes e. V. (DMYV) und des Deutschen Segler-Verbandes e. V. (DSV)", "Bundesnetzagentur (BNetzA) und das Bundesamt für Seeschifffahrt und Hydrographie (BSH)", "Zentrale Verwaltungsstelle (ZVST) und Generaldirektion Wasserstraßen und Schifffahrt (GDWS)", "Wasserstraßen- und Schifffahrtsamt (WSA) und Bundesnetzagentur (BNetzA)"],
[12, "Welches Funkzeugnis berechtigt nicht zur Teilnahme am weltweiten Seenot- und Sicherheitsfunksystem (GMDSS)?", "UKW-Sprechfunkzeugnis für den Binnenschifffahrtsfunk (UBI)", "Beschränkt gültiges Funkbetriebszeugnis (SRC)", "Allgemeines Funkbetriebszeugnis (LRC)", "Allgemeines Betriebszeugnis für Funker (GOC)"],
[13, "Welches Funkzeugnis berechtigt nicht zur Teilnahme am Binnenschifffahrtsfunk?", "Amateurfunkzeugnis", "UKW-Sprechfunkzeugnis für den Binnenschifffahrtsfunk (UBI)", "Allgemeines Sprechfunkzeugnis für den Seefunkdienst", "Beschränkt gültiges Betriebszeugnis für Funker I (BZ I)"],
[14, "Worauf ist bei der Teilnahme am Binnenschifffahrtsfunk in anderen Ländern zu achten?", "Die Bestimmungen im Regionalen Teil des Handbuchs Binnenschifffahrtsfunk sind zu beachten", "Die Bestimmungen der Binnenschifffahrt-Sprechfunkverordnung sind zu beachten", "Die Bestimmungen der EU-Kommission sind zu beachten", "Die Bestimmungen der Binnenschifffahrtsstraßen-Ordnung sind zu beachten"],
[15, "Wo findet man grundsätzliche Bestimmungen über den Sprechfunk auf den jeweiligen Bundeswasserstraßen?", "Schifffahrtspolizeiverordnungen", "Binnenschifffahrtspatentverordnung", "Binnenschifffahrt-Sprechfunkverordnung", "Binnenschiffsuntersuchungsordnung"],
[16, "Wo findet man z. B. Angaben über die Ausrüstungspflicht mit Funkanlagen auf Binnenschiffen?", "Schifffahrtspolizeiverordnungen", "Binnenschifffahrt-Sprechfunkverordnung", "Binnenschifferpatentverordnung", "Internationales Übereinkommen zum Schutz des menschlichen Lebens auf See (SOLAS)"],
[17, "Wo findet man Angaben über die Funkbenutzungspflicht für Fahrzeuge auf bestimmten Binnenschifffahrtsstraßen?", "Regionaler Teil des Handbuchs Binnenschifffahrtsfunk", "Allgemeiner Teil des Handbuchs Binnenschifffahrtsfunk", "Binnenschifffahrt-Sprechfunkverordnung", "Binnenschifferpatentverordnung"],
[18, "Das Abhörverbot und das Fernmeldegeheimnis sind geregelt …", "im Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG)", "in der Binnenschifffahrt-Sprechfunkverordnung (BinSchSprFunkV)", "in der Schiffssicherheitsverordnung (SchSV)", "im Gesetz über Funkanlagen und Telekommunikationsendeinrichtungen (FTEG)"],
[19, "Was unterliegt dem Fernmeldegeheimnis?", "Inhalt des Funkverkehrs und seine näheren Umstände, insbesondere die Tatsache, ob jemand an der Abwicklung des Funkverkehrs beteiligt ist oder war", "Inhalt des Funkverkehrs und seine näheren Umstände, insbesondere konkrete Daten wie z. B. der ATIS-Code", "Inhalt des Funkverkehrs und seine näheren Umstände, sofern es sich um Nachrichtenaustausch mit einer Schiffsfunkstelle handelt", "Inhalt des Funkverkehrs und seine näheren Umstände, sofern es sich um Nachrichtenaustausch im Rahmen des Not-, Dringlichkeits- und Sicherheitsverkehrs handelt"],
[20, "Welche Nachrichten dürfen uneingeschränkt aufgenommen und verbreitet werden?", "Aussendungen, die „An alle Funkstellen/All Stations“ gerichtet sind", "Aussendungen des Verkehrskreises Schiff – Hafenbehörde", "Aussendungen im Verkehrskreis Funkverkehr an Bord", "Aussendungen im Binnenschifffahrtsfunk dürfen uneingeschränkt aufgenommen und verbreitet werden"],
[21, "Welche Folgen kann die Verletzung des Fernmeldegeheimnisses haben?", "Strafrechtliche Verfolgung", "Ordnungswidrigkeitsverfahren", "Schriftliche Verwarnung", "Einzug der Funkanlage"],
[22, "Welchen Frequenzbereich nutzt der Binnenschifffahrtsfunk?", "Ultrakurzwelle (UKW/VHF)", "Kurzwelle (KW/HF)", "Grenzwelle (GW/MF)", "Langwelle (LW/LF)"],
[23, "Wie breiten sich Ultrakurzwellen aus?", "Geradlinig und quasioptisch", "Abhängig von der Tageszeit", "Der Erdkrümmung folgend bis weit hinter den Horizont", "In der Ionosphäre reflektiert"],
[24, "Welche Faktoren können die Ausbreitung der Ultrakurzwellen beeinflussen?", "Hindernisse (Berge oder hohe Bauwerke) oder Niederschläge (Schnee- oder Regenschauer)", "Lautstärke, in der die Meldung abgegeben wird", "Tag- und Nachtschwankungen", "Kurs und Geschwindigkeit des Schiffes"],
[25, "Was ist eine „Schiffsfunkstelle“?", "Mobile Funkstelle des Binnenschifffahrtsfunks", "Mobile Funkstelle des mobilen Seefunkdienstes", "Landfunkstelle des Binnenschifffahrtsfunks", "Landfunkstelle des mobilen Seefunkdienstes"],
[26, "Was ist eine „Seefunkstelle“?", "Funkstelle des Mobilen Seefunkdienstes an Bord eines nicht dauernd verankerten Seefahrzeuges", "Funkstelle des Mobilen Seefunkdienstes, die an Land als Küstenfunkstelle betrieben wird", "Funkstelle des Binnenschifffahrtsfunks, die im Seebereich an Bord eines Seeschiffes betrieben wird", "Funkstelle des Mobilen Seefunkdienstes, die im Verkehrskreis Nautische Information betrieben wird"],
[27, "Wer darf eine Schiffsfunkstelle bedienen?", "Inhaber eines gültigen Sprechfunkzeugnisses für den Binnenschifffahrtsfunk (UBI) oder eines gleichwertigen Zeugnisses", "Personen, die ohne Aufsicht eines Funkzeugnisinhabers am Funkverkehr teilnehmen, sofern sie älter als 16 Jahre sind", "Nur der Schiffsführer, sofern er über ein gültiges Sprechfunkzeugnis für den Binnenschifffahrtsfunk (UBI) verfügt", "Personen, die über einen gültigen Sportbootführerschein-Binnen und über die Erlaubnis des Schiffsführers verfügen"],
[28, "Wer stellt in Deutschland die Zuteilungsurkunde (Ship Station Licence) für eine Schiffsfunkstelle aus?", "Bundesnetzagentur (BNetzA)", "Bundesamt für Seeschifffahrt und Hydrographie (BSH)", "Generaldirektion Wasserstraßen und Schifffahrt (GDWS)", "Wasserstraßen- und Schifffahrtsamt (WSA)"],
[29, "Der Betrieb einer Schiffsfunkstelle ohne Zuteilungsurkunde (Ship Station Licence) verstößt gegen Vorschriften …", "des Telekommunikationsgesetzes (TKG)", "der Binnenschifffahrtsstraßen-Ordnung (BinSchStrO)", "des Gesetzes Funkanlagen und Telekommunikationsendeinrichtungen (FTEG)", "der Binnenschifffahrt-Sprechfunkverordnung (BinSchSprFunkV)"],
[30, "Die Bedienung einer Schiffsfunkstelle ohne Erlaubnis (UKW-Sprechfunkzeugnis) verstößt gegen Vorschriften …", "der Binnenschifffahrt-Sprechfunkverordnung (BinSchSprFunkV)", "der Binnenschifffahrtsstraßen-Ordnung (BinSchStrO)", "des Gesetzes über Funkanlagen und Telekommunikationsendeinrichtungen (FTEG)", "des Gesetzes über den Datenschutz und den Schutz der Privatsphäre in der Telekommunikation und bei digitalen Diensten (TDDDG)"],
[31, "Welches amtliche Dokument für eine Schiffsfunkstelle muss sich an Bord befinden?", "Zuteilungsurkunde (Ship Station Licence)", "UKW-Sprechfunkzeugnis (UBI)", "UKW-Betriebszeugnis", "Zulassungsurkunde"],
[32, "Die telekommunikationsrechtliche Überprüfung einer Schiffsfunkstelle wird durchgeführt von …", "Bundesnetzagentur (BNetzA)", "Bundesamt für Seeschifffahrt und Hydrographie (BSH)", "Generaldirektion Wasserstraßen und Schifffahrt (GDWS)", "Wasserstraßen- und Schifffahrtsamt (WSA)"],
[33, "Wer ist bei Eigner-Wechsel eines Binnenschiffes in Bezug auf die Schiffsfunkstelle zu benachrichtigen?", "Bundesnetzagentur (BNetzA)", "Bundesamt für Seeschifffahrt und Hydrographie (BSH)", "Generaldirektion Wasserstraßen und Schifffahrt (GDWS)", "Wasserstraßen- und Schifffahrtsamt (WSA)"],
[34, "Welches amtliche Dokument stellt die Bundesnetzagentur (BNetzA) zum Betreiben einer Schiffsfunkstelle aus?", "Nummernzuteilungsurkunde (Ship Station Licence)", "UKW-Sprechfunkzeugnis (UBI)", "Radarpatent", "Kleinschifferzeugnis"],
[35, "Wer kann die Einstellung des Betriebes einer Schiffsfunkstelle anordnen?", "Bundesnetzagentur (BNetzA)", "Bundesamt für Seeschifffahrt und Hydrographie (BSH)", "Generaldirektion Wasserstraßen und Schifffahrt (GDWS)", "Wasserstraßen- und Schifffahrtsamt (WSA)"],
[36, "Welche Teile des Handbuchs Binnenschifffahrtsfunk müssen bei einer Schiffsfunkstelle mit geführt werden?", "Allgemeiner Teil sowie Regionale Teile für die Strecken, in denen die Schiffsfunkstelle am Binnenschifffahrtsfunk teilnimmt", "Regionale Teile für die Strecke, in der sich die Schiffsfunkstelle gerade befindet", "Regionale Teile für alle europäischen Wasserstraßen", "Allgemeiner Teil sowie Regionale Teile des Landes, in dem die Schiffsfunkstelle angemeldet wurde"],
[37, "Woraus besteht das Rufzeichen für eine deutsche Schiffsfunkstelle?", "Zwei Buchstaben der Rufzeichenreihe für Deutschland, gefolgt von vier Ziffern", "Vier Buchstaben der Rufzeichenreihe für Deutschland, gefolgt von vier Ziffern", "Zwei Buchstaben der Rufzeichenreihe für Deutschland, gefolgt von zwei Ziffern", "Vier Buchstaben der Rufzeichenreihe für Deutschland, gefolgt von zwei Ziffern"],
[38, "Welches der nachfolgend angegebenen Rufzeichen kennzeichnet eine Schiffsfunkstelle?", "DA 5005", "DABC 55", "DA5 0BC", "DA 505B"],
[39, "Was bedeutet „ATIS“?", "Automatisches Senderidentifizierungssystem", "Automatisches Schiffsidentifizierungssystem", "Automatisches Verkehrsinformationssystem", "Automatisches Transponderabfragesystem"],
[40, "Welchem Zweck dient die Aussendung eines ATIS-Codes?", "Identifizierung einer Schiffsfunkstelle", "Identifizierung einer Seefunkstelle", "Identifizierung des Bedieners der Schiffsfunkstelle", "Identifizierung des Verkehrskreises"],
[41, "Wie setzt sich der ATIS-Code zusammen?", "Aus 10 Ziffern: der Ziffer 9, der dreistelligen Seefunkkennzahl (MID) und 6 Ziffern", "Aus 9 Ziffern: der dreistelligen Seefunkkennzahl (MID) und 6 Ziffern", "Aus 10 Ziffern: der Ziffer 9, zwei Nullen, der dreistelligen Seefunkkennzahl (MID) und 4 Ziffern", "Aus 9 Ziffern: der Ziffer Null, der dreistelligen Seefunkkennzahl (MID) und 5 Ziffern"],
[42, "Wann wird das ATIS-Signal ausgesendet?", "Automatisch nach dem Loslassen der Sprechtaste", "Automatisch beim Drücken der Sprechtaste", "Automatisch alle 10 Minuten", "Automatisch beim Kanalwechsel"],
[43, "Welchen ATIS-Code sendet eine tragbare Funkanlage aus?", "ATIS-Code der Schiffsfunkstelle, zu der sie gehört", "ATIS-Code, der ihr gesondert mit der Zuteilungsurkunde (Ship Station Licence), zugewiesen wurde", "ATIS-Code der ortsfesten Funkstelle", "ATIS-Code der Schiffsfunkstelle und die Gerätenummer"],
[44, "Was kann aus dem nationalen ATIS-Code abgeleitet werden?", "Rufzeichen", "Schiffsname", "Schiffsregistrierungsnummer", "Heimathafen"],
[45, "Was versteht man unter „AIS“?", "Automatisches Schiffsidentifizierungs- und Überwachungssystem, das statische, dynamische und reisebezogene Informationen auf UKW überträgt", "Allgemeines Informationssystem für die Binnenschifffahrt", "Automatische Aussendung der Kennung eines Binnenschiffes beim Loslassen der Sprechtaste", "Identifizierung eines Schiffes mit Hilfe von Radarpeilungen und deren Weitergabe an die Schifffahrt zur Kollisionsverhütung"],
[46, "Welche Informationen werden bei AIS automatisch ausgetauscht?", "Statische Informationen (z. B. Schiffsname), dynamische Informationen (z. B. Kurs) und reisebezogene Informationen (z. B. Bestimmungsort)", "Statische Informationen (z. B. Schiffsname), notfallbezogene Informationen (z. B. Notalarme) und reisebezogene Informationen (z. B. Bestimmungsort)", "Statische Informationen (z. B. Schiffsname), reisebezogene Informationen (z. B. Bestimmungsort) und dringende Informationen (z. B. Treibstoffmangel)", "Statische Informationen (z. B. Schiffsname), dynamische Informationen (z. B. Kurs) und notfallbezogene Informationen (z. B. Notalarme)"],
[47, "Welche Einstellung der Sendeleistung kann man bei einer Schiffsfunkstelle vornehmen?", "1 Watt, 25 Watt", "1 Watt, 10 Watt", "5 Watt, 15 Watt", "5 Watt, 50 Watt"],
[48, "Was bedeutet die Angabe „Betriebsspannung 10,8 – 14,6 V=“ in der Bedienungsanleitung für eine Funkanlage?", "Es ist eine Gleichspannung zwischen 10,8 und 14,6 Volt für den Betrieb erforderlich", "Es ist eine Wechselspannung zwischen 10,8 und 14,6 Volt für den Betrieb erforderlich", "Es ist eine Gleichspannung von 12,7 Volt (Mittelwert zwischen 10,8 und 14,6 Volt) für den Betrieb erforderlich.", "Es ist eine Wechselspannung von 12,7 Volt (Mittelwert zwischen 10,8 und 14,6 Volt) für den Betrieb erforderlich"],
[49, "Was ist vor der Inbetriebnahme eines UKW-Sprechfunkgerätes für den Binnenschifffahrtsfunk zu beachten?", "Das Funkgerät muss zugelassen oder für die Teilnahme am Binnenschifffahrtsfunk in Verkehr gebracht worden sein", "Das Funkgerät muss funktionsfähig und für die Teilnahme am Binnenschifffahrtsfunk TÜV-geprüft sein", "Das Funkgerät muss für die Teilnahme am Binnenschifffahrtsfunk eine ATIS-Schnittstelle besitzen und Wetterberichte empfangen können", "Das Funkgerät muss gemäß der Binnenschifffahrt-Sprechfunkverordnung für die Teilnahme am Binnenschifffahrtsfunk zugelassen sein"],
[50, "Je höher die Antenne angebracht ist, desto…", "größer ist die Reichweite", "größer ist die erforderliche Sendeleistung", "wetterunabhängiger ist der Funkverkehr", "größer wird die Gefährdung von Personen in elektromagnetischen Feldern"],
[51, "Bei einer Beschädigung der äußeren Isolierung (Mantel) des Antennenkabels sollte das Antennenkabel …", "umgehend erneuert werden", "bei Gelegenheit erneuert werden", "umgehend hilfsweise durch ein Stromkabel ersetzt werden", "bei Gelegenheit gegen eindringende Feuchtigkeit gesichert werden"],
[52, "In welchen UKW-Frequenzbereich wird der Binnenschifffahrtsfunk abgewickelt?", "156,025 –162,025 MHz", "118,000 –136,975 MHz", "80 – 87,5 MHz", "160,215 –161,565 MHz"],
[53, "Worauf ist beim Austausch einer defekten UKW-Antenne bei einer Schiffsfunkstelle durch eine Ersatzantenne zu achten?", "Die Ersatzantenne muss für den Frequenzbereich des Binnenschifffahrtsfunks ausgelegt sein", "Die Ersatzantenne muss wettergeschützt angebracht werden", "Die Ersatzantenne muss außerhalb des Abdeckungsbereichs des Radars angebracht werden", "Die Ersatzantenne muss am höchsten Punkt des Fahrzeugs angebracht werden"],
[54, "Wozu dient am UKW-Gerät die Rauschsperre (Squelch)?", "Die Wiedergabe des Empfängers wird nur bei einem brauchbaren Empfangssignal aktiviert", "Das Rauschen kann stufenlos auf einen angenehmen Wert eingestellt werden", "Die Rauschsperre verbessert die Wiedergabe von schwachen Empfangssignalen", "Die Wiedergabe des Empfängers wird nur beim Empfang von Notsignalen aktiviert"],
[55, "Wozu dient ein „Verkehrskreis“ im Binnenschifffahrtsfunk?", "Zuordnung von Sprechfunk-Kanälen für bestimmte Zwecke", "Zuordnung von Sprechfunk-Kanälen für bestimmte Schiffsfunkstellen", "Zuordnung der Rangfolge von bestimmten Arten von Funkgesprächen", "Zuordnung von Sprechfunk-Rufzeichen für bestimmte Funkstellen"],
[56, "Welche Verkehrskreise werden im Binnenschifffahrtsfunk betrieben?", "Schiff – Schiff, Nautische Information, Schiff – Hafenbehörde, Funkverkehr an Bord", "Schiff – Schiff, Schiff – Verkehrszentrale, Schiff – Hafenbehörde, Funkverkehr an Bord", "Schiff – Schiff, Nautische Information, Schiff – Hafenbehörde, Schiff – Verkehrsposten", "Schiff – Schiff, Nautische Information, Schiff – Hafenbehörde, Schiff – Landfunkstelle"],
[57, "In welchem Verkehrskreis ist die Sendeleistungserhöhung auf 25 Watt zulässig?", "Nautische Information", "Schiff – Schiff", "Schiff – Hafenbehörde", "Funkverkehr an Bord"],
[58, "Die Verkehrskreise „Nautische Information“ und „Schiff – Hafenbehörde“ werden …", "nicht auf allen Bundeswasserstraßen angeboten", "auf allen Bundeswasserstraßen angeboten", "in Häfen und ausgewiesenen Liegestellen angeboten", "auf dem Rhein, auf der Donau und auf der Mosel angeboten"],
[59, "Wozu dient der Verkehrskreis „Schiff – Schiff“?", "Funkverkehr zwischen Schiffsfunkstellen", "Funkverkehr zwischen Schiffsfunkstellen und Funkstellen der Behörden, die für die Betriebsdienste auf Binnenwasserstraßen zuständig sind", "Funkverkehr von Schiffsfunkstellen über Landfunkstellen mit dem öffentlichen Telekommunikationsnetz", "Funkverkehr zwischen Handfunkgeräten auf einem Schiff"],
[60, "Welche Nachrichten werden im Verkehrskreis „Schiff – Schiff“ übermittelt?", "Nachrichten, die sich auf den Schutz von Personen oder auf die Fahrt oder auf die Sicherheit von Schiffen beziehen", "Nachrichten über den Zustand der Wasserstraßen, über Verkehrsberatung und zur Verkehrslenkung zwischen Schiffsfunkstellen und Landfunkstellen", "Nachrichten über die Zuweisung von Liegeplätzen oder über die Fahrt in den Häfen", "Nachrichten über schiffsbetriebliche Angelegenheiten, die sich auf die Sicherheit von Schiffen beziehen"],
[61, "Welche Funkstelle ist nicht dem Verkehrskreis „Schiff – Hafenbehörde“ zugeordnet?", "Revierzentrale Minden", "Duisburg Hafen", "GMS Otrate", "MS Mainz"],
[62, "Welche Funkstelle kann am Verkehrskreis „Schiff – Schiff“ teilnehmen?", "Segelyacht Robbe DA 5005", "Lauenburg Schleuse", "Duisburg Hafen", "Minden Revierzentrale"],
[63, "Wozu dient der Verkehrskreis „Nautische Information“?", "Funkverkehr zwischen Schiffsfunkstellen und Funkstellen der Behörden, denen der Betrieb der Bundeswasserstraßen obliegt", "Funkverkehr von Schiffsfunkstellen über Landfunkstellen mit dem öffentlichen Telekommunikationsnetz", "Funkverkehr zwischen Schiffsfunkstellen", "Funkverkehr zwischen Schiffsfunkstellen und Landfunkstellen von Hafenbehörden"],
[64, "Welche Nachrichten werden im Verkehrskreis „Nautische Information“ übermittelt?", "Nachrichten über den Zustand der Wasserstraßen, über Verkehrsberatung und zur Verkehrslenkung", "Nachrichten über die Zuweisung von Liegeplätzen oder über die Fahrt in den Häfen", "Nachrichten, die sich auf Funkverkehr zwischen Schiffsfunkstellen beziehen", "Nachrichten über schiffsbetriebliche Angelegenheiten"],
[65, "Wodurch kann bei einem nicht funkausrüstungspflichtigen Fahrzeug die ununterbrochene Teilnahme am Verkehrskreis „Nautische Information“ sichergestellt werden?", "Zusätzliche UKW-Funkanlage für den Binnenschifffahrtsfunk", "Zweikanalüberwachung (Dual Watch)", "Ununterbrochene Empfangsbereitschaft auf Kanal 10", "Einschalten des Kanals der Funkstelle der zuständigen Hafenbehörde"],
[66, "Welche Funkstelle ist nicht dem Verkehrskreis „Nautische Information“ zugeordnet?", "Neuss Hafen", "Iffezheim Schleuse", "Gerstheim Ecluse", "Oberwesel Revierzentrale"],
[67, "Welche Funkstelle ist dem Verkehrskreis „Nautische Information“ zugeordnet?", "Iffezheim Schleuse", "Regensburg Hafen", "Marina Düsseldorf Port", "MS Mainz"],
[68, "Wozu dient der Verkehrskreis „Schiff – Hafenbehörde“?", "Funkverkehr zwischen Schiffsfunkstellen und Funkstellen von Hafenbehörden", "Funkverkehr von Schiffsfunkstellen über Landfunkstellen mit dem öffentlichen Telekommunikationsnetz", "Funkverkehr zwischen Schiffsfunkstellen in Häfen", "Funkverkehr an Bord eines Schiffes oder innerhalb einer Gruppe von Fahrzeugen, die geschleppt oder geschoben werden"],
[69, "Welche Nachrichten werden im Verkehrskreis „Schiff – Hafenbehörde“ übermittelt?", "Nachrichten über die Zuweisung von Liegeplätzen oder über die Fahrt in den Häfen", "Nachrichten über den Zustand der Wasserstraßen, über Verkehrsberatung und zur Verkehrslenkung", "Nachrichten, die sich auf Funkverkehr zwischen Schiffsfunkstellen beziehen", "Nachrichten über schiffsbetriebliche Angelegenheiten"],
[70, "Welchem Verkehrskreis ist die Landfunkstelle Lübeck Hubbrücken zugeordnet?", "Nautische Information (NIF)", "Schiff – Schiff", "Schiff – Hafenbehörde", "Funkverkehr an Bord"],
[71, "Welche Revierzentralen gibt es in Deutschland?", "Duisburg, Oberwesel, Minden, Magdeburg, Gösselthal", "Düsseldorf, Oberwesel, Magdeburg, Gösselthal, Minden", "Köln, Minden, Koblenz, Gösselthal, Magdeburg", "Oberwesel, Duisburg, Göppingen, Magdeburg, Minden"],
[72, "Welche Funkstelle ist dem Verkehrskreis „Schiff – Hafenbehörde“ zugeordnet?", "Marina Düsseldorf Port", "Gerstheim Ecluse", "Rothensee Hebewerk", "Lauenburg Schleuse"],
[73, "Wozu dient der Verkehrskreis „Funkverkehr an Bord“?", "Funkverkehr an Bord eines Schiffes oder innerhalb einer Gruppe von Fahrzeugen, die geschleppt oder geschoben werden", "Funkverkehr zwischen Schiffsfunkstellen und Landfunkstellen von Hafenbehörden", "Funkverkehr zwischen nicht funkausrüstungspflichtigen Schiffsfunkstellen", "Funkverkehr zwischen Schiffsfunkstellen in Häfen"],
[74, "Welche Nachrichten werden im Verkehrskreis „Funkverkehr an Bord“ übermittelt?", "Nachrichten über schiffsbetriebliche Angelegenheiten sowie bei Anweisungen für das Arbeiten mit Leinen und für das Ankern", "Nachrichten über die Zuweisung von Liegeplätzen oder über die Fahrt in den Häfen", "Nachrichten über den Zustand der Wasserstraßen, über Verkehrsberatung und zur Verkehrslenkung zwischen Schiffsfunkstellen und Landfunkstellen", "Nachrichten, die sich auf den Schutz von Personen und auf die Fahrt oder auf die Sicherheit von Schiffen beziehen"],
[75, "Welche UKW-Kanäle dürfen im Verkehrskreis „Funkverkehr an Bord“ benutzt werden?", "15 und 17", "72 und 77", "06 und 16", "18 und 22"],
[76, "Sind tragbare Funkanlagen auf Kleinfahrzeugen grundsätzlich zugelassen?", "Nein", "Ja", "Nur, wenn zusätzlich eine fest eingebaute Sprechfunkanlage für den Binnenschifffahrtsfunk verbaut ist", "Nur, wenn Kleinfahrzeuge im Verband fahren"],
[77, "Welche Fahrzeuge/Schiffe mit Schiffsfunkstellen dürfen nicht am Verkehrskreis „Funkverkehr an Bord“ teilnehmen?", "Kleinfahrzeuge", "Schlepp- und Schubschiffe", "Behördenfahrzeuge", "Fahrgastschiffe"],
[78, "Welche Kennung müssen Schiffsfunkstellen in den Verkehrskreisen „Schiff – Schiff“, „Nautische Information“ und „Schiff – Hafenbehörde“ im Sprechfunkverkehr verwenden?", "Schiffsname und Rufzeichen (verbal) und ggf. automatisierte ATIS-Kennung", "Ausschließlich die automatisierte ATIS-Kennung", "Rufnummer im Seefunkdienst (MMSI)", "Heimathafen"],
[79, "In welchen Verkehrskreisen müssen Schiffsfunkstellen auf funkausrüstungspflichtigen Schiffen während der Fahrt empfangsbereit sein?", "Mindestens in zwei der Verkehrskreise Schiff – Schiff, Nautische Information oder Schiff – Hafenbehörde", "Mindestens in drei der Verkehrskreise Schiff – Schiff, Nautische Information, Funkverkehr an Bord oder Schiff – Hafenbehörde", "Mindestens in einem der Verkehrskreise Schiff – Schiff, Nautische Information oder Schiff – Hafenbehörde", "Mindestens abwechselnd in einem der Verkehrskreise Schiff – Schiff, Nautische Information, Funkverkehr an Bord oder Schiff – Hafenbehörde"],
[80, "Wo findet man Regelungen über die Abwicklung des Binnenschifffahrtsfunks?", "Allgemeiner Teil des Handbuchs Binnenschifffahrtsfunk", "Regionaler Teil Deutschland des Handbuchs Binnenschifffahrtsfunk", "Binnenschifffahrt-Sprechfunkverordnung", "Binnenschifffahrtsstraßen-Ordnung"],
[81, "Wo findet man die empfohlenen fremdsprachlichen Redewendungen für die Abwicklung des Binnenschifffahrtsfunks?", "Regionale Teile des Handbuchs Binnenschifffahrtsfunk", "Allgemeiner Teil des Handbuchs Binnenschifffahrtsfunk", "Binnenschifffahrt-Sprechfunkverordnung", "Binnenschifffahrtsstraßen-Ordnung"],
[82, "Wozu dient die internationale Buchstabiertafel im Binnenschifffahrtsfunk?", "Zum Buchstabieren schwieriger Wörter, Namen und Bezeichnungen innerhalb von Meldungen, um Übermittlungsfehler zu vermeiden", "Zum Buchstabieren schwieriger Wörter, Namen und Bezeichnungen, um die Vorschriften der Binnenschifffahrt-Sprechfunkverordnung zu erfüllen", "Zum Buchstabieren schwieriger Wörter, Namen und Bezeichnungen, um die Wichtigkeit der buchstabierten Begriffe zu betonen", "Zum Buchstabieren schwieriger Wörter, Namen und Bezeichnungen, um Informationen zu verschlüsseln"],
[83, "Wo findet man Angaben über die UKW-Kanäle, die im Binnenschifffahrtsfunk in bestimmten Regionen benutzt werden sollen?", "In den Regionalen Teilen des Handbuchs Binnenschifffahrtsfunk", "Schifffahrtspolizeiverordnungen, z. B. Rheinschifffahrtspolizeiverordnung", "Binnenschifffahrtsstraßen-Ordnung", "Binnenschifffahrt-Sprechfunkverordnung"],
[84, "Was bedeutet die Betriebsart „Simplex“?", "Wechselsprechen", "Gegensprechen", "Sprechen über Ober- und Unterband", "Sprechen mit einem Funkgerät"],
[85, "Wie erfolgt die Verkehrsabwicklung in der Betriebsart „Simplex“?", "Jeder Gesprächspartner kann entweder senden oder empfangen", "Beide Gesprächspartner können gleichzeitig senden und empfangen", "Nach den Vorgaben der Revierzentrale", "Der Funkverkehr kann nur in Richtung Landfunkstelle-Schiffsfunkstelle betrieben werden"],
[86, "Was bedeutet die Betriebsart „Duplex“?", "Gegensprechen", "Wechselsprechen", "Sprechen mit zwei Funkgeräten", "Sprechen auf einer Frequenz"],
[87, "Was bedeutet Semi-Duplex?", "Wechselsprechen auf einem Duplex-Kanal", "Wechselsprechen auf einem Simplex-Kanal", "Gegensprechen auf einem Duplex-Kanal", "Gegensprechen auf einem Simplex-Kanal"],
[88, "Warum kann die Hörbereitschaft auf zwei Kanälen im Binnenschifffahrtsfunk nicht durch die Zweikanalüberwachung (Dual Watch) wahrgenommen werden?", "Die Zweikanalüberwachung ermöglicht lediglich die zeitlich abwechselnde Hörbereitschaft auf zwei Funkkanälen", "Die Zweikanalüberwachung vermindert die Empfangsreichweite der Funkanlage", "Die Zweikanalüberwachung wertet die ATIS-Kennungen anderer Funkstellen nicht aus", "Die Zweikanalüberwachung funktioniert nur in bestimmten Verkehrskreisen"],
[89, "Wie erfolgt die Leistungsreduzierung beim Sendebetrieb einer Schiffsfunkstelle auf dem UKW-Kanal 10?", "Automatisch", "Manuell", "Durch die Revierzentrale", "Durch längeres Drücken der Sendetaste"],
[90, "Mit welcher Leistung sendet eine Schiffsfunkstelle auf UKW-Kanal 10?", "Maximal 1 Watt", "Maximal 5 Watt", "5 bis 25 Watt", "10 bis 25 Watt"],
[91, "Auf welchem UKW-Kanal müssen Schiffsfunkstellen in Deutschland – unabhängig von dem befahrenen Streckenabschnitt – während der Fahrt ständig empfangsbereit sein?", "10", "72", "20", "13"],
[92, "Welcher UKW-Kanal darf im Binnenschifffahrtsfunk auf den Bundeswasserstraßen der Zonen 3 und 4 nicht benutzt werden?", "16", "72", "10", "77"],
[93, "Wie kündigt man einem Bunkerboot an, dass Sie Treibstoff bunkern möchten?", "Anruf auf Kanal 10, mit der Bitte auf den Kanal für „Nachrichten sozialer Art“ zu wechseln.", "Anruf auf Kanal 10 und dem Bunkerboot meine Nachricht mitteilen.", "Anruf auf Kanal 16 und dem Bunkerboot meine Nachricht mitteilen.", "Anruf auf Kanal 15 oder 17 und dem Bunkerboot meine Nachricht mitteilen."],
[94, "Welche UKW-Kanäle dürfen für „Nachrichten sozialer Art“ benutzt werden?", "72 und 77", "15 und 17", "06 und 16", "20 und 22"],
[95, "Welche Fahrzeuge unterliegen auf bestimmten Wasserstraßen und an bestimmten Stellen einer Meldepflicht?", "Gefahrgutschiffe und Sondertransporte", "Motorfahrzeuge mit einer Gesamtlänge von mehr als 20 Metern", "Fahrgastschiffe mit mehr als 20 Passagieren", "Sportboote unter Segel"],
[96, "Vor jeder Aussendung ist durch kurzzeitiges Öffnen der Rauschsperre sicherzustellen, dass …", "kein anderer Funkverkehr gestört wird und der Kanal frei ist", "die Sendeleistung auf 25 Watt eingestellt ist", "die ATIS-Kennung zuvor ausgesendet wird", "der DSC-Controller ausgeschaltet ist"],
[97, "Die Aussendung einer anderen Schiffsfunkstelle auf Kanal 10 kann …", "nicht unterbrochen werden", "jederzeit unterbrochen werden", "durch Schiffsfunkstellen desselben Verkehrskreises unterbrochen werden", "jederzeit durch Landfunkstellen unterbrochen werden"],
[98, "Längere Aussendungen auf Kanal 10 sollen vermieden werden, weil sie…", "nicht durch andere Funkstellen unterbrochen werden können", "durch Landfunkstellen nur im Notfall unterbrochen werden können", "den Empfang des ebenfalls im UKW-Bereich arbeitenden AIS stören können", "in der Nähe von Landesgrenzen andere Funkdienste im Ausland stören können"],
[99, "Was hat eine Schiffsfunkstelle im Verkehr mit einer Funkstelle des Verkehrskreises Nautische Information zu beachten?", "Anweisungen der Funkstelle des Verkehrskreises Nautische Information sind zu befolgen", "Nachrichten mit der Funkstelle des Verkehrskreises Nautische Information sind auf Kanal 16 auszutauschen", "Sendeleistung ist zu reduzieren", "Hörbereitschaft auf Kanal 13 ist sicherzustellen"],
[100, "Was kann in den Zonen 1 und 2 die Funkverbindung zwischen einer Schiffsfunkstelle und einer Seefunkstelle beeinträchtigen?", "Die Schiffsfunkstelle sendet auf bestimmten UKW-Kanälen nur mit automatisch reduzierter Leistung", "Die Seefunkstelle sendet auf bestimmten UKW-Kanälen nur mit automatisch reduzierter Leistung", "Die Schiffsfunkstelle kann die AIS-Aussendung der Seefunkstelle auf bestimmten UKW-Kanälen nicht auswerten", "Die Seefunkstelle kann die ATIS-Aussendung der Schiffsfunkstelle auf bestimmten UKW-Kanälen nicht auswerten"],
[101, "Warum dürfen Seefunkstellen mit ihrer Seefunkanlage nicht am Binnenschifffahrtsfunk teilnehmen?", "Seefunkanlagen verfügen weder über eine automatische Sendeleistungsreduzierung auf bestimmten UKW-Kanälen, noch können sie einen ATIS-Code aussenden", "Seefunkanlagen nutzen ein anderes Frequenzband als Binnenschifffahrtsfunkanlagen", "Seefunkanlagen verfügen über einen DSC-Controller, der mit dem ATIS-System nicht kompatibel ist", "Seefunkanlagen ermöglichen die Hörbereitschaft auf den UKW-Kanälen 16 und 70"],
[102, "Die Verwendung des Digitalen Selektivrufs (DSC) ist …", "im Binnenschifffahrtsfunk nicht zulässig", "eingeführt zur Verbindungsaufnahme mit anderen Schiffsfunkstellen", "eingeführt zur Identifizierung von Schiffsfunkstellen", "im Binnenschifffahrtsfunk zulässig für Notalarme"],
[103, "Welche Sprache sollte bei Verbindungen zwischen deutschen Schiffsfunkstellen und ausländischen Landfunkstellen benutzt werden?", "Grundsätzlich die Sprache des Landes, in dem sich die Landfunkstelle befindet", "Heimatsprache des Funkers", "Vorrangig Englisch", "Vorrangig Deutsch"],
[104, "Was ist bei Testsendungen im Binnenschifffahrtsfunk zu beachten?", "Die Aussendungen dürfen 10 Sekunden nicht überschreiten; sie müssen den Rufnamen der aussendenden Funkstelle enthalten, gefolgt von dem Wort „Test“", "Die Aussendungen dürfen 10 Sekunden nicht überschreiten und müssen mit einer Kennung des Schiffes ausgestrahlt werden", "Die Aussendungen dürfen nur einmal nach Einbau des Gerätes ohne Antenne erfolgen und müssen mit dem Wort „Test“ gekennzeichnet werden", "Die Aussendungen dürfen nur außerhalb der Hoheitsgewässer erfolgen"],
[105, "Wann müssen Meldungen grundsätzlich bestätigt werden?", "Auf Verlangen", "Immer", "Nie", "Bei Verständigungsschwierigkeiten"],
[106, "Woran erkennt man beim Befahren von Binnenwasserstraßen, welcher UKW-Kanal im Schleusenbereich zu benutzen ist?", "Tafelzeichen", "Schwimmende Schifffahrtszeichen", "Durchsage der Revierzentrale", "Lichtzeichen der Schleuse"],
[107, "Welche Bedeutung hat ein weißes Tafelzeichen mit rotem Rand und der schwarzen Aufschrift „UKW 20“ oder „VHF 20“?", "Gebot, UKW-Kanal 20 zu benutzen", "Gebot, eine Sendeleistung von 20 Watt zu gewährleisten", "Hinweis, dass der Verkehrskreis Schiff – Schiff auf UKW-Kanal 20 abzuwickeln ist", "Hinweis, dass der UKW-Kanal 20 für die Nutzung durch die Berufsschifffahrt vorgesehen ist"],
[108, "Welche Bedeutung hat ein blaues Tafelzeichen mit der weißen Aufschrift „UKW 18“ oder „VHF 18“?", "Hinweis auf den Nautischen Informationsfunk (NIF) auf UKW-Kanal 18", "Gebot, UKW-Kanal 18 statt 10 für die Verkehrsabwicklung zu benutzen", "Hinweis, dass der Verkehrskreis Schiff – Schiff auf UKW-Kanal 18 abzuwickeln ist", "Hinweis, dass der UKW-Kanal 18 für die Nutzung durch die Sportschifffahrt vorgesehen ist"],
[109, "Welche Landfunkstellen sind zur Einleitung von Rettungsmaßnahmen vorzugsweise anzurufen?", "Revierzentralen", "Rettungsleitstellen", "Schiffsfunkstellen", "Polizeifunkstellen"],
[110, "Wie ist die Rangfolge des Funkverkehrs im Binnenschifffahrtsfunk?", "Notverkehr, Dringlichkeitsverkehr, Sicherheitsverkehr, Routineverkehr", "Dringlichkeitsverkehr, Notverkehr, Sicherheitsverkehr, Routineverkehr", "Sicherheitsverkehr, Dringlichkeitsverkehr, Notverkehr, Routineverkehr", "Notverkehr, Dringlichkeitsverkehr, Routineverkehr, Sicherheitsverkehr"],
[111, "Wie heißt das Notzeichen im Sprechfunk?", "MAYDAY", "PAN PAN", "SOS", "SECURITE"],
[112, "Ein Notverkehr im Binnenschifffahrtsfunk muss eingeleitet werden, wenn…", "eine unmittelbare Gefährdung von Mensch oder Schiff gegeben ist", "das Schiff gefährliche Güter geladen hat", "gefährliche Wetterlagen auftreten", "eine Behinderung der Schifffahrt droht"],
[113, "Welcher Funkverkehr ist einzuleiten, wenn sich an Bord eine lebensgefährlich verletzte Person befindet?", "Notverkehr", "Dringlichkeitsverkehr", "Sicherheitsverkehr", "Routineverkehr"],
[114, "Welcher Funkverkehr ist einzuleiten, wenn eine Person über Bord gefallen ist?", "Notverkehr", "Dringlichkeitsverkehr", "Sicherheitsverkehr", "Routineverkehr"],
[115, "Welcher Funkverkehr ist einzuleiten, wenn das Fahrzeug in gefährlicher Weise zu kentern droht?", "Notverkehr", "Dringlichkeitsverkehr", "Sicherheitsverkehr", "Routineverkehr"],
[116, "Wer bestätigt eine Notmeldung im Verkehrskreis „Nautische Information“?", "Die zuständige Schleuse oder Revierzentrale", "Behördenfahrzeug", "In der Nähe befindliche Schiffsfunkstelle", "Der Schiffsführer"],
[117, "Wer bestätigt eine Notmeldung im Verkehrskreis „Schiff – Schiff“?", "In der Nähe befindliche Schiffsfunkstelle", "Ortsfeste Funkstelle", "Verkehrsposten", "Der Schiffsführer"],
[118, "Was bedeuten die Worte MAYDAY RELAY?", "Aussendung einer Notmeldung durch eine Funkstelle, die sich selbst nicht in Not befindet", "Beendigung einer Notmeldung durch die Funkstelle, die den Notverkehr leitet", "Bestätigung des Empfangs einer Notmeldung", "Notmeldung an eine Landstation mit der Bitte um Leitung des Notverkehrs"],
[119, "Was bedeuten die Worte SILENCE FINI?", "Der Notverkehr ist beendet", "Einer Funkstelle, die den Notverkehr stört, wird Funkstille geboten", "Dringlichkeits- und Sicherheitsverkehr darf wieder aufgenommen werden", "Alle Funkstellen müssen Funkstille einhalten"],
[120, "Was bedeuten die Worte SILENCE MAYDAY?", "Die Funkstelle in Not gebietet den nicht am Notverkehr beteiligten Funkstellen Funkstille", "Der Notverkehr ist beendet", "Die am Notverkehr beteiligten Funkstellen genießen Vorrang", "Eine Notmeldung folgt"],
[121, "Woraus besteht das Dringlichkeitszeichen im Sprechfunk?", "PAN PAN", "MAYDAY", "SECURITE", "URGENT"],
[122, "Wann liegt ein Dringlichkeitsfall vor?", "Wenn dringende Nachrichten übermittelt werden sollen, welche die Besatzung und/oder das Schiff betreffen, ohne dass eine unmittelbare Gefährdung gegeben ist", "Wenn eine unmittelbare Gefährdung von Mensch oder Schiff gegeben ist oder eine Gefahrenabwehr an Land notwendig ist", "Wenn dringende Nachrichten übermittelt werden sollen, welche den Empfang eines Notzeichens betreffen", "Wenn dringende Nachrichten übermittelt werden sollen, welche die Unterstützung durch die Wasserschutzpolizei betreffen"],
[123, "Welche Meldungen können beispielsweise mit dem Dringlichkeitszeichen angekündigt werden?", "Meldungen, die sich auf Krankheiten beziehen, die keine Lebensgefahr bedeuten, oder auf Schäden an Fahrzeugen, ohne dass davon eine unmittelbare Gefahr ausgeht", "Meldungen, die sich auf eine unmittelbare Gefährdung von Mensch oder Schiff oder eine Gefahrenabwehr an Land beziehen", "Meldungen, die sich auf Krankheiten beziehen, die keine Lebensgefahr bedeuten, oder auf Schäden an Fahrzeugen, von denen eine unmittelbare Gefahr ausgeht", "Meldungen, die sich auf lebensgefährliche Krankheiten oder auf Schäden an Fahrzeugen oder Anlagen beziehen"],
[124, "Welcher Funkverkehr ist einzuleiten, wenn bei einer Person an Bord eine nicht lebensbedrohliche Verletzung festgestellt wurde, die kurzfristig ärztlicher Versorgung bedarf?", "Dringlichkeitsverkehr", "Notverkehr", "Sicherheitsverkehr", "Routineverkehr"],
[125, "Wie wird eine Dringlichkeitsmeldung aufgehoben?", "Nach demselben Anrufschema wie bei der Ankündigung einer Dringlichkeitsmeldung, der Uhrzeit der Aussendung und dem Hinweis der Rücknahme der Meldung", "Als Routinemeldung", "Mit den Worten PAN PAN FINI", "Dringlichkeitsmeldungen müssen nicht aufgehoben werden"],
[126, "Wie lautet das Sicherheitszeichen im Sprechfunk?", "SECURITE", "MAYDAY", "PAN PAN", "SOS"],
[127, "Welche Meldungen werden mit dem Sicherheitszeichen SECURITE angekündigt?", "Sicherheitsrelevante Nachrichten, die eine wichtige nautische Warnnachricht oder eine wichtige Wetterwarnung beinhalten", "Nachrichten, die eine wichtige nautische Warnnachricht oder den Radareinsatz bei unsichtigem Wetter beinhalten", "Nachrichten, die eine wichtige Wetterwarnung oder eine Warnung zur Vermeidung von Umweltschäden beinhalten", "Nachrichten, die eine wichtige nautische Warnnachricht oder eine dringende medizinische Meldung beinhalten"],
[128, "Welche Meldung ist zu verbreiten, wenn ein treibender Baumstamm beobachtet wird, der eine Gefahr für den Verkehr darstellt?", "Sicherheitsmeldung", "Notmeldung", "Dringlichkeitsmeldung", "keine Meldung"],
[129, "Welche Meldung ist zu verbreiten, wenn eine vertriebene Tonne beobachtet wird?", "Sicherheitsmeldung", "Notmeldung", "Dringlichkeitsmeldung", "keine Meldung"],
[130, "Wer entscheidet über die Art der auszusendenden Sprechfunkmeldung?", "Schiffsführer", "Bediener der Funkanlage", "Wasserschutzpolizei", "Revierzentrale"],
];

type Cert = "SRC" | "UBI";
type CertFilter = "alle" | "SRC" | "UBI";
type Mode = "ueben" | "karte" | "pruefung";

interface Item {
  cert: Cert;
  n: number;
  q: string;
  a: string[];
  ch: string;
}

interface Chapter {
  key: string;
  cert: Cert;
  from: number;
  to: number;
  label: string;
}

const CHAPTERS: Chapter[] = [
  { key: "S1", cert: "SRC", from: 1, to: 23, label: "SRC I · Seefunkdienst & GMDSS (1–23)" },
  { key: "S2", cert: "SRC", from: 24, to: 52, label: "SRC II · Funkeinrichtungen & Seefunkstellen (24–52)" },
  { key: "S3", cert: "SRC", from: 53, to: 68, label: "SRC III · Digitaler Selektivruf DSC (53–68)" },
  { key: "S4", cert: "SRC", from: 69, to: 84, label: "SRC IV · UKW-Sprechfunk (69–84)" },
  { key: "S5", cert: "SRC", from: 85, to: 115, label: "SRC V · Betriebsverfahren & Rangfolgen (85–115)" },
  { key: "S6", cert: "SRC", from: 116, to: 124, label: "SRC VI · NAVTEX (116–124)" },
  { key: "S7", cert: "SRC", from: 125, to: 180, label: "SRC VII · SAR, EPIRB, SART (125–180)" },
  { key: "U1", cert: "UBI", from: 1, to: 24, label: "UBI I · Binnenschifffahrtsfunk (1–24)" },
  { key: "U2", cert: "UBI", from: 25, to: 54, label: "UBI II · Funkeinrichtungen & Schiffsfunkstellen (25–54)" },
  { key: "U3", cert: "UBI", from: 55, to: 79, label: "UBI III · Verkehrskreise (55–79)" },
  { key: "U4", cert: "UBI", from: 80, to: 108, label: "UBI IV · Sprechfunk (80–108)" },
  { key: "U5", cert: "UBI", from: 109, to: 130, label: "UBI V · Betriebsverfahren & Rangfolgen (109–130)" },
];

function chapterKey(cert: Cert, n: number): string {
  const c = CHAPTERS.find((x: Chapter) => x.cert === cert && n >= x.from && n <= x.to);
  return c ? c.key : "";
}

const ITEMS: Item[] = [
  ...S.map((r: Row): Item => ({ cert: "SRC", n: r[0], q: r[1], a: [r[2], r[3], r[4], r[5]], ch: chapterKey("SRC", r[0]) })),
  ...U.map((r: Row): Item => ({ cert: "UBI", n: r[0], q: r[1], a: [r[2], r[3], r[4], r[5]], ch: chapterKey("UBI", r[0]) })),
];

function shuffle<T>(arr: T[]): T[] {
  const b = arr.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = b[i];
    b[i] = b[j];
    b[j] = tmp;
  }
  return b;
}

function poolOf(cert: CertFilter, ch: string): number[] {
  const out: number[] = [];
  ITEMS.forEach((it: Item, i: number) => {
    if ((cert === "alle" || it.cert === cert) && (ch === "alle" || it.ch === ch)) out.push(i);
  });
  return out;
}

/* ---------- Amtliche Prüfungsbögen ---------- */
// SRC: Anlage 2a Durchführungsrichtlinie Funkbetriebszeugnisse (ELWIS), Fragebögen 1–12
const SRC_SHEETS: number[][] = [
  [1, 5, 22, 24, 40, 44, 57, 65, 69, 78, 86, 93, 101, 107, 116, 127, 135, 146, 148, 154, 156, 164, 169, 179],
  [3, 8, 14, 26, 42, 51, 53, 61, 72, 81, 92, 97, 105, 109, 118, 125, 137, 143, 151, 156, 160, 166, 174, 176],
  [2, 4, 10, 25, 34, 47, 56, 66, 76, 80, 87, 96, 100, 111, 122, 129, 133, 141, 146, 152, 157, 158, 172, 180],
  [5, 9, 15, 28, 37, 45, 54, 60, 73, 84, 98, 102, 104, 112, 121, 132, 142, 149, 150, 153, 167, 171, 173, 178],
  [7, 12, 19, 27, 33, 48, 56, 62, 69, 82, 85, 95, 103, 115, 120, 126, 136, 140, 155, 159, 168, 170, 175, 179],
  [4, 11, 21, 29, 35, 50, 58, 64, 75, 83, 88, 98, 106, 110, 117, 128, 131, 138, 145, 157, 166, 171, 177, 179],
  [5, 6, 16, 30, 36, 46, 55, 68, 74, 77, 89, 92, 94, 102, 119, 131, 134, 144, 149, 156, 163, 167, 174, 175],
  [2, 7, 17, 31, 41, 52, 59, 67, 71, 78, 90, 93, 102, 113, 123, 130, 133, 139, 146, 152, 161, 165, 173, 177],
  [1, 13, 20, 26, 32, 39, 57, 63, 79, 80, 91, 97, 108, 115, 124, 129, 136, 142, 147, 151, 153, 162, 176, 179],
  [3, 18, 23, 28, 38, 43, 60, 66, 72, 83, 85, 96, 101, 114, 118, 127, 130, 134, 143, 157, 162, 167, 174, 176],
  [4, 10, 23, 27, 43, 49, 54, 62, 70, 81, 90, 99, 106, 109, 120, 125, 140, 145, 152, 158, 164, 166, 175, 179],
  [5, 8, 21, 26, 33, 47, 59, 67, 69, 74, 88, 94, 102, 111, 121, 128, 135, 143, 150, 160, 168, 170, 173, 177],
];
// UBI: ABVT „Fragenverteilung Prüfung UKW-Sprechfunkzeugnis (UBI)“, Stand Oktober 2026, Bögen 1–12
const UBI_SHEETS: number[][] = [
  [1, 5, 7, 13, 18, 26, 28, 36, 39, 50, 55, 62, 64, 73, 80, 84, 91, 101, 109, 111, 124, 130],
  [2, 4, 5, 19, 23, 27, 34, 37, 41, 47, 60, 61, 69, 74, 81, 85, 89, 99, 110, 116, 123, 128],
  [1, 6, 16, 20, 24, 25, 29, 31, 42, 51, 59, 66, 77, 79, 82, 90, 96, 104, 112, 117, 121, 127],
  [2, 3, 8, 15, 22, 25, 32, 38, 44, 48, 57, 58, 65, 70, 87, 92, 97, 100, 114, 119, 122, 126],
  [1, 10, 14, 17, 21, 30, 35, 40, 49, 53, 56, 57, 73, 77, 83, 85, 94, 102, 109, 110, 125, 129],
  [6, 9, 11, 16, 23, 26, 33, 43, 45, 52, 58, 60, 63, 78, 82, 86, 91, 103, 113, 118, 123, 127],
  [3, 7, 12, 18, 21, 25, 36, 44, 46, 54, 55, 57, 60, 68, 81, 88, 93, 98, 111, 115, 122, 129],
  [1, 4, 13, 15, 22, 29, 35, 42, 47, 53, 55, 72, 75, 78, 80, 86, 89, 95, 109, 114, 120, 125],
  [5, 8, 11, 17, 24, 28, 31, 37, 50, 54, 63, 70, 74, 76, 82, 105, 106, 107, 109, 112, 121, 126],
  [6, 9, 12, 19, 24, 25, 33, 43, 46, 52, 59, 64, 65, 77, 83, 84, 92, 108, 110, 116, 119, 126],
  [2, 4, 20, 21, 24, 25, 32, 38, 45, 52, 57, 61, 75, 78, 81, 90, 94, 107, 113, 116, 118, 127],
  [1, 10, 14, 20, 21, 30, 34, 40, 49, 51, 58, 67, 71, 73, 87, 91, 95, 105, 117, 118, 128, 130],
];
const UBI_QUOTA: [string, number][] = [["U1", 5], ["U2", 5], ["U3", 4], ["U4", 4], ["U5", 4]];

function idxOf(cert: Cert, n: number): number {
  return ITEMS.findIndex((it: Item) => it.cert === cert && it.n === n);
}

function sheetDeck(cert: Cert, nr: number): number[] {
  const list = (cert === "SRC" ? SRC_SHEETS : UBI_SHEETS)[nr - 1];
  return list.map((n: number) => idxOf(cert, n)).filter((i: number) => i >= 0);
}

function quotaDeck(): number[] {
  const out: number[] = [];
  UBI_QUOTA.forEach((q: [string, number]) => {
    out.push(...shuffle(poolOf("UBI", q[0])).slice(0, q[1]));
  });
  return out.sort((a: number, b: number) => ITEMS[a].n - ITEMS[b].n);
}

/* ---------- Buchstabiertafel ---------- */
const NATO: Record<string, string> = {
  A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot", G: "Golf", H: "Hotel", I: "India",
  J: "Juliett", K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar", P: "Papa", Q: "Quebec", R: "Romeo",
  S: "Sierra", T: "Tango", U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu",
};
const DIGIT_EN = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const DIGIT_ITU = ["Nadazero", "Unaone", "Bissotwo", "Terrathree", "Kartefour", "Pantafive", "Soxisix", "Setteseven", "Oktoeight", "Novenine"];
const UMLAUT: Record<string, string> = { "Ä": "AE", "Ö": "OE", "Ü": "UE", "ß": "SS" };

interface SpellPart {
  ch: string;
  word: string;
}

function spellParts(input: string, ituDigits: boolean): SpellPart[] {
  const out: SpellPart[] = [];
  for (const raw of input.toUpperCase().split("")) {
    const chars = UMLAUT[raw] ? UMLAUT[raw].split("") : [raw];
    for (const c of chars) {
      if (NATO[c]) out.push({ ch: raw === c ? c : raw + " → " + c, word: NATO[c] });
      else if (c >= "0" && c <= "9") out.push({ ch: c, word: ituDigits ? DIGIT_ITU[Number(c)] : DIGIT_EN[Number(c)] });
      else if (c === " ") out.push({ ch: "␣", word: "(Leerzeichen / Wortgrenze)" });
      else if (c === "-") out.push({ ch: "-", word: "Hyphen (Bindestrich)" });
      else if (c === "." || c === ",") out.push({ ch: c, word: "Decimal (bei Zahlen)" });
      else out.push({ ch: c, word: "(kein Codewort)" });
    }
  }
  return out;
}

function spellCall(cs: string): string {
  return spellParts(cs.replace(/\s/g, ""), false)
    .map((p: SpellPart) => p.word.toUpperCase())
    .join(" ");
}

/* ---------- ATIS & MMSI ---------- */
interface AtisResult {
  code: string;
  steps: string[];
}

function atisFrom(input: string, mid: string): AtisResult | null {
  const s = input.toUpperCase().replace(/[\s-]/g, "");
  if (/^\d{9}$/.test(s)) {
    return {
      code: "9 " + s,
      steps: ["Eingabe ist eine MMSI → Ziffer 9 voranstellen (RAINWAT, Schiffe vorübergehend auf Binnenschifffahrtsstraßen)."],
    };
  }
  const m = s.match(/^([A-Z]{1,2})([A-Z])(\d{4})$/);
  if (!m) return null;
  const idx = m[2].charCodeAt(0) - 64;
  const xx = idx < 10 ? "0" + idx : String(idx);
  return {
    code: "9 " + mid + " " + xx + " " + m[3],
    steps: [
      "Z = 9 (immer)",
      "MID = " + mid + " (Land der Zuteilung)",
      "Buchstabe vor den Ziffern = " + m[2] + " → Position im Alphabet = " + xx,
      "Die 4 Ziffern des Rufzeichens = " + m[3],
    ],
  };
}

const MID_NAMES: Record<string, string> = {
  "211": "Deutschland", "218": "Deutschland", "219": "Dänemark", "220": "Dänemark", "226": "Frankreich", "227": "Frankreich",
  "228": "Frankreich", "232": "Vereinigtes Königreich", "233": "Vereinigtes Königreich", "234": "Vereinigtes Königreich",
  "235": "Vereinigtes Königreich", "244": "Niederlande", "245": "Niederlande", "246": "Niederlande", "257": "Norwegen",
  "258": "Norwegen", "259": "Norwegen", "265": "Schweden", "266": "Schweden", "203": "Österreich", "205": "Belgien",
  "261": "Polen", "269": "Schweiz",
};

function midText(mid: string): string {
  return "MID " + mid + (MID_NAMES[mid] ? " = " + MID_NAMES[mid] : "");
}

function decodeMmsi(raw: string): string | null {
  const s = raw.replace(/\s/g, "");
  if (!/^\d{9}$/.test(s)) return null;
  if (s.startsWith("00")) return "Küstenfunkstelle (00 + MID + 4 Ziffern) · " + midText(s.slice(2, 5));
  if (s.startsWith("0")) return "Gruppenrufnummer (0 + MID + 5 Ziffern) · " + midText(s.slice(1, 4));
  if (s.startsWith("111")) return "SAR-Luftfahrzeug (111 + MID + 3 Ziffern) · " + midText(s.slice(3, 6));
  if (s.startsWith("970")) return "AIS-SART (Radartransponder-Ersatz mit AIS)";
  if (s.startsWith("972")) return "MOB-Gerät (Mensch über Bord, AIS/DSC)";
  if (s.startsWith("974")) return "EPIRB mit AIS-Ortungssender";
  if (s.startsWith("98")) return "Fahrzeug eines Mutterschiffs, z. B. Beiboot (98 + MID + 4) · " + midText(s.slice(2, 5));
  if (s.startsWith("99")) return "Schifffahrtszeichen/AtoN (99 + MID + 4) · " + midText(s.slice(2, 5));
  if (/^[2-7]/.test(s)) return "Seefunkstelle / Schiff (MID + 6 Ziffern) · " + midText(s.slice(0, 3));
  return "Keine Schiffs- oder Küstenfunkstellen-MMSI";
}

/* ---------- Funkspruch-Generator ---------- */
type Rev = "see" | "binnen";
type Scen = "mayday" | "panpan" | "securite" | "relay" | "fini" | "cancel" | "routine";

interface Phrase {
  value: string;
  label: string;
  de: string;
  en: string;
}

const TYPES: Phrase[] = [
  { value: "sy", label: "Segelyacht", de: "SEGELYACHT", en: "SAILING YACHT" },
  { value: "my", label: "Motoryacht", de: "MOTORYACHT", en: "MOTOR YACHT" },
  { value: "mb", label: "Motorboot", de: "MOTORBOOT", en: "MOTOR BOAT" },
  { value: "none", label: "ohne Schiffstyp", de: "", en: "" },
];

const NATURES: Phrase[] = [
  { value: "sinking", label: "Sinken", de: "DAS SCHIFF SINKT", en: "THE SHIP IS SINKING" },
  { value: "fire", label: "Feuer / Explosion", de: "FEUER AN BORD", en: "FIRE ON BOARD" },
  { value: "flooding", label: "Wassereinbruch", de: "WASSEREINBRUCH", en: "WE ARE TAKING ON WATER" },
  { value: "collision", label: "Kollision", de: "KOLLISION", en: "COLLISION" },
  { value: "grounding", label: "Grundberührung", de: "WIR SIND AUF GRUND GELAUFEN", en: "WE ARE AGROUND" },
  { value: "capsizing", label: "Kentern", de: "WIR SIND GEKENTERT", en: "WE HAVE CAPSIZED" },
  { value: "adrift", label: "Manövrierunfähig / treibend", de: "WIR SIND MANÖVRIERUNFÄHIG UND TREIBEN", en: "WE ARE DISABLED AND ADRIFT" },
  { value: "abandon", label: "Schiff verlassen", de: "WIR VERLASSEN DAS SCHIFF", en: "WE ARE ABANDONING THE SHIP" },
  { value: "mob", label: "Mensch über Bord", de: "MENSCH ÜBER BORD", en: "MAN OVERBOARD" },
  { value: "custom", label: "Eigener Text (Zusatzfelder)", de: "", en: "" },
];

const HELPS: Phrase[] = [
  { value: "immediate", label: "Sofortige Hilfe", de: "ICH BENÖTIGE SOFORTIGE HILFE", en: "IMMEDIATE ASSISTANCE REQUIRED" },
  { value: "medevac", label: "Medizinische Evakuierung", de: "ICH BENÖTIGE MEDIZINISCHE EVAKUIERUNG", en: "I REQUIRE MEDICAL EVACUATION" },
];

const PAN_TOPICS: Phrase[] = [
  {
    value: "rudder", label: "Ruderbruch, treibend",
    de: "UNSER RUDER IST GEBROCHEN, WIR TREIBEN LANGSAM AUF DIE KÜSTE ZU, WIR BENÖTIGEN SCHLEPPHILFE",
    en: "OUR RUDDER IS BROKEN, WE ARE DRIFTING SLOWLY TOWARDS THE COAST, WE NEED TOWING ASSISTANCE",
  },
  {
    value: "engine", label: "Maschinenausfall",
    de: "MASCHINENAUSFALL, WIR SIND MANÖVRIERBEHINDERT UND BENÖTIGEN SCHLEPPHILFE",
    en: "ENGINE FAILURE, WE ARE RESTRICTED IN OUR ABILITY TO MANOEUVRE AND NEED TOWING ASSISTANCE",
  },
  {
    value: "injury", label: "Verletzte Person (nicht lebensbedrohlich)",
    de: "EINE PERSON AN BORD IST VERLETZT, NICHT LEBENSBEDROHLICH, WIR BENÖTIGEN ÄRZTLICHE BERATUNG",
    en: "ONE PERSON ON BOARD IS INJURED, NOT LIFE-THREATENING, WE NEED MEDICAL ADVICE",
  },
  {
    value: "mast", label: "Mastbruch",
    de: "MASTBRUCH, WIR SIND MANÖVRIERBEHINDERT UND BENÖTIGEN SCHLEPPHILFE",
    en: "WE ARE DISMASTED, RESTRICTED IN OUR ABILITY TO MANOEUVRE AND NEED TOWING ASSISTANCE",
  },
  { value: "custom", label: "Eigener Text (Zusatzfelder)", de: "", en: "" },
];

const SEC_TOPICS: Phrase[] = [
  {
    value: "buoy", label: "Vertriebene Tonne",
    de: "WIR HABEN EINE VERTRIEBENE TONNE BEOBACHTET, SCHIFFE IN DER NÄHE WERDEN GEBETEN, VORSICHTIG ZU NAVIGIEREN",
    en: "WE OBSERVED A DRIFTING BUOY, SHIPS IN VICINITY PLEASE NAVIGATE CAREFULLY",
  },
  {
    value: "container", label: "Treibender Container",
    de: "TREIBENDER CONTAINER, GEFAHR FÜR DIE SCHIFFFAHRT, SCHIFFE IN DER NÄHE WERDEN GEBETEN, VORSICHTIG ZU NAVIGIEREN",
    en: "DRIFTING CONTAINER, DANGEROUS TO NAVIGATION, SHIPS IN VICINITY PLEASE NAVIGATE CAREFULLY",
  },
  {
    value: "tree", label: "Treibender Baumstamm",
    de: "TREIBENDER BAUMSTAMM, GEFAHR FÜR DIE SCHIFFFAHRT, SCHIFFE IN DER NÄHE WERDEN GEBETEN, VORSICHTIG ZU NAVIGIEREN",
    en: "DRIFTING TREE TRUNK, DANGEROUS TO NAVIGATION, SHIPS IN VICINITY PLEASE NAVIGATE CAREFULLY",
  },
  { value: "custom", label: "Eigener Text (Zusatzfelder)", de: "", en: "" },
];

interface SP {
  rev: Rev;
  scen: Scen;
  name: string;
  typ: string;
  call: string;
  mmsi: string;
  latD: string;
  latM: string;
  ns: string;
  lonD: string;
  lonM: string;
  ew: string;
  ort: string;
  utc: string;
  nature: string;
  help: string;
  pan: string;
  sec: string;
  persons: string;
  extraDe: string;
  extraEn: string;
  called: string;
  dName: string;
  dCall: string;
  time: string;
  spell: boolean;
}

const SP_DEFAULT: SP = {
  rev: "see", scen: "mayday", name: "Seeadler", typ: "sy", call: "DA5005", mmsi: "211123450",
  latD: "54", latM: "25", ns: "N", lonD: "010", lonM: "12", ew: "E", ort: "", utc: "0845",
  nature: "sinking", help: "immediate", pan: "rudder", sec: "buoy", persons: "4", extraDe: "", extraEn: "",
  called: "", dName: "Möwe", dCall: "", time: "0830", spell: false,
};

interface Spruch {
  de: string[];
  en: string[] | null;
  hint: string;
}

function pick(list: Phrase[], v: string): Phrase {
  return list.find((x: Phrase) => x.value === v) || list[0];
}

function up(s: string): string {
  return s.trim().toUpperCase();
}

function buildSpruch(p: SP): Spruch {
  const typ = pick(TYPES, p.typ);
  const N = up(p.name) || "SEEADLER";
  const own1De = [typ.de, N].filter(Boolean).join(" ");
  const own1En = [typ.en, N].filter(Boolean).join(" ");
  const own3De = [typ.de, N, N, N].filter(Boolean).join(" ");
  const own3En = [typ.en, N, N, N].filter(Boolean).join(" ");
  const ownBinnen3 = [own1De, own1De, own1De].join(", ");
  const cs = p.spell ? spellCall(p.call) : up(p.call);
  const mm = p.mmsi.replace(/\s/g, "").split("").join(" ");
  const time = p.utc.trim();
  const ns = p.ns === "S";
  const ew = p.ew === "W";
  const posDe = p.ort.trim()
    ? "POSITION " + up(p.ort)
    : "POSITION " + p.latD + " GRAD " + p.latM + " MINUTEN " + (ns ? "SÜD" : "NORD") + " " + p.lonD + " GRAD " + p.lonM + " MINUTEN " + (ew ? "WEST" : "OST") + (time ? " UM " + time + " UTC" : "");
  const posEn = p.ort.trim()
    ? "POSITION " + up(p.ort)
    : "POSITION " + p.latD + " DEGREES " + p.latM + " MINUTES " + (ns ? "SOUTH" : "NORTH") + " " + p.lonD + " DEGREES " + p.lonM + " MINUTES " + (ew ? "WEST" : "EAST") + (time ? " AT " + time + " UTC" : "");
  const nat = pick(NATURES, p.nature);
  const hlp = pick(HELPS, p.help);
  const pan = pick(PAN_TOPICS, p.pan);
  const sec = pick(SEC_TOPICS, p.sec);
  const xDe = up(p.extraDe);
  const xEn = up(p.extraEn);
  const persons = p.persons.trim();
  const dN = up(p.dName) || "UNBEKANNTES FAHRZEUG";
  const dCs = p.dCall.trim() ? " " + (p.spell ? spellCall(p.dCall) : up(p.dCall)) : "";
  const relayDefault = p.rev === "see" ? "BREMEN RESCUE" : "OBERWESEL REVIERZENTRALE";
  const calledRaw = up(p.called) || (p.scen === "relay" ? relayDefault : p.scen === "routine" ? (p.rev === "see" ? "BREMEN RESCUE" : "IFFEZHEIM SCHLEUSE") : "ALL STATIONS");
  const isAll = calledRaw === "ALL STATIONS";
  const called3En = [calledRaw, calledRaw, calledRaw].join(" ");
  const called3De = isAll ? "AN ALLE FUNKSTELLEN, AN ALLE FUNKSTELLEN, AN ALLE FUNKSTELLEN" : called3En;
  const natDe = nat.value === "custom" ? xDe : nat.de;
  const natEn = nat.value === "custom" ? xEn : nat.en;
  const extraDe = nat.value === "custom" ? "" : xDe;
  const extraEn = nat.value === "custom" ? "" : xEn;
  const clean = (arr: string[]): string[] => arr.filter((x: string) => x.trim() !== "");

  if (p.rev === "see") {
    if (p.scen === "mayday") {
      return {
        de: clean(["MAYDAY MAYDAY MAYDAY", "HIER IST", own3De, "RUFZEICHEN " + cs, "MMSI " + mm, "MAYDAY", own1De + " RUFZEICHEN " + cs + " MMSI " + mm, posDe, natDe, hlp.de, persons ? persons + " PERSONEN AN BORD" : "", extraDe, "BITTE KOMMEN"]),
        en: clean(["MAYDAY MAYDAY MAYDAY", "THIS IS", own3En, "CALL SIGN " + cs, "MMSI " + mm, "MAYDAY", own1En + " CALL SIGN " + cs + " MMSI " + mm, posEn, natEn, hlp.en, persons ? persons + " PERSONS ON BOARD" : "", extraEn, "OVER"]),
        hint: "Zuerst DSC-Notalarm: Schutzkappe auf, [DISTRESS] 3 s halten (Kanal 70). Danach Notanruf und Notmeldung auf Kanal 16 mit hoher Leistung (25 W). Notverkehr findet vorzugsweise auf Kanal 16 statt (SRC 138).",
      };
    }
    if (p.scen === "panpan") {
      return {
        de: clean(["PAN PAN, PAN PAN, PAN PAN", called3De, "HIER IST", own3De, "RUFZEICHEN " + cs, "MMSI " + mm, posDe, pan.value === "custom" ? xDe : pan.de, pan.value === "custom" ? "" : xDe, "BITTE KOMMEN"]),
        en: clean(["PAN PAN, PAN PAN, PAN PAN", called3En, "THIS IS", own3En, "CALL SIGN " + cs, "MMSI " + mm, posEn, pan.value === "custom" ? xEn : pan.en, pan.value === "custom" ? "" : xEn, "OVER"]),
        hint: "Ankündigung per DSC-Anruf Kategorie „Urgency“ an alle Schiffe auf Kanal 70, dann Dringlichkeitsmeldung im Sprechfunk auf Kanal 16 (SRC 96). Erledigte Meldung an alle Funkstellen wieder aufheben (SRC 99).",
      };
    }
    if (p.scen === "securite") {
      return {
        de: clean(["SECURITE, SECURITE, SECURITE", called3De, "HIER IST", own3De, "RUFZEICHEN " + cs, "MMSI " + mm, posDe, sec.value === "custom" ? xDe : sec.de, sec.value === "custom" ? "" : xDe, "BITTE KOMMEN"]),
        en: clean(["SECURITE, SECURITE, SECURITE", called3En, "THIS IS", own3En, "CALL SIGN " + cs, "MMSI " + mm, posEn, sec.value === "custom" ? xEn : sec.en, sec.value === "custom" ? "" : xEn, "OVER"]),
        hint: "DSC-Anruf Kategorie „Safety“ an alle Schiffe auf Kanal 70. Kanal 16 dient der Ankündigung einer Sicherheitsmeldung (SRC 108); während Notverkehr auf 16 Ankündigung in einer Pause, Aussendung auf einem Schiff-Schiff-Kanal (SRC 156).",
      };
    }
    if (p.scen === "relay") {
      return {
        de: clean(["MAYDAY RELAY, MAYDAY RELAY, MAYDAY RELAY", called3De, "HIER IST", own3De, "RUFZEICHEN " + cs, "MAYDAY", dN + dCs, posDe, natDe, hlp.de, persons ? persons + " PERSONEN AN BORD" : "", extraDe, "BITTE KOMMEN"]),
        en: clean(["MAYDAY RELAY, MAYDAY RELAY, MAYDAY RELAY", called3En, "THIS IS", own3En, "CALL SIGN " + cs, "MAYDAY", dN + dCs, posEn, natEn, hlp.en, persons ? persons + " PERSONS ON BOARD" : "", extraEn, "OVER"]),
        hint: "Notalarm für ein anderes Schiff grundsätzlich an die nächstgelegene Küstenfunkstelle, sonst an alle Funkstellen richten (SRC 141). Beim Anruf an eine Landstation erst deren Antwort abwarten, dann die Meldung durchgeben. Die eigene MMSI entfällt, wenn kein DSC-Relay gesendet wurde (BAKOM-Leitfaden).",
      };
    }
    if (p.scen === "fini") {
      return {
        de: clean(["MAYDAY", called3De, "HIER IST", own3De, "RUFZEICHEN " + cs, "MMSI " + mm, time ? time + " UTC" : "", dN + dCs, "SILENCE FINI"]),
        en: clean(["MAYDAY", called3En, "THIS IS", own3En, "CALL SIGN " + cs, "MMSI " + mm, time ? time + " UTC" : "", dN + dCs, "SILENCE FINI"]),
        hint: "Nur die Funkstelle, die den Notverkehr leitet, beendet ihn. SILENCE FINI wird „SEELONCE FEENEE“ gesprochen und zeigt das Ende des Notverkehrs an (SRC 178).",
      };
    }
    if (p.scen === "cancel") {
      const ct = p.time.trim() || "…";
      return {
        de: clean(["AN ALLE FUNKSTELLEN, AN ALLE FUNKSTELLEN, AN ALLE FUNKSTELLEN", "HIER IST", own3De, "RUFZEICHEN " + cs, "MMSI " + mm, "BITTE MEINEN NOTALARM VON " + ct + " UTC AUFHEBEN", "BITTE KOMMEN"]),
        en: clean(["ALL STATIONS, ALL STATIONS, ALL STATIONS", "THIS IS", own3En, "CALL SIGN " + cs, "MMSI " + mm, "PLEASE CANCEL MY DISTRESS ALERT OF " + ct + " UTC", "OVER"]),
        hint: "Am Gerät: [CANCEL] → [CONTINUE] → [FINISH]; Kanal 16 wird automatisch gewählt. Dann Fehlalarm auf Kanal 16 an alle Funkstellen zurücknehmen (SRC 157) und Kanal 16 mindestens 5 Minuten weiter abhören (BAKOM-Leitfaden).",
      };
    }
    return {
      de: clean([calledRaw, "HIER IST", own1De, "RUFZEICHEN " + cs, xDe || "ICH HABE EINE ROUTINEMELDUNG", "BITTE KOMMEN"]),
      en: clean([calledRaw, "THIS IS", own1En, "CALL SIGN " + cs, xEn || "I HAVE A ROUTINE MESSAGE", "OVER"]),
      hint: "Eine Küstenfunkstelle mit DSC ruft man auf Kanal 70 oder dem Arbeitskanal (SRC 113), ohne DSC auf ihrem Arbeitskanal (SRC 114). Vorher hören, ob der Kanal frei ist (SRC 115).",
    };
  }

  /* Binnen nach amtlicher Sprechfunktafel (VkBl. 3/2026) */
  if (p.scen === "mayday") {
    return {
      de: clean(["MAYDAY MAYDAY MAYDAY", "THIS IS", ownBinnen3, "RUFZEICHEN " + cs, "MAYDAY", own1De + " " + cs, "POSITION " + (up(p.ort) || "RHEIN-KILOMETER 550"), natDe, hlp.de, extraDe, "BITTE KOMMEN"]),
      en: null,
      hint: "Gerät im ATIS-Modus, kein DSC. Vorzugsweise an Funkstellen des Verkehrskreises Nautische Information (z. B. Revierzentrale); bei Bedarf vorher im Verkehrskreis Schiff – Schiff (Kanal 10). Laut Sprechfunktafel besteht der Schiffsname aus Schiffstyp und Name.",
    };
  }
  if (p.scen === "panpan") {
    return {
      de: clean(["PAN PAN, PAN PAN, PAN PAN", called3En, "THIS IS", ownBinnen3, "RUFZEICHEN " + cs, "POSITION " + (up(p.ort) || "RHEIN-KILOMETER 550"), pan.value === "custom" ? xDe : pan.de, pan.value === "custom" ? "" : xDe, "BITTE KOMMEN"]),
      en: null,
      hint: "Vorzugsweise an Funkstellen des NIF, bei Bedarf vorher im Verkehrskreis Schiff – Schiff. Erledigte Dringlichkeitsmeldung mit demselben Anrufschema, Uhrzeit und Hinweis auf die Rücknahme aufheben (UBI 125).",
    };
  }
  if (p.scen === "securite") {
    return {
      de: clean(["SECURITÉ, SECURITÉ, SECURITÉ", called3En, "THIS IS", ownBinnen3, "RUFZEICHEN " + cs, "POSITION " + (up(p.ort) || "RHEIN-KILOMETER 550"), sec.value === "custom" ? xDe : sec.de, sec.value === "custom" ? "" : xDe, "ENDE"]),
      en: null,
      hint: "Treibender Baumstamm oder vertriebene Tonne = Sicherheitsmeldung (UBI 128, 129). Vorzugsweise an Funkstellen des NIF, bei Bedarf vorher Schiff – Schiff. Laut Tafel Abschluss „BITTE KOMMEN bzw. ENDE“.",
    };
  }
  if (p.scen === "relay") {
    return {
      de: clean(["MAYDAY RELAY, MAYDAY RELAY, MAYDAY RELAY", called3En, "THIS IS", ownBinnen3, "RUFZEICHEN " + cs, "POSITION " + (up(p.ort) || "RHEIN-KILOMETER 550"), dN + dCs + ": " + (natDe || "NOTFALL"), hlp.de, extraDe, "BITTE KOMMEN"]),
      en: null,
      hint: "Inhalt: Beschreibung der beobachteten Notsituation eines Dritten. Wurde eine Notmeldung empfangen, lautet die Sondermeldung: „Folgende Meldung um … Uhr erhalten:“ plus Wiedergabe der Notmeldung. Vorzugsweise an Revierzentralen bzw. NIF (UBI 109).",
    };
  }
  if (p.scen === "fini") {
    return {
      de: clean(["MAYDAY", "ALL STATIONS ALL STATIONS ALL STATIONS", "THIS IS", ownBinnen3, "RUFZEICHEN " + cs, (time || "…") + " UHR", dN + dCs, "SILENCE FINI"]),
      en: null,
      hint: "Der Notverkehr wird durch die leitende Funkstelle in dem Verkehrskreis bzw. den Verkehrskreisen beendet, in denen er eingeleitet wurde (Sprechfunktafel).",
    };
  }
  if (p.scen === "cancel") {
    return {
      de: clean(["PAN PAN, PAN PAN, PAN PAN", called3En, "THIS IS", ownBinnen3, "RUFZEICHEN " + cs, "RÜCKNAHME MEINER DRINGLICHKEITSMELDUNG VON " + (p.time.trim() || "…") + " UHR", "ENDE"]),
      en: null,
      hint: "Binnen gibt es keinen DSC-Fehlalarm (DSC ist dort nicht zulässig, UBI 102). Zurückgenommen wird eine Dringlichkeits- oder Sicherheitsmeldung nach der Sprechfunktafel.",
    };
  }
  return {
    de: clean([calledRaw, "HIER IST", own1De, "RUFZEICHEN " + cs, up(p.ort) ? "POSITION " + up(p.ort) : "", xDe || "ICH ERBITTE SCHLEUSUNG ZU BERG", "BITTE KOMMEN"]),
    en: null,
    hint: "Routinemeldung: Name der gerufenen Funkstelle (max. 3x), „Hier ist“ oder „This is“, eigener Name (max. 3x), Rufzeichen, ggf. Position, Sachverhalt, BITTE KOMMEN bzw. ENDE. Für Gespräche sozialer Art dient Kanal 10 nur als Anrufkanal, danach Wechsel auf 72 bzw. 77.",
  };
}

function spruchBox(t: Theme, title: string, lines: string[]): ReactNode {
  const box: CSSProperties = {
    borderLeft: "3px solid " + t.border.strong,
    paddingLeft: 14,
    fontFamily: t.font.mono,
    fontSize: t.font.code.fontSize,
    lineHeight: "1.65",
    color: t.text.primary,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };
  return (
    <div>
      <div style={{ fontFamily: t.font.family, fontSize: t.font.label.fontSize, color: t.text.secondary, marginBottom: 8 }}>{title}</div>
      <div style={box}>{lines.join("\n")}</div>
    </div>
  );
}

const EX_SEE: SP = { ...SP_DEFAULT };

export default function App() {
  const t = useGrokTheme();

  /* Quiz-State */
  const [cert, setCert] = useState<CertFilter>("alle");
  const [chap, setChap] = useState<string>("alle");
  const [mode, setMode] = useState<Mode>("ueben");
  const [bogen, setBogen] = useState<string>("zufall");
  const [bogenNr, setBogenNr] = useState<number>(0);
  const [deck, setDeck] = useState<number[]>(() => shuffle(poolOf("alle", "alle")));
  const [pos, setPos] = useState<number>(0);
  const [perm, setPerm] = useState<number[]>(() => shuffle([0, 1, 2, 3]));
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [right, setRight] = useState<number>(0);
  const [wrong, setWrong] = useState<number>(0);
  const [missed, setMissed] = useState<number[]>([]);
  const [sessR, setSessR] = useState<number>(0);
  const [sessW, setSessW] = useState<number>(0);

  /* Tools-State */
  const [spellIn, setSpellIn] = useState<string>("Seeadler DA5005");
  const [ituDigits, setItuDigits] = useState<boolean>(false);
  const [atisIn, setAtisIn] = useState<string>("DA5005");
  const [atisMid, setAtisMid] = useState<string>("211");
  const [mmsiIn, setMmsiIn] = useState<string>("002111240");
  const [sp, setSp] = useState<SP>(SP_DEFAULT);
  const [icomTask, setIcomTask] = useState<string>("distress");

  const spruch = useMemo(() => buildSpruch(sp), [sp]);
  const spelled = useMemo(() => spellParts(spellIn, ituDigits), [spellIn, ituDigits]);
  const atis = useMemo(() => atisFrom(atisIn, atisMid), [atisIn, atisMid]);
  const mmsiInfo = useMemo(() => decodeMmsi(mmsiIn), [mmsiIn]);

  const setField = (k: keyof SP) => (v: string) => setSp((prev: SP) => ({ ...prev, [k]: v } as SP));

  function rebuild(c: CertFilter, ch: string, m: Mode, base?: number[], bg?: string) {
    let p: number[];
    if (base) {
      p = shuffle(base.slice());
    } else if (m === "pruefung") {
      const cc: Cert = c === "UBI" ? "UBI" : "SRC";
      const b = bg ?? bogen;
      if (cc === "UBI" && b === "quote") {
        p = quotaDeck();
        setBogenNr(0);
      } else {
        const nr = b === "zufall" || b === "quote" ? 1 + Math.floor(Math.random() * 12) : Number(b);
        p = sheetDeck(cc, nr);
        setBogenNr(nr);
      }
    } else {
      p = shuffle(poolOf(c, ch));
    }
    setDeck(p);
    setPos(0);
    setPerm(shuffle([0, 1, 2, 3]));
    setPicked(null);
    setRevealed(false);
    setRight(0);
    setWrong(0);
    setMissed([]);
  }

  function changeCert(v: CertFilter) {
    let m = mode;
    if (m === "pruefung" && v === "alle") m = "ueben";
    setMode(m);
    setCert(v);
    setChap("alle");
    const bg = v !== "UBI" && bogen === "quote" ? "zufall" : bogen;
    setBogen(bg);
    rebuild(v, "alle", m, undefined, bg);
  }

  function changeMode(m: Mode) {
    let c = cert;
    let ch = chap;
    if (m === "pruefung") {
      if (c === "alle") c = "SRC";
      ch = "alle";
    }
    setMode(m);
    setCert(c);
    setChap(ch);
    rebuild(c, ch, m);
  }

  function changeChap(k: string) {
    setChap(k);
    rebuild(cert, k, mode);
  }

  const finished = pos >= deck.length;
  const qi = finished ? -1 : deck[pos];
  const item: Item | null = qi >= 0 ? ITEMS[qi] : null;
  const correctShown = perm.indexOf(0);

  function grade(isRight: boolean) {
    if (qi >= 0) {
      const it0 = ITEMS[qi];
      const k0 = it0.cert + "-" + it0.n;
      setProg((p: Record<string, number>) => ({ ...p, [k0]: isRight ? 1 : 2 }));
    }
    if (isRight) {
      setRight((r: number) => r + 1);
      setSessR((r: number) => r + 1);
    } else {
      setSessW((w: number) => w + 1);
      setWrong((w: number) => w + 1);
      setMissed((ms: number[]) => [...ms, qi]);
    }
  }

  function choose(i: number) {
    if (!item) return;
    if (mode === "ueben") {
      if (picked !== null) return;
      setPicked(i);
      grade(perm[i] === 0);
    } else if (mode === "pruefung") {
      setPicked(i);
    }
  }

  function next() {
    if (mode === "pruefung" && picked !== null) grade(perm[picked] === 0);
    setPos((x: number) => x + 1);
    setPerm(shuffle([0, 1, 2, 3]));
    setPicked(null);
    setRevealed(false);
  }

  function cardAnswer(knew: boolean) {
    grade(knew);
    next();
  }

  const answered = right + wrong;
  const rate = answered > 0 ? Math.round((right / answered) * 100) : 0;
  const passMark = cert === "UBI" ? 17 : 19;

  const answerStyle = (i: number): CSSProperties => {
    let border = t.border.default;
    let bg = "transparent";
    if (mode === "ueben" && picked !== null) {
      if (i === correctShown) {
        border = t.text.success;
        bg = t.fill.successSubtle;
      } else if (i === picked) {
        border = t.text.danger;
        bg = t.fill.dangerSubtle;
      }
    } else if (mode === "pruefung" && picked === i) {
      border = t.border.focus;
      bg = t.fill.accentSubtle;
    }
    return {
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      width: "100%",
      textAlign: "left",
      padding: "12px 14px",
      borderRadius: t.radius.md,
      border: "1px solid " + border,
      background: bg,
      color: t.text.primary,
      fontFamily: t.font.family,
      fontSize: t.font.body1.fontSize,
      lineHeight: t.font.body1.lineHeight,
      cursor: mode === "ueben" && picked !== null ? "default" : "pointer",
    };
  };

  const letterStyle: CSSProperties = {
    fontWeight: t.weight.semibold,
    color: t.text.secondary,
    minWidth: 18,
  };

  const rowStyle: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" };

  const chapterOptions = [
    { value: "alle", label: "Alle Kapitel" },
    ...CHAPTERS.filter((c: Chapter) => cert === "alle" || c.cert === cert).map((c: Chapter) => ({ value: c.key, label: c.label })),
  ];

  const missedRows = missed.map((i: number) => {
    const it = ITEMS[i];
    return [it.cert + " " + it.n, it.q, it.a[0]];
  });

  /* Icom-Aufgaben (aus der deutschen Bedienungsanleitung IC-M423/M423G/M423GE/M424/M424G) */
  const ICOM_TASKS: { value: string; label: string; steps: { title: string; detail: string }[] }[] = [
    {
      value: "power",
      label: "Einschalten, Lautstärke & Squelch",
      steps: [
        { title: "Einschalten", detail: "[VOL/SQL•PWR] 1 Sekunde drücken. Ausschalten ebenfalls 1 Sekunde." },
        { title: "Einstellfenster wählen", detail: "[VOL/SQL] drehen oder so oft drücken, bis das Lautstärke- bzw. Squelch-Fenster erscheint." },
        { title: "Squelch öffnen, Lautstärke einstellen", detail: "Zuerst Squelch öffnen (`OPEN`) und Lautstärke einstellen, dann Squelch hochdrehen, bis das Rauschen gerade verschwindet (11 Stufen: OPEN, 1 bis 10)." },
        { title: "Übernehmen", detail: "[ENT] drücken. [CLEAR] bricht ab; ohne Bedienung wird die Einstellung nach 5 s übernommen." },
      ],
    },
    {
      value: "channel",
      label: "Kanalwahl & Kanal 16",
      steps: [
        { title: "Kanal wählen", detail: "Mit [▲•CH]/[▼•CH] den Kanal wählen. Die Mikrofontasten [▲]/[▼] wählen nur TAG-Kanäle (Vorzugskanäle)." },
        { title: "Kanal 16", detail: "[16/C] kurz drücken. Mit dem Softkey [CHAN] zurück zum vorherigen Arbeitskanal." },
        { title: "Anrufkanal", detail: "[16/C] 1 Sekunde drücken; im Display erscheint `CALL`. [16/C] weitere 3 s halten, um den Anrufkanal neu zu programmieren." },
        { title: "Senden", detail: "[PTT] am Mikrofon halten, 5 bis 10 cm Abstand, kurze Pause nach dem Drücken. Loslassen zum Hören. Kanal 70 ist nur für DSC nutzbar." },
      ],
    },
    {
      value: "hilo",
      label: "Sendeleistung 25 W / 1 W",
      steps: [
        { title: "Umschalten", detail: "IC-M423: Taste [HI/LO] am Gerät. IC-M423G/GE: Sendeleistungs-Softkey im Display. Zusätzlich [H/L] bzw. [HI/LO] am Mikrofon." },
        { title: "Anzeige prüfen", detail: "`25W` = hohe, `1W` = niedrige Leistung." },
        { title: "Gesperrte Kanäle beachten", detail: "Auf einigen Kanälen ist hohe Leistung nicht wählbar (feste niedrige Leistung). Binnen: Schiff – Schiff, Schiff – Hafenbehörde und Funkverkehr an Bord automatisch 0,5–1 W." },
        { title: "Faustregel Prüfung", detail: "Not-, Dringlichkeits- und Sicherheitsmeldungen mit hoher Leistung; Gesprächspartner in Sichtweite mit niedriger Leistung." },
      ],
    },
    {
      value: "group",
      label: "Kanalgruppe INT / ATIS / DSC (Binnen ↔ See)",
      steps: [
        { title: "Menü öffnen", detail: "[MENU] drücken." },
        { title: "Radio Settings", detail: "Mit [VOL/SQL] oder [▲]/[▼] „Radio Settings“ wählen, [ENT]." },
        { title: "CHAN Group", detail: "„CHAN Group“ wählen, [ENT]. Je nach Geräteversion sind INT, ATIS und/oder DSC wählbar." },
        { title: "Gruppe wählen", detail: "Binnen: ATIS. See: DSC bzw. INT. Mit [ENT] übernehmen, [EXIT] beendet das Menü. Das Display zeigt die Gruppe (`INT`, `ATIS`, `DSC`)." },
        { title: "Voraussetzung ATIS", detail: "ATIS ist versionsabhängig und erfordert eine Händlerfreischaltung sowie einen programmierten 10-stelligen ATIS-Code." },
      ],
    },
    {
      value: "dw",
      label: "Zwei-/Dreikanalwache",
      steps: [
        { title: "Art festlegen", detail: "[MENU] → Radio Settings → Dual/Tri-Watch: Zwei- oder Dreikanalwache wählen (Werkseinstellung: Dualwatch)." },
        { title: "Arbeitskanal wählen", detail: "Gewünschten Betriebskanal einstellen." },
        { title: "Starten", detail: "Softkey [DW] drücken. Display: `DUAL 16` bzw. `TRI 16`. Kanal 16 hat Vorrang; bei Tri-Watch wird zusätzlich der Anrufkanal überwacht." },
        { title: "Beenden", detail: "[DW] erneut drücken. Senden geht während der Wache auf dem eingestellten Kanal mit [PTT]." },
        { title: "Achtung Binnen", detail: "Dual Watch hört nur zeitlich abwechselnd auf zwei Kanälen und ersetzt keine echte Hörbereitschaft auf zwei Kanälen (UBI 88)." },
      ],
    },
    {
      value: "position",
      label: "Position & UTC manuell eingeben",
      steps: [
        { title: "Menü", detail: "[MENU] → DSC Settings → Position Input. Der Punkt erscheint nur, wenn keine GPS-Daten empfangen werden." },
        { title: "Breite und Länge", detail: "Ziffern mit [VOL/SQL] oder Pfeiltasten wählen, [ENT] übernimmt; N/S und E/W an der jeweiligen Cursorposition setzen." },
        { title: "UTC", detail: "Nach [ENT] folgt die UTC-Eingabe auf dieselbe Weise." },
        { title: "Speichern", detail: "[ENT] bzw. [VOL/SQL] drücken; „DSC SETTING“ erscheint. Manuelle Daten bleiben 23,5 Stunden erhalten." },
        { title: "Modellunterschied", detail: "IC-M423G/GE haben einen eingebauten GPS-Empfänger; beim IC-M423 GPS per NMEA 0183 anschließen oder manuell eingeben." },
      ],
    },
    {
      value: "distress",
      label: "DSC-Notalarm senden (mit Notfallart)",
      steps: [
        { title: "Schnell (unbestimmter Notfall)", detail: "Schutzkappe anheben, [DISTRESS] 3 s halten: Countdown-Töne, Kanal 70 wird gewählt und der Alarm gesendet." },
        { title: "Mit Notfallart", detail: "[MENU] → DSC Calls → Distress Call; Art wählen: Undesignated, Fire/Explosion, Flooding, Collision, Grounding, Capsizing, Sinking, Adrift, Abandoning ship, Piracy, Man Overboard. Die Wahl bleibt 10 min gespeichert." },
        { title: "Position prüfen", detail: "Ohne GPS kann die manuell eingegebene Position mit [CHG] noch geändert werden." },
        { title: "Senden", detail: "[DISTRESS] 3 s halten." },
        { title: "Auf Bestätigung warten", detail: "Wiederholung automatisch alle 3,5 bis 4,5 min („Call repeat“). [RESEND] wiederholt manuell, [PAUSE]/[RESUME] stoppt bzw. setzt fort, [INFO] zeigt den Inhalt." },
        { title: "Nach Bestätigung", detail: "[ALARM OFF] drücken, auf Kanal 16 die Notmeldung im Sprechfunk durchgeben." },
      ],
    },
    {
      value: "cancel",
      label: "Fehlalarm stornieren",
      steps: [
        { title: "Stornieren", detail: "Während des Wartens auf die Bestätigung [CANCEL] drücken." },
        { title: "Bestätigen", detail: "[CONTINUE], dann [FINISH]. [BACK] bzw. [EXIT] bricht die Stornierung ab." },
        { title: "Kanal 16", detail: "Kanal 16 wird automatisch gewählt; der Alarm wird nicht mehr gesendet." },
        { title: "Sprechfunk", detail: "Auf Kanal 16 an alle Funkstellen: Fehlalarm zurücknehmen (SRC 157). Muster im Funkspruch-Trainer unter „Fehlalarm aufheben“." },
      ],
    },
    {
      value: "individual",
      label: "DSC-Einzelruf (Individual Call)",
      steps: [
        { title: "Menü", detail: "[MENU] → DSC Calls → Individual Call." },
        { title: "Adresse", detail: "Gespeicherte ID oder „Manual Input“ wählen und die 9-stellige MMSI eingeben. Küstenfunkstellen beginnen mit 00, Gruppen-IDs mit 0." },
        { title: "Arbeitskanal", detail: "Intership-Kanal für das Gespräch wählen. Bei einer Küstenfunkstelle entfällt der Schritt, sie legt den Kanal fest." },
        { title: "Senden", detail: "Eingaben prüfen, [CALL] drücken. Ist Kanal 70 belegt, wartet das Gerät." },
        { title: "Antwort", detail: "Bei „Able to comply“ [ALARM OFF]: Das Gerät wechselt auf den Arbeitskanal, dann per Mikrofon sprechen. Bei „Unable to comply“ [ALARM OFF], dann [EXIT]." },
      ],
    },
    {
      value: "allships",
      label: "Anruf an alle Schiffe (Urgency / Safety)",
      steps: [
        { title: "Menü", detail: "[MENU] → DSC Calls → All Ships Call." },
        { title: "Kategorie", detail: "Dringlichkeit (Urgency) oder Sicherheit (Safety) wählen, [ENT]." },
        { title: "Verkehrskanal", detail: "Kanal für die Sprechfunkmeldung wählen, [ENT]." },
        { title: "Senden", detail: "Anzeige prüfen, [CALL]. Danach die Meldung per Mikrofon durchgeben, abschließend [EXIT]." },
      ],
    },
    {
      value: "ids",
      label: "MMSI & ATIS-Code programmieren",
      steps: [
        { title: "MMSI", detail: "Beim ersten Einschalten (bei gedrücktem [VOL/SQL]) die 9-stellige MMSI eingeben und bestätigen. Nur einmal möglich, Änderungen nur durch Händler." },
        { title: "ATIS-Aufforderung", detail: "Danach erscheint „Push [ENT] to Register Your ATIS“; [ENT] drücken ([CLEAR] bricht ab, ATIS ist dann nicht verfügbar)." },
        { title: "10 Stellen eingeben", detail: "Ziffern mit [VOL/SQL] oder Pfeiltasten wählen, [ENT] übernimmt. Nach der 10. Stelle „FINISH“ bestätigen." },
        { title: "Bestätigen", detail: "„ATIS CONFIRMATION“: Code ein zweites Mal eingeben. Prüfen lässt er sich später im Menü (MMSI/GPS Info)." },
      ],
    },
  ];
  const icom = ICOM_TASKS.find((x: { value: string }) => x.value === icomTask) || ICOM_TASKS[0];

  const scenOptions = [
    { value: "mayday", label: "Mayday – eigene Notmeldung" },
    { value: "panpan", label: "Pan Pan – Dringlichkeit" },
    { value: "securite", label: "Sécurité – Sicherheit" },
    { value: "relay", label: "Mayday Relay – Weiterleitung" },
    { value: "fini", label: "Notverkehr beenden (Silence Fini)" },
    { value: "cancel", label: sp.rev === "see" ? "Fehlalarm aufheben" : "Dringlichkeitsmeldung zurücknehmen" },
    { value: "routine", label: "Routineanruf" },
  ];






  /* ---------- App-Shell ---------- */
  type Tab = "erklaeren" | "fragen" | "pruefung" | "funkgeraet";
  const [tab, setTab] = useState<Tab>("erklaeren");
  const [chosen, setChosen] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>("ueberblick");
  const [flt, setFlt] = useState<string>("alle");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [prog, setProg] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const [stored, setStored] = useState<boolean>(false);
  const STORE_KEY = "funkschein-trainer-v1";

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        const d = JSON.parse(raw) as { prog?: Record<string, number> };
        if (d && d.prog) setProg(d.prog);
      }
      window.localStorage.setItem(STORE_KEY + "-test", "1");
      window.localStorage.removeItem(STORE_KEY + "-test");
      setStored(true);
    } catch (e) {
      setStored(false);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded || !stored) return;
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({ prog }));
    } catch (e) {
      setStored(false);
    }
  }, [prog, loaded, stored]);
  const [funkTab, setFunkTab] = useState<string>("mayday");
  const [wissenTab, setWissenTab] = useState<string>("ablauf");
  const [icomStep, setIcomStep] = useState<number>(-1);
  const [examStart, setExamStart] = useState<number>(0);
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    if (mode === "pruefung") {
      const s = Date.now();
      setExamStart(s);
      setNow(s);
    }
  }, [deck, mode]);

  useEffect(() => {
    if (mode !== "pruefung" || finished) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [mode, finished]);

  const accent = t.dataviz.categorical[0];
  const accent2 = t.dataviz.categorical[1];
  const accent3 = t.dataviz.categorical[2];

  const TABS: { value: Tab; icon: string; label: string }[] = [
    { value: "erklaeren", icon: "✎", label: "Erklären" },
    { value: "fragen", icon: "?", label: "Prüfungsfragen" },
    { value: "pruefung", icon: "⏱", label: "Prüfung" },
  ];

  function goTab(v: Tab) {
    if (v === "fragen" && mode === "pruefung") changeMode("ueben");
    if (v === "pruefung" && mode !== "pruefung") changeMode("pruefung");
    setTab(v);
  }

  function chooseCert(c: Cert) {
    setCert(c);
    setChap("alle");
    setFlt("alle");
    setMode("ueben");
    const bg = c === "SRC" && bogen === "quote" ? "zufall" : bogen;
    setBogen(bg);
    rebuild(c, "alle", "ueben", undefined, bg);
    setSp((p: SP) => ({ ...p, rev: c === "SRC" ? "see" : "binnen" }));
    setIcomTask(c === "SRC" ? "distress" : "power");
    setIcomStep(-1);
    setFunkTab("mayday");
    setTopic("ueberblick");
    setShowAll(false);
    setTab("erklaeren");
    setPath([]);
    setPg(0);
    setChosen(true);
  }

  const certC: Cert = cert === "UBI" ? "UBI" : "SRC";
  const stateOf = (i: number): number => prog[ITEMS[i].cert + "-" + ITEMS[i].n] || 0;
  const filtered = (ch: string, f: string): number[] =>
    poolOf(certC, ch).filter((i: number) => (f === "neu" ? stateOf(i) === 0 : f === "falsch" ? stateOf(i) === 2 : true));

  function practise(ch: string, f: string, m: Mode) {
    setChap(ch);
    setFlt(f);
    setMode(m);
    rebuild(certC, ch, m, f === "alle" ? undefined : filtered(ch, f));
    setTab("fragen");
  }

  const statsOf = (c: Cert, ch: string): { total: number; done: number; ok: number } => {
    const p = poolOf(c, ch);
    let done = 0;
    let ok = 0;
    p.forEach((i: number) => {
      const s = stateOf(i);
      if (s > 0) done++;
      if (s === 1) ok++;
    });
    return { total: p.length, done, ok };
  };

  function practiseMissed() {
    const ms = missed.slice();
    setMode("ueben");
    rebuild(cert, chap, "ueben", ms);
    setTab("fragen");
    setPath(["fragen", chap]);
    setPg(0);
  }

  const fam = t.font.family;
  const txt = (style: "heading2" | "heading3" | "body1" | "body2" | "subtext" | "label", color: string, weight?: number): CSSProperties => ({
    fontFamily: fam,
    fontSize: t.font[style].fontSize,
    lineHeight: t.font[style].lineHeight,
    color,
    fontWeight: weight,
    margin: 0,
  });

  const card = (children: ReactNode, extra?: CSSProperties): ReactNode => (
    <div
      style={{
        background: t.bg.elevated,
        border: "1px solid " + t.border.subtle,
        borderRadius: t.radius.xl,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        minWidth: 0,
        ...extra,
      }}
    >
      {children}
    </div>
  );

  const grid = (children: ReactNode, min: number): ReactNode => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(" + min + "px, 100%), 1fr))", gap: 14 }}>{children}</div>
  );

  const heading = (title: string, sub?: string): ReactNode => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={txt("heading3", t.text.primary, t.weight.semibold)}>{title}</div>
      {sub ? <div style={txt("subtext", t.text.secondary)}>{sub}</div> : null}
    </div>
  );

  const bar = (value: number, max: number, color?: string): ReactNode => (
    <div style={{ height: 8, borderRadius: t.radius.full, background: t.bg.subtle, overflow: "hidden", border: "1px solid " + t.border.subtle }}>
      <div style={{ width: (max > 0 ? Math.min(100, (value / max) * 100) : 0) + "%", height: "100%", background: color || accent, borderRadius: t.radius.full, transition: "width " + t.motion.hover + " " + t.motion.easing }} />
    </div>
  );

  const chip = (key: string, label: string, active: boolean, onClick: () => void): ReactNode => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      style={{
        fontFamily: fam,
        fontSize: t.font.subtext.fontSize,
        lineHeight: t.font.subtext.lineHeight,
        padding: "6px 12px",
        borderRadius: t.radius.full,
        border: "1px solid " + (active ? accent : t.border.default),
        background: active ? t.fill.accentSubtle : "transparent",
        color: t.text.primary,
        fontWeight: active ? t.weight.semibold : t.weight.regular,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );

  const chips = (items: { value: string; label: string }[], value: string, onChange: (v: string) => void): ReactNode => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{items.map((x: { value: string; label: string }) => chip(x.value, x.label, x.value === value, () => onChange(x.value)))}</div>
  );

  const stat = (label: string, value: string, sub?: string, color?: string): ReactNode =>
    card(
      <>
        <div style={{ width: 28, height: 4, borderRadius: t.radius.full, background: color || accent }} />
        <div style={{ fontFamily: fam, fontSize: t.font.metric.fontSize, lineHeight: t.font.metric.lineHeight, fontWeight: t.weight.medium, color: t.text.primary }}>{value}</div>
        <div style={txt("subtext", t.text.secondary)}>{label}</div>
        {sub ? <div style={txt("label", t.text.tertiary)}>{sub}</div> : null}
      </>,
      { gap: 6, padding: 16 },
    );

  const stepCards = (steps: { title: string; detail: string }[], active?: number, onPick?: (i: number) => void): ReactNode => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((s: { title: string; detail: string }, i: number) => (
        <div
          key={i}
          onClick={onPick ? () => onPick(i === active ? -1 : i) : undefined}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            padding: 14,
            borderRadius: t.radius.lg,
            border: "1px solid " + (active === i ? accent : t.border.subtle),
            background: active === i ? t.fill.accentSubtle : t.bg.elevated,
            cursor: onPick ? "pointer" : "default",
          }}
        >
          <div style={{ flex: "0 0 28px", height: 28, borderRadius: t.radius.full, border: "2px solid " + accent, display: "flex", alignItems: "center", justifyContent: "center", ...txt("subtext", t.text.primary, t.weight.semibold) }}>{i + 1}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <div style={txt("body1", t.text.primary, t.weight.semibold)}>{s.title}</div>
            <div style={txt("body2", t.text.secondary)}>{s.detail}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const rowWrap: CSSProperties = { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" };
  const examLimit = cert === "UBI" ? 60 : 30;
  const elapsed = examStart > 0 ? Math.max(0, Math.floor((now - examStart) / 1000)) : 0;
  const mmss = (s: number): string => Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  const sessTotal = sessR + sessW;

  /* ---------- Fragekarte (Lernen + Prüfung) ---------- */
  const questionView = (): ReactNode => {
    if (!item) return null;
    const ch = CHAPTERS.find((c: Chapter) => c.key === item.ch);
    return card(
      <>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <Status tone={item.cert === "SRC" ? "accent" : "neutral"}>{item.cert + "-Katalog Nr. " + item.n}</Status>
            {mode !== "pruefung" ? stateBadge() : null}
            <span style={txt("label", t.text.tertiary)}>{ch ? ch.label : ""}</span>
          </div>
          <span style={txt("label", t.text.secondary)}>{"Frage " + (pos + 1) + " / " + deck.length}</span>
        </div>
        {bar(pos, deck.length)}
        <div style={{ fontFamily: fam, fontSize: t.font.heading3.fontSize, lineHeight: t.font.heading3.lineHeight, fontWeight: t.weight.semibold, color: t.text.primary }}>{item.q}</div>
        {mode !== "karte" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {perm.map((pi: number, i: number) => (
              <button key={i} type="button" style={{ ...answerStyle(i), borderRadius: t.radius.lg, alignItems: "center" }} onClick={() => choose(i)}>
                <span style={{ ...letterStyle, flex: "0 0 26px", height: 26, borderRadius: t.radius.full, border: "1px solid " + t.border.default, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{"ABCD"[i]}</span>
                <span>{item.a[pi]}</span>
              </button>
            ))}
          </div>
        ) : revealed ? (
          <div style={{ borderLeft: "4px solid " + t.text.success, background: t.fill.successSubtle, borderRadius: t.radius.md, padding: 14, ...txt("body1", t.text.primary) }}>{item.a[0]}</div>
        ) : (
          <div style={{ border: "1px dashed " + t.border.default, borderRadius: t.radius.md, padding: 18, textAlign: "center", ...txt("subtext", t.text.tertiary) }}>Erst selbst überlegen, dann die Antwort zeigen.</div>
        )}
        {mode === "ueben" && picked !== null ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", ...txt("body1", t.text.primary) }}>
            {perm[picked] === 0 ? <Status tone="success">Richtig</Status> : <Status tone="danger">Falsch</Status>}
            <span>{perm[picked] === 0 ? "Gut gemacht." : "Richtig ist " + "ABCD"[correctShown] + ": " + item.a[0]}</span>
          </div>
        ) : null}
        <div style={rowWrap}>
          {mode === "ueben" ? <Button label="Nächste Frage" variant="primary" onClick={next} disabled={picked === null} /> : null}
          {mode === "ueben" ? <Button label="Überspringen" onClick={next} disabled={picked !== null} /> : null}
          {mode === "pruefung" ? <Button label={pos + 1 === deck.length ? "Bogen abgeben" : "Weiter"} variant="primary" onClick={next} disabled={picked === null} /> : null}
          {mode === "karte" && !revealed ? <Button label="Antwort zeigen" variant="primary" onClick={() => setRevealed(true)} /> : null}
          {mode === "karte" && revealed ? <Button label="Gewusst" variant="primary" onClick={() => cardAnswer(true)} /> : null}
          {mode === "karte" && revealed ? <Button label="Nicht gewusst" onClick={() => cardAnswer(false)} /> : null}
        </div>
      </>,
      { padding: 22 },
    );
  };

  const missedList = (): ReactNode =>
    missed.length > 0 ? (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {missed.map((i: number, k: number) => {
          const it = ITEMS[i];
          return (
            <div key={k} style={{ background: t.bg.elevated, border: "1px solid " + t.border.subtle, borderLeft: "4px solid " + t.text.danger, borderRadius: t.radius.lg, padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={txt("label", t.text.tertiary)}>{it.cert + " " + it.n}</span>
              <span style={txt("body1", t.text.primary, t.weight.semibold)}>{it.q}</span>
              <span style={txt("body2", t.text.secondary)}>{"Richtig: " + it.a[0]}</span>
            </div>
          );
        })}
      </div>
    ) : null;

  const resultView = (): ReactNode => {
    const pct = deck.length ? Math.round((right / deck.length) * 100) : 0;
    const passed = right >= passMark;
    const exam = mode === "pruefung";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {card(
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
              <div style={{ fontFamily: fam, fontSize: t.font.heading1.fontSize, lineHeight: t.font.heading1.lineHeight, fontWeight: t.weight.semibold, color: t.text.primary }}>{right + " / " + deck.length}</div>
              {exam ? (passed ? <Status tone="success">Bestanden</Status> : <Status tone="danger">Nicht bestanden</Status>) : <Status tone="accent">Runde beendet</Status>}
            </div>
            {bar(right, deck.length, exam ? (passed ? t.text.success : t.text.danger) : accent)}
            <div style={txt("body2", t.text.secondary)}>
              {pct + " % richtig" + (exam ? " · bestanden ab " + passMark + " Punkten · Zeit " + mmss(elapsed) + " von " + examLimit + ":00 min" : "")}
            </div>
            <div style={rowWrap}>
              <Button label={exam ? "Neuer Bogen" : "Neue Runde"} variant="primary" onClick={() => rebuild(cert, chap, mode)} />
              {missed.length > 0 ? <Button label={"Nur Fehler wiederholen (" + missed.length + ")"} onClick={practiseMissed} /> : null}
            </div>
          </>,
          { padding: 22 },
        )}
        {missed.length > 0 ? heading("Falsch beantwortet", "Mit der richtigen Antwort aus dem amtlichen Katalog") : null}
        {missedList()}
      </div>
    );
  };

  /* ---------- Prüfungsfragen ---------- */
  const pctOf = (a: number, b: number): number => (b > 0 ? Math.round((a / b) * 100) : 0);
  const myChapters = CHAPTERS.filter((c: Chapter) => c.cert === certC);
  const shortLabel = (l: string): string => l.replace(/ \(\d+–\d+\)$/, "");
  const curMode = (): Mode => (mode === "karte" ? "karte" : "ueben");

  const ring = (pct: number, color: string, label: string, sub: string): ReactNode => {
    const r = 34;
    const c = 2 * Math.PI * r;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <svg width={84} height={84} viewBox="0 0 84 84" aria-hidden="true">
          <circle cx={42} cy={42} r={r} fill="none" stroke={t.border.subtle} strokeWidth={8} />
          <circle cx={42} cy={42} r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 42 42)" />
          <text x={42} y={48} textAnchor="middle" fill={t.text.primary} fontFamily={fam} fontSize={17} fontWeight={600}>{pct + "%"}</text>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={txt("body1", t.text.primary, t.weight.semibold)}>{label}</span>
          <span style={txt("label", t.text.secondary)}>{sub}</span>
        </div>
      </div>
    );
  };

  const stateBadge = (): ReactNode => {
    if (!item) return null;
    const s = prog[item.cert + "-" + item.n] || 0;
    return s === 1 ? <Status tone="success">zuletzt richtig</Status> : s === 2 ? <Status tone="danger">zuletzt falsch</Status> : <Status tone="neutral">neu</Status>;
  };

  const saveNote = (): string => (stored ? "Fortschritt wird in diesem Browser gespeichert." : "Hinweis: Fortschritt gilt nur, bis die Seite neu geladen wird.");


  const appIcon = (size: number): ReactNode => (
    <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label="Funkschein-Trainer: Funkturm am Wasser" style={{ flex: "0 0 auto", display: "block" }}>
      <rect width="64" height="64" rx="14" fill="#0B2F4D" />
      <g fill="none" stroke="#5FD3C6" strokeWidth="2.6" strokeLinecap="round">
        <path d="M22 14a14 14 0 0 0 0 16" />
        <path d="M42 14a14 14 0 0 1 0 16" />
        <path d="M17 10a20 20 0 0 0 0 24" opacity=".55" />
        <path d="M47 10a20 20 0 0 1 0 24" opacity=".55" />
      </g>
      <g stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M32 22L25 46M32 22L39 46" />
        <path d="M27.6 38.5h8.8M29.4 31h5.2" />
        <path d="M27.6 38.5L34.6 31M36.4 38.5L29.4 31" strokeWidth="1.6" />
      </g>
      <circle cx="32" cy="20" r="3.4" fill="#FF4B4B" />
      <rect x="20" y="45" width="24" height="4" rx="2" fill="#FFFFFF" />
      <path d="M6 52q4.5-4 9 0t9 0 9 0 9 0 9 0 9 0" fill="none" stroke="#5FD3C6" strokeWidth="2.8" strokeLinecap="round" />
      <path d="M10 58q4.5-4 9 0t9 0 9 0 9 0 9 0" fill="none" stroke="#2F8FB0" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );

  const chooser = (): ReactNode => {
    const opts: { c: Cert; sub: string; desc: string; color: string }[] = [
      { c: "UBI", sub: "UKW-Sprechfunkzeugnis Binnen", desc: "Binnenschifffahrtsfunk mit ATIS · " + U.length + " Katalogfragen · 12 amtliche Bögen à 22 Fragen", color: accent2 },
      { c: "SRC", sub: "Short Range Certificate (See)", desc: "UKW-Seefunk mit DSC und GMDSS · " + S.length + " Katalogfragen · 12 amtliche Bögen à 24 Fragen", color: accent },
    ];
    return (
      <div style={{ fontFamily: fam, color: t.text.primary, background: t.bg.base, maxWidth: 860, margin: "0 auto", padding: "28px 12px 40px", display: "flex", flexDirection: "column", gap: 22, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {appIcon(88)}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: fam, fontSize: t.font.heading2.fontSize, lineHeight: t.font.heading2.lineHeight, fontWeight: t.weight.semibold, color: t.text.primary }}>Funkschein-Trainer</span>
            <span style={txt("subtext", t.text.secondary)}>Mit Icom IC-M423 · Was möchtest du lernen und prüfen?</span>
          </div>
        </div>
        {grid(
          <>
            {opts.map((o: { c: Cert; sub: string; desc: string; color: string }) => {
              const s = statsOf(o.c, "alle");
              return (
                <button
                  key={o.c}
                  type="button"
                  onClick={() => chooseCert(o.c)}
                  style={{ textAlign: "left", cursor: "pointer", background: t.bg.elevated, border: "1px solid " + t.border.subtle, borderTop: "6px solid " + o.color, borderRadius: t.radius.xl, padding: 24, display: "flex", flexDirection: "column", gap: 10, fontFamily: fam, minHeight: 200 }}
                >
                  <span style={{ fontFamily: fam, fontSize: t.font.heading1.fontSize, lineHeight: t.font.heading1.lineHeight, fontWeight: t.weight.semibold, color: t.text.primary }}>{o.c}</span>
                  <span style={txt("body1", t.text.primary, t.weight.semibold)}>{o.sub}</span>
                  <span style={txt("body2", t.text.secondary)}>{o.desc}</span>
                  {s.done > 0 ? <span style={txt("label", t.text.secondary)}>{pctOf(s.done, s.total) + " % bearbeitet · " + pctOf(s.ok, s.total) + " % richtig"}</span> : null}
                  {s.done > 0 ? bar(s.done, s.total, o.color) : null}
                </button>
              );
            })}
          </>,
          260,
        )}
        <div style={txt("label", t.text.tertiary)}>{"Du kannst das Zeugnis jederzeit oben in der App-Leiste wechseln. " + saveNote()}</div>
      </div>
    );
  };

  /* ================= Bildschirm-App: eine Ebene pro Bildschirm, kein Scrollen ================= */
  const [path, setPath] = useState<string[]>([]);
  const [pg, setPg] = useState<number>(0);

  type Tile = { id: string; title: string; sub?: string; done?: number; ok?: number; total?: number };
  type Steps = { title: string; detail: string }[];

  const chunk = <T,>(arr: T[], n: number): T[][] => {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  };

  function enter(np: string[]) {
    setPath(np);
    setPg(0);
    setOrd([]);
    if (np[0] === "pruefung" && np.length === 2) {
      setBogen(np[1]);
      setMode("pruefung");
      setChap("alle");
      rebuild(certC, "alle", "pruefung", undefined, np[1]);
    }
    if (np[0] === "fragen" && np.length === 2) practise(np[1], flt, curMode());
    if (np[0] === "funkgeraet" && np.length === 3) {
      if (np[1] === "ablauf") {
        setProc2(np[2]);
        setPs2(0);
        setPw2("");
        setR2(np[2] === "vs" ? { ...R20, on: false } : R20);
      } else startScn(np[2]);
    }
  }
  const open = (id: string) => enter([...path, id]);
  function back() {
    if (path.length === 0) {
      setChosen(false);
      return;
    }
    enter(path.slice(0, -1));
  }

  /* ---------- Bausteine ---------- */
  const screenTitle = (title: string, sub?: string): ReactNode => (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: "0 0 auto" }}>
      <div style={txt("heading3", t.text.primary, t.weight.semibold)}>{title}</div>
      {sub ? <div style={txt("label", t.text.secondary)}>{sub}</div> : null}
    </div>
  );

  const mini = (title: string, body: ReactNode, tone?: string): ReactNode => (
    <div style={{ border: "1px solid " + t.border.subtle, borderLeft: "4px solid " + (tone || accent), borderRadius: t.radius.lg, padding: "10px 12px", display: "flex", flexDirection: "column", gap: 4, background: t.bg.elevated, minWidth: 0 }}>
      <span style={txt("body2", t.text.primary, t.weight.semibold)}>{title}</span>
      <span style={txt("body2", t.text.secondary)}>{body}</span>
    </div>
  );

  const stack = (children: ReactNode): ReactNode => <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>;

  const pageDots = (n: number): ReactNode =>
    n <= 12 ? (
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        {Array.from({ length: n }, (_: unknown, i: number) => (
          <button
            key={i}
            type="button"
            aria-label={"Seite " + (i + 1)}
            onClick={() => setPg(i)}
            style={{ width: i === pg ? 18 : 8, height: 8, borderRadius: t.radius.full, border: "none", padding: 0, cursor: "pointer", background: i === pg ? accent : t.border.default, transition: "width " + t.motion.hover + " " + t.motion.easing }}
          />
        ))}
      </div>
    ) : (
      <span style={txt("subtext", t.text.secondary)}>{pg + 1 + " / " + n}</span>
    );

  /* Seiten mit Weiter/Zurück; der Inhalt bekommt den Restplatz, nur im Notfall scrollt die Karte selbst */
  const pager = (pages: ReactNode[]): ReactNode => {
    const n = Math.max(1, pages.length);
    const p = Math.min(pg, n - 1);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: "1 1 auto", minHeight: 0 }}>
        <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>{pages[p]}</div>
        {n > 1 ? (
          <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <Button label="‹ Zurück" onClick={() => setPg(Math.max(0, p - 1))} disabled={p === 0} />
            {pageDots(n)}
            <Button label="Weiter ›" variant="primary" onClick={() => setPg(Math.min(n - 1, p + 1))} disabled={p >= n - 1} />
          </div>
        ) : null}
      </div>
    );
  };

  const tileGrid = (items: Tile[], perPage: number, min: number, onPick: (id: string) => void): ReactNode => {
    const pages = chunk(items, perPage).map((grp: Tile[], gi: number) => (
      <div key={gi} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(" + min + "px, 100%), 1fr))", gap: 10, alignContent: "start" }}>
        {grp.map((x: Tile, i: number) => (
          <button
            key={x.id}
            type="button"
            onClick={() => onPick(x.id)}
            style={{ textAlign: "left", cursor: "pointer", background: t.bg.elevated, border: "1px solid " + t.border.subtle, borderLeft: "5px solid " + [accent, accent2, accent3][(gi * perPage + i) % 3], borderRadius: t.radius.xl, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4, fontFamily: fam, minWidth: 0, boxShadow: "0 1px 2px " + t.border.subtle }}
          >
            <span style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
              <span style={txt("body1", t.text.primary, t.weight.semibold)}>{x.title}</span>
              <span aria-hidden="true" style={txt("body1", t.text.tertiary)}>›</span>
            </span>
            {x.sub ? <span style={txt("label", t.text.secondary)}>{x.sub}</span> : null}
            {x.total ? bar(x.done || 0, x.total) : null}
            {x.total && x.ok !== undefined ? bar(x.ok, x.total, t.text.success) : null}
          </button>
        ))}
      </div>
    ));
    return pager(pages);
  };

  const stepPages = (steps: Steps, per: number): ReactNode[] =>
    chunk(steps, per).map((grp: Steps, gi: number) =>
      stack(
        <>
          {grp.map((s: { title: string; detail: string }, i: number) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 14, borderRadius: t.radius.lg, border: "1px solid " + t.border.subtle, background: t.bg.elevated }}>
              <div style={{ flex: "0 0 30px", height: 30, borderRadius: t.radius.full, border: "2px solid " + accent, display: "flex", alignItems: "center", justifyContent: "center", ...txt("subtext", t.text.primary, t.weight.semibold) }}>{gi * per + i + 1}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <div style={txt("body1", t.text.primary, t.weight.semibold)}>{s.title}</div>
                <div style={txt("body2", t.text.secondary)}>{s.detail}</div>
              </div>
            </div>
          ))}
        </>,
      ),
    );

  const spruchPage = (title: string, lines: string[]): ReactNode => card(spruchBox(t, title, lines), { padding: 14 });
  const exSee = (scen: Scen, extra?: Partial<SP>): string[] => (certC === "SRC" ? buildSpruch({ ...EX_SEE, scen, ...extra }).en || [] : buildSpruch({ ...EX_SEE, rev: "binnen", scen, ...extra }).de);
  const exTitle = (): string => (certC === "SRC" ? "Beispiel See (SRC) – Englisch, wie in der Prüfung" : "Beispiel Binnen (UBI) – nach amtlicher Sprechfunktafel");

  /* ---------- Bilder & Videos ---------- */
  type Media = { kind: "Bild" | "Video"; title: string; site: string; href: string };
  const VID_ALL: Media = { kind: "Video", title: "Funkzeugnisse SRC, UBI & LRC – einfach erklärt & sicher bestehen!", site: "YouTube · SegelnAG (deutsch)", href: "https://www.youtube.com/watch?v=bF8MFbhxJYg" };
  const VID_FUNK: Media = { kind: "Video", title: "Richtig Funken Teil 2 – Mayday, Pan-Pan, Securité", site: "YouTube · YACHT tv (deutsch, Seefunk)", href: "https://www.youtube.com/watch?v=6LRCRcM8kv4" };
  const VID_DSC: Media = { kind: "Video", title: "SRC, LRC – DSC / Digitaler Selektivruf im GMDSS", site: "YouTube · Yachtschule im Netz (deutsch)", href: "https://www.youtube.com/watch?v=T07xGVO3JGY" };
  const MEDIA: Record<string, Media[]> = {
    "SRC-ablauf": [VID_ALL],
    "UBI-ablauf": [VID_ALL, { kind: "Video", title: "UKW-Funkzeugnis Binnen (UBI) – Vorbereitung & Tipps für deine Prüfung", site: "YouTube · SegelnAG (deutsch)", href: "https://www.youtube.com/watch?v=CSSJiMY-Vio" }],
    "SRC-S1": [{ kind: "Bild", title: "GMDSS-Seegebiete A1–A4 als Karte", site: "Wikimedia Commons · Delroland, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:GMDSS_Sea_Areas.jpg" }],
    "SRC-S3": [VID_DSC, { kind: "Bild", title: "UKW-Seefunkgerät mit DSC (GMDSS), rote Distress-Taste", site: "Wikimedia Commons · Fanny Schertzer, CC BY-SA 2.5", href: "https://commons.wikimedia.org/wiki/File:VHF_radio_with_Maritime_Distress_Safety_System.jpg" }],
    "SRC-S5": [VID_FUNK],
    "SRC-S7": [
      { kind: "Bild", title: "Seenotfunkbake EPIRB (406 MHz)", site: "Wikimedia Commons · Marwan Mohamad, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:EPIRB_(1).jpg" },
      { kind: "Bild", title: "Radartransponder SART an Bord einer Fähre", site: "Wikimedia Commons · Ulf Larsen, CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:SART_radar_transponder.jpg" },
    ],
    "UBI-U3": [{ kind: "Bild", title: "Revierzentrale Oberwesel (Nautischer Informationsfunk am Rhein)", site: "Wikimedia Commons · Marion Halft, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Revierzentrale_Oberwesel_Wasserstra%C3%9Fen-_und_Schifffahrtsamt_Bingen_(01).jpg" }],
    "UBI-U4": [{ kind: "Bild", title: "Schifffahrtszeichen B.11b: Gebot, Sprechfunk auf dem angegebenen Kanal zu benutzen", site: "Wikimedia Commons · Raimond Spekking, CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Schifffahrtszeichen_B.11b_Gebot_Sprechfunk_auf_dem_angegebenen_Kanal_zu_benutzen-0234.jpg" }],
    "SRC-funk": [VID_FUNK, VID_DSC],
    "UBI-funk": [VID_ALL],
    "SRC-geraet": [VID_DSC],
    "UBI-geraet": [{ kind: "Video", title: "What is ATIS and how to enable it on an ICOM marine radio? (am IC-M423G)", site: "YouTube · Icom UK (englisch)", href: "https://www.youtube.com/watch?v=M1VCoS9dXlw" }],
  };
  const mediaPages = (key: string): ReactNode[] => {
    const list = MEDIA[key];
    if (!list || list.length === 0) return [];
    return [
      stack(
        <>
          {screenTitle("Bilder & Videos", "Öffnen in einem neuen Tab: Bilder auf Wikimedia Commons, Videos auf YouTube")}
          <LinkCards links={list.map((m: Media) => ({ title: (m.kind === "Video" ? "▶ Video: " : "Bild: ") + m.title, site: m.site, href: m.href }))} />
        </>,
      ),
    ];
  };

  /* ---------- Inhalte: Funkverfahren ---------- */
  const FUNK: { id: string; title: string; steps: Steps; ex?: () => string[]; srcOnly?: boolean }[] = [
    {
      id: "mayday",
      title: "Notfall (Mayday)",
      steps: [
        { title: "Wann?", detail: "Schiff oder Person in ernster, unmittelbarer Gefahr und sofortige Hilfe nötig (SRC 135). Binnen: unmittelbare Gefährdung von Mensch oder Schiff, z. B. lebensgefährlich Verletzte, Mensch über Bord, Kentergefahr (UBI 112–115). Veranlassen darf es der Schiffsführer (SRC 131)." },
        { title: "See: DSC-Notalarm", detail: "[DISTRESS] 3 s auf Kanal 70, möglichst mit Notfallart und Position; dann Kanal 16, 25 W." },
        { title: "Notanruf", detail: "MAYDAY 3x, THIS IS, Schiffsname 3x, Rufzeichen, MMSI (See)." },
        { title: "Notmeldung", detail: "MAYDAY, Name, Rufzeichen, MMSI, Position (mit UTC), Art des Notfalls, erbetene Hilfe, Personen an Bord, weitere Angaben, OVER." },
        { title: "Binnen", detail: "Ohne DSC, im ATIS-Modus, vorzugsweise an Funkstellen des NIF (Revierzentralen), bei Bedarf vorher Schiff – Schiff (Kanal 10). Abschluss: BITTE KOMMEN." },
      ],
      ex: () => exSee("mayday"),
    },
    {
      id: "panpan",
      title: "Dringlichkeit (Pan Pan)",
      steps: [
        { title: "Wann?", detail: "Sehr dringende Meldung zur Sicherheit eines Fahrzeugs oder einer Person, ohne unmittelbare Gefahr (SRC 93). Binnen z. B. nicht lebensbedrohliche Verletzung oder Schaden ohne unmittelbare Gefahr (UBI 122–124)." },
        { title: "See", detail: "DSC-Ankündigung Urgency auf Kanal 70, Meldung im Sprechfunk auf Kanal 16 (SRC 96). An alle oder an eine bestimmte Funkstelle (SRC 98)." },
        { title: "Aufbau", detail: "PAN PAN 3x, ALL STATIONS 3x (oder Funkstelle), THIS IS, Name 3x, Rufzeichen, MMSI, Position, Sachverhalt und erbetene Hilfe, OVER." },
        { title: "Aufheben", detail: "Erledigte Meldung an alle wieder aufheben (SRC 99), binnen mit demselben Anrufschema plus Uhrzeit und Rücknahme (UBI 125)." },
      ],
      ex: () => exSee("panpan", certC === "UBI" ? { pan: "engine" } : undefined),
    },
    {
      id: "securite",
      title: "Sicherheit (Sécurité)",
      steps: [
        { title: "Wann?", detail: "Wichtige nautische Warnnachricht oder wichtige Wetterwarnung (SRC 102, UBI 127), z. B. treibender Baumstamm oder vertriebene Tonne (UBI 128, 129)." },
        { title: "See", detail: "DSC-Ankündigung Safety auf Kanal 70; Kanal 16 dient der Ankündigung (SRC 108)." },
        { title: "Aufbau", detail: "SECURITE 3x, ALL STATIONS 3x, THIS IS, Name 3x, Rufzeichen, MMSI, Position, Meldung, OVER (binnen: BITTE KOMMEN bzw. ENDE)." },
      ],
      ex: () => exSee("securite", certC === "UBI" ? { sec: "tree" } : undefined),
    },
    {
      id: "routine",
      title: "Routine",
      steps: [
        { title: "Kanal frei?", detail: "Vor jeder Aussendung prüfen, ob der Kanal frei ist; laufenden Funkverkehr nicht stören (SRC 115, UBI 96)." },
        { title: "Arbeitskanal", detail: "Den Arbeitskanal bestimmt bei See–Küste die Küstenfunkstelle (SRC 90)." },
        { title: "Binnen", detail: "Nachrichten sozialer Art auf 72 und 77, Kanal 10 dabei nur als Anrufkanal (UBI 94, Sprechfunktafel)." },
        { title: "Testsendungen", detail: "Höchstens 10 Sekunden, binnen mit Rufnamen und dem Wort „Test“ (SRC 105, UBI 4, UBI 104)." },
      ],
      ex: () => exSee("routine"),
    },
    {
      id: "fehlalarm",
      title: "Fehlalarm aufheben",
      srcOnly: true,
      steps: [
        { title: "Gerät zurücksetzen / Alarm stoppen", detail: "IC-M423: während des Wartens [CANCEL] → [CONTINUE] → [FINISH]. Kanal 16 wird automatisch eingestellt." },
        { title: "Wenn möglich per DSC zurücknehmen", detail: "Das Gerät sendet dabei die Stornierung über DSC." },
        { title: "Sprechfunk auf Kanal 16", detail: "„An alle Funkstellen“ den Fehlalarm zurücknehmen (SRC 157)." },
        { title: "Kanal 16 weiter abhören", detail: "Mindestens 5 Minuten für Rückfragen (BAKOM-Leitfaden)." },
        { title: "Dokumentieren", detail: "Not-, Dringlichkeits- und Sicherheitsverkehr sowie wichtige Vorkommnisse gehören ins Schiffstagebuch (SRC 86)." },
      ],
      ex: () => buildSpruch({ ...EX_SEE, scen: "cancel" }).en || [],
    },
  ];
  const NOTV: string[][] = [
    ["SILENCE MAYDAY (gesprochen „SEELONCE MAYDAY“)", "Die Funkstelle, die den Notverkehr leitet (binnen: die Funkstelle in Not), gebietet störenden Funkstellen Funkstille", "SRC 145, 146 · UBI 120"],
    ["SILENCE FINI (gesprochen „SEELONCE FEENEE“)", "Der Notverkehr ist beendet", "SRC 178 · UBI 119"],
    ["MAYDAY RELAY", "Aussendung einer Notmeldung durch eine Funkstelle, die selbst nicht in Not ist", "SRC 141 · UBI 118"],
    ["RECEIVED MAYDAY", "Bestätigung einer Notmeldung, nur wenn man Hilfe leisten kann", "SRC 142 · Sprechfunktafel"],
    ["Bestätigungszeitpunkt (See)", "Nach Bestätigung durch eine Küstenfunkstelle oder nach angemessener Wartefrist, auf Kanal 16 im Sprechfunk", "SRC 143, 144"],
    ["Wer bestätigt (Binnen)?", "Im NIF die zuständige Schleuse oder Revierzentrale, im Verkehrskreis Schiff – Schiff eine Schiffsfunkstelle in der Nähe", "UBI 116, 117"],
  ];
  const PHRASES: string[][] = [
    ["THIS IS", "Hier ist (vor dem eigenen Namen)"],
    ["ALL STATIONS", "An alle Funkstellen"],
    ["OVER", "Bitte kommen, Antwort erwartet"],
    ["OUT", "Ende, keine Antwort erwartet"],
    ["RECEIVED", "Empfangen"],
    ["SAY AGAIN", "Bitte wiederholen"],
    ["I SAY AGAIN", "Ich wiederhole"],
    ["I SPELL", "Ich buchstabiere (folgt Buchstabiertafel)"],
    ["CORRECTION", "Berichtigung"],
    ["STATION CALLING", "Unbekannte rufende Funkstelle"],
  ];

  const funkPages = (id: string): ReactNode[] => {
    if (id === "notverkehr") {
      return [
        ...chunk(NOTV, 2).map((g: string[][]) => stack(<>{g.map((r: string[]) => <div key={r[0]}>{mini(r[0], r[1] + " (" + r[2] + ")", accent2)}</div>)}</>)),
        ...chunk(PHRASES, 5).map((g: string[][]) => stack(<>{g.map((r: string[]) => <div key={r[0]}>{mini(r[0], r[1], accent3)}</div>)}</>)),
        spruchPage(certC === "SRC" ? "Mayday Relay – See, Englisch" : "Mayday Relay – Binnen", exSee("relay")),
        spruchPage(certC === "SRC" ? "Notverkehr beenden – See, Englisch" : "Notverkehr beenden – Binnen", exSee("fini")),
      ];
    }
    const f = FUNK.find((x: { id: string }) => x.id === id);
    if (!f) return [];
    const pages = stepPages(f.steps, 2);
    if (f.ex) pages.push(spruchPage(id === "fehlalarm" ? "Fehlalarm aufheben – Englisch" : exTitle(), f.ex()));
    if (id === "mayday") pages.push(...mediaPages(certC + "-funk"));
    return pages;
  };

  /* ---------- Inhalte: Funkspruch-Trainer (Eingaben auf Seiten verteilt) ---------- */
  const trainerPages = (): ReactNode[] => {
    const p1 = stack(
      <>
        {screenTitle("1 · Situation", "Danach Schritt für Schritt Angaben machen; der Funkspruch entsteht sofort")}
        <div style={rowWrap}>
          <Segmented<Rev>
            options={[
              { value: "see", label: "See (SRC)" },
              { value: "binnen", label: "Binnen (UBI)" },
            ]}
            value={sp.rev}
            onChange={(v: Rev) => setSp((prev: SP) => ({ ...prev, rev: v }))}
          />
          <Toggle label="Rufzeichen buchstabieren" value={sp.spell} onChange={(v: boolean) => setSp((prev: SP) => ({ ...prev, spell: v }))} />
        </div>
        {chips(
          [
            { value: "mayday", label: "Mayday" },
            { value: "panpan", label: "Pan Pan" },
            { value: "securite", label: "Sécurité" },
            { value: "relay", label: "Mayday Relay" },
            { value: "fini", label: "Silence Fini" },
            { value: "cancel", label: sp.rev === "see" ? "Fehlalarm aufheben" : "Dringlichkeit zurücknehmen" },
            { value: "routine", label: "Routineanruf" },
          ],
          sp.scen,
          (v: string) => setSp((prev: SP) => ({ ...prev, scen: v as Scen })),
        )}
      </>,
    );
    const p2 = stack(
      <>
        {screenTitle("2 · Schiff")}
        <div style={rowWrap}>
          <Select label="Schiffstyp" options={TYPES.map((x: Phrase) => ({ value: x.value, label: x.label }))} value={sp.typ} onChange={setField("typ")} />
          <Input label="Schiffsname" value={sp.name} onChange={setField("name")} />
          <Input label="Rufzeichen" value={sp.call} onChange={setField("call")} />
          {sp.rev === "see" ? <Input label="MMSI" value={sp.mmsi} onChange={setField("mmsi")} /> : null}
          {sp.scen === "relay" || sp.scen === "routine" || sp.scen === "panpan" || sp.scen === "securite" || sp.scen === "cancel" ? (
            <Input label="Gerufene Funkstelle" value={sp.called} placeholder={sp.scen === "relay" ? (sp.rev === "see" ? "BREMEN RESCUE" : "OBERWESEL REVIERZENTRALE") : sp.scen === "routine" ? (sp.rev === "see" ? "BREMEN RESCUE" : "IFFEZHEIM SCHLEUSE") : "ALL STATIONS"} onChange={setField("called")} />
          ) : null}
        </div>
      </>,
    );
    const p3 = stack(
      <>
        {screenTitle("3 · Position und Zeit")}
        {sp.scen !== "fini" && sp.scen !== "cancel" ? (
          <div style={rowWrap}>
            {sp.rev === "see" ? <Input label="Breite °" value={sp.latD} onChange={setField("latD")} /> : null}
            {sp.rev === "see" ? <Input label="Breite '" value={sp.latM} onChange={setField("latM")} /> : null}
            {sp.rev === "see" ? <Select label="N/S" options={[{ value: "N", label: "Nord" }, { value: "S", label: "Süd" }]} value={sp.ns} onChange={setField("ns")} /> : null}
            {sp.rev === "see" ? <Input label="Länge °" value={sp.lonD} onChange={setField("lonD")} /> : null}
            {sp.rev === "see" ? <Input label="Länge '" value={sp.lonM} onChange={setField("lonM")} /> : null}
            {sp.rev === "see" ? <Select label="E/W" options={[{ value: "E", label: "Ost" }, { value: "W", label: "West" }]} value={sp.ew} onChange={setField("ew")} /> : null}
            {sp.rev === "see" ? <Input label="Zeit UTC" value={sp.utc} onChange={setField("utc")} /> : null}
            <Input label={sp.rev === "see" ? "Ortsangabe (ersetzt Koordinaten)" : "Ortsangabe"} value={sp.ort} placeholder={sp.rev === "see" ? "z. B. 3 sm nördlich Fehmarn" : "RHEIN-KILOMETER 550"} onChange={setField("ort")} />
          </div>
        ) : (
          <div style={rowWrap}>
            <Input label={sp.scen === "cancel" ? "Uhrzeit des Alarms / der Meldung" : "Aktuelle Uhrzeit"} value={sp.scen === "cancel" ? sp.time : sp.utc} onChange={setField(sp.scen === "cancel" ? "time" : "utc")} />
          </div>
        )}
      </>,
    );
    const p4 = stack(
      <>
        {screenTitle("4 · Inhalt der Meldung")}
        <div style={rowWrap}>
          {sp.scen === "mayday" || sp.scen === "relay" ? <Select label="Art des Notfalls" options={NATURES.map((x: Phrase) => ({ value: x.value, label: x.label }))} value={sp.nature} onChange={setField("nature")} /> : null}
          {sp.scen === "mayday" || sp.scen === "relay" ? <Select label="Erbetene Hilfe" options={HELPS.map((x: Phrase) => ({ value: x.value, label: x.label }))} value={sp.help} onChange={setField("help")} /> : null}
          {(sp.scen === "mayday" || sp.scen === "relay") && sp.rev === "see" ? <Input label="Personen an Bord" value={sp.persons} onChange={setField("persons")} /> : null}
          {sp.scen === "panpan" ? <Select label="Dringlichkeitsfall" options={PAN_TOPICS.map((x: Phrase) => ({ value: x.value, label: x.label }))} value={sp.pan} onChange={setField("pan")} /> : null}
          {sp.scen === "securite" ? <Select label="Sicherheitsmeldung" options={SEC_TOPICS.map((x: Phrase) => ({ value: x.value, label: x.label }))} value={sp.sec} onChange={setField("sec")} /> : null}
          {sp.scen === "relay" || sp.scen === "fini" ? <Input label="Schiff in Not: Name" value={sp.dName} onChange={setField("dName")} /> : null}
          {sp.scen === "relay" || sp.scen === "fini" ? <Input label="Schiff in Not: Rufzeichen" value={sp.dCall} onChange={setField("dCall")} /> : null}
          <Input label="Zusatz (Deutsch)" value={sp.extraDe} placeholder="z. B. 12 m blauer Rumpf" onChange={setField("extraDe")} />
          {sp.rev === "see" ? <Input label="Zusatz (Englisch)" value={sp.extraEn} placeholder="e.g. 12 m dark blue hull" onChange={setField("extraEn")} /> : null}
        </div>
      </>,
    );
    const pages: ReactNode[] = [p1, p2, p3, p4, spruchPage("Ergebnis Deutsch", spruch.de)];
    if (spruch.en) pages.push(stack(<>{spruchPage("Ergebnis Englisch (Prüfungssprache SRC)", spruch.en)}<Callout tone="info" lead="Ablauf:">{spruch.hint}</Callout></>));
    else pages.push(spruchPage("Hinweis", [spruch.hint]));
    return pages;
  };

  /* ---------- Inhalte: Gerät ---------- */
  const KEYS: { id: string; label: string; desc: string; tokens: string[] }[] = [
    { id: "distress", label: "[DISTRESS]", desc: "Unter Schutzkappe; 3 s halten: DSC-Notalarm auf Kanal 70", tokens: ["[DISTRESS]"] },
    { id: "16c", label: "[16/C]", desc: "Kurz: Kanal 16 · 1 s: Anrufkanal (CALL) · bei Anrufkanal 3 s: Anrufkanal programmieren", tokens: ["[16/C]"] },
    { id: "ch", label: "[▲•CH] / [▼•CH]", desc: "Kanal, Menüpunkte und Einstellungen wählen; TAG-Kanäle prüfen, Suchlaufrichtung", tokens: ["[▲•CH]", "[▼•CH]", "[▲]", "[▼]"] },
    { id: "vol", label: "[VOL/SQL•PWR]", desc: "1 s: Ein/Aus · drücken: Lautstärke → Squelch → … · drehen: einstellen", tokens: ["[VOL/SQL"] },
    { id: "ent", label: "[ENT]", desc: "Übernehmen", tokens: ["[ENT]"] },
    { id: "clear", label: "[CLEAR]", desc: "Eingabe abbrechen", tokens: ["[CLEAR]"] },
    { id: "menu", label: "[MENU]", desc: "Menü-Modus", tokens: ["[MENU]"] },
    { id: "lr", label: "[◄] / [►]", desc: "Softkey-Funktionen durchblättern, Zeichen bei Eingaben wählen", tokens: ["[◄]", "[►]"] },
    { id: "soft", label: "Softkeys im Display", desc: "Suchlauf, Zwei-/Dreikanalwache [DW], Sendeleistung, Kanalname, TAG, Nebelhorn, Megafon, Intercom, AquaQuake", tokens: ["Softkey", "[DW]", "[CANCEL]", "[CONTINUE]", "[FINISH]", "[EXIT]", "[ALARM OFF]", "[CALL]", "[RESUME]", "[RESEND]", "[PAUSE]", "[INFO]", "[CHG]", "[CHAN]", "[BACK]"] },
    { id: "hilo", label: "[HI/LO]", desc: "Nur IC-M423 aufgedruckt: Sendeleistung 25 W / 1 W; bei G/GE per Softkey bzw. [H/L] am Mikrofon", tokens: ["[HI/LO]", "[H/L]"] },
    { id: "mic", label: "Mikrofon", desc: "[PTT] senden · [▲]/[▼] nur TAG-Kanäle · [16/C] (nur G/GE) · [H/L] bzw. [HI/LO]", tokens: ["[PTT]", "Mikrofon"] },
  ];
  const keyChip = (k: { id: string; label: string; desc: string }): ReactNode => (
    <div key={k.id} style={{ borderRadius: t.radius.md, padding: "6px 10px", border: "2px solid " + accent, background: t.fill.accentSubtle, display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontFamily: t.font.mono, fontSize: t.font.code.fontSize, fontWeight: t.weight.semibold, color: k.id === "distress" ? t.text.danger : t.text.primary }}>{k.label}</span>
      <span style={txt("label", t.text.secondary)}>{k.desc}</span>
    </div>
  );
  const myTasks = ICOM_TASKS.filter((x: { value: string }) => certC === "SRC" || ["power", "channel", "hilo", "group", "dw"].indexOf(x.value) >= 0);

  const geraetPages = (id: string): ReactNode[] => {
    if (id === "modell") {
      return [
        <Callout key="m" lead="Welches Modell?">
          Icom baut IC-M423, IC-M423G und IC-M423GE mit gemeinsamer deutscher Anleitung. Das G steht für den eingebauten GPS-Empfänger (GE: plus mitgelieferte GPS-Antenne), nicht für „German“. ATIS ist je nach Geräteversion verfügbar und muss vom Händler freigeschaltet sein. Die Bedienschritte gelten für alle drei.
        </Callout>,
        ...chunk(KEYS, 4).map((g: { id: string; label: string; desc: string; tokens: string[] }[]) => stack(<>{screenTitle("Tasten nach der Bedienungsanleitung")}{g.map((k: { id: string; label: string; desc: string }) => keyChip(k))}</>)),
        stack(
          <>
            {screenTitle("Praxis-Tipps")}
            <BulletList
              items={[
                "Kanalgruppe prüfen: binnen ATIS, auf See DSC/INT. In der UBI-Prüfung muss das Gerät im ATIS-Modus sein.",
                "Squelch bei jedem Kanalwechsel kurz öffnen: so hörst du laufenden Verkehr (UBI 96).",
                "Kanal 10 binnen: Leistung wird automatisch reduziert, lange Aussendungen vermeiden (UBI 89, 98).",
                "MMSI und ATIS-Code lassen sich nur einmal eingeben; Änderungen macht nur der Händler.",
              ]}
            />
          </>,
        ),
        ...mediaPages(certC + "-geraet"),
      ];
    }
    const task = ICOM_TASKS.find((x: { value: string }) => x.value === id);
    if (!task) return [];
    return task.steps.map((s: { title: string; detail: string }, i: number) => {
      const src = s.title + " " + s.detail;
      const used = KEYS.filter((k: { tokens: string[] }) => k.tokens.some((tok: string) => src.indexOf(tok) >= 0));
      return stack(
        <>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: 16, borderRadius: t.radius.lg, border: "1px solid " + t.border.subtle, background: t.bg.elevated }}>
            <div style={{ flex: "0 0 34px", height: 34, borderRadius: t.radius.full, border: "2px solid " + accent, display: "flex", alignItems: "center", justifyContent: "center", ...txt("body1", t.text.primary, t.weight.semibold) }}>{i + 1}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
              <div style={txt("body1", t.text.primary, t.weight.semibold)}>{s.title}</div>
              <div style={txt("body2", t.text.secondary)}>{s.detail}</div>
            </div>
          </div>
          {used.length > 0 ? <span style={txt("label", t.text.secondary)}>Tasten in diesem Schritt</span> : null}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: 8 }}>{used.map((k: { id: string; label: string; desc: string }) => keyChip(k))}</div>
        </>,
      );
    });
  };

  /* ---------- Inhalte: Wissen ---------- */
  const pickCol = (srcIdx: number, rows: string[][]): string[][] => rows.map((r: string[]) => [r[0], certC === "SRC" ? r[srcIdx] : r[3 - srcIdx]]).filter((r: string[]) => r[1] !== "–");
  const ABLAUF: string[][] = [
    ["Berechtigt zu", "Binnenschifffahrtsfunk auf Binnen- und Seeschifffahrtsstraßen binnenwärts der Seegrenze, mit ATIS", "UKW-Seefunk inkl. GMDSS/DSC auf nicht ausrüstungspflichtigen Fahrzeugen (SRC 26)"],
    ["Fragenkatalog", "130 Fragen, neuer Gesamtkatalog gültig ab 1. Oktober 2026 (VkBl. 3/2026)", "180 Fragen, Stand 1. Oktober 2018 (unverändert gültig)"],
    ["Theorie", "22 Fragen, 60 min, bestanden ab 17 Punkten", "24 Fragen, 30 min, bestanden ab 19 Punkten"],
    ["Sprachteil", "Textaufnahme und Textabgabe auf Deutsch mit Buchstabiertafel", "Englisch: Diktat einer Not-, Dringlichkeits- oder Sicherheitsmeldung mit Übersetzung ins Deutsche und ein deutscher Text ins Englische (je 15 min, 27 amtliche Seefunktexte)"],
    ["Praxis", "Bedienung mit Fallbeispielen: Kanal, Leistung, Squelch, Not-, Dringlichkeits-, Sicherheits- und Routineverkehr, Gerät im ATIS-Modus", "Pflichtaufgaben am DSC-Gerät, z. B. Notalarm editieren und senden, Notmeldung, Notverkehr beenden, Dringlichkeit/Sicherheit; bis 20 min, zwei Prüfer"],
    ["Mit SRC/LRC", "Ergänzungsprüfung: 10 Fragen, 30 min, ab 8 Punkten, Praxis bleibt", "–"],
    ["Prüfung durch", "Prüfungsausschüsse von DMYV und DSV, zuständige Stelle ABVT Koblenz", "Prüfungsausschüsse von DMYV und DSV"],
  ];
  const CHANNELS: string[][] = [
    ["16", "Not-, Dringlichkeitsverkehr, Ankündigung Sicherheit, Anrufkanal; Hörwache für Sportboote mit reiner Sprechfunkanlage (SRC 108, 110, 138)", "Darf auf Bundeswasserstraßen der Zonen 3 und 4 nicht benutzt werden (UBI 92)"],
    ["70", "Ausschließlich DSC; Hörwache für GMDSS-Anlagen (SRC 58, 107, 109, 132)", "DSC im Binnenschifffahrtsfunk nicht zulässig (UBI 102)"],
    ["10", "–", "Schiff – Schiff; in Deutschland während der Fahrt ständig empfangsbereit; automatisch max. 1 W (UBI 89–91)"],
    ["06", "Schiff – Schiff und koordinierte SAR-Einsätze; mit SAR-Hubschraubern neben 16 (SRC 111, 153)", "–"],
    ["69, 72", "Sportfahrzeuge untereinander in deutschen Hoheitsgewässern (SRC 103)", "72 und 77: Nachrichten sozialer Art, Anruf vorher auf 10 (UBI 94)"],
    ["06, 08, 72, 77", "International ausschließlich Schiff – Schiff (SRC 75)", "–"],
    ["15, 17", "–", "Funkverkehr an Bord (UBI 75), nicht für Kleinfahrzeuge (UBI 77)"],
    ["75, 76", "Nur für Navigation (SRC 76)", "–"],
    ["18", "–", "Blaues Tafelzeichen „UKW 18“: Hinweis auf Nautischen Informationsfunk (UBI 108)"],
    ["20", "–", "Weißes Tafelzeichen mit rotem Rand „UKW 20“: Gebot, Kanal 20 zu benutzen (UBI 107)"],
    ["NIF / Hafen", "–", "Kanäle je Strecke im Regionalen Teil des Handbuchs Binnenschifffahrtsfunk (UBI 83); Schleusen-Kanal am Tafelzeichen (UBI 106)"],
  ];
  const POWER_SEE: string[][] = [
    ["Schaltbar", "1 W oder 25 W (SRC 37); Display 1W / 25W"],
    ["Reichweite", "Hängt vor allem von der Antennenhöhe ab (SRC 80); Antenne vertikal (SRC 81)"],
    ["Frequenzbereich", "UKW 30–300 MHz (SRC 69), Kanäle 1–28 und 60–88 (SRC 79)"],
  ];
  const POWER_BINNEN: string[][] = [
    ["Schaltbar", "1 W oder 25 W (UBI 47)"],
    ["Automatisch 0,5–1 W", "Schiff – Schiff, Schiff – Hafenbehörde, Funkverkehr an Bord (RAINWAT Anhang 3)"],
    ["25 W", "Nur im Verkehrskreis Nautische Information (UBI 57)"],
    ["Frequenzbereich", "156,025–162,025 MHz (UBI 52)"],
  ];
  const KREISE: string[][] = [
    ["Schiff – Schiff", "Funkverkehr zwischen Schiffsfunkstellen: Schutz von Personen, Fahrt, Sicherheit (UBI 59, 60). Beispiel: Segelyacht Robbe DA 5005 (UBI 62)"],
    ["Nautische Information", "Zustand der Wasserstraßen, Verkehrsberatung und -lenkung; Anweisungen sind zu befolgen (UBI 63, 64, 99). Beispiele: Revierzentralen Duisburg, Oberwesel, Minden, Magdeburg, Gösselthal (UBI 71); Iffezheim Schleuse (UBI 67); Lübeck Hubbrücken (UBI 70)"],
    ["Schiff – Hafenbehörde", "Zuweisung von Liegeplätzen, Fahrt in den Häfen (UBI 68, 69). Beispiele: Marina Düsseldorf Port (UBI 72), Duisburg Hafen"],
    ["Funkverkehr an Bord", "Schiffsbetrieb, Leinen und Ankern; auch geschleppte oder geschobene Verbände (UBI 73, 74). Kanäle 15 und 17 (UBI 75)"],
  ];
  const IDS: string[][] = [
    ["MMSI Seefunkstelle", "9 Ziffern, die ersten drei sind die MID (Landeskennung) · 211……… (SRC 64); Deutschland: MID 211 und 218 (SRC 62)"],
    ["MMSI Küstenfunkstelle", "00 + MID + 4 Ziffern · 002111240 = deutsche Küstenfunkstelle (SRC 65, 66)"],
    ["MMSI Gruppe", "0 + MID + 5 Ziffern · Icom: Gruppen-IDs beginnen mit 0"],
    ["SAR-Luftfahrzeug", "111 + MID + 3 Ziffern · ITU-R M.585"],
    ["AIS-SART / MOB / EPIRB-AIS", "970… / 972… / 974… · ITU-R M.585"],
    ["ATIS-Code", "10 Ziffern: 9 + MID + 6 Ziffern, wird automatisch nach dem Loslassen der Sprechtaste gesendet · UBI 41, 42; aus dem Code lässt sich das Rufzeichen ableiten (UBI 44)"],
    ["Rufzeichen binnen", "Zwei Buchstaben der deutschen Reihe + vier Ziffern · DA 5005 (UBI 37, 38)"],
  ];
  const LINKS: { title: string; site: string; href: string }[] = [
    { title: "Fragenkatalog SRC (Leseversion, Stand 10/2018)", site: "ELWIS", href: "https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Fragenkatalog-SRC-2018.pdf?__blob=publicationFile&v=4" },
    { title: "Gesamtfragenkatalog UBI und Sprechfunktafel ab 1.10.2026 (VkBl. 3/2026)", site: "src-lrc-ubi.de", href: "https://src-lrc-ubi.de/wp-content/uploads/Veroeffentlichung-Verkehrsblatt-UBI-Fragenkatalog-ab-1.-Oktober-2026.pdf" },
    { title: "Anlage 2a: Zusammenstellung der Fragen für die Fragebögen der SRC-Prüfung", site: "ELWIS", href: "https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Durchfuehrungsrichtlinien-Funkbetriebszeugnisse/Anlage-02a.pdf?__blob=publicationFile&v=4" },
    { title: "Fragenverteilung Prüfung UKW-Sprechfunkzeugnis (UBI), Stand Oktober 2026", site: "ABVT", href: "https://www.abvt.wsv.de/Webs/WSA/ABVT/DE/SharedDocs/Downloads/UBI_Frageverteilung_2026-10.pdf?__blob=publicationFile&v=5" },
    { title: "UBI-Änderungen: neue Fragenkataloge und Fragenverteilung", site: "ABVT", href: "https://www.abvt.wsv.de/Webs/WSA/ABVT/DE/SharedDocs/Kurzmeldungen/2026-09-22_UBI-Aenderungen_Fragenkataloge.html" },
    { title: "Sprechfunkzeugnisse: SRC, UBI, Funktexte", site: "ELWIS", href: "https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Sprechfunkzeugnisse-node" },
    { title: "Durchführungsrichtlinie Funkbetriebszeugnisse", site: "ELWIS", href: "https://www.elwis.de/DE/Schifffahrtsrecht/Sprechfunkzeugnisse/Durchfuehrungsrichtlinien-Funkbetriebszeugnisse/Durchfuehrungsrichtlinie.pdf?__blob=publicationFile&v=3" },
    { title: "UBI: Prüfungsablauf und Bestehensgrenzen", site: "ABVT", href: "https://www.abvt.wsv.de/Webs/WSA/ABVT/DE/UKW-Sprechfunkzeugnisse/UBI_node.html" },
    { title: "Binnenschifffahrtsfunk: Prüfung und Geräte", site: "PZ Bremen/Hamburg", href: "https://www.pa-bremen.de/scheine/funk/binnenschifffahrtsfunk.html" },
    { title: "Bedienungsanleitung IC-M423/M423G/M423GE/M424/M424G (deutsch)", site: "SVB / Icom", href: "https://media1.svb-media.de/media/snr/527139/pdf/manual_2025-11-13_10-05_de_440126588011c1fb936b890be1b15e0e.pdf" },
    { title: "IC-M423G/IC-M423GE/IC-M424G Instruction manual", site: "Icom America", href: "https://www.icomamerica.com/support/manual/4559/" },
    { title: "RAINWAT – Regionale Vereinbarung Binnenschifffahrtsfunk (2023)", site: "Donaukommission", href: "https://www.danubecommission.org/uploads/doc/2023/Rainwat_2023/de_rainwat.pdf" },
    { title: "Not-, Dringlichkeits- und Sicherheitsverfahren im Seefunkdienst", site: "BAKOM", href: "https://www.bakom.admin.ch/dam/de/sd-web/2E3wkUa9Ydfv/not-_dringlichkeits-undsicherheitsverfahren.pdf" },
    { title: "UBI-Änderung zum 01.10.2026", site: "Delius Klasing", href: "https://support.delius-klasing.de/446347-UBI-%C3%84nderung-zum-01102026-Neuer-Fragenkatalog-Sprechverfahren-und-Pr%C3%BCfungsb%C3%B6gen" },
    { title: "ITU-R M.585: Zuteilung von MMSI", site: "ITU", href: "https://www.itu.int/rec/R-REC-M.585/en" },
  ];

  const rowsPages = (rows: string[][], per: number, tone: string, title?: string): ReactNode[] =>
    chunk(rows, per).map((g: string[][]) => stack(<>{title ? screenTitle(title) : null}{g.map((r: string[]) => <div key={r[0]}>{mini(r[0], r[1], tone)}</div>)}</>));

  const letterGrid = (letters: string[]): ReactNode => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 6 }}>
      {letters.map((a: string) => (
        <div key={a} style={{ border: "1px solid " + t.border.subtle, borderRadius: t.radius.md, padding: "6px 8px", display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ fontFamily: t.font.mono, fontWeight: t.weight.semibold, color: t.text.primary }}>{a}</span>
          <span style={txt("body2", t.text.secondary)}>{NATO[a]}</span>
        </div>
      ))}
    </div>
  );

  const wissenPages = (id: string): ReactNode[] => {
    if (id === "ablauf") {
      return [
        ...rowsPages(pickCol(2, ABLAUF), 3, accent2, certC === "SRC" ? "Prüfung SRC (See)" : "Prüfung UBI (Binnen)"),
        stack(
          <>
            <Callout tone="info" lead="Neu seit 1. Oktober 2026:">
              Für das UBI gilt ein neuer Gesamtfragenkatalog mit neuer Sprechfunktafel; das Prüfungsdatum entscheidet. Diese App nutzt bereits den neuen Katalog. Für SRC gilt weiter der Katalog von 2018. In beiden amtlichen Leseversionen ist immer die erste Antwort richtig.
            </Callout>
            <div style={txt("body2", t.text.secondary)}>Prüfungsausschüsse stellen häufig Geräte der Icom-M423-Reihe für die Praxis; PA Bremen nennt ausdrücklich das ICOM M423. Wer sein eigenes Gerät kennt, ist im Vorteil.</div>
          </>,
        ),
        ...mediaPages(certC + "-ablauf"),
      ];
    }
    if (id === "nato") {
      const L = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      return [
        stack(
          <>
            {screenTitle("Buchstabier-Werkzeug", "Geprüft bei der UBI-Textaufnahme und -abgabe und im SRC-Diktat („I spell“)")}
            <div style={rowWrap}>
              <Input label="Text zum Buchstabieren" value={spellIn} onChange={setSpellIn} placeholder="Schiffsname oder Rufzeichen" />
              <Toggle label="Ziffern als ITU-Codewörter" value={ituDigits} onChange={setItuDigits} />
            </div>
            {spelled.length > 0 ? <div style={{ fontFamily: t.font.mono, fontSize: t.font.code.fontSize, color: t.text.primary, lineHeight: "1.7", padding: 12, borderRadius: t.radius.lg, border: "2px solid " + accent }}>{spelled.map((p: SpellPart) => p.word).join(" · ")}</div> : null}
          </>,
        ),
        stack(<>{screenTitle("Buchstaben A–M")}{letterGrid(L.slice(0, 13))}</>),
        stack(<>{screenTitle("Buchstaben N–Z")}{letterGrid(L.slice(13))}</>),
        stack(
          <>
            {screenTitle("Ziffern", "Umlaute werden aufgelöst (Ä → A E). Die ITU-Ziffernwörter stehen in der Vollzugsordnung für den Funkdienst; im Alltag werden Ziffern meist englisch gesprochen.")}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 6 }}>
              {DIGIT_EN.map((w: string, i: number) => (
                <div key={i} style={{ border: "1px solid " + t.border.subtle, borderRadius: t.radius.md, padding: "6px 8px", ...txt("body2", t.text.secondary) }}>
                  <span style={{ fontFamily: t.font.mono, fontWeight: t.weight.semibold, color: t.text.primary }}>{i + " "}</span>
                  {w + " · " + DIGIT_ITU[i]}
                </div>
              ))}
            </div>
          </>,
        ),
      ];
    }
    if (id === "kanaele") {
      const pages = rowsPages(pickCol(1, CHANNELS).map((r: string[]) => ["Kanal " + r[0], r[1]]), 3, accent, certC === "SRC" ? "Kanäle See" : "Kanäle Binnen");
      pages.push(...rowsPages(certC === "SRC" ? POWER_SEE : POWER_BINNEN, 4, accent2, certC === "SRC" ? "Sendeleistung See" : "Sendeleistung Binnen"));
      if (certC === "UBI") pages.push(...rowsPages(KREISE, 2, accent3, "Verkehrskreise (Binnen)"));
      return pages;
    }
    if (id === "mmsi") {
      const pages: ReactNode[] = [];
      if (certC === "UBI")
        pages.push(
          stack(
            <>
              {screenTitle("ATIS-Rechner")}
              <div style={rowWrap}>
                <Input label="Rufzeichen oder MMSI" value={atisIn} onChange={setAtisIn} />
                <Select label="MID" options={[{ value: "211", label: "211 Deutschland" }, { value: "218", label: "218 Deutschland" }]} value={atisMid} onChange={setAtisMid} />
              </div>
              <div style={{ fontFamily: t.font.mono, fontSize: t.font.heading3.fontSize, lineHeight: t.font.heading3.lineHeight, color: t.text.primary, padding: "10px 14px", borderRadius: t.radius.lg, border: "2px solid " + accent, wordBreak: "break-all" }}>{atis ? atis.code : "Format: z. B. DA5005 oder 9-stellige MMSI"}</div>
              {atis ? <div style={txt("body2", t.text.secondary)}>{atis.steps.join(" · ")}</div> : null}
              <div style={txt("label", t.text.tertiary)}>Regel nach RAINWAT/ETSI EN 300 698: Z = 9, MID, zweiter oder dritter Buchstabe des Rufzeichens als Zahl (A = 01 … Z = 26), dann die vier Ziffern. Verbindlich ist der Code aus deiner Zuteilungsurkunde der Bundesnetzagentur.</div>
            </>,
          ),
        );
      pages.push(
        stack(
          <>
            {screenTitle("MMSI-Decoder")}
            <Input label="MMSI (9 Ziffern)" value={mmsiIn} onChange={setMmsiIn} />
            <div style={{ padding: "10px 14px", borderRadius: t.radius.lg, border: "2px solid " + accent2, ...txt("body1", t.text.primary) }}>{mmsiInfo || "Bitte 9 Ziffern eingeben"}</div>
            <div style={txt("label", t.text.tertiary)}>Die eigene MMSI steht in der Zuteilungsurkunde (SRC 63) und wird im Icom nur einmal programmiert.</div>
          </>,
        ),
      );
      pages.push(...rowsPages(IDS, 3, accent3, "Kennungen"));
      return pages;
    }
    if (id === "quellen") {
      return [
        ...chunk(LINKS, 5).map((g: { title: string; site: string; href: string }[]) => <LinkCards key={g[0].href} links={g} />),
        <div key="q33" style={txt("body2", t.text.secondary)}>SRC-Frage 33 fehlt im Quiz, weil die Antworten 1 und 2 in der amtlichen Leseversion wortgleich sind. Rechtsverbindlich sind nur die im Verkehrsblatt veröffentlichten Texte.</div>,
      ];
    }
    return [];
  };

  /* ---------- Inhalte: Kapitel ---------- */
  const chapterPages = (key: string): ReactNode[] => {
    const c = CHAPTERS.find((x: Chapter) => x.key === key);
    if (!c) return [];
    const s = statsOf(certC, key);
    const ids = poolOf(certC, key);
    const intro = stack(
      <>
        {screenTitle(shortLabel(c.label), "Katalogfragen " + c.from + "–" + c.to + " · " + ids.length + " Fragen · blättere durch Frage und amtlich richtige Antwort")}
        <span style={txt("label", t.text.secondary)}>{pctOf(s.done, s.total) + " % bearbeitet"}</span>
        {bar(s.done, s.total)}
        <span style={txt("label", t.text.secondary)}>{pctOf(s.ok, s.total) + " % zuletzt richtig"}</span>
        {bar(s.ok, s.total, t.text.success)}
        <div style={rowWrap}>
          <Button label="Dieses Kapitel üben" variant="primary" onClick={() => enter(["fragen", key])} />
          <Button label="Weiter: Fragen lesen ›" onClick={() => setPg(1)} />
        </div>
      </>,
    );
    const qa = ids.map((i: number) => {
      const it = ITEMS[i];
      const st = stateOf(i);
      return card(
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            <Status tone="neutral">{it.cert + " " + it.n}</Status>
            {st === 1 ? <Status tone="success">zuletzt richtig</Status> : st === 2 ? <Status tone="danger">zuletzt falsch</Status> : <Status tone="neutral">neu</Status>}
          </div>
          <div style={txt("heading3", t.text.primary, t.weight.semibold)}>{it.q}</div>
          <div style={{ borderLeft: "4px solid " + t.text.success, background: t.fill.successSubtle, borderRadius: t.radius.md, padding: 12, ...txt("body1", t.text.primary) }}>{it.a[0]}</div>
        </>,
        { padding: 16 },
      );
    });
    return [intro, ...qa, ...mediaPages(certC + "-" + key)];
  };

  /* ================= Kurs „Erklären“: Lernpfad mit aufbauenden Lektionen ================= */
  type LCard =
    | { k: "goal"; items: string[] }
    | { k: "text"; h: string; body: string; fact?: string }
    | { k: "svg"; h: string; d: string; cap: string }
    | { k: "ex"; h: string; lines: () => string[] }
    | { k: "tool"; tool: "order" | "spell" | "mmsi" | "atis" | "trainer" }
    | { k: "merke"; items: string[] }
    | { k: "check"; n: number }
    | { k: "media"; key: string }
    | { k: "task"; id: string };
  type Lesson = { id: string; title: string; min: number; cards: LCard[] };

  const [chk, setChk] = useState<Record<string, number>>({});
  const [ord, setOrd] = useState<number[]>([]);

  const exB = (scen: Scen, extra?: Partial<SP>): string[] => buildSpruch({ ...EX_SEE, rev: "binnen", scen, ...extra }).de;
  const exE = (scen: Scen, extra?: Partial<SP>): string[] => buildSpruch({ ...EX_SEE, scen, ...extra }).en || [];

  const SRC_LESSONS: Lesson[] = [
    {
      id: "s1",
      title: "Funk-Grundlagen & UKW-Reichweite",
      min: 8,
      cards: [
        { k: "goal", items: ["Wer im Seefunkdienst mit wem funkt", "Was UKW ist und wie sich die Wellen ausbreiten", "Wovon die Reichweite abhängt", "Wozu Squelch und Leistungsstufe dienen"] },
        { k: "text", h: "Der mobile Seefunkdienst", body: "Funkverkehr zwischen Küstenfunkstellen und Seefunkstellen sowie zwischen Seefunkstellen untereinander (SRC 1). Eine Küstenfunkstelle ist ortsfest (SRC 7), eine Seefunkstelle ist an Bord eines nicht dauernd verankerten Seefahrzeugs (SRC 24).", fact: "Zeitangaben im Seefunk immer in UTC (SRC 21)." },
        { k: "text", h: "UKW: 30 bis 300 MHz", body: "Seefunk für Sportboote läuft auf Ultrakurzwelle (UKW/VHF, SRC 69) mit den internationalen Kanälen 1–28 und 60–88 (SRC 79). UKW breitet sich geradlinig und quasioptisch aus (SRC 78) – also etwa so weit, wie man „sehen“ kann.", fact: "Atmosphärische Störungen und schlechtes Wetter spielen auf UKW praktisch keine Rolle (SRC 77, 83)." },
        { k: "svg", h: "Reichweite = Sichtlinie", d: "range", cap: "Die Reichweite hängt vor allem von der Antennenhöhe ab (SRC 80). Antennen vertikal montieren (SRC 81); Metall in Antennennähe stört die Abstrahlung (SRC 82)." },
        { k: "text", h: "Squelch und Sendeleistung", body: "Die Rauschsperre (Squelch) schaltet den Lautsprecher erst ab einem Mindest-Empfangspegel ein (SRC 51). Fest eingebaute Anlagen schalten zwischen 1 W und 25 W (SRC 37).", fact: "Stromaufnahme: Empfang ca. 0,3–1 A, Senden mit 25 W ca. 4–8 A (SRC 49, 50). Senden verkürzt die Batterielaufzeit (SRC 48)." },
        { k: "merke", items: ["UKW = 30–300 MHz, geradlinige quasioptische Ausbreitung", "Reichweite: vor allem Antennenhöhe", "1 W für Nahbereich, 25 W maximal", "Zeit im Seefunk: UTC"] },
        { k: "check", n: 78 },
        { k: "check", n: 80 },
        { k: "check", n: 51 },
      ],
    },
    {
      id: "s2",
      title: "Zeugnis, Zulassung, Rufzeichen & MMSI",
      min: 10,
      cards: [
        { k: "goal", items: ["Was das SRC erlaubt", "Welche Papiere an Bord gehören", "Wie Rufzeichen und MMSI aufgebaut sind"] },
        { k: "text", h: "Was darfst du mit dem SRC?", body: "Das SRC berechtigt zur Bedienung von UKW-Funkanlagen im Seefunkdienst auf nicht funkausrüstungspflichtigen Fahrzeugen und Traditionsschiffen (SRC 26, 71). Wer eine eingebaute Seefunkanlage bedient, braucht ein passendes Zeugnis, z. B. SRC oder LRC (SRC 25).", fact: "Funkausrüstungspflichtig sind gewerbsmäßig genutzte Sportboote ab 12 m Länge (SRC 27)." },
        { k: "text", h: "Zuteilung und Gerät", body: "Für den Betrieb brauchst du eine Zuteilung (Ship Station Licence) der Bundesnetzagentur, Außenstelle Hamburg (SRC 30). Sie muss im Original an Bord sein (SRC 31); eine Namensänderung des Schiffs meldest du schriftlich (SRC 32). Das Gerät muss für den Seefunk zugelassen bzw. in Verkehr gebracht sein (SRC 34) und trägt das CE-Zeichen (SRC 45).", fact: "Prüfen dürfen Bundesnetzagentur und BSH (SRC 39)." },
        { k: "text", h: "Fernmeldegeheimnis", body: "Abhörverbot und Fernmeldegeheimnis regelt das Telekommunikationsgesetz (SRC 42). Es gilt für alle, die eine Seefunkstelle bedienen oder beaufsichtigen (SRC 43). Uneingeschränkt weitergeben darfst du nur Aussendungen „An alle Funkstellen“ (SRC 44)." },
        { k: "svg", h: "So ist eine MMSI aufgebaut", d: "mmsi", cap: "Neun Ziffern, die ersten drei sind die Seefunkkennzahl MID (SRC 64). Deutschland: 211 und 218 (SRC 62). Küstenfunkstellen beginnen mit 00 (SRC 65)." },
        { k: "tool", tool: "mmsi" },
        { k: "merke", items: ["Ship Station Licence im Original an Bord", "MMSI steht in der Zuteilungsurkunde (SRC 63)", "MMSI = 9 Ziffern, MID vorne; 00… = Küstenfunkstelle", "Nur „An alle“-Meldungen frei verbreiten"] },
        { k: "check", n: 30 },
        { k: "check", n: 64 },
        { k: "check", n: 66 },
      ],
    },
    {
      id: "s3",
      title: "GMDSS & Seegebiete A1–A4",
      min: 8,
      cards: [
        { k: "goal", items: ["Wozu GMDSS da ist", "Was die Seegebiete A1–A4 bedeuten", "Wer im Seenotfall koordiniert"] },
        { k: "text", h: "GMDSS in einem Satz", body: "Das Weltweite Seenot- und Sicherheitsfunksystem sorgt für schnelle und genaue Alarmierung in Not-, Dringlichkeits- und Sicherheitsfällen (SRC 2, 3). Satellitengestützt arbeiten COSPAS-SARSAT und Inmarsat (SRC 15).", fact: "MSI = Nachrichten für die Sicherheit der Seeschifffahrt (SRC 16)." },
        { k: "svg", h: "Seegebiete (schematisch)", d: "areas", cap: "Für die Seegebiete A1, A2, A3, A4 gilt jeweils eine bestimmte Funkausrüstung (SRC 13). A1 ist durch die Sprechfunkreichweite einer UKW-Küstenfunkstelle abgedeckt (SRC 14) – dort bist du mit dem SRC unterwegs." },
        { k: "text", h: "Wer hilft im Notfall?", body: "SAR heißt Suche und Rettung (SRC 125). Die Seenotleitung MRCC koordiniert die verfügbaren Kräfte (SRC 127, 147), der On-Scene Coordinator leitet vor Ort (SRC 129). In Deutschland ist das Bremen Rescue Radio – empfangsbereit auf Kanal 16 und Kanal 70 (SRC 148)." },
        { k: "merke", items: ["GMDSS: Not, Dringlichkeit, Sicherheit schnell alarmieren", "A1 = UKW-Bereich einer Küstenfunkstelle", "MRCC koordiniert, OSC leitet vor Ort", "Bremen Rescue: Kanal 16 und 70"] },
        { k: "media", key: "SRC-S1" },
        { k: "check", n: 3 },
        { k: "check", n: 14 },
        { k: "check", n: 148 },
      ],
    },
    {
      id: "s4",
      title: "Kanäle & Betriebsarten",
      min: 10,
      cards: [
        { k: "goal", items: ["Simplex, Duplex und Semi-Duplex unterscheiden", "Die wichtigsten Kanäle kennen", "Anruf- und Arbeitskanal richtig nutzen"] },
        { k: "svg", h: "Simplex und Duplex", d: "simplex", cap: "Simplex = Wechselsprechen auf einer Frequenz (SRC 73), so funkt man Schiff – Schiff (SRC 106). Duplex = Gegensprechen auf zwei Frequenzen (SRC 72), Semi-Duplex = Wechselsprechen auf zwei Frequenzen (SRC 74)." },
        { k: "svg", h: "Kanalkarte See", d: "channels", cap: "Kanal 70 ausschließlich für DSC (SRC 107). Kanal 16: Notverkehr, Dringlichkeit, Ankündigung Sicherheit und Anrufkanal (SRC 108)." },
        { k: "text", h: "Hörwache", body: "Mit DSC-Anlage auf See empfangsbereit auf Kanal 70 (SRC 109); mit reiner Sprechfunkanlage in der Regel auf Kanal 16 (SRC 110).", fact: "Kanal 06: bevorzugt Schiff – Schiff und koordinierte SAR-Einsätze (SRC 111)." },
        { k: "text", h: "Anruf- und Arbeitskanal", body: "Auf dem Anrufkanal nimmst du Verbindung auf, auf dem Arbeitskanal wickelst du den Verkehr ab (SRC 112). Den Arbeitskanal bestimmt bei See–Küste die Küstenfunkstelle (SRC 90). Vor dem Anruf: laufenden Funkverkehr nicht stören (SRC 115).", fact: "Sportboote untereinander in deutschen Hoheitsgewässern: Kanal 69 oder 72 (SRC 103). International nur Schiff – Schiff: 06, 08, 72, 77 (SRC 75). 75 und 76 nur Navigation (SRC 76)." },
        { k: "merke", items: ["Simplex = eine Frequenz, abwechselnd", "70 = nur DSC, 16 = Not/Anruf", "Küstenfunkstelle bestimmt den Arbeitskanal", "69/72 für Sportboote untereinander"] },
        { k: "check", n: 108 },
        { k: "check", n: 73 },
        { k: "check", n: 103 },
      ],
    },
    {
      id: "s5",
      title: "Funkdisziplin, Rangfolge & Buchstabiertafel",
      min: 8,
      cards: [
        { k: "goal", items: ["Die Rangfolge der Aussendungen", "Regeln für sauberen Funkverkehr", "Namen und Rufzeichen buchstabieren"] },
        { k: "svg", h: "Rangfolge", d: "rang", cap: "Not vor Dringlichkeit vor Sicherheit vor Routine (SRC 85)." },
        { k: "text", h: "Gute Funkdisziplin", body: "Vor jedem Anruf hören, ob der Kanal frei ist, und laufenden Verkehr nicht stören (SRC 115). Testsendungen höchstens 10 Sekunden, mit dem Wort „Test“ und der Kennung des Schiffes (SRC 105). Not-, Dringlichkeits- und Sicherheitsverkehr gehört ins Schiffstagebuch (SRC 86)." },
        { k: "text", h: "Standard-Redewendungen", body: "THIS IS – hier ist · ALL STATIONS – an alle · OVER – bitte kommen · OUT – Ende · SAY AGAIN – bitte wiederholen · I SPELL – ich buchstabiere · CORRECTION – Berichtigung.", fact: "Im SRC-Sprachteil buchstabierst du Namen und Rufzeichen mit der internationalen Buchstabiertafel." },
        { k: "tool", tool: "spell" },
        { k: "merke", items: ["Not > Dringlichkeit > Sicherheit > Routine", "Erst hören, dann senden", "Test: max. 10 s, „Test“ + Kennung", "Schwierige Namen buchstabieren"] },
        { k: "check", n: 85 },
        { k: "check", n: 105 },
        { k: "check", n: 86 },
      ],
    },
    {
      id: "s6",
      title: "DSC & Bedienung am IC-M423",
      min: 12,
      cards: [
        { k: "goal", items: ["Was DSC ist und kann", "Wie ein DSC-Notalarm abläuft", "Notalarm und Einzelanruf am IC-M423"] },
        { k: "text", h: "Digitaler Selektivruf", body: "DSC ist eine digitale Aussendung, die bei der gerufenen Funkstelle ein optisches und/oder akustisches Signal auslöst (SRC 53, 54). Sie läuft auf Kanal 70 (SRC 58) und reicht deutlich weiter als Sprechfunk (SRC 56). Ein empfangener Notalarm wird automatisch gespeichert (SRC 60).", fact: "Ein angeschlossener GPS-Empfänger sorgt dafür, dass der Notalarm die aktuelle Position enthält (SRC 68)." },
        { k: "svg", h: "Ablauf eines Notfalls mit DSC", d: "dsc", cap: "Erst DSC-Alarm auf 70, danach Sprechfunk auf 16. Küstenfunkstellen mit DSC ruft man auf Kanal 70 oder dem Arbeitskanal (SRC 113)." },
        { k: "task", id: "distress" },
        { k: "task", id: "individual" },
        { k: "merke", items: ["DSC = Digitaler Selektivruf auf Kanal 70", "Notalarm: Schutzkappe, [DISTRESS] 3 s", "Danach Sprechfunk auf Kanal 16", "GPS liefert die Position"] },
        { k: "media", key: "SRC-S3" },
        { k: "check", n: 53 },
        { k: "check", n: 56 },
        { k: "check", n: 113 },
      ],
    },
    {
      id: "s7",
      title: "Notverkehr: Mayday bis Silence Fini",
      min: 12,
      cards: [
        { k: "goal", items: ["Wann ein Notfall vorliegt", "Notanruf und Notmeldung in der richtigen Reihenfolge", "Bestätigen, weiterleiten, Funkstille, Fehlalarm"] },
        { k: "text", h: "Wann Mayday?", body: "Wenn ein Schiff oder eine Person von einer ernsten und unmittelbaren Gefahr bedroht ist und sofortige Hilfe benötigt (SRC 135). Das Aussenden veranlasst der Fahrzeugführer (SRC 131). Notverkehr findet vorzugsweise auf Kanal 16 statt (SRC 138).", fact: "Person in Lebensgefahr → Priorität Notfall (SRC 136)." },
        { k: "tool", tool: "order" },
        { k: "ex", h: "Beispiel Notmeldung (Englisch, wie in der Prüfung)", lines: () => exE("mayday") },
        { k: "text", h: "Notalarm empfangen", body: "Bestätigen darfst du nur, wenn du Hilfe leisten kannst (SRC 142) – und erst nach Bestätigung durch eine Küstenfunkstelle oder einer angemessenen Wartefrist (SRC 143), auf Kanal 16 im Sprechfunk (SRC 144). Für ein anderes Schiff in Not sendest du MAYDAY RELAY, grundsätzlich an die nächste Küstenfunkstelle (SRC 141)." },
        { k: "text", h: "Funkstille und Ende", body: "SILENCE MAYDAY: Die Funkstelle, die den Notverkehr leitet, gebietet störenden Funkstellen Funkstille (SRC 145, 146). SILENCE FINI: Der Notverkehr ist beendet (SRC 178)." },
        { k: "text", h: "Fehlalarm ausgelöst?", body: "a) Gerät sofort zurücksetzen, b) wenn möglich per DSC zurücknehmen, c) auf Kanal 16 „An alle Funkstellen“ den Fehlalarm aufheben (SRC 157).", fact: "Am IC-M423: [CANCEL] → [CONTINUE] → [FINISH], das Gerät wechselt auf Kanal 16." },
        { k: "ex", h: "Fehlalarm aufheben (Englisch)", lines: () => exE("cancel") },
        { k: "merke", items: ["MAYDAY ×3 – THIS IS – Name ×3 – Rufzeichen – MMSI", "MAYDAY – Name – Position – Notfall – Hilfe – OVER", "Bestätigen nur, wenn du helfen kannst", "Fehlalarm: zurücksetzen, DSC-Storno, Kanal 16"] },
        { k: "media", key: "SRC-funk" },
        { k: "check", n: 135 },
        { k: "check", n: 142 },
        { k: "check", n: 157 },
      ],
    },
    {
      id: "s8",
      title: "Dringlichkeit, Sicherheit & NAVTEX",
      min: 10,
      cards: [
        { k: "goal", items: ["Pan Pan richtig einsetzen und aufheben", "Sécurité-Meldungen", "NAVTEX für Warnungen und Wetter"] },
        { k: "text", h: "PAN PAN – Dringlichkeit", body: "Sehr dringende Meldung zur Sicherheit eines Fahrzeugs oder einer Person (SRC 93, 94). Ankündigung per DSC auf Kanal 70, Meldung im Sprechfunk auf Kanal 16 (SRC 96). An alle oder an eine bestimmte Funkstelle (SRC 98). Eine Meldung an alle muss nach Erledigung aufgehoben werden (SRC 99)." },
        { k: "ex", h: "Beispiel Pan Pan (Englisch)", lines: () => exE("panpan") },
        { k: "text", h: "SECURITE – Sicherheit", body: "Leitet eine Sicherheitsmeldung ein (SRC 100, 101): wichtige nautische Warnnachricht oder wichtige Wetterwarnung (SRC 102). Auf Kanal 16 wird sie nur angekündigt (SRC 139)." },
        { k: "text", h: "NAVTEX", body: "Nautische Warnnachrichten im Funktelexverfahren (SRC 116) für MSI, Reichweite ca. 600 sm (SRC 119). Navigationswarnungen, Wetterwarnungen und SAR-Meldungen lassen sich nicht unterdrücken (SRC 121).", fact: "Deutscher NAVTEX-Sender: regelmäßig alle 4 Stunden (SRC 123). WX = Wetterbericht, NX = nautische Warnnachricht (SRC 17, 18)." },
        { k: "merke", items: ["Pan Pan: DSC 70 ankündigen, Meldung auf 16", "Pan Pan an alle → später aufheben", "Sécurité: nautische Warnung oder Wetterwarnung", "NAVTEX ≈ 600 sm, alle 4 h"] },
        { k: "check", n: 96 },
        { k: "check", n: 99 },
        { k: "check", n: 119 },
      ],
    },
    {
      id: "s9",
      title: "Routineverkehr & Küstenfunkstellen",
      min: 8,
      cards: [
        { k: "goal", items: ["Arten von Küstenfunkstellen", "Einen Routineanruf aufbauen", "Funkspruch-Trainer ausprobieren"] },
        { k: "text", h: "Revier- und Hafenfunk", body: "Dient Nachrichten, die das Führen, die Fahrt und die Sicherheit von Schiffen im Revier oder Hafen betreffen (SRC 88). Rufname: Ortsname, Art des Dienstes, z. B. „Warnemünde Traffic“ (SRC 91, 92). Das ist nichtöffentlicher Funkverkehr (SRC 87).", fact: "Öffentlicher Funkverkehr (z. B. Gespräche über eine Küstenfunkstelle) braucht einen Vertrag mit einer Abrechnungsgesellschaft (SRC 9)." },
        { k: "text", h: "So rufst du an", body: "Küstenfunkstelle mit DSC: auf Kanal 70 oder dem Arbeitskanal (SRC 113). Ohne DSC: auf dem Arbeitskanal (SRC 114). Die Küstenfunkstelle bestimmt, wo es weitergeht (SRC 90)." },
        { k: "ex", h: "Beispiel Routineanruf (Englisch)", lines: () => exE("routine") },
        { k: "tool", tool: "trainer" },
        { k: "merke", items: ["Revierfunk: Ort + Dienst, z. B. „… Traffic“", "Arbeitskanal legt die Küstenfunkstelle fest", "Vorher hören, nicht stören"] },
        { k: "check", n: 88 },
        { k: "check", n: 114 },
        { k: "check", n: 92 },
      ],
    },
    {
      id: "s10",
      title: "EPIRB, SART, Handfunk & Batterien",
      min: 10,
      cards: [
        { k: "goal", items: ["Was EPIRB und SART tun", "Wie man sie montiert und prüft", "Warum UKW besser ist als das Handy"] },
        { k: "text", h: "EPIRB – Seenotfunkbake", body: "Alarmiert und kennzeichnet die Notposition (SRC 180). 406 MHz zur Alarmierung und Positionsbestimmung, 121,5 MHz zur Zielfahrt (SRC 169). Montage im äußeren Decksbereich (SRC 160), Auslösung manuell oder automatisch per Wasserdruckauslöser (SRC 162, 163). Nur im Notfall aktivieren (SRC 161).", fact: "Alarm in A1–A3 meist nach wenigen Minuten, ungünstig bis zu 4 Stunden; Positionsgenauigkeit ca. 2 sm (SRC 165, 166, 168)." },
        { k: "text", h: "SART – Radartransponder", body: "Erleichtert das Auffinden mit Radar (SRC 179). Auf dem Radarbild erscheint eine Linie von mindestens zwölf Zeichen (SRC 173, 174). EPIRB und SART senden Signale zur Ortung (SRC 159).", fact: "Prüfen: Batterie- und Auslöser-Haltbarkeit, Funktion nach Hersteller (SRC 172). Vor dem Ausbau Fehlalarm ausschließen (SRC 171)." },
        { k: "text", h: "Handfunk und Handy", body: "Handfunkgeräte vorzugsweise für Funkverkehr an Bord und zum Überlebensfahrzeug (SRC 104). UKW erreicht alle Seefunkstellen in Reichweite, ein Telefonat können andere nicht mithören (SRC 175–177)." },
        { k: "merke", items: ["EPIRB: 406 MHz Alarm, 121,5 MHz Homing", "SART: Linie aus ≥ 12 Punkten auf dem Radar", "Batterie-Haltbarkeit regelmäßig prüfen", "UKW statt Handy: alle hören mit"] },
        { k: "media", key: "SRC-S7" },
        { k: "check", n: 169 },
        { k: "check", n: 173 },
        { k: "check", n: 163 },
      ],
    },
  ];

  const UBI_LESSONS: Lesson[] = [
    {
      id: "u1",
      title: "Grundlagen & Rechtsgrundlagen",
      min: 10,
      cards: [
        { k: "goal", items: ["Was Binnenschifffahrtsfunk ist", "RAINWAT und Handbuch Binnenschifffahrtsfunk", "Papiere an Bord", "UKW-Ausbreitung"] },
        { k: "text", h: "Binnenschifffahrtsfunk", body: "Internationaler mobiler UKW-Sprechfunkdienst auf Binnenschifffahrtsstraßen (UBI 1) – für bestimmte Zwecke auf vereinbarten Kanälen (Verkehrskreise) nach festem Betriebsverfahren (UBI 2). Grundlage in Europa ist die Regionale Vereinbarung RAINWAT (UBI 3); das UBI gilt in allen RAINWAT-Ländern (UBI 9).", fact: "Das UBI berechtigt nicht zur Teilnahme am GMDSS (UBI 12)." },
        { k: "text", h: "Handbuch Binnenschifffahrtsfunk", body: "Allgemeiner Teil: Regeln zur Abwicklung des Funks (UBI 80). Regionale Teile: Kanäle der Strecken (UBI 83), fremdsprachige Redewendungen (UBI 81) und Funkbenutzungspflicht (UBI 17). An Bord: Allgemeiner Teil und Regionale Teile der befahrenen Strecken (UBI 36)." },
        { k: "text", h: "Zuteilung und Zeugnis", body: "Die Zuteilungsurkunde (Ship Station Licence) stellt die Bundesnetzagentur aus (UBI 28) und sie muss an Bord sein (UBI 31). Bedienen darf nur, wer ein UBI oder gleichwertiges Zeugnis hat (UBI 27).", fact: "Abhörverbot und Fernmeldegeheimnis: TDDDG (UBI 18). Frei verbreiten darfst du nur Meldungen „An alle Funkstellen“ (UBI 20)." },
        { k: "svg", h: "UKW-Ausbreitung", d: "range", cap: "UKW breitet sich geradlinig und quasioptisch aus (UBI 23). Berge, hohe Bauwerke und Niederschläge stören (UBI 24). Je höher die Antenne, desto größer die Reichweite (UBI 50)." },
        { k: "merke", items: ["Grundlage: RAINWAT", "Kanäle stehen im Regionalen Teil des Handbuchs", "Zuteilungsurkunde der BNetzA an Bord", "Reichweite: Antennenhöhe, Hindernisse"] },
        { k: "check", n: 3 },
        { k: "check", n: 36 },
        { k: "check", n: 24 },
      ],
    },
    {
      id: "u2",
      title: "Rufzeichen & ATIS-Kennung",
      min: 8,
      cards: [
        { k: "goal", items: ["Wie ein Binnen-Rufzeichen aussieht", "Wie der ATIS-Code aufgebaut ist", "Warum es binnen kein DSC gibt"] },
        { k: "text", h: "Rufzeichen", body: "Zwei Buchstaben der deutschen Rufzeichenreihe plus vier Ziffern (UBI 37), z. B. DA 5005 (UBI 38). In den Verkehrskreisen meldest du dich mit Schiffsname und Rufzeichen, dazu ggf. die automatische ATIS-Kennung (UBI 78)." },
        { k: "svg", h: "ATIS-Code", d: "atis", cap: "10 Ziffern: die 9, die MID und 6 Ziffern (UBI 41). Er wird automatisch nach dem Loslassen der Sprechtaste gesendet (UBI 42); aus ihm lässt sich das Rufzeichen ableiten (UBI 44)." },
        { k: "tool", tool: "atis" },
        { k: "text", h: "Kein DSC binnen", body: "DSC ist im Binnenschifffahrtsfunk nicht zulässig (UBI 102). Reine Seefunkanlagen dürfen nicht teilnehmen: Ihnen fehlen die automatische Leistungsreduzierung und ATIS (UBI 101).", fact: "Ein Handfunkgerät sendet den ATIS-Code der Schiffsfunkstelle, zu der es gehört (UBI 43)." },
        { k: "merke", items: ["Rufzeichen: 2 Buchstaben + 4 Ziffern", "ATIS: 9 + MID + 6 Ziffern", "ATIS geht automatisch nach dem Loslassen der PTT", "Binnen: kein DSC"] },
        { k: "check", n: 41 },
        { k: "check", n: 42 },
        { k: "check", n: 102 },
      ],
    },
    {
      id: "u3",
      title: "Verkehrskreise, Kanäle & Sendeleistung",
      min: 12,
      cards: [
        { k: "goal", items: ["Die vier Verkehrskreise", "Kanal 10 und die 1-W-Regel", "Tafelzeichen an Schleusen"] },
        { k: "svg", h: "Die vier Verkehrskreise", d: "kreise", cap: "Schiff – Schiff, Nautische Information, Schiff – Hafenbehörde, Funkverkehr an Bord (UBI 56). Ein Verkehrskreis ordnet Kanäle bestimmten Zwecken zu (UBI 55)." },
        { k: "text", h: "Schiff – Schiff und Kanal 10", body: "Funk zwischen Schiffsfunkstellen über Schutz von Personen, Fahrt und Sicherheit (UBI 59, 60). In Deutschland muss jede Schiffsfunkstelle während der Fahrt auf Kanal 10 empfangsbereit sein (UBI 91). Dort wird automatisch auf höchstens 1 W reduziert (UBI 89, 90).", fact: "Aussendungen auf Kanal 10 können nicht unterbrochen werden – also kurz fassen (UBI 97, 98)." },
        { k: "text", h: "Nautische Information, Hafen, an Bord", body: "NIF: Funk mit den Behörden der Wasserstraße über Zustand, Verkehrsberatung und -lenkung (UBI 63, 64); Anweisungen sind zu befolgen (UBI 99). Nur hier sind 25 W zulässig (UBI 57). Schiff – Hafenbehörde: Liegeplätze und Fahrt im Hafen (UBI 68, 69). An Bord: Kanäle 15 und 17 (UBI 75), nicht für Kleinfahrzeuge (UBI 77)." },
        { k: "text", h: "Weitere Kanäle und Tafelzeichen", body: "Nachrichten sozialer Art: Kanäle 72 und 77 (UBI 94). Kanal 16 darf auf den Bundeswasserstraßen der Zonen 3 und 4 nicht benutzt werden (UBI 92). Tafelzeichen zeigen den Schleusenkanal (UBI 106): weiß mit rotem Rand „UKW 20“ = Gebot Kanal 20 (UBI 107), blau „UKW 18“ = Hinweis auf NIF (UBI 108).", fact: "Zweikanalüberwachung ersetzt keine echte Hörbereitschaft auf zwei Kanälen – sie hört nur abwechselnd (UBI 88)." },
        { k: "media", key: "UBI-U4" },
        { k: "merke", items: ["Kanal 10: immer hören, max. 1 W automatisch", "25 W nur bei Nautischer Information", "15/17 an Bord, 72/77 sozial", "Kein Kanal 16 in Zonen 3 und 4"] },
        { k: "check", n: 57 },
        { k: "check", n: 90 },
        { k: "check", n: 75 },
      ],
    },
    {
      id: "u4",
      title: "Funkdisziplin & Buchstabiertafel",
      min: 8,
      cards: [
        { k: "goal", items: ["Rangfolge und Betriebsarten", "Regeln vor und beim Senden", "Buchstabieren üben"] },
        { k: "svg", h: "Rangfolge", d: "rang", cap: "Notverkehr, Dringlichkeitsverkehr, Sicherheitsverkehr, Routineverkehr (UBI 110)." },
        { k: "svg", h: "Simplex und Duplex", d: "simplex", cap: "Simplex = Wechselsprechen, jeder kann nur senden oder empfangen (UBI 84, 85). Duplex = Gegensprechen (UBI 86), Semi-Duplex = Wechselsprechen auf einem Duplex-Kanal (UBI 87)." },
        { k: "text", h: "Vor und beim Senden", body: "Vor jeder Aussendung kurz die Rauschsperre öffnen: Kanal frei, niemand gestört (UBI 96). Testsendungen höchstens 10 Sekunden, mit Rufnamen der Funkstelle (UBI 4, 104). Meldungen bestätigt man auf Verlangen (UBI 105). Mit ausländischen Landfunkstellen grundsätzlich in der Landessprache (UBI 103)." },
        { k: "tool", tool: "spell" },
        { k: "merke", items: ["Not > Dringlichkeit > Sicherheit > Routine", "Squelch kurz öffnen, erst dann senden", "Test: max. 10 s mit Rufnamen", "Buchstabiertafel gegen Übermittlungsfehler (UBI 82)"] },
        { k: "check", n: 96 },
        { k: "check", n: 82 },
        { k: "check", n: 110 },
      ],
    },
    {
      id: "u5",
      title: "Notverkehr Binnen",
      min: 10,
      cards: [
        { k: "goal", items: ["Wann Notverkehr eingeleitet wird", "Notmeldung nach Sprechfunktafel", "Bestätigung, Relay, Funkstille"] },
        { k: "text", h: "Wann Mayday?", body: "Bei unmittelbarer Gefährdung von Mensch oder Schiff (UBI 112): z. B. lebensgefährlich verletzte Person, Mensch über Bord, Kentergefahr (UBI 113–115). Über die Art der Meldung entscheidet der Schiffsführer (UBI 130).", fact: "Zur Einleitung von Rettungsmaßnahmen vorzugsweise die Revierzentralen anrufen (UBI 109)." },
        { k: "tool", tool: "order" },
        { k: "ex", h: "Beispiel Notmeldung Binnen", lines: () => exB("mayday") },
        { k: "text", h: "Bestätigen und weiterleiten", body: "Im NIF bestätigt die zuständige Schleuse oder Revierzentrale (UBI 116), im Verkehrskreis Schiff – Schiff eine Schiffsfunkstelle in der Nähe (UBI 117). MAYDAY RELAY: Notmeldung durch eine Funkstelle, die selbst nicht in Not ist (UBI 118)." },
        { k: "text", h: "Funkstille und Ende", body: "SILENCE MAYDAY: Die Funkstelle in Not gebietet allen anderen Funkstille (UBI 120). SILENCE FINI: Der Notverkehr ist beendet (UBI 119)." },
        { k: "merke", items: ["Unmittelbare Gefahr → Notverkehr", "Vorzugsweise Revierzentrale rufen", "Bestätigung: Schleuse/Revierzentrale oder Schiff in der Nähe", "SILENCE MAYDAY / SILENCE FINI"] },
        { k: "media", key: "UBI-funk" },
        { k: "check", n: 112 },
        { k: "check", n: 109 },
        { k: "check", n: 116 },
      ],
    },
    {
      id: "u6",
      title: "Dringlichkeit & Sicherheit",
      min: 8,
      cards: [
        { k: "goal", items: ["Pan Pan richtig einsetzen und aufheben", "Sécurité-Meldungen erkennen"] },
        { k: "text", h: "PAN PAN – Dringlichkeit", body: "Dringende Nachrichten über Besatzung oder Schiff ohne unmittelbare Gefahr (UBI 121, 122), z. B. nicht lebensbedrohliche Krankheit oder Schaden ohne unmittelbare Gefahr (UBI 123, 124). Aufheben mit demselben Anrufschema, Uhrzeit der Aussendung und Hinweis auf die Rücknahme (UBI 125)." },
        { k: "ex", h: "Beispiel Pan Pan Binnen", lines: () => exB("panpan", { pan: "engine" }) },
        { k: "text", h: "SECURITE – Sicherheit", body: "Kündigt sicherheitsrelevante Nachrichten an: wichtige nautische Warnung oder wichtige Wetterwarnung (UBI 126, 127). Beispiele: treibender Baumstamm, vertriebene Tonne (UBI 128, 129)." },
        { k: "ex", h: "Beispiel Sécurité Binnen", lines: () => exB("securite", { sec: "tree" }) },
        { k: "merke", items: ["Pan Pan: dringend, aber keine unmittelbare Gefahr", "Aufheben: gleiches Schema + Uhrzeit + Rücknahme", "Sécurité: Treibgut, vertriebene Tonne, Wetter"] },
        { k: "check", n: 124 },
        { k: "check", n: 125 },
        { k: "check", n: 128 },
      ],
    },
    {
      id: "u7",
      title: "Routineverkehr & Revierzentralen",
      min: 8,
      cards: [
        { k: "goal", items: ["Revierzentralen und Landfunkstellen kennen", "Routineanruf aufbauen", "Funkspruch-Trainer ausprobieren"] },
        { k: "text", h: "Revierzentralen", body: "Eine Revierzentrale ist eine Landfunkstelle des Verkehrskreises Nautische Information (UBI 5). In Deutschland: Duisburg, Oberwesel, Minden, Magdeburg, Gösselthal (UBI 71). Auch Iffezheim Schleuse und Lübeck Hubbrücken gehören zum NIF (UBI 67, 70); Marina Düsseldorf Port ist Schiff – Hafenbehörde (UBI 72).", fact: "Gefahrgutschiffe und Sondertransporte unterliegen auf bestimmten Strecken einer Meldepflicht (UBI 95)." },
        { k: "media", key: "UBI-U3" },
        { k: "text", h: "Routineanruf", body: "Beispiel Bunkerboot: Anruf auf Kanal 10 mit der Bitte, auf einen Kanal für Nachrichten sozialer Art zu wechseln (UBI 93), also 72 oder 77 (UBI 94). Anweisungen der NIF-Funkstellen sind zu befolgen (UBI 99)." },
        { k: "ex", h: "Beispiel Routineanruf Binnen", lines: () => exB("routine") },
        { k: "tool", tool: "trainer" },
        { k: "merke", items: ["5 Revierzentralen: Duisburg, Oberwesel, Minden, Magdeburg, Gösselthal", "Kanal 10 anrufen, dann wechseln", "NIF-Anweisungen befolgen"] },
        { k: "check", n: 71 },
        { k: "check", n: 93 },
        { k: "check", n: 67 },
      ],
    },
    {
      id: "u8",
      title: "Bedienung IC-M423 im ATIS-Betrieb",
      min: 12,
      cards: [
        { k: "goal", items: ["Gerät einschalten, Squelch einstellen", "ATIS-Kanalgruppe wählen", "Leistung schalten und Zweikanalwache"] },
        { k: "text", h: "Vor dem Ablegen", body: "Prüfen: Kanalgruppe ATIS (in der UBI-Prüfung muss das Gerät im ATIS-Modus sein), Squelch passend, Kanal 10 hören. Die Rauschsperre aktiviert die Wiedergabe nur bei brauchbarem Signal (UBI 54).", fact: "Die Angabe „Betriebsspannung 10,8–14,6 V=“ heißt: Gleichspannung in diesem Bereich (UBI 48)." },
        { k: "task", id: "power" },
        { k: "task", id: "group" },
        { k: "task", id: "hilo" },
        { k: "task", id: "dw" },
        { k: "merke", items: ["[VOL/SQL•PWR] 1 s = Ein/Aus", "Kanalgruppe ATIS wählen", "Leistung 1 W / 25 W (UBI 47); Kanal 10 reduziert automatisch", "Dual Watch hört nur abwechselnd (UBI 88)"] },
        { k: "media", key: "UBI-geraet" },
        { k: "check", n: 54 },
        { k: "check", n: 47 },
        { k: "check", n: 88 },
      ],
    },
  ];

  const LESSONS = certC === "SRC" ? SRC_LESSONS : UBI_LESSONS;
  const lkey = (id: string): string => "L-" + certC + "-" + id;
  const lstat = (id: string): number => prog[lkey(id)] || 0;
  const nextLesson = (): Lesson => LESSONS.find((l: Lesson) => lstat(l.id) !== 2) || LESSONS[0];
  const lessonsDone = LESSONS.filter((l: Lesson) => lstat(l.id) === 2).length;
  const setLstat = (id: string, v: number) =>
    setProg((p: Record<string, number>) => ((p[lkey(id)] || 0) >= v ? p : { ...p, [lkey(id)]: v }));

  /* ---------- Diagramme (eigene SVGs, Farben aus dem Theme) ---------- */
  const svgBox = (vb: string, children: ReactNode, label: string): ReactNode => (
    <svg viewBox={vb} role="img" aria-label={label} style={{ width: "100%", maxHeight: 210, display: "block" }}>
      {children}
    </svg>
  );
  const sT = (x: number, y: number, s: string, opt?: { anchor?: "start" | "middle" | "end"; color?: string; size?: number; bold?: boolean }): ReactNode => (
    <text x={x} y={y} textAnchor={opt && opt.anchor ? opt.anchor : "middle"} fill={opt && opt.color ? opt.color : t.text.secondary} fontSize={opt && opt.size ? opt.size : 12} fontWeight={opt && opt.bold ? 600 : 400} fontFamily={fam}>
      {s}
    </text>
  );
  const diagram = (d: string): ReactNode => {
    const ln = t.text.secondary;
    if (d === "range")
      return svgBox(
        "0 0 360 170",
        <>
          <path d="M 0 150 Q 180 100 360 150" fill="none" stroke={ln} strokeWidth="2" />
          <line x1="50" y1="138" x2="50" y2="58" stroke={accent} strokeWidth="3" />
          <line x1="310" y1="138" x2="310" y2="98" stroke={accent2} strokeWidth="3" />
          <line x1="50" y1="58" x2="310" y2="98" stroke={accent} strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="180" cy="114" r="3" fill={ln} />
          {sT(50, 50, "hohe Antenne", { color: t.text.primary })}
          {sT(310, 90, "Gegenstelle", { color: t.text.primary })}
          {sT(180, 165, "Erdkrümmung begrenzt die Sichtlinie", { size: 11 })}
          {sT(180, 76, "Sichtlinie (quasioptisch)", { size: 11 })}
        </>,
        "UKW-Reichweite als Sichtlinie über die Erdkrümmung",
      );
    if (d === "areas")
      return svgBox(
        "0 0 360 190",
        <>
          <rect x="4" y="4" width="352" height="182" rx="14" fill="none" stroke={ln} strokeDasharray="4 4" />
          <rect x="24" y="24" width="250" height="142" rx="12" fill={t.fill.accentSubtle} stroke={accent3} />
          <rect x="44" y="44" width="160" height="102" rx="10" fill="none" stroke={accent2} strokeWidth="2" />
          <rect x="64" y="64" width="80" height="62" rx="8" fill={t.fill.accentSubtle} stroke={accent} strokeWidth="2" />
          {sT(104, 92, "A1", { color: t.text.primary, bold: true, size: 14 })}
          {sT(104, 108, "UKW-Küste", { size: 10 })}
          {sT(174, 100, "A2", { color: t.text.primary, bold: true, size: 14 })}
          {sT(174, 116, "Grenzwelle", { size: 10 })}
          {sT(240, 100, "A3", { color: t.text.primary, bold: true, size: 14 })}
          {sT(240, 116, "Inmarsat", { size: 10 })}
          {sT(316, 100, "A4", { color: t.text.primary, bold: true, size: 14 })}
          {sT(316, 116, "Rest/Polar", { size: 10 })}
          {sT(60, 160, "Küste", { size: 10, anchor: "start" })}
        </>,
        "Seegebiete A1 bis A4 als ineinanderliegende Zonen",
      );
    if (d === "simplex")
      return svgBox(
        "0 0 360 160",
        <>
          {sT(90, 18, "Simplex", { color: t.text.primary, bold: true, size: 13 })}
          <rect x="20" y="40" width="40" height="24" rx="6" fill={t.fill.accentSubtle} stroke={accent} />
          <rect x="120" y="40" width="40" height="24" rx="6" fill={t.fill.accentSubtle} stroke={accent} />
          <line x1="62" y1="52" x2="118" y2="52" stroke={accent} strokeWidth="2" />
          {sT(90, 84, "1 Frequenz", { size: 11 })}
          {sT(90, 100, "abwechselnd", { size: 11 })}
          {sT(270, 18, "Duplex", { color: t.text.primary, bold: true, size: 13 })}
          <rect x="200" y="40" width="40" height="24" rx="6" fill={t.fill.accentSubtle} stroke={accent2} />
          <rect x="300" y="40" width="40" height="24" rx="6" fill={t.fill.accentSubtle} stroke={accent2} />
          <line x1="242" y1="46" x2="298" y2="46" stroke={accent2} strokeWidth="2" />
          <line x1="242" y1="58" x2="298" y2="58" stroke={accent3} strokeWidth="2" />
          {sT(270, 84, "2 Frequenzen", { size: 11 })}
          {sT(270, 100, "gleichzeitig", { size: 11 })}
          {sT(180, 140, "Semi-Duplex: 2 Frequenzen, aber abwechselnd", { size: 11 })}
        </>,
        "Simplex und Duplex im Vergleich",
      );
    if (d === "channels") {
      const ch: [string, string, string][] = [
        ["70", "nur DSC", t.text.danger],
        ["16", "Not · Anruf", t.text.danger],
        ["06", "Schiff–Schiff · SAR", accent],
        ["69 / 72", "Sportboote", accent2],
        ["08 / 77", "Schiff–Schiff", accent],
        ["75 / 76", "Navigation", accent3],
      ];
      return svgBox(
        "0 0 360 170",
        <>
          {ch.map((c: [string, string, string], i: number) => {
            const x = 8 + (i % 3) * 118;
            const y = 10 + Math.floor(i / 3) * 80;
            return (
              <g key={c[0]}>
                <rect x={x} y={y} width="108" height="70" rx="12" fill={t.fill.accentSubtle} stroke={c[2]} strokeWidth="2" />
                {sT(x + 54, y + 32, c[0], { color: t.text.primary, bold: true, size: 18 })}
                {sT(x + 54, y + 54, c[1], { size: 11 })}
              </g>
            );
          })}
        </>,
        "Wichtige UKW-Kanäle im Seefunk",
      );
    }
    if (d === "rang") {
      const r: [string, string][] = [
        ["MAYDAY", "Not"],
        ["PAN PAN", "Dringlichkeit"],
        ["SECURITE", "Sicherheit"],
        ["—", "Routine"],
      ];
      return svgBox(
        "0 0 360 170",
        <>
          {r.map((x: [string, string], i: number) => (
            <g key={x[1]}>
              <rect x={20 + i * 20} y={8 + i * 40} width={320 - i * 40} height="34" rx="10" fill={t.fill.accentSubtle} stroke={[t.text.danger, accent3, accent2, accent][i]} strokeWidth="2" />
              {sT(180, 30 + i * 40, i + 1 + ". " + x[1] + (x[0] !== "—" ? " · " + x[0] : ""), { color: t.text.primary, bold: i === 0, size: 13 })}
            </g>
          ))}
        </>,
        "Rangfolge der Aussendungen",
      );
    }
    if (d === "dsc") {
      const s = ["Schutzkappe auf, [DISTRESS] 3 s", "DSC-Notalarm auf Kanal 70 (mit Position)", "Gerät wechselt auf Kanal 16", "Notanruf + Notmeldung im Sprechfunk"];
      return svgBox(
        "0 0 360 190",
        <>
          {s.map((x: string, i: number) => (
            <g key={i}>
              <rect x="20" y={6 + i * 46} width="320" height="34" rx="10" fill={t.fill.accentSubtle} stroke={i < 2 ? t.text.danger : accent} strokeWidth="2" />
              {sT(180, 28 + i * 46, i + 1 + "  " + x, { color: t.text.primary, size: 12 })}
              {i < 3 ? <line x1="180" y1={40 + i * 46} x2="180" y2={52 + i * 46} stroke={ln} strokeWidth="2" /> : null}
            </g>
          ))}
        </>,
        "Ablauf: DSC-Notalarm, dann Sprechfunk",
      );
    }
    if (d === "mmsi" || d === "atis") {
      const digits = d === "mmsi" ? "211123450".split("") : "9211015005".split("");
      const w = d === "mmsi" ? 34 : 31;
      const x0 = (360 - digits.length * w) / 2;
      const groups: [number, number, string, string][] = d === "mmsi" ? [[0, 3, "MID 211 = Deutschland", accent], [3, 9, "Schiffsnummer", accent2]] : [[0, 1, "9", accent3], [1, 4, "MID", accent], [4, 10, "aus Rufzeichen", accent2]];
      return svgBox(
        "0 0 360 130",
        <>
          {digits.map((c: string, i: number) => (
            <g key={i}>
              <rect x={x0 + i * w + 2} y="20" width={w - 4} height="42" rx="8" fill={t.fill.accentSubtle} stroke={t.border.default} />
              {sT(x0 + i * w + w / 2, 48, c, { color: t.text.primary, bold: true, size: 18 })}
            </g>
          ))}
          {groups.map((g: [number, number, string, string]) => (
            <g key={g[2]}>
              <line x1={x0 + g[0] * w + 3} y1="72" x2={x0 + g[1] * w - 3} y2="72" stroke={g[3]} strokeWidth="4" strokeLinecap="round" />
              {sT(x0 + ((g[0] + g[1]) / 2) * w, 94, g[2], { size: 11 })}
            </g>
          ))}
          {d === "atis" ? sT(180, 120, "Beispiel für DA 5005: A = 01, dann 5005 (Regel nach RAINWAT)", { size: 10 }) : sT(180, 120, "Beispiel-MMSI einer deutschen Seefunkstelle", { size: 10 })}
        </>,
        d === "mmsi" ? "Aufbau einer MMSI" : "Aufbau eines ATIS-Codes",
      );
    }
    if (d === "kreise") {
      const k: [string, string, string][] = [
        ["Schiff – Schiff", "Kanal 10 · max. 1 W", accent],
        ["Nautische Information", "Kanal je Strecke · 25 W erlaubt", accent2],
        ["Schiff – Hafenbehörde", "Kanal je Hafen · 1 W", accent3],
        ["An Bord", "Kanal 15 / 17 · 1 W", t.text.secondary],
      ];
      return svgBox(
        "0 0 360 170",
        <>
          {k.map((x: [string, string, string], i: number) => {
            const cx = 8 + (i % 2) * 176;
            const cy = 8 + Math.floor(i / 2) * 80;
            return (
              <g key={x[0]}>
                <rect x={cx} y={cy} width="168" height="72" rx="12" fill={t.fill.accentSubtle} stroke={x[2]} strokeWidth="2" />
                {sT(cx + 84, cy + 30, x[0], { color: t.text.primary, bold: true, size: 13 })}
                {sT(cx + 84, cy + 52, x[1], { size: 11 })}
              </g>
            );
          })}
        </>,
        "Die vier Verkehrskreise mit Kanal und Leistung",
      );
    }
    return null;
  };

  /* ---------- Übungen ---------- */
  const ORDER_SRC = ["MAYDAY MAYDAY MAYDAY", "THIS IS – Name 3× – Rufzeichen – MMSI", "MAYDAY – Name – Rufzeichen – MMSI", "Position (mit UTC)", "Art des Notfalls", "Erbetene Hilfe", "Personen an Bord, weitere Angaben", "OVER"];
  const ORDER_UBI = ["MAYDAY MAYDAY MAYDAY", "THIS IS – Name 3× – Rufzeichen", "MAYDAY – Name – Rufzeichen", "Position (z. B. Rhein-km)", "Art des Notfalls", "Erbetene Hilfe", "BITTE KOMMEN"];
  const orderTool = (): ReactNode => {
    const blocks = certC === "SRC" ? ORDER_SRC : ORDER_UBI;
    const mix = blocks.map((_: string, i: number) => i).sort((a: number, b: number) => ((a * 5 + 3) % 7) - ((b * 5 + 3) % 7));
    const ok = ord.every((v: number, i: number) => v === i);
    const doneAll = ord.length === blocks.length;
    return stack(
      <>
        {screenTitle("Übung: Baue die Notmeldung", "Tippe die Bausteine in der richtigen Reihenfolge an")}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {ord.map((v: number, i: number) => (
            <div key={i} style={{ padding: "6px 10px", borderRadius: t.radius.md, border: "1px solid " + (v === i ? t.text.success : t.text.danger), background: v === i ? t.fill.successSubtle : "transparent", ...txt("body2", t.text.primary) }}>{i + 1 + ". " + blocks[v]}</div>
          ))}
        </div>
        {!doneAll ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {mix
              .filter((i: number) => ord.indexOf(i) < 0)
              .map((i: number) => chip("o" + i, blocks[i], false, () => setOrd(ord.concat([i]))))}
          </div>
        ) : null}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {doneAll ? (ok ? <Status tone="success">Perfekt – richtige Reihenfolge</Status> : <Status tone="danger">Rote Bausteine stehen falsch</Status>) : null}
          {ord.length > 0 ? <Button label="Neu ordnen" variant="quiet" onClick={() => setOrd([])} /> : null}
        </div>
      </>,
    );
  };

  const checkCard = (n: number): ReactNode => {
    const idx = ITEMS.findIndex((x: Item) => x.cert === certC && x.n === n);
    if (idx < 0) return null;
    const it = ITEMS[idx];
    const key = certC + "-" + n;
    const perm = [0, 1, 2, 3].map((i: number) => (i + n) % 4);
    const pick = chk[key];
    const answered = pick !== undefined;
    return stack(
      <>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Status tone="accent">Mini-Check</Status>
          <span style={txt("label", t.text.tertiary)}>{"Katalogfrage " + certC + " " + n}</span>
        </div>
        <div style={txt("body1", t.text.primary, t.weight.semibold)}>{it.q}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {perm.map((pi: number, i: number) => {
            const right = pi === 0;
            const border = answered ? (right ? t.text.success : i === pick ? t.text.danger : t.border.subtle) : t.border.default;
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => {
                  setChk((c: Record<string, number>) => ({ ...c, [key]: i }));
                  setProg((p: Record<string, number>) => ({ ...p, [key]: right ? 1 : 2 }));
                }}
                style={{ textAlign: "left", padding: "8px 12px", borderRadius: t.radius.lg, border: "2px solid " + border, background: answered && right ? t.fill.successSubtle : t.bg.elevated, color: t.text.primary, fontFamily: fam, fontSize: t.font.body2.fontSize, lineHeight: t.font.body2.lineHeight, cursor: answered ? "default" : "pointer" }}
              >
                {it.a[pi]}
              </button>
            );
          })}
        </div>
        {pick !== undefined ? (perm[pick] === 0 ? <Status tone="success">Richtig!</Status> : <Status tone="danger">Nicht ganz – grün ist richtig</Status>) : null}
      </>,
    );
  };

  const toolCard = (tool: string): ReactNode => {
    if (tool === "order") return orderTool();
    if (tool === "spell") return wissenPages("nato")[0];
    if (tool === "mmsi") return wissenPages("mmsi")[certC === "UBI" ? 1 : 0];
    if (tool === "atis") return wissenPages("mmsi")[0];
    return stack(
      <>
        {screenTitle("Selbst funken: Funkspruch-Trainer", "Baue eigene Meldungen mit deinem Schiffsnamen, Rufzeichen und deiner Position")}
        <div style={rowWrap}>
          <Button label="Trainer öffnen" variant="primary" onClick={() => enter(["erklaeren", "ref", "trainer"])} />
        </div>
      </>,
    );
  };

  const lessonCards = (l: Lesson): ReactNode[] => {
    const out: ReactNode[] = [];
    l.cards.forEach((c: LCard) => {
      if (c.k === "goal")
        out.push(
          stack(
            <>
              <Status tone="accent">{"Lektion " + (LESSONS.indexOf(l) + 1) + " · ca. " + l.min + " min"}</Status>
              <div style={{ fontFamily: fam, fontSize: t.font.heading2.fontSize, lineHeight: t.font.heading2.lineHeight, fontWeight: t.weight.semibold, color: t.text.primary }}>{l.title}</div>
              <span style={txt("subtext", t.text.secondary)}>Das lernst du hier:</span>
              {c.items.map((x: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", ...txt("body1", t.text.primary) }}>
                  <span style={{ flex: "0 0 22px", height: 22, borderRadius: t.radius.full, background: accent, color: t.bg.base, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: t.weight.semibold }}>{i + 1}</span>
                  {x}
                </div>
              ))}
            </>,
          ),
        );
      else if (c.k === "text")
        out.push(
          stack(
            <>
              {screenTitle(c.h)}
              <div style={txt("body1", t.text.primary)}>{c.body}</div>
              {c.fact ? <div style={{ borderRadius: t.radius.lg, background: t.fill.accentSubtle, borderLeft: "4px solid " + accent, padding: "10px 14px", ...txt("body2", t.text.primary) }}>{c.fact}</div> : null}
            </>,
          ),
        );
      else if (c.k === "svg") out.push(stack(<>{screenTitle(c.h)}{diagram(c.d)}<div style={txt("body2", t.text.secondary)}>{c.cap}</div></>));
      else if (c.k === "ex") out.push(stack(<>{screenTitle("Beispiel", c.h)}{spruchBox(t, certC === "SRC" ? "Funkspruch" : "Funkspruch (Sprechfunktafel)", c.lines())}</>));
      else if (c.k === "tool") out.push(toolCard(c.tool));
      else if (c.k === "merke")
        out.push(
          stack(
            <>
              {screenTitle("Merke")}
              {c.items.map((x: string, i: number) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", borderRadius: t.radius.lg, background: t.fill.successSubtle, ...txt("body1", t.text.primary) }}>
                  <span style={{ color: t.text.success, fontWeight: t.weight.semibold }}>✓</span>
                  {x}
                </div>
              ))}
            </>,
          ),
        );
      else if (c.k === "check") out.push(checkCard(c.n));
      else if (c.k === "media") out.push(...mediaPages(c.key));
      else if (c.k === "task") {
        const task = ICOM_TASKS.find((x: { value: string }) => x.value === c.id);
        geraetPages(c.id).forEach((p: ReactNode, i: number) => out.push(stack(<>{screenTitle("Am IC-M423: " + (task ? task.label : ""), "Schritt " + (i + 1) + " von " + (task ? task.steps.length : 0))}{p}</>)));
      }
    });
    const idx = LESSONS.indexOf(l);
    const nxt = LESSONS[idx + 1];
    out.push(
      <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: t.radius.full, background: t.fill.successSubtle, border: "2px solid " + t.text.success, display: "flex", alignItems: "center", justifyContent: "center", color: t.text.success, fontSize: 30, fontWeight: t.weight.semibold }}>✓</div>
        <div style={{ fontFamily: fam, fontSize: t.font.heading2.fontSize, lineHeight: t.font.heading2.lineHeight, fontWeight: t.weight.semibold, color: t.text.primary }}>Lektion abgeschlossen</div>
        <div style={txt("body2", t.text.secondary)}>{lessonsDone + " von " + LESSONS.length + " Lektionen geschafft"}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {nxt ? <Button label={"Nächste Lektion: " + nxt.title} variant="primary" onClick={() => enter(["erklaeren", nxt.id])} /> : <Button label="Zur Prüfung" variant="primary" onClick={() => enter(["pruefung"])} />}
          <Button label="Zum Lernpfad" onClick={() => enter(["erklaeren"])} />
        </div>
      </div>,
    );
    return out;
  };

  useEffect(() => {
    if (path[0] !== "erklaeren" || path.length !== 2 || path[1] === "ref") return;
    const l = LESSONS.find((x: Lesson) => x.id === path[1]);
    if (!l) return;
    const total = lessonCards(l).length;
    setLstat(l.id, pg >= total - 1 ? 2 : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, pg, certC]);

  const lessonScreen = (l: Lesson): ReactNode => {
    const cards = lessonCards(l);
    const n = cards.length;
    const p = Math.min(pg, n - 1);
    const last = p >= n - 1;
    return (
      <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: "1 1 auto" }}>{bar(p + 1, n)}</div>
          <span style={txt("label", t.text.secondary)}>{p + 1 + " / " + n}</span>
        </div>
        <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", background: t.bg.elevated, border: "1px solid " + t.border.subtle, borderRadius: t.radius.xl, padding: 18, boxShadow: "0 1px 3px " + t.border.subtle }}>{cards[p]}</div>
        {!last ? (
          <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "space-between", gap: 8 }}>
            <Button label="‹ Zurück" onClick={() => setPg(Math.max(0, p - 1))} disabled={p === 0} />
            <Button label={p === n - 2 ? "Lektion abschließen ✓" : "Weiter ›"} variant="primary" onClick={() => setPg(p + 1)} />
          </div>
        ) : null}
      </div>
    );
  };

  const courseHome = (): ReactNode => {
    const nx = nextLesson();
    const per = 4;
    const pages = chunk(LESSONS, per).map((grp: Lesson[], gi: number) => (
      <div key={gi} style={{ display: "flex", flexDirection: "column" }}>
        {grp.map((l: Lesson, i: number) => {
          const num = gi * per + i + 1;
          const st = lstat(l.id);
          const isNext = l.id === nx.id && lessonsDone < LESSONS.length;
          const col = st === 2 ? t.text.success : isNext || st === 1 ? accent : t.border.default;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => enter(["erklaeren", l.id])}
              style={{ display: "flex", gap: 12, alignItems: "stretch", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: fam }}
            >
              <div style={{ flex: "0 0 34px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 2, flex: "0 0 6px", background: i === 0 && gi === 0 ? "transparent" : t.border.default }} />
                <div style={{ width: 34, height: 34, borderRadius: t.radius.full, border: "2px solid " + col, background: st === 2 ? t.fill.successSubtle : isNext ? t.fill.accentSubtle : t.bg.elevated, display: "flex", alignItems: "center", justifyContent: "center", ...txt("subtext", st === 2 ? t.text.success : t.text.primary, t.weight.semibold) }}>{st === 2 ? "✓" : num}</div>
                <div style={{ width: 2, flex: "1 1 auto", background: num === LESSONS.length ? "transparent" : t.border.default }} />
              </div>
              <div style={{ flex: "1 1 auto", minWidth: 0, margin: "4px 0", padding: "8px 12px", borderRadius: t.radius.lg, border: "1px solid " + (isNext ? accent : t.border.subtle), background: isNext ? t.fill.accentSubtle : t.bg.elevated, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={txt("body1", t.text.primary, t.weight.semibold)}>{l.title}</span>
                <span style={txt("label", t.text.secondary)}>{"ca. " + l.min + " min · " + (st === 2 ? "abgeschlossen" : st === 1 ? "in Arbeit" : isNext ? "empfohlen als Nächstes" : "offen")}</span>
              </div>
            </button>
          );
        })}
      </div>
    ));
    return (
      <>
        <div style={{ flex: "0 0 auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, padding: 14, borderRadius: t.radius.xl, background: t.fill.accentSubtle, border: "1px solid " + accent }}>
          <div style={{ flex: "1 1 180px", minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={txt("label", t.text.secondary)}>{lessonsDone + " von " + LESSONS.length + " Lektionen abgeschlossen"}</span>
            {bar(lessonsDone, LESSONS.length, t.text.success)}
            <span style={txt("body2", t.text.primary, t.weight.semibold)}>{lessonsDone === LESSONS.length ? "Kurs geschafft – jetzt Prüfung üben" : "Als Nächstes: " + (LESSONS.indexOf(nx) + 1) + ". " + nx.title}</span>
          </div>
          <Button label={lessonsDone === 0 ? "Kurs starten" : "Weiter lernen"} variant="primary" onClick={() => enter(["erklaeren", nx.id])} />
        </div>
        {pager(pages)}
        <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
          <Button label="Nachschlagen & Werkzeuge ›" variant="quiet" onClick={() => enter(["erklaeren", "ref"])} />
        </div>
      </>
    );
  };

  /* ---------- Funkgerät: Schema IC-M423, Bedien-Abläufe, Funk-Simulator ---------- */
  type RKey = "dial" | "push" | "k16" | "hilo" | "dw" | "scan" | "sql" | "vol" | "menu" | "clr" | "flap" | "distress" | "ptt";
  type Radio = { ch: number; hi: boolean; dw: number; scan: boolean; sql: number; vol: number; menu: boolean; flap: boolean; alarm: number; key: string };
  const RADIO0: Radio = { ch: 16, hi: true, dw: 0, scan: false, sql: 3, vol: 5, menu: false, flap: false, alarm: 0, key: "" };
  const [rd, setRd] = useState<Radio>(RADIO0);
  const [proc, setProc] = useState<string>("");
  const [pstep, setPstep] = useState<number>(0);
  const [pwarn, setPwarn] = useState<string>("");
  const [scn, setScn] = useState<string>("");
  const [turn, setTurn] = useState<number>(0);
  const [said, setSaid] = useState<string>("");
  const [log, setLog] = useState<{ who: string; text: string }[]>([]);
  const [fb, setFb] = useState<{ ok: boolean; label: string }[]>([]);
  const [rec, setRec] = useState<boolean>(false);
  const [micMsg, setMicMsg] = useState<string>("");
  const [speakOn, setSpeakOn] = useState<boolean>(true);
  const [recObj, setRecObj] = useState<any>(null);

  const W: any = typeof window !== "undefined" ? window : {};
  const SR: any = W.SpeechRecognition || W.webkitSpeechRecognition || null;
  const hasTTS = !!W.speechSynthesis && typeof W.SpeechSynthesisUtterance === "function";
  const AC: any = W.AudioContext || W.webkitAudioContext || null;
  const [actx, setActx] = useState<any>(null);

  const audio = (): any => {
    if (!AC) return null;
    try {
      if (actx) return actx;
      const c = new AC();
      setActx(c);
      return c;
    } catch (_e) {
      return null;
    }
  };
  const beep = (f: number, ms: number) => {
    const c = audio();
    if (!c) return;
    try {
      const o = c.createOscillator();
      const g = c.createGain();
      o.frequency.value = f;
      g.gain.value = 0.06;
      o.connect(g);
      g.connect(c.destination);
      o.start();
      o.stop(c.currentTime + ms / 1000);
    } catch (_e) {
      /* kein Ton */
    }
  };
  const noise = (ms: number) => {
    const c = audio();
    if (!c) return;
    try {
      const n = Math.floor((c.sampleRate * ms) / 1000);
      const b = c.createBuffer(1, n, c.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const s = c.createBufferSource();
      const g = c.createGain();
      g.gain.value = 0.12;
      s.buffer = b;
      s.connect(g);
      g.connect(c.destination);
      s.start();
    } catch (_e) {
      /* kein Ton */
    }
  };
  const speak = (text: string, lang: string) => {
    if (!hasTTS || !speakOn) return;
    try {
      W.speechSynthesis.cancel();
      const u = new W.SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.95;
      W.speechSynthesis.speak(u);
    } catch (_e) {
      /* nur Text */
    }
  };

  /* Tasten des Schemas (Funktionen nach Icom-Bedienungsanleitung IC-M423G/GE, Tastenlage vereinfacht) */
  const RKEYS: { id: RKey; label: string; info: string }[] = [
    { id: "dial", label: "Drehknopf", info: "Kanal wählen: drehen. Im Menü: Eintrag wählen." },
    { id: "push", label: "Knopf drücken", info: "Im Menü: Auswahl bestätigen (Enter)." },
    { id: "k16", label: "16/C", info: "Kurz: sofort Kanal 16 (Not-, Dringlichkeits- und Sicherheitsanrufe). Lang gedrückt: Anrufkanal; Belegung laut Handbuch prüfen." },
    { id: "hilo", label: "HI/LO", info: "Sendeleistung umschalten: HI 25 W, LO 1 W. Grundsatz: so wenig Leistung wie möglich." },
    { id: "dw", label: "DW/TW", info: "Dual Watch: Kanal 16 und Arbeitskanal abwechselnd hören. Tri Watch: zusätzlich der Anrufkanal. Nochmal drücken schaltet weiter/aus (Bedienung laut Handbuch prüfen)." },
    { id: "scan", label: "SCAN", info: "Suchlauf über die markierten (TAG-)Kanäle; stoppt bei Empfang." },
    { id: "sql", label: "SQL", info: "Rauschsperre: so einstellen, dass das Rauschen gerade verschwindet. Zu hoch = schwache Stationen werden unterdrückt." },
    { id: "vol", label: "VOL", info: "Lautstärke." },
    { id: "menu", label: "MENU", info: "Menü: DSC-Anrufe (Individual, Group, All Ships), Positionseingabe, Einstellungen, ATIS-Betrieb." },
    { id: "clr", label: "CLEAR", info: "Zurück / Abbrechen im Menü." },
    { id: "flap", label: "Klappe", info: "Schutzklappe über der DISTRESS-Taste, verhindert Fehlalarme." },
    { id: "distress", label: "DISTRESS", info: "Kurz drücken: Art der Not wählen. 3 Sekunden halten: DSC-Notalarm auf Kanal 70 mit MMSI, Position und Zeit. Danach schaltet das Gerät auf Kanal 16. Im ATIS-Betrieb (binnen) ist DSC gesperrt." },
    { id: "ptt", label: "PTT", info: "Sprechtaste am Mikrofon: drücken und halten zum Senden, loslassen zum Hören. Vorher Kanal abhören!" },
  ];
  const isUBI = certC === "UBI";
  const press = (k: RKey) => {
    beep(k === "distress" ? 1200 : 900, 60);
    setRd((r: Radio) => {
      const n: Radio = { ...r, key: k };
      if (k === "dial") n.ch = r.ch >= 88 ? 1 : r.ch + 1;
      if (k === "k16") { n.ch = 16; n.scan = false; }
      if (k === "hilo") n.hi = !r.hi;
      if (k === "dw") n.dw = (r.dw + 1) % 3;
      if (k === "scan") n.scan = !r.scan;
      if (k === "sql") n.sql = (r.sql + 1) % 11;
      if (k === "vol") n.vol = (r.vol + 1) % 11;
      if (k === "menu") n.menu = !r.menu;
      if (k === "clr") { n.menu = false; n.alarm = 0; }
      if (k === "flap") n.flap = !r.flap;
      if (k === "distress") {
        if (isUBI) return n;
        if (!r.flap) return n;
        n.alarm = r.alarm === 0 ? 1 : 2;
        if (n.alarm === 2) n.ch = 16;
      }
      return n;
    });
    const pr = PROCS().find((p: { id: string }) => p.id === proc);
    if (pr) {
      const st = pr.steps[pstep];
      if (st && st.key === k) {
        setPwarn("");
        setPstep(pstep + 1);
      } else if (st) setPwarn("Nicht ganz: gesucht ist „" + (RKEYS.find((x: { id: RKey }) => x.id === st.key) || { label: st.key }).label + "“.");
    }
  };

  const disp = (): string[] => {
    if (rd.alarm === 1) return ["DISTRESS", "Art der Not wählen,", "dann 3 s halten"];
    if (rd.alarm === 2) return ["DSC-NOTALARM", "gesendet · Kanal 70", "warte auf Bestätigung · CH 16"];
    if (rd.menu) return ["MENU", "DSC Calls · Position", "Settings · Radio"];
    return [String(rd.ch).padStart(2, "0"), (rd.hi ? "HI 25W" : "LO 1W") + (rd.dw === 1 ? " · DUAL" : rd.dw === 2 ? " · TRI" : "") + (rd.scan ? " · SCAN" : ""), (isUBI ? "ATIS" : "DSC") + " · SQL " + rd.sql + " · VOL " + rd.vol];
  };

  const panel = (): ReactNode => {
    const d = disp();
    const k = (id: RKey, x: number, y: number, w: number, h: number, label: string, fill?: string): ReactNode => (
      <g key={id} onClick={() => press(id)} style={{ cursor: "pointer" }}>
        <rect x={x} y={y} width={w} height={h} rx={8} fill={rd.key === id ? accent : fill || t.bg.subtle} stroke={t.border.default} />
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={11} fontFamily={fam} fill={rd.key === id ? t.bg.base : t.text.primary}>{label}</text>
      </g>
    );
    return (
      <svg viewBox="0 0 360 210" width="100%" style={{ maxHeight: 240, display: "block" }} role="img" aria-label="Schema eines UKW-Funkgeräts IC-M423">
        <rect x={2} y={2} width={356} height={206} rx={18} fill={t.bg.elevated} stroke={t.border.default} strokeWidth={2} />
        <rect x={16} y={14} width={200} height={84} rx={8} fill={t.fill.accentSubtle} stroke={t.border.default} />
        <text x={26} y={52} fontSize={rd.menu || rd.alarm ? 18 : 36} fontFamily={t.font.mono} fontWeight={700} fill={rd.alarm ? t.text.danger : t.text.primary}>{d[0]}</text>
        <text x={26} y={72} fontSize={11} fontFamily={t.font.mono} fill={t.text.primary}>{d[1]}</text>
        <text x={26} y={88} fontSize={11} fontFamily={t.font.mono} fill={t.text.secondary}>{d[2]}</text>
        <g onClick={() => press("dial")} style={{ cursor: "pointer" }}>
          <circle cx={270} cy={56} r={34} fill={rd.key === "dial" ? accent : t.bg.subtle} stroke={t.border.default} strokeWidth={2} />
          <text x={270} y={52} textAnchor="middle" fontSize={10} fontFamily={fam} fill={t.text.primary}>Kanal</text>
          <text x={270} y={66} textAnchor="middle" fontSize={10} fontFamily={fam} fill={t.text.primary}>drehen ↻</text>
        </g>
        {k("push", 238, 96, 64, 22, "drücken")}
        <g onClick={() => press(rd.flap ? "distress" : "flap")} style={{ cursor: "pointer" }}>
          <rect x={312} y={20} width={38} height={78} rx={8} fill={rd.flap ? t.text.danger : t.bg.subtle} stroke={t.text.danger} strokeWidth={2} />
          <text x={331} y={54} textAnchor="middle" fontSize={9} fontFamily={fam} fill={rd.flap ? t.bg.base : t.text.danger}>{rd.flap ? "DIS-" : "Klap-"}</text>
          <text x={331} y={66} textAnchor="middle" fontSize={9} fontFamily={fam} fill={rd.flap ? t.bg.base : t.text.danger}>{rd.flap ? "TRESS" : "pe"}</text>
        </g>
        {k("k16", 16, 128, 58, 30, "16/C", t.fill.accentSubtle)}
        {k("hilo", 80, 128, 58, 30, "HI/LO")}
        {k("dw", 144, 128, 58, 30, "DW/TW")}
        {k("scan", 208, 128, 58, 30, "SCAN")}
        {k("clr", 272, 128, 74, 30, "CLEAR")}
        {k("sql", 16, 166, 58, 30, "SQL")}
        {k("vol", 80, 166, 58, 30, "VOL")}
        {k("menu", 144, 166, 58, 30, "MENU")}
        {k("ptt", 208, 166, 138, 30, "PTT (Mikrofon)", t.fill.accentSubtle)}
        {rd.flap ? k("flap", 312, 100, 38, 18, "zu") : null}
      </svg>
    );
  };

  type PStep = { key: RKey; say: string };
  const PROCS = (): { id: string; title: string; steps: PStep[] }[] =>
    isUBI
      ? [
          { id: "u16", title: "Kanal 10 einstellen (Schiff–Schiff) und hören", steps: [{ key: "dial", say: "Drehknopf: Kanal wählen (im Schema eine Raste pro Tipp)." }, { key: "sql", say: "Rauschsperre so einstellen, dass das Rauschen gerade verschwindet." }, { key: "vol", say: "Lautstärke anpassen. Vor dem Senden immer erst hören, ob der Kanal frei ist." }] },
          { id: "upow", title: "Sendeleistung umschalten", steps: [{ key: "hilo", say: "HI/LO drücken. Binnen gilt: Schiff–Schiff, Nautischer Informationsfunk und Hafenfunk höchstens 1 W (UBI-Katalog); im ATIS-Betrieb begrenzt das Gerät auf diesen Kanälen selbst (laut Handbuch prüfen)." }] },
          { id: "udw", title: "Dual Watch einschalten", steps: [{ key: "dw", say: "DW/TW drücken: Kanal 16 und eingestellter Kanal werden abwechselnd überwacht. Hinweis: Auf dem Rhein und anderen Binnenrevieren ist Dual Watch während der Fahrt nicht erlaubt (RheinSchPV/BinSchStrO, laut Vorschrift prüfen)." }, { key: "dw", say: "Nochmal drücken (Tri Watch) …" }, { key: "dw", say: "… und nochmal: wieder aus." }] },
          { id: "uatis", title: "ATIS-Betrieb verstehen", steps: [{ key: "menu", say: "MENU: Im Einstellungsmenü wird ATIS-Betrieb gewählt und die ATIS-Kennung eingegeben (einmalig, durch Fachhandel/Inhaber; laut Handbuch prüfen)." }, { key: "ptt", say: "PTT loslassen sendet automatisch die ATIS-Kennung. Deshalb: ohne gültige ATIS-Kennung kein Binnenfunk." }, { key: "clr", say: "CLEAR: Menü verlassen. Im ATIS-Betrieb sind DSC und die DISTRESS-Taste gesperrt." }] },
        ]
      : [
          { id: "sdist", title: "DSC-Notalarm mit Art der Not", steps: [{ key: "flap", say: "Schutzklappe der DISTRESS-Taste öffnen." }, { key: "distress", say: "DISTRESS kurz drücken: Liste der Notfallarten erscheint." }, { key: "dial", say: "Mit dem Drehknopf die Art der Not wählen, z. B. Flooding (Wassereinbruch)." }, { key: "push", say: "Auswahl bestätigen." }, { key: "distress", say: "DISTRESS 3 Sekunden halten, bis der Alarm gesendet ist. Das Gerät wiederholt den Alarm, bis eine Bestätigung kommt, und schaltet auf Kanal 16." }, { key: "ptt", say: "Auf Kanal 16 den Notanruf und die Notmeldung per Sprechfunk senden (siehe Funk-Simulator)." }] },
          { id: "s16", title: "Kanal 16 hören", steps: [{ key: "k16", say: "16/C kurz drücken: sofort Kanal 16." }, { key: "sql", say: "Rauschsperre einstellen." }, { key: "vol", say: "Lautstärke einstellen. Auf See wird Kanal 16 abgehört." }] },
          { id: "sdw", title: "Dual Watch einschalten", steps: [{ key: "dial", say: "Arbeitskanal wählen, z. B. 72." }, { key: "dw", say: "DW/TW drücken: Kanal 16 wird zusätzlich überwacht." }] },
          { id: "spow", title: "Leistung umschalten", steps: [{ key: "hilo", say: "HI/LO: 1 W für kurze Entfernungen (z. B. Hafen), 25 W für große Reichweite und im Notfall." }] },
          { id: "sind", title: "DSC-Routineanruf (Individual Call)", steps: [{ key: "menu", say: "MENU drücken." }, { key: "dial", say: "„DSC Calls“ wählen …" }, { key: "push", say: "… bestätigen." }, { key: "dial", say: "„Individual Call“ wählen und die MMSI der gerufenen Station eingeben." }, { key: "push", say: "Kategorie Routine und vorgeschlagenen Arbeitskanal (z. B. 72) bestätigen." }, { key: "push", say: "Anruf senden (Call). Nach der Bestätigung auf dem Arbeitskanal per Sprechfunk weiter." }, { key: "clr", say: "CLEAR: zurück zur Kanalanzeige." }] },
          { id: "scan", title: "Fehlalarm abbrechen", steps: [{ key: "clr", say: "Während das Gerät auf Bestätigung wartet: CLEAR bzw. Cancel wählen und bestätigen (genaue Menüfolge laut Handbuch prüfen)." }, { key: "k16", say: "Kanal 16 einstellen." }, { key: "ptt", say: "Per Sprechfunk an alle Funkstellen den Fehlalarm zurücknehmen (SRC 157)." }] },
        ];

  /* Funk-Simulator */
  type Chk = { label: string; re: RegExp; min?: number };
  type Turn = { you: string; model: string; checks: Chk[]; reply: string; replyWho: string };
  type Scn = { id: string; title: string; ch: string; lang: string; intro: string; turns: Turn[] };
  const NAME = /SEEADLER|SEE ADLER|SIERRA ECHO ECHO ALFA DELTA LIMA ECHO ROMEO/g;
  const CALL = /DA ?5005|D ?A ?5 ?0 ?0 ?5|DELTA ALFA FIVE ZERO ZERO FIVE|DELTA ALFA FÜNF NULL NULL FÜNF|DELTA ALPHA/;
  const MMSI = /211 ?123 ?450|TWO ONE ONE ONE TWO THREE FOUR FIVE ZERO/;
  const OVER = /OVER\W*$/;
  const KOMMEN = /(BITTE )?KOMMEN\W*$/;
  const POS = /POSITION|NORTH|NORD|DEGREES|GRAD|MILES|MEILEN|KILOMETER|KM /;
  const SCNS = (): Scn[] =>
    isUBI
      ? [
          { id: "unot", title: "Notverkehr: Leck, an die Revierzentrale", ch: "Kanal der Revierzentrale (NIF)", lang: "de-DE", intro: "Motoryacht Seeadler, Rufzeichen DA5005, Rhein-km 550, Wassereinbruch, 3 Personen. Du rufst die Revierzentrale Oberwesel.", turns: [
            { you: "Notanruf und Notmeldung", model: "MAYDAY MAYDAY MAYDAY / HIER IST / SEEADLER SEEADLER SEEADLER / DA5005 / MAYDAY SEEADLER DA5005 / POSITION RHEIN-KILOMETER 550 / WASSEREINBRUCH / ICH BENÖTIGE SOFORTIGE HILFE / 3 PERSONEN AN BORD / BITTE KOMMEN", checks: [{ label: "MAYDAY (3x im Anruf, 1x vor der Meldung)", re: /MAYDAY/g, min: 4 }, { label: "HIER IST", re: /HIER IST/ }, { label: "Schiffsname 3x", re: NAME, min: 3 }, { label: "Rufzeichen", re: CALL }, { label: "Ortsangabe", re: POS }, { label: "Art der Not", re: /WASSER|LECK|FEUER|BRAND|SINK|KENTER|ÜBER BORD/ }, { label: "erbetene Hilfe", re: /HILFE|ASSISTENZ|SCHLEPP/ }, { label: "Personen an Bord", re: /PERSON/ }, { label: "Abschluss BITTE KOMMEN", re: KOMMEN }], replyWho: "Revierzentrale Oberwesel", reply: "MAYDAY SEEADLER SEEADLER SEEADLER DA5005, HIER IST OBERWESEL REVIERZENTRALE, MAYDAY EMPFANGEN. Hilfe ist unterwegs. Melden Sie, ob Sie Ihr Schiff ans Ufer steuern können. BITTE KOMMEN." },
            { you: "Antwort an die Revierzentrale", model: "MAYDAY / OBERWESEL REVIERZENTRALE / HIER IST SEEADLER DA5005 / VERSTANDEN, ICH STEUERE ANS RECHTE UFER / BITTE KOMMEN", checks: [{ label: "MAYDAY vor jeder Meldung", re: /MAYDAY/ }, { label: "Gerufene Stelle", re: /OBERWESEL|REVIERZENTRALE/ }, { label: "HIER IST + Name", re: /HIER IST.*SEEADLER/ }, { label: "Abschluss BITTE KOMMEN", re: KOMMEN }], replyWho: "Revierzentrale Oberwesel", reply: "MAYDAY SEEADLER, HIER IST OBERWESEL REVIERZENTRALE, VERSTANDEN. Polizeiboot ist in 10 Minuten bei Ihnen. ENDE." },
          ] },
          { id: "uschl", title: "Schleuse anrufen (Routine)", ch: "Kanal der Schleuse (Hafenfunk/Schleusenfunk)", lang: "de-DE", intro: "Du näherst dich der Schleuse Iffezheim zu Berg und möchtest schleusen.", turns: [
            { you: "Anruf und Anliegen", model: "IFFEZHEIM SCHLEUSE / HIER IST / SEEADLER / DA5005 / ZU BERG, ERBITTE SCHLEUSUNG / BITTE KOMMEN", checks: [{ label: "Gerufene Stelle zuerst", re: /^\W*(SCHLEUSE )?IFFEZHEIM/ }, { label: "HIER IST", re: /HIER IST/ }, { label: "Eigener Name", re: NAME }, { label: "Anliegen", re: /SCHLEUS/ }, { label: "Abschluss BITTE KOMMEN", re: KOMMEN }], replyWho: "Schleuse Iffezheim", reply: "SEEADLER, HIER IST IFFEZHEIM SCHLEUSE. Fahren Sie in die rechte Kammer ein, Einfahrt bei grünem Licht. BITTE KOMMEN." },
            { you: "Bestätigen", model: "IFFEZHEIM SCHLEUSE / HIER IST SEEADLER / VERSTANDEN, RECHTE KAMMER BEI GRÜN / ENDE", checks: [{ label: "Gerufene Stelle", re: /IFFEZHEIM/ }, { label: "HIER IST + Name", re: /HIER IST.*SEEADLER/ }, { label: "Wiederholung der Anweisung", re: /RECHTE|GRÜN/ }, { label: "Abschluss ENDE", re: /ENDE\W*$/ }], replyWho: "Schleuse Iffezheim", reply: "ENDE." },
          ] },
          { id: "uss", title: "Schiff–Schiff: Begegnung absprechen", ch: "Kanal 10", lang: "de-DE", intro: "Talfahrer MS Rheinstern kommt dir in einer Engstelle entgegen. Du sprichst die Begegnung ab.", turns: [
            { you: "Anruf", model: "RHEINSTERN / HIER IST / SEEADLER / BERGFAHRER BEI KILOMETER 553 / BEGEGNUNG BACKBORD AN BACKBORD? / BITTE KOMMEN", checks: [{ label: "Gerufenes Schiff zuerst", re: /^\W*RHEINSTERN/ }, { label: "HIER IST", re: /HIER IST/ }, { label: "Eigener Name", re: NAME }, { label: "Ort / Fahrtrichtung", re: /KILOMETER|BERG|POSITION/ }, { label: "Abschluss BITTE KOMMEN", re: KOMMEN }], replyWho: "MS Rheinstern", reply: "SEEADLER, HIER IST RHEINSTERN. Einverstanden, Begegnung Backbord an Backbord. BITTE KOMMEN." },
            { you: "Bestätigen", model: "RHEINSTERN / HIER IST SEEADLER / VERSTANDEN, BACKBORD AN BACKBORD / ENDE", checks: [{ label: "HIER IST + Name", re: /HIER IST.*SEEADLER/ }, { label: "Wiederholung", re: /BACKBORD/ }, { label: "Abschluss ENDE", re: /ENDE\W*$/ }], replyWho: "MS Rheinstern", reply: "ENDE." },
          ] },
        ]
      : [
          { id: "smay", title: "MAYDAY nach DSC-Notalarm", ch: "Kanal 16, 25 W", lang: "en-GB", intro: "Segelyacht Seeadler, DA5005, MMSI 211123450, 54°25'N 010°12'E, Wassereinbruch, 4 Personen. Der DSC-Notalarm ist gesendet.", turns: [
            { you: "Notanruf und Notmeldung", model: "MAYDAY MAYDAY MAYDAY / THIS IS / SEEADLER SEEADLER SEEADLER / DA5005 / MMSI 211123450 / MAYDAY SEEADLER DA5005 211123450 / POSITION 54 DEGREES 25 MINUTES NORTH 010 DEGREES 12 MINUTES EAST / I AM TAKING WATER / I REQUIRE IMMEDIATE ASSISTANCE / 4 PERSONS ON BOARD / OVER", checks: [{ label: "MAYDAY (3x Anruf + 1x Meldung)", re: /MAYDAY/g, min: 4 }, { label: "THIS IS", re: /THIS IS/ }, { label: "Schiffsname 3x", re: NAME, min: 3 }, { label: "Rufzeichen", re: CALL }, { label: "MMSI", re: MMSI }, { label: "Position", re: POS }, { label: "Art der Not", re: /WATER|FLOOD|FIRE|SINK|CAPSIZ|OVERBOARD|AGROUND|EXPLOSION/ }, { label: "erbetene Hilfe", re: /ASSISTANCE|HELP|REQUIRE/ }, { label: "Personen an Bord", re: /PERSON|PEOPLE|ON BOARD|CREW/ }, { label: "Abschluss OVER", re: OVER }], replyWho: "Bremen Rescue", reply: "MAYDAY SEEADLER SEEADLER SEEADLER DA5005 211123450, THIS IS BREMEN RESCUE BREMEN RESCUE BREMEN RESCUE, RECEIVED MAYDAY. Rescue boat is on the way. Put on lifejackets. Report your situation every 15 minutes. OVER." },
            { you: "Antwort an Bremen Rescue", model: "MAYDAY / BREMEN RESCUE / THIS IS SEEADLER DA5005 / RECEIVED, LIFEJACKETS ON / OVER", checks: [{ label: "MAYDAY vor jeder Meldung", re: /MAYDAY/ }, { label: "Gerufene Stelle", re: /BREMEN/ }, { label: "THIS IS + Name", re: /THIS IS.*SEEADLER/ }, { label: "Abschluss OVER", re: OVER }], replyWho: "Bremen Rescue", reply: "MAYDAY ALL STATIONS ALL STATIONS ALL STATIONS, THIS IS BREMEN RESCUE, SEELONCE MAYDAY. OUT." },
          ] },
          { id: "span", title: "PAN PAN: Motorschaden", ch: "Kanal 16 (nach DSC-Urgency)", lang: "en-GB", intro: "Motorschaden, kein Wind, du treibst 3 sm vor der Küste, keine unmittelbare Gefahr.", turns: [
            { you: "Dringlichkeitsmeldung an alle", model: "PAN PAN PAN PAN PAN PAN / ALL STATIONS ALL STATIONS ALL STATIONS / THIS IS / SEEADLER SEEADLER SEEADLER / DA5005 / 211123450 / POSITION 3 MILES NORTH OF FEHMARN / ENGINE FAILURE, DRIFTING / I REQUIRE TOW / OVER", checks: [{ label: "PAN PAN 3x", re: /PAN ?PAN|PANPAN/g, min: 3 }, { label: "ALL STATIONS 3x", re: /ALL STATIONS/g, min: 3 }, { label: "THIS IS", re: /THIS IS/ }, { label: "Schiffsname 3x", re: NAME, min: 3 }, { label: "Rufzeichen", re: CALL }, { label: "MMSI", re: MMSI }, { label: "Position", re: POS }, { label: "Sachverhalt", re: /ENGINE|FAILURE|DRIFT|RUDDER|MAST|INJUR/ }, { label: "erbetene Hilfe", re: /TOW|ASSISTANCE|REQUIRE|HELP/ }, { label: "Abschluss OVER", re: OVER }], replyWho: "Bremen Rescue", reply: "PAN PAN SEEADLER, THIS IS BREMEN RESCUE, RECEIVED PAN PAN. A tow is arranged, expected in one hour. Keep watch on channel 16. OVER." },
          ] },
          { id: "ssec", title: "SÉCURITÉ: treibender Container", ch: "Ankündigung Kanal 16, Meldung Arbeitskanal", lang: "en-GB", intro: "Du siehst einen treibenden Container – Gefahr für die Schifffahrt.", turns: [
            { you: "Sicherheitsmeldung an alle", model: "SECURITE SECURITE SECURITE / ALL STATIONS ALL STATIONS ALL STATIONS / THIS IS / SEEADLER SEEADLER SEEADLER / DA5005 / 211123450 / DRIFTING CONTAINER IN POSITION 54 DEGREES 20 MINUTES NORTH 011 DEGREES 05 MINUTES EAST / DANGER TO NAVIGATION / OUT", checks: [{ label: "SECURITE 3x", re: /SECURIT|SAY CURE|SECURI TAY/g, min: 3 }, { label: "ALL STATIONS 3x", re: /ALL STATIONS/g, min: 3 }, { label: "THIS IS", re: /THIS IS/ }, { label: "Schiffsname 3x", re: NAME, min: 3 }, { label: "Rufzeichen", re: CALL }, { label: "Position", re: POS }, { label: "Gefahr", re: /CONTAINER|DANGER|OBJECT|BUOY/ }, { label: "Abschluss OUT (keine Antwort erwartet)", re: /OUT\W*$/ }], replyWho: "–", reply: "(Keine Antwort erwartet. Bei Bedarf meldet Bremen Rescue die Gefahr weiter.)" },
          ] },
          { id: "sroute", title: "Routine: Schiff–Schiff mit Kanalwechsel", ch: "Anruf Kanal 16 (oder DSC), Gespräch Kanal 72", lang: "en-GB", intro: "Du rufst die Yacht Albatros, um dich zu verabreden. Gespräch auf einem Schiff–Schiff-Kanal, z. B. 72.", turns: [
            { you: "Anruf mit Kanalvorschlag", model: "ALBATROS ALBATROS / THIS IS / SEEADLER SEEADLER / DA5005 / CHANNEL 72 PLEASE / OVER", checks: [{ label: "Gerufene Station zuerst", re: /^\W*ALBATROS/ }, { label: "THIS IS", re: /THIS IS/ }, { label: "Eigener Name", re: NAME }, { label: "Arbeitskanal", re: /CHANNEL|72|77|SEVEN/ }, { label: "Abschluss OVER", re: OVER }], replyWho: "Yacht Albatros", reply: "SEEADLER, THIS IS ALBATROS, CHANNEL 72. OVER." },
            { you: "Auf Kanal 72: Gespräch und Ende", model: "ALBATROS / THIS IS SEEADLER / WE ARRIVE IN BURGTIEFE AT 1800, MEET YOU THERE / OUT", checks: [{ label: "THIS IS + Name", re: /THIS IS.*SEEADLER/ }, { label: "Abschluss OUT", re: /OUT\W*$/ }], replyWho: "Yacht Albatros", reply: "SEEADLER, THIS IS ALBATROS, RECEIVED, SEE YOU. OUT." },
          ] },
          { id: "srelay", title: "MAYDAY RELAY", ch: "Kanal 16", lang: "en-GB", intro: "Du hörst den Notruf der Yacht Möwe (DB1234) mit Feuer an Bord, niemand bestätigt. Du kannst selbst nicht helfen und leitest weiter.", turns: [
            { you: "Weiterleitung", model: "MAYDAY RELAY MAYDAY RELAY MAYDAY RELAY / ALL STATIONS ALL STATIONS ALL STATIONS / THIS IS / SEEADLER SEEADLER SEEADLER / DA5005 / 211123450 / FOLLOWING RECEIVED FROM YACHT MOEWE DB1234 / POSITION 54 DEGREES 30 MINUTES NORTH 010 DEGREES 40 MINUTES EAST / FIRE ON BOARD / REQUIRES IMMEDIATE ASSISTANCE / OVER", checks: [{ label: "MAYDAY RELAY 3x", re: /MAYDAY RELAY/g, min: 3 }, { label: "ALL STATIONS (oder Küstenfunkstelle)", re: /ALL STATIONS|BREMEN/ }, { label: "THIS IS", re: /THIS IS/ }, { label: "Eigener Name 3x", re: NAME, min: 3 }, { label: "Schiff in Not", re: /MOEWE|MÖWE|MOWE/ }, { label: "Position", re: POS }, { label: "Art der Not", re: /FIRE|WATER|SINK/ }, { label: "Abschluss OVER", re: OVER }], replyWho: "Bremen Rescue", reply: "MAYDAY RELAY SEEADLER, THIS IS BREMEN RESCUE, RECEIVED MAYDAY RELAY. We take over. OVER." },
          ] },
          { id: "sack", title: "Notmeldung bestätigen (RECEIVED MAYDAY)", ch: "Kanal 16", lang: "en-GB", intro: "Yacht Möwe meldet Feuer, 2 sm von dir. Keine Küstenfunkstelle bestätigt, du kannst helfen.", turns: [
            { you: "Bestätigung", model: "MAYDAY / MOEWE MOEWE MOEWE / DB1234 / THIS IS / SEEADLER SEEADLER SEEADLER / DA5005 / RECEIVED MAYDAY / I AM 2 MILES SOUTH, ETA 20 MINUTES / OVER", checks: [{ label: "MAYDAY", re: /MAYDAY/ }, { label: "Name des Notfahrzeugs 3x", re: /MOEWE|MÖWE|MOWE/g, min: 3 }, { label: "THIS IS", re: /THIS IS/ }, { label: "Eigener Name 3x", re: NAME, min: 3 }, { label: "RECEIVED MAYDAY", re: /RECEIVED MAYDAY/ }, { label: "Abschluss OVER", re: OVER }], replyWho: "Yacht Möwe", reply: "MAYDAY SEEADLER, THIS IS MOEWE, RECEIVED. We are abandoning to the liferaft. OVER." },
          ] },
        ];

  const curScn = (): Scn | undefined => SCNS().find((s: Scn) => s.id === scn);
  const evaluate = (text: string) => {
    const s = curScn();
    if (!s) return;
    const tr = s.turns[turn];
    if (!tr) return;
    const up = text.toUpperCase().replace(/[.,;!?]/g, " ").replace(/\s+/g, " ").trim();
    const res = tr.checks.map((c: Chk) => {
      const m = up.match(new RegExp(c.re.source, "g"));
      return { ok: (m ? m.length : 0) >= (c.min || 1), label: c.label };
    });
    setFb(res);
    const nl = [...log, { who: "Du", text: up }];
    noise(350);
    if (res.every((r: { ok: boolean }) => r.ok)) {
      nl.push({ who: tr.replyWho, text: tr.reply });
      setTimeout(() => speak(tr.reply, s.lang), 500);
    }
    setLog(nl);
  };
  const startScn = (id: string) => {
    setScn(id);
    setTurn(0);
    setSaid("");
    setLog([]);
    setFb([]);
  };
  const pttDown = () => {
    beep(1000, 40);
    if (!SR) {
      setMicMsg("Spracherkennung ist in diesem Browser nicht verfügbar. Tippe die Bausteine an oder schreibe den Funkspruch.");
      return;
    }
    try {
      const r = new SR();
      const s = curScn();
      r.lang = s ? s.lang : "de-DE";
      r.continuous = true;
      r.interimResults = true;
      r.onresult = (e: any) => {
        let txtAll = "";
        for (let i = 0; i < e.results.length; i++) txtAll += e.results[i][0].transcript + " ";
        setSaid(txtAll.trim());
      };
      r.onerror = (e: any) => {
        setRec(false);
        setMicMsg(e && (e.error === "not-allowed" || e.error === "service-not-allowed") ? "Mikrofon blockiert (in dieser Seitenumgebung oder durch den Browser). Nutze die Bausteine oder tippe den Funkspruch." : "Spracherkennung fehlgeschlagen (" + (e ? e.error : "?") + "). Nutze die Bausteine oder tippe.");
      };
      r.onend = () => setRec(false);
      r.start();
      setRecObj(r);
      setRec(true);
      setMicMsg("");
    } catch (_e) {
      setMicMsg("Mikrofon konnte nicht gestartet werden. Nutze die Bausteine oder tippe.");
    }
  };
  const pttUp = () => {
    if (recObj) {
      try {
        recObj.stop();
      } catch (_e) {
        /* schon gestoppt */
      }
    }
    setRecObj(null);
    setRec(false);
    noise(300);
  };

  const simScreen = (s: Scn): ReactNode => {
    const tr = s.turns[turn];
    const allOk = fb.length > 0 && fb.every((r: { ok: boolean }) => r.ok);
    const parts = tr ? tr.model.split(" / ") : [];
    const pages: ReactNode[] = [
      card(
        <>
          <span style={txt("label", t.text.secondary)}>{"Lage · " + s.ch + " · Sprache " + (s.lang === "en-GB" ? "Englisch" : "Deutsch")}</span>
          <span style={txt("body1", t.text.primary)}>{s.intro}</span>
          {log.map((l: { who: string; text: string }, i: number) => (
            <div key={i} style={{ borderLeft: "4px solid " + (l.who === "Du" ? accent : accent3), paddingLeft: 10, display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={txt("label", t.text.tertiary)}>{l.who}</span>
              <span style={{ ...txt("body2", t.text.primary), fontFamily: t.font.mono }}>{l.text}</span>
            </div>
          ))}
          {tr ? (
            <>
              <span style={txt("body2", t.text.primary, t.weight.semibold)}>{"Dein Spruch " + (turn + 1) + "/" + s.turns.length + ": " + tr.you}</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                <button
                  type="button"
                  onPointerDown={pttDown}
                  onPointerUp={pttUp}
                  onPointerLeave={() => (rec ? pttUp() : undefined)}
                  style={{ padding: "12px 20px", borderRadius: t.radius.full, border: "2px solid " + (rec ? t.text.danger : accent), background: rec ? t.text.danger : t.fill.accentSubtle, color: rec ? t.bg.base : t.text.primary, fontFamily: fam, fontWeight: t.weight.semibold, cursor: "pointer", touchAction: "none", userSelect: "none" }}
                >
                  {rec ? "● Sende … loslassen zum Beenden" : "PTT halten und sprechen"}
                </button>
                <Button label="Funkspruch prüfen" variant="primary" onClick={() => evaluate(said)} disabled={said.trim() === ""} />
                {allOk && turn + 1 < s.turns.length ? <Button label="Nächster Spruch" onClick={() => { setTurn(turn + 1); setSaid(""); setFb([]); }} /> : null}
              </div>
              {micMsg ? <span style={txt("label", t.text.warning)}>{micMsg}</span> : null}
              <Input label="Gesendeter Text (Sprache, Bausteine oder tippen)" value={said} onChange={(v: string) => setSaid(v)} />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {parts.map((p: string, i: number) => chip("pb" + i, p, false, () => setSaid((said + " " + p).trim())))}
                {chip("pbx", "⌫ leeren", false, () => setSaid(""))}
              </div>
            </>
          ) : null}
        </>,
        { padding: 14, gap: 10 },
      ),
    ];
    if (fb.length > 0) {
      pages.push(
        card(
          <>
            <Status tone={allOk ? "success" : "warning"}>{allOk ? "Spruch vollständig – Gegenstelle antwortet" : "Noch nicht vollständig"}</Status>
            {fb.map((r: { ok: boolean; label: string }) => (
              <span key={r.label} style={txt("body2", r.ok ? t.text.success : t.text.danger)}>{(r.ok ? "✓ " : "✗ ") + r.label}</span>
            ))}
            {tr ? <span style={{ ...txt("label", t.text.secondary), fontFamily: t.font.mono }}>{"Muster: " + tr.model.split(" / ").join(" ")}</span> : null}
          </>,
          { padding: 14, gap: 6 },
        ),
      );
    }
    return pager(pages);
  };

  const fgHome = (): ReactNode => {
    const tiles: Tile[] = [
      { id: "panel", title: "Gerät erkunden", sub: "Tasten antippen: Funktion + Anzeige" },
      { id: "ablauf", title: "Bedienung üben", sub: PROCS2().length + " Abläufe nach Bedienungsanleitung" },
      { id: "menue", title: "Menüstruktur", sub: "Alle Menüs mit Seitenangaben" },
      { id: "sim", title: "Funk-Simulator", sub: SCNS().length + " Szenarien mit Antwort der Gegenstelle" },
    ];
    return tileGrid(tiles, 6, 220, open);
  };
  const panelScreen = (): ReactNode => {
    const ki = RKEYS.find((x: { id: RKey }) => x.id === rd.key);
    return (
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {panel()}
        {card(
          <>
            <span style={txt("body1", t.text.primary, t.weight.semibold)}>{ki ? ki.label : "Tippe eine Taste an"}</span>
            <span style={txt("body2", t.text.secondary)}>{ki ? ki.info : "Vereinfachtes Schema des Icom IC-M423 (Tastenlage nicht maßstabsgetreu). Funktionen nach Bedienungsanleitung; Details laut Handbuch prüfen."}</span>
            {isUBI && ki && ki.id === "distress" ? <span style={txt("label", t.text.warning)}>UBI: Im ATIS-Betrieb reagiert die DISTRESS-Taste nicht, der Notruf erfolgt per Sprechfunk.</span> : null}
            <div style={rowWrap}>
              <Button label="Gerät zurücksetzen" variant="quiet" onClick={() => setRd(RADIO0)} />
            </div>
          </>,
          { padding: 14, gap: 6 },
        )}
      </div>
    );
  };
  const procScreen = (): ReactNode => {
    const p = PROCS().find((x: { id: string }) => x.id === proc);
    if (!p) return null;
    const done = pstep >= p.steps.length;
    return (
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {bar(pstep, p.steps.length)}
        {card(
          <>
            <span style={txt("label", t.text.secondary)}>{done ? "Geschafft" : "Schritt " + (pstep + 1) + " von " + p.steps.length}</span>
            <span style={txt("body1", t.text.primary)}>{done ? "Ablauf komplett. Wiederholen festigt die Griffe." : p.steps[pstep].say}</span>
            {pwarn ? <span style={txt("label", t.text.danger)}>{pwarn}</span> : null}
            {done ? <div style={rowWrap}><Button label="Nochmal" variant="primary" onClick={() => { setPstep(0); setRd(RADIO0); }} /></div> : null}
          </>,
          { padding: 14, gap: 6 },
        )}
        {panel()}
      </div>
    );
  };

  /* ---------- Funkgerät v2: nach Icom-Bedienungsanleitung IC-M423/M423G/M423GE (deutsch, A7197D-1EX-8, Juni 2020) ---------- */
  type MNode = { n: string; p?: number; c?: MNode[]; o?: string[]; set?: string };
  const MENU_TREE: MNode[] = [
    { n: "DSC Calls", c: [{ n: "Individual Call", p: 28, o: ["Manual Input"], set: "ind" }, { n: "Group Call", p: 32 }, { n: "All Ships Call", p: 34 }, { n: "Distress Call", p: 25, o: ["Undesignated", "Fire, Explosion", "Flooding", "Collision", "Grounding", "Capsizing", "Sinking", "Adrift", "Abandoning ship", "Piracy", "Man Overboard"], set: "nature" }, { n: "Received Call Log", p: 53 }, { n: "Transmitted Call Log", p: 52 }, { n: "Test Call", p: 35 }] },
    { n: "DSC Settings", c: [{ n: "Position Input", p: 23 }, { n: "Individual ID", p: 20 }, { n: "Group ID", p: 21 }, { n: "Individual ACK", p: 55 }, { n: "Position ACK", p: 55 }, { n: "Test ACK", p: 55 }, { n: "CH 16 Switch", p: 56 }, { n: "Alarm", p: 57 }, { n: "CH 70 SQL Level", p: 57 }, { n: "DSC Loop Test", p: 58 }] },
    { n: "Radio Settings", c: [{ n: "Scan Type", p: 66, o: ["Normal Scan", "Priority Scan"], set: "scant" }, { n: "Scan Timer", p: 66, o: ["OFF", "ON"], set: "scantm" }, { n: "Dual/Tri-Watch", p: 66, o: ["Dualwatch", "Tri-watch"], set: "dwt" }, { n: "CHAN Group", p: 66, o: ["INT", "ATIS", "DSC"], set: "grp" }, { n: "CH Display", p: 66, o: ["3 Digits", "4 Digits"], set: "chd" }] },
    { n: "Configuration", c: [{ n: "Backlight", p: 67 }, { n: "Display Contrast", p: 67 }, { n: "Key Beep", p: 67 }, { n: "Key Assignment", p: 67 }, { n: "UTC Offset", p: 68 }, { n: "Noise Cancel", p: 68 }, { n: "Inactivity Timer", p: 69 }, { n: "NMEA Output", p: 70 }, { n: "Remote ID", p: 71 }] },
    { n: "MMSI/GPS Info", p: 65 },
  ];
  type R2 = { ch: number; prev: number; call: boolean; hi: boolean; dw: number; scan: boolean; vol: number; sql: number; knob: number; grp: string; dwt: string; scant: string; sk: number; scr: string; mp: number[]; cur: number; nature: string; flap: boolean; tx: boolean; key: string; on: boolean };
  const R20: R2 = { ch: 16, prev: 72, call: false, hi: true, dw: 0, scan: false, vol: 5, sql: 2, knob: 0, grp: certC === "UBI" ? "ATIS" : "INT", dwt: "Dualwatch", scant: "Priority Scan", sk: 0, scr: "main", mp: [], cur: 0, nature: "Undesignated", flap: false, tx: false, key: "", on: true };
  const [r2, setR2] = useState<R2>(R20);
  const [proc2, setProc2] = useState<string>("");
  const [ps2, setPs2] = useState<number>(0);
  const [pw2, setPw2] = useState<string>("");
  const SOFT: string[][] = [["SCAN", "DW", "HI/LO", "CHAN"], ["TAG", "NAME", "BKLT", "LOG"]];
  /* Welche Kanäle fest auf 1 W stehen, nennt das Handbuch nicht einzeln (S. 3, 12); hier daher nicht gesperrt. */
  const lowOnly = (_s: R2): boolean => false;
  const nodeAt = (mp: number[]): MNode[] => {
    let lst: MNode[] = MENU_TREE;
    for (const i of mp) {
      const nd = lst[i];
      if (!nd) return lst;
      if (nd.c) lst = nd.c;
      else if (nd.o) return nd.o.map((x: string) => ({ n: x }));
    }
    return lst;
  };
  const parentNode = (mp: number[]): MNode | undefined => {
    let lst: MNode[] = MENU_TREE;
    let nd: MNode | undefined = undefined;
    for (const i of mp) {
      nd = lst[i];
      if (!nd) return undefined;
      lst = nd.c || [];
    }
    return nd;
  };
  const nextCh = (c: number, d: number): number => {
    let n = c + d;
    if (n > 88) n = 1;
    if (n < 1) n = 88;
    if (n === 70) n += d;
    return n;
  };
  const softLabels = (s: R2): string[] => {
    if (s.scr === "menu") return ["EXIT", "BACK", "ENT", ""];
    if (s.scr === "dsent") return ["RESEND", "INFO", "CANCEL", ""];
    if (s.scr === "can1") return ["BACK", "", "CONTINUE", ""];
    if (s.scr === "can2") return ["EXIT", "", "FINISH", ""];
    if (s.scr === "can3" || s.scr === "info") return ["EXIT", "", "", ""];
    if (s.scr === "iconf") return ["EXIT", "BACK", "CALL", ""];
    if (s.scr === "iwait") return ["EXIT", "", "", ""];
    if (s.scr === "iack") return ["ALARM OFF", "", "", ""];
    return SOFT[s.sk];
  };
  const reduce2 = (s0: R2, k: string): R2 => {
    const s: R2 = { ...s0, key: k, tx: false };
    if (!s.on && k !== "pwr") return s;
    if (k === "pwr") { s.on = !s0.on; s.scr = "main"; return s; }
    if (k === "flap") { s.flap = !s0.flap; return s; }
    if (k === "distress") {
      if (!s0.flap) return s;
      s.scr = "dsent"; s.ch = 70; s.dw = 0; s.scan = false; s.mp = []; return s;
    }
    if (k === "ptt") { s.tx = true; return s; }
    if (k === "k16") { if (s.scr === "main") { s.prev = s0.ch === 16 ? s0.prev : s0.ch; s.ch = 16; s.call = false; s.scan = false; } return s; }
    if (k === "k16l") { if (s.scr === "main") { s.ch = s0.grp === "ATIS" ? 10 : 9; s.call = true; } return s; }
    if (k === "hl") { if (s.scr === "main" && !lowOnly(s0)) s.hi = !s0.hi; return s; }
    if (k === "push") { if (s.scr === "menu") return reduce2(s0, "ent"); s.knob = (s0.knob + 1) % 3; return s; }
    if (k === "kup" || k === "kdn" || k === "up" || k === "dn" || k === "mup" || k === "mdn") {
      const d = k === "kup" || k === "up" || k === "mup" ? 1 : -1;
      if (s.scr === "menu") {
        const n = nodeAt(s0.mp).length;
        s.cur = (s0.cur - d + n) % n;
        return s;
      }
      if (s.scr !== "main") return s;
      if ((k === "kup" || k === "kdn") && s0.knob === 0) { s.vol = Math.max(0, Math.min(10, s0.vol + d)); return s; }
      if ((k === "kup" || k === "kdn") && s0.knob === 1) { s.sql = Math.max(0, Math.min(10, s0.sql + d)); return s; }
      s.ch = nextCh(s0.ch, d); s.call = false;
      if (lowOnly(s)) s.hi = false;
      return s;
    }
    if (k === "left" || k === "right") { if (s.scr === "main") s.sk = (s0.sk + 1) % 2; return s; }
    if (k === "menu") { s.scr = s0.scr === "menu" ? "main" : "menu"; s.mp = []; s.cur = 0; return s; }
    if (k === "clear") {
      if (s0.scr === "menu") { if (s0.mp.length === 0) s.scr = "main"; else { s.cur = s0.mp[s0.mp.length - 1]; s.mp = s0.mp.slice(0, -1); } return s; }
      if (s0.scan) { s.scan = false; return s; }
      if (s0.scr === "iconf") { s.scr = "menu"; return s; }
      return s;
    }
    if (k === "ent") {
      if (s0.scr === "iconf") return reduce2(s0, "s3");
      if (s0.scr !== "menu") return s;
      const lst = nodeAt(s0.mp);
      const nd = lst[s0.cur];
      const par = parentNode(s0.mp);
      if (par && par.o && par.set) {
        const v = par.o[s0.cur];
        if (par.set === "grp") { s.grp = v; s.ch = v === "ATIS" ? 10 : 16; }
        if (par.set === "dwt") s.dwt = v;
        if (par.set === "scant") s.scant = v;
        if (par.set === "nature") { s.nature = v; s.scr = "dconf"; s.mp = []; return s; }
        if (par.set === "ind") { s.scr = "ich"; s.mp = []; return s; }
        return s;
      }
      if (nd && (nd.c || nd.o)) { s.mp = [...s0.mp, s0.cur]; s.cur = 0; return s; }
      return s;
    }
    if (k === "s1" || k === "s2" || k === "s3" || k === "s4") {
      const lab = softLabels(s0)[Number(k.slice(1)) - 1];
      s.key = "sk:" + lab;
      if (lab === "SCAN") { s.scan = !s0.scan; s.dw = 0; }
      if (lab === "DW") { s.dw = s0.dw > 0 ? 0 : s0.dwt === "Tri-watch" ? 2 : 1; s.scan = false; }
      if (lab === "HI/LO" && !lowOnly(s0)) s.hi = !s0.hi;
      if (lab === "CHAN") { s.ch = s0.prev; s.call = false; }
      if (lab === "EXIT") { s.scr = "main"; s.mp = []; if (s0.scr === "can3") s.ch = 16; }
      if (lab === "BACK") { if (s0.scr === "can1") s.scr = "dsent"; else if (s0.scr === "iconf") s.scr = "ich"; else return reduce2(s0, "clear"); }
      if (lab === "ENT") return { ...reduce2(s0, "ent"), key: "sk:ENT" };
      if (lab === "CANCEL") s.scr = "can1";
      if (lab === "CONTINUE") s.scr = "can2";
      if (lab === "FINISH") { s.scr = "can3"; s.ch = 16; }
      if (lab === "INFO") s.scr = "info";
      if (lab === "CALL") { s.scr = "iwait"; }
      if (lab === "ALARM OFF") { s.scr = "main"; s.ch = 72; }
      return s;
    }
    if (k === "ack") { if (s0.scr === "iwait") s.scr = "iack"; return s; }
    return s;
  };
  /* Zusatzschritte der DSC-Abläufe (Kanalwahl, Bestätigung) */
  const reduceX = (s0: R2, k: string): R2 => {
    if (s0.scr === "ich" && (k === "ent" || k === "push")) return { ...s0, key: k, scr: "iconf" };
    if (s0.scr === "dconf" && (k === "clear" || k === "menu")) return { ...s0, key: k, scr: "main" };
    return reduce2(s0, k);
  };

  type P2 = { say: string; ok: (s: R2) => boolean };
  const PROCS2 = (): { id: string; title: string; steps: P2[] }[] => {
    const common = [
      { id: "vs", title: "Einschalten, Lautstärke & Squelch (S. 12–13)", steps: [
        { say: "Gerät ist aus. [VOL/SQL•PWR] 1 Sek. drücken zum Einschalten (hier: Taste PWR).", ok: (s: R2) => s.on && s.key === "pwr" },
        { say: "Auf den [VOL/SQL]-Regler drücken, bis das Squelch-Fenster (SQL) erscheint.", ok: (s: R2) => s.knob === 1 },
        { say: "Regler drehen: Squelch erst öffnen (ganz zurück auf OPEN) …", ok: (s: R2) => s.sql === 0 },
        { say: "… dann so weit hochdrehen, bis das Rauschen gerade verschwindet (z. B. Stufe 2).", ok: (s: R2) => s.sql >= 2 },
      ] },
      { id: "k16", title: "Kanal 16, Anrufkanal, zurück (S. 10)", steps: [
        { say: "Mit [∧•CH]/[∨•CH] einen Arbeitskanal wählen.", ok: (s: R2) => s.ch !== 16 && s.scr === "main" },
        { say: "[16/C] kurz drücken: Kanal 16.", ok: (s: R2) => s.ch === 16 && s.key === "k16" },
        { say: "Softkey [CHAN] drücken: zurück zum vorherigen Betriebskanal.", ok: (s: R2) => s.key === "sk:CHAN" },
        { say: "[16/C] 1 Sek. drücken: Anrufkanal der Kanalgruppe („CALL“ im Display).", ok: (s: R2) => s.call },
      ] },
      { id: "pow", title: "Sendeleistung 25 W / 1 W (S. 12)", steps: [
        { say: "Softkey [HI/LO] drücken (oder [H/L] am Mikrofon). Display: „25W“ bzw. „1W“. Auf einigen Kanälen ist hohe Leistung gesperrt.", ok: (s: R2) => s.key === "sk:HI/LO" || s.key === "hl" },
      ] },
      { id: "grp", title: "Kanalgruppe INT / ATIS / DSC (S. 11)", steps: [
        { say: "[MENU] drücken.", ok: (s: R2) => s.scr === "menu" },
        { say: "Mit [∧]/[∨] oder Regler „Radio Settings“ wählen, [ENT].", ok: (s: R2) => s.mp.length === 1 && s.mp[0] === 2 },
        { say: "„CHAN Group“ wählen, [ENT].", ok: (s: R2) => s.mp.length === 2 && s.mp[1] === 3 },
        { say: isUBI ? "„ATIS“ wählen, [ENT] (✔ erscheint)." : "„INT“ wählen, [ENT] (✔ erscheint).", ok: (s: R2) => s.grp === (isUBI ? "ATIS" : "INT") && s.key.indexOf("ent") >= 0 },
        { say: "[EXIT] (Softkey) drücken: Menü verlassen. Das Display zeigt die Gruppe.", ok: (s: R2) => s.scr === "main" },
      ] },
      { id: "dw", title: "Zwei-/Dreikanalwache (S. 19, 66)", steps: [
        { say: "[MENU] → „Radio Settings“ → „Dual/Tri-Watch“: Dualwatch oder Tri-watch wählen, [ENT].", ok: (s: R2) => s.key.indexOf("ent") >= 0 && s.mp.length === 2 && s.mp[1] === 2 },
        { say: "Menü mit [EXIT] verlassen.", ok: (s: R2) => s.scr === "main" },
        { say: "Betriebskanal wählen.", ok: (s: R2) => s.ch !== 16 },
        { say: "Softkey [DW] drücken: „DUAL 16“ bzw. „TRI 16“ erscheint." + (isUBI ? " Binnen nicht zulässig – siehe Hinweis unten." : ""), ok: (s: R2) => s.dw > 0 },
        { say: "[DW] nochmal drücken: Wache beenden.", ok: (s: R2) => s.dw === 0 && s.key === "sk:DW" },
      ] },
      { id: "scan", title: "Suchlauf mit TAG-Kanälen (S. 17–18)", steps: [
        { say: "Mit [Ω]/[≈] die Softkey-Seite wechseln, bis [TAG] sichtbar ist; damit markiert man Suchlaufkanäle.", ok: (s: R2) => s.sk === 1 },
        { say: "Softkey [TAG] drücken: aktueller Kanal wird TAG-Kanal.", ok: (s: R2) => s.key === "sk:TAG" },
        { say: "Mit [Ω]/[≈] zurück zur ersten Softkey-Seite.", ok: (s: R2) => s.sk === 0 },
        { say: "Softkey [SCAN] drücken: „SCAN 16“ (Prioritätssuchlauf) bzw. „SCAN“ (Normal).", ok: (s: R2) => s.scan },
        { say: "Suchlauf beenden: [CLEAR] oder nochmal [SCAN].", ok: (s: R2) => !s.scan },
      ] },
    ];
    const see = [
      { id: "dsimple", title: "Einfacher Notalarm (S. 24)", steps: [
        { say: "Schutzkappe der [DISTRESS]-Taste anheben.", ok: (s: R2) => s.flap },
        { say: "[DISTRESS] 3 Sek. drücken (Countdown-Pieptöne). Kanal 70 wird gewählt, Notalarm „Undesignated“ mit Position und Zeit gesendet.", ok: (s: R2) => s.scr === "dsent" },
        { say: "Das Gerät wartet auf Bestätigung und wiederholt den Alarm automatisch alle 3,5–4,5 Min. Weiter mit Notanruf per Sprechfunk auf Kanal 16 nach der Bestätigung ([ALARM OFF]).", ok: (s: R2) => s.scr === "dsent" },
      ] },
      { id: "dnat", title: "Notalarm mit Art der Not (S. 25–26)", steps: [
        { say: "[MENU] drücken.", ok: (s: R2) => s.scr === "menu" },
        { say: "„DSC Calls“ wählen, [ENT].", ok: (s: R2) => s.mp.length === 1 && s.mp[0] === 0 },
        { say: "„Distress Call“ wählen, [ENT].", ok: (s: R2) => s.mp.length === 2 && s.mp[1] === 3 },
        { say: "Art der Not wählen, z. B. „Flooding“, dann [ENT]. Die Auswahl bleibt 10 Min. gespeichert.", ok: (s: R2) => s.scr === "dconf" },
        { say: "Schutzkappe anheben und [DISTRESS] 3 Sek. drücken: Alarm wird gesendet.", ok: (s: R2) => s.scr === "dsent" },
      ] },
      { id: "dcan", title: "Notalarm stornieren (S. 27)", steps: [
        { say: "Erst einen Alarm auslösen: Klappe auf, [DISTRESS].", ok: (s: R2) => s.scr === "dsent" },
        { say: "Während des Wartens auf Bestätigung Softkey [CANCEL] drücken.", ok: (s: R2) => s.scr === "can1" },
        { say: "[CONTINUE] drücken.", ok: (s: R2) => s.scr === "can2" },
        { say: "[FINISH] drücken: Stornierung wird gesendet, Kanal 16 automatisch gewählt.", ok: (s: R2) => s.scr === "can3" },
        { say: "Jetzt per Sprechfunk an alle den Fehlalarm zurücknehmen (SRC 157), danach [EXIT].", ok: (s: R2) => s.scr === "main" },
      ] },
      { id: "ind", title: "DSC-Einzelanruf Individual Call (S. 28–29)", steps: [
        { say: "[MENU] → „DSC Calls“ → „Individual Call“, jeweils [ENT].", ok: (s: R2) => s.mp.length === 2 && s.mp[1] === 0 },
        { say: "Gespeicherte Adresse oder „Manual Input“ wählen, [ENT]; die 9-stellige MMSI eingeben (Ziffern mit Regler/[Ω]/[≈], [ENT]).", ok: (s: R2) => s.scr === "ich" },
        { say: "Intership-Kanal für das Gespräch wählen (z. B. 72), [ENT]. Bei Küstenfunkstellen entfällt dieser Schritt.", ok: (s: R2) => s.scr === "iconf" },
        { say: "Bestätigungsanzeige prüfen, Softkey [CALL] drücken. Gesendet wird auf Kanal 70.", ok: (s: R2) => s.scr === "iwait" },
        { say: "Gegenstelle bestätigt „Able to comply“ (Taste „Gegenstelle bestätigt“).", ok: (s: R2) => s.scr === "iack" },
        { say: "[ALARM OFF] drücken: der gewählte Intership-Kanal wird eingestellt. Per Mikrofon antworten.", ok: (s: R2) => s.scr === "main" && s.key === "sk:ALARM OFF" },
      ] },
    ];
    const binnen = [
      { id: "atis", title: "ATIS-Betrieb und ATIS-Code (S. 9, 11, 65)", steps: [
        { say: "Der 10-stellige ATIS-Code wird nach dem MMSI-Code beim Einschalten einmalig programmiert („Push [ENT] to Register Your ATIS“); ändern nur durch Händler. Prüfen: [MENU] drücken.", ok: (s: R2) => s.scr === "menu" },
        { say: "„MMSI/GPS Info“ wählen: zeigt MMSI und ATIS-Code (sonst „NO ATIS MMSI“).", ok: (s: R2) => s.scr === "menu" && s.cur === 4 },
        { say: "Zurück und „Radio Settings“ → „CHAN Group“ → „ATIS“ mit [ENT] bestätigen.", ok: (s: R2) => s.grp === "ATIS" && s.key.indexOf("ent") >= 0 },
        { say: "[EXIT]. Jetzt [PTT] drücken und loslassen: Beim Loslassen sendet das Gerät die ATIS-Kennung.", ok: (s: R2) => s.scr === "main" && s.key === "ptt" },
      ] },
    ];
    return isUBI ? [...binnen, ...common] : [...see, ...common];
  };

  const disp2 = (s: R2): string[] => {
    if (!s.on) return ["", "aus", ""];
    if (s.scr === "menu") {
      const lst = nodeAt(s.mp);
      const par = parentNode(s.mp);
      const title = par ? par.n : "MENU";
      const lines = lst.map((x: MNode, i: number) => {
        const chk = par && par.set ? ((par.set === "grp" && x.n === s.grp) || (par.set === "dwt" && x.n === s.dwt) || (par.set === "scant" && x.n === s.scant) ? "✔" : " ") : "";
        return (i === s.cur ? "▶ " : "  ") + chk + x.n + (x.c || x.o ? " ›" : "");
      });
      const st = Math.max(0, Math.min(s.cur - 1, lines.length - 3));
      const hint = lst[s.cur] && lst[s.cur].p ? " (S. " + lst[s.cur].p + ")" : "";
      return [title + hint, ...lines.slice(st, st + 3)];
    }
    if (s.scr === "dconf") return ["DISTRESS CALL", "Nature: " + s.nature, "[DISTRESS] 3 s drücken"];
    if (s.scr === "dsent") return ["DISTRESS CALL sent", "CH 70 · warte auf ACK", "Wiederholung alle 3,5–4,5 min"];
    if (s.scr === "info") return ["Distress Call Info", "Nature: " + s.nature, "Position/UTC aus GPS"];
    if (s.scr === "can1") return ["Cancel Call?", "Distress Cancel", "[CONTINUE] = weiter"];
    if (s.scr === "can2") return ["Cancel Call", "[FINISH] = senden", ""];
    if (s.scr === "can3") return ["Cancel sent · CH 16", "Per Sprechfunk", "aufklären"];
    if (s.scr === "ich") return ["Individual Call", "MMSI eingegeben", "Intership CH 72 · [ENT]"];
    if (s.scr === "iconf") return ["Individual Call", "Routine · CH 72", "[CALL] = senden"];
    if (s.scr === "iwait") return ["Individual Call sent", "CH 70 · warte auf", "Able to comply"];
    if (s.scr === "iack") return ["Received ACK", "Able to comply · CH 72", "[ALARM OFF]"];
    const flags = [s.grp, s.hi ? "25W" : "1W", s.call ? "CALL" : "", s.dw === 1 ? "DUAL 16" : s.dw === 2 ? "TRI 16" : "", s.scan ? (s.scant === "Priority Scan" ? "SCAN 16" : "SCAN") : "", s.tx ? "TX" : ""].filter((x: string) => x !== "").join(" ");
    return [String(s.ch).padStart(2, "0"), flags, (["VOL ", "SQL ", "CHAN "][s.knob]) + (s.knob === 0 ? s.vol : s.knob === 1 ? (s.sql === 0 ? "OPEN" : s.sql) : s.ch)];
  };

  const KEYINFO: Record<string, string> = {
    distress: "[DISTRESS] (unter Schutzkappe): 3 Sek. drücken sendet einen Notalarm auf Kanal 70 (S. 2, 24). Danach wartet das Gerät auf Bestätigung.",
    flap: "Schutzkappe über [DISTRESS]: verhindert versehentliches Auslösen.",
    ent: "[ENT]: eingegebene Daten / gewählten Menüpunkt übernehmen (S. 2).",
    left: "[Ω]/[≈] (links/rechts): Softkey-Seiten durchschalten; bei Eingaben Zeichen/Ziffer wählen (S. 2, 6).",
    right: "[Ω]/[≈] (links/rechts): Softkey-Seiten durchschalten; bei Eingaben Zeichen/Ziffer wählen (S. 2, 6).",
    up: "[∧•CH]/[∨•CH]: Kanal, Menüpunkt oder Einstellung wählen; im Suchlauf Richtung ändern (S. 2).",
    dn: "[∧•CH]/[∨•CH]: Kanal, Menüpunkt oder Einstellung wählen; im Suchlauf Richtung ändern (S. 2).",
    clear: "[CLEAR]: Eingabe abbrechen, eine Menüebene zurück; beendet auch den Suchlauf (S. 2, 18).",
    menu: "[MENU]: Menü-Modus aufrufen bzw. beenden (S. 2, 64).",
    kup: "[VOL/SQL•PWR] drehen: stellt ein, was gerade gewählt ist (Werkseinstellung: Lautstärke). Im Menü: Punkt wählen (S. 2, 13).",
    kdn: "[VOL/SQL•PWR] drehen: stellt ein, was gerade gewählt ist (Werkseinstellung: Lautstärke). Im Menü: Punkt wählen (S. 2, 13).",
    push: "[VOL/SQL•PWR] drücken: schaltet die Drehfunktion um – Lautstärke, Squelch, Kanalwahl (und Beleuchtung, falls zugeordnet). Im Menü wie [ENT] (S. 2, 67).",
    pwr: "[VOL/SQL•PWR] 1 Sek. drücken: Ein/Aus (S. 2, 12).",
    k16: "[16/C] kurz: Kanal 16. Zurück mit Softkey [CHAN] (S. 3, 10).",
    k16l: "[16/C] 1 Sek.: Anrufkanal der Kanalgruppe („CALL“). 3 Sek. bei Anrufkanal: Anrufkanal programmieren (S. 3, 10, 14).",
    ptt: "[PTT] am Mikrofon: halten zum Senden, loslassen zum Empfang. 5–10 cm Abstand, kurze Pause nach dem Drücken (S. 7, 12). Im ATIS-Betrieb wird beim Loslassen die ATIS-Kennung gesendet.",
    mup: "[∧]/[∨] am Mikrofon: wählen nur TAG-Kanäle, ändern die Suchlaufrichtung (S. 7, 11).",
    mdn: "[∧]/[∨] am Mikrofon: wählen nur TAG-Kanäle, ändern die Suchlaufrichtung (S. 7, 11).",
    hl: "[H/L] am Mikrofon (IC-M423: Aufdruck HI/LO): Sendeleistung 25 W / 1 W. Bei gedrückter Taste einschalten = Mikrofonsperre (S. 7, 15).",
    "sk:SCAN": "Softkey SCAN: Normal- oder Prioritätssuchlauf über TAG-Kanäle starten/stoppen (S. 3, 18).",
    "sk:DW": "Softkey DW: Zwei- bzw. Dreikanalwache starten/stoppen; Art im Menü Radio Settings → Dual/Tri-Watch (S. 3, 19).",
    "sk:HI/LO": "Softkey HI/LO: Sendeleistung High (25 W) / Low (1 W). Einige Kanäle sind auf niedrige Leistung festgelegt (S. 3, 12).",
    "sk:CHAN": "Softkey CHAN: zurück auf den Betriebskanal vor Kanal 16 / Anrufkanal (S. 3, 10).",
    "sk:TAG": "Softkey TAG: angezeigten Kanal als Vorzugs-/Suchlaufkanal markieren; 3 Sek.: alle Kanäle der Gruppe (S. 3, 18).",
    "sk:NAME": "Softkey NAME: Kanalnamen programmieren (S. 3, 14).",
    "sk:BKLT": "Softkey BKLT: Hintergrundbeleuchtung einstellen (S. 3, 16).",
    "sk:LOG": "Softkey LOG: öffnet „Received Call Log“ im Menü DSC Calls (S. 3, 53).",
  };

  const press2 = (k: string) => {
    beep(k === "distress" ? 1200 : 900, 60);
    if (k === "ptt") noise(250);
    const n = reduceX(r2, k);
    setR2(n);
    const pr = PROCS2().find((p: { id: string }) => p.id === proc2);
    if (pr) {
      const st = pr.steps[ps2];
      if (st && st.ok(n)) { setPw2(""); setPs2(ps2 + 1); }
      else if (st) setPw2("Noch nicht – lies den Schritt und versuche eine andere Taste.");
    }
  };

  const panel2 = (): ReactNode => {
    const d = disp2(r2);
    const sl = softLabels(r2);
    const on = (id: string) => r2.key === id || r2.key === "sk:" + id;
    const k = (id: string, x: number, y: number, w: number, h: number, label: string, fill?: string, kk?: string): ReactNode => (
      <g key={id + x} onClick={() => press2(kk || id)} style={{ cursor: "pointer" }}>
        <rect x={x} y={y} width={w} height={h} rx={7} fill={r2.key === (kk || id) ? accent : fill || t.bg.subtle} stroke={t.border.default} />
        <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10} fontFamily={fam} fill={r2.key === (kk || id) ? t.bg.base : t.text.primary}>{label}</text>
      </g>
    );
    return (
      <svg viewBox="0 0 360 250" width="100%" style={{ maxHeight: 270, display: "block" }} role="img" aria-label="Vereinfachte Frontplatte IC-M423 mit Mikrofon">
        <rect x={2} y={2} width={356} height={182} rx={16} fill={t.bg.elevated} stroke={t.border.default} strokeWidth={2} />
        <rect x={10} y={14} width={34} height={110} rx={8} fill={t.bg.subtle} stroke={t.border.subtle} />
        <text x={27} y={74} textAnchor="middle" fontSize={8} fontFamily={fam} fill={t.text.tertiary}>LS</text>
        <rect x={52} y={14} width={186} height={96} rx={6} fill={t.fill.accentSubtle} stroke={t.border.default} />
        <text x={60} y={r2.scr === "main" ? 54 : 32} fontSize={r2.scr === "main" ? 34 : 11} fontFamily={t.font.mono} fontWeight={700} fill={r2.scr.indexOf("d") === 0 || r2.scr.indexOf("can") === 0 ? t.text.danger : t.text.primary}>{d[0]}</text>
        {d.slice(1).map((line: string, i: number) => (
          <text key={i} x={60} y={(r2.scr === "main" ? 72 : 48) + i * 14} fontSize={10} fontFamily={t.font.mono} fill={t.text.primary}>{line}</text>
        ))}
        {sl.map((lab: string, i: number) => (
          <text key={"sl" + i} x={75 + i * 46} y={106} textAnchor="middle" fontSize={8} fontFamily={t.font.mono} fill={t.text.secondary}>{lab}</text>
        ))}
        {[0, 1, 2, 3].map((i: number) => k("s" + (i + 1), 54 + i * 46, 116, 42, 18, "▔", undefined, "s" + (i + 1)))}
        <g onClick={() => press2(r2.flap ? "distress" : "flap")} style={{ cursor: "pointer" }}>
          <rect x={246} y={14} width={44} height={34} rx={7} fill={r2.flap ? t.text.danger : t.bg.subtle} stroke={t.text.danger} strokeWidth={2} />
          <text x={268} y={35} textAnchor="middle" fontSize={8} fontFamily={fam} fill={r2.flap ? t.bg.base : t.text.danger}>{r2.flap ? "DISTRESS" : "Kappe"}</text>
        </g>
        {r2.flap ? k("flap", 246, 50, 44, 12, "zu") : null}
        {k("ent", 296, 14, 54, 22, "ENT")}
        {k("left", 246, 66, 22, 22, "Ω")}
        {k("right", 270, 66, 22, 22, "≈")}
        {k("up", 296, 40, 54, 22, "∧ CH")}
        {k("dn", 296, 66, 54, 22, "∨ CH")}
        {k("clear", 246, 92, 46, 22, "CLEAR")}
        {k("menu", 296, 92, 54, 22, "MENU")}
        {k("k16", 246, 118, 46, 22, "16/C", t.fill.accentSubtle)}
        {k("k16l", 246, 144, 46, 18, "16/C 1s")}
        <g style={{ cursor: "pointer" }}>
          <circle cx={322} cy={142} r={26} fill={on("push") || on("kup") || on("kdn") ? accent : t.bg.subtle} stroke={t.border.default} strokeWidth={2} onClick={() => press2("push")} />
          <text x={322} y={139} textAnchor="middle" fontSize={8} fontFamily={fam} fill={t.text.primary} onClick={() => press2("push")}>VOL/SQL</text>
          <text x={322} y={150} textAnchor="middle" fontSize={8} fontFamily={fam} fill={t.text.primary} onClick={() => press2("push")}>drücken</text>
          <text x={296} y={176} fontSize={13} fontFamily={fam} fill={t.text.primary} onClick={() => press2("kdn")}>↺</text>
          <text x={340} y={176} fontSize={13} fontFamily={fam} fill={t.text.primary} onClick={() => press2("kup")}>↻</text>
        </g>
        {k("pwr", 10, 132, 34, 18, "PWR")}
        <rect x={10} y={192} width={340} height={54} rx={14} fill={t.bg.elevated} stroke={t.border.default} />
        <text x={20} y={210} fontSize={9} fontFamily={fam} fill={t.text.tertiary}>Mikrofon</text>
        {k("ptt", 20, 216, 110, 24, "PTT", t.fill.accentSubtle)}
        {k("mup", 140, 202, 44, 18, "∧")}
        {k("mdn", 140, 222, 44, 18, "∨")}
        {k("hl", 192, 210, 62, 24, "H/L")}
        {k("k16m", 262, 210, 80, 24, "16/C (G/GE)", undefined, "k16")}
      </svg>
    );
  };

  const panelScreen2 = (): ReactNode => {
    const info = KEYINFO[r2.key] || "";
    return (
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
        {panel2()}
        {card(
          <>
            <span style={txt("body2", t.text.secondary)}>{info || "Tippe eine Taste an. Anordnung vereinfacht nach Abb. „Frontplatte“ (S. 2–3) und „Lautsprechermikrofon“ (S. 7); die 4 Softkeys unter dem Display sind frei belegbar (Menü Configuration → Key Assignment), Reihenfolge je nach Version/Programmierung."}</span>
            {isUBI ? <span style={txt("label", t.text.secondary)}>Binnen (Regeln, nicht aus dem Handbuch): Schiff–Schiff, Nautischer Informationsfunk und Hafenfunk nur mit 0,5–1 W; Zweikanalwache (DW) und DSC sind im Binnenschifffahrtsfunk nicht zulässig; jede Aussendung trägt die ATIS-Kennung. Quelle: RAINWAT / Handbuch Binnenschifffahrtsfunk.</span> : null}
            <div style={rowWrap}>
              <Button label="Gerät zurücksetzen" variant="quiet" onClick={() => setR2(R20)} />
              {r2.scr === "iwait" ? <Button label="Gegenstelle bestätigt" onClick={() => press2("ack")} /> : null}
            </div>
          </>,
          { padding: 12, gap: 6 },
        )}
      </div>
    );
  };

  const procScreen2 = (): ReactNode => {
    const p = PROCS2().find((x: { id: string }) => x.id === proc2);
    if (!p) return null;
    const done = ps2 >= p.steps.length;
    return (
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {bar(ps2, p.steps.length)}
        {card(
          <>
            <span style={txt("label", t.text.secondary)}>{done ? "Geschafft" : "Schritt " + (ps2 + 1) + " von " + p.steps.length}</span>
            <span style={txt("body2", t.text.primary)}>{done ? "Ablauf komplett. Wiederholen festigt die Griffe." : p.steps[ps2].say}</span>
            {pw2 ? <span style={txt("label", t.text.danger)}>{pw2}</span> : null}
            <div style={rowWrap}>
              {done ? <Button label="Nochmal" variant="primary" onClick={() => { setPs2(0); setR2(p.id === "vs" ? { ...R20, on: false } : R20); }} /> : null}
              {r2.scr === "iwait" ? <Button label="Gegenstelle bestätigt" onClick={() => press2("ack")} /> : null}
            </div>
          </>,
          { padding: 12, gap: 6 },
        )}
        {panel2()}
      </div>
    );
  };

  const menuRef = (): ReactNode =>
    pager(
      MENU_TREE.map((m: MNode) =>
        card(
          <>
            <span style={txt("body1", t.text.primary, t.weight.semibold)}>{"[MENU] › " + m.n + (m.p ? " (S. " + m.p + ")" : "")}</span>
            {m.c ? m.c.map((c: MNode) => <span key={c.n} style={txt("body2", t.text.secondary)}>{"• " + c.n + (c.p ? "  ·  S. " + c.p : "") + (c.o ? "  →  " + c.o.join(", ") : "")}</span>) : <span style={txt("body2", t.text.secondary)}>Zeigt MMSI, ATIS-Code und GPS-Daten; ohne Programmierung „NO DSC MMSI“ bzw. „NO ATIS MMSI“.</span>}
            {m.n === "DSC Calls" ? <span style={txt("label", t.text.tertiary)}>Individual ACK und Test ACK erscheinen nur nach Empfang des passenden Anrufs.</span> : null}
            <span style={txt("label", t.text.tertiary)}>Bedienung: [MENU] öffnen, mit Regler oder [∧]/[∨] wählen, [ENT] übernehmen, [CLEAR]/[BACK] eine Ebene zurück, [EXIT] beendet.</span>
          </>,
          { padding: 12, gap: 4 },
        ),
      ),
    );

  /* ---------- Navigationsbaum ---------- */
  const AREA_INFO: { id: Tab; title: string; sub: string; color: string }[] = [
    { id: "erklaeren", title: "Erklären", sub: "Kapitel, Funkverfahren, Trainer, Gerät, Wissen", color: accent },
    { id: "fragen", title: "Prüfungsfragen", sub: "Katalog üben mit Fortschritt", color: accent2 },
    { id: "pruefung", title: "Prüfung", sub: "Amtliche Bögen 1–12 mit Zeit", color: accent3 },
    { id: "funkgeraet", title: "Funkgerät", sub: "IC-M423 interaktiv, Bedienung üben, Funk-Simulator mit Mikrofon", color: accent },
  ];
  const ERK: Tile[] = [
    { id: "funk", title: "Funkverfahren", sub: "Mayday, Pan Pan, Sécurité, Routine" + (certC === "SRC" ? ", Fehlalarm" : "") },
    { id: "trainer", title: "Funkspruch-Trainer", sub: "Eigenen Funkspruch bauen" },
    { id: "geraet", title: "Gerät IC-M423", sub: myTasks.length + " Abläufe · Tasten · Tipps" },
    { id: "nato", title: "Buchstabiertafel", sub: "Werkzeug und Tafel" },
    { id: "kanaele", title: "Kanäle & Leistung", sub: certC === "SRC" ? "Seefunk" : "Binnenfunk, Verkehrskreise" },
    { id: "mmsi", title: certC === "SRC" ? "MMSI" : "MMSI & ATIS", sub: certC === "SRC" ? "Decoder und Kennungen" : "ATIS-Rechner, Decoder, Kennungen" },
    { id: "ablauf", title: "Prüfungsablauf", sub: "Theorie, Sprache, Praxis, Videos" },
    { id: "quellen", title: "Quellen", sub: LINKS.length + " amtliche Dokumente und Anleitungen" },
  ];
  const FUNK_TILES: Tile[] = [
    ...FUNK.filter((f: { srcOnly?: boolean }) => certC === "SRC" || !f.srcOnly).map((f: { id: string; title: string; steps: Steps }) => ({ id: f.id, title: f.title, sub: f.steps.length + " Schritte + Beispiel" })),
    { id: "notverkehr", title: "Notverkehr & Redewendungen", sub: "Silence Mayday, Relay, Standardphrasen" },
  ];
  const chapterTiles = (): Tile[] =>
    myChapters.map((c: Chapter) => {
      const s = statsOf(certC, c.key);
      return { id: c.key, title: shortLabel(c.label), sub: s.total + " Fragen · " + pctOf(s.done, s.total) + " % bearbeitet · " + pctOf(s.ok, s.total) + " % richtig", done: s.done, ok: s.ok, total: s.total };
    });
  const sheetTiles = (): Tile[] => [
    { id: "zufall", title: "Zufälliger amtlicher Bogen", sub: "einer der Bögen 1–12" },
    ...(certC === "UBI" ? [{ id: "quote", title: "Zufall nach Teil-Verteilung", sub: "5/5/4/4/4, kein amtlicher Bogen" }] : []),
    ...Array.from({ length: 12 }, (_: unknown, i: number) => ({ id: String(i + 1), title: "Bogen " + (i + 1), sub: "amtlich" })),
  ];

  const labelOf = (lvl: number, id: string): string => {
    if (lvl === 0) return (AREA_INFO.find((a: { id: Tab }) => a.id === id) || AREA_INFO[0]).title;
    const a = path[0];
    if (a === "erklaeren") {
      if (lvl === 1) return id === "ref" ? "Nachschlagen" : (LESSONS.find((x: Lesson) => x.id === id) || { title: id }).title;
      if (lvl === 2) return (ERK.find((x: Tile) => x.id === id) || { title: id }).title;
      if (path[2] === "funk") return (FUNK_TILES.find((x: Tile) => x.id === id) || { title: id }).title;
      if (path[2] === "geraet") return id === "modell" ? "Modell, Tasten & Tipps" : (ICOM_TASKS.find((x: { value: string }) => x.value === id) || { label: id }).label;
    }
    if (a === "fragen") return id === "alle" ? "Alle Kapitel" : shortLabel((CHAPTERS.find((c: Chapter) => c.key === id) || { label: id }).label);
    if (a === "funkgeraet") {
      if (lvl === 1) return id === "panel" ? "Gerät erkunden" : id === "ablauf" ? "Bedienung üben" : "Funk-Simulator";
      if (lvl === 1 && id === "menue") return "Menüstruktur";
      if (path[1] === "ablauf") return (PROCS2().find((x: { id: string }) => x.id === id) || { title: id }).title;
      return (SCNS().find((x: Scn) => x.id === id) || { title: id }).title;
    }
    if (a === "pruefung") return id === "zufall" ? "Zufallsbogen" : id === "quote" ? "Teil-Verteilung" : "Bogen " + id;
    return id;
  };

  /* ---------- Bildschirme ---------- */
  const areaScreen = (): ReactNode => {
    const all = statsOf(certC, "alle");
    return (
      <div style={{ flex: "1 1 auto", minHeight: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))", gridAutoRows: "1fr", gap: 14 }}>
        {AREA_INFO.map((a: { id: Tab; title: string; sub: string; color: string }) => (
          <button
            key={a.id}
            type="button"
            onClick={() => enter([a.id])}
            style={{ textAlign: "left", cursor: "pointer", background: t.fill.accentSubtle, border: "2px solid " + a.color, borderRadius: t.radius.xl, padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8, fontFamily: fam, minHeight: 0 }}
          >
            <div style={{ width: 44, height: 8, borderRadius: t.radius.full, background: a.color }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: fam, fontSize: t.font.heading2.fontSize, lineHeight: t.font.heading2.lineHeight, fontWeight: t.weight.semibold, color: t.text.primary }}>{a.title}</span>
              <span style={txt("body2", t.text.secondary)}>{a.id === "fragen" ? a.sub + " · " + pctOf(all.done, all.total) + " % bearbeitet, " + pctOf(all.ok, all.total) + " % richtig" : a.sub}</span>
            </div>
          </button>
        ))}
      </div>
    );
  };

  const fragenHome = (): ReactNode => {
    const all = statsOf(certC, "alle");
    return (
      <>
        <div style={{ flex: "0 0 auto", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {ring(pctOf(all.done, all.total), accent, "bearbeitet", all.done + " von " + all.total)}
            {ring(pctOf(all.ok, all.total), t.text.success, "erfolgreich", all.ok + " zuletzt richtig")}
          </div>
          <Button
            label={"Fortschritt " + certC + " zurücksetzen"}
            variant="quiet"
            onClick={() =>
              setProg((p: Record<string, number>) => {
                const n: Record<string, number> = {};
                Object.keys(p).forEach((k: string) => {
                  if (k.indexOf(certC + "-") !== 0) n[k] = p[k];
                });
                return n;
              })
            }
          />
        </div>
        {tileGrid([{ id: "alle", title: "Alle Kapitel gemischt", sub: all.total + " Fragen" }, ...chapterTiles()], 4, 300, open)}
      </>
    );
  };

  const practiceScreen = (): ReactNode => (
    <>
      <div style={{ flex: "0 0 auto", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <Segmented<Mode>
          options={[
            { value: "ueben", label: "Üben" },
            { value: "karte", label: "Karteikarten" },
          ]}
          value={curMode()}
          onChange={(m: Mode) => practise(chap, flt, m)}
        />
        {chips(
          [
            { value: "alle", label: "Alle" },
            { value: "neu", label: "Nur neue" },
            { value: "falsch", label: "Nur falsche" },
          ],
          flt,
          (v: string) => practise(chap, v, curMode()),
        )}
        <span style={txt("label", t.text.secondary)}>{"Runde: " + right + " richtig · " + wrong + " falsch"}</span>
      </div>
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto" }}>
        {deck.length === 0
          ? card(<div style={txt("body1", t.text.secondary)}>{flt === "neu" ? "Keine neuen Fragen mehr in dieser Auswahl. Stark!" : "Keine falsch beantworteten Fragen in dieser Auswahl."}</div>)
          : !finished
            ? questionView()
            : pager(resultPages())}
      </div>
    </>
  );

  const resultPages = (): ReactNode[] => {
    const exam = mode === "pruefung";
    const passed = right >= passMark;
    const head = card(
      <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <div style={{ fontFamily: fam, fontSize: t.font.heading1.fontSize, lineHeight: t.font.heading1.lineHeight, fontWeight: t.weight.semibold, color: t.text.primary }}>{right + " / " + deck.length}</div>
          {exam ? (passed ? <Status tone="success">Bestanden</Status> : <Status tone="danger">Nicht bestanden</Status>) : <Status tone="accent">Runde beendet</Status>}
        </div>
        {bar(right, deck.length, exam ? (passed ? t.text.success : t.text.danger) : accent)}
        <div style={txt("body2", t.text.secondary)}>{pctOf(right, deck.length) + " % richtig" + (exam ? " · bestanden ab " + passMark + " Punkten · Zeit " + mmss(elapsed) + " von " + examLimit + ":00 min" : "") + (missed.length > 0 ? " · auf den nächsten Seiten: deine Fehler" : "")}</div>
        <div style={rowWrap}>
          <Button label={exam ? "Neuer Bogen" : "Neue Runde"} variant="primary" onClick={() => { rebuild(cert, chap, mode); setPg(0); }} />
          {missed.length > 0 ? <Button label={"Nur Fehler wiederholen (" + missed.length + ")"} onClick={practiseMissed} /> : null}
        </div>
      </>,
      { padding: 20 },
    );
    const wrongPages = missed.map((i: number) => {
      const it = ITEMS[i];
      return card(
        <>
          <Status tone="danger">{"Falsch · " + it.cert + " " + it.n}</Status>
          <div style={txt("heading3", t.text.primary, t.weight.semibold)}>{it.q}</div>
          <div style={{ borderLeft: "4px solid " + t.text.success, background: t.fill.successSubtle, borderRadius: t.radius.md, padding: 12, ...txt("body1", t.text.primary) }}>{"Richtig: " + it.a[0]}</div>
        </>,
        { padding: 16 },
      );
    });
    return [head, ...wrongPages];
  };

  const examScreen = (): ReactNode => (
    <>
      <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, ...txt("subtext", t.text.secondary) }}>
          <span style={{ color: t.text.primary, fontWeight: t.weight.semibold }}>{bogenNr > 0 ? "Amtlicher " + certC + "-Bogen " + bogenNr + " (" + deck.length + " Fragen)" : "Zufallsbogen nach Teil-Verteilung (22 Fragen)"}</span>
          <span>{"bestanden ab " + passMark}</span>
          <span>{"Zeit " + mmss(elapsed) + " / " + examLimit + ":00"}</span>
        </div>
        {bar(Math.min(elapsed, examLimit * 60), examLimit * 60, elapsed >= examLimit * 60 ? t.text.danger : accent2)}
      </div>
      <div style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>{!finished ? questionView() : pager(resultPages())}</div>
    </>
  );

  const pruefungHome = (): ReactNode => (
    <>
      <div style={{ flex: "0 0 auto", ...txt("label", t.text.secondary) }}>
        {certC === "UBI"
          ? "12 Bögen der amtlichen Fragenverteilung des ABVT (Stand Oktober 2026): je 5 Fragen aus Teil I und II, je 4 aus III–V; 60 min, bestanden ab 17 von 22."
          : "12 amtliche Fragebögen nach Anlage 2a (ELWIS); 30 min, bestanden ab 19 von 24. Frage 33 (Bögen 5 und 12) fehlt, weil ihre Antworten in der Leseversion wortgleich sind; diese Bögen haben 23 Fragen."}
      </div>
      {tileGrid(sheetTiles(), 14, 150, open)}
    </>
  );

  /* Inhalt der aktuellen Ebene */
  let body: ReactNode = null;
  let title = "";
  let sub = "";
  const a0 = path[0];
  if (path.length === 0) {
    title = "Was möchtest du tun?";
    sub = certC === "SRC" ? "SRC · Seefunk mit DSC" : "UBI · Binnenfunk mit ATIS";
    body = areaScreen();
  } else if (a0 === "erklaeren") {
    if (path.length === 1) {
      title = "Erklären · Lernpfad " + certC;
      sub = LESSONS.length + " aufbauende Lektionen – am besten der Reihe nach";
      body = courseHome();
    } else if (path[1] !== "ref") {
      const l = LESSONS.find((x: Lesson) => x.id === path[1]) || LESSONS[0];
      title = LESSONS.indexOf(l) + 1 + ". " + l.title;
      body = lessonScreen(l);
    } else if (path.length === 2) {
      title = "Nachschlagen & Werkzeuge";
      sub = "Alles kompakt zum schnellen Nachsehen";
      body = tileGrid(ERK, 6, 260, open);
    } else if (path[2] === "funk" && path.length === 3) {
      title = "Funkverfahren";
      sub = "Rangfolge: Not vor Dringlichkeit vor Sicherheit vor Routine (SRC 85, UBI 110)";
      body = tileGrid(FUNK_TILES, 6, 260, open);
    } else if (path[2] === "geraet" && path.length === 3) {
      title = "Gerät IC-M423";
      sub = "Ablauf wählen; jeder Schritt zeigt die passenden Tasten";
      body = tileGrid([{ id: "modell", title: "Modell, Tasten & Tipps", sub: "G/GE, Tastenübersicht, Praxis" }, ...myTasks.map((x: { value: string; label: string; steps: Steps }) => ({ id: x.value, title: x.label, sub: x.steps.length + " Schritte" }))], 6, 260, open);
    } else {
      const leaf = path[path.length - 1];
      title = labelOf(path.length - 1, leaf);
      let pages: ReactNode[] = [];
      if (path[2] === "funk") pages = funkPages(leaf);
      else if (path[2] === "geraet") pages = geraetPages(leaf);
      else if (leaf === "trainer") pages = trainerPages();
      else pages = wissenPages(leaf);
      body = pager(pages);
    }
  } else if (a0 === "fragen") {
    if (path.length === 1) {
      title = "Prüfungsfragen";
      sub = "Kapitel wählen: bearbeitet (blau) und richtig (grün)";
      body = fragenHome();
    } else {
      title = labelOf(1, path[1]);
      body = practiceScreen();
    }
  } else if (a0 === "funkgeraet") {
    if (path.length === 1) {
      title = "Funkgerät IC-M423";
      sub = isUBI ? "Binnen: ATIS-Betrieb, Sprechfunk auf Deutsch" : "See: DSC und Sprechfunk, Prüfungssprache Englisch";
      body = fgHome();
    } else if (path[1] === "panel") {
      title = "Gerät erkunden";
      body = panelScreen2();
    } else if (path[1] === "menue") {
      title = "Menüstruktur IC-M423";
      sub = "Nach Bedienungsanleitung S. 64–71";
      body = menuRef();
    } else if (path.length === 2) {
      title = path[1] === "ablauf" ? "Bedienung üben" : "Funk-Simulator";
      sub = path[1] === "ablauf" ? "Die richtige Taste im Schema drücken, um weiterzukommen" : (SR ? "Mikrofon: PTT halten und sprechen" : "Ohne Spracherkennung: Bausteine antippen oder tippen") + (hasTTS ? " · Gegenstelle spricht" : " · Antwort als Text");
      body = path[1] === "ablauf" ? tileGrid(PROCS2().map((p: { id: string; title: string; steps: P2[] }) => ({ id: p.id, title: p.title, sub: p.steps.length + " Schritte" })), 6, 240, open) : tileGrid(SCNS().map((x: Scn) => ({ id: x.id, title: x.title, sub: x.ch })), 6, 240, open);
    } else if (path[1] === "ablauf") {
      title = labelOf(2, path[2]);
      body = procScreen2();
    } else {
      const s = curScn();
      title = s ? s.title : "Szenario";
      sub = "Gegenstelle mit Sprachausgabe";
      body = s ? simScreen(s) : null;
      if (s) sub = hasTTS ? "Ton: " + (speakOn ? "an" : "aus") : "Sprachausgabe nicht verfügbar – Antwort als Text";
    }
  } else if (a0 === "pruefung") {
    if (path.length === 1) {
      title = "Prüfung";
      sub = "Bogen wählen";
      body = pruefungHome();
    } else {
      title = labelOf(1, path[1]);
      body = examScreen();
    }
  }

  const crumbs = [certC, ...path.map((id: string, i: number) => labelOf(i, id))];

  if (!chosen) {
    return <div style={{ height: "min(760px, max(560px, 100dvh))", overflow: "hidden", display: "flex", flexDirection: "column", background: t.bg.base }}>{chooser()}</div>;
  }

  return (
    <div style={{ fontFamily: fam, color: t.text.primary, background: t.bg.base, maxWidth: 1100, margin: "0 auto", height: "min(760px, max(560px, 100dvh))", overflow: "hidden", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
      <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: "1px solid " + t.border.subtle, background: t.bg.elevated }}>
        <button
          type="button"
          onClick={back}
          style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: t.radius.full, border: "2px solid " + accent, background: t.fill.accentSubtle, color: t.text.primary, fontFamily: fam, fontSize: t.font.body1.fontSize, fontWeight: t.weight.semibold, cursor: "pointer" }}
        >
          ‹ Zurück
        </button>
        {appIcon(30)}
        <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex", alignItems: "center", gap: 6, overflow: "hidden", whiteSpace: "nowrap" }}>
          {crumbs.map((c: string, i: number) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              {i > 0 ? <span style={txt("label", t.text.tertiary)}>›</span> : null}
              <button
                type="button"
                onClick={() => (i === 0 ? enter([]) : enter(path.slice(0, i)))}
                style={{ border: "none", background: "transparent", padding: 0, cursor: "pointer", fontFamily: fam, fontSize: t.font.subtext.fontSize, color: i === crumbs.length - 1 ? t.text.primary : t.text.secondary, fontWeight: i === crumbs.length - 1 ? t.weight.semibold : t.weight.regular, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: i === crumbs.length - 1 ? 240 : 120 }}
              >
                {c}
              </button>
            </span>
          ))}
        </div>
        <div style={{ flex: "0 0 auto", display: "flex", gap: 4 }}>{(["UBI", "SRC"] as Cert[]).map((c: Cert) => chip("cert-" + c, c, c === certC, () => (c === certC ? undefined : chooseCert(c))))}</div>
      </div>
      <div style={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column", gap: 12, padding: "12px 12px 8px" }}>
        {screenTitle(title, sub || undefined)}
        {body}
      </div>
      <div style={{ flex: "0 0 auto", padding: "4px 12px 8px", textAlign: "center", ...txt("label", t.text.tertiary) }}>{saveNote()}</div>
    </div>
  );
}
