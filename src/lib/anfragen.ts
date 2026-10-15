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
  // Den Zähler liefert eine Funktion, weil fremde Anfragen selbst nicht lesbar sind.
  const [{ data: auth }, { data: anzahl }] = await Promise.all([
    supabase.auth.getClaims(),
    supabase.rpc("anfrage_anzahl", { p_item_id: itemId }),
  ]);
  const userId = auth?.claims?.sub;
  if (!userId) return { ...leer, anzahl: anzahl ?? 0 };

  const [{ count: eigene }, { data: gegenstand }] = await Promise.all([
    supabase
      .from("requests")
      .select("id", { count: "exact", head: true })
      .eq("item_id", itemId)
      .eq("user_id", userId),
    supabase.from("items").select("owner_id").eq("id", itemId).maybeSingle(),
  ]);

  return {
    anzahl: anzahl ?? 0,
    angefragt: (eigene ?? 0) > 0,
    angemeldet: true,
    eigener: gegenstand?.owner_id === userId,
  };
}

export type AnfrageStatus = "offen" | "angenommen" | "abgelehnt";

export type MeineAnfrage = { gegenstand: Gegenstand; status: AnfrageStatus };

/** Die Gegenstände, die die angemeldete Person angefragt hat, mit Status, neueste Anfrage zuerst. `null`, wenn die Datenbank nicht antwortet. */
export async function holeMeineAnfragen(): Promise<MeineAnfrage[] | null> {
  if (!supabaseKonfiguriert) return null;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) return [];

  const { data: anfragen, error } = await supabase
    .from("requests")
    .select("item_id, status")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return null;

  const gegenstaende = await holeGegenstaende(anfragen.map((anfrage) => anfrage.item_id));
  if (gegenstaende === null) return null;
  // Reihenfolge der Anfragen beibehalten; Gegenstände, die es nicht mehr gibt, entfallen.
  return anfragen.flatMap((anfrage) => {
    const gegenstand = gegenstaende.find((g) => g.id === anfrage.item_id);
    return gegenstand ? [{ gegenstand, status: anfrage.status as AnfrageStatus }] : [];
  });
}

export type Anfragende = { id: string; email: string; angefragtAm: string; status: AnfrageStatus };

/** Wer den Gegenstand angefragt hat, neueste zuerst. Nur Besitzer*innen bekommen Adressen; sonst und bei Fehlern `null`. */
export async function holeAnfragende(itemId: string): Promise<Anfragende[] | null> {
  if (!supabaseKonfiguriert) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("anfragende_emails", { p_item_id: itemId });
  if (error) return null;
  return (data ?? []).map((zeile: { id: string; email: string; angefragt_am: string; status: AnfrageStatus }) => ({
    id: zeile.id,
    email: zeile.email,
    angefragtAm: zeile.angefragt_am,
    status: zeile.status,
  }));
}

/** Offene Anfragen auf meine Gegenstände, je Gegenstand gezählt. `null`, wenn die Datenbank nicht antwortet; leer, wenn niemand angemeldet ist. */
async function offeneAnfragenJeGegenstand(): Promise<Map<string, number> | null> {
  if (!supabaseKonfiguriert) return null;
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  const zaehler = new Map<string, number>();
  if (!userId) return zaehler;

  // Erst meine Gegenstände, dann nur deren offene Anfragen – meine eigenen Anfragen an andere zählen so nicht mit.
  const { data: meine, error: fehlerItems } = await supabase.from("items").select("id").eq("owner_id", userId);
  if (fehlerItems) return null;
  if (meine.length === 0) return zaehler;

  const { data: offene, error } = await supabase
    .from("requests")
    .select("item_id")
    .in("item_id", meine.map((zeile) => zeile.id))
    .eq("status", "offen");
  if (error) return null;
  for (const { item_id } of offene) zaehler.set(item_id, (zaehler.get(item_id) ?? 0) + 1);
  return zaehler;
}

/** Wie viele offene Anfragen auf meine Gegenstände warten (für den Header). `null`, wenn die Datenbank nicht antwortet. */
export async function holeOffeneAnfragenZahl(): Promise<number | null> {
  const zaehler = await offeneAnfragenJeGegenstand();
  if (!zaehler) return null;
  return [...zaehler.values()].reduce((summe, anzahl) => summe + anzahl, 0);
}

export type EingegangeneAnfragen = { gegenstand: Gegenstand; anzahl: number };

/** Meine Gegenstände mit offenen Anfragen, die meisten zuerst. `null`, wenn die Datenbank nicht antwortet. */
export async function holeEingegangeneAnfragen(): Promise<EingegangeneAnfragen[] | null> {
  const zaehler = await offeneAnfragenJeGegenstand();
  if (!zaehler) return null;
  const gegenstaende = await holeGegenstaende([...zaehler.keys()]);
  if (!gegenstaende) return null;
  return gegenstaende
    .map((gegenstand) => ({ gegenstand, anzahl: zaehler.get(gegenstand.id) ?? 0 }))
    .sort((a, b) => b.anzahl - a.anzahl);
}
