// Supabase-Zugriff auf dem Server (Seiten und Aktionen). Der Publishable Key darf öffentlich sein.
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Ist Supabase in `.env.local` eingerichtet? Ohne Keys läuft die App weiter, nur ohne Anmeldung. */
export const supabaseKonfiguriert = Boolean(supabaseUrl && supabaseKey);

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Wird aus einer Seite aufgerufen, dort sind Cookies nur lesbar.
          // Das ist okay, weil proxy.ts die Anmeldung auffrischt.
        }
      },
    },
  });
}

/** E-Mail der angemeldeten Person oder `null`, wenn niemand angemeldet ist. */
export async function holeEmail(): Promise<string | null> {
  if (!supabaseKonfiguriert) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email;
  return typeof email === "string" ? email : null;
}
