// Frischt bei jedem Seitenaufruf die Anmeldung auf und schickt Nicht-Angemeldete
// von geschützten Seiten zur Anmeldung.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const geschuetzt = ["/meine-anfragen"];

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  let antwort = NextResponse.next({ request });

  const istGeschuetzt = geschuetzt.some((pfad) => request.nextUrl.pathname.startsWith(pfad));

  if (!url || !key) {
    // Supabase ist nicht eingerichtet: geschützte Seiten bleiben zu.
    return istGeschuetzt ? zurAnmeldung(request) : antwort;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        antwort = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          antwort.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([name, wert]) => antwort.headers.set(name, wert));
      },
    },
  });

  // Zwischen createServerClient und getClaims darf kein anderer Code stehen,
  // sonst werden Leute zufällig abgemeldet.
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims && istGeschuetzt) {
    return zurAnmeldung(request);
  }

  return antwort;
}

function zurAnmeldung(request: NextRequest) {
  const ziel = request.nextUrl.clone();
  ziel.pathname = "/anmelden";
  ziel.search = "";
  return NextResponse.redirect(ziel);
}
