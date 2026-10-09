// Anfragen aus der Supabase-Tabelle `requests` lesen.
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
