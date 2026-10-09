// Gegenstände aus der Supabase-Tabelle `items` lesen.
import { cache } from "react";
import type { Gegenstand, Kategorie } from "@/data/gegenstaende";
import { createClient, supabaseKonfiguriert } from "@/lib/supabase/server";

type Zeile = {
  id: string;
  titel: string;
  kategorie: string;
  beschreibung: string;
  besitzer_name: string;
  ort: string;
  preis_pro_tag: number | string;
  verfuegbar: boolean;
  bild_url: string | null;
};

function ausZeile(zeile: Zeile): Gegenstand {
  return {
    id: zeile.id,
    titel: zeile.titel,
    kategorie: zeile.kategorie as Kategorie,
    beschreibung: zeile.beschreibung,
    besitzer: zeile.besitzer_name,
    ort: zeile.ort,
    preisProTag: Number(zeile.preis_pro_tag),
    verfuegbar: zeile.verfuegbar,
    bild: zeile.bild_url,
  };
}

/** Alle gerade ausleihbaren Gegenstände, neueste zuerst. `null`, wenn die Datenbank nicht antwortet. */
export async function holeVerfuegbareGegenstaende(): Promise<Gegenstand[] | null> {
  if (!supabaseKonfiguriert) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("verfuegbar", true)
    .order("created_at", { ascending: false });
  if (error) return null;
  return data.map(ausZeile);
}

/** Mehrere Gegenstände anhand ihrer IDs (Reihenfolge nicht garantiert). `null`, wenn die Datenbank nicht antwortet. */
export async function holeGegenstaende(ids: string[]): Promise<Gegenstand[] | null> {
  if (!supabaseKonfiguriert) return null;
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from("items").select("*").in("id", ids);
  if (error) return null;
  return data.map(ausZeile);
}

const uuidMuster = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ein Gegenstand anhand seiner Adresse; `undefined`, wenn es ihn nicht gibt. */
export const holeGegenstand = cache(async (id: string): Promise<Gegenstand | undefined> => {
  // Eine erfundene Adresse wie „/gegenstaende/quatsch“ ist keine gültige ID und gar nicht erst eine Anfrage wert.
  if (!supabaseKonfiguriert || !uuidMuster.test(id)) return undefined;
  const supabase = await createClient();
  const { data } = await supabase.from("items").select("*").eq("id", id).maybeSingle();
  return data ? ausZeile(data) : undefined;
});
