---
name: ndu-issue
description: Macht aus einem Satz ein Issue im Format von docs/BACKLOG.md und hängt es ans Backlog – z. B. /ndu-issue Besitzer*innen sollen Anfragen ablehnen können
---

Die Person nennt in einem Satz, was die App können soll (Argument von `/ndu-issue`). Fehlt der Satz, frag danach.

## Ablauf

1. Lies `docs/BACKLOG.md` (Aufbau, Tonfall, höchste Issue-Nummer) und `docs/PRODUKT.md`, falls vorhanden.
2. **Doppelungen prüfen:** Deckt ein bestehendes Issue den Wunsch schon ab (ganz oder teilweise), sag es und frag, ob es erweitert oder ein neues angelegt werden soll. Nichts schreiben, bevor das geklärt ist.
3. **Unklarheiten:** Ist der Satz so offen, dass Ziel oder Kriterien geraten wären, stell eine Rückfrage mit höchstens 2–3 Optionen. Sonst direkt formulieren.
4. **Formulieren** im Format der vorhandenen Issues, auf Deutsch, duzend, ohne Fachjargon:
   - Überschrift: `### ⬜ Issue <nächste Nummer> — <kurzer Titel>`
   - **Ziel:** 1–2 Sätze: was danach möglich ist, für wen, warum („damit …“).
   - **Nicht im Umfang:** was bewusst nicht dazugehört (naheliegende Erweiterungen).
   - **Akzeptanzkriterien:** 3–5 Punkte, jeder im Format „Gegeben … wenn … dann …“, im Browser prüfbar. Mindestens ein **Negativfall** (z. B. fehlende Berechtigung, leerer Zustand, Fehleingabe). Berührt das Issue Daten anderer Personen, gehört eine Berechtigungsprüfung dazu.
   - **Fertig, wenn:** eine Zeile, woran die Person es konkret prüft (mit welchem Testkonto, welche Schritte).
5. **Zeig den Entwurf** und warte auf ein Okay oder Änderungswünsche.
6. **Anhängen:** Nach dem Okay das Issue in `docs/BACKLOG.md` direkt **vor** der Überschrift `## Später / Ideen (nicht im MVP)` einfügen, unter eine passende bestehende `##`-Gruppe oder eine neue, z. B. `## Ergänzung — <Thema>`. Bestehende Issues nicht ändern.
7. **Frag am Ende:** „Soll das Issue priorisiert werden – also weiter nach oben im Backlog rücken, bevor andere drankommen?“ Nur nach ausdrücklichem Ja verschieben. Das Issue wird nicht umgesetzt und kein nächstes vorgeschlagen.

## Regeln

- Genau ein Issue pro Aufruf, klein genug für einen Durchgang. Ist der Wunsch größer, schlag vor, ihn in zwei Issues zu teilen.
- Keine Technik in Ziel und Kriterien (keine Tabellen-, Datei- oder Funktionsnamen), außer die Person nennt sie.
- Keine Emojis außer dem Status ⬜.
