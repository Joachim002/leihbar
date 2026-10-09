"use server";

import { revalidatePath } from "next/cache";
import { createClient, supabaseKonfiguriert } from "@/lib/supabase/server";

export type AnfrageErgebnis = { ok: boolean; meldung?: string };

/** Anfrage stellen (`anfragen = true`) oder die eigene Anfrage zurückziehen (`false`). */
export async function anfrageUmschalten(itemId: string, anfragen: boolean): Promise<AnfrageErgebnis> {
  const nochmal = "Das hat leider nicht geklappt. Bitte versuch es gleich noch einmal.";
  if (!supabaseKonfiguriert) {
    return { ok: false, meldung: "Anfragen ist noch nicht eingerichtet. Es fehlen die Supabase-Zugangsdaten." };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const userId = auth?.claims?.sub;
  if (!userId) {
    return { ok: false, meldung: "Du bist nicht mehr angemeldet. Bitte melde dich an und versuch es noch einmal." };
  }

  if (anfragen) {
    const { error } = await supabase.from("requests").insert({ item_id: itemId, user_id: userId });
    // 23505: Es gibt die Anfrage schon (z. B. Doppelklick) – das Ziel ist erreicht.
    if (error && error.code !== "23505") {
      return {
        ok: false,
        meldung:
          error.code === "42501"
            ? "Deinen eigenen Gegenstand kannst du nicht anfragen."
            : nochmal,
      };
    }
  } else {
    const { error } = await supabase.from("requests").delete().eq("item_id", itemId).eq("user_id", userId);
    if (error) return { ok: false, meldung: nochmal };
  }

  revalidatePath(`/gegenstaende/${itemId}`);
  return { ok: true };
}
