"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { kategorien } from "@/data/gegenstaende";
import { createClient, supabaseKonfiguriert } from "@/lib/supabase/server";

export type Eingaben = {
  titel: string;
  kategorie: string;
  beschreibung: string;
  ort: string;
  besitzer: string;
  preis: string;
};

export type Feld = keyof Eingaben;

/** Meldungen je Feld (ganze Sätze) plus die bisherigen Eingaben, damit nichts neu getippt werden muss. */
export type AnbietenZustand = {
  fehler: Partial<Record<Feld, string>>;
  meldung?: string;
  eingaben: Eingaben;
} | null;

export async function gegenstandAnbieten(
  _vorher: AnbietenZustand,
  formData: FormData,
): Promise<AnbietenZustand> {
  const text = (name: string) => String(formData.get(name) ?? "").trim();
  const eingaben: Eingaben = {
    titel: text("titel"),
    kategorie: text("kategorie"),
    beschreibung: text("beschreibung"),
    ort: text("ort"),
    besitzer: text("besitzer"),
    preis: text("preis"),
  };
  const fehler: Partial<Record<Feld, string>> = {};

  if (!eingaben.titel) fehler.titel = "Bitte gib einen Titel ein.";
  else if (eingaben.titel.length > 100) {
    fehler.titel = "Der Titel darf höchstens 100 Zeichen lang sein.";
  }
  if (!kategorien.some((kategorie) => kategorie === eingaben.kategorie)) {
    fehler.kategorie = "Bitte wähle eine Kategorie aus.";
  }
  if (!eingaben.beschreibung) fehler.beschreibung = "Bitte beschreibe den Gegenstand kurz.";
  else if (eingaben.beschreibung.length > 1000) {
    fehler.beschreibung = "Die Beschreibung darf höchstens 1000 Zeichen lang sein.";
  }
  if (!eingaben.ort) fehler.ort = "Bitte gib an, wo man den Gegenstand abholen kann.";
  else if (eingaben.ort.length > 100) fehler.ort = "Der Ort darf höchstens 100 Zeichen lang sein.";
  if (!eingaben.besitzer) fehler.besitzer = "Bitte gib deinen Namen ein.";
  else if (eingaben.besitzer.length > 60) {
    fehler.besitzer = "Dein Name darf höchstens 60 Zeichen lang sein.";
  }

  // Deutsche Schreibweise mit Komma („2,50“) erlauben.
  const preis = Number(eingaben.preis.replace(",", "."));
  if (!eingaben.preis || Number.isNaN(preis)) {
    fehler.preis = "Bitte gib den Preis pro Tag als Zahl ein. Für gratis schreib 0.";
  } else if (preis < 0) fehler.preis = "Der Preis darf nicht negativ sein. Für gratis schreib 0.";
  else if (preis > 9999) fehler.preis = "Der Preis pro Tag darf höchstens 9999 Euro betragen.";

  if (Object.keys(fehler).length > 0) {
    return { fehler, meldung: "Bitte prüfe die markierten Felder.", eingaben };
  }

  if (!supabaseKonfiguriert) {
    return {
      fehler: {},
      meldung: "Das Speichern ist noch nicht eingerichtet. Es fehlen die Supabase-Zugangsdaten.",
      eingaben,
    };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  const ownerId = auth?.claims?.sub;
  if (!ownerId) {
    return {
      fehler: {},
      meldung: "Du bist nicht mehr angemeldet. Bitte melde dich an und versuch es noch einmal.",
      eingaben,
    };
  }

  const { error } = await supabase.from("items").insert({
    owner_id: ownerId,
    titel: eingaben.titel,
    kategorie: eingaben.kategorie,
    beschreibung: eingaben.beschreibung,
    ort: eingaben.ort,
    besitzer_name: eingaben.besitzer,
    preis_pro_tag: Math.round(preis * 100) / 100,
  });
  if (error) {
    return {
      fehler: {},
      meldung: "Das Speichern hat leider nicht geklappt. Bitte versuch es gleich noch einmal.",
      eingaben,
    };
  }

  revalidatePath("/");
  redirect("/#gegenstaende");
}
