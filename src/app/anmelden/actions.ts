"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, supabaseKonfiguriert } from "@/lib/supabase/server";

// `email` wird zurückgegeben, damit das Feld nach einem Fehler nicht leer wird.
export type FormZustand = { meldung: string; erfolg: boolean; email: string } | null;

const fehler = (meldung: string, email: string): FormZustand => ({ meldung, erfolg: false, email });

/** Supabase-Fehler in verständliche deutsche Sätze übersetzen. */
function fehlerText(code: string | undefined, status: number | undefined): string {
  switch (code) {
    case "invalid_credentials":
      return "E-Mail oder Passwort stimmt nicht. Bitte versuch es noch einmal.";
    case "email_not_confirmed":
      return "Bitte bestätige zuerst deine E-Mail-Adresse. Wir haben dir einen Link geschickt.";
    case "user_already_exists":
    case "email_exists":
      return "Mit dieser E-Mail gibt es schon ein Konto. Melde dich stattdessen an.";
    case "weak_password":
      return "Das Passwort ist zu schwach. Nimm mindestens 6 Zeichen.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Gerade gab es zu viele Versuche. Warte kurz und probier es dann noch einmal.";
    case "email_address_invalid":
    case "validation_failed":
      return "Diese E-Mail-Adresse sieht nicht richtig aus.";
  }
  return status && status >= 500
    ? "Gerade klappt es nicht. Bitte versuch es gleich noch einmal."
    : "Das hat leider nicht geklappt. Bitte prüfe deine Eingaben.";
}

export async function anmeldenOderRegistrieren(
  _vorher: FormZustand,
  formData: FormData,
): Promise<FormZustand> {
  const email = String(formData.get("email") ?? "").trim();
  const passwort = String(formData.get("passwort") ?? "");
  const aktion = formData.get("aktion");

  if (!supabaseKonfiguriert) {
    return fehler("Die Anmeldung ist noch nicht eingerichtet. Es fehlen die Supabase-Zugangsdaten.", email);
  }
  if (!email || !passwort) {
    return fehler("Bitte gib E-Mail und Passwort ein.", email);
  }

  const supabase = await createClient();

  if (aktion === "registrieren") {
    const { data, error } = await supabase.auth.signUp({ email, password: passwort });
    if (error) return fehler(fehlerText(error.code, error.status), email);
    // Ist die E-Mail-Bestätigung in Supabase an, gibt es noch keine Sitzung.
    if (!data.session) {
      return {
        meldung: "Fast geschafft: Wir haben dir eine E-Mail geschickt. Klick auf den Link darin und melde dich dann an.",
        erfolg: true,
        email,
      };
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({ email, password: passwort });
    if (error) return fehler(fehlerText(error.code, error.status), email);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function abmelden() {
  if (supabaseKonfiguriert) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}
