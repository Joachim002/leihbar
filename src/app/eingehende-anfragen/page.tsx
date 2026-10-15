import type { Metadata } from "next";
import Link from "next/link";
import { holeEingegangeneAnfragen } from "@/lib/anfragen";

export const metadata: Metadata = { title: "Eingegangene Anfragen" };

// Der Schutz (Weiterleitung zur Anmeldung) liegt in src/proxy.ts.
export default async function EingegangeneAnfragenSeite() {
  const eintraege = await holeEingegangeneAnfragen();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
      <h1 className="mb-6 font-display text-4xl">Eingegangene Anfragen</h1>
      {eintraege && eintraege.length > 0 ? (
        <ul className="divide-y divide-border border-y border-foreground">
          {eintraege.map(({ gegenstand, anzahl }) => (
            <li key={gegenstand.id}>
              <article className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <h2 className="font-display text-2xl">{gegenstand.titel}</h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                  <p className="font-medium">
                    {anzahl === 1 ? "1 offene Anfrage" : `${anzahl} offene Anfragen`}
                  </p>
                  <Link
                    href={`/gegenstaende/${gegenstand.id}`}
                    className="inline-flex min-h-11 items-center bg-accent px-5 font-medium text-accent-ink transition hover:opacity-90"
                  >
                    Anfragen ansehen
                    <span className="sr-only"> für {gegenstand.titel}</span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-y border-foreground py-10 text-center">
          <p className="mb-5 text-muted">
            {eintraege === null
              ? "Die Anfragen lassen sich gerade nicht laden. Bitte versuch es gleich noch einmal."
              : "Zurzeit wartet keine Anfrage auf dich. Sobald jemand einen deiner Gegenstände anfragt, steht sie hier."}
          </p>
          <Link
            href="/anbieten"
            className="inline-flex min-h-11 items-center bg-accent px-6 font-medium text-accent-ink transition hover:opacity-90"
          >
            Etwas anbieten
          </Link>
        </div>
      )}
    </main>
  );
}
