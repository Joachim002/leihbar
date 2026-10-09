# Entscheidungen

> Hier hält Claude fest, was im Projekt festgelegt wurde, damit es in späteren Sessions noch gilt.
> Format: Datum — Entscheidung — Grund

- 2026-10-08 — Stack: Next.js + Tailwind + Supabase + Vercel — Kursvorgabe
- 2026-10-08 — Sprache der Oberfläche: Deutsch — Zielgruppe NDU-Studierende
- 2026-10-09 — Tabelle `items` (Supabase): jeder darf lesen, anlegen nur ohne `owner_id`; Ändern und Löschen sperrt Row Level Security — Issue 4. Mit dem Login (Issue 5) die Insert-Regel auf angemeldete Personen verschärfen.
- 2026-10-09 — Beispiel-Bilder bleiben in `public/gegenstaende/` (`bild_url` zeigt dorthin); neue Gegenstände haben kein Bild und zeigen einen Platzhalter — Bilder-Upload ist nicht im MVP
- 2026-10-09 — Tabelle `items`: anlegen dürfen nur Angemeldete, und `owner_id` muss ihre eigene Nutzer-ID sein (Row Level Security); `/anbieten` ist geschützt wie `/meine-anfragen` — Issue 5. Die 9 älteren Gegenstände haben keine `owner_id`.
- 2026-10-09 — Tabelle `requests` (Supabase): jeder darf lesen (nur Nutzer-ID, keine E-Mail), anlegen nur Angemeldete in eigenem Namen und nicht für den eigenen Gegenstand, löschen nur die eigene Anfrage, Ändern gesperrt; pro Person und Gegenstand höchstens eine Anfrage — Issue 6. Mit Issue 9 (Besitzer*innen sehen Anfragende) die Lese-Regel enger fassen.
- 2026-10-09 — Tabelle `requests`: lesen dürfen nur die anfragende Person und die Besitzer*in des Gegenstands (Row Level Security). Der Zähler kommt aus der Funktion `anfrage_anzahl` (für alle, ohne Personen); die E-Mail-Adressen aus `anfragende_emails` (nur Besitzer*innen, nicht für Nicht-Angemeldete) — Issue 9. Die 9 älteren Gegenstände ohne `owner_id` zeigen niemandem eine Liste.
- 2026-10-09 — Tabelle `requests`: neue Spalte `status` (`offen`/`angenommen`/`abgelehnt`, Standard `offen`). Ändern darf nur die Besitzer*in des Gegenstands und nur diese Spalte (Row Level Security + Spaltenrecht); `anfragende_emails` liefert zusätzlich `id` und `status` und ist nur für Angemeldete aufrufbar — Issue 11
