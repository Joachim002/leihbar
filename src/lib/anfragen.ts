// Anfragen aus der Supabase-Tabelle `requests` lesen.
import type { Gegenstand } from "@/data/gegenstaende";
import { holeGegenstaende } from "@/lib/gegenstaende";
import { createClient, supabaseKonfiguriert } from "@/lib/supabase/server";

export type AnfrageStand = {
  /** Wie viele Personen den Gegenstand angefragt haben. */
  anzahl: number;
  /** Hat die angemeldete Person ihn angefragt? */
  angefragt: boolean;
  /** Ist die Person angemeldet? */
  angemeldet: boolean;
  /** Gehört der Gegenstand der angemeldeten Person? */
  eigener: boolean;
};

export async function holeAnfrageStand(itemId: string): Promise<AnfrageStand> {
  const leer = { anzahl: 0, angefragt: false, angemeldet: false, eigener: false };
  if (!supabaseKonfiguriert) return leer;

  const supabase = await createClient();
  const [{ data: auth }, { count }] = await Promise.all([
    supabase.auth.getClaims(),
    supabase.from("requests").select("id", { count: "exact", head: true }).eq("item_id", itemId),
  ]);
  const userId = auth?.claims?.sub;
  if (!userId) return { ...leer, anzahl: count ?? 0 };

  const [{ count: eigene }, { data: gegenstand }] = await Promise.all([
    supabase
      .from("requests")
      .select("id", { count: "exact", head: true })
      .eq("item_id", itemId)
      .eq("user_id", userId),
    supabase.from("items").select("owner_id").eq("id", itemId).maybeSingle(),
  ]);

  return {
    anzahl: count ?? 0,
    angefragt: (eigene ?? 0) > 0,
    angemeldet: true,
    eigener: gegenstand?.owner_id === userId,
  };
}

/** Die Gegenstände, die die angemeldete Person angefragt hat, neueste Anfrage zuerst. `null`, wenn die Datenbank nicht antwortet. */
export async function holeMeineAnfragen(): Promise<Gegenstand[] | null> {
  if (!supabaseKonfiguriert) return null;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return [];

  const { data: anfragen, error } = await supabase
    .from("requests")
    .select("item_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return null;

  const gegenstaende = await holeGegenstaende(anfragen.map((anfrage) => anfrage.item_id));
  if (gegenstaende === null) return null;
  // Reihenfolge der Anfragen beibehalten; Gegenstände, die es nicht mehr gibt, entfallen.
  return anfragen
    .map((anfrage) => gegenstaende.find((gegenstand) => gegenstand.id === anfrage.item_id))
    .filter((gegenstand): gegenstand is Gegenstand => gegenstand !== undefined);
}
