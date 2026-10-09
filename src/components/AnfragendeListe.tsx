"use client";

import { useState, useTransition } from "react";
import { anfrageBeantworten } from "@/app/gegenstaende/[id]/actions";
import type { Anfragende } from "@/lib/anfragen";

type Props = {
  itemId: string;
  /** `null`, wenn die Liste nicht geladen werden konnte. */
  anfragende: Anfragende[] | null;
};

const knopf =
  "inline-flex min-h-11 items-center justify-center px-5 font-medium transition hover:opacity-90 disabled:opacity-70";

export default function AnfragendeListe({ itemId, anfragende }: Props) {
  const [laeuft, starte] = useTransition();
  const [meldung, setzeMeldung] = useState<string | null>(null);

  function antworte(anfrageId: string, status: "angenommen" | "abgelehnt") {
    setzeMeldung(null);
    starte(async () => {
      const ergebnis = await anfrageBeantworten(anfrageId, itemId, status);
      if (!ergebnis.ok) setzeMeldung(ergebnis.meldung ?? null);
    });
  }

  return (
    <section aria-labelledby="anfragende-titel" className="mt-10 border border-border bg-card p-5 sm:p-6">
      <h2 id="anfragende-titel" className="mb-3 font-display text-2xl font-bold">
        Angefragt von:
      </h2>
      {anfragende === null ? (
        <p className="text-muted">Die Anfragen lassen sich gerade nicht laden. Bitte versuch es gleich noch einmal.</p>
      ) : anfragende.length === 0 ? (
        <p className="text-muted">Noch hat niemand diesen Gegenstand angefragt.</p>
      ) : (
        <ul className="divide-y divide-border">
          {anfragende.map((person) => (
            <li key={person.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <a href={`mailto:${person.email}`} className="break-all font-medium underline-offset-4 hover:underline">
                  {person.email}
                </a>
                <p className="text-sm text-muted">
                  Status: <span className="font-medium text-foreground">{person.status}</span>
                </p>
              </div>
              <div className="flex gap-2">
                {person.status !== "angenommen" && (
                  <button
                    type="button"
                    disabled={laeuft}
                    onClick={() => antworte(person.id, "angenommen")}
                    className={`${knopf} bg-accent text-accent-ink`}
                  >
                    Annehmen
                  </button>
                )}
                {person.status !== "abgelehnt" && (
                  <button
                    type="button"
                    disabled={laeuft}
                    onClick={() => antworte(person.id, "abgelehnt")}
                    className={`${knopf} border border-border bg-accent-soft`}
                  >
                    Ablehnen
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {meldung && (
        <p role="alert" className="mt-3 text-sm text-error">
          {meldung}
        </p>
      )}
    </section>
  );
}
