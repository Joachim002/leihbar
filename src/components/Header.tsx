import Link from "next/link";
import { abmelden } from "@/app/anmelden/actions";
import { holeEmail } from "@/lib/supabase/server";

export default async function Header() {
  const email = await holeEmail();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-display font-bold">
          <span className="inline-block h-3 w-3 rounded-full bg-accent" />
          Leihbar
        </Link>
        <nav aria-label="Hauptnavigation" className="flex items-center gap-4 text-sm text-muted">
          <Link
            href="/#gegenstaende"
            className="hidden min-h-11 items-center hover:text-foreground sm:flex"
          >
            Gegenstände
          </Link>
          <Link
            href="/anbieten"
            className="flex min-h-11 items-center rounded-lg px-2 font-medium text-foreground hover:bg-accent-soft"
          >
            Anbieten
          </Link>
          {email ? (
            <>
              <span className="max-w-[8rem] truncate sm:max-w-[16rem]" title={email}>
                <span className="sr-only">Angemeldet als </span>
                {email}
              </span>
              <form action={abmelden}>
                <button
                  type="submit"
                  className="min-h-11 rounded-lg px-2 font-medium text-foreground hover:bg-accent-soft"
                >
                  Abmelden
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/anmelden"
              className="flex min-h-11 items-center rounded-lg px-2 font-medium text-foreground hover:bg-accent-soft"
            >
              Anmelden
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
