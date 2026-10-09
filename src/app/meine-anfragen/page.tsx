import type { Metadata } from "next";
import Link from "next/link";
import Katalog from "@/components/Katalog";
import { holeMeineAnfragen } from "@/lib/anfragen";

export const metadata: Metadata = { title: "Meine Anfragen" };

// Der Schutz (Weiterleitung zur Anmeldung) liegt in src/proxy.ts.
export default async function MeineAnfragenSeite() {
  const anfragen = await holeMeineAnfragen();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
      <h1 className="mb-6 font-display text-4xl">Meine Anfragen</h1>
      {anfragen && anfragen.length > 0 ? (
        <Katalog
          ueberschrift="h2"
          eintraege={anfragen.map(({ gegenstand, status }) => ({ gegenstand, status }))}
        />
      ) : (
        <div className="border-y border-foreground py-10 text-center">
          <p className="mb-5 text-muted">
            {anfragen === null
              ? "Deine Anfragen lassen sich gerade nicht laden. Bitte versuch es gleich noch einmal."
              : "Du hast noch nichts angefragt. Stöbere in den Gegenständen und frag an, was du brauchst."}
          </p>
          <Link
            href="/#gegenstaende"
            className="inline-flex min-h-11 items-center bg-accent px-6 font-medium text-accent-ink transition hover:opacity-90"
          >
            Zur Liste
          </Link>
        </div>
      )}
    </main>
  );
}
