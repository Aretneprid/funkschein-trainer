import type { BookChapter, Cert } from "./types";

export const LESSON_TO_BOOK: Record<string, string> = {
  s1: "grundlagen",
  s2: "grundlagen",
  s3: "gmdss",
  s4: "anlage",
  s5: "sprechfunk",
  s6: "dsc",
  s7: "sprechfunk",
  s8: "navtex",
  s9: "sprechfunk",
  s10: "navtex",
  u1: "grundlagen",
  u2: "binnen",
  u3: "anlage",
  u4: "tafel",
  u5: "sprechfunk",
  u6: "sprechfunk",
  u7: "binnen",
  u8: "anlage",
};

export const HANDBOOK: BookChapter[] = [
  {
    id: "grundlagen",
    title: "Grundlagen & Recht",
    cert: "BOTH",
    teaser: "Funkdienste, Zeugnisse, Zulassung und die wichtigsten Rechtsquellen",
    sections: [
      {
        id: "dienste",
        title: "Funkdienste",
        lesson: "s1",
        paras: [
          "Der mobile Seefunkdienst ist der Funkverkehr zwischen Küstenfunkstellen und Seefunkstellen sowie zwischen Seefunkstellen untereinander. Eine Seefunkstelle ist die Funkstelle an Bord eines nicht dauernd verankerten Seefahrzeugs.",
          "Der Binnenschifffahrtsfunk ist ein eigener Funkdienst auf den Binnenwasserstraßen. Er dient der Sicherheit und der Leichtigkeit des Verkehrs, nicht dem öffentlichen Nachrichtenverkehr wie ein Telefonat über eine Küstenfunkstelle.",
        ],
        source: "ITU-VO Funk (Radio Regulations); SRC-Fragenkatalog (BNetzA/ELWIS); BinSchSprFunkV.",
      },
      {
        id: "zeugnisse",
        title: "Funkzeugnisse",
        lesson: "s2",
        paras: [
          "Das Restricted Operator’s Certificate (SRC) berechtigt zur Teilnahme am mobilen Seefunkdienst auf UKW, einschließlich DSC im Seegebiet A1. Für Sportfahrzeuge ist es das übliche Seefunkzeugnis, wenn eine UKW-Anlage mit DSC betrieben wird.",
          "Das UKW-Sprechfunkzeugnis für den Binnenschifffahrtsfunk (UBI) berechtigt zur Teilnahme am Binnenschifffahrtsfunk. Wer bereits ein Seefunkzeugnis (z. B. SRC, LRC, ROC, GOC) oder ein UBZ besitzt, legt in der Regel die UBI-Ergänzungsprüfung ab, nicht die volle UBI-Prüfung.",
          "In Deutschland muss der Führer eines Fahrzeugs mit eingebauter Funkanlage das Zeugnis mitführen, das zur Teilnahme am Funkdienst des jeweiligen Fahrtgebiets berechtigt. Eine UKW-Kombianlage (See und Binnen) setzt das zum Fahrtgebiet passende Zeugnis voraus.",
        ],
        source: "Durchführungsrichtlinien Funkbetriebszeugnisse (ELWIS); BinSchSprFunkV; UBI- und SRC-Fragenkataloge.",
      },
      {
        id: "zulassung",
        title: "Zulassung, Rufzeichen, MMSI",
        lesson: "s2",
        paras: [
          "Eine Seefunkstelle braucht eine Zuteilung (Ship Station Licence) der Bundesnetzagentur, ein Rufzeichen und – bei DSC – eine MMSI. Änderungen an der Anlage, etwa der Austausch einer reinen UKW-Sprechfunkanlage gegen eine UKW-GMDSS-Anlage, sind der Bundesnetzagentur schriftlich mitzuteilen.",
          "Öffentlicher Funkverkehr (Gespräche über eine Küstenfunkstelle in das Telefonnetz) setzt zusätzlich einen Vertrag mit einer Abrechnungsgesellschaft voraus. Nichtöffentlicher Funkverkehr (Not, Dringlichkeit, Sicherheit, nautische Abstimmung zwischen Fahrzeugen) nicht.",
        ],
        source: "SRC-Fragenkatalog; Vollzugsordnung für den Funkdienst (ITU RR); Bundesnetzagentur.",
      },
      {
        id: "pruefung-src",
        title: "SRC-Prüfung: Theorie und Sprachteil",
        certHint: "SRC",
        paras: [
          "Die theoretische SRC-Prüfung umfasst den Fragenkatalog und einen Sprachteil. Im Sprachteil ist nach den Durchführungsrichtlinien Funkbetriebszeugnisse ein englischer Funkspruch (Not, Dringlichkeit oder Sicherheit) aufzunehmen und ohne Hilfsmittel ins Deutsche zu übersetzen (15 Minuten). Anschließend ist ein deutscher Seefunktext schriftlich ins Englische zu übertragen (15 Minuten). Ein mündlicher Teil kann sich anschließen.",
          "Die praktischen Anforderungen (Gerätebedienung, DSC, Sprechfunkabläufe) sind in Anlage 3 der Durchführungsrichtlinien beschrieben. Der Sprachteil gehört zur Theorie, nicht zur Praxisprüfung.",
        ],
        source: "ELWIS, Durchführungsrichtlinien Funkbetriebszeugnisse, insbesondere § 5.2 / 6.2.1 und Anlage 3 (Fachstelle der WSV für den Seefunk).",
      },
      {
        id: "pruefung-ubi",
        title: "UBI-Prüfung: Theorie und Praxis",
        certHint: "UBI",
        paras: [
          "Die theoretische UBI-Vollprüfung umfasst 22 Fragen in 60 Minuten, Bestehensgrenze 17 Punkte; die Ergänzungsprüfung 10 Fragen in 30 Minuten, Bestehensgrenze 8 Punkte (ABVT).",
          "Die praktische Vollprüfung besteht laut ABVT aus Textaufnahme, Textabgabe und der Bedienung der Funkanlage anhand von Fallbeispielen. Bei der Textaufnahme liest die prüfende Person einen deutschen Text vor; Namen und Ortsbezeichnungen werden buchstabiert. Bei der Textabgabe liest die zu prüfende Person einen Text.",
          "Für Inhaberinnen und Inhaber von SRC, LRC, ROC, GOC oder UBZ beschreibt der Erlass im Verkehrsblatt 2003 (S. 97) den praktischen Teil der Ergänzungsprüfung als Übungen im Binnenschifffahrtsfunk mit Buchstabiertafel, Not-, Dringlichkeits- und Sicherheitsverfahren sowie Gerätebedienung – ohne eigenen Abschnitt Textaufnahme/Textabgabe. Die Übungen in dieser App bleiben für die Vollprüfung nützlich.",
        ],
        source: "ABVT (WSV) zur Prüfungsstruktur; VkBl. 2003 S. 97 (verwaltungsvorschriften-im-internet.de, bsvwvbund_17022003_LS264400002); BinSchSprFunkV Anlage 4 Nr. 5.",
      },
    ],
  },
  {
    id: "gmdss",
    title: "GMDSS und Seegebiete",
    cert: "SRC",
    teaser: "Weltweites Seenot- und Sicherheitsfunksystem, Sea Areas A1–A4",
    sections: [
      {
        id: "gmdss-ziel",
        title: "Aufgabe des GMDSS",
        lesson: "s3",
        paras: [
          "Das Global Maritime Distress and Safety System (GMDSS) soll in Not-, Dringlichkeits- und Sicherheitsfällen eine schnelle und genaue Alarmierung ermöglichen und so Hilfe in Seenotfällen sichern. Es ist das weltweite Seenot- und Sicherheitsfunksystem.",
          "Zu den satellitengestützten Alarmierungssystemen gehören COSPAS-SARSAT und Inmarsat. Nachrichten zur Sicherheit der Seeschifffahrt heißen MSI (Maritime Safety Information).",
        ],
        source: "SRC-Fragenkatalog; IMO/ITU-Regelungen zum GMDSS.",
      },
      {
        id: "seegebiete",
        title: "Seegebiete A1 bis A4",
        lesson: "s3",
        paras: [
          "Seegebiet A1 ist der Bereich, der von der Sprechfunkreichweite mindestens einer UKW-Küstenfunkstelle abgedeckt wird, die ununterbrochen für DSC-Alarmierungen zur Verfügung steht.",
          "A2 ist der Bereich (außer A1) innerhalb der Sprechfunkreichweite mindestens einer Grenzwellen-Küstenfunkstelle mit ununterbrochenem DSC-Betrieb. A3 liegt im Abdeckungsbereich geostationärer Inmarsat-Satelliten (außer A1 und A2). A4 sind die übrigen Gebiete, vor allem die Polarregionen.",
          "Die Ausrüstungspflicht richtet sich für SOLAS-Schiffe nach dem Seegebiet. Für die Sportschifffahrt gelten nationale Regelungen; das SRC deckt den UKW-Bereich einschließlich DSC in A1 ab.",
        ],
        source: "SRC-Fragenkatalog; SOLAS Kapitel IV / GMDSS-Bestimmungen.",
      },
    ],
  },
  {
    id: "verkehrskreise",
    title: "Verkehrskreise",
    cert: "UBI",
    teaser: "Warum der Binnenschifffahrtsfunk in Verkehrskreisen organisiert ist",
    sections: [
      {
        id: "vk-idee",
        title: "Idee der Verkehrskreise",
        lesson: "u3",
        paras: [
          "Auf den Binnenwasserstraßen ist der Funkverkehr in Verkehrskreise gegliedert. Jeder Kreis hat festgelegte Kanäle, damit sich Revierfunk, Schiff-Schiff-Verkehr und der nautische Informationsfunk nicht gegenseitig stören.",
          "Welche Kanäle in einem Revier gelten, steht im Handbuch Binnenschifffahrtsfunk und auf den betreffenden Strecken in den nautischen Veröffentlichungen. Vor der Fahrt die für die Strecke gültigen Kanäle einstellen.",
        ],
        source: "Handbuch für den Binnenschifffahrtsfunk; Regional Arrangement Basel 2000; BinSchSprFunkV.",
      },
    ],
  },
  {
    id: "anlage",
    title: "Funkanlage & Kanäle",
    cert: "BOTH",
    teaser: "UKW-Kanäle, Sendeleistung, wichtige Frequenzen an See und Binnen",
    sections: [
      {
        id: "ukw-allgemein",
        title: "UKW-Seefunk: Reichweite und Leistung",
        lesson: "s1",
        paras: [
          "UKW-Seefunk arbeitet im Meterwellenbereich; die Reichweite ist im Wesentlichen optische Sicht (Antennenhöhe, Leistung, Ausbreitung). Typische Festanlagen auf Sportbooten senden mit 25 W oder umschaltbar 1 W.",
          "Geringe Leistung (1 W) ist zu wählen, wenn die höhere Leistung nicht nötig ist – etwa im Hafen oder bei kurzem Abstand –, um andere Stationen weniger zu stören.",
        ],
        source: "SRC- und UBI-Fragenkataloge; ITU RR zu UKW-Seefunkkanälen.",
      },
      {
        id: "kanaele-see",
        title: "Wichtige Seefunkkanäle",
        lesson: "s4",
        paras: [
          "Kanal 16 ist der internationale UKW-Not-, Anruf- und Antwortkanal. Nach dem Anruf wechselt man auf einen Arbeitskanal. Notverkehr hat Vorrang; wer Kanal 16 benutzt, muss die Funkdisziplin besonders strikt einhalten.",
          "Kanal 70 ist ausschließlich dem DSC auf UKW vorbehalten, nicht dem Sprechfunk. Kanal 13 dient unter anderem dem Brücken-zu-Brücken-Verkehr. Weitere Arbeitskanäle sind in den Veröffentlichungen des BSH und in der VO Funk aufgeführt.",
        ],
        source: "ITU-VO Funk Anhang zu den UKW-Frequenzen; SRC-Fragenkatalog; BSH „Funkdienst für die Klein- und Sportschifffahrt“.",
      },
      {
        id: "kanaele-binnen",
        title: "Wichtige Binnenkanäle",
        lesson: "u3",
        paras: [
          "Im Binnenschifffahrtsfunk sind die Kanäle den Verkehrskreisen zugeordnet. Häufig begegnen: Kanal 10 (unter anderem nautischer Informationsfunk bzw. Schiff-Schiff je nach Revier), die Schiff-Schiff-Kanäle 72 und 77 sowie die von den Revierzentralen bekannten NIF-Kanäle.",
          "Die genaue Zuordnung ist immer der für die Wasserstraße geltenden Festlegung zu entnehmen, nicht einem allgemeinen Merksatz allein. Schifffahrtszeichen (z. B. B.11b) können die Benutzung eines angegebenen Kanals gebieten.",
        ],
        source: "Handbuch für den Binnenschifffahrtsfunk; Regional Arrangement Basel 2000; BinSchStrO (Zeichen).",
      },
    ],
  },
  {
    id: "dsc",
    title: "DSC",
    cert: "SRC",
    teaser: "Digital Selective Calling: Alarmierung, MMSI, Kanal 70",
    sections: [
      {
        id: "dsc-idee",
        title: "Was DSC leistet",
        lesson: "s6",
        paras: [
          "Digital Selective Calling (DSC) ist das digitale Anruf- und Alarmierungsverfahren im GMDSS. Auf UKW läuft DSC auf Kanal 70. Ein Distresstelekommando (Not) wird gezielt an alle Stationen gegeben; anschließend folgt der Sprechfunk-Notverkehr in der Regel auf Kanal 16.",
          "Die MMSI (Maritime Mobile Service Identity) identifiziert die Seefunkstelle. Küstenfunkstellen, Gruppen und Einzelstationen haben unterscheidbare Nummernkreise. Die MMSI muss fest in der Anlage programmiert sein.",
        ],
        source: "SRC-Fragenkatalog; ITU RR / Recommendation zu DSC; Bedienungsanleitung typischer UKW-DSC-Anlagen (z. B. IC-M423).",
      },
      {
        id: "dsc-alarm",
        title: "Notalarm und Fehlalarm",
        lesson: "s6",
        paras: [
          "Ein DSC-Notalarm (Distress) darf nur ausgelöst werden, wenn eine unmittelbare Gefahr für Personen oder Fahrzeug besteht und Hilfe benötigt wird. Die rote Taste ist typischerweise gegen unbeabsichtigtes Auslösen gesichert (Abdeckung, langer Druck).",
          "Ein unbeabsichtigter Alarm muss unverzüglich aufgehoben und als Fehlalarm kenntlich gemacht werden: DSC-Cancel, soweit die Anlage das vorsieht, und eine entsprechende Sprechfunkdurchgabe auf Kanal 16, damit Rettungsleitstellen den Einsatz abbrechen können.",
        ],
        source: "SRC-Fragenkatalog; IAMSAR / GMDSS-Betriebsverfahren; ITU RR zum Notverkehr.",
      },
    ],
  },
  {
    id: "sprechfunk",
    title: "Sprechfunkverfahren",
    cert: "BOTH",
    teaser: "Rangfolge, Not, Dringlichkeit, Sicherheit und Routine",
    sections: [
      {
        id: "rangfolge",
        title: "Rangfolge und Funkdisziplin",
        lesson: "s5",
        paras: [
          "Die Rangfolge ist fest: Not vor Dringlichkeit vor Sicherheit vor Routine. Wer einen Funkspruch höherer Priorität hört, unterbricht den eigenen Verkehr. Funkstellen hören vor dem Senden, ob der Kanal frei ist.",
          "Kurz, klar und in der vorgesehenen Form sprechen. Keine überflüssigen Zeichen, kein Chat. Das Fernmeldegeheimnis gilt; Not-, Dringlichkeits- und Sicherheitsmeldungen dürfen und müssen aufgenommen werden, damit Hilfe organisiert werden kann.",
        ],
        source: "ITU-VO Funk zu Betriebsverfahren; SRC 85 / UBI 110 im Fragenkatalog; Sprechfunktafel.",
      },
      {
        id: "not",
        title: "Notverkehr (Mayday / Notmeldung)",
        lesson: "s7",
        paras: [
          "Eine Notmeldung steht an, wenn Personen oder Fahrzeug in ernster und unmittelbarer Gefahr sind und sofortige Hilfe benötigen. Im Seefunk lautet das Anrufwort MAYDAY (dreimal), gefolgt von This is, dem Namen (dreimal), dem Rufzeichen, der Position, der Art der Not, der gewünschten Hilfe und der Zahl der Personen an Bord; Abschluss typischerweise Over.",
          "Im Binnenschifffahrtsfunk heißt das entsprechende Verfahren Notmeldung (nicht das englische Mayday als Pflichtwort). Inhaltlich gehören dazu: Kennzeichnung als Notmeldung, Name, ATIS soweit üblich, Position (z. B. Wasserstraße und Kilometer, Ufer, Richtung zu Berg oder zu Tal), Art der Not, Hilfeersuchen, Personen an Bord.",
          "Eine aufgenommene Notmeldung, die die Küste oder andere Helfer nicht erreicht haben kann, wird als Mayday Relay bzw. als weitergeleitete Notmeldung abgegeben. Funkstille im Notverkehr wird im Seefunk mit SEELONCE MAYDAY angeordnet und mit SEELONCE FEENEE aufgehoben.",
        ],
        source: "ITU RR zum Notverkehr; IMO SMCP; Sprechfunktafel; Handbuch Binnenschifffahrtsfunk.",
      },
      {
        id: "dringlichkeit",
        title: "Dringlichkeit (Pan Pan)",
        lesson: "s8",
        paras: [
          "Dringlichkeit betrifft die Sicherheit eines Fahrzeugs, eines Luftfahrzeugs oder einer Person, ohne dass bereits eine unmittelbare Lebensgefahr im Sinne des Notfalls besteht – typisch sind Maschinenausfall mit Treiben, manövrierunfähig, medizinische Beratung oder Hilfe (Medico).",
          "Im Seefunk lautet das Anrufwort PAN PAN (dreimal), oft an all stations, danach Name, Rufzeichen, Position, Sachverhalt und Ersuchen. Im Binnenfunk: Dringlichkeitsmeldung mit vergleichbarem Inhalt auf Deutsch.",
        ],
        source: "ITU RR; IMO SMCP; Sprechfunktafel.",
      },
      {
        id: "sicherheit",
        title: "Sicherheit (Sécurité)",
        lesson: "s8",
        paras: [
          "Sicherheitsmeldungen betreffen die Sicherheit der Schifffahrt oder wichtige Wetter- und Warnnachrichten: treibende Gefahren, ausgefallene Feuer, Unwetter. Das Anrufwort im Seefunk ist SÉCURITÉ (dreimal), typischerweise an all stations, oft mit Abschluss Out, weil keine Antwort erwartet wird.",
          "Im Binnenfunk lautet das Verfahren Sicherheitsmeldung. Eine frühere Warnung kann aufgehoben werden, wenn die Gefahr beseitigt ist.",
        ],
        source: "ITU RR; IMO SMCP; Sprechfunktafel; Handbuch Binnenschifffahrtsfunk.",
      },
      {
        id: "routine",
        title: "Routineverkehr",
        lesson: "s9",
        paras: [
          "Routine ist der gewöhnliche Verkehr: Anruf einer konkreten Funkstelle, Wechsel auf den Arbeitskanal, kurze dienstliche oder nautische Absprache, im Binnenfunk etwa die Anmeldung an einer Schleuse oder eine Positionsmeldung an die Revierzentrale.",
          "Im Seefunk stehen gängige Verfahrenswörter fest: Over (Kommen, Antwort erwartet), Out (Ende, keine Antwort erwartet), Say again, I spell, Correction, Roger, Wilco, Stand by. Die IMO-SMCP bündelt standardisierte Wendungen für den Schiffs- und Funkbetrieb.",
        ],
        source: "IMO SMCP; ITU RR; Sprechfunktafel; Handbuch Binnenschifffahrtsfunk.",
      },
    ],
  },
  {
    id: "navtex",
    title: "NAVTEX, EPIRB und SART",
    cert: "SRC",
    teaser: "MSI-Empfang, Seenotfunkbake und Radartransponder",
    sections: [
      {
        id: "navtex",
        title: "NAVTEX",
        lesson: "s8",
        paras: [
          "NAVTEX ist ein telegrafisches System zur Übermittlung von Nachrichten für die Sicherheit der Seeschifffahrt (MSI) auf Mittelwelle, typischerweise 518 kHz in englischer Sprache. Die Sendungen sind nach Stationen und Meldungsarten (u. a. Navigationswarnungen, Wetter) gegliedert; der Empfänger kann nach Station und Typ filtern.",
          "NAVAREAs sind die weltweiten Gebiete für MSI. Für die europäischen Küsten sind die zuständigen NAVTEX-Stationen und Sendezeiten in den nautischen Veröffentlichungen angegeben.",
        ],
        source: "SRC-Fragenkatalog; IMO/IHO zu MSI und NAVTEX.",
      },
      {
        id: "epirb",
        title: "EPIRB",
        lesson: "s10",
        paras: [
          "Eine EPIRB (Emergency Position-Indicating Radio Beacon) ist eine Seenotfunkbake, die im Notfall auf 406 MHz (COSPAS-SARSAT) alarmiert und eine Position übermittelt. Sie muss registriert sein, damit die Leitstelle das Fahrzeug zuordnen kann.",
          "Die Bake wird so angebracht, dass sie bei einem Sinken selbsttätig aufschwimmen und senden kann (Hydrostatik), soweit die Bauart das vorsieht. Nach einem unbeabsichtigten Auslösen ist der Alarm unverzüglich über die zuständige Stelle zurückzunehmen.",
        ],
        source: "SRC-Fragenkatalog; COSPAS-SARSAT / GMDSS-Ausrüstungsregeln.",
      },
      {
        id: "sart",
        title: "SART und Handsprechfunk",
        lesson: "s10",
        paras: [
          "Ein SART (Search and Rescue Radar Transponder) antwortet auf Radarimpulse (typisch 9 GHz) und erzeugt auf dem Radarschirm des Suchfahrzeugs eine deutliche Zeichenkette, die zur Rettungsmittelposition führt.",
          "UKW-Handsprechfunkgeräte gehören zur typischen Notausrüstung: Sprechverbindung zur Rettungseinheit, oft mit Kanal 16. Batterie- und Ladezustand regelmäßig prüfen; Reservebatterien trocken und innerhalb der Haltbarkeit halten.",
        ],
        source: "SRC-Fragenkatalog; GMDSS-Ausrüstung / IAMSAR-Grundlagen.",
      },
    ],
  },
  {
    id: "binnen",
    title: "Binnen-Besonderheiten",
    cert: "UBI",
    teaser: "ATIS, Revierzentralen, NIF, zu Berg und zu Tal",
    sections: [
      {
        id: "atis",
        title: "ATIS",
        lesson: "u2",
        paras: [
          "ATIS (Automatic Transmitter Identification System) sendet nach jeder Aussendung automatisch eine Kennung der Funkstelle. Im Binnenschifffahrtsfunk ist ATIS vorgeschrieben; die Kennung wird aus der amtlichen Nummer gebildet und in der Anlage programmiert.",
          "Ohne korrekt programmiertes ATIS darf die Anlage im Binnenfunk nicht betrieben werden. Die Kennung erscheint bei anderen Stationen und bei den Revierzentralen als Identifizierung.",
        ],
        source: "BinSchSprFunkV; Regional Arrangement Basel 2000; UBI-Fragenkatalog; Handbuch Binnenschifffahrtsfunk.",
      },
      {
        id: "nif",
        title: "Nautischer Informationsfunk und Revierzentralen",
        lesson: "u7",
        paras: [
          "Der nautische Informationsfunk (NIF) verbindet die Schifffahrt mit den Revierzentralen der Wasserstraßen- und Schifffahrtsverwaltung. Über ihn laufen Verkehrsinformationen, Warnungen und – wo so organisiert – An- und Abmeldungen.",
          "Meldungen sind kurz und in der üblichen Form: Name der Zentrale, eigener Name, ATIS, Position (Wasserstraße, Kilometer, Uferseite, Fahrtrichtung zu Berg oder zu Tal), Anliegen.",
        ],
        source: "Handbuch für den Binnenschifffahrtsfunk; Veröffentlichungen der WSVen / Revierzentralen.",
      },
      {
        id: "position-binnen",
        title: "Positionsangabe Binnen",
        lesson: "u2",
        paras: [
          "Im Binnenfunk wird die Position typischerweise mit Wasserstraße und Kilometer angegeben, ergänzt um Uferseite (rechtes oder linkes Ufer) und Fahrtrichtung (zu Berg = stromauf, zu Tal = stromab) oder „Mitte des Fahrwassers“. Ortslagen können zusätzlich genannt und bei Bedarf buchstabiert werden.",
        ],
        source: "Sprechfunktafel; Handbuch Binnenschifffahrtsfunk; UBI-Fragenkatalog.",
      },
    ],
  },
  {
    id: "tafel",
    title: "Buchstabiertafel",
    cert: "BOTH",
    teaser: "Internationale Tafel, Ziffern und wann buchstabiert wird",
    sections: [
      {
        id: "icao",
        title: "Internationale Buchstabiertafel",
        lesson: "s5",
        paras: [
          "Im Seefunk und auch im Binnenschifffahrtsfunk gilt die internationale Buchstabiertafel (Alfa, Bravo, Charlie, … Zulu). Sie wird benutzt, sobald Namen, Rufzeichen, Orts- oder Fahrzeugbezeichnungen unmissverständlich übertragen werden müssen. Die Formel lautet I spell / ich buchstabiere.",
          "Ziffern werden im Sprechfunk einzeln gesprochen (zero, one, … nine bzw. null, eins, … neun). In Positionen steht decimal bzw. Komma für die Dezimalstelle der Minuten. Die ITU-Codewörter (Nadazero, Unaone, …) kommen in der Praxis vor; in dieser App sind sie über einen langen Druck auf der Tafel nachhörbar.",
        ],
        source: "ITU RR Appendix 14; Sprechfunktafel; IMO SMCP.",
      },
    ],
  },
  {
    id: "glossar",
    title: "Abkürzungen und Glossar",
    cert: "BOTH",
    teaser: "Die häufigsten Kürzel aus Katalog, SMCP und Betrieb",
    sections: [
      {
        id: "kuerzel",
        title: "Häufige Abkürzungen",
        paras: [
          "AIS – Automatisches Identifizierungssystem für Schiffe. ATIS – automatische Senderkennung im Binnenschifffahrtsfunk. DSC – Digital Selective Calling. EPIRB – Seenotfunkbake. ETA / ETD – voraussichtliche Ankunfts- bzw. Abfahrtszeit.",
          "GMDSS – weltweites Seenot- und Sicherheitsfunksystem. MMSI – numerische Kennung der Seefunkstelle. MSI – Nachricht zur Sicherheit der Seeschifffahrt. MRCC – Maritime Rescue Coordination Centre (Seenotleitung).",
          "NAVTEX – telegrafischer MSI-Dienst. NIF – nautischer Informationsfunk. NX – nautische Warnnachricht. SART – Radartransponder für die Suche. SRC / UBI / LRC / GOC / ROC – Funkzeugnisse. UTC – koordinierte Weltzeit. WX – Wetterbericht.",
        ],
        source: "SRC- und UBI-Fragenkataloge; IMO SMCP; ITU RR.",
      },
    ],
  },
  {
    id: "quellen",
    title: "Quellen",
    cert: "BOTH",
    teaser: "Amtliche Texte, auf die sich Kurs, Diktate und dieses Buch stützen",
    sections: [
      {
        id: "amtlich",
        title: "Amtliche und verbindliche Quellen",
        paras: [
          "ELWIS (elektronisches Wasserstraßen-Informationssystem) veröffentlicht die Durchführungsrichtlinien Funkbetriebszeugnisse, den SRC-Fragenkatalog und Hinweise zu den Sprechfunkzeugnissen.",
          "Die Bundesnetzagentur ist für Zuteilung, Rufzeichen und MMSI der Seefunkstellen zuständig. Die ABVT (WSV) veröffentlicht den UBI-Fragenkatalog, die Fragenverteilung und die Angaben zu Prüfungsablauf und Bestehensgrenzen.",
          "Rechtsgrundlagen des Binnenfunks sind insbesondere die Binnenschifffahrt-Sprechfunkverordnung (BinSchSprFunkV) und das Regionale Arrangement Basel 2000. Betriebsformen und Texte folgen der Sprechfunktafel und dem Handbuch für den Binnenschifffahrtsfunk.",
          "International: ITU Radio Regulations (VO Funk) zu Frequenzen und Betriebsverfahren; IMO Standard Marine Communication Phrases (SMCP) für standardisierte englische Wendungen.",
        ],
        source: "Siehe auch die Linkliste unter Nachschlagen & Werkzeuge → Quellen.",
      },
      {
        id: "hinweis-urheber",
        title: "Hinweis zu den Übungstexten",
        paras: [
          "Die Hördiktate, Vokabeln und Kapitel dieses Nachschlagebuchs sind für diese App formuliert. Sie folgen den genannten Verfahren, sind aber keine Abschrift der amtlichen 27 SRC-Seefunktexte, keiner ABVT-Mustertexte und keiner Inhalte Dritter.",
        ],
      },
    ],
  },
];

export function chaptersFor(cert: Cert): BookChapter[] {
  return HANDBOOK.filter((c) => c.cert === "BOTH" || c.cert === cert).map((c) => ({
    ...c,
    sections: c.sections.filter((s) => !s.certHint || s.certHint === cert),
  }));
}

export function chapterById(id: string, cert: Cert): BookChapter | undefined {
  return chaptersFor(cert).find((c) => c.id === id);
}

export function allIndex(cert: Cert): { chapterId: string; chapter: string; sectionId: string; title: string }[] {
  const out: { chapterId: string; chapter: string; sectionId: string; title: string }[] = [];
  for (const c of chaptersFor(cert)) {
    for (const s of c.sections) out.push({ chapterId: c.id, chapter: c.title, sectionId: s.id, title: s.title });
  }
  return out;
}

export function searchBook(cert: Cert, q: string): { chapterId: string; chapter: string; sectionId: string; title: string; snippet: string }[] {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];
  const hits: { chapterId: string; chapter: string; sectionId: string; title: string; snippet: string }[] = [];
  for (const c of chaptersFor(cert)) {
    for (const s of c.sections) {
      const blob = (s.title + " " + s.paras.join(" ") + " " + (s.source || "")).toLowerCase();
      if (c.title.toLowerCase().includes(needle) || blob.includes(needle)) {
        const idx = blob.indexOf(needle);
        const raw = (s.title + " — " + s.paras.join(" ")).replace(/\s+/g, " ");
        const from = Math.max(0, idx - 40);
        const snippet = (from > 0 ? "…" : "") + raw.slice(from, from + 140) + (raw.length > from + 140 ? "…" : "");
        hits.push({ chapterId: c.id, chapter: c.title, sectionId: s.id, title: s.title, snippet });
      }
    }
  }
  return hits;
}
