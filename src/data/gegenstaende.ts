// Kategorien und Form eines Gegenstands. Die Gegenstände selbst liegen in der
// Supabase-Tabelle `items` (Abfragen in src/lib/gegenstaende.ts).

export const kategorien = ["Mode", "Wohnen & Deko", "Technik", "Freizeit"] as const;
export type Kategorie = (typeof kategorien)[number];

export type Gegenstand = {
  id: string;
  titel: string;
  kategorie: Kategorie;
  beschreibung: string;
  besitzer: string;
  ort: string;
  preisProTag: number; // Euro pro Tag, 0 = gratis
  verfuegbar: boolean;
  bild: string | null; // Pfad unter public/, z. B. "/gegenstaende/abendkleid.jpg"; null = Platzhalter
};
