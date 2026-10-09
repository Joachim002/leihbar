# Entscheidungen

> Hier hält Claude fest, was im Projekt festgelegt wurde, damit es in späteren Sessions noch gilt.
> Format: Datum — Entscheidung — Grund

- 2026-10-08 — Stack: Next.js + Tailwind + Supabase + Vercel — Kursvorgabe
- 2026-10-08 — Sprache der Oberfläche: Deutsch — Zielgruppe NDU-Studierende
- 2026-10-09 — Tabelle `items` (Supabase): jeder darf lesen, anlegen nur ohne `owner_id`; Ändern und Löschen sperrt Row Level Security — Issue 4. Mit dem Login (Issue 5) die Insert-Regel auf angemeldete Personen verschärfen.
- 2026-10-09 — Beispiel-Bilder bleiben in `public/gegenstaende/` (`bild_url` zeigt dorthin); neue Gegenstände haben kein Bild und zeigen einen Platzhalter — Bilder-Upload ist nicht im MVP
- 2026-10-09 — Tabelle `items`: anlegen dürfen nur Angemeldete, und `owner_id` muss ihre eigene Nutzer-ID sein (Row Level Security); `/anbieten` ist geschützt wie `/meine-anfragen` — Issue 5. Die 9 älteren Gegenstände haben keine `owner_id`.
