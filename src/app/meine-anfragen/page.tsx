import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import GegenstandKarte from "@/components/GegenstandKarte";
import { holeMeineAnfragen } from "@/lib/anfragen";

export const metadata: Metadata = { title: "Meine Anfragen" };

/** Position in der Einblend-Reihenfolge (siehe `.erscheinen` in globals.css). */
const reihenfolge = (nummer: number) => ({ "--i": nummer }) as CSSProperties;

// Der Schutz (Weiterleitung zur Anmeldung) liegt in src/proxy.ts.
export default async function MeineAnfragenSeite() {
  const anfragen = await holeMeineAnfragen();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
      <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight">Meine Anfragen</h1>
      {anfragen && anfragen.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {anfragen.map((gegenstand, index) => (
            <li
              key={gegenstand.id}
              className="erscheinen"
              style={reihenfolge(Math.min(index, 6))}
            >
              <GegenstandKarte gegenstand={gegenstand} ueberschrift="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center">
          <p className="mb-5 text-muted">
            {anfragen === null
              ? "Deine Anfragen lassen sich gerade nicht laden. Bitte versuch es gleich noch einmal."
              : "Du hast noch nichts angefragt. Stöbere in den Gegenständen und frag an, was du brauchst."}
          </p>
          <Link
            href="/#gegenstaende"
            className="inline-flex min-h-11 items-center rounded-full bg-accent px-6 font-medium text-white shadow-sm transition hover:opacity-90"
          >
            Zur Liste
          </Link>
        </div>
      )}
    </main>
  );
}
